const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.if(() => {}) == flow);

flow.stop();
