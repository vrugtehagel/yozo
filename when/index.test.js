import { assertSpyCalls, spy } from 'https://deno.land/std@0.147.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.147.0/testing/asserts.ts'

import when from './index.js'

Deno.test('[when] basic', () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    when(target).fires().then(onfire)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 1)
})

Deno.test('[when] only', () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    const ononly = spy(() => {})
    when(target).fires()
        .then(onfire)
        .only(({detail}) => detail == 23)
        .then(ononly)
    target.dispatchEvent(new CustomEvent('fire', {detail: -7}))
    assertSpyCalls(onfire, 1)
    assertSpyCalls(ononly, 0)
    target.dispatchEvent(new CustomEvent('fire', {detail: 23}))
    assertSpyCalls(onfire, 2)
    assertSpyCalls(ononly, 1)
})

Deno.test('[when] after', async () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    await when(target).fires()
        .after(() => target.dispatchEvent(new CustomEvent('fire')))
})

Deno.test('[when] now', () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    when(target).fires().then(onfire).now()
    assertSpyCalls(onfire, 1)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 2)
})

Deno.test('[when] or', () => {
    const target1 = new EventTarget
    const target2 = new EventTarget
    const onfire = spy(() => {})
    const oneither = spy(() => {})
    when(target1).fires()
        .then(onfire)
        .or(when(target2).pings())
        .then(oneither)
    target1.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 1)
    assertSpyCalls(oneither, 1)
    target2.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(onfire, 2)
    assertSpyCalls(oneither, 2)
})

// Deno.test('[when] until', () => {
//     // write these
//     assert(false)
// })

// Deno.test('[when] multiple things', () => {
//     assert(false)    
// })

// Deno.test('[when] observers', () => {
//     assert(false)
// })

// Deno.test('[when] strict', () => {
//     assert(false)
// })
