const { live } = self.yozo;

const $ = live({ foo: { bar: 23 } });
let triggers = 0;
$.addEventListener('deepchange', () => {
	triggers++;
});

$.$foo.bar = 5;
assert(triggers == 1);

$.foo = null;
assert(triggers == 2);

$.baz = 'qux';
assert(triggers == 3);
