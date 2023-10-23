import { register } from '/-/js/test-kit/index.js'

const tests = await register(new URL('../test.tks', window.location.href))
const container = document.querySelector('#test-container')
const testSummary = document.querySelector('test-summary')
const testMap = new Map

testSummary.total = tests.length

for(const test of tests){
	const testCase = document.createElement('test-case')
	testCase.description = test.name
	testCase.value = test.code
	testCase.status = 'pending'
	container.append(testCase)
	testMap.set(test, testCase)
}

Object.assign(testSummary, {failed: 0, invalid: 0, success: 0})

for(const test of tests){
	const testCase = testMap.get(test)
	testCase.status = 'running'
	const success = await test.run().then(() => true, () => false)
	if(success){ testCase.status = 'verifying' }
	else {
		testCase.status = 'failed'
		testSummary.failed++
		continue
	}
	const verified = await test.verify().then(() => true, () => false)
	if(verified){
		testCase.status = 'success'
		testSummary.success++
	} else {
		testCase.status = 'invalid'
		testSummary.invalid++
	}
}

