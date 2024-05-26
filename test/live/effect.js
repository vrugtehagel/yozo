const { live, effect } = self.yozo;
const $ = live({ foo: 23 });
let count = 0;
effect(() => {
	$.foo;
	count++;
});
await 'microtask';
assert(count == 1);

$.foo = { bar: 'qux' };
await 'microtask';
assert(count == 2);

$.$foo.bar = 'quux';
await 'microtask';
assert(count == 2);
