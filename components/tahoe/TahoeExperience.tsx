"use client";

import { useState } from "react";
import Link from "next/link";
import { tahoeZones, sampleMissions } from "@/content/projects";

const zoneDetails = [
  { id:"lake", number:"01", name:"Lake as System", short:"Lake", description:"The lake is a living systems classroom. Water clarity, ecology, climate, tourism, land use, and public stewardship are connected.", question:"How does a decision on land change what happens in the water?", artifact:"Field dataset or mini-documentary", position:"tahoe-pin-lake", symbol:"≈" },
  { id:"mountain", number:"02", name:"Mountain as Lab", short:"Mountain", description:"The slope becomes a laboratory for momentum, torque, biomechanics, risk, feedback, and the mathematics of meaningful practice.", question:"What can a single movement teach us about forces?", artifact:"Annotated movement replay", position:"tahoe-pin-mountain", symbol:"△" },
  { id:"trail", number:"03", name:"Trail as Text", short:"Trail", description:"A trail invites close reading of geology, plant life, navigation, land use, endurance, and the stories written into a landscape.", question:"What does this path reveal about the place and its people?", artifact:"Field guide or annotated route", position:"tahoe-pin-trail", symbol:"⌁" },
  { id:"fire", number:"04", name:"Campfire as Seminar", short:"Campfire", description:"Around food and fire, chemistry meets anthropology, storytelling, civic conversation, ethics, and the rituals that connect people.", question:"What does a shared meal reveal about civilization?", artifact:"Reflective essay or oral defense", position:"tahoe-pin-fire", symbol:"✳" }
] as const;

const missionSymbols = [
  <svg key="flip" viewBox="0 0 200 128" aria-hidden="true"><path d="M8 107Q80 -15 181 97" fill="none" stroke="currentColor" strokeDasharray="5 8" strokeWidth="2"/><path d="M43 86l35-46 18 24 28-40 48 70" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="130" cy="38" r="10" fill="none" stroke="currentColor"/><path d="M114 25l29 24m-12-30l-11 31" stroke="currentColor" strokeWidth="2"/></svg>,
  <svg key="water" viewBox="0 0 200 128" aria-hidden="true"><path d="M4 70Q51 35 98 70T196 70M4 87Q51 52 98 87T196 87M4 105Q51 70 98 105T196 105" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M51 22v83M100 8v105M151 22v83" stroke="currentColor" strokeDasharray="3 6"/><circle cx="100" cy="40" r="17" fill="none" stroke="currentColor"/></svg>,
  <svg key="trail" viewBox="0 0 200 128" aria-hidden="true"><path d="M10 30Q66 5 106 50T194 41M10 61Q64 35 106 75T194 65M10 91Q64 62 106 105T194 96" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M36 126Q62 75 101 84T172 7" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 6"/><circle cx="101" cy="84" r="7" fill="currentColor"/></svg>,
  <svg key="fire" viewBox="0 0 200 128" aria-hidden="true"><path d="M54 107Q63 75 76 52Q77 90 93 61Q102 26 107 17Q130 55 121 73Q151 53 141 90Q142 117 113 118H81Q53 117 54 107Z" fill="currentColor" opacity=".7"/><path d="M23 120L175 121M38 126L159 99M45 98L173 126" stroke="currentColor" strokeLinecap="round" strokeWidth="6"/></svg>
];

