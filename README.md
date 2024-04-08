# YOZO

[yozo.ooo](https://yozo.ooo/)

This is the main repository for Yozo, the tiniest no-build developer-first Web Components library.

For developer documentation, see [yozo.ooo/docs/](/https://yozo.ooo/docs/).
For the site repository, see [github.com/vrugtehagel/yozo-site/](https://github.com/vrugtehagel/yozo-site/).

## Getting started

To do any development on Yozo, first make sure you have [Deno](https://deno.com/) installed. Then, there are three commands available:
- `deno task build` builds both Yozo's lib and dev builds, and outputs them in `dist/lib-latest.js` and `dist/dev-latest.js`. The former is minified and tiny, the latter includes better errors and warnings, and is not minified. By default, it verifies the hash against the latest version; to disable this, use the `--no-verify` flag.
- `deno task watch` builds Yozo when a file in `src/` has changed. Unlike the build script, it does not verify the hash against the latest version (because that would be annoying).
- `deno task archive` creates a new version. It asks a few questions, archives the versioned builds, and updates `versions.json` with the relevant data for the new version.
