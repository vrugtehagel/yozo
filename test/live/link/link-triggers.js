const { live, when } = self.yozo;

const $ = live({ a: 2, b: 3 });
const flow = live.link($.$sum, () => $.a + $.b);
let triggers = 0;
flow.then(() => {
	triggers++;
});

assert(triggers == 0);

$.a = 8;
$.b = 15;
assert(triggers == 2);

$.b = 'ball';
assert(triggers == 3);
