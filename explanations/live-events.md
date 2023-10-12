# Live events

## Initial design

Initially, I had a single `change` event that bubbles (it exposed some properties about the change, which I also changed over time).

However, this doesn't work well, because it triggers _many_ more recomputations than necessary. For example, let's say we have a social media app, and we have a reactive object mapping a post ID to the actual post contents:
```js
const $user = live({
	posts: {/* ... */}
})
live.link($user.$postIds, () => Object.keys($user.$posts))
```

This works, but is _incredibly_ inefficient. Not only does any change within `$user.$posts` triggers a recomputation for `$postIds`, but each recomputation actually creates a new array for `$postIds` due to `Object.keys()`. This causes a bunch more triggers down to everything relying on `$postIds`, even though it didn't actually change most of the time.

## Adding extra events

In an attempt to solve this, I renamed the `change` event to `deepchange`. Then, I re-used `change` for cases where the value of a live variable _actually_ changed. Additionally, I introduced `keychange` for when a key of a live variable changed. In the first iteration of this attempt, it only check whether keys got added or removed, not whether keys changed. However, note that in the following example, we actually need to know both about added/removed keys, but also changed keys (but not deep changes):
```js
const $user = live({
	posts: {/* ... */}
})
live.link($user.$postsCopy, () => ({...$user.$posts}))
```
In the above, a key's value changing need to trigger a recompute (regardless of whether the key existed before and/or after). Theoretically, the `keychange` and `change` events could be merged. The main issue here is not how the events are handled; it's knowing when to fire them. If we, in the example above, change (i.e. modify rather than add/remove) a key of `$user.$posts`, then there is no way for `$user.$posts` to know what really happened unless `$user.$posts[key]` told it what key changed. This is not necessarily problematic for regular live trees of data, but it _is_ an issue for linked values. If we change the example to simply remove the object spread, then `$user.$postsCopy` is pointing at the same object as `$user.$posts`. This means that when we make a change to `$user.$posts`, when the linked variable tries to dispatch a change, it just doesn't know what actually changed because the object it's pointing at has already made the change.

Basically, long story short, if a `keychange` (or equivalent) event exists, every single live variable needs to keep track of a _copy_ of the object it's pointing to just in case the real object it's pointing to has changed before the variable even tried to read what changed.

## Linked variables are problematic

The above all assumes linked variables should work as they do, but ultimately there seems to be an underlying problem with how they work. Consider:
```js
const $ = live({foo: {bar: 23}})
const $2 = live({})
live.link($2, () => $)
```
In this example, `$2.$foo.bar++` has to trigger an event to notify the user of changes in `$.$foo.$bar`. This is really quite impossible to do efficiently (within the byte budget), because there is nothing to say that `$2.$foo.$bar` is somehow related to `$.$foo.$bar`. The result is that you need to scan every single tree every time something changes. Doing `$2.$foo.bar++` changes `$.$foo.bar`, but nobody knows (in fact, I don't think this has ever worked, in any iteration). One potential solution is to disallow reactive properties on linked variables; i.e. if `$2` has been linked, then doing `$2.$foo` is not allowed (or just does not return a live variable for the `.foo` property. Another solution could be to keep track of the live trees that have been touched (in this example, that's just both trees) and only go through them every time a change occurs. This is terrible for efficiency, however.

### Types of linked variables

There are multiple use-cases for linked variables, all which slightly different:
 - Simple computed properties, i.e. transforming one or more live variables into a single value
 - Transforming an inherently non-live thing into something live, for example, the value of an input.
 - A live tree pointing at another one, but dynamically able to change what tree it's pointing at.

What if the last use-case is detected by checking if the result of the second argument to `live.link` (assuming it's a function) is a live variable - if it is, instead of creating a new tree, simply return the resulting live variable when that key is accessed. Essentially:
```js
const $ = live({foo: {bar: 23}})
const $2 = live({})
live.link($2, () => $)
console.assert($2.$foo == $.$foo)
```

That doesn't work because then doing `when($2.$foo.$bar).changes()` can suddenly stop working if $2 gets recomputed to point at something else.
