// Illustrative design scenarios; these are not study findings.
export const learningExamples = {
  mountain: {
    number: "01",
    title: "Why did that turn feel different?",
    intro:
      "A skier in Tahoe notices that one turn feels steadier than another. A familiar activity opens a question about balance, motion and practice.",
    notice: "Two turns look similar, but one feels steadier.",
    ask: "How might body position affect balance through a turn?",
    investigate:
      "With a mentor, compare drawings or existing recordings of two turns. Mark one difference in body position and explain what it might change. What else could account for the difference?",
    return:
      "Recall your explanation, then look at another example together. Does it still help? Add what changed and what you would need to investigate next.",
    concepts: "Motion · forces · observation · evidence",
    bridge:
      "An annotated sketch can connect a felt experience to ideas about balance and forces. The learner's explanation makes that connection visible; a mentor can question it and help identify useful sources. Any practical skiing instruction belongs with a qualified instructor.",
  },
  shoreline: {
    number: "02",
    title: "What left this line of leaves?",
    intro:
      "Near a shoreline, leaves form a narrow line along a path. The pattern offers a clue—but it does not yet tell us what happened.",
    notice: "Leaves have collected in a narrow line along the edge of a path.",
    ask: "What could have moved them here?",
    investigate:
      "Observe from a safe spot. Sketch the pattern, compare another location, and consider what evidence would distinguish runoff from rising water.",
    return:
      "Recall your first explanation. On a later visit, compare the pattern and record what changed.",
    concepts: "Water systems · geography · patterns · competing explanations",
    bridge:
      "A sketch of the path, its slope and the leaf line can connect the observation to drainage and changing water levels. Comparing conditions across visits helps the learner distinguish an explanation from a first guess.",
  },
  everyday: {
    number: "03",
    title: "Why is the shadow longer now?",
    intro:
      "A patch of light moves across a familiar room. An ordinary moment opens a way to investigate patterns, measurement and change.",
    notice: "The same object casts a different shadow later in the day.",
    ask: "What could explain the change in the shadow's length and direction?",
    investigate:
      "Make two sketches at different times from the same safe position. Compare direction and length, then explain what your observations do and do not show.",
    return:
      "Predict the shadow before looking again. Use what you observe to revise the explanation.",
    concepts: "Light · measurement · time · prediction",
    bridge:
      "Drawings labeled with time, length and direction turn an everyday observation into a simple record. A diagram of the light source, object and surface helps connect that record to geometry and form a prediction to check later.",
  },
} as const;
