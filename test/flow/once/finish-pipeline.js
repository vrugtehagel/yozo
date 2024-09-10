const { Flow } = self.yozo;
const flow = new Flow();
let resolve;
const promise = new Promise((...args) => resolve = args[0]);
let stopped = false;
flow.once()
	.await(() => promise)
	.cleanup(() => stopped = true);

flow.now();
await 'microtask';
flow.now();
assert(!stopped);

resolve();
await 'microtask';
assert(stopped);
