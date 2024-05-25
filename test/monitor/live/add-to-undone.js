const { monitor, until, live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
const call = monitor(['live', 'undo'], async () => {
	await until('microtask');
	call.undo();
	monitor.add('live', $.$foo, 'deepchange');
});

call.live.addEventListener('change', () => {
	triggers++;
});

await call.result;

$.foo = 10;
assert(triggers == 1);
