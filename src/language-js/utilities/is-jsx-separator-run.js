/**
 * A lone punctuation word surrounded by single spaces, e.g. `" · "`.
 *
 * @param {string} value
 * @returns {boolean}
 */
const isJsxSeparatorRun = (value) =>
  /^ [^\p{Letter}\p{Number}"'\\&{}<>\s]+ $/u.test(value);

export { isJsxSeparatorRun };
