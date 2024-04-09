# YOZO

[yozo.ooo](https://yozo.ooo/) - [github.com/vrugtehagel/yozo-site](https://github.com/vrugtehagel/yozo-site/)

This is the main repository for Yozo, the tiniest no-build developer-first Web Components library.

## Getting started

To do any development on Yozo, first make sure you have [Deno](https://deno.com/) installed. Then, there are three tasks available:
- `deno task build` builds both Yozo's lib and dev builds, and outputs them in `dist/lib-latest.js` and `dist/dev-latest.js`. The former is minified and tiny, the latter includes better errors and warnings, and is not minified. By default, it verifies the hash against the latest version; to disable this, use the `--no-verify` flag.
- `deno task watch` builds Yozo when a file in `src/` has changed. Unlike the build script, it does not verify the hash against the latest version (because that would be annoying).
- `deno task archive` creates a new version. It asks a few questions, archives the versioned builds, and updates `versions.json` with the relevant data for the new version.
- `deno task test` runs the test suite. It is equivalent to `deno test --allow-read`, but I always forget the flag when using `deno test` so there's a task for it too.

## About the codebase

I know this codebase is not the most readable; it is intricate (robust, but fragile) and designed to be small when compressed. Oddly enough, sometimes, more code results in a smaller bundle size. That's why there are comments sprinkled all over the place, to try and help any brave souls trying to understand what's really happening.

Some practical notes:
- Lines with a comment are excluded from the `lib` build. Sometimes that means there are a few lines of code ending in `//` just so they'll get removed from the main build. This is generally useful for extra validation and better error and warning messages.
- Properties starting with `__` will be mangled, i.e. rewritten by esbuild. Use to your advantage whenever possible.
- Error and warning messages are extracted to `src/help.js`, so that verbose messages don't clutter up the logic.
- Yozo's individual utilities are essentially one-per-file; everything under `live` is defined in `src/live.js`, then `when` is defined in `src/when.js`, etcetera. "Mods" are for component definitions specifically; each mod concerns itself with one (or more) aspects of how users may define custom elements.

## Tests

Tests are run using `deno task test` (or, if you prefer, `deno test --allow-read`).

Tests are written in a bit of an unconventional way, because we want to be able to run them in the browser. Essentially, we've got one test per file, all under `tests/`, in the same structure as the documentation pages. Inside tests, there's a global function `assert` available that just throws when it receives a falsey argument (which then fails the test). We also have browser-only tests here, which Deno can't run, but they are included in test suites on the website regardless (where they are run). They may include `.yz` files; all these tests are to be uploaded to the documentation site, so the tests can register them like normal.

## How things go around here

There's the `main` branch, where the latest version of Yozo lives. There's also `canary`, where changes to Yozo are gathered until they are released as a new version and pushed to `main`. In the mean time, other changes (like adding tests) may be merged into `main` without going through `canary`. As for versioning and releasing, currently there are no plans to use GitHub's "releases" feature, in favor of [yozo.ooo/download/](https://yozo.ooo/download/).