function TahoeVista() {
  return <svg className="tahoe-vista" viewBox="0 0 1600 850" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="tahoeSky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b5ad88"/><stop offset=".42" stopColor="#677d80"/><stop offset="1" stopColor="#142f37"/></linearGradient>
      <linearGradient id="tahoeWater" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#729f98"/><stop offset=".34" stopColor="#2e6872"/><stop offset="1" stopColor="#082b36"/></linearGradient>
      <linearGradient id="tahoeRidge" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#68807a"/><stop offset="1" stopColor="#243d3a"/></linearGradient>
      <radialGradient id="tahoeGlow"><stop stopColor="#fff2b3" stopOpacity=".85"/><stop offset=".4" stopColor="#f5c87e" stopOpacity=".28"/><stop offset="1" stopColor="#f7d08c" stopOpacity="0"/></radialGradient>
      <filter id="tahoeSoft"><feGaussianBlur stdDeviation="22"/></filter>
      <pattern id="tahoeTrees" width="59" height="100" patternUnits="userSpaceOnUse"><path d="M25 95V19M2 72L25 20L48 72M7 58L25 14L45 59" fill="none" stroke="#081f21" strokeWidth="8" strokeLinejoin="round" opacity=".46"/></pattern>
    </defs>
    <rect width="1600" height="850" fill="url(#tahoeSky)"/>
    <ellipse cx="1255" cy="187" rx="390" ry="310" fill="url(#tahoeGlow)"/>
    <ellipse cx="1300" cy="207" rx="290" ry="22" fill="#fff1c2" opacity=".15" filter="url(#tahoeSoft)"/>
    <path d="M0 420L135 358L244 386L389 253L471 325L588 209L674 283L790 173L881 266L1030 146L1148 273L1284 157L1407 267L1515 186L1600 250V625H0Z" fill="#8c9d99" opacity=".58"/>
    <path d="M0 470L120 381L274 410L412 263L484 339L596 218L690 299L795 181L882 272L1031 159L1140 280L1279 170L1398 280L1515 199L1600 286V618H0Z" fill="url(#tahoeRidge)"/>
    <path d="M360 321L412 263L468 338L436 324L420 306L410 289L394 319Z M750 226L795 181L847 236L818 220L800 202L781 221Z M986 201L1031 159L1104 247L1057 219L1034 189L1017 205Z M1240 211L1279 170L1337 241L1305 223L1284 194L1269 208Z M1481 235L1515 199L1555 254L1528 243L1516 218Z" fill="#e4e4da" opacity=".87"/>
    <path d="M0 483Q220 452 353 488T708 472Q918 454 1104 478T1600 475V850H0Z" fill="url(#tahoeWater)"/>
    <g fill="none" stroke="#c1d9ce" opacity=".3" strokeWidth="2"><path d="M165 528Q420 509 725 523T1490 525"/><path d="M100 566Q540 541 880 560T1570 551"/><path d="M240 622Q820 595 1420 624"/><path d="M0 718Q590 692 1260 709T1600 708"/><path d="M400 754Q870 738 1520 759"/></g>
    <path d="M0 500Q102 461 177 491Q273 513 335 506L379 567L320 631L215 656L0 622Z" fill="#1e423d"/>
    <path d="M1204 497Q1315 462 1403 489L1600 481V695L1458 660L1320 579Z" fill="#173932"/>
    <path d="M0 556L295 530L452 675L382 850H0ZM1600 564L1380 540L1210 754L1237 850H1600Z" fill="#123029"/>
    <path d="M0 565L295 530L452 675L382 850H0ZM1600 564L1380 540L1210 754L1237 850H1600Z" fill="url(#tahoeTrees)" opacity=".78"/>
    <path d="M0 752Q250 629 489 736Q694 832 861 764L1007 850H0Z" fill="#102a25"/><path d="M1600 724Q1460 636 1310 704Q1200 747 1158 850H1600Z" fill="#102a25"/>
    <g fill="none" stroke="#dec48b" strokeWidth="1.3" opacity=".42"><path d="M67 664C219 618 313 622 393 683S590 768 756 700S1026 637 1223 693"/><path d="M86 687C234 640 332 649 416 707S603 787 768 725S1042 659 1229 715"/><path d="M1090 150Q1265 47 1468 119" strokeDasharray="4 9"/><circle cx="1260" cy="168" r="102" strokeDasharray="3 9"/></g>
    <g fill="#e7c98d"><circle cx="393" cy="683" r="4"/><circle cx="756" cy="700" r="4"/><circle cx="1223" cy="693" r="4"/></g>
  </svg>;
}

