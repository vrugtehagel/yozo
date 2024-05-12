const { live } = self.yozo;

const $ = live({ foo: { bar: 23 } });
let triggers = 0;
$.$foo.addEventListener('deepchange', (event) => {
	triggers++;
});

$.$foo.bar = 23;
assert(triggers == 0);

live.set($, live.get($));
assert(triggers == 0);
