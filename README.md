# YOZO

Yozo itself is written in the `src/` directory. The documentation (and rest of the site) resides under `site/`. Assets are stored in `site/-/`. 

## Current todo (in order)
 - Add code-editor behavior (`input-keybinds`)
 - Add presets
 - Add save system
 - Add console logs and pings

## Potential additions
Here's a list of things that I would like if they fit within budget
 - Make `elements.foobar` work even for conditional (`#if`, `#else-if`, `#else`) elements. _I SHOULD DO THIS_ because the current implementation is wasteful. Elements should be reused whereever possible, and if they are reused, there is no reason not to have `elements` work as expected.
 - Simplify `__achoredAdd` and related
 - Easier imports (potentially using `<link>`). Not sure if this is actually useful enough; it is already possible to import things and the API for this would not fit into `$` very prettily (maybe it should just go into `imports`?).
 - Add warning for when you use a global effect (i.e. effect with non-local dependencies) inside a component definition.
 -

## Todo

Below this, there's a more detailed breakdown of the site and what's needed.

 - [ ] Lock in modules by writing tests (in their respective page in /docs/)
     - [ ] `watch` and related
     - [ ] `track` and related
     - [ ] `flow` and related
     - [ ] `when` and related
     - [ ] `interval` and related
     - [ ] `effect` and `purify`
     - [ ] `fetch` (maybe throw this away)
 - [ ] Finish component core
     - [ ] Add `#for` and related
     - [ ] Add sourcemaps
 - [ ] Create playground
     - [ ] Add global settings
     - [ ] Add keybinds to textarea
     - [ ] Add code editor based on above & prism (SpeedHighlightJS?)
     - [ ] Add the fake filesystem
     - [ ] Add layouts
     - [ ] Add toolbar
        - [ ] Add save button (save to preset/new)
        - [ ] Add preset select
        - [ ] Add layout picker
        - [x] Add "hide navbar" button
     - [ ] Add preview window and make it maybe not ugly
     - [ ] Add default presets
        - [ ] Add basic setup with yozo (HTML + CSS + JS + YZ)
        - [ ] Add todo list app
        - [ ] Add `Flow` visual example (using `when`)
 - [ ] Create /docs/ pages
     - [ ] Create system & default styles
     - [ ] Create preview-code component
     - [ ] Create each page
 - [ ] Create tour
     - [ ] Define steps and sections
     - [ ] Build testing kit
     - [ ] Building full testing sandbox
     - [ ] Write all of the content
 - [ ] Create the homepage
 - [ ] Create versioning for `lib.js` and `dev.js`


## Site

The site consists of three major sections:

 - `tour/`: a gradual interactive experience teaching Yozo.
 - `play/`: an interactive sandbox allowing users to play around with Yozo.
 - `docs/`: this is where the formal documentention is written. Each feature is described in MDN-like fashion.

### Tour

The tour highlights each individual part of Yozo in a logical order, allowing the user to learn how to get the most out of Yozo in a fun, satisfying, playful manner. We'll have:
 - Introduction
    - Using Yozo
       - Outline its size
       - `<script src=https://yozo.ooo/dev.js>`
       - Outline its synchronousness
       - `const {...} = yozo`
    - Basics of when()
       - Outline .then()
       - Outline .throttle() and promise other goodies
    - Basics of watch()
       - Outline $-convention
       - Outline $ in Yozo components
    - Basics of track() (and track.undo())
       - Outline general "tracked" functionality
       - Outline its limited use beyond built-in
    - Basics of components
       - Outline SFC-shape
       - Outline WC dependency
       - Minimal component with `<title>`
 - Getting your hands dirty




### Play

A section with a simple sandbox, allowing for multiple files and allowing the user to try out Yozo. Should also have presets for common setups, and allow users to save their own presets.

### Docs

We need the following pages, in the same tree-like structure (~40 pages).
 - track()
    - track.define()
    - track.register()
    - track.ignore()
    - track.undo()
    - track.watched()
    - until()
 - watch()
    - watch.get()
    - watch.set()
    - watch.delete()
    - watch.bind()
 - Thenable
    - thenable.pipe()
    - thenable.now()
    - thenable.then()
    <!-- - thenable.await() -->
    - thenable.if()
    - thenable.or()
    - thenable.after()
    - thenable.cleanup()
    - thenable.die()
    - thenable.until()
    - thenable.once()
    - thenable.debounce()
    - thenable.throttle()
 - when()
    - when().observes()
 - purify()
 - fetch()
 - timeout()
 - interval()
 - frame()
 - register()
    - register.auto()
 - define()
    - define.register()

## Also do
 - Generate sourcemaps for dev version
 - NPM package?
 - Build a11y-friendly basic component package
 - Check site for occurances of certain words
