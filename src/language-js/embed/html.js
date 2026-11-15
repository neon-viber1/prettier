import {
  group,
  hardline,
  indent,
  label,
  line,
  mapDoc,
} from "../../document/index.js";
import {
  printEmbeddedTemplateExpressions,
  uncookTemplateElementValue,
} from "../print/template-literal.js";
import { hasLanguageComment, isAngularComponentTemplate } from "./utilities.js";

// The counter is needed to distinguish nested embeds.
let htmlTemplateLiteralCounter = 0;
async function printEmbedHtmlLike(parser, textToDoc, print, path, options) {
  const { node } = path;
  const counter = htmlTemplateLiteralCounter;
  htmlTemplateLiteralCounter = (htmlTemplateLiteralCounter + 1) >>> 0;

  const composePlaceholder = (index) =>
    `PRETTIER_HTML_PLACEHOLDER_${index}_${counter}_IN_JS`;

  const rawText = node.quasis
    .map((quasi, index, quasis) =>
      index === quasis.length - 1
        ? quasi.value.cooked
        : quasi.value.cooked + composePlaceholder(index),
    )
    .join("");

  // Closing tags whose names are placeholders (`</${Foo}>` or `</>`) must have
  // the same name as the opening tag to be parsed. They are rewritten to the
  // opener's placeholder, and restored in order after printing.
  const closingTags = [];
  const openPlaceholderTags = [];
  const text = rawText.replaceAll(
    new RegExp(
      String.raw`<(\/?)(${composePlaceholder(String.raw`\d+`)})?(?=[\s/>])[^>]*>|<\/\s*>`,
      "g",
    ),
    (match, closing, name) => {
      if (match.startsWith("</")) {
        if (name === undefined && !/^<\/\s*>$/.test(match)) {
          return match;
        }
        const opener = openPlaceholderTags.pop();
        if (opener === undefined) {
          return match;
        }
        closingTags.push(name);
        return `</${opener}>`;
      }
      if (name !== undefined && !match.endsWith("/>")) {
        openPlaceholderTags.push(name);
      }
      return match;
    },
  );

  const expressionDocs = printEmbeddedTemplateExpressions(path, options, print);

  const placeholderRegex = new RegExp(
    composePlaceholder(String.raw`(\d+)`),
    "g",
  );
  let topLevelCount = 0;
  const doc = await textToDoc(text, {
    parser,
    __onHtmlRoot(root) {
      topLevelCount = root.children.length;
    },
  });

  const closingTagRegex = new RegExp(
    `</${composePlaceholder(String.raw`\d+`)}`,
    "g",
  );
  const contentDoc = mapDoc(doc, (doc) => {
    if (typeof doc !== "string") {
      return doc;
    }

    const parts = [];

    if (closingTags.length > 0) {
      doc = doc.replaceAll(closingTagRegex, (match) => {
        if (closingTags.length === 0) {
          return match;
        }
        const name = closingTags.shift();
        return name === undefined ? "</" : `</${name}`;
      });
    }

    const components = doc.split(placeholderRegex);
    for (let i = 0; i < components.length; i++) {
      let component = components[i];

      if (i % 2 === 0) {
        if (component) {
          component = uncookTemplateElementValue(component);
          if (options.__embeddedInHtml) {
            component = component.replaceAll(
              /<\/(?=script\b)/gi,
              String.raw`<\/`,
            );
          }
          parts.push(component);
        }
        continue;
      }

      const placeholderIndex = Number(component);
      parts.push(expressionDocs[placeholderIndex]);
    }

    return parts;
  });

  const leadingWhitespace = /^\s/.test(text) ? " " : "";
  const trailingWhitespace = /\s$/.test(text) ? " " : "";

  const linebreak =
    options.htmlWhitespaceSensitivity === "ignore"
      ? hardline
      : leadingWhitespace && trailingWhitespace
        ? line
        : null;

  if (linebreak) {
    return group(["`", indent([linebreak, group(contentDoc)]), linebreak, "`"]);
  }

  return label(
    { hug: false },
    group([
      "`",
      leadingWhitespace,
      topLevelCount > 1 ? indent(group(contentDoc)) : group(contentDoc),
      trailingWhitespace,
      "`",
    ]),
  );
}

/**
 *     - html`...`
 *     - HTML comment block
 */
function isEmbedHtml(path) {
  return (
    hasLanguageComment(path, "HTML") ||
    path.match(
      (node) => node.type === "TemplateLiteral",
      (node, name) =>
        node.type === "TaggedTemplateExpression" &&
        node.tag.type === "Identifier" &&
        node.tag.name === "html" &&
        name === "quasi",
    )
  );
}

const printEmbedHtml = printEmbedHtmlLike.bind(undefined, "html");
const printEmbedAngular = printEmbedHtmlLike.bind(undefined, "angular");

export {
  isAngularComponentTemplate,
  isEmbedHtml,
  printEmbedAngular,
  printEmbedHtml,
};
