/* Public faculty course review: static, read-only, no user session or data requests. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  function node(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function button(text, action, className = "") {
    const element = node("button", className, text);
    element.type = "button";
    element.addEventListener("click", action);
    return element;
  }
  function screen(name, title, subtitle = "") {
    const section = node("section", "review-screen");
    section.dataset.screen = name;
    section.hidden = true;
    section.append(node("p", "review-kicker", "Project Launch Lab · Read-only course review"));
    section.append(node("h1", "review-screen-title", title));
    if (subtitle) section.append(node("p", "review-screen-lead", subtitle));
    return section;
  }
  function init() {
    const main = $("#content");
    const oldHeader = $("body > header");
    if (!main || !oldHeader) return;
    const source = {
      one: $("#module-1", main),
      two: $("#module-2", main),
      assessments: $("#assessments", main),
      resources: $("#resources", main),
      evaluation: $("#evaluation", main),
    };
    if (Object.values(source).some((item) => !item)) return;
    const lessons = [source.one, source.two].map((section, moduleIndex) =>
      $$(".activity", section).filter((detail) => detail.parentElement === section).map((detail, index) => {
        const summary = $("summary", detail);
        const title = summary ? summary.textContent.trim() : "Activity " + (index + 1);
        const content = node("article", "review-lesson");
        content.hidden = true;
        content.dataset.lesson = moduleIndex + "-" + index;
        const heading = node("h2", "review-lesson-title", title);
        heading.tabIndex = -1;
        content.append(heading);
        Array.from(detail.childNodes).forEach((child) => {
          if (child !== summary) content.append(child);
        });
        return { title, content };
      })
    );
    if (lessons[0].length !== 7 || lessons[1].length !== 11) return;
    const titles = ["Discover & Define", "Plan & Launch"];
    main.replaceChildren();

    const home = screen("home", "Project Launch Lab", "Turning Curiosity Into a Meaningful Project in the AI Age");
    const welcome = node("div", "review-welcome");
    welcome.innerHTML = '<p class="review-kicker">WELCOME TO YOUR COURSE</p><h2>From curiosity to an informed first move.</h2><p>Choose a meaningful project direction, plan a safe first action, gather honest evidence, and decide what you will do next. Follow the pathway through two connected modules.</p>';
    home.append(welcome);
    const journey = node("div", "review-journey");
    titles.forEach((title, i) => {
      const card = node("div", "review-journey-card");
      card.append(node("p", "review-kicker", "MODULE 0" + (i + 1)));
      card.append(node("h3", "", title));
      card.append(node("p", "", i === 0
        ? "Identify interests, evaluate two possibilities, and formulate a focused project direction."
        : "Plan an achievable first move, learn from evidence or a genuine barrier, and explain your next decision."));
      card.append(button("Explore module " + (i + 1), () => selectLesson(i, 0, true), "review-primary"));
      journey.append(card);
    });
    home.append(journey);
    const guide = node("div", "review-info");
    guide.innerHTML = '<h3>How to use this course</h3><p>Start with Module 1, move through the activities in order, and carry your Project Direction Brief into Module 2. The rubric, knowledge check, reflection, and course evaluation are available from the course navigation.</p><p><strong>Faculty review:</strong> This presentation includes instructional materials and assessment previews. Learner workspaces, submissions, answer keys, feedback records, and grading controls are available only through the protected LMS.</p>';
    home.append(guide);

    const moduleScreen = screen("modules", "Modules", "Follow the course one activity at a time. Choose an activity to inspect its instructional content.");
    const moduleTabs = node("div", "review-module-tabs");
    moduleTabs.setAttribute("role", "group");
    moduleTabs.setAttribute("aria-label", "Choose module");
    const moduleTabButtons = titles.map((title, i) => button("0" + (i + 1) + " · " + title, () => selectLesson(i, 0, true)));
    moduleTabButtons.forEach((item) => moduleTabs.append(item));
    const moduleGrid = node("div", "review-module-grid");
    const outline = node("nav", "review-outline");
    outline.setAttribute("aria-label", "Module activity navigation");
    const outlineHeading = node("h2", "review-outline-heading", "Module activities");
    const lessonList = node("div", "review-lesson-list");
    outline.append(outlineHeading, lessonList);
    const lessonArea = node("div", "review-lesson-area");
    const stepFooter = node("div", "review-lesson-actions");
    const prevButton = button("Previous activity", () => moveLesson(-1), "review-secondary");
    const nextButton = button("Next activity", () => moveLesson(1), "review-primary");
    stepFooter.append(prevButton, nextButton);
    lessonArea.append(stepFooter);
    moduleGrid.append(outline, lessonArea);
    moduleScreen.append(moduleTabs, moduleGrid);

    const assignments = screen("assignments", "Assignments & rubrics", "Inspect the graded work and the performance criteria learners use before submitting.");
    const quiz = screen("quiz", "Knowledge & reflection", "Kirkpatrick Level 2 · knowledge, applied skills, attitudes, confidence, and commitment.");
    const assessmentSource = source.assessments;
    let target = assignments;
    for (const child of Array.from(assessmentSource.children)) {
      if (child.tagName === "H2") continue;
      if (child.tagName === "H3" && /Knowledge check|Attitudes/i.test(child.textContent)) target = quiz;
      target.append(child);
    }
    // Reviewed question stems and choices only. Never include correctness or explanations.
    const previewQuestions = [{"position":1,"prompt":"Ari has 20 minutes and wants to know whether they can enter on beat one. Which first action fits that question?","options":["Record the entire tutorial series","Record and play back just the count-in and first beat","Ask whether the track sounds professional"]},{"position":2,"prompt":"What does personal relevance help you decide?","options":["Whether the direction matters enough to pursue","Whether you already have all the resources","Whether the project fits on one page"]},{"position":3,"prompt":"Which is the clearest example of narrowing scope?","options":["Try every kind of rhythm tutorial","Create one short track for a beginner learning to enter on beat one","Buy equipment before defining the project"]},{"position":4,"prompt":"Which question most directly checks feasibility?","options":["Will it impress other people?","What resources, time, and support do I actually have?","Can I make the goal bigger?"]},{"position":5,"prompt":"A peer says your test is too broad. What is the most useful response?","options":["Ask what part of the test could answer your immediate question","Remove the feedback from your plan","Complete the whole project before testing"]},{"position":6,"prompt":"Ari misses beat one in two playbacks. What can they conclude?","options":["The guide will fail for all beginners","The cue needs revision in the current test setup","The whole project should be abandoned"]},{"position":7,"prompt":"Noise makes your recording unusable. What should your evidence record include?","options":["A successful result you expected to see","Only the date of the test","What you tried, what blocked the observation, and what you will do next"]},{"position":8,"prompt":"Which evidence would best show whether a revised cue helped Ari?","options":["The size of the audio file","A repeat of the same playback check after changing the cue","A list of favorite songs"]},{"position":9,"prompt":"What belongs in a Project Direction Brief?","options":["A choice between ideas and the tradeoff behind it","A completed final project","A score with no explanation"]},{"position":10,"prompt":"Which Launch Portfolio response makes the strongest case for a next move?","options":["I will keep going because I like the idea","My peer suggested a change, so I copied it","I observed this result, considered this feedback, and chose this next step for this reason"]}];
    const heading = $("h3", quiz).find((h) => h.textContent.startsWith("Knowledge check"));
    const attitudesHeading = $("h3", quiz).find((h) => h.textContent.startsWith("Attitudes"));
    if (heading && attitudesHeading) {
      let candidate = heading.nextSibling;
      while (candidate && candidate !== attitudesHeading) {
        const next = candidate.nextSibling;
        candidate.remove();
        candidate = next;
      }
      heading.textContent = "Knowledge check · 10 questions";
      const intro = node("p", "review-info", "All ten authored knowledge-check questions and answer choices are presented for design review. Correct answers, explanations, scoring, and submission are retained in the protected learner experience.");
      quiz.insertBefore(intro, attitudesHeading);
      const questions = node("ol", "review-question-preview");
      previewQuestions.forEach((question) => {
        const item = node("li", "review-question");
        item.append(node("strong", "", question.prompt));
        const choices = node("ol", "review-answer-options");
        question.options.forEach((option) => choices.append(node("li", "", option)));
        item.append(choices);
        questions.append(item);
      });
      quiz.insertBefore(questions, attitudesHeading);
    }

    const evaluation = screen("evaluation", "Course evaluation", "Kirkpatrick Level 1 · anonymous course-reaction prompts, ten ratings and an optional comment.");
    while (source.evaluation.firstChild) evaluation.append(source.evaluation.firstChild);
    const resources = screen("resources", "Resources & media", "Original videos, English captions, transcripts, and blank project worksheets.");
    while (source.resources.firstChild) resources.append(source.resources.firstChild);
    const discussion = screen("discussions", "Discussions", "Two facilitated discussion spaces support questions and peer exchange.");
    const discussionInfo = node("div", "review-info");
    discussionInfo.innerHTML = "<h2>Conversation stays with enrolled learners</h2><p>Project Launch Lab includes two discussion areas in the authenticated LMS. Course questions and peer exchange help learners request guidance and compare approaches. Discussion submissions and participant identities are intentionally not published in the faculty's read-only view.</p>";
    discussion.append(discussionInfo);

    const views = { home, modules: moduleScreen, assignments, quiz, discussions: discussion, resources, evaluation };
    Object.values(views).forEach((view) => main.append(view));
    const labels = [
      ["home", "Home"], ["modules", "Modules"], ["assignments", "Assignments"],
      ["quiz", "Quiz & reflection"], ["discussions", "Discussions"],
      ["resources", "Resources"], ["evaluation", "Evaluation"]
    ];
    const menu = node("nav", "review-course-nav");
    menu.setAttribute("aria-label", "Course navigation");
    const menuButtons = new Map();
    labels.forEach(([id, label]) => {
      const item = button(label, () => show(id, true), "review-nav-button");
      menuButtons.set(id, item);
      menu.append(item);
    });

    oldHeader.replaceChildren();
    oldHeader.className = "review-site-header";
    const brand = node("div", "review-brand");
    brand.innerHTML = '<span aria-hidden="true" class="review-brand-mark">✳</span><span><strong>Open World Learning Lab</strong><small>Project Launch Lab · Faculty review</small></span>';
    oldHeader.append(brand);
    oldHeader.append(node("span", "review-top-label", "Read-only course"));

    const shell = node("div", "review-shell");
    main.parentNode.insertBefore(shell, main);
    shell.append(menu, main);
    document.body.classList.add("review-lms");
    main.classList.add("review-content");

    let activeView = "home", activeModule = 0, activeIndex = 0;
    function show(id, focus, updateHash = true) {
      const newView = views[id] ? id : "home";
      activeView = newView;
      Object.entries(views).forEach(([key, section]) => { section.hidden = key !== newView; });
      for (const [key, item] of menuButtons) {
        if (key === newView) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      }
      if (updateHash) history.replaceState(null, "", "#" + newView);
      if (focus) {
        const heading = $("h1", views[newView]);
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
    function moveLesson(direction) {
      const next = activeIndex + direction;
      if (next >= 0 && next < lessons[activeModule].length) selectLesson(activeModule, next, true);
      else if (next >= lessons[activeModule].length && activeModule === 0) selectLesson(1, 0, true);
      else if (next < 0 && activeModule === 1) selectLesson(0, lessons[0].length - 1, true);
      else if (next >= lessons[activeModule].length && activeModule === 1) show("assignments", true);
    }
    function selectLesson(moduleIndex, lessonIndex, focus, updateHash = true) {
      activeModule = moduleIndex;
      activeIndex = lessonIndex;
      moduleTabButtons.forEach((item, i) => {
        item.setAttribute("aria-pressed", String(i === moduleIndex));
      });
      outlineHeading.textContent = "Module " + (moduleIndex + 1) + " · " + titles[moduleIndex];
      lessonList.replaceChildren();
      lessons[moduleIndex].forEach((lesson, i) => {
        const item = button((i + 1) + ". " + lesson.title, () => selectLesson(moduleIndex, i, true), "review-outline-button");
        if (i === lessonIndex) item.setAttribute("aria-current", "page");
        lessonList.append(item);
      });
      lessons.flat().forEach((lesson) => { lesson.content.hidden = true; lesson.content.remove(); });
      const current = lessons[moduleIndex][lessonIndex].content;
      current.hidden = false;
      lessonArea.insertBefore(current, stepFooter);
      prevButton.disabled = activeModule === 0 && activeIndex === 0;
      nextButton.textContent = (activeModule === 1 && activeIndex === lessons[1].length - 1)
        ? "Finish modules" : "Next activity";
      show("modules", false, false);
      if (updateHash) history.replaceState(null, "", "#modules/" + (moduleIndex + 1) + "/" + (lessonIndex + 1));
      if (focus) { $("h2", current).focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: "instant" }); }
    }
    selectLesson(0, 0, false, false);
    const fragment = window.location.hash.slice(1);
    const match = fragment.match(/^modules\/([12])\/(\d+)$/);
    if (match) {
      const m = Number(match[1]) - 1;
      const i = Math.min(Math.max(0, Number(match[2]) - 1), lessons[m].length - 1);
      selectLesson(m, i, false, false);
    } else if (fragment === "module-2") selectLesson(1, 0, false, false);
    else if (fragment === "module-1") selectLesson(0, 0, false, false);
    else show(views[fragment] ? fragment : "home", false, false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
