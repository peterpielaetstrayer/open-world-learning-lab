import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.PLL_QA_SCRATCH;
const status = JSON.parse(readFileSync(join(root, "status.json"), "utf8"));
const api = status.API_URL;
const key = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
const adminKey = status.SECRET_KEY ?? status.SERVICE_ROLE_KEY;
if (new URL(api).origin !== "http://127.0.0.1:54321" || !key || !adminKey) {
  throw new Error("Expected local CLI API and keys. Refusing to initialize.");
}
writeFileSync(join(root, "local.env"),
  "NEXT_PUBLIC_SUPABASE_URL=" + api + "\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=" + key + "\n",
  { mode: 0o600 });
const admin = createClient(api, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
const course = await admin.from("pll_courses").select("id").eq("slug", "project-launch-lab").single();
if (course.error) throw new Error("Could not locate the isolated course.");
const identities = {};
for (const [name, role] of [["learner-a", "learner"], ["learner-b", "learner"], ["facilitator", "facilitator"]]) {
  const email = name + "@example.test";
  const password = randomBytes(24).toString("hex");
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) throw new Error("Could not create a synthetic identity.");
  const { error } = await admin.from("pll_memberships").insert({
    course_id: course.data.id, user_id: created.data.user.id, role,
  });
  if (error) throw new Error("Could not enroll a synthetic identity.");
  identities[name] = { email, password };
}
const quiz = await admin.from("pll_quiz_questions").select("correct_option").order("position");
if (quiz.error || quiz.data?.length !== 10) throw new Error("Could not validate the seeded quiz.");
writeFileSync(join(root, "accounts.json"), JSON.stringify({
  identities, courseId: course.data.id, quiz: quiz.data.map(item => item.correct_option),
}), { mode: 0o600 });
