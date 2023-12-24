# YOZO

Yozo itself is written in the `src/` directory. The documentation (and rest of the site) resides under `site/`. Assets are stored in `site/-/`. The site consists of three major sections:

 - `tour/`: a gradual interactive experience teaching Yozo.
 - `play/`: an interactive sandbox allowing users to play around with Yozo.
 - `docs/`: this is where the formal documentention is written.

Tests are included through adding `/test/` to the end of a docs page's URL. A collection of all tests is found at `/docs/test/`.

The current and older versions are available to download at `/download/`.

And there's also the homepage, of course.


## Todo

Below this, there's a more detailed breakdown of the site and what's needed.

 - Lock in modules by writing tests (in their respective page in /docs/)
 - Add sourcemaps
 - More byteshaving
 - Create /docs/ pages
 - Create tour
     - Define steps and sections
     - Build testing kit
     - Building full testing sandbox
     - Write all of the content
 - Create the homepage
 - You can select the zero-width space when copy-pasting code examples
 - Fix docs-outline component header detection
 - Check browsers
     - play doesn't work (Safari can't top-level await some stuff)
 - NPM package?
 - Check site for occurances of certain words to improve inclusivity


### Tour

The tour highlights each individual part of Yozo in a logical order, allowing the user to learn how to get the most out of Yozo in a fun, satisfying, playful manner. We'll have:
 - Introduction
    - Using Yozo
       - Outline its size
       - `<script src=https://yozo.ooo/dev-latest.js>`
       - Outline its synchronousness
       - `const {...} = yozo`
    - Basics of when()
       - Outline .then()
       - Outline .throttle() and promise other goodies
    - Basics of live()
       - Outline $-convention
       - Outline $ in Yozo components
    - Basics of monitor() (and monitor.undo())
       - Outline general "monitor" functionality
       - Outline its limited use beyond built-in
    - Basics of components
       - Outline SFC-shape
       - Outline WC dependency
       - Minimal component with `<title>`
 - Getting your hands dirty


### Play

A section with a simple sandbox, allowing for multiple files and allowing the user to try out Yozo. Should also have presets for common setups, and allow users to save their own presets.


### Docs

We need the following pages, in the same tree-like structure (15/60 pages done).
 - [x] monitor()
    - [ ] monitor.add()
    - [ ] monitor.ignore()
    - [ ] monitor.register()
    - [ ] until()
    - [ ] type: 'undo'
    - [ ] type: 'live'
 - [x] live()
    - [x] live.get()
    - [ ] live.set()
    - [ ] live.delete()
    - [ ] live.link()
    - [ ] change event
    - [ ] deepchange event
    - [ ] keychange event
 - [x] Flow
    - [x] constructor
    - [ ] flow.pipe()
    - [x] flow.now()
    - [x] flow.then()
    - [ ] flow.if()
    - [ ] flow.or()
    - [ ] flow.after()
    - [ ] flow.cleanup()
    - [ ] flow.die()
    - [ ] flow.until()
    - [ ] flow.once()
    - [ ] flow.debounce()
    - [ ] flow.throttle()
 - [x] when()
    - [ ] when().observes()
 - [ ] timeout()
 - [x] interval()
 - [ ] frame()
 - [ ] paint()
 - [x] register()
    - [ ] register.auto()
 - [ ] purify()
 - [ ] effect()
 - [x] components
    - [ ] title
    - [x] template
       - [ ] inline
       - [ ] for...of (/for-of/)
       - [ ] if...else (/if-else/)
       - [ ] @event (/events/)
       - [ ] :attribute (/attributes/)
       - [ ] .property (/properties/)
    - [x] meta
       - [x] attribute
       - [ ] property
       - [ ] method
       - [ ] form-associated
       - [ ] hook
    - [ ] script
    - [ ] connected
    - [ ] disconnected
    - [ ] style
    - [ ] $
    - [x] query()
