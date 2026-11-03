/**
 * Project Launch Lab — synthetic user/auth/RLS integration smoke test.
 * Not run in normal CI. Requires explicit guard + local/Vercel server-only key.
 * Creates ONLY synthetic users and deletes them in finally.
 *
 * Run only against the dedicated staging/demo Supabase project and while no
 * external evaluator is using the course; temporarily publishes one activity.
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
    !url || !url.includes(expectedRef) ||
    !publishableKey || !serviceKey) {
  throw new Error("Role test refused: requires explicit project confirmation, enabled flag, publishable key and server-only service key.");
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const ids = [];
const tag = randomUUID().slice(0, 12);
const courseSlug = "project-launch-lab";
let activity = null;
let originalPublished = false;
let originalModulePublished = false;
let module = null;

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
  module = assertNoError(
    await admin.from("pll_modules").select("id,is_published").eq("course_id", course.id)
      .eq("module_number", 1).single(),
    "Find module"
  );
  const a = assertNoError(
    await admin.from("pll_activities")
      .select("id,course_id,module_id,is_published")
      .eq("course_id", course.id).eq("slug", "project-direction-brief").single(),
    "Find draft assignment"
  );
  activity = a;
  originalPublished = a.is_published;
  originalModulePublished = module.is_published;

  const alice = await makeClient("learner-a");
  const bob = await makeClient("learner-b");
  const facilitator = await makeClient("facilitator");

  assertNoError(await admin.from("pll_memberships").insert([
    { course_id: course.id, user_id: alice.user.id, member_role: "learner" },
    { course_id: course.id, user_id: bob.user.id, member_role: "learner" },
    { course_id: course.id, user_id: facilitator.user.id, member_role: "facilitator" },
  ]), "Enroll synthetic accounts");

  assertNoError(await admin.from("pll_modules").update({ is_published: true }).eq("id", module.id),
    "Temporarily publish module for synthetic test");
  assertNoError(await admin.from("pll_activities").update({ is_published: true }).eq("id", activity.id),
    "Temporarily publish assignment for synthetic test");

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

  const illicitChange = await alice.login.from("pll_submissions")
    .update({response_text:"Edited after submission"}).eq("id", submission.id);
  expect(Boolean(illicitChange.error), "Learner cannot edit immutable final submission");

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

  console.log("ROLE SMOKE TEST COMPLETE — all assertions passed (synthetic accounts only).");
} finally {
  // Restore the unpublished course and remove synthetic accounts even on failure.
  if (activity) {
    const r = await admin.from("pll_activities")
      .update({is_published: originalPublished}).eq("id",activity.id);
    if (r.error) console.error("CLEANUP WARNING: activity publication state requires review.");
  }
  if (module) {
    const r = await admin.from("pll_modules")
      .update({is_published: originalModulePublished}).eq("id",module.id);
    if (r.error) console.error("CLEANUP WARNING: module publication state requires review.");
  }
  for (const userId of ids.reverse()) {
    const r = await admin.auth.admin.deleteUser(userId);
    if (r.error) console.error("CLEANUP WARNING: synthetic Auth user requires review.");
  }
}
