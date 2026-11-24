"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { routePasswordEmail } from "@/lib/password-email";
import { browserSupabase } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { routePasswordEmail(); }, []);

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

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setError("");
    setNotice("");
    try {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", "/set-password");
      const { error: resetError } = await browserSupabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: callback.toString(),
      });
      if (resetError && resetError.code !== "email_address_not_authorized") {
        throw new Error("The password reset request failed. Wait a moment and try again.");
      }
      setNotice("If a reset link can be sent to this address, it will arrive by email. Open it in this same browser.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Password reset failed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Open World Learning Lab</p>
        <h1>{recovering ? "Reset password" : "Sign in"}</h1>
        <p>{recovering ? "Enter the email address you use for the LMS." : "Access the courses you teach or are enrolled in."}</p>
        <form onSubmit={recovering ? requestPasswordReset : signIn} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input
            type="email" id="login-email" required autoComplete="email"
            value={email} onChange={(event) => setEmail(event.target.value)}
          />
          {!recovering && <>
          <label htmlFor="login-password">Password</label>
          <input
            type="password" id="login-password" required autoComplete="current-password"
            value={password} onChange={(event) => setPassword(event.target.value)}
          />
          </>}
          <button className="feedback-button" type="submit" disabled={working}>
            {working ? (recovering ? "Requesting…" : "Signing in…") : (recovering ? "Send reset link" : "Sign in")}
          </button>
        </form>
        <button type="button" className="text-button" disabled={working} onClick={() => {
          setRecovering(!recovering);
          setPassword("");
          setError("");
          setNotice("");
        }}>
          {recovering ? "Back to sign in" : "Forgot password?"}
        </button>
        {notice && <p role="status" className="form-success">{notice}</p>}
        {error && <p role="alert" className="form-error">{error}</p>}
        <p className="form-note">
          Accounts are provided to invited course participants and reviewers.
          Public registration is not available.
        </p>
      </div>
    </main>
  );
}
