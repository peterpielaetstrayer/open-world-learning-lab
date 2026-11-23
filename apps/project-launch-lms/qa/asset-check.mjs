import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const origin = "http://127.0.0.1:3000";
const local = "http://127.0.0.1:54321";
const env = JSON.parse(readFileSync(process.env.PLL_ASSET_STATUS, "utf8"));
assert.equal(env.API_URL, local);
const admin = createClient(local, env.SERVICE_ROLE_KEY ?? env.SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { chromium } = await import(process.env.PLL_QA_PLAYWRIGHT);
const sql = text => execFileSync("docker", ["exec", "-i", "supabase_db_pll-asset-check",
  "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: text, encoding: "utf8" }).trim();
const id = sql("select id from public.pll_courses where slug='project-launch-lab';");
assert.match(id, /^[0-9a-f-]{36}$/);
const course = origin + "/studio?course=" + id;
const routes = [
  "/media/overview.mp4", "/media/overview.vtt", "/media/direction.mp4", "/media/direction.vtt",
  "/media/firstmove.mp4", "/media/firstmove.vtt", "/media/first-move-count-in.wav",
  "/resources/project-launch-worksheets.txt",
];
const browser = await chromium.launch();
async function setup(name, enrolled) {
  const email = name + "@example.test";
  const password = randomBytes(24).toString("hex");
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  assert.equal(error?.code, undefined, "synthetic createUser");
  const uid = data.user.id;
  assert.match(uid, /^[0-9a-f-]{36}$/);
  if (enrolled) sql("insert into public.pll_memberships(course_id,user_id,member_role) values ('" +
    id + "','" + uid + "','facilitator');");
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(origin + "/login");
  await page.getByLabel("Email",{exact:true}).fill(email);
  await page.getByLabel("Password",{exact:true}).fill(password);
  await page.getByRole("button",{name:"Sign in",exact:true}).click();
  await page.waitForURL("**/courses");
  return { context, page };
}
async function asset(context,path,status,range) {
  const res = await context.request.get(origin + path, { headers: range ? {Range:"bytes=0-63"} : {} });
  assert.equal(res.status(), status, path + (range ? " range" : ""));
  assert.match(res.headers()["cache-control"] ?? "", /\bno-store\b/, path + " cache");
  if (status >= 400) assert.equal((await res.body()).length, 0, path + " denied body");
  if (status === 206) {
    assert.match(res.headers()["content-range"] ?? "", /^bytes 0-63\//);
    assert.equal((await res.body()).length, 64);
  }
  await res.dispose();
}
try {
  const anon = await browser.newContext();
  const signedOut = await anon.newPage();
  await signedOut.goto(course);
  await signedOut.getByRole("heading",{name:"Welcome back."}).waitFor();
  for (const path of routes) await asset(anon,path,401,path.endsWith(".mp4"));
  const cb = await anon.request.get(origin + "/auth/callback?next=https%3A%2F%2Fexample.test",{maxRedirects:0});
  const redirect = new URL(cb.headers().location);
  assert.ok(["http://localhost:3000", origin].includes(redirect.origin), "callback stays on the local app");
  assert.equal(redirect.pathname + redirect.search, "/login?error=missing-code");
  console.log("PASS: signed-out denial, no-store, and local callback");
  const outsider = await setup("asset-outsider",false);
  await outsider.page.goto(course);
  await outsider.page.getByRole("heading",{name:"Course access unavailable"}).waitFor();
  for (const path of routes) await asset(outsider.context,path,404,path.endsWith(".mp4"));
  console.log("PASS: authenticated nonmember denied every asset and course page");
  const member = await setup("asset-member",true);
  await member.page.goto(course);
  await member.page.getByRole("navigation",{name:"Course navigation"}).waitFor();
  for (const path of routes) await asset(member.context,path,path.endsWith(".mp4")?206:200,path.endsWith(".mp4"));
  await member.page.reload();
  await member.page.getByRole("navigation",{name:"Course navigation"}).waitFor();
  for (const path of routes) await asset(anon,path,401,path.endsWith(".mp4"));
  console.log("PASS: enrolled access, media ranges, session reload, and signed-out cache isolation");
} finally {
  await browser.close();
}
