do $course_description$
begin
 update public.pll_courses set description=$next$Welcome to Project Launch Lab. Bring an interest or question you would like to explore. You will compare two possible directions, choose a feasible project, and learn something useful by trying a small first action.

### Discover & Define

Open Discover & Define and work through the available activities in order. Use the Gauntlet to see how relevance, feasibility, and scope affect a choice. Apply the same criteria to two ideas of your own and submit your Project Direction Brief.

### Plan & Launch

Bring your chosen direction into Plan & Launch. In First Move Studio, use Ari’s scenario to practice choosing a test and interpreting evidence. Share course questions in Discussions and read your facilitator’s comments under Feedback. Use the Launch Portfolio to document your plan, evidence, and next decision.

### Finish the course

Take the ten-question knowledge check. Review the feedback on your submissions and complete the course evaluation. Use Course questions in Discussions if you need help finding or completing a step.$next$
 where slug='project-launch-lab' and description=$prior$Welcome to Project Launch Lab. Bring an interest or question you would like to explore. You will compare two possible directions, choose a feasible project, and learn something useful by trying a small first action.

### Discover & Define

Begin with Practice choosing a direction. Use the Gauntlet to see how relevance, feasibility, and scope affect a choice. Apply the same criteria to two ideas of your own and submit your Project Direction Brief.

### Plan & Launch

Bring your chosen direction into First Move Studio. Use Maya’s example to practice choosing a test and interpreting evidence. Ask for feedback in Discussions, then document your plan, evidence, and next decision in the Launch Portfolio.

### Finish the course

Take the ten-question knowledge check. Review the feedback on your submissions and complete the course evaluation. Use Course questions in Discussions if you need help finding or completing a step.$prior$;
 if not found then raise exception 'Course home changed; review before updating.'; end if;
end
$course_description$;