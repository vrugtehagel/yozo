const { effect, live, monitor } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
let flow;
const call = monitor(['undo'], () => {
	flow = effect(() => {
		$.foo;
		triggers++;
	});
});

assert(triggers == 0);
await 'microtask';
assert(triggers == 1);

call.undo();
$.foo = 5;

await 'microtask';
assert(triggers == 1);
