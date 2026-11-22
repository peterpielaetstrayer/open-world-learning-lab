import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const origin = "http://127.0.0.1:3000";
const db = "http://127.0.0.1:54321";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== db) throw new Error("Expected the local test API.");
const { chromium } = await import(pathToFileURL(process.env.PLL_QA_PLAYWRIGHT).href);
const scratch = process.env.PLL_QA_SCRATCH;
const { identities, courseId, quiz } = JSON.parse(readFileSync(join(scratch, "accounts.json")));
const url = origin + "/studio?course=" + courseId;
const browser = await chromium.launch();
const pages = {};
let stage = "authentication";

function section(page, name) {
  return page.getByRole("navigation", {name: "Course navigation"}).getByRole("button", {name, exact: true}).click();
}
function outline(page) {
  return page.getByRole("navigation", {name: "Module lessons"});
}
const response = page => page.locator("#learner-response");
async function lesson(page, title) {
  await section(page, "Modules");
  await outline(page).getByRole("button", {name: title}).click();
  await page.getByRole("region", {name: "Lesson content"}).waitFor();
}
async function runStep(name, action) {
  stage = name;
  await action();
  console.log("PASS: " + name);
}
async function open(page) {
  await page.goto(url);
  await page.getByRole("navigation", {name:"Course navigation"}).waitFor();
}
async function save(page, text) {
  await response(page).fill(text);
  await page.getByRole("button", {name:"Save draft", exact:true}).click();
  await page.getByText("Your draft was saved.", {exact:true}).waitFor();
}
async function submit(page, text, graded = false) {
  await response(page).fill(text);
  await page.getByRole("button", {name:graded ? "Submit final response" : "Share with facilitator (final)",exact:true}).click();
  await page.getByText(/^Submitted /).waitFor();
}
function release(name) {
  const sql = readFileSync(join("supabase", "release", name));
  execFileSync("docker", ["exec","-i","supabase_db_pll-acceptance","psql","-X","-U","postgres","-d","postgres","-v","ON_ERROR_STOP=1"],
    {input: sql, stdio:["pipe","pipe","pipe"]});
}
async function review(page, title, summary, marks = [], portfolio = false) {
  await open(page);
  await section(page, "Review submissions");
  const picker = page.getByLabel("Submission to review");
  await picker.getByRole("option", {name:title}).waitFor({state:"attached"});
  const options = await picker.locator("option").all();
  for (const option of options) {
    if (title.test(await option.innerText())) {
      await picker.selectOption(await option.getAttribute("value"));
      break;
    }
  }
  const label = marks.length ? "Overall feedback" : "Formative feedback";
  await page.getByLabel(label, {exact:true}).fill(summary);
  const fields = await page.locator("[id^='score-']").all();
  assert.equal(fields.length, marks.length);
  for (const [index, control] of fields.entries()) {
    if (portfolio) await control.selectOption(String(marks[index]));
    else await control.fill(String(marks[index]));
  }
  await page.getByRole("button", {name:marks.length ? "Publish complete review" : "Publish formative feedback",exact:true}).click();
  await page.getByText(/^Review last published /).waitFor();
}
try {
  await runStep("Three independent sign-ins through the LMS", async () => {
    for (const [name, account] of Object.entries(identities)) {
      const context = await browser.newContext();
      await context.route("**/*", route => {
        const host = new URL(route.request().url()).origin;
        return host === origin || host === db ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      pages[name] = page;
      page.on("dialog", dialog => dialog.type() === "confirm" ? dialog.accept() : dialog.dismiss());
      await page.goto(origin + "/login");
      await page.getByLabel("Email", {exact:true}).fill(account.email);
      await page.getByLabel("Password", {exact:true}).fill(account.password);
      await page.getByRole("button", {name:"Sign in",exact:true}).click();
      await page.waitForURL("**/courses");
      await open(page);
    }
  });
  const a = pages["learner-a"], b = pages["learner-b"], teacher = pages.facilitator;
  await runStep("Only four activities visible and Portfolio blocks final while held", async () => {
    await lesson(a, /^Launch Portfolio/);
    assert.equal(await outline(a).getByRole("button").count(), 4);
    assert.equal(await a.getByRole("button",{name:"Submit final response",exact:true}).isDisabled(), true);
    await save(a, "Synthetic Portfolio draft before release.");
  });
  await runStep("Activity publication leaves the Portfolio on hold", async () => {
    release("publish_reviewed_activities.sql");
    await open(a);
    await lesson(a, /^Launch Portfolio/);
    assert.equal(await outline(a).getByRole("button").count(), 18);
    assert.equal(await a.getByRole("button",{name:"Submit final response",exact:true}).isDisabled(), true);
    release("open_portfolio_grading.sql");
    await open(a);
    await lesson(a, /^Launch Portfolio/);
    assert.equal(await response(a).inputValue(), "Synthetic Portfolio draft before release.");
    assert.equal(await a.getByRole("button",{name:"Submit final response",exact:true}).isEnabled(), true);
  });
  await runStep("All 18 activities accessible in learner sequence", async () => {
    await section(a,"Modules");
    const buttons = outline(a).getByRole("button");
    assert.equal(await buttons.count(), 18);
    for (let i = 0; i < 18; i++) {
      await buttons.nth(i).click();
      assert.ok((await a.getByRole("region",{name:"Lesson content"}).innerText()).length > 100);
    }
  });
  const m1Draft = "Synthetic private comparison: two projects for a neighborhood seed-swap.";
  const m1Feedback = "Compare the two directions using the time available after school.";
  const m2Feedback = "Revise the first test to ask one adult to interpret the sign without prompting.";
  await runStep("Module 1 draft persists and remains private", async () => {
    await lesson(a,/^Compare Two Directions/);
    await save(a,m1Draft);
    await open(a); await lesson(a,/^Compare Two Directions/);
    assert.equal(await response(a).inputValue(),m1Draft);
    await open(b); await lesson(b,/^Compare Two Directions/);
    assert.equal(await response(b).inputValue(),"");
    assert.equal(await b.getByRole("button",{name:"Review submissions",exact:true}).count(),0);
    await submit(a,m1Draft + " The library sign is the most manageable direction.");
    await review(teacher,/^Compare Two Directions/,m1Feedback);
    await open(a); await lesson(a,/^Compare Two Directions/);
    await a.getByText(m1Feedback,{exact:true}).waitFor();
  });
  await runStep("Direction Brief submission and 30-point feedback", async () => {
    await lesson(a,/^Project Direction Brief/);
    await submit(a,"I chose the seed-swap sign because I can test it during one library visit.",true);
    const note = "The direction and constraint are explicit. Next, define one observable result.";
    await review(teacher,/^Project Direction Brief/,note,[10,10,10]);
    await open(a); await section(a,"Feedback");
    await a.getByText(note,{exact:true}).waitFor();
    await a.getByText(/30\s*\/\s*30 points/).waitFor();
  });
  await runStep("Module 2 First Move Card, facilitator feedback, revision and evidence", async () => {
    await lesson(a,/^Create — First Move Card/);
    const draft = "Draft: make a sample sign, ask a reader, and record one ambiguous phrase.";
    await save(a,draft);
    await open(a); await lesson(a,/^Create — First Move Card/);
    assert.equal(await response(a).inputValue(),draft);
    await submit(a,draft + " I have permission from the librarian.");
    await review(teacher,/^Create — First Move Card/,m2Feedback);
    await open(a); await lesson(a,/^Create — First Move Card/);
    await a.getByText(m2Feedback,{exact:true}).waitFor();
    await lesson(a,/^Respond — Feedback and Revision/);
    await submit(a,"I revised the instructions to let the reader interpret the sign without prompting.");
    await lesson(a,/^Act or Document a Real Barrier/);
    await submit(a,"One adult read the sign and identified the drop-off time. One reader cannot show wider comprehension.");
  });
  const portfolioNote = "The four criteria are demonstrated. Repeat the unprompted read with a second adult.";
  await runStep("Final Portfolio submission, four 15-point scores and readback", async () => {
    await lesson(a,/^Launch Portfolio/);
    await submit(a,"Purpose: library seed-swap. Milestones: draft, test, revise. Constraint: one library visit. Action: one safe adult read. Evidence: an accurate time readback. I revised the test after feedback. Next: repeat with another adult.",true);
    await review(teacher,/^Launch Portfolio/,portfolioNote,[15,15,15,15],true);
    await open(a); await section(a,"Feedback");
    await a.getByText(portfolioNote,{exact:true}).waitFor();
    await a.getByText(/60\s*\/\s*60 points/).waitFor();
    await a.screenshot({path:join(scratch,"portfolio-readback.png")});
    await open(b); await section(b,"Feedback");
    assert.equal(await b.getByText(portfolioNote,{exact:true}).count(),0);
    assert.equal(await b.getByText(m1Feedback,{exact:true}).count(),0);
    await lesson(b,/^Launch Portfolio/);
    assert.equal(await response(b).inputValue(),"");
  });
  await runStep("Quiz scoring, explanatory feedback and readback", async () => {
    await section(a,"Quiz");
    const items = a.locator("fieldset");
    await items.last().waitFor();
    assert.equal(await items.count(),10);
    for (let i=0; i<10; i++) await items.nth(i).getByRole("radio").nth(quiz[i]-1).check();
    await a.getByRole("button",{name:"Submit quiz",exact:true}).click();
    await a.getByText("Your score: 10 / 10",{exact:true}).waitFor();
    assert.equal(await a.getByText("Correct.",{exact:true}).count(),10);
    await open(a); await section(a,"Quiz");
    await a.getByText("Your score: 10 / 10",{exact:true}).waitFor();
    await section(b,"Quiz");
    await b.getByRole("button",{name:"Submit quiz",exact:true}).waitFor();
  });
  await runStep("Evaluation receipt persists and is visible only to facilitator", async () => {
    const comment = "Synthetic evaluation: the worksheet helped me narrow my first step.";
    await section(a,"Evaluation");
    const ratings = a.locator("select[id^='rating-']");
    await ratings.last().waitFor();
    assert.equal(await ratings.count(),10);
    for (const rating of await ratings.all()) await rating.selectOption("4");
    await a.locator("#evaluation-comments").fill(comment);
    await a.getByRole("button",{name:"Submit evaluation",exact:true}).click();
    await a.getByText(/Your evaluation was submitted/).waitFor();
    await open(a); await section(a,"Evaluation");
    await a.getByText(/Your evaluation was submitted/).waitFor();
    await open(teacher); await section(teacher,"Evaluation");
    await teacher.getByText(comment,{exact:true}).waitFor();
    await section(b,"Evaluation");
    await b.getByRole("button",{name:"Submit evaluation",exact:true}).waitFor();
    assert.equal(await b.getByText(comment,{exact:true}).count(),0);
  });
  await runStep("Both enrolled discussion spaces persist threads and facilitator replies", async () => {
    for (const channel of ["questions","peer-feedback"]) {
      const post = "Synthetic adult test post in " + channel;
      const reply = "Synthetic facilitator reply in " + channel;
      await section(a,"Discussions");
      await a.getByLabel("Forum",{exact:true}).selectOption(channel);
      await a.getByLabel("Write a post",{exact:true}).fill(post);
      await a.getByRole("button",{name:"Post",exact:true}).click();
      await a.getByText(post,{exact:true}).waitFor();
      await open(teacher); await section(teacher,"Discussions");
      await teacher.getByLabel("Forum",{exact:true}).selectOption(channel);
      await teacher.getByText(post,{exact:true}).waitFor();
      await teacher.getByRole("button",{name:"Reply",exact:true}).click();
      await teacher.getByLabel("Write a reply",{exact:true}).fill(reply);
      await teacher.getByRole("button",{name:"Post reply",exact:true}).click();
      await section(b,"Discussions");
      await b.getByLabel("Forum",{exact:true}).selectOption(channel);
      await b.getByText(reply,{exact:true}).waitFor();
    }
  });
} catch (error) {
  console.error("FAIL: " + stage);
  console.error(error.stack);
  for (const [name,page] of Object.entries(pages)) {
    if (!page.url().includes("/login")) {
      await page.screenshot({path:join(scratch,name+"-failure.png")}).catch(() => {});
    }
  }
  process.exitCode = 1;
} finally {
  await browser.close();
}
