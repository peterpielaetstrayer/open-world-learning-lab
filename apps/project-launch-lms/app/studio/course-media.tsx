const mediaItems = {
  "overview": {
    "title": "Your Curiosity Is a Starting Point",
    "scenes": [
      [
        "Start with a question",
        "Have you ever had an idea and then wondered what you would actually do first?"
      ],
      [
        "Find a direction you care about",
        "Maybe you wanted to make something useful, learn a skill, investigate a question, or improve something around you. The challenge is finding a direction you care about and a first step you can really learn from."
      ],
      [
        "Discover & Define",
        "In Module One, compare possible projects. Does this matter to me? Could I realistically begin? Is the idea focused enough to make progress? Choose a direction and explain your reasoning in a Project Direction Brief."
      ],
      [
        "Plan & Launch",
        "In Module Two, learn to plan a safe, manageable first move. Study an example, practice decisions, and plan an action for your own project."
      ],
      [
        "Use evidence or explain a barrier",
        "If you can safely attempt the action, document what you observe. If a real obstacle prevents the attempt, describe it honestly and choose a reasonable next step."
      ],
      [
        "Feedback informs your decision",
        "You will receive feedback and make your own decisions. Your Launch Portfolio will show your purpose, your plan, your evidence, and what you learned."
      ],
      [
        "What could you try first?",
        "You don't need special equipment, an expensive idea, or a perfect result. You need curiosity, careful thinking, and a willingness to make your next move."
      ]
    ]
  },
  "direction": {
    "title": "Three Lenses, One Decision",
    "scenes": [
      [
        "Start with something that matters",
        "Jordan wants to help new students find their way around school. She compares making an illustrated guide to the whole school with testing one page about a single hard-to-find room."
      ],
      [
        "Relevance",
        "Relevance asks why the project matters. Both ideas could help new students, and Jordan enjoys making illustrations."
      ],
      [
        "Feasibility",
        "Feasibility asks what Jordan could begin with the time and resources she has. One page can start with a sketch and feedback from a trusted adult."
      ],
      [
        "Scope",
        "Scope asks how focused the idea is. A guide to the entire school may be too big for the first attempt. One room gives Jordan a clear boundary."
      ],
      [
        "Choose a direction and a tradeoff",
        "Jordan chooses the smaller guide. She gives up wide coverage for now and gains a first draft she can learn from. Use these lenses when you compare your own directions."
      ]
    ]
  },
  "firstmove": {
    "title": "An Informative First Move",
    "scenes": [
      [
        "Start with the purpose",
        "Maya wants to improve her school garden. Before she can redesign it, she needs permission and a spot with suitable light."
      ],
      [
        "Put milestones in order",
        "First ask a staff sponsor about permission. Next sketch one possible bed and note the sunlight. Then review the plan with the sponsor and decide whether to continue."
      ],
      [
        "Plan for a real constraint",
        "Maya can sketch and observe without planting. If she cannot visit the site safely, she can document that barrier and ask what information the sponsor can share."
      ],
      [
        "Describe actual evidence",
        "A dated sketch or a short note about the sunlight could help compare locations. One observation cannot prove that a garden will thrive across a whole season."
      ],
      [
        "Use feedback to decide",
        "Feedback might lead Maya to choose another spot or gather more evidence. For your project, name one safe action, one useful observation, and one thing it would not prove."
      ]
    ]
  }
} as const;

export function CourseMedia({ item, review = false }: { item: keyof typeof mediaItems; review?: boolean }) {
  const media = mediaItems[item];
  return <section className="course-how" aria-label={media.title}>
    <p><strong>{media.title}</strong></p>
    {item === "direction" && <p>Watch Jordan compare two school-guide ideas using relevance, feasibility and scope. Notice what she gains and what she postpones by choosing a smaller first version. In the interactive lesson that follows, apply the same lenses to Tessa’s drawing project. You can use the transcript instead of the video.</p>}
    <video controls playsInline preload="metadata" aria-label={media.title} style={{ width: "100%", maxWidth: "50rem" }}>
      <source src={`${review ? "/review-materials" : "/media"}/${item}.mp4`} type="video/mp4" />
      <track default kind="captions" src={`${review ? "/review-materials" : "/media"}/${item}.vtt`} srcLang="en" label="English" />
      Read the transcript below for the complete lesson.
    </video>
    <details>
      <summary>Read the transcript</summary>
      {media.scenes.map(([heading, text]) => <p key={heading}><strong>{heading}.</strong> {text}</p>)}
    </details>
  </section>;
}
