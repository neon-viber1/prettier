import { defineShortcut, mapNode } from "./utilities.js";

function preprocess(ast) {
  return mapNode(ast, defineShortcuts);
}

function defineShortcuts(node) {
  switch (node.type) {
    case "document":
      defineShortcut(node, "head", () => node.children[0]);
      defineShortcut(node, "body", () => node.children[1]);
      break;
    case "documentBody":
    case "sequenceItem":
    case "flowSequenceItem":
    case "mappingKey":
    case "mappingValue":
      defineShortcut(node, "content", () => node.children[0]);
      break;
    case "mappingItem":
    case "flowMappingItem":
      defineShortcut(node, "key", () => node.children[0]);
      defineShortcut(node, "value", () => node.children[1]);
      if (node.type === "mappingItem") {
        hoistScalarValueEndComments(node);
      }
      break;
  }
  return node;
}

// An own-line comment indented deeper than the key after a scalar value is
// parsed as an end comment of the value. Keep the scalar inline and print the
// comment after the item instead.
function hoistScalarValueEndComments(node) {
  const value = node.children[1];
  if (
    value?.type === "mappingValue" &&
    value.endComments?.length > 0 &&
    ["plain", "quoteDouble", "quoteSingle"].includes(value.children[0]?.type)
  ) {
    node.endComments = [...(node.endComments ?? []), ...value.endComments];
    value.endComments = [];
  }
}

export default preprocess;
