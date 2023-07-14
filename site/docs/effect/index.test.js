import { assertSpyCalls, spy } from 'std/testing/mock.ts'
import { assertEquals, assertNotEquals, assertThrows } from 'std/testing/asserts.ts'
import 'src/index.js'

const {effect, live, timeout, Flow, until} = self.yozo

Deno.test('Re-running', async () => {
	const $ = live({foo: 23})
	const oneffect = spy(() => {
		$.foo
		if($.bar) $.baz
	})
	effect(oneffect)
	assertSpyCalls(oneffect, 0)
	await 'microtask'
	assertSpyCalls(oneffect, 1)
	$.foo++
	assertSpyCalls(oneffect, 1)
	await 'microtask'
	assertSpyCalls(oneffect, 2)
	$.baz = 'qux'
	await 'microtask'
	assertSpyCalls(oneffect, 2)
	$.bar = true
	await 'microtask'
	assertSpyCalls(oneffect, 3)
	delete $.baz
	$.foo++
	await 'microtask'
	assertSpyCalls(oneffect, 4)
})

Deno.test('Slow scheduling', async () => {
	const $ = live({foo: 23})
	const oneffect = spy(() => $.foo)
	effect(oneffect, update => setTimeout(update, 20))
	$.foo++
	await 'microtask'
	assertSpyCalls(oneffect, 0)
	await timeout(20)
	assertSpyCalls(oneffect, 1)
})

Deno.test('Synchronous', () => {
	const $ = live({foo: 23})
	const oneffect = spy(() => $.foo)
	effect(oneffect, update => update())
	assertSpyCalls(oneffect, 1)
	$.foo++
	$.foo++
	assertSpyCalls(oneffect, 3)
})

Deno.test('Manual reruns', async () => {
	const $ = live({foo: 23})
	const oneffect = spy(() => $.foo)
	const flow = effect(oneffect)
	assertSpyCalls(oneffect, 0)
	flow.now()
	assertSpyCalls(oneffect, 1)
	await 'microtask'
	assertSpyCalls(oneffect, 2)
})

Deno.test('Stopping effect', async () => {
	const $ = live({foo: 23})
	const oneffect = spy(() => $.foo)
	const flow = effect(oneffect)
	flow.stop()
	await 'microtask'
	assertSpyCalls(oneffect, 0)
})

Deno.test('Flows', async () => {
	const $ = live({foo: 23})
	const ontrigger = spy()
	const triggers = []
	const trigger = () => triggers.forEach(trigger => trigger())
	const flow = effect(() => {
		const flow = new Flow(resolve => triggers.push(resolve))
		flow.then(ontrigger)
		$.foo
	})
	await 'microtask'
	assertSpyCalls(ontrigger, 0)
	trigger()
	assertSpyCalls(ontrigger, 1)
	$.foo++
	await 'microtask'
	assertSpyCalls(ontrigger, 1)
	trigger()
	assertSpyCalls(ontrigger, 2)
	flow.stop()
	trigger()
	assertSpyCalls(ontrigger, 2)
})

Deno.test('With until()', async () => {
	const $ = live({foo: 23})
	const oneffect = spy(async () => {
		$.foo
		await until('microtask')
		if($.bar) $.baz
	})
	effect(oneffect)
	assertSpyCalls(oneffect, 0)
	await 'microtask'
	await 'microtask'
	await 'microtask'
	assertSpyCalls(oneffect, 1)
	$.foo++
	assertSpyCalls(oneffect, 1)
	await 'microtask'
	await 'microtask'
	await 'microtask'
	assertSpyCalls(oneffect, 2)
	$.baz = 'qux'
	await 'microtask'
	await 'microtask'
	await 'microtask'
	assertSpyCalls(oneffect, 2)
	$.bar = true
	await 'microtask'
	await 'microtask'
	await 'microtask'
	assertSpyCalls(oneffect, 3)
	delete $.baz
	$.foo++
	await 'microtask'
	await 'microtask'
	await 'microtask'
	assertSpyCalls(oneffect, 4)
})
