"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase-browser";

export default function SetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const sessionCheck = useRef<Promise<boolean> | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    sessionCheck.current ??= openPasswordSession();
    void sessionCheck.current.then(valid => {
      if (active) setReady(valid);
    }).catch(() => {
      if (active) setError("This setup link is invalid or expired. Request a new password link.");
    }).finally(() => {
      if (active) setChecking(false);
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
      router.replace("/courses");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to set your password.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="password-title">
        <Link href="/" className="back-link">← My Courses</Link>
        <p className="eyebrow">Account setup / Invited participants</p>
        <h1 id="password-title">Set your password</h1>
        {checking ? <p role="status">Checking your setup link…</p> : !ready ? (
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
                {working ? "Saving…" : "Set password and continue"}
              </button>
            </form>
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}

async function openPasswordSession() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const kind = fragment.get("type");
  if (kind === "invite" || kind === "recovery") {
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    if (!accessToken || !refreshToken || fragment.has("error")) throw new Error("Invalid setup link");

    const { data, error } = await browserSupabase().auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error || !data.session) throw new Error("Invalid setup session");
  }
  const { data, error } = await browserSupabase().auth.getUser();
  return !error && Boolean(data.user);
}
