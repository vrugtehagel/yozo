const { effect, live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
effect(() => {
	$.foo;
	triggers++;
}, (updater) => updater());

assert(triggers == 1);
await 'microtask';
assert(triggers == 1);

$.foo = 5;

assert(triggers == 2);

$.foo = -1;
$.foo = 23;

assert(triggers == 4);
