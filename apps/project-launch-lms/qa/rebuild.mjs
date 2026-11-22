import { readdirSync, copyFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { resolve } from "node:path";

const [target, seedPath] = process.argv.slice(2);
if (!target || !seedPath) throw new Error("Expected disposable Supabase migration and seed paths.");
// These are editorial/data reconciliations whose prerequisites were authored in the
// original studio. The final course-only fixture supersedes their data changes.
// Every schema, grant, RLS, RPC and scoring migration is copied and runs verbatim.
const historicalContent = new Set([
  "20261122183218", "20261122183235", "20261122183316", "20261122190739",
  "20261122193608", "20261122204148", "20261122210457", "20261122210656",
  "20261122212153", "20261122220019",
]);
const migrations = readdirSync("supabase/migrations").filter(name => name.endsWith(".sql"));
for (const name of migrations) {
  if (!historicalContent.has(name.split("_")[0])) {
    copyFileSync(resolve("supabase/migrations", name), resolve(target, name));
  }
}
const bundle = process.env.PLL_QA_COURSE_SEED;
if (!bundle) throw new Error("Set the protected PLL_QA_COURSE_SEED repository secret.");
const data = JSON.parse(gunzipSync(Buffer.from(bundle, "base64")).toString());
const { course, modules, activities, criteria, quiz } = data;
if (!course?.id || course.slug !== "project-launch-lab" || modules.length !== 2 ||
    activities.length !== 18 || activities.filter(item => item.is_published).length !== 4 ||
    criteria.length !== 7 || quiz.length !== 10 ||
    ![...modules, ...activities, ...criteria, ...quiz].every(row => row.course_id === course.id)) {
  throw new Error("The course-only fixture has unexpected counts or ownership.");
}
const quote = value => "'" + JSON.stringify(value).replaceAll("'", "''") + "'";
const insert = (table, fields, value, many = true) => {
  const cols = fields.join(", ");
  return "insert into public." + table + " (" + cols + ") select " + cols +
    " from jsonb_populate_record" + (many ? "set" : "") + "(null::public." +
    table + ", " + quote(value) + "::jsonb);";
};
writeFileSync(seedPath, [
  "begin;",
  "set local standard_conforming_strings = on;",
  "delete from public.pll_courses where slug = 'project-launch-lab';",
  insert("pll_courses", ["id", "slug", "title", "description", "created_at"], course, false),
  insert("pll_modules", ["id", "course_id", "module_number", "title", "is_published"], modules),
  insert("pll_activities", ["id", "course_id", "module_id", "slug", "title", "instructions", "due_at", "is_published"], activities),
  insert("pll_rubric_criteria", ["id", "activity_id", "course_id", "position", "title", "description", "maximum_points"], criteria),
  insert("pll_quiz_questions", ["course_id", "position", "prompt", "options", "correct_option", "explanation"], quiz),
  "commit;",
].join("\n"), { mode: 0o600 });
