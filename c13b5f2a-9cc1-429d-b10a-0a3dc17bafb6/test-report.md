New unit test tests/unit/ts-module-declaration-import-attributes.js passes (3 tests). It uses a plugin parser that attaches attributes, because no real parser accepts the syntax yet. I updated the visitor-keys snapshot. jest on tests/format/typescript, tests/format/js and tests/unit passed in full (550 suites, 26398 tests). eslint and prettier --check pass on the changed files. The earlier run of tests/format/flow, tests/format/misc and tests/format/js/import-attributes showed only the visitor-keys snapshot failure, now fixed; I did not re-run those suites after updating the snapshot.

1. Run relevant regression checks and exercise the changed application behavior against the issue's acceptance criteria.
passed: Plugin-parser unit test: `declare module "*" with { type: "text" } {...}` round-trips with attributes preserved, assert keyword and spacing are normalized, and modules without attributes are unchanged. The CLI could not be run against the issue's input: every installed parser rejects the syntax (checked typescript, babel-ts and oxc-ts). jest on typescript, js and unit suites passes.

Frontend verification: not_applicable
Formatter printer change; no rendered UI.