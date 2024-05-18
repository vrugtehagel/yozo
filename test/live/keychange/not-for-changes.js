const { live } = self.yozo;

const $ = live({ foo: 23, bar: -5 });
let triggers = 0;
$.addEventListener('keychange', (event) => {
	triggers++;
});

$.bar = 2;
$.foo = 2;

assert(triggers == 0);
