# How `live` works

There have been many issues around `live` and its behavior. The most important features, in order, are

 - Ease-of-use (feature-complete)
 - Simple and clear syntax
 - Performance

Live variables are essentially slots for values. Once a slot has been created, it stays. Slots don't move around, i.e. a slot is defined by the chain of keys used to create the slot initially. For example
```js
const $ = live({ foo: { bar: 23 } });
const $bar = $.$foo.$bar
```
Here, `$bar` is a live variable around `$.foo.bar`, which currently is 23. The slot may exist even if the value doesn't; even if `$ = live({})`, so that `$.foo.bar` would normally throw an error, `$.$foo.bar` does not; optional chaining is built-in, so to speak. This mechanism is particularly nice because it means you can start writing effects based on data structures that have yet to load.

The syntax is simple; starting a variable with `$` signals that it is a live variable, rather than a value. This is ergonomic and works well inside component definitions with `$`.

However, performance is an issue. Live structures are always deep, and events bubble up.



