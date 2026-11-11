export function getResourceUrl(text: string): URL | null {
  if (!/^https:\/\/\S+$/.test(text)) return null;
  try {
    const url = new URL(text);
    return url.hostname ? url : null;
  } catch {
    return null;
  }
}

export function LessonText({ text }: { text: string }) {
  return text.trim().split(/\r?\n\s*\r?\n/).map((block, index) => {
    const lines = block.split(/\r?\n/);
    const key = `${index}-${lines[0]}`;
    if (lines.every(line => /^\d+\. /.test(line))) {
      return <ol key={key}>{lines.map((line, position) => <li key={position}>{line.replace(/^\d+\. /, "").replaceAll("**", "")}</li>)}</ol>;
    }
    if (lines.every(line => /^- /.test(line))) {
      return <ul key={key}>{lines.map((line, position) => <li key={position}>{line.slice(2).replaceAll("**", "")}</li>)}</ul>;
    }
    const resource = getResourceUrl(block);
    if (resource) {
      return <p key={key}><a className="back-link" href={resource.href} target="_blank" rel="noopener noreferrer">
        Open {resource.hostname} (opens in new tab)
      </a></p>;
    }
    const heading = lines[0].match(/^#{1,4} (.+)$/);
    if (heading) {
      return <div key={key}>
        <h4>{heading[1]}</h4>
        {lines.length > 1 && <p className="prewrap">{lines.slice(1).join("\n")}</p>}
      </div>;
    }
    return <p key={key} className="prewrap">{block.replaceAll("**", "")}</p>;
  });
}
