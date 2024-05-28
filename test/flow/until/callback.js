const { Flow } = self.yozo;
const flow = new Flow();
let stop = false;
let stopped = false;
flow.until(() => stop).cleanup(() => stopped = true);

flow.now();
flow.now();
assert(!stopped);

stop = true;
flow.now();
assert(stopped);

stop = false;
flow.now();
assert(stopped);

flow.stop();
