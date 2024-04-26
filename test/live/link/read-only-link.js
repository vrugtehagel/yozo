const { live, when } = self.yozo;

const $ = live({ number: 23 });
live.link($.$double, {
	get: () => $.number * 2,
	changes: when($.$number).changes(),
});

assert($.double == 46);

$.number = 10;
assert($.double == 20);

$.double = 10;
assert($.double == 20);
