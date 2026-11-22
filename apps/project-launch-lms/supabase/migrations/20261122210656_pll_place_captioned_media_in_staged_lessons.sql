do $course_media$
declare changed integer;
begin
 with updated as (
   update public.pll_activities a
   set instructions = replace(a.instructions, e.existing, e.media || E'\n\n' || e.existing)
   from public.pll_courses c,
        (values
           ('project-direction-lesson','[[project-direction-lesson]]','[[direction-video]]'),
           ('first-step-mini-lesson','[[first-step-mini-lesson]]','[[first-move-video]]')
        ) as e(slug, existing, media)
   where c.slug='project-launch-lab' and a.course_id=c.id and a.slug=e.slug and not a.is_published
     and strpos(a.instructions,e.existing)>0 and strpos(a.instructions,e.media)=0
   returning a.id
 )
 select count(*) into changed from updated;
 if changed <> 2 then raise exception 'Expected both unpublished module media placements'; end if;
end
$course_media$;