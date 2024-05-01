const { monitor, effect, live } = self.yozo;

const $ = live({ foo: 23, bar: 7 });
let sum;
effect(() => {
	sum = $.foo + monitor.ignore(() => $.bar);
});

await 'microtask';
assert(sum == 30);

$.foo = 5;
await 'microtask';
assert(sum == 12);

$.bar = -1;
await 'microtask';
assert(sum == 12);

$.foo = 49;
await 'microtask';
assert(sum == 48);