function AtlasMap() {
  const [active, setActive] = useState(0);
  const zone = zoneDetails[active];
  const topics = tahoeZones[active].concepts;
  return <section id="atlas" className="tahoe-atlas tahoe-section" aria-labelledby="tahoe-atlas-heading">
    <div className="tahoe-container">
      <div className="tahoe-section-heading tahoe-atlas-heading">
        <div><span className="tahoe-kicker">02 / The living atlas</span><h2 id="tahoe-atlas-heading">A place can become<br/><em>a learning system.</em></h2></div>
        <p>Every landscape contains countless entry points to rigorous inquiry. Select a zone to see the questions, disciplines, and potential learner creations it could connect.</p>
      </div>
      <div className="tahoe-atlas-ui">
        <div className="tahoe-map" role="group" aria-label="Illustrative learning-zone atlas">
          <span className="tahoe-map-label">Field map / Tahoe Basin / Concept</span>
          <span className="tahoe-compass" aria-hidden="true">N ↑</span>
          <svg className="tahoe-contours" viewBox="0 0 760 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs><radialGradient id="tahoeMapFill"><stop stopColor="#284e47"/><stop offset="1" stopColor="#102721"/></radialGradient></defs><rect width="760" height="620" fill="url(#tahoeMapFill)"/>
            {Array.from({length:11}, (_,i)=><ellipse key={i} cx="378" cy="296" rx={95+i*31} ry={42+i*26} transform="rotate(-27 378 296)" stroke="#76ac9b" strokeOpacity=".11" fill="none"/>)}
            <path d="M310 106Q466 135 452 220Q575 319 469 407Q375 448 291 386Q217 325 273 236Q249 166 310 106Z" fill="#2b7476" fillOpacity=".46" stroke="#92d0ba" strokeOpacity=".42"/>
            <path d="M102 402C195 372 275 443 352 380S503 290 641 320" fill="none" stroke="#dab879" strokeDasharray="5 10" strokeOpacity=".7"/>
            <path d="M190 120Q325 180 356 316T580 503" fill="none" stroke="#dab879" strokeDasharray="5 10" strokeOpacity=".45"/>
            <g fill="#d4b47f" opacity=".9"><circle cx="356" cy="316" r="4"/><circle cx="466" cy="405" r="3"/></g>
          </svg>
          {zoneDetails.map((item,i)=><button key={item.id} type="button" className={["tahoe-zone-pin",item.position,active===i?"is-active":""].join(" ")} aria-pressed={active===i} aria-controls="tahoe-zone-details" onClick={()=>setActive(i)}><span className="tahoe-pin-mark" aria-hidden="true"/>{item.short}</button>)}
          <span className="tahoe-map-bottom">Four interconnected inquiry zones · Not a navigation map</span>
        </div>
        <div className="tahoe-atlas-details" id="tahoe-zone-details" aria-live="polite" aria-atomic="true">
          <div className="tahoe-detail-overline">Zone {zone.number} / 04</div>
          <div><span className="tahoe-detail-symbol" aria-hidden="true">{zone.symbol}</span><h3>{zone.name}</h3><p>{zone.description}</p><div className="tahoe-topics">{topics.map(t=><span key={t}>{t}</span>)}</div></div>
          <div className="tahoe-detail-foot"><span>Inquiry prompt</span><strong>{zone.question}</strong><p>{zone.artifact} <span aria-hidden="true">↗</span></p></div>
        </div>
      </div>
      <p className="tahoe-map-note">Conceptual illustration. Zone placement is imaginative, not geographically accurate.</p>
    </div>
  </section>;
}

