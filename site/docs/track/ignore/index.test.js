import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {timeout, track, until, live} = self.yozo

Deno.test('Ignoring', () => {
	const $ = live({foo: 23})
	const onchange = spy()
	const call = track.live(() => {
		$.foo
		track.ignore(() => $.bar)
		$.baz
	})
	call.live.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$.foo++
	$.baz = 'qux'
	assertSpyCalls(onchange, 2)
	$.bar = true
	assertSpyCalls(onchange, 2)
})

Deno.test('With until()', async () => {
	const $ = live({foo: 23})
	const onchange = spy()
	const call = track.live(async () => {
		await until(timeout(20))
		track.ignore(() => $.bar)
		$.foo
	})
	call.live.addEventListener('change', onchange)
	await call.result
	assertSpyCalls(onchange, 0)
	$.foo++
	assertSpyCalls(onchange, 1)
	$.bar = true
	assertSpyCalls(onchange, 1)
})

Deno.test('Misuse', () => {
	assertThrows(() => track.ignore(null), TypeError)
	assertThrows(() => track.ignore({}), TypeError)
})
