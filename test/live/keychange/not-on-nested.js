const { live } = self.yozo;

const $ = live({ foo: 23, bar: { baz: -5 } });
let triggers = 0;
$.addEventListener('keychange', (event) => {
	triggers++;
});

delete $.$bar.baz;
$.$bar.qux = 11;

assert(triggers == 0);
