const PHRASING_PARENTS = new Set(["paragraph", "heading", "tableCell"]);
const TRANSPARENT_TYPES = new Set([
  "text",
  "emphasis",
  "strong",
  "delete",
  ...PHRASING_PARENTS,
]);
const MASK_CHARACTER = "x";

const isWhitespace = (character) =>
  character === undefined || /\s/u.test(character);
const isAlphanumeric = (character) =>
  character !== undefined && /[\p{Letter}\p{Number}]/u.test(character);
const isDigit = (character) => character !== undefined && /\d/u.test(character);

function isEscaped(text, index) {
  let count = 0;
  while (index > count && text[index - 1 - count] === "\\") {
    count++;
  }
  return count % 2 === 1;
}

function collectRanges(ast) {
  const allowed = [];
  const forbidden = [];

  const visit = (node, inPhrasing) => {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    const phrasing = inPhrasing || PHRASING_PARENTS.has(node.type);

    if (phrasing && !PHRASING_PARENTS.has(node.type)) {
      if (node.type === "link" && node.children?.length > 0) {
        // Keep the label, forbid the destination
        forbidden.push([node.children.at(-1).position.end.offset, end]);
      } else if (!TRANSPARENT_TYPES.has(node.type)) {
        forbidden.push([start, end]);
        return;
      }
    }

    if (PHRASING_PARENTS.has(node.type)) {
      allowed.push([start, end]);
    }

    if (node.children) {
      for (const child of node.children) {
        visit(child, phrasing);
      }
    }
  };

  visit(ast, false);
  return { allowed, forbidden };
}

function findCandidates(text, { allowed, forbidden }) {
  const blocked = new Uint8Array(text.length);
  for (const [start, end] of forbidden) {
    blocked.fill(1, start, end);
  }
  const isAllowed = new Uint8Array(text.length);
  for (const [start, end] of allowed) {
    isAllowed.fill(1, start, end);
  }

  const candidates = [];
  let index = 0;
  while (index < text.length) {
    if (
      text[index] !== "$" ||
      blocked[index] ||
      !isAllowed[index] ||
      isEscaped(text, index) ||
      isAlphanumeric(text[index - 1]) ||
      isWhitespace(text[index + 1]) ||
      text[index + 1] === "$"
    ) {
      index++;
      continue;
    }

    let close = -1;
    for (let i = index + 1; i < text.length; i++) {
      const character = text[i];
      if (character === "\n" || blocked[i] || !isAllowed[i]) {
        break;
      }
      if (character === "$" && !isEscaped(text, i)) {
        if (
          !isWhitespace(text[i - 1]) &&
          !isDigit(text[i + 1]) &&
          text[i + 1] !== "$"
        ) {
          close = i;
        }
        break;
      }
    }

    if (close === -1) {
      index++;
    } else {
      candidates.push([index, close + 1]);
      index = close + 1;
    }
  }

  return candidates;
}

function mask(text, candidates) {
  let result = "";
  let last = 0;
  for (const [start, end] of candidates) {
    result +=
      text.slice(last, start + 1) +
      MASK_CHARACTER.repeat(end - start - 2) +
      "$";
    last = end;
  }
  return result + text.slice(last);
}

function splitTextNodes(ast, candidates, getValue) {
  let converted = 0;
  const visit = (node) => {
    if (!node.children) {
      return;
    }
    const children = [];
    for (const child of node.children) {
      if (child.type !== "text" || !child.position) {
        visit(child);
        children.push(child);
        continue;
      }
      const start = child.position.start.offset;
      const end = child.position.end.offset;
      let cursor = start;
      let changed = false;
      for (const [from, to] of candidates) {
        if (from < start || to > end) {
          continue;
        }
        changed = true;
        if (from > cursor) {
          children.push(sliceText(child, cursor, from, start, getValue));
        }
        children.push({
          type: "inlineMath",
          value: "",
          position: {
            start: offsetPosition(child, from, start),
            end: offsetPosition(child, to, start),
          },
        });
        converted++;
        cursor = to;
      }
      if (!changed) {
        children.push(child);
      } else if (cursor < end) {
        children.push(sliceText(child, cursor, end, start, getValue));
      }
    }
    node.children = children;
  };
  visit(ast);
  return converted;
}

function offsetPosition(node, offset, nodeStart) {
  const { start } = node.position;
  return {
    line: start.line,
    column: start.column + offset - nodeStart,
    offset,
  };
}

function sliceText(node, from, to, nodeStart, getValue) {
  return {
    type: "text",
    value:
      node.value.length === node.position.end.offset - nodeStart
        ? node.value.slice(from - nodeStart, to - nodeStart)
        : getValue(from, to),
    position: {
      start: offsetPosition(node, from, nodeStart),
      end: offsetPosition(node, to, nodeStart),
    },
  };
}

/**
 * `singleDollarTextMath: false` is used to avoid false positives, but it
 * makes genuine `$...$` formulas subject to markdown parsing (`*`, `_`).
 * Recover them: find strict single-dollar candidates, mask their content,
 * re-parse, then turn them into `inlineMath` nodes.
 */
function recoverInlineMath(ast, content, parse) {
  const candidates = findCandidates(content, collectRanges(ast));
  if (candidates.length === 0) {
    return ast;
  }

  const masked = mask(content, candidates);
  const maskedAst = parse(masked);

  // Fall back to the original AST unless every candidate was converted,
  // otherwise masked characters could leak into the output
  // Text values containing escapes or entities are shorter than their source
  // ranges, so derive the value of such pieces by parsing the source slice
  let failed = false;
  const getValue = (from, to) => {
    const wrapped = parse(`x${masked.slice(from, to)}x`);
    const children = wrapped.children[0]?.children;
    if (
      children?.length === 1 &&
      children[0].type === "text" &&
      children[0].value.length >= 2
    ) {
      return children[0].value.slice(1, -1);
    }
    failed = true;
    return "";
  };

  const converted = splitTextNodes(maskedAst, candidates, getValue);
  return !failed && converted === candidates.length ? maskedAst : ast;
}

export { recoverInlineMath };
