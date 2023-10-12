import { test } from '/-/js/test-kit/index.js'

test(assert => {
	const $ = live({foo: 23})
	let calls = 0
	$.$foo.addEventListener('change', () => calls++)
	$.foo = 24
	assert(calls == 1)
})

test(assert => {
	const $ = live({foo: {bar: 23}})
	let calls = 0
	$.$foo.addEventListener('change', () => calls++)
	$.$foo.bar = 24
	assert(calls == 0)
})

test(assert => {
	const $ = live({foo: {bar: 23}})
	let calls = 0
	$.$foo.addEventListener('deepchange', () => calls++)
	$.$foo.bar = 24
	assert(calls == 1)
})

test(assert => {
	const $ = live({foo: {bar: 23}})
	let calls = 0
	$.$foo.addEventListener('keychange', () => calls++)
	$.$foo.bar = 24
	assert(calls == 0)
})

test(assert => {
	const $ = live({foo: {bar: 23}})
	let calls = 0
	$.$foo.addEventListener('keychange', () => calls++)
	$.$foo.baz = 24
	assert(calls == 1)
})

test(assert => {
	const original = {foo: 23}
	const $ = live(original)
	$.foo = 24
	assert(original.foo == 24)
})

