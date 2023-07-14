import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertNotEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {live, track} = self.yozo

Deno.test('Listeners', () => {
	const data = {foo: {bar: 'baz'}}
	const $data = live(data)
	const onchange = spy()
	$data.$foo.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$data.$foo.bar = 'qux'
	assertSpyCalls(onchange, 1)
	$data.foo.bar = 'quux'
	assertSpyCalls(onchange, 1)
	$data.foo = 23
	assertSpyCalls(onchange, 2)
	$data.foo++
	assertSpyCalls(onchange, 3)
	live.delete($data)
	assertSpyCalls(onchange, 4)
})

Deno.test('Event detail', () => {
	const data = {foo: {bar: 'baz'}}
	const $data = live(data)
	let detail
	$data.$foo.addEventListener('change', event => detail = event.detail)
	$data.$foo.bar = 'qux'
	assertEquals(detail, {oldValue: data.foo, value: data.foo})
	const oldFoo = data.foo
	$data.foo = 23
	assertEquals(detail, {oldValue: oldFoo, value: 23})
	$data.foo++
	assertEquals(detail, {oldValue: 23, value: 24})
	live.delete($data)
	assertEquals(detail, {oldValue: 24, value: undefined})
})

Deno.test('Non-changes', () => {
	const data = {foo: 'bar'}
	const $data = live(data)
	const onchange = spy()
	$data.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$data.foo++
	assertEquals(data.foo, NaN)
	assertSpyCalls(onchange, 1)
	$data.foo++
	assertSpyCalls(onchange, 1)
})

Deno.test('Caching', () => {
	const data = {foo: 23}
	const $data = live(data)
	assertEquals($data.$foo, $data.$foo)
	assertEquals($data.$bar.$baz, $data.$bar.$baz)
	assertNotEquals(live(data), $data)
})

Deno.test('Source object', () => {
	const data = {foo: 23}
	const $data = live(data)
	$data.bar = true
	assertEquals(data.bar, true)
	delete $data.foo
	assert(!('foo' in data))
})

Deno.test('Free slots', () => {
	const data = null
	const $data = live(data)
	const onchange = spy()
	assertEquals($data.foo, undefined)
	assertEquals($data.$foo.bar, undefined)
	$data.$foo.$bar.addEventListener('change', onchange)
	live.set($data, {})
	assertSpyCalls(onchange, 0)
	live.set($data, {foo: {bar: 'baz'}})
	assertSpyCalls(onchange, 1)
	live.delete($data)
	assertSpyCalls(onchange, 2)
})

Deno.test('Proxy traps', () => {
	const data = {foo: 23, bar: ['1', '2', '3']}
	const $data = live(data)
	$data.$qux = 'quux'
	assertEquals($data.qux, undefined)
	assert('foo' in $data)
	assert(!('$foo' in data))
	assert('$qux' in $data)
	assertEquals(live.get($data, '$qux'), 'quux')
	assertEquals(Object.keys($data), ['foo', 'bar', '$qux'])
	delete $data.$qux
	assert(!('$qux' in $data))
	assertEquals(live.get($data, '$qux'), undefined)
	assertEquals(Object.keys($data), ['foo', 'bar'])
	assert('addEventListener' in $data)
	assert($data instanceof EventTarget)
})

Deno.test('Symbol keys', () => {
	const symbol = Symbol()
	const data = {[symbol]: 23}
	const $data = live(data)
	const onchange = spy()
	$data.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$data[symbol]++
	assertSpyCalls(onchange, 1)
	assertEquals(data[symbol], 24)
})

Deno.test('Tracking', () => {
	const symbol = Symbol()
	const data = {foo: 23}
	const $data = live(data)
	const call = track.live(() => {
		$data.foo
		$data.$bar[symbol]
	})
	const onchange = spy()
	call.live.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$data.foo++
	assertSpyCalls(onchange, 1)
	$data.bar = {}
	assertSpyCalls(onchange, 1)
	$data.$bar[symbol] = true
	assertSpyCalls(onchange, 2)
	$data.bar = {[symbol]: false}
	assertSpyCalls(onchange, 3)
})

Deno.test('Non-enumerated', () => {
	const data = {}
	const $data = live(data)
	const onchange = spy()
	Object.defineProperty(data, 'foo', {value: 23, writable: true})
	assertEquals($data.foo, 23)
	$data.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$data.foo++
	assertSpyCalls(onchange, 1)
})

Deno.test('Property setting', () => {
	const data = {foo: 23}
	const $data = live(data)
	const onchange = spy()
	const onnever = spy()
	$data.$foo.addEventListener('change', onnever)
	$data.$$foo.addEventListener('change', onchange)
	$data.$foo = 44
	assertSpyCalls(onchange, 1)
	assertSpyCalls(onnever, 0)
})

Deno.test('Misuse', () => {
	const data = {fn: () => {}, set: new Set, foo: live(23)}
	const $data = live(data)
	const onchange = spy()
	assertThrows(() => $data.$fn(), TypeError)
	assertThrows(() => $data.$set.add(23))
	assertThrows(() => Object.defineProperty($data, 'bar', {value: 'baz'}))
	$data.$set.addEventListener('change', onchange)
	$data.set.add(5)
	assertSpyCalls(onchange, 0)
	$data.set.clear()
	assertSpyCalls(onchange, 0)
	assertNotEquals($data.foo, 23)
	assertEquals(live.get($data.foo), 23)
	assertEquals(live.get(live(live(data))), data)
})
