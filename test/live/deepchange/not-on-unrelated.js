const { live } = self.yozo;

const $ = live({ foo: { bar: 23 }, baz: 'qux' });
let triggers = 0;
$.$baz.addEventListener('deepchange', (event) => {
	triggers++;
});

$.$foo.bar = 5;
$.foo = null;
assert(triggers == 0);
