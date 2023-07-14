import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assert, assertEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {Flow, timeout, track, until} = self.yozo

Deno.test('Tracking flows', () => {
	const ontrigger = spy()
	let trigger
	const call = track.flows(() => {
		new Flow(resolve => trigger = resolve).then(ontrigger)
	})
	assertSpyCalls(ontrigger, 0)
	trigger()
	assertSpyCalls(ontrigger, 1)
	call.flows.stop()
	trigger()
	assertSpyCalls(ontrigger, 1)
})

Deno.test('Flows only', () => {
	const call = track.flows(() => new Flow)
	assertEquals(Object.keys(call).sort(), ['flows', 'result'])
})

Deno.test('Created only', () => {
	const ontrigger = spy()
	const triggers = []
	const trigger = () => triggers.forEach(trigger => trigger())
	const flow = new Flow(resolve => triggers.push(resolve))
	const call = track.flows(() => {
		flow.then(ontrigger)
		new Flow(resolve => triggers.push(resolve)).then(ontrigger)
	})
	assertSpyCalls(ontrigger, 0)
	trigger()
	assertSpyCalls(ontrigger, 2)
	call.flows.stop()
	trigger()
	assertSpyCalls(ontrigger, 3)
})

Deno.test('Control never flows', () => {
	const onflow = spy()
	let trigger
	const call = track.flows(() => {
		new Flow(resolve => trigger = resolve)
	})
	call.flows.then(onflow)
	trigger()
	call.flows.stop()
	trigger()
	assertSpyCalls(onflow, 0)
})

Deno.test('With until()', async () => {
	const ontrigger = spy()
	const onnever = spy()
	const triggers = []
	const trigger = () => triggers.forEach(trigger => trigger())
	const call = track.flows(async () => {
		new Flow(resolve => triggers.push(resolve)).then(ontrigger)
		await until(timeout(20))
		new Flow(resolve => triggers.push(resolve)).then(ontrigger)
		await until(timeout(20))
		new Flow(resolve => triggers.push(resolve)).then(ontrigger)
		onnever()
	})
	trigger()
	assertSpyCalls(ontrigger, 1)
	await timeout(30)
	trigger()
	assertSpyCalls(ontrigger, 3)
	call.flows.stop()
	trigger()
	assertSpyCalls(ontrigger, 3)
	await timeout(20)
	trigger()
	assertSpyCalls(ontrigger, 3)
	assertSpyCalls(onnever, 0)
})

Deno.test('Return value', () => {
	const ontrigger = spy()
	let trigger
	const call = track.flows(() => {
		new Flow(resolve => trigger = resolve).then(ontrigger)
		return 'foo'
	})
	assertEquals(call.result, 'foo')
})

Deno.test('Misuse', () => {
	assertThrows(() => track.flows(null), TypeError)
	assertThrows(() => track.flows({}), TypeError)
})
