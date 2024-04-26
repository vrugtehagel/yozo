const { live, when } = self.yozo;

const $ = live({ a: 2, b: 3 });
let triggers = 0;
when($.$sum).changes().then(() => {
	triggers++;
});

live.link($.$sum, () => $.a + $.b);

assert($.sum == 5);
assert(triggers == 1);

$.a = 8;
$.b = 15;
assert(triggers == 3);
