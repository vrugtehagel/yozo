import { assert, assertEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {live} = self.yozo

Deno.test('Return value', () => {
	const data = {foo: 23}
	const $data = live(data)
	assertEquals(live.delete($data.$bar), true)
	assertEquals(live.delete($data.qux), false)
	assertEquals(live.delete($data), true)
})

Deno.test('Source object', () => {
	const data = {foo: 23}
	const $data = live(data)
	live.delete($data.$foo)
	assert(!('foo' in data))
})

Deno.test('Misuse', () => {
	const data = {foo: 23}
	const success = live.delete(data.foo)
	assertEquals(success, false)
	assertEquals(data.foo, 23)
})
