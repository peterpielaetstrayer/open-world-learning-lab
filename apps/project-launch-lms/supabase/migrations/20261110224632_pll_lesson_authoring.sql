-- Allow facilitators to author lesson text within their own courses.
grant update (is_published) on public.pll_modules to authenticated;
grant insert (course_id, module_id, slug, title, instructions, is_published)
  on public.pll_activities to authenticated;
grant update (title, instructions, is_published)
  on public.pll_activities to authenticated;

create policy pll_module_facilitator_publish on public.pll_modules
  for update to authenticated
  using (private.pll_has_role(course_id, 'facilitator'))
  with check (private.pll_has_role(course_id, 'facilitator'));

create policy pll_activity_facilitator_create on public.pll_activities
  for insert to authenticated
  with check (private.pll_has_role(course_id, 'facilitator'));

create policy pll_activity_facilitator_edit on public.pll_activities
  for update to authenticated
  using (private.pll_has_role(course_id, 'facilitator'))
  with check (private.pll_has_role(course_id, 'facilitator'));

alter policy pll_activity_member_read on public.pll_activities
  using (
    private.pll_has_role(course_id, 'facilitator')
    or (
      is_published
      and private.pll_has_role(course_id, 'learner')
      and exists (
        select 1 from public.pll_modules m
        where m.id = pll_activities.module_id and m.course_id = pll_activities.course_id
          and m.is_published
      )
    )
  );
