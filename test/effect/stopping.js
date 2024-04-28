const { effect, live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
const flow = effect(() => {
	$.foo;
	triggers++;
});

assert(triggers == 0);
await 'microtask';
assert(triggers == 1);

flow.stop();
$.foo = 5;

await 'microtask';
assert(triggers == 1);
