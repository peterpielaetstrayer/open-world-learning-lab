create function public.pll_portfolio_is_open(p_course_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $function$
  select exists (
    select 1
    from public.pll_activities a
    join public.pll_rubric_criteria c on c.activity_id=a.id and c.course_id=a.course_id
    where a.course_id=p_course_id and a.slug='launch-portfolio' and a.is_published
      and (private.pll_has_role(p_course_id,'learner') or private.pll_has_role(p_course_id,'facilitator'))
    group by a.id
    having count(*)=4 and bool_and(c.maximum_points=15)
      and array_agg(c.title::text order by c.position)=array[
        'Purpose and planning coherence','Resources, constraints, and feasibility',
        'First action and evidence interpretation','Feedback, revision, and next decision'
      ]::text[]
  ) and not exists (
    select 1 from pg_catalog.pg_policy
    where polname in ('pll_launch_portfolio_submission_hold',
      'pll_launch_portfolio_score_insert_hold','pll_launch_portfolio_score_update_hold')
      and polrelid in ('public.pll_submissions'::pg_catalog.regclass,'public.pll_rubric_scores'::pg_catalog.regclass)
  );
$function$;
revoke execute on function public.pll_portfolio_is_open(uuid) from public, anon;
grant execute on function public.pll_portfolio_is_open(uuid) to authenticated;

create function private.pll_require_portfolio_score_band()
returns trigger language plpgsql set search_path = ''
as $function$
begin
  if NEW.awarded_points not in (0,5,10,15)
     and exists (select 1 from public.pll_activities a
                 where a.id=NEW.activity_id and a.course_id=NEW.course_id and a.slug='launch-portfolio') then
    raise exception 'Select an academic Portfolio performance level: 0, 5, 10, or 15 points.'
      using errcode='23514';
  end if;
  return NEW;
end
$function$;
revoke execute on function private.pll_require_portfolio_score_band() from public, anon;
create trigger pll_portfolio_score_band
before insert or update on public.pll_rubric_scores
for each row execute function private.pll_require_portfolio_score_band();