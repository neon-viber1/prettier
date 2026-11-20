import * as prettier from "../../index.js";
import * as typescriptPlugin from "../../src/plugins/typescript.js";

// Current TypeScript parsers don't support import attributes on ambient
// modules yet, so simulate a parser that does: blank out the attributes
// (keeping offsets), parse, then attach `ImportAttribute` nodes.
const attributesRegex = /(?<keyword>with|assert)\s*\{(?<body>[^}]*)\}/u;
const plugin = {
  parsers: {
    "ts-ambient-attributes": {
      ...typescriptPlugin.parsers.typescript,
      astFormat: "estree",
      parse(text, options) {
        const match = text.match(attributesRegex);
        const blanked = match
          ? text.slice(0, match.index) +
            " ".repeat(match[0].length) +
            text.slice(match.index + match[0].length)
          : text;
        const ast = typescriptPlugin.parsers.typescript.parse(blanked, options);
        // Drop strip-comments cache entries computed from the blanked text.
        ast.comments = [...ast.comments];
        if (!match) {
          return ast;
        }
        const bodyStart = match.index + match[0].indexOf("{") + 1;
        const attributes = [];
        for (const m of match.groups.body.matchAll(
          /(?<key>\w+)\s*:\s*"(?<value>[^"]*)"/gu,
        )) {
          const start = bodyStart + m.index;
          const keyEnd = start + m.groups.key.length;
          const valueStart = start + m[0].indexOf('"');
          const end = start + m[0].length;
          attributes.push({
            type: "ImportAttribute",
            start,
            end,
            range: [start, end],
            key: {
              type: "Identifier",
              name: m.groups.key,
              start,
              end: keyEnd,
              range: [start, keyEnd],
            },
            value: {
              type: "Literal",
              value: m.groups.value,
              raw: `"${m.groups.value}"`,
              start: valueStart,
              end,
              range: [valueStart, end],
            },
          });
        }
        const declaration = ast.body.find(
          (node) => node.type === "TSModuleDeclaration",
        );
        declaration.attributes = attributes;
        return ast;
      },
    },
  },
};

const format = (code) =>
  prettier.format(code, {
    parser: "ts-ambient-attributes",
    plugins: [plugin],
  });

test("keeps import attributes of ambient module declarations", async () => {
  expect(
    await format(
      'declare module "*" with { type: "text" } {\n  const content: string;\n  export default content;\n}\n',
    ),
  ).toBe(
    'declare module "*" with { type: "text" } {\n  const content: string;\n  export default content;\n}\n',
  );
});

test("keeps `assert` keyword and normalizes spacing", async () => {
  expect(
    await format('declare module "*.json"   assert{type:"json"}   {}\n'),
  ).toBe('declare module "*.json" assert { type: "json" } {}\n');
});

test("modules without attributes are unchanged", async () => {
  expect(await format('declare module "foo" {}\n')).toBe(
    'declare module "foo" {}\n',
  );
});