function FlipStudy(){
  const [value,setValue] = useState(35);
  const t=value/100, x=165+340*t, y=260-180*4*t*(1-t)-5*t;
  return <section className="tahoe-flip tahoe-section" id="flip" aria-labelledby="tahoe-flip-heading">
    <div className="tahoe-container tahoe-flip-grid">
      <div className="tahoe-flip-copy">
        <span className="tahoe-kicker">03 / The original question</span>
        <h2 id="tahoe-flip-heading">What if you could <em>pause curiosity?</em></h2>
        <p>At sixteen, I noticed something: peers who had little interest in classroom math could care deeply about landing a flip on the mountain.</p>
        <p>What if learners could revisit that exact moment to investigate rotation, timing, force, and movement, then apply what they discovered to something that mattered to them?</p>
        <div className="tahoe-ink-rule"/>
        <p className="tahoe-flip-emphasis">Experience becomes the invitation. Inquiry brings rigor. Practice makes it real.</p>
      </div>
      <div className="tahoe-motion-panel">
        <div className="tahoe-motion-top"><span>Field experiment / OWL-M01</span><span>Movement study · Concept</span></div>
        <svg className="tahoe-motion-svg" viewBox="0 0 620 355" role="img" aria-label="Illustrative snowboard trajectory. Adjust the slider below to rotate and move the rider across the drawing.">
          <g stroke="#89bdac" strokeOpacity=".17" strokeWidth="1">{[75,145,215,285].map(n=><path key={"h"+n} d={"M0 "+n+"H620"}/>)}{[100,200,300,400,500].map(n=><path key={"v"+n} d={"M"+n+" 0V355"}/>)}</g>
          <path d="M0 318L102 306Q148 298 175 270L250 312H620V355H0Z" fill="#bcd7c9" fillOpacity=".15"/>
          <path d="M165 260Q307 12 505 240" fill="none" stroke="#addcc7" strokeWidth="2" strokeDasharray="5 8" opacity=".75"/>
          <g transform={"translate("+x.toFixed(1)+" "+y.toFixed(1)+")"}><g transform={"rotate("+(360*t).toFixed(1)+")"}>
            <rect x="-26" y="20" width="84" height="8" rx="4" fill="#e4b76f" transform="rotate(-14)"/>
            <path d="M6 18L-5 -6M-5 -6L-26 -15M-5 -6L15 -20M5 17L-17 25M5 17L28 22" stroke="#e7f1e9" fill="none" strokeWidth="9" strokeLinecap="round"/>
            <circle cx="-5" cy="-23" r="9" fill="#e7f1e9"/>
          </g></g>
          <g fill="#dfc58d" fontSize="11" fontFamily="monospace"><text x="22" y="54">CAPTURE → OBSERVE → INQUIRE</text><text x="445" y="54">REFLECT</text><text x="24" y="338">TAKEOFF</text><text x="528" y="338">LANDING</text></g>
        </svg>
        <div className="tahoe-motion-stats"><div><span>Replay point</span><strong>{String(value).padStart(2,"0")}%</strong></div><div><span>Question</span><strong>Rotation</strong></div><div><span>Possible evidence</span><strong>Annotated replay</strong></div></div>
        <label className="tahoe-scrub" htmlFor="tahoe-motion-slider"><span>Scrub</span><input id="tahoe-motion-slider" type="range" min="0" max="100" step="1" value={value} onChange={e=>setValue(Number(e.target.value))}/><span>100%</span></label>
        <p className="tahoe-motion-disclaimer">Illustrative thinking tool only. The movement is not a physics simulation, captured athlete data, or an evaluation of safe technique.</p>
      </div>
    </div>
  </section>;
}

function MissionGallery(){
  return <section id="missions" className="tahoe-missions tahoe-section" aria-labelledby="tahoe-missions-heading">
    <div className="tahoe-container">
      <div className="tahoe-section-heading"><div><span className="tahoe-kicker">04 / Field briefs · imagined missions</span><h2 id="tahoe-missions-heading">Four missions.<br/><em>Four ways to make meaning.</em></h2></div><p>Real environments are not the curriculum by themselves. Each sample mission connects experience to questions, mentorship, inquiry, creation, and reflection.</p></div>
      <div className="tahoe-mission-grid">{sampleMissions.map((m,i)=><article className="tahoe-mission" key={m.title}>
        <div className={["tahoe-mission-illustration","tahoe-mission-ill-"+i].join(" ")}>{missionSymbols[i]}</div>
        <div className="tahoe-mission-body"><p className="tahoe-mission-index">Field brief · OWL-M0{i+1}</p><h3>{m.title}</h3><p>{m.description}</p><div className="tahoe-mission-topics">{m.concepts.slice(0,3).map(x=><span key={x}>{x}</span>)}</div><div className="tahoe-mission-artifact"><span>Potential artifact</span><strong>{m.artifact}</strong></div></div>
      </article>)}</div>
      <p className="tahoe-mission-note">These are untested design sketches, not active OWLL classes or enrollment opportunities.</p>
    </div>
  </section>;
}

