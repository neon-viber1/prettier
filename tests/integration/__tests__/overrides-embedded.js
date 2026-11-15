import fs from "node:fs/promises";
import path from "node:path";
import prettier from "../../config/prettier-entry.js";

const directory = new URL("../cli/config/overrides-embedded/", import.meta.url);

test("config overrides apply to embedded code by language", async () => {
  const filepath = path.join(directory.pathname, "foo.md");
  const text = await fs.readFile(filepath, "utf8");
  const formatted = await prettier.format(text, {
    filepath,
    ...(await prettier.resolveConfig(filepath)),
  });
  expect(formatted).toBe(
    [
      "```scss",
      '@use "sass:math";',
      "```",
      "",
      "```less",
      "@import 'a';",
      "```",
      "",
      "```js",
      "const a = 'x';",
      "```",
      "",
      "```unknown",
      "'x'",
      "```",
      "",
    ].join("\n"),
  );
});

test("no config file means no changes to embedded code", async () => {
  const formatted = await prettier.format("```scss\n@use 'a';\n```\n", {
    parser: "markdown",
    singleQuote: true,
  });
  expect(formatted).toBe("```scss\n@use 'a';\n```\n");
});
