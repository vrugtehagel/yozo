const { live } = self.yozo;

const $ = live({ foo: 23, bar: -5 });
const symbol = Symbol();
let triggers = 0;
$.addEventListener('keychange', (event) => {
	triggers++;
});

$[symbol] = 'foo';
assert(triggers == 0);

delete $[symbol];
assert(triggers == 0);
