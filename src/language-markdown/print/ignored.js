/**
 * @import AstPath from "../../common/ast-path.js";
 * @import {Doc} from "../../document/index.js";
 */

/**
 * @param {AstPath} path
 * @param {*} options
 * @returns {Doc}
 */
function printPrettierIgnored(path, options) {
  const { start } = path.node.position;
  let startOffset = start.offset;

  // The ignore comment may be embedded in a preceding html block, which
  // already ended at a blank line; keep the indentation of our first line.
  if (path.previous?.type === "html" && path.parent.type === "root") {
    const lineStart = startOffset - (start.column - 1);
    if (options.originalText.slice(lineStart, startOffset).trim() === "") {
      startOffset = lineStart;
    }
  }

  const originalText = options.originalText.slice(
    startOffset,
    path.node.position.end.offset,
  );

  if (options.parser === "mdx") {
    return originalText;
  }

  switch (path.node.type) {
    case "list":
      if (
        path.findAncestor((p) => p.type === "blockquote") &&
        options.proseWrap !== "always"
      ) {
        return originalText.replace(/\n>\s*$/, "");
      }
      return originalText;
    default:
      return originalText;
  }
}

export { printPrettierIgnored };
