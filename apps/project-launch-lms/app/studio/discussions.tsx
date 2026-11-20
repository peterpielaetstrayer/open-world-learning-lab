"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Channel = "questions" | "peer-feedback";
type Post = { id: string; author_id: string; parent_id: string | null; body: string; created_at: string };

export function Discussions({ supabase, courseId, identity, preview }: {
  supabase: SupabaseClient; courseId: string; identity: string; preview: boolean;
}) {
  const [channel, setChannel] = useState<Channel>("questions");
  const [posts, setPosts] = useState<Post[]>([]);
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const readPosts = useCallback(async () => {
    const result = await supabase.from("pll_discussion_posts")
      .select("id,author_id,parent_id,body,created_at").eq("course_id", courseId)
      .eq("channel", channel).order("created_at");
    if (result.error) throw new Error(result.error.message);
    return result.data as Post[];
  }, [supabase, courseId, channel]);

  useEffect(() => {
    let active = true;
    void readPosts().then(data => { if (active) setPosts(data); })
      .catch(cause => { if (active) setError(String(cause.message ?? cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [readPosts]);

  async function post(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || sending || !body.trim()) return;
    setSending(true);
    setError("");
    try {
      const result = await supabase.from("pll_discussion_posts").insert({
        course_id: courseId, channel, body: body.trim(), parent_id: replyTo?.id ?? null,
      }).select("id,author_id,parent_id,body,created_at").single();
      if (result.error) throw new Error(result.error.message);
      setPosts(previous => [...previous, result.data as Post]);
      setBody("");
      setReplyTo(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your post could not be saved.");
    } finally {
      setSending(false);
    }
  }

  function renderPost(item: Post, canReply: boolean) {
    return <article className="assignment-card" key={item.id}>
      <p className="form-note">{item.author_id === identity ? "You" : "Course member"} · {new Date(item.created_at).toLocaleString()}</p>
      <p className="prewrap">{item.body}</p>
      {canReply && !preview && <button type="button" className="text-button" disabled={sending}
        onClick={() => setReplyTo(item)}>Reply</button>}
    </article>;
  }

  return <section className="studio-work" aria-labelledby="discussions-heading">
    <h2 id="discussions-heading">Discussions</h2>
    <label htmlFor="discussion-channel">Forum</label>
    <select id="discussion-channel" value={channel} disabled={sending} onChange={event => {
      setChannel(event.target.value as Channel); setPosts([]); setLoading(true);
      setReplyTo(null); setBody(""); setError("");
    }}>
      <option value="questions">Course questions</option>
      <option value="peer-feedback">Peer feedback</option>
    </select>
    <p>{channel === "questions"
      ? "Ask for clarification about an activity, resource, or course instruction."
      : "Share a project direction or proposed first test. In your reply, name one strength and one feasible improvement."}</p>
    {loading && <p role="status">Loading posts…</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && posts.length === 0 && !error && <p>No posts yet.</p>}
    {posts.filter(item => !item.parent_id).map(item => <div key={item.id}>
      {renderPost(item, true)}
      {posts.filter(reply => reply.parent_id === item.id).map(reply => renderPost(reply, false))}
    </div>)}
    {!preview && !loading && <form onSubmit={post}>
      <label htmlFor="discussion-body">{replyTo ? "Write a reply" : "Write a post"}</label>
      {replyTo && <p className="form-note">Replying to “{replyTo.body.slice(0, 90)}” <button type="button" className="text-button"
        disabled={sending} onClick={() => setReplyTo(null)}>Cancel reply</button></p>}
      <textarea id="discussion-body" rows={5} maxLength={4000} required value={body}
        onChange={event => setBody(event.target.value)} disabled={sending} />
      <div className="studio-actions">
        <button type="submit" className="feedback-button" disabled={sending || !body.trim()}>{sending ? "Posting…" : replyTo ? "Post reply" : "Post"}</button>
      </div>
    </form>}
  </section>;
}
