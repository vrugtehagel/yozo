import { TestSuite } from '/-/js/testing/index.js'

export const suite = new TestSuite({
	name: 'connected()'
})

// test.html
// <test-component></test-component>

// test-component.yz
// <title>test-component</title>
// <meta attribute=count type=number>
//
// <script>
// connected(() => $.count++)
// </script>

suite.test('Connect runs after element upgrade', {
	html: '/docs/component/connect/test.html',
}, ({act, assert}) => {
	act(async () => await self.yozo.register('./test-component.yz'))
	assert(() => document.querySelector('test-component').count == 1)
})
