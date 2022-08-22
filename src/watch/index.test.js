import { assertSpyCalls, spy } from 'https://deno.land/std@0.147.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.147.0/testing/asserts.ts'

import watch from './index.js'
import when from '../when/index.js'

Deno.test('[watch] basic', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assertEquals(watched.foo.get(), 23)
    const onchange = spy(() => {})
    watched.addEventListener('change', onchange)
    watched.foo++
    assertSpyCalls(onchange, 1)
    assertEquals(original.foo, 24)
    watched.set(null)
    assertSpyCalls(onchange, 2)
})

Deno.test('[watch] utilities', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assertStrictEquals(watch.get(watched), original)
    assertEquals(watch.made(watched), true)
    assertEquals(watch.typeof(watched.foo), 'number')
    assertEquals(watch.typeof(watched.bar.baz), 'undefined')
})

Deno.test('[watch] methods: free', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assert(!watched.free())
    assert(!watched.bar.free())
    assert(watched.bar.baz.free())
    assert(watched.foo.bar.free())
})

Deno.test('[watch] methods: is', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assert(watched.foo.is(23))
    assert(watched.bar.is(null))
})

Deno.test('[watch] methods: typeof', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assertEquals(watched.typeof(), 'object')
    assertEquals(watched.foo.typeof(), 'number')
    assertEquals(watched.bar.typeof(), 'undefined')
})

Deno.test('[watch] methods: get', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assertEquals(watched.foo.get(), 23)
    assertEquals(watched.get(), original)
    assertEquals(watched.bar.baz.get(), undefined)
})

Deno.test('[watch] methods: delete', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assert('foo' in watched)
    watched.foo.delete()
    assert(!('foo' in watched))
    watched.delete()
    assert(watched.is(undefined))
})

Deno.test('[watch] methods: set', () => {
    const original = {foo: 23}
    const watched = watch(undefined)
    watched.set(original)
    assert(watched.is(original))
    watched.bar.set('baz')
    assertEquals(watched.bar.get(), 'baz')
})

Deno.test('[watch] methods: bind', () => {
    const original = {source: 23}
    const watched = watch(original)
    watched.target.bind({
        get: () => watched.source + 100,
        set: value => watched.source = value - 100,
        triggers: when(watched.source).changes()
    })
    assertEquals(watched.source.get(), 23)
    assertEquals(watched.target.get(), 123)
    watched.target = 188
    assertEquals(watched.source.get(), 88)
    assertEquals(watched.target.get(), 188)
    watched.source = 4
    assertEquals(watched.source.get(), 4)
    assertEquals(watched.target.get(), 104)
})

Deno.test('[watch] methods: bind (input)', () => {
    const input = new class extends EventTarget {
        #value = 'foo bar'
        get value(){ return this.#value }
        set value(value){ this.#value = value + '' }
    }
    const original = {text: 'hello world!'}
    const watched = watch(original)
    watched.text.bind().input(input)
    assertEquals(watched.text.get(), 'foo bar')
    watched.text = 'baz'
    assertEquals(watched.text.get(), 'baz')
    assertEquals(input.value, 'baz')
    input.value = 'qux quux'
    input.dispatchEvent(new CustomEvent('input'))
    assertEquals(watched.text.get(), 'qux quux')
    assertEquals(input.value, 'qux quux')
})

Deno.test('[watch] values pretend', () => {
    const original = {foo: 23, bar: ['1', '2', '3']}
    const watched = watch(original)
    assert(watched.foo == 23)
    assert(watched.foo == '23')
    assertEquals(JSON.stringify(watched), JSON.stringify(original))
    assertEquals(Object.keys(watched), ['foo', 'bar'])
    assert('foo' in watched)
    assert(watched instanceof EventTarget)
    watched.foo++
    assert(watched.foo == 24)
    watched.bar.reverse()
    assertEquals(watched.bar.toString(), '3,2,1')
})

Deno.test('[watch] fire change', () => {
    const original = {foo: 23}
    const watched = watch(original)
    const onchange = spy(() => {})
    watched.foo.addEventListener('change', onchange)
    watched.bar = 'baz'
    assertSpyCalls(onchange, 0)
    watched.foo--
    assertSpyCalls(onchange, 1)
    watched.delete()
    assertSpyCalls(onchange, 2)
    watched.set(23)
    assertSpyCalls(onchange, 2)
    watched.set({foo: {bar: 'baz'}})
    assertSpyCalls(onchange, 3)
    watched.foo.bar = 'qux'
    assertSpyCalls(onchange, 4)
})
