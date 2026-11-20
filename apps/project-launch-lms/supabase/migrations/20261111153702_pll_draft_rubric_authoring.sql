grant insert (activity_id, course_id, position, title, description, maximum_points)
  on public.pll_rubric_criteria to authenticated;
grant delete on public.pll_rubric_criteria to authenticated;

create policy pll_rubric_facilitator_insert on public.pll_rubric_criteria
  for insert to authenticated
  with check (private.pll_has_role(course_id, 'facilitator'));
create policy pll_rubric_facilitator_delete on public.pll_rubric_criteria
  for delete to authenticated
  using (private.pll_has_role(course_id, 'facilitator'));

-- Serialize every rubric change with the parent assignment's publication and submission FK.
create function private.pll_require_editable_rubric()
returns trigger language plpgsql security invoker set search_path = ''
as $$
declare
  assignment_id uuid;
  published boolean;
begin
  assignment_id := case when tg_op = 'DELETE' then old.activity_id else new.activity_id end;
  select is_published into published from public.pll_activities where id = assignment_id for update;
  if not found and tg_op = 'DELETE' then
    return old; -- Parent deletion cascades to its rubric.
  end if;
  if not found or published or exists (
    select 1 from public.pll_submissions where activity_id = assignment_id
  ) then
    raise exception 'Rubrics can only be changed on draft assignments without submissions.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger pll_require_editable_rubric
  before insert or delete on public.pll_rubric_criteria
  for each row execute function private.pll_require_editable_rubric();

create function public.pll_save_draft_rubric(p_activity_id uuid, p_criteria jsonb)
returns void language plpgsql security invoker set search_path = ''
as $$
declare
  selected_course uuid;
  published boolean;
begin
  select course_id, is_published into selected_course, published
  from public.pll_activities
  where id = p_activity_id and private.pll_has_role(course_id, 'facilitator')
  for update;

  if not found then
    raise exception 'You do not have access to edit this rubric.';
  end if;
  if published or exists (
    select 1 from public.pll_submissions where activity_id = p_activity_id
  ) then
    raise exception 'Rubrics can only be changed on draft assignments without submissions.';
  end if;

  if p_criteria is null or jsonb_typeof(p_criteria) <> 'array' then
    raise exception 'Provide a list of rubric criteria.';
  end if;
  if jsonb_array_length(p_criteria) not between 1 and 20 then
    raise exception 'Enter between 1 and 20 rubric criteria.';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_criteria) as r(title text, description text, points numeric)
    where length(trim(coalesce(title, ''))) not between 1 and 180
      or length(coalesce(description, '')) > 4000
      or points is null or points not between 0.01 and 1000 or points <> round(points, 2)
  ) then
    raise exception 'Give each criterion a title and a valid point value.';
  end if;

  delete from public.pll_rubric_criteria where activity_id = p_activity_id;
  insert into public.pll_rubric_criteria (activity_id, course_id, position, title, description, maximum_points)
  select p_activity_id, selected_course, item.position::smallint, trim(item.criterion->>'title'),
    coalesce(item.criterion->>'description', ''), (item.criterion->>'points')::numeric
  from jsonb_array_elements(p_criteria) with ordinality as item(criterion, position);
end;
$$;

revoke all on function public.pll_save_draft_rubric(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.pll_save_draft_rubric(uuid, jsonb) to authenticated;