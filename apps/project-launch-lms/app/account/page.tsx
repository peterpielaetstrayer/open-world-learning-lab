"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase-browser";

/**
 * Member self-service: this page does not use privileged auth keys.
 * Password changes apply only to the currently signed-in Supabase user.
 */
export default function AccountPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function checkSession() {
      try {
        const { data, error: authError } = await browserSupabase().auth.getUser();
        if (!active) return;
        if (authError || !data.user) {
          router.replace("/login");
          return;
        }
        setEmail(data.user.email ?? "");
      } catch {
        if (active) setError("Account settings are unavailable. Please sign in again.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void checkSession();
    return () => { active = false; };
  }, [router]);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password.length < 12) {
      setError("Choose a password with at least 12 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const supabase = browserSupabase();
      const { data: current, error: userError } = await supabase.auth.getUser();
      if (userError || !current.user) {
        router.replace("/login");
        throw new Error("Your session has expired. Request a new password-recovery email.");
      }
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword("");
      setConfirmation("");
      setNotice("Your password has been updated. You can now sign in with the new password in another browser.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update your password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="account-title">
        <Link href="/courses" className="back-link">← My Courses</Link>
        <p className="eyebrow">Open World Learning Lab</p>
        <h1 id="account-title">Account settings</h1>
        {checking ? <p role="status">Checking your account…</p> : email ? (
          <>
            <p><strong>Signed in as</strong></p>
            <p>{email}</p>
            <h2>Change your password</h2>
            <p>For security, set a new password only for your own account. You do not need to know the previous password when you have an active authorized session.</p>
            <form className="auth-form" onSubmit={changePassword}>
              <label htmlFor="account-new-password">New password (12 characters minimum)</label>
              <input id="account-new-password" type="password" autoComplete="new-password" minLength={12} required
                value={password} onChange={e => setPassword(e.target.value)} />
              <label htmlFor="account-confirm-password">Confirm new password</label>
              <input id="account-confirm-password" type="password" autoComplete="new-password" minLength={12} required
                value={confirmation} onChange={e => setConfirmation(e.target.value)} />
              <button type="submit" className="feedback-button" disabled={saving}>{saving ? "Saving…" : "Change password"}</button>
            </form>
            <p className="form-note">Email address changes are not enabled in this LMS. Ask your course administrator if your address needs updating.</p>
          </>
        ) : <p>Sign in through your invitation or password-recovery email to manage your account.</p>}
        {notice && <p className="form-success" role="status">{notice}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
