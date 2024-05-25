const { monitor, until, live, timeout } = self.yozo;

const $ = live({ foo: 23, bar: 10 });
let triggers = 0;
const call = monitor(['live'], async () => {
	monitor.add('live', $.$foo, 'deepchange');
	await until(timeout(10));
	monitor.add('live', $.$bar, 'deepchange');
});

call.live.addEventListener('change', () => {
	triggers++;
});

await call.result;
assert(triggers == 0);

$.foo = 10;
assert(triggers == 1);

$.bar = 23;
assert(triggers == 2);
