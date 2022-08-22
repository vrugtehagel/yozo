import { assertSpyCalls, spy } from 'https://deno.land/std@0.147.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.147.0/testing/asserts.ts'

import when from './index.js'

Deno.test('[when] basic', () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    const onping = spy(() => {})
    when(target).fires().then(onfire)
    when(target).does('ping').then(onping)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 1)
    assertSpyCalls(onping, 0)
    target.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(onfire, 1)
    assertSpyCalls(onping, 1)
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
    const oneither1 = spy(() => {})
    const oneither2 = spy(() => {})
    when(target1).fires()
        .then(oneither1)
        .or(when(target2).pings())
        .then(oneither2)
    target1.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(oneither1, 1)
    assertSpyCalls(oneither2, 1)
    target2.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(oneither1, 2)
    assertSpyCalls(oneither2, 2)
})

Deno.test('[when] or (promise)', async () => {
    const target = new EventTarget
    let resolver
    const promise = new Promise(resolve => resolver = resolve)
    const ontrigger = spy(() => {})
    when(target).fires()
        .or(promise)
        .then(ontrigger)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(ontrigger, 1)
    resolver()
    await 'microtask'
    assertSpyCalls(ontrigger, 2)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(ontrigger, 3)
    resolver()
    await 'microtask'
    assertSpyCalls(ontrigger, 3)
})

Deno.test('[when] until', async () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    const onfireafter = spy(() => {})
    let stop = false
    when(target).fires()
        .then(onfire)
        .until(() => stop)
        .then(onfireafter)
    assertSpyCalls(onfire, 0)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 1)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 2)
    assertSpyCalls(onfireafter, 2)
    stop = true
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 3)
    assertSpyCalls(onfireafter, 2)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 3)
    assertSpyCalls(onfireafter, 2)
})

Deno.test('[when] until (promise)', async () => {
    const target = new EventTarget
    const onfire = spy(() => {})
    let resolver
    const promise = new Promise(resolve => resolver = resolve)
    when(target).fires()
        .then(onfire)
        .until(promise)
    assertSpyCalls(onfire, 0)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 1)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 2)
    resolver()
    await 'microtask';
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfire, 2)
})

Deno.test('[when] multiple things', () => {
    const target1 = new EventTarget
    const target2 = new EventTarget
    const onping = spy(() => {})
    const oneither = spy(() => {})
    const onlast = spy(() => {})
    let stop = false
    when(target1).fires().or(
    when(target2).pings())
        .then(oneither)
        .only(({type}) => type == 'ping')
        .then(onping)
        .until(() => stop)
        .then(onlast)
        .now({type: 'now'})
    assertSpyCalls(oneither, 1)
    assertSpyCalls(onping, 0)
    assertSpyCalls(onlast, 0)
    target1.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(oneither, 2)
    assertSpyCalls(onping, 0)
    assertSpyCalls(onlast, 0)
    target2.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(oneither, 3)
    assertSpyCalls(onping, 1)
    assertSpyCalls(onlast, 1)
    stop = true
    target1.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(oneither, 4)
    assertSpyCalls(onping, 1)
    assertSpyCalls(onlast, 1)
    target2.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(oneither, 5)
    assertSpyCalls(onping, 2)
    assertSpyCalls(onlast, 1)
    target1.dispatchEvent(new CustomEvent('fire'))
    target2.dispatchEvent(new CustomEvent('ping'))
    assertSpyCalls(oneither, 5)
    assertSpyCalls(onping, 2)
    assertSpyCalls(onlast, 1)
})

Deno.test('[when] observers', () => {
    self['MagicObserver'] = class MagicObserver {
        static trigger = () =>
            this.#active.forEach(observer => observer.trigger())
        static #active = new Set()
        #callback = null
        #targets = []
        constructor(callback){
            this.#callback = callback
        }
        observe(target){
            this.#targets.push(target)
            MagicObserver.#active.add(this)
        }
        disconnect(){
            this.#targets = []
            MagicObserver.#active.delete(this)
        }
        trigger(){
            this.#targets.forEach(target => this.#callback(target))
        }
    }
    const onmagic = spy(() => {})
    let stop = false
    when('anything').observes('magic')
        .until(() => stop)
        .then(onmagic)
    assertSpyCalls(onmagic, 0)
    MagicObserver.trigger()
    assertSpyCalls(onmagic, 1)
    stop = true
    MagicObserver.trigger()
    assertSpyCalls(onmagic, 1)
    delete self['MagicObserver']
})

Deno.test('[when] strict', () => {
    when.strict = true
    const target = new EventTarget
    const onfires = spy(() => {})
    const onfire = spy(() => {})
    when(target).fires().then(onfires)
    when(target).fire().then(onfire)
    target.dispatchEvent(new CustomEvent('fire'))
    assertSpyCalls(onfires, 0)
    assertSpyCalls(onfire, 1)
    delete when.strict
})
