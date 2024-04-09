const { Flow, timeout } = self.yozo;
const flow = new Flow();
let total = 0;
let endReached = 0;
flow.then((number) => total += number)
	.throttle(80)
	.if((number) => number == 1)
	.once()
	.then(() => endReached++)
	.now(100);

assert(total == 100);

await timeout(40);
flow.now(1);
flow.now(1);
assert(total == 102);
assert(endReached == 0);

await timeout(60);
assert(endReached == 1);

flow.now(10);
assert(total == 102);
