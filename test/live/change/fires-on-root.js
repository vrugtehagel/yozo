const { live } = self.yozo;

const $number = live(23);
let triggers = 0;
$number.addEventListener('change', (event) => {
	triggers++;
});

live.set($number, 5);
assert(triggers == 1);

live.set($number, -2);
assert(triggers == 2);
