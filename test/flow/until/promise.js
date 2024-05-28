const { Flow } = self.yozo;
const flow = new Flow();
let stop;
const promise = new Promise((resolve) => stop = resolve);
let stopped = false;
flow.until(promise).cleanup(() => stopped = true);

assert(!stopped);

stop();
await 'microtask';
assert(stopped);

flow.stop();
