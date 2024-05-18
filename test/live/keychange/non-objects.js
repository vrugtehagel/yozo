const { live } = self.yozo;

const $ = live({ foo: 23, bar: -5 });
let changes = 0;
$.addEventListener('keychange', (event) => {
	changes += event.detail.keys.length;
});

live.set($, 'nonobject');
assert(changes == 2);

live.set($, { foo: 23 });
assert(changes == 3);

live.set($, undefined);
assert(changes == 4);
