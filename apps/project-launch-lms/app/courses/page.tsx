"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routePasswordEmail } from "@/lib/password-email";
import { browserSupabase } from "@/lib/supabase-browser";

type Course = { id: string; title: string; description: string };
type Enrollment = { course_id: string; member_role: "learner" | "facilitator" };

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<(Course & { role: Enrollment["member_role"] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (routePasswordEmail()) return;
    let cancelled = false;
    async function loadCourses() {
      try {
        const supabase = browserSupabase();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user || authError) {
          router.replace("/login");
          return;
        }
        const memberships = await supabase.from("pll_memberships")
          .select("course_id,member_role").eq("user_id", user.id);
        if (memberships.error) throw new Error(memberships.error.message);
        const enrollments = memberships.data as Enrollment[];
        if (enrollments.length === 0) return;

        const result = await supabase.from("pll_courses").select("id,title,description")
          .in("id", enrollments.map(item => item.course_id)).order("title");
        if (result.error) throw new Error(result.error.message);
        if (cancelled) return;
        const roles = new Map(enrollments.map(item => [item.course_id, item.member_role]));
        setCourses(result.data.flatMap(course => {
          const role = roles.get(course.id);
          return role ? [{ ...course, role }] : [];
        }));
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Courses could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadCourses();
    return () => { cancelled = true; };
  }, [router]);

  async function signOut() {
    const { error: signOutError } = await browserSupabase().auth.signOut();
    if (signOutError) setError(signOutError.message);
    else router.replace("/login");
  }

  return (
    <main className="page-wrap studio-container">
      <div className="studio-top">
        <div>
          <p className="eyebrow">Open World Learning Lab</p>
          <h1>My Courses</h1>
        </div>
        {!loading && !error && <button type="button" className="text-button" onClick={() => void signOut()}>Sign out</button>}
      </div>
      {loading && <p role="status">Loading your courses…</p>}
      {error && <p role="alert" className="form-error">{error}</p>}
      {!loading && !error && courses.length === 0 && <p>You have no course enrollments yet.</p>}
      {courses.map(course => (
        <article key={course.id} className="studio-panel">
          <p className="eyebrow">{course.role === "facilitator" ? "Instructor" : "Student"}</p>
          <h2><Link href={`/studio?course=${encodeURIComponent(course.id)}`}>{course.title}</Link></h2>
          {course.description && <p>{course.description}</p>}
        </article>
      ))}
    </main>
  );
}
