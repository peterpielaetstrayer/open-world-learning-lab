/**
 * Explicitly approved course reviewer invitation — manual script only.
 *
 * No write/action occurs without all of:
 * 1. Correct project ref environment guard.
 * 2. --send flag, consent to emailing this specific adult address.
 * 3. Nonempty role learner|facilitator.
 * 4. Trusted server-only service key. NEVER use in a frontend bundle.
 *
 * Example:
 * PLL_CONFIRM_INVITE_PROJECT_REF=wjormscrikzocelbjxvc \
 * node scripts/invite-member.mjs --email person@example.com --role learner --send
 */
import { createClient } from "@supabase/supabase-js";

const expectedRef = "wjormscrikzocelbjxvc";
const args = process.argv.slice(2);
const flagValue = name => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const email = flagValue("--email")?.trim().toLowerCase();
const role = flagValue("--role");
const send = args.includes("--send");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = process.env.PLL_DEPLOYED_APP_ORIGIN;

if (!send) throw new Error("Invitation not sent. Review details and pass --send only after explicit approval.");
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !["learner", "facilitator"].includes(role))
  throw new Error("A valid email and role (learner|facilitator) are required.");
if (!baseUrl?.startsWith("https://") || new URL(baseUrl).pathname !== "/")
  throw new Error("Configure a production/preview HTTPS app origin with no path (PLL_DEPLOYED_APP_ORIGIN).");
if (!url?.includes(expectedRef) || process.env.PLL_CONFIRM_INVITE_PROJECT_REF !== expectedRef || !key)
  throw new Error("Correct project ref and privileged server-only credentials are required.");

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: course, error: courseError } = await admin.from("pll_courses")
  .select("id").eq("slug", "project-launch-lab").single();
if (courseError || !course) throw new Error("Course not found; no invitation sent.");

const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
  redirectTo: new URL("/set-password", baseUrl).toString(),
});
if (inviteError || !invite?.user) throw new Error("Invitation failed; no role was granted.");

const { error: memberError } = await admin.from("pll_memberships").upsert({
  course_id: course.id,
  user_id: invite.user.id,
  member_role: role,
});
if (memberError) {
  console.error("INVITATION WAS SENT but the user was not enrolled. An administrator must repair membership before access.");
  process.exitCode = 1;
} else {
  console.log("Invitation sent and course membership provisioned. No credentials were printed.");
}
