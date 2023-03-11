import { assertSpyCall, assertSpyCalls, spy } from 'https://deno.land/std@0.174.0/testing/mock.ts'
import { assert, assertEquals, assertStrictEquals } from 'https://deno.land/std@0.174.0/testing/asserts.ts'
import { FakeTime } from 'https://deno.land/std@0.174.0/testing/time.ts'

import timeout from '../timeout.js'
import track from '../track.js'

Deno.test('[timeout] Basic', () => {
    const time = new FakeTime
    const callback = spy()
    timeout(200).then(callback)
    time.tick(100)
    assertSpyCalls(callback, 0)
    time.tick(200)
    assertSpyCalls(callback, 1)
    time.tick(200)
    assertSpyCalls(callback, 1)
    time.restore()
})

Deno.test('[timeout] Multiple timers', () => {
    const time = new FakeTime
    const callback1 = spy()
    const callback2 = spy()
    const thennable1 = timeout(300).then(callback1)
    const thennable2 = timeout(200).then(callback2)
    time.tick(100)
    thennable1.die()
    assertSpyCalls(callback1, 0)
    assertSpyCalls(callback2, 0)
    time.tick(200)
    assertSpyCalls(callback1, 0)
    assertSpyCalls(callback2, 1)
    time.restore()
})

Deno.test('[timeout] Cleans up after dying', () => {
    const time = new FakeTime
    const callback = spy()
    const thennable = timeout(200).then(callback)
    time.tick(100)
    thennable.die()
    time.tick(200)
    assertSpyCalls(callback, 0)
    time.restore()
})

Deno.test('[timeout] Is trackable', () => {
    const time = new FakeTime
    const callback = spy()
    const call = track(() => timeout(200).then(callback))
    time.tick(100)
    call.undo()
    time.tick(200)
    assertSpyCalls(callback, 0)
    time.restore()
})

Deno.test('[timeout] Dies if triggered manually', () => {
    const time = new FakeTime
    const callback1 = spy()
    const callback2 = spy()
    const thennable = timeout(200).then(callback1).cleanup(callback2)
    time.tick(100)
    thennable.now()
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 1)
    time.tick(200)
    assertSpyCalls(callback1, 1)
    assertSpyCalls(callback2, 1)
    time.restore()
})

