const { purify, monitor, until, timeout } = self.yozo;

let before = 0;
let after = 0;
const purified = purify(async () => {
	monitor.add('undo', () => before++);
	await until(timeout(10));
	monitor.add('undo', () => after++);
});

purified();
assert(before == 0);
assert(after == 0);

purified();
assert(before == 1);
assert(after == 0);

purified();
assert(before == 2);
assert(after == 0);

await timeout(20);
purified();
assert(before == 3);
assert(after == 1);

await timeout(20);
