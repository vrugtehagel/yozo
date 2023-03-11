import { assertSpyCall, assertSpyCalls, spy, stub } from 'https://deno.land/std@0.174.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.174.0/testing/asserts.ts'
import { FakeTime } from 'https://deno.land/std@0.174.0/testing/time.ts'

import Thennable from '../thennable.js'
import timeout from '../timeout.js'

Deno.test('[Thennable] basic', () => {
	let trigger
	const thennable = new Thennable(triggerer => trigger = triggerer)
	const callback = spy()
	thennable.then(callback)
	trigger('abc', 123)
	assertSpyCall(callback, 0, {args: ['abc', 123]})
	assertSpyCalls(callback, 1)
})

Deno.test('[Thennable] .now()', () => {
	const thennable = new Thennable
	const callback = spy()
	thennable.then(callback)
	thennable.now('abc', 123)
	assertSpyCall(callback, 0, {args: ['abc', 123]})
	assertSpyCalls(callback, 1)
})

Deno.test('[Thennable] .then(), .await()', async () => {
    const time = new FakeTime
	const thennable = new Thennable
	const callback1 = spy()
	const callback2 = spy()
    thennable.then(callback1).await(() => timeout(300)).then(callback2)
    thennable.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 0)
    await time.tick(100)
    thennable.now()
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 0)
    await time.tick(200)
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 1)
    await time.tick(200)
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 2)
    time.restore()
})

Deno.test('[Thennable] .if()', () => {
	const thennable = new Thennable
	const callback1 = spy()
	const callback2 = spy()
	thennable.then(callback1).if(value => value == 23).then(callback2)
	thennable.now(-7)
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 0)
    thennable.now(23)
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 1)
})

Deno.test('[Thennable] .after()', async () => {
	const thennable = new Thennable
    const callback = spy()
    await thennable.then(callback).once().after(() => thennable.now())
    assertSpyCalls(callback, 1)
})

Deno.test('[Thennable] .or()', () => {
	const thennable1 = new Thennable
	const thennable2 = new Thennable
	const callback1 = spy()
	const callback2 = spy()
	thennable1.then(callback1).or(thennable2).then(callback2)
    thennable1.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 1)
    thennable2.now()
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 2)
    thennable1.die()
    thennable1.now()
    thennable2.now()
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 2)
})

Deno.test('[Thennable] .once()', async () => {
    const time = new FakeTime
    const thennable = new Thennable
    const callback1 = spy()
    const callback2 = spy()
    thennable
        .await(() => timeout(300))
        .then(callback1)
        .if(arg => arg == 5)
        .once()
        .then(callback2)
    thennable.now(23)
    await time.tick(200)
    assertSpyCalls(callback1, 0)
    assertSpyCalls(callback2, 0)
    await time.tick(100)
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 0)
    thennable.now(44)
    await time.tick(100)
    thennable.now(5)
    await time.tick(100)
    thennable.now(-7)
    await time.tick(100)
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 0)
    await time.tick(100)
    assertSpyCalls(callback1, 3)
    assertSpyCalls(callback2, 1)
    await time.tick(100)
    assertSpyCalls(callback1, 3)
    assertSpyCalls(callback2, 1)
    time.restore()
})

Deno.test('[Thennable] .die()', () => {
	const thennable = new Thennable
    const callback1 = spy()
    const callback2 = spy()
    thennable.then(callback1).then(() => thennable.die()).then(callback2)
    thennable.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 0)
    thennable.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 0)
})

Deno.test('[Thennable] .until() (callback)', () => {
	const thennable = new Thennable
    const callback1 = spy()
    const callback2 = spy()
    let stop = false
    thennable.then(callback1).until(() => stop).then(callback2)
    thennable.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 1)
    stop = true
    thennable.now()
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 1)
    thennable.now()
    assertSpyCalls(callback1, 2)
    assertSpyCalls(callback2, 1)
})

Deno.test('[Thennable] .until() (value)', async () => {
    const time = new FakeTime
	const thennable = new Thennable
    const callback = spy()
    thennable.until(timeout(500)).then(callback)
    thennable.now()
    assertSpyCalls(callback, 1)
    await time.tick(500)
    thennable.now()
    assertSpyCalls(callback, 1)
    time.restore()
})

Deno.test('[Thennable] .debounce()', async () => {
    const time = new FakeTime
	const thennable = new Thennable
    const callback = spy()
    thennable.debounce(300).then(callback)
    thennable.now()
    await time.tick(200)
    thennable.now()
    await time.tick(200)
    thennable.now()
    assertSpyCalls(callback, 0)
    await time.tick(200)
    assertSpyCalls(callback, 0)
    await time.tick(100)
    assertSpyCalls(callback, 1)
    time.restore()
})

Deno.test('[Thennable] .throttle()', async () => {
    const time = new FakeTime
    const thennable = new Thennable
    const callback = spy()
    thennable.throttle(300).then(callback)
    thennable.now()
    thennable.now()
    assertSpyCalls(callback, 1)
    await time.tick(400)
    assertSpyCalls(callback, 2)
    thennable.now()
    thennable.now()
    thennable.now(23)
    assertSpyCalls(callback, 2)
    await time.tick(200)
    assertSpyCalls(callback, 3)
    assertSpyCall(callback, 2, {args: [23]})
    await time.tick(400)
    assertSpyCalls(callback, 3)
    time.restore()
})

Deno.test('[Thennable] .pipe()', () => {
	const thennable = new Thennable
	const callback = spy()
	const pipes = []
	thennable.pipe((next, ...args) => pipes.push([next, args])).then(callback)
	thennable.now(5)
	thennable.now('foo', 'bar')
	assertEquals(pipes[0][1], [5])
	assertEquals(pipes[1][1], ['foo', 'bar'])
	assertSpyCalls(callback, 0)
	pipes[1][0]()
	assertSpyCalls(callback, 1)
	assertSpyCall(callback, 0, {args: ['foo', 'bar']})
})


