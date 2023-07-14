import { assertEquals } from 'std/testing/asserts.ts'
import 'src/index.js'

const {live} = self.yozo

Deno.test('Unwrapping', () => {
	const data = {foo: 23}
	const $data = live(data)
	assertEquals(live.get($data), data)
	assertEquals(live.get($data.$foo), 23)
})

Deno.test('Non-live', () => {
	const data = {foo: 23}
	assertEquals(live.get(data), data)
	assertEquals(live.get(data.foo), 23)
	assertEquals(live.get(), undefined)
})

Deno.test('With key', () => {
	const data = {foo: 23, $bar: 'baz'}
	const $data = live(data)
	assertEquals(live.get($data, 'foo'), 23)
	assertEquals(live.get($data, '$bar'), 'baz')
})

Deno.test('Non-live with key', () => {
	const data = {foo: 23, $bar: 'baz'}
	assertEquals(live.get(data, 'foo'), 23)
	assertEquals(live.get(data, '$bar'), 'baz')
})
