const { monitor, live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
const call = monitor(['live'], () => {
	monitor.add('live', $.$foo, 'ping');
});

call.live.addEventListener('change', () => {
	triggers++;
});

$.dispatchEvent(new CustomEvent('ping'));
assert(triggers == 0);

$.$foo.dispatchEvent(new CustomEvent('ping'));
assert(triggers == 1);

$.$foo.dispatchEvent(new CustomEvent('ping'));
assert(triggers == 2);
