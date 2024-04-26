const { live, when } = self.yozo;

const $ = live({ number: 23 });
const link = live.link($.$double, {
	get: () => $.number * 2,
});

assert($.double == 46);

$.number = 5;
assert($.double == 46);

$.double = 5;
assert($.double == 46);

link.now();
assert($.double == 10);
