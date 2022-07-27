import { assertSpyCalls, spy } from 'https://deno.land/std@0.147.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.147.0/testing/asserts.ts'

import watch from './index.js'

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

Deno.test('[watch] native methods', () => {
    const original = {foo: 23}
    const watched = watch(original)
    assert(!watched.free())
    assert(!watched.bar.free())
    assert(watched.bar.baz.free())
    assert(watched.foo.bar.free())
    assert(watched.foo.is(23))
    assert(watched.bar.is(null))
    assertEquals(watched.typeof(), 'object')
    assertEquals(watched.foo.typeof(), 'number')
    assertEquals(watched.bar.typeof(), 'undefined')
    assertEquals(watched.foo.get(), 23)
    assertStrictEquals(watched.get(), original)
    assertEquals(watched.bar.baz.get(), undefined)
    watched.foo.delete()
    assert(!('foo' in watched))
    watched.delete()
    assert(watched.is(undefined))
    watched.set(original)
    assert(watched.is(original))
    watched.bar.set('baz')
    assertEquals(watched.bar.get(), 'baz')
    // write tests for .bind()
    assert(false)
})

Deno.test('[watch] behave as if', () => {
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
