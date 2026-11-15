import { isPragma } from "../pragma.js";

function massageAstNode(original, cloned /* , parent */) {
  switch (original.type) {
    case "comment":
      // insert pragma
      if (isPragma(original.value)) {
        return null;
      }
      break;
    case "quoteDouble":
    case "quoteSingle":
      cloned.type = "quote";
      break;
    case "root":
      // Own-line comments after a scalar value may be re-attached to a
      // different node when the output is parsed again, so compare them as a
      // flat list instead of by position.
      cloned.comments = collectAttachedComments(cloned);
      break;
    case "document":
      // We may insert explicit marks
      if (!cloned.directivesEndMarker) {
        delete cloned.directivesEndMarker;
      }
      if (!cloned.documentEndMarker) {
        delete cloned.documentEndMarker;
      }
      break;
  }
}
function collectAttachedComments(node) {
  const comments = [];
  (function walk(node) {
    if (Array.isArray(node)) {
      for (const child of node) {
        walk(child);
      }
      return;
    }
    if (!node || typeof node !== "object") {
      return;
    }
    for (const key of ["leadingComments", "endComments"]) {
      if (Array.isArray(node[key])) {
        comments.push(...node[key].map((comment) => comment.value));
        node[key] = [];
      }
    }
    for (const key of ["children", "content"]) {
      walk(node[key]);
    }
  })(node);
  return comments.sort();
}

massageAstNode.ignoredProperties = new Set(["position"]);

export { massageAstNode };
