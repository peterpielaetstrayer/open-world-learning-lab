create table public.pll_quiz_questions (
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  position smallint not null check (position between 1 and 10),
  prompt text not null,
  options text[] not null check (cardinality(options) between 2 and 6),
  correct_option smallint not null check (correct_option between 1 and cardinality(options)),
  explanation text not null,
  primary key (course_id, position)
);
create table public.pll_quiz_attempts (
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  learner_id uuid not null references auth.users(id),
  score smallint not null check (score between 0 and 10),
  feedback jsonb not null,
  submitted_at timestamptz not null default now(),
  primary key(course_id, learner_id)
);
create index pll_quiz_attempts_learner on public.pll_quiz_attempts(learner_id);

alter table public.pll_quiz_questions enable row level security;
alter table public.pll_quiz_attempts enable row level security;
revoke all on public.pll_quiz_questions, public.pll_quiz_attempts from public, anon, authenticated;
grant select (course_id, position, prompt, options) on public.pll_quiz_questions to authenticated;
grant select on public.pll_quiz_attempts to authenticated;

create policy pll_quiz_member_questions on public.pll_quiz_questions
  for select to authenticated using (private.pll_is_member(course_id));
create policy pll_quiz_attempt_read on public.pll_quiz_attempts
  for select to authenticated using (private.pll_has_role(course_id, 'facilitator') or
    (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner')));

-- Grade using the answer key, which is unavailable through the question read API.
create function private.pll_submit_quiz(p_course_id uuid, p_answers smallint[])
returns void language plpgsql security definer set search_path = ''
as $$
declare
  total_questions integer;
  total_correct integer;
  results jsonb;
begin
  if not private.pll_has_role(p_course_id, 'learner') then
    raise exception 'Only a learner enrolled in this course can submit the quiz.';
  end if;
  if cardinality(p_answers) is distinct from 10 or array_position(p_answers, null) is not null then
    raise exception 'Answer all ten questions before submitting.';
  end if;

  select count(*), count(*) filter (where p_answers[q.position] = q.correct_option),
    jsonb_agg(jsonb_build_object(
      'position', q.position, 'selected', p_answers[q.position],
      'correct', p_answers[q.position] = q.correct_option,
      'explanation', q.explanation
    ) order by q.position)
  into total_questions, total_correct, results
  from public.pll_quiz_questions q
  where q.course_id = p_course_id and p_answers[q.position] between 1 and cardinality(q.options);

  if total_questions <> 10 then raise exception 'The quiz is incomplete or contains an invalid answer.'; end if;
  insert into public.pll_quiz_attempts(course_id,learner_id,score,feedback)
    values(p_course_id, auth.uid(), total_correct, results);
end;
$$;

revoke all on function private.pll_submit_quiz(uuid, smallint[]) from public, anon, authenticated;
grant execute on function private.pll_submit_quiz(uuid, smallint[]) to authenticated;

create function public.pll_submit_quiz(p_course_id uuid, p_answers smallint[])
returns void language sql security invoker set search_path = ''
as $$ select private.pll_submit_quiz(p_course_id, p_answers); $$;

revoke all on function public.pll_submit_quiz(uuid, smallint[]) from public, anon, authenticated;
grant execute on function public.pll_submit_quiz(uuid, smallint[]) to authenticated;

insert into public.pll_quiz_questions(course_id,position,prompt,options,correct_option,explanation)
select c.id,q.position,q.prompt,q.options,q.correct_option,q.explanation
from public.pll_courses c cross join (values
(1,'Maya has 20 minutes and wants to know whether she can enter on beat one. Which first action fits that question?',array['Record the entire tutorial series','Record and play back just the count-in and first beat','Ask whether the track sounds professional'],2,'The short sample directly tests the audible cue and can be revised within the available time.'),
(2,'What does personal relevance help you decide?',array['Whether the direction matters enough to pursue','Whether you already have all the resources','Whether the project fits on one page'],1,'Relevance connects the direction to an interest or question that matters to you.'),
(3,'Which is the clearest example of narrowing scope?',array['Try every kind of rhythm tutorial','Create one short track for a beginner learning to enter on beat one','Buy equipment before defining the project'],2,'One audience, one skill, and one deliverable make the direction manageable.'),
(4,'Which question most directly checks feasibility?',array['Will it impress other people?','What resources, time, and support do I actually have?','Can I make the goal bigger?'],2,'Feasibility depends on the resources and constraints you can plan around.'),
(5,'A peer says your test is too broad. What is the most useful response?',array['Ask what part of the test could answer your immediate question','Remove the feedback from your plan','Complete the whole project before testing'],1,'Clarify the question and choose the smallest action that could answer it.'),
(6,'Maya misses beat one in two playbacks. What can she conclude?',array['The guide will fail for all beginners','The cue needs revision in her current test setup','The whole project should be abandoned'],2,'The observation supports a revision in Maya’s setup. Claims about beginners need additional evidence.'),
(7,'Noise makes your recording unusable. What should your evidence record include?',array['A successful result you expected to see','Only the date of the test','What you tried, what blocked the observation, and what you will do next'],3,'A documented obstacle can guide a next step even when the intended observation is unavailable.'),
(8,'Which evidence would best show whether a revised cue helped Maya?',array['The size of the audio file','A repeat of the same playback check after changing the cue','A list of favorite songs'],2,'Repeating a comparable check lets Maya see whether the revision changed the result she cares about.'),
(9,'What belongs in a Project Direction Brief?',array['A choice between ideas and the tradeoff behind it','A completed final project','A score with no explanation'],1,'The brief shows how you evaluated possibilities and justified the direction you chose.'),
(10,'Which Launch Portfolio response makes the strongest case for a next move?',array['I will keep going because I like the idea','My peer suggested a change, so I copied it','I observed this result, considered this feedback, and chose this next step for this reason'],3,'A strong next step follows from both the evidence and the feedback, with reasoning the reviewer can inspect.')
) as q(position,prompt,options,correct_option,explanation)
where c.slug='project-launch-lab';
