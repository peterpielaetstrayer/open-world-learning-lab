/**
 * Project Launch Lab — synthetic user/auth/RLS integration smoke test.
 * Not run in normal CI. Requires explicit guard + local/Vercel server-only key.
 * Creates ONLY synthetic users and deletes them in finally.
 *
 * Run only against the dedicated staging/demo Supabase project and while no
 * external evaluator is using the course. Requires M1 practice and brief to
 * be published already; this script never changes course publication flags.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";

const expectedRef = "wjormscrikzocelbjxvc";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const confirmRef = process.env.PLL_CONFIRM_TEST_PROJECT_REF;

if (process.env.PLL_ALLOW_SYNTHETIC_ROLE_TEST !== "yes" ||
    confirmRef !== expectedRef ||
    ![`https://${expectedRef}.supabase.co`, `https://${expectedRef}.supabase.co/`].includes(url) ||
    !publishableKey || !serviceKey) {
  throw new Error("Role test refused: requires explicit project confirmation, enabled flag, publishable key and server-only service key.");
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const ids = [];
const sessions = [];
const expectedCourseId = "99dc9de5-bfbf-4891-8f5e-444212ec2073";
const tag = randomUUID().slice(0, 12);
const courseSlug = "project-launch-lab";
let cleanupFailed = false;

function expect(ok, text) {
  if (!ok) throw new Error("TEST FAILED: " + text);
  console.log("PASS: " + text);
}
function assertNoError(result, label) {
  if (result.error) throw new Error(label + ": " + result.error.message);
  return result.data;
}
async function makeClient(role) {
  const email = `pll-qa-${role}-${tag}@example.com`;
  const password = randomBytes(28).toString("base64url");
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) throw new Error("Could not create synthetic Auth user for " + role);
  const user = created.data.user;
  ids.push(user.id);
  const login = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  sessions.push(login);
  const signedIn = await login.auth.signInWithPassword({ email, password });
  assertNoError(signedIn, "Auth sign-in " + role);
  expect(signedIn.data.user?.id === user.id, role + " signed in to correct account");
  return { login, user };
}

try {
  const course = assertNoError(
    await admin.from("pll_courses").select("id").eq("slug", courseSlug).single(),
    "Find dedicated course"
  );
  expect(course.id === expectedCourseId, "Exact intended course identity confirmed");
  const courseModule = assertNoError(
    await admin.from("pll_modules").select("id,is_published").eq("course_id", course.id)
      .eq("module_number", 1).single(),
    "Find module"
  );
  const activity = assertNoError(
    await admin.from("pll_activities")
      .select("id,course_id,module_id,is_published")
      .eq("course_id", course.id).eq("slug", "project-direction-brief").single(),
    "Find draft assignment"
  );
  const practiceActivity = assertNoError(
    await admin.from("pll_activities")
      .select("id,course_id,module_id,is_published")
      .eq("course_id", course.id).eq("slug", "gauntlet-practice").single(),
    "Find ungraded practice"
  );
  expect(courseModule.is_published && activity.is_published && practiceActivity.is_published,
    "Both M1 test activities and their module must be published before role testing");

  const alice = await makeClient("learner-a");
  const bob = await makeClient("learner-b");
  const facilitator = await makeClient("facilitator");

  assertNoError(await admin.from("pll_memberships").insert([
    { course_id: course.id, user_id: alice.user.id, member_role: "learner" },
    { course_id: course.id, user_id: bob.user.id, member_role: "learner" },
    { course_id: course.id, user_id: facilitator.user.id, member_role: "facilitator" },
  ]), "Enroll synthetic accounts");

  const draft = assertNoError(await alice.login.from("pll_drafts").insert({
    course_id: course.id,
    activity_id: activity.id,
    learner_id: alice.user.id,
    response_text: "A small project relevant to local school needs. Feasible within two weeks."
  }).select("id,response_text").single(), "Learner A draft insert");
  expect(Boolean(draft?.id), "Learner A draft persisted");

  const otherDrafts = assertNoError(await bob.login.from("pll_drafts")
    .select("id").eq("learner_id", alice.user.id), "Learner B read query");
  expect(otherDrafts.length === 0, "Learner B cannot read learner A's private draft");

  const fake = await bob.login.from("pll_submissions").insert({
    course_id: course.id,
    activity_id: activity.id,
    learner_id: alice.user.id,
    response_text: "Forged submission"
  });
  expect(Boolean(fake.error), "Learner B cannot forge learner A's submission");

  const submission = assertNoError(await alice.login.from("pll_submissions").insert({
    course_id: course.id,
    activity_id: activity.id,
    learner_id: alice.user.id,
    response_text: "I will conduct a permission-based observation and revise my project scope."
  }).select("id").single(), "Learner A submit");
  expect(Boolean(submission?.id), "Final submission persisted");

  // A denied PostgREST UPDATE can return either an RLS/permission error
  // or a successful HTTP response that affected zero rows. Check both cases,
  // then re-read the record to prove that the response was not altered.
  const illicitChange = await alice.login.from("pll_submissions")
    .update({response_text:"Edited after submission"}).eq("id", submission.id)
    .select("id");
  expect(Boolean(illicitChange.error) || (illicitChange.data ?? []).length === 0,
    "Learner cannot update an immutable final submission");
  const unchanged = assertNoError(await alice.login.from("pll_submissions")
    .select("response_text").eq("id", submission.id).single(),
    "Re-read final submission after unauthorized edit attempt");
  expect(unchanged.response_text ===
    "I will conduct a permission-based observation and revise my project scope.",
    "Original final submission remains unchanged");

  const otherSubmissions = assertNoError(await bob.login.from("pll_submissions").select("id")
    .eq("id", submission.id), "Learner B submission query");
  expect(otherSubmissions.length === 0, "Learner B cannot read another learner's submission");

  const visible = assertNoError(await facilitator.login.from("pll_submissions")
    .select("id,response_text").eq("id", submission.id).single(), "Facilitator submission read");
  expect(visible.id === submission.id, "Facilitator sees assigned submission");

  const criteria = assertNoError(await facilitator.login.from("pll_rubric_criteria")
    .select("id,maximum_points").eq("activity_id", activity.id).order("position"),
    "Facilitator rubric read");
  expect(criteria.length === 3, "Expected three rubric criteria");

  const grades = criteria.map(c => ({criterion_id:c.id,points:Math.min(c.maximum_points,9),note:"Evidence-based criterion feedback."}));
  const denial = await bob.login.rpc("pll_publish_review", {
    p_submission_id: submission.id,
    p_summary: "Attempted learner grading",
    p_scores: grades,
  });
  expect(Boolean(denial.error), "Learner cannot publish rubric scores");

  const badGrades = [...grades];
  badGrades.pop();
  const incomplete = await facilitator.login.rpc("pll_publish_review", {
    p_submission_id: submission.id,
    p_summary: "Incomplete test review",
    p_scores: badGrades,
  });
  expect(Boolean(incomplete.error), "Incomplete rubric cannot be published");

  const published = await facilitator.login.rpc("pll_publish_review", {
    p_submission_id: submission.id,
    p_summary: "A feasible first action. Explain how your observation changes the plan.",
    p_scores: grades,
  });
  assertNoError(published, "Facilitator publishes complete rubric review");
  expect(Boolean(published.data), "Transactional review saved");

  const learnerFeedback = assertNoError(await alice.login.from("pll_feedback")
    .select("id,summary,published_at").eq("submission_id", submission.id).single(),
    "Learner A feedback read");
  expect(Boolean(learnerFeedback.published_at), "Learner A can see published review");
  const learnerScores = assertNoError(await alice.login.from("pll_rubric_scores")
    .select("criterion_id,awarded_points").eq("submission_id", submission.id),
    "Learner A rubric scores");
  expect(learnerScores.length === 3, "Learner A can see all three rubric scores");
  const otherFeedback = assertNoError(await bob.login.from("pll_feedback")
    .select("id").eq("submission_id", submission.id), "Learner B feedback query");
  expect(otherFeedback.length === 0, "Learner B cannot read another learner's feedback");

  // Private working lesson progress is not a final course submission. It must
  // survive a learner re-read but remain invisible to peers and facilitators.
  const lessonProgress = assertNoError(await alice.login.from("pll_lesson_progress").insert({
    course_id: course.id,
    activity_id: practiceActivity.id,
    learner_id: alice.user.id,
    lesson_key: "project-direction-lesson-v1",
    state: { version: 1, stage: 0, curiosity: "A tiny local art project" },
  }).select("id,state").single(), "Learner A private lesson save");
  expect(lessonProgress.state.curiosity === "A tiny local art project",
    "Private lesson work saved without submitting or grading");
  const peerProgress = assertNoError(await bob.login.from("pll_lesson_progress")
    .select("id").eq("id", lessonProgress.id), "Learner B private lesson query");
  expect(peerProgress.length === 0, "Learner B cannot read another learner's lesson state");
  const staffProgress = assertNoError(await facilitator.login.from("pll_lesson_progress")
    .select("id").eq("id", lessonProgress.id), "Facilitator private lesson query");
  expect(staffProgress.length === 0, "Facilitator cannot read learner's private working lesson");
  const forgedProgress = await bob.login.from("pll_lesson_progress").insert({
    course_id: course.id, activity_id: practiceActivity.id,
    learner_id: alice.user.id, lesson_key: "forged-lesson-v1", state: { version: 1 },
  });
  expect(Boolean(forgedProgress.error), "Learner B cannot create lesson state owned by learner A");
  assertNoError(await alice.login.from("pll_lesson_progress")
    .update({ state: { version: 1, stage: 2, curiosity: "Revised local art project" } })
    .eq("id", lessonProgress.id), "Learner A updates private lesson progress");
  const resumed = assertNoError(await alice.login.from("pll_lesson_progress")
    .select("state").eq("id", lessonProgress.id).single(), "Learner A reloads private lesson");
  expect(resumed.state.stage === 2 && resumed.state.curiosity === "Revised local art project",
    "Learner A can resume an updated private lesson");

  // The same learner/facilitator contract applies to ungraded activities,
  // without creating rubric scores or an artificial zero-point grade.
  const practiceResponse = assertNoError(await alice.login.from("pll_submissions").insert({
    course_id: course.id,
    activity_id: practiceActivity.id,
    learner_id: alice.user.id,
    response_text: "A short guide is a safer first test than a schoolwide campaign.",
  }).select("id").single(), "Learner A submits ungraded practice");
  expect(Boolean(practiceResponse?.id), "Ungraded final response persisted");
  const forgedPractice = await bob.login.from("pll_submissions").insert({
    course_id: course.id, activity_id: practiceActivity.id,
    learner_id: alice.user.id, response_text: "Forged ungraded work",
  });
  expect(Boolean(forgedPractice.error), "Learner B cannot forge an ungraded submission");
  const otherPractice = assertNoError(await bob.login.from("pll_submissions")
    .select("id").eq("id", practiceResponse.id), "Learner B ungraded submission query");
  expect(otherPractice.length === 0, "Learner B cannot read another learner's practice");
  const learnerAttempt = await bob.login.rpc("pll_publish_formative_feedback", {
    p_submission_id: practiceResponse.id, p_summary: "Forged feedback",
  });
  expect(Boolean(learnerAttempt.error), "Learner B cannot publish formative feedback");
  const wrongReviewType = await facilitator.login.rpc("pll_publish_formative_feedback", {
    p_submission_id: submission.id, p_summary: "Attempt to bypass graded rubric",
  });
  expect(Boolean(wrongReviewType.error), "Ungraded review RPC rejects graded assignment");
  assertNoError(await facilitator.login.rpc("pll_publish_formative_feedback", {
    p_submission_id: practiceResponse.id,
    p_summary: "You used available resources and a realistic first test. What will you observe?",
  }), "Facilitator publishes ungraded feedback");
  const practiceFeedback = assertNoError(await alice.login.from("pll_feedback")
    .select("summary,percentage_score,published_at")
    .eq("submission_id", practiceResponse.id).single(), "Learner A ungraded feedback read");
  expect(Boolean(practiceFeedback.published_at) && practiceFeedback.percentage_score === null,
    "Ungraded feedback is published with no artificial score");
  const formativeScores = assertNoError(await alice.login.from("pll_rubric_scores")
    .select("id").eq("submission_id", practiceResponse.id), "Ungraded rubric score check");
  expect(formativeScores.length === 0, "Ungraded work has no rubric score records");
  const otherPracticeFeedback = assertNoError(await bob.login.from("pll_feedback")
    .select("id").eq("submission_id", practiceResponse.id), "Learner B ungraded feedback query");
  expect(otherPracticeFeedback.length === 0, "Learner B cannot read another learner's formative feedback");

  // Use only new synthetic accounts. The key is read privately by the
  // trusted runner; never print answer keys, submitted answers or feedback.
  const quiz = assertNoError(await admin.from("pll_quiz_questions")
    .select("position,options,correct_option").eq("course_id", course.id).order("position"), "Inspect quiz fixture privately");
  expect(quiz.length === 10 && quiz.every((q, i) => q.position === i + 1 &&
    Array.isArray(q.options) && q.options.length >= 2 &&
    q.correct_option >= 1 && q.correct_option <= q.options.length),
    "Ten valid ordered quiz questions");
  const publicQuestions = assertNoError(await alice.login.from("pll_quiz_questions")
    .select("position,prompt,options").eq("course_id", course.id), "Learner reads allowed quiz columns");
  expect(publicQuestions.length === 10, "Learner can read all ten questions");
  const secretColumns = await alice.login.from("pll_quiz_questions")
    .select("correct_option,explanation").eq("course_id", course.id);
  expect(Boolean(secretColumns.error), "Learner cannot select quiz answer key");
  const answers = quiz.map((q, i) => i === 0 ? (q.correct_option % q.options.length) + 1 : q.correct_option);
  const badQuiz = await alice.login.rpc("pll_submit_quiz", { p_course_id: course.id, p_answers: answers.slice(0, 9) });
  expect(Boolean(badQuiz.error), "Incomplete quiz attempt rejected");
  const staffQuiz = await facilitator.login.rpc("pll_submit_quiz", { p_course_id: course.id, p_answers: answers });
  expect(Boolean(staffQuiz.error), "Facilitator cannot submit as a learner");
  assertNoError(await alice.login.rpc("pll_submit_quiz", { p_course_id: course.id, p_answers: answers }), "Learner submits quiz");
  const receipt = assertNoError(await alice.login.from("pll_quiz_attempts")
    .select("score,feedback,submitted_at").eq("course_id", course.id).eq("learner_id", alice.user.id).single(), "Learner retrieves own quiz receipt");
  expect(receipt.score === 9 && Boolean(receipt.submitted_at), "Quiz score matches one intentionally incorrect answer");
  expect(Array.isArray(receipt.feedback) && receipt.feedback.length === 10 &&
    receipt.feedback.every(item => typeof item.explanation === "string" && item.explanation.trim() &&
      item.correct === (item.position !== 1)) &&
    new Set(receipt.feedback.map(item => item.position)).size === 10,
    "Every quiz item has correct/incorrect explanation");
  const repeatQuiz = await alice.login.rpc("pll_submit_quiz", { p_course_id: course.id, p_answers: answers });
  expect(Boolean(repeatQuiz.error), "Second quiz attempt rejected");
  const peerQuiz = assertNoError(await bob.login.from("pll_quiz_attempts").select("score")
    .eq("course_id", course.id).eq("learner_id", alice.user.id), "Peer quiz visibility query");
  expect(peerQuiz.length === 0, "Peer cannot read learner A quiz receipt");
  const staffReceipt = assertNoError(await facilitator.login.from("pll_quiz_attempts").select("score")
    .eq("course_id", course.id).eq("learner_id", alice.user.id).single(), "Facilitator quiz receipt");
  expect(staffReceipt.score === 9, "Facilitator sees assigned quiz result");

  const ratings = Array(10).fill(4);
  const evaluation = { course_id: course.id, ratings, comments: "SYNTHETIC QA — remove after this test." };
  const invalidEvaluation = await alice.login.from("pll_course_evaluations")
    .insert({ ...evaluation, ratings: [4] });
  expect(Boolean(invalidEvaluation.error), "Incomplete evaluation rejected");
  const forgedEvaluation = await bob.login.from("pll_course_evaluations")
    .insert({ ...evaluation, learner_id: alice.user.id });
  expect(Boolean(forgedEvaluation.error), "Peer cannot forge evaluation");
  const evaluationReceipt = assertNoError(await alice.login.from("pll_course_evaluations")
    .insert(evaluation).select("ratings,submitted_at").single(), "Learner evaluation receipt");
  expect(evaluationReceipt.ratings.length === 10 && Boolean(evaluationReceipt.submitted_at),
    "Learner can submit and retrieve ten evaluation ratings");
  const repeatEvaluation = await alice.login.from("pll_course_evaluations").insert(evaluation);
  expect(Boolean(repeatEvaluation.error), "Duplicate evaluation rejected");
  const peerEvaluation = assertNoError(await bob.login.from("pll_course_evaluations").select("ratings")
    .eq("course_id", course.id).eq("learner_id", alice.user.id), "Peer evaluation visibility query");
  expect(peerEvaluation.length === 0, "Peer cannot read learner A evaluation");
  const staffEvaluation = assertNoError(await facilitator.login.from("pll_course_evaluations").select("ratings")
    .eq("course_id", course.id).eq("learner_id", alice.user.id).single(), "Facilitator evaluation read");
  expect(staffEvaluation.ratings.length === 10, "Facilitator sees assigned evaluation");

  // Test the currently held Portfolio. Never toggle the hold.
  const portfolio = assertNoError(await admin.from("pll_activities").select("id,is_published")
    .eq("course_id", course.id).eq("slug", "launch-portfolio").single(), "Locate Portfolio");
  expect(portfolio.is_published, "Portfolio exists in published course");
  const portfolioOpen = assertNoError(await alice.login.rpc("pll_portfolio_is_open", { p_course_id: course.id }), "Read Portfolio gate");
  expect(portfolioOpen === false, "Portfolio hold active; this harness is for held-state testing");
  const portfolioDraft = assertNoError(await alice.login.from("pll_drafts").insert({
    course_id: course.id, activity_id: portfolio.id, learner_id: alice.user.id,
    response_text: "SYNTHETIC QA — honest working Portfolio draft."
  }).select("id").single(), "Held Portfolio draft");
  expect(Boolean(portfolioDraft.id), "Held Portfolio still allows draft");
  const heldFinal = await alice.login.from("pll_submissions").insert({
    course_id: course.id, activity_id: portfolio.id, learner_id: alice.user.id,
    response_text: "SYNTHETIC QA — this final submission must be rejected."
  });
  expect(Boolean(heldFinal.error), "Held Portfolio rejects final submission");
  console.log("ROLE SMOKE TEST COMPLETE — all assertions passed (synthetic accounts only).");
} finally {
  // Revoke synthetic sessions first. Quiz and evaluation FKs do not cascade.
  // Explicitly remove only records for newly created IDs and the exact course.
  for (const login of sessions) {
    try {
      const result = await login.auth.signOut({ scope: "global" });
      if (result.error) cleanupFailed = true;
    } catch { cleanupFailed = true; }
  }
  if (ids.length) {
    for (const table of ["pll_quiz_attempts", "pll_course_evaluations", "pll_submissions"]) {
      try {
        const removed = await admin.from(table).delete().eq("course_id", expectedCourseId).in("learner_id", ids);
        if (removed.error) cleanupFailed = true;
        const remaining = await admin.from(table).select("learner_id", { count: "exact", head: true })
          .eq("course_id", expectedCourseId).in("learner_id", ids);
        if (remaining.error || remaining.count !== 0) cleanupFailed = true;
      } catch { cleanupFailed = true; }
    }
  }
  for (const userId of ids) {
    const r = await admin.auth.admin.deleteUser(userId);
    if (r.error) { cleanupFailed = true; console.error("CLEANUP WARNING: synthetic Auth user requires review."); }
  }
  if (cleanupFailed) {
    console.error('ROLE SMOKE TEST FAILED CLEANUP: check synthetic accounts and publication flags before another run.');
    process.exitCode = 1;
  }
}
