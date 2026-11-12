import { commentsPropertyInOptions } from "../../constants.js";
import { indent, softline } from "../../document/index.js";
import isNonEmptyArray from "../../utilities/is-non-empty-array.js";
import { locEnd, locStart } from "../location/index.js";
import { shouldIgnoredExpressionStatementPrintLeadingSemicolon } from "../semicolon/semicolon.js";
import { shouldIgnoredNodePrintSemicolon } from "../semicolon/should-ignored-node-print-semicolon.js";

function printIgnored(path, options /* , print*/) {
  const { node } = path;
  let start = locStart(node);
  let end = locEnd(node);

  // Keep the parentheses around an ignored root expression of embedded code
  // (e.g. Vue attribute value), the whole root range is the original text
  if (path.parent?.type === "JsExpressionRoot" && node.extra?.parenthesized) {
    start = Math.min(start, locStart(path.parent));
    end = Math.max(end, locEnd(path.parent));

    // Comments inside the parentheses are already part of the text
    const printedComments = options[Symbol.for("printedComments")];
    for (const comment of options[commentsPropertyInOptions]) {
      if (locStart(comment) >= start && locEnd(comment) <= end) {
        printedComments.add(comment);
        comment.printed = true;
      }
    }
  }

  let text = options.originalText.slice(start, end);

  if (options.semi) {
    if (shouldIgnoredNodePrintSemicolon(path)) {
      text += ";";
    }
  } else if (
    shouldIgnoredExpressionStatementPrintLeadingSemicolon(path, options)
  ) {
    text = `;${text}`;
  }

  if (node.type === "ClassExpression" && isNonEmptyArray(node.decorators)) {
    return [indent([softline, text]), softline];
  }

  return text;
}

export { printIgnored };
