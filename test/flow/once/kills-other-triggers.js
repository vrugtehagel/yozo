const { Flow } = self.yozo;
const flow = new Flow();
let first = 0;
let second = 0;
let stopped = false;
flow.await(() => 'microtask')
	.then(() => first++)
	.await(() => 'microtask')
	.then(() => second++)
	.once()
	.cleanup(() => stopped = true);

flow.now();
await 'microtask';
flow.now();

assert(first == 1);
assert(second == 0);
assert(!stopped);

await 'microtask';
assert(first == 1);
assert(second == 1);
assert(stopped);
