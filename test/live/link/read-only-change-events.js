const { live, when } = self.yozo;

const $ = live({ number: 23 });
let triggers = 0;
when($.$double).changes().then(() => {
	triggers++;
});
live.link($.$double, () => $.number * 2);

assert(triggers == 1);

$.double = 10;

assert($.double == 46);
assert(triggers == 3);
