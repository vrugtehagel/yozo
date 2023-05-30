# YOZO

Yozo itself is written in the `src/` directory. The documentation (and rest of the site) resides under `site/`. Assets are stored in `site/-/`. 

## Site

The site consists of three major sections:

 - `tour/`: a gradual interactive experience teaching Yozo.
 - `play/`: an interactive sandbox allowing users to play around with Yozo.
 - `docs/`: this is where the formal documentention is written. Each feature is described in MDN-like fashion.

Also we'd probably want to provide the user some global site settings:
 - semicolons  (on/off)
 - tabs        (on/off)
 - tab size    1---4----10

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
    - 



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
    - thenable.await()
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
 - html()
 - fetch()
 - timeout()
 - interval()
 - frame()
 - register()
    - register.auto()
 - define()
    - define.register()
