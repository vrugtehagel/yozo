const { Flow } = self.yozo;
const flow = new Flow();
let stopped = false;
flow.until((a, b) => a + b).cleanup(() => stopped = true);

flow.now(1, -1);
flow.now(-23, 23);
flow.now(0, 0);
assert(!stopped);

flow.now(5, 7);
assert(stopped);
