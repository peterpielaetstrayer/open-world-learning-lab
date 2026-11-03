# Project Launch Lab — invited-user authentication and role-test runbook

**Status: source code ready for configuration, not yet a live end-to-end Auth test.** Applies to dedicated Supabase project `wjormscrikzocelbjxvc` in the OWLL Free organization. Never store credentials, invitation links, user emails, student work, or screenshots of authenticated pages in the public repository.

## What exists

- `/login`: email/password sign-in for invited users; **no public signup route**.
- `/auth/callback`: exchanges an approved Supabase PKCE code for an authenticated cookie session, with only the explicitly allowed local post-login destinations.
- `/auth/confirm`: accepts properly configured email-template `token_hash` for `invite`, `email` or `magiclink`; exchanges it into a cookie session and moves invited users to set a password.
- `/set-password`: available to a currently authenticated invitee; applies a 12-character minimum client-side and calls `auth.updateUser` (the Supabase password policy still governs).
- `/studio`: real RLS-scoped learner/facilitator UI. Membership assignment is **never** writable by learners; the backend role is read from `pll_memberships`.
- `scripts/smoke-roles.mjs`: **manual, guarded** synthetic Auth and RLS integration test. It is not automatically run and has not yet been executed.

The email templates and Auth redirect settings MUST match the exact deployed domain. Cookie processing is implemented with the official `@supabase/ssr` server client pattern. `NEXT_PUBLIC_*` values are browser-safe publishable URL/key; all Auth-admin operations require a service role **only on a trusted server or ephemeral test runner**.

## Preparation before testing

1. **Obtain a nonpublic preview URL** for this standalone app with Vercel Root Directory `apps/project-launch-lms`; preview is not production and does not represent course acceptance.
2. Set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` variables for that Vercel project using Vercel's protected environment variable UI. Public values should identify only the **Project Launch Lab** Supabase project. Do not use the OWLL website's database credentials.
3. In Supabase Authentication → URL Configuration, set the Site URL and redirect allowlist for the *actual* application host. Include exact `/auth/callback` and `/auth/confirm` paths. **Do not use unbounded wildcard patterns** for a publicly accessible LMS.
4. In Supabase Authentication → Email Templates, configure the invite confirmation URL to:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite`.
   Where templates differ, inspect Supabase's current template documentation before changing. Do not expose invite token hash in logs or screenshots.
5. Disable public user signups / limit users to invitation-only **in Supabase Auth settings**, after verifying current provider capabilities. No learner should self-assign a role.
6. Use Supabase Auth admin invite flow or dashboard to provision **synthetic** students and facilitators, then insert course membership in a trusted server/admin context. No direct SQL writes to `auth.users`; never trust `raw_user_meta_data` for authorization.
7. Before allowing actual visitors, replace placeholder assignment instructions with reviewed course material and publish only the relevant content using privileged, audited admin action.
8. Confirm email delivery, link expiration and password setup using disposable consenting *adult* accounts. No real minor accounts or student data during this Capstone test.

## Manual integration test (not yet executed)

```bash
# Run in a trusted, isolated environment. NEVER in the browser or public CI logs.
cd apps/project-launch-lms
export NEXT_PUBLIC_SUPABASE_URL="https://wjormscrikzocelbjxvc.supabase.co"
export NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<public publishable key>"
export SUPABASE_SERVICE_ROLE_KEY="<secret, server-only; obtain directly from Supabase>"
export PLL_CONFIRM_TEST_PROJECT_REF="wjormscrikzocelbjxvc"
export PLL_ALLOW_SYNTHETIC_ROLE_TEST="yes"
node scripts/smoke-roles.mjs
```

Expected test: create synthetic learner A, learner B, and facilitator through **supported Supabase Auth admin API**; grant explicit memberships; temporarily publish the draft M1 activity; demonstrate own draft persist, cross-learner data invisibility and forged-submission denial; demonstrate immutable final, facilitator-only rubric publication, rejection of incomplete criteria and learner-visible published scores; restore draft publication flags and delete synthetic users in `finally`.

**Safeguards:** project-ref and explicit enable flags required; script does not run under CI; no real student identifiers, invited reviewers or external email messages used; passwords and secret keys never printed. Cleanup failure should be investigated before another test; it is *not* a guarantee that all provisional records disappeared.

**Important:** No one should treat successful `node --check` or CI compilation as proof that this test passed. Only a real run against the intended Supabase project, with the expected assertions and post-run data cleanup verified, can close the full RLS and login-to-grading gate.

## Mandatory post-test checks

- Verify `auth.users` synthetic records removed and matching `pll_memberships`, `pll_drafts`, `pll_submissions`, `pll_feedback`, `pll_rubric_scores` have returned to their baseline counts.
- Confirm draft course/modules/assignments remain unpublished and role-grants unchanged.
- Rerun Supabase security/performance advisors and close any **critical** finding.
- Test actual mobile/keyboard flow, invalid invitation, expired token, signed-out session, learner A vs B, facilitator rubric publication, error handling, and reload persistence.
- Confirm Dr. Evans accepts this approach, then create **reviewer-specific** roles and share credentials through a secure channel only, not repository documentation.
- Canvas Lite remains the formal fallback until instructor approval and a verified walkthrough.

## Sources
- [Supabase SSR Auth client](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Supabase Auth admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
