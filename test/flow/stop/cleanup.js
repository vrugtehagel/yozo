const { Flow } = globalThis.yozo;
const flow = new Flow();
let cleanups = 0;

flow.cleanup(() => cleanups++);
flow.stop();
assert(cleanups == 1);

flow.stop();
assert(cleanups == 1);
