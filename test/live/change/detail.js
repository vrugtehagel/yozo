const { live } = self.yozo;

const $ = live({ foo: 23 });
let detail;
$.$foo.addEventListener('change', (event) => {
	detail = event.detail;
});

$.foo = 5;
assert(detail.value == 5);
assert(detail.oldValue == 23);

$.foo = -2;
assert(detail.value == -2);
assert(detail.oldValue == 5);
