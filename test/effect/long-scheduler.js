const { effect, live, timeout } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
effect(() => {
	$.foo;
	triggers++;
}, updater => setTimeout(updater, 20));

assert(triggers == 0);
await timeout(10);
assert(triggers == 0);
await timeout(20);
assert(triggers == 1);

$.foo = -1;
$.foo = 23;

await timeout(10);
assert(triggers == 1);
await timeout(20);
assert(triggers == 2);
