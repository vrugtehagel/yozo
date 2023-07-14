import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {Flow, timeout, track, until, live} = self.yozo

Deno.test('Tracking live', () => {
	const $ = live({foo: 23})
	const onchange = spy()
	const call = track.live(() => {
		$.foo
		if($.bar) $.baz
	})
	call.live.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	$.foo++
	assertSpyCalls(onchange, 1)
	$.baz = 'qux'
	assertSpyCalls(onchange, 1)
	$.bar = true
	assertSpyCalls(onchange, 2)
	delete $.bar
	assertSpyCalls(onchange, 3)
	live.set($, null)
	assertSpyCalls(onchange, 4)
})

Deno.test('Watched only', () => {
	const $ = live({foo: 23})
	const call = track.live(() => {
		$.foo
		const flow = new Flow
	})
	assertEquals(Object.keys(call).sort(), ['live', 'result'])
})

Deno.test('With until()', async () => {
	const $ = live({foo: 23})
	const onchange = spy()
	const call = track.live(async () => {
		$.foo
		await until(timeout(20))
		if($.bar) $.baz
	})
	call.live.addEventListener('change', onchange)
	await call.result
	assertSpyCalls(onchange, 0)
	$.foo++
	assertSpyCalls(onchange, 1)
	$.baz = 'qux'
	assertSpyCalls(onchange, 1)
	$.bar = true
	assertSpyCalls(onchange, 2)
})

Deno.test('Return value', () => {
	const $ = live({foo: 23})
	const onchange = spy()
	const call = track.live(() => $.foo)
	call.live.addEventListener('change', onchange)
	assertEquals(call.result, 23)
	assertSpyCalls(onchange, 0)
	$.foo++
	assertEquals(call.result, 23)
	assertSpyCalls(onchange, 1)
})

Deno.test('Misuse', () => {
	assertThrows(() => track.live(null), TypeError)
	assertThrows(() => track.live({}), TypeError)
})
