import * as React from "react";

/**
 * MarkdownLite — a tiny, deterministic markdown renderer tuned for article bodies.
 * Supports: h2, h3, paragraphs, bold, italic, inline code, ordered/unordered lists, hr.
 *
 * Not a full markdown parser; just enough for the curated encyclopedia content.
 * Heading ids are slugified so the floating TOC's anchor links resolve.
 */
export function MarkdownLite({ source }: { source: string }) {
  const blocks = React.useMemo(() => parseBlocks(source), [source]);
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={slugify(b.content)}>
                {renderInline(b.content)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(b.content)}>
                {renderInline(b.content)}
              </h3>
            );
          case "hr":
            return <hr key={i} />;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case "blockquote":
            return <blockquote key={i}>{renderInline(b.content)}</blockquote>;
          default:
            return <p key={i}>{renderInline(b.content)}</p>;
        }
      })}
    </>
  );
}

type Block =
  | { type: "p" | "h2" | "h3" | "blockquote"; content: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "hr" };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", content: para.join(" ") });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: list.kind, items: list.items });
      list = null;
    }
  };

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: "h2", content: line.replace(/^##\s+/, "") });
      continue;
    }
    if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: "h3", content: line.replace(/^###\s+/, "") });
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushPara();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }
    if (/^>\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: "blockquote", content: line.replace(/^>\s+/, "") });
      continue;
    }
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(ol[2]);
      continue;
    }
    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  // Order matters: code > bold > italic > links
  // `code`
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;

  const patterns: Array<{ re: RegExp; render: (m: RegExpExecArray) => React.ReactNode }> = [
    { re: /`([^`]+)`/, render: (m) => <code key={key++}>{m[1]}</code> },
    { re: /\*\*([^*]+)\*\*/, render: (m) => <strong key={key++}>{m[1]}</strong> },
    { re: /\*([^*]+)\*/, render: (m) => <em key={key++}>{m[1]}</em> },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => (
        <a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer">
          {m[1]}
        </a>
      )
    }
  ];

  outer: while (rest.length) {
    for (const p of patterns) {
      const m = p.re.exec(rest);
      if (m && typeof m.index === "number") {
        if (m.index > 0) parts.push(rest.slice(0, m.index));
        parts.push(p.render(m));
        rest = rest.slice(m.index + m[0].length);
        continue outer;
      }
    }
    parts.push(rest);
    break;
  }

  return parts;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
