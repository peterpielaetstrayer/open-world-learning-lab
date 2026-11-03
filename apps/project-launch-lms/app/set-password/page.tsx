"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase-browser";

export default function SetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    void browserSupabase().auth.getUser().then(({ data }) => {
      if (active) setReady(Boolean(data.user));
    }).catch(() => {
      if (active) setReady(false);
    });
    return () => { active = false; };
  }, []);

  async function setAccountPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 12) {
      setError("Choose a password with at least 12 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setWorking(true);
    try {
      const { data: user, error: userError } = await browserSupabase().auth.getUser();
      if (userError || !user.user) throw new Error("Your invitation session has expired. Request a new invitation.");
      const { error: updateError } = await browserSupabase().auth.updateUser({ password });
      if (updateError) throw updateError;
      router.replace("/studio");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to set your password.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="password-title">
        <Link href="/" className="back-link">← Project Launch Lab</Link>
        <p className="eyebrow">Account setup / Invited participants</p>
        <h1 id="password-title">Make your studio yours.</h1>
        {!ready ? (
          <p role="status">Your invitation session is not active. Open your invitation link first, or <Link href="/login">sign in</Link>.</p>
        ) : (
          <>
            <p>Choose a password to return to your learning studio.</p>
            <form className="auth-form" onSubmit={setAccountPassword}>
              <label htmlFor="password-new">Password (12 characters minimum)</label>
              <input id="password-new" type="password" autoComplete="new-password" minLength={12} required
                value={password} onChange={e => setPassword(e.target.value)} />
              <label htmlFor="password-confirm">Confirm password</label>
              <input id="password-confirm" type="password" autoComplete="new-password" minLength={12} required
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button type="submit" className="feedback-button" disabled={working}>
                {working ? "Saving…" : "Set password and enter studio"}
              </button>
            </form>
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
