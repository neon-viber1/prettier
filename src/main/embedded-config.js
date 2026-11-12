/**
 * Hook used to look up config `overrides` for embedded code (e.g. fenced code
 * blocks in Markdown). It is only set by entries that have file system access,
 * so it is a no-op in the standalone build.
 *
 * @type {((filepath: string, embeddedFilepath: string) => Promise<object | undefined>) | undefined}
 */
let resolver;

function setEmbeddedConfigResolver(fn) {
  resolver = fn;
}

/**
 * @param {string | undefined} filepath path of the host file
 * @param {string | undefined} extension extension of the embedded language
 * @returns {Promise<object | undefined>} options that differ for the embedded language
 */
function resolveEmbeddedOptions(filepath, extension) {
  if (!resolver || typeof filepath !== "string" || !extension) {
    return Promise.resolve();
  }

  return resolver(filepath, extension);
}

export { resolveEmbeddedOptions, setEmbeddedConfigResolver };
