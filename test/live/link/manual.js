const { live } = self.yozo;

const $live = live();
let plain = 5;
const link = live.link($live, {
	get: () => plain,
	set: (value) => plain = value,
});

live.set($live, 23);
assert(plain == 23);

plain = -1;
link.now();
assert(live.get($live) == -1);
