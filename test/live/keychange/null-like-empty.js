const { live } = self.yozo;

const $ = live({ foo: 23, bar: -5 });
let detail;
let triggers = 0;
$.addEventListener('keychange', (event) => {
	triggers++;
	detail = event.detail;
});

live.set($, null);
assert(triggers == 1);
assert(detail.keys.length == 2);
assert(detail.keys[0] == 'foo');
assert(detail.keys[1] == 'bar');

live.set($, { baz: 11 });
assert(triggers == 2);
assert(detail.keys.length == 1);
assert(detail.keys[0] == 'baz');
