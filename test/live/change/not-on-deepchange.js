const { live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
$.$foo.addEventListener('change', (event) => {
	triggers++;
});

$.foo = { bar: 5 };
assert(triggers == 1);

$.$foo.bar = -2;
assert(triggers == 1);
