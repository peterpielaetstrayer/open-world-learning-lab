import { CourseMedia } from "./course-media";
import { FirstMoveStudio } from "./first-move-studio";
import { ProjectDirectionLesson, type LessonProgressIdentity } from "./project-direction-lesson";
import { EntryDiagnostic } from "./entry-diagnostic";
import { DirectionComparison } from "./direction-comparison";
import { GauntletBridge } from "./gauntlet-bridge";
import { FirstMoveCard } from "./first-move-card";
import { FirstMoveRevision } from "./first-move-revision";
import { FirstMoveEvidence } from "./first-move-evidence";
import { FirstStepMiniLesson, MayaGardenModel, FirstStepChecks } from "./first-step-foundations";
import { LevelTwoExitCheck } from "./level-two-exit-check";

export function getResourceUrl(text: string): URL | null {
  if (!/^https:\/\/\S+$/.test(text)) return null;
  try {
    const url = new URL(text);
    return url.hostname ? url : null;
  } catch {
    return null;
  }
}

// Deliberately narrow inline syntax: React escapes all authored text.
// Never interpret arbitrary HTML or expand the allowed link protocols.
function inlineEmphasis(text: string) {
  return text.split(/(\*\*[^*\n]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part);
}

export function LessonText({ text, lessonProgress, onPrepareResponse, headingLevel = 4, review = false, finalized = false, onStructuredDirty }: {
  text: string; headingLevel?: 3 | 4; lessonProgress?: LessonProgressIdentity; onPrepareResponse?: (text: string) => boolean; review?: boolean; finalized?: boolean; onStructuredDirty?: (dirty: boolean) => void;
}) {
  const blocks: string[] = [];
  for (const block of text.trim().split(/\r?\n\s*\r?\n/)) {
    const last = blocks.at(-1);
    if (last && [last, block].every(part => part.split(/\r?\n/).every(line => /^\d+\. /.test(line)))) {
      blocks[blocks.length - 1] = last + "\n" + block;
    } else {
      blocks.push(block);
    }
  }
  const Heading = headingLevel === 3 ? "h3" : "h4";
  return blocks.map((block, index) => {
    const lines = block.split(/\r?\n/);
    const key = `${index}-${lines[0]}`;
    if (block === "[[direction-video]]") return <CourseMedia key={key} item="direction" review={review} />;
    if (block === "[[first-move-video]]") return <CourseMedia key={key} item="firstmove" review={review} />;
    if (block === "[[first-move-studio]]") return finalized ? <p key={key} className="form-note">Your scenario checklist has been shared. See your final response and feedback below.</p> : <FirstMoveStudio key={key} review={review} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[project-direction-lesson]]") return <ProjectDirectionLesson key={key} progress={lessonProgress} onPrepareResponse={onPrepareResponse} />;
    if (block === "[[entry-diagnostic]]") return finalized ? <p key={key} className="form-note">Your starting reflection has been shared. See your final response and feedback below.</p> : <EntryDiagnostic key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[direction-comparison]]") return finalized ? <p key={key} className="form-note">Your comparison has been shared. See your final response and feedback below.</p> : <DirectionComparison key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[gauntlet-bridge]]") return <GauntletBridge key={key} />;
    if (block === "[[first-move-card]]") return finalized ? <p key={key} className="form-note">Your First Move Card has been shared. See your final response and feedback below.</p> : <FirstMoveCard key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[first-move-revision]]") return finalized ? <p key={key} className="form-note">Your revision record has been shared. See your final response and feedback below.</p> : <FirstMoveRevision key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[first-move-evidence]]") return finalized ? <p key={key} className="form-note">Your evidence record has been shared. See your final response and feedback below.</p> : <FirstMoveEvidence key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (block === "[[first-step-mini-lesson]]") return <FirstStepMiniLesson key={key} />;
    if (block === "[[maya-garden-model]]") return <MayaGardenModel key={key} />;
    if (block === "[[first-step-checks]]") return <FirstStepChecks key={key} />;
    if (block === "[[level-two-exit-check]]") return finalized ? <p key={key} className="form-note">Your exit reflection has been shared. See your final response and feedback below.</p> : <LevelTwoExitCheck key={key} onPrepareResponse={onPrepareResponse} progress={lessonProgress} onStructuredDirty={onStructuredDirty} />;
    if (lines.every(line => /^\d+\. /.test(line))) {
      return <ol key={key}>{lines.map((line, position) => <li key={position}>{inlineEmphasis(line.replace(/^\d+\. /, ""))}</li>)}</ol>;
    }
    if (lines.every(line => /^- /.test(line))) {
      return <ul key={key}>{lines.map((line, position) => <li key={position}>{inlineEmphasis(line.slice(2))}</li>)}</ul>;
    }
    const resource = getResourceUrl(block);
    if (resource) {
      return <p key={key}><a className="back-link" href={resource.href} target="_blank" rel="noopener noreferrer">
        {resource.hostname === "project-launch-gauntlet.vercel.app" ? "Open Project Launch Gauntlet" : `Open ${resource.hostname}`} (opens in new tab)
      </a></p>;
    }
    const heading = lines[0].match(/^#{1,4} (.+)$/);
    if (heading) {
      return <div key={key}>
        <Heading>{inlineEmphasis(heading[1])}</Heading>
        {lines.length > 1 && <p className="prewrap">{inlineEmphasis(lines.slice(1).join("\n"))}</p>}
      </div>;
    }
    return <p key={key} className="prewrap">{inlineEmphasis(block)}</p>;
  });
}
