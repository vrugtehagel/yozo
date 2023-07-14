import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertNotEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {live, Flow} = self.yozo

Deno.test('Computed', () => {
	const $ = live({foo: 23})
	const get = spy(() => $.foo ** 2)
	live.link($.$bar, get)
	assertEquals($.bar, 529)
	assertSpyCalls(get, 1)
	$.foo = 5
	assertEquals($.bar, 25)
	assertSpyCalls(get, 2)
})

Deno.test('Getter only', () => {
	const $ = live({foo: 23})
	const get = spy(() => $.foo ** 2)
	live.link($.$bar, {get})
	assertEquals($.bar, 529)
	assertSpyCalls(get, 1)
	$.foo = 5
	assertEquals($.bar, 25)
	assertSpyCalls(get, 2)
})

Deno.test('Readonly', () => {
	const $ = live({foo: 23})
	live.link($.$bar, () => $.foo ** 2)
	$.bar = 5
	assertEquals($.bar, 529)
})

Deno.test('Get and set', () => {
	const $ = live({foo: 23, bar: 5})
	const get = () => $.foo + $.bar
	const set = value => $.foo = value - $.bar
	live.link($.$sum, {get, set})
	assertEquals($.sum, 28)
	$.bar++
	assertEquals($.sum, 29)
	$.sum = 20
	assertEquals($.bar, 6)
	assertEquals($.foo, 14)
})

Deno.test('Changes', () => {
	let foo = 23
	const $ = live({})
	const changes = new Flow
	const get = spy(() => foo)
	const set = spy(value => foo = value)
	live.link($.$foo, {get, set, changes})
	assertEquals($.foo, 23)
	assertSpyCalls(get, 1)
	foo++
	assertEquals($.foo, 23)
	changes.now()
	assertEquals($.foo, 24)
	assertSpyCalls(get, 2)
	$.foo--
	assertEquals($.foo, 23)
	assertEquals(foo, 23)
	assertSpyCalls(get, 3)
	assertSpyCalls(set, 1)
})
