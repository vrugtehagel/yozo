const { live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
$.$foo.addEventListener('change', (event) => {
	triggers++;
});

$.foo = 23;
assert(triggers == 0);

live.set($, { foo: 23 });
assert(triggers == 0);
