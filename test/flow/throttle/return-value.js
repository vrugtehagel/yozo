const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.throttle(100) == flow);

flow.stop();
