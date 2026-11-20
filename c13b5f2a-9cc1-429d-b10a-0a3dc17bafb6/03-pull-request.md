## Description

Fixes #20531 (printer side). `TSModuleDeclaration` now prints `attributes` (`with`/`assert`), so `declare module "*" with { type: "text" } {}` is no longer silently turned into `declare module "*" {}` when a parser supplies attributes. `attributes` was also added to the TS module declaration visitor keys so the nodes are traversed.

Not included: parser support. The installed parsers (typescript 6.0.3, typescript-estree 8.72.2, @babel/parser 8.1.2, oxc-parser 0.159.0) all reject the syntax; that needs upstream TypeScript 7.1 support and a dependency bump. A format fixture would therefore fail, so the printer is covered by a unit test using a plugin parser that attaches `ImportAttribute` nodes.

Suggestions considered: print attributes in the module declaration printer (included); add visitor keys (included); parser support (excluded: dependency limitation).

## Checklist

- [x] I’ve added tests to confirm my change works. (tests/unit/ts-module-declaration-import-attributes.js; visitor-keys snapshot updated)
- [x] (If changing the API or CLI) I’ve documented the changes I’ve made (in the `docs/` directory). N/A, no API/CLI change.
- [x] (If the change is user-facing) I’ve added my changes to `changelog_unreleased/*/XXXX.md` file following `changelog_unreleased/TEMPLATE.md`. changelog_unreleased/typescript/20531.md
- [x] I’ve read the [contributing guidelines](https://github.com/prettier/prettier/blob/main/CONTRIBUTING.md).
- [ ] I did _not_ use AI to generate this PR.
- [x] (If the above is not checked) I have reviewed the AI-generated content before submitting.

## Screenshots

None: formatter change with no rendered UI.
