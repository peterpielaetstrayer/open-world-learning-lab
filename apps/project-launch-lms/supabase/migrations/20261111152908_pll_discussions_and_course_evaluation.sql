create table public.pll_discussion_posts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  channel text not null check (channel in ('questions', 'peer-feedback')),
  author_id uuid not null default auth.uid() references auth.users(id),
  parent_id uuid,
  body text not null check (length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique (id, course_id, channel),
  foreign key (parent_id, course_id, channel)
    references public.pll_discussion_posts(id, course_id, channel)
);
create index pll_discussions_course_channel on public.pll_discussion_posts(course_id, channel, created_at);
create index pll_discussions_author on public.pll_discussion_posts(author_id);
create index pll_discussions_parent on public.pll_discussion_posts(parent_id, course_id, channel);

create table public.pll_course_evaluations (
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  learner_id uuid not null default auth.uid() references auth.users(id),
  ratings smallint[] not null check (
    cardinality(ratings) = 10 and array_position(ratings, null) is null
    and ratings <@ array[1,2,3,4,5]::smallint[]
  ),
  comments text not null default '' check (length(comments) <= 4000),
  submitted_at timestamptz not null default now(),
  primary key (course_id, learner_id)
);
create index pll_evaluation_learner on public.pll_course_evaluations(learner_id);

alter table public.pll_discussion_posts enable row level security;
alter table public.pll_course_evaluations enable row level security;
revoke all on public.pll_discussion_posts, public.pll_course_evaluations from public, anon, authenticated;
grant select on public.pll_discussion_posts, public.pll_course_evaluations to authenticated;
grant insert (course_id, channel, parent_id, body) on public.pll_discussion_posts to authenticated;
grant insert (course_id, ratings, comments) on public.pll_course_evaluations to authenticated;

create policy pll_discussions_member_read on public.pll_discussion_posts for select to authenticated
  using (private.pll_is_member(course_id));
create policy pll_discussions_member_post on public.pll_discussion_posts for insert to authenticated
  with check (author_id = (select auth.uid()) and private.pll_is_member(course_id));
create policy pll_evaluation_read on public.pll_course_evaluations for select to authenticated
  using (private.pll_has_role(course_id, 'facilitator') or
    (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner')));
create policy pll_evaluation_submit on public.pll_course_evaluations for insert to authenticated
  with check (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner'));
