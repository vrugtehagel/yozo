import { assertEquals, assertNotEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {live} = self.yozo

Deno.test('Return value', () => {
	const data = {foo: 23}
	const $data = live(data)
	assertEquals(live.set($data.$bar, 'baz'), true)
	assertEquals(live.set($data.qux, 'qux'), false)
	assertEquals(live.set($data, null), true)
})

Deno.test('Source object', () => {
	const data = {foo: 23}
	const $data = live(data)
	live.set($data.$bar, 'baz')
	assertEquals(data.bar, 'baz')
})

Deno.test('Misuse', () => {
	const data = {foo: 23}
	const success = live.set(data.bar, 'baz')
	assertEquals(success, false)
	assertNotEquals(data.bar, 'baz')
	assertThrows(() => live.set($data.$qux.$quux, true), ReferenceError)
})
