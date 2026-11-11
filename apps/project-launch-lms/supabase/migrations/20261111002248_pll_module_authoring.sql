grant insert (course_id, title, module_number) on public.pll_modules to authenticated;
grant update (title, module_number) on public.pll_modules to authenticated;

create policy pll_module_facilitator_create on public.pll_modules
  for insert to authenticated
  with check (private.pll_has_role(course_id, 'facilitator') and not is_published);

alter policy pll_module_facilitator_publish on public.pll_modules
  rename to pll_module_facilitator_edit;
