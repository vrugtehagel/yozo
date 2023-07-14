import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {Flow, timeout, track, until, live} = self.yozo

Deno.test('Tracking multiple', () => {
	const $ = live({foo: 23})
	const ontrigger = spy()
	let trigger
	const onchange = spy()
	const call = track(['live', 'flows'], () => {
		$.foo
		new Flow(resolve => trigger = resolve).then(ontrigger)
	})
	call.live.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	assertSpyCalls(ontrigger, 0)
	$.foo++
	assertSpyCalls(onchange, 1)
	trigger()
	assertSpyCalls(ontrigger, 1)
	call.flows.stop()
	trigger()
	assertSpyCalls(ontrigger, 1)
})

Deno.test('With until()', async () => {
	const $ = live({foo: 23})
	const ontrigger = spy()
	let trigger
	const onchange = spy()
	const call = track(['live', 'flows'], async () => {
		await until(timeout(20))
		$.foo
		new Flow(resolve => trigger = resolve).then(ontrigger)
	})
	await call.result
	call.live.addEventListener('change', onchange)
	assertSpyCalls(onchange, 0)
	assertSpyCalls(ontrigger, 0)
	$.foo++
	assertSpyCalls(onchange, 1)
	trigger()
	assertSpyCalls(ontrigger, 1)
	call.flows.stop()
	trigger()
	assertSpyCalls(ontrigger, 1)
})

Deno.test('Tracking nothing', () => {
	const $ = live({foo: 23})
	const call = track([], () => {
		$.foo
		new Flow
		return 23
	})
	assert(!('flows' in call))
	assert(!('live' in call))
	assertEquals(call.result, 23)
})
