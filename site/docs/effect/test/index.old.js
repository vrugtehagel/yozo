import { TestSuite } from '/-/js/client-testing/index.js'

export const suite = new TestSuite
const {live, effect} = self.yozo

suite.test('Effect callback runs after one microtask by default', t => {
	const $ = live({ foo: 23 });
	let count = 0;
	effect(() => count++);

	t.act(async () => {});
	t.assert(() => count == 1);
});

suite.test('Effect callback reruns when a live dependency changes', async t => {
	const $ = live({ foo: 23 });
	let count = 0;
	effect(() => {
		$.foo;
		count++;
	});
	await 'microtask'

	t.act(async () => $.foo = 44);
	t.assert(() => count == 2);
});

suite.test('Dependencies can leave if unused in the callback', async t => {
	const $ = live({ foo: 23, bar: true });
	let ran = false;
	const flow = effect(() => {
		if($.bar) $.foo;
		ran = true;
	});
	await 'microtask'

	t.act(async () => $.bar = false);
	t.assert(async () => {
		ran = false
		$.foo = 44;
		await 'microtask';
		return !ran;
	});
});
