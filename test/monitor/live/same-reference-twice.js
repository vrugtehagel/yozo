const { monitor, live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
const call = monitor(['live'], () => {
	monitor.add('live', $.$foo, 'deepchange');
	monitor.add('live', $.$foo, 'deepchange');
});

call.live.addEventListener('change', () => {
	triggers++;
});

assert(triggers == 0);

$.foo = 10;
assert(triggers == 1);
