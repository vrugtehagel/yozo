const { live } = self.yozo;

const $ = live({ foo: 23, bar: -5 });
let detail;
let triggers = 0;
$.addEventListener('keychange', (event) => {
	triggers++;
	detail = event.detail;
});

$.baz = 2;
assert(triggers == 1);
assert(detail.keys.length == 1);
assert(detail.keys[0] == 'baz');

live.set($, { foo: 11, qux: 23 });

assert(triggers == 2);
assert(detail.keys.length == 3);
assert(detail.keys[0] == 'bar');
assert(detail.keys[1] == 'baz');
assert(detail.keys[2] == 'qux');
