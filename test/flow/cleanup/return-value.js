const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.cleanup(() => {}) == flow);

flow.stop();
