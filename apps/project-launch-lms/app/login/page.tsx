"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setError("");
    try {
      const { error: authError } = await browserSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      router.replace("/courses");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Open World Learning Lab</p>
        <h1>Sign in</h1>
        <p>Access the courses you teach or are enrolled in.</p>
        <form onSubmit={signIn} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input
            type="email" id="login-email" required autoComplete="email"
            value={email} onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="login-password">Password</label>
          <input
            type="password" id="login-password" required autoComplete="current-password"
            value={password} onChange={(event) => setPassword(event.target.value)}
          />
          <button className="feedback-button" type="submit" disabled={working}>
            {working ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {error && <p role="alert" className="form-error">{error}</p>}
        <p className="form-note">
          Accounts are provided to invited course participants and reviewers.
          Public registration is not available.
        </p>
      </div>
    </main>
  );
}