export default function TahoeExperience(){
  return <main className="tahoe-page">
    <section className="tahoe-hero" aria-labelledby="tahoe-title">
      <TahoeVista/><div className="tahoe-hero-vignette" aria-hidden="true"/><div className="tahoe-hero-side">39° N / SIERRA NEVADA / ORIGIN STUDY</div>
      <div className="tahoe-container tahoe-hero-content"><div className="tahoe-hero-eyebrow"><span/>Open World Learning Lab · Origin 001</div><h1 id="tahoe-title">Open World<br/><em>Tahoe.</em></h1>
        <p>What if the world itself could become an interconnected learning environment?</p>
        <div className="tahoe-hero-actions"><a href="#story" className="tahoe-hero-button tahoe-hero-button-primary">Discover the origin <span aria-hidden="true">↓</span></a><a href="#atlas" className="tahoe-hero-button">Explore the atlas <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="tahoe-hero-foot">Lake · Mountain · Trail · Campfire</div>
    </section>
    <div className="tahoe-concept-strip"><div className="tahoe-container"><span>Origin study / archived concept</span><p>This is the thought experiment that helped start OWLL, not an operating school, accredited program, or enrollment offer.</p></div></div>
    <section id="story" className="tahoe-story tahoe-section" aria-labelledby="tahoe-story-heading"><div className="tahoe-container tahoe-story-grid">
      <div><span className="tahoe-kicker">01 / A personal origin</span><h2 id="tahoe-story-heading">The world was <em>already there.</em></h2><div className="tahoe-story-line"/><p className="tahoe-story-lead">I grew up in Tahoe, where the distance between learning and living often felt smaller than it did inside a classroom.</p></div>
      <div><p>The mountain, the lake, the weather, the trails, the boats, the seasons: they were not abstractions. They were daily reality.</p><p>When I was sixteen, I remember watching peers on independent study spend much of their time skiing. Some of them did not seem to care about math in the classroom. But they cared deeply about landing a flip.</p>
      <blockquote>Maybe students do not hate knowledge. Maybe they hate knowledge removed from reality.</blockquote><p>That question became Open World Tahoe: an early sketch of what education might become if curiosity about the real world could lead into rigorous, supported inquiry.</p></div>
    </div></section>
    <AtlasMap/><FlipStudy/>
    <section className="tahoe-sequence" aria-labelledby="tahoe-sequence-heading"><div className="tahoe-container"><span className="tahoe-kicker">The learning architecture</span><h2 id="tahoe-sequence-heading">Freedom needs <em>good structure.</em></h2><p>Open-world learning does not mean sending learners out and hoping learning happens. It means designing intentional pathways with mentors, tools, constraints, practice, feedback, and meaningful demonstrations of understanding.</p><ol className="tahoe-sequence-list">{["Experience","Curiosity","Guided inquiry","Knowledge","Practice","Artifact","Reflection"].map((s,i)=><li key={s}><span>{String(i+1).padStart(2,"0")}</span><strong>{s}</strong></li>)}</ol></div></section>
    <MissionGallery/>
    <section className="tahoe-closing tahoe-section" aria-labelledby="tahoe-closing-heading"><div className="tahoe-container tahoe-closing-grid"><div><span className="tahoe-kicker">05 / What survived the origin</span><h2 id="tahoe-closing-heading">Learning begins<br/>with <em>attention.</em></h2></div><div><p>Tahoe began with ambitious ideas about spatial technology, live exploration, and globally connected learners. OWLL has since become broader and more grounded.</p><p>The ideas that endured are simpler and more demanding: places matter, mentorship matters, meaningful artifacts matter, and reflection changes how we see the world. Technology should follow demonstrated educational needs, not lead the work by default.</p><p>Every environment also has history, ecology, community, and limits to respect. A responsible learning design accounts for them.</p><Link href="/work" className="tahoe-closing-link">Explore current OWLL work <span aria-hidden="true">↗</span></Link></div></div></section>
  </main>;
}
