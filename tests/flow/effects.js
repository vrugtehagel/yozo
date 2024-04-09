const { live, effect, when } = self.yozo;
const $data = live({
	activeIndex: 0,
	array: ['foo', 'bar', 'baz']
});
let changes = 0
effect(() => {
	const index = $data.activeIndex;
	const $item = $data.$array['$' + index];
	when($item).changes().then(() => changes++);
});
await 'microtask'
$data.$array[0] = 'qux';
assert(changes == 1);

$data.$array[1] = 'quux';
$data.activeIndex = 1;
await 'microtask'
$data.$array[0] = 'foo again';
assert(changes == 1);

$data.$array[1] = 'bar again';
assert(changes == 2);
