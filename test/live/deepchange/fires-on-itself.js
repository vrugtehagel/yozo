const { live } = self.yozo;

const $ = live({ foo: 23 });
let triggers = 0;
$.$foo.addEventListener('deepchange', () => {
	triggers++;
});

$.foo = 5;
assert(triggers == 1);

$.foo = -2;
assert(triggers == 2);
