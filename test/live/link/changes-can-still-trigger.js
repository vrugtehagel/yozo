const { live, when } = self.yozo;

const $ = live({ number: 23 });
const changes = when($.$number).changes();
const link = live.link($.$double, {
	get: () => $.number * 2,
	set: (value) => $.number = value / 2,
	changes,
});
let triggers = 0;
changes.then(() => {
	triggers++;
});

assert(triggers == 0);

$.double = 10;
assert(triggers == 1);

// link.stop();
// $.number = 10;
// assert(triggers == 2);
