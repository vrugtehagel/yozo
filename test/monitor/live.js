const { monitor, live } = self.yozo;

const $data = live({ foo: 23 });
const call = monitor(['live'], () => {
	$data.foo;
});

let changes = 0;
call.live.addEventListener('change', () => {
	changes++;
});

$data.foo++;

assert(changes == 1);
