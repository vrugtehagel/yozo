const { effect, live } = self.yozo;

const $ = live({
	condition: true,
	ifTrue: 'foo',
	ifFalse: 'bar',
});
let triggers = 0;
let current;
effect(() => {
	triggers++;
	current = $.condition ? $.ifTrue : $.ifFalse;
});

await 'microtask';
assert(triggers == 1);
assert(current == 'foo');

$.ifFalse = 'baz';

await 'microtask';
assert(triggers == 1);

$.ifTrue = 'qux';

await 'microtask';
assert(triggers == 2);
assert(current == 'qux');

$.condition = false;

await 'microtask';
assert(triggers == 3);
assert(current == 'baz');
