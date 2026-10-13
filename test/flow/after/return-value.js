const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.after(() => {}) == flow);

flow.stop();
