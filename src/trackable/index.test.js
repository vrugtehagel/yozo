import { assertSpyCalls, spy } from 'https://deno.land/std@0.147.0/testing/mock.ts'
import { assertEquals, assertStrictEquals } from 'https://deno.land/std@0.147.0/testing/asserts.ts'

import trackable from './index.js'

Deno.test('[trackable] basic undo', () => {
    const doSpy = spy(() => {})
    const undoSpy = spy(() => {})
    const foo = trackable.define(() => {
        doSpy()
        const result = 23
        const undo = () => undoSpy()
        return {result, undo}
    })
    const bar = trackable(() => foo())
    const baz = trackable(() => bar())
    assertSpyCalls(doSpy, 0)
    assertSpyCalls(undoSpy, 0)
    const result = bar()
    assertEquals(result, 23)
    assertSpyCalls(doSpy, 1)
    assertSpyCalls(undoSpy, 0)
    const call = bar.do()
    assertEquals(call.result, 23)
    assertSpyCalls(doSpy, 2)
    assertSpyCalls(undoSpy, 0)
    call.undo()
    assertSpyCalls(doSpy, 2)
    assertSpyCalls(undoSpy, 1)
    baz.do().undo()
    assertSpyCalls(doSpy, 3)
    assertSpyCalls(undoSpy, 1)
})

Deno.test('[trackable] arguments', () => {
    const foo = trackable.define((a, b) => {
        const result = a + b
        return {result}
    })
    const bar = trackable((a, b, c) => {
        return foo(a, b) - foo(b, c)
    })
    assertEquals(foo(2, 3), 5)
    assertEquals(bar(5, 2, 3), 2)
    assertEquals(bar.do(7, 5, 4).result, 3)
})

Deno.test('[trackable] this', () => {
    const foo = trackable(function(){
        return this
    })
    const context = {}
    const result = foo.call(context)
    assertStrictEquals(result, context)
    const call = foo.do.call(context)
    assertStrictEquals(call.result, context)
})

Deno.test('[trackable] watch', () => {
    const variables = [{id: 0}, {id: 1}, {id: 2}]
    const foo = trackable.define(id => {
        const watch = variables[id]
        return {watch}
    })
    const bar = trackable(() => {
        foo(2)
        foo(0)
    })
    const call = bar.do()
    assertEquals(call.watch.size, 2)
    assertEquals([...call.watch], [{id: 2}, {id: 0}])
})
