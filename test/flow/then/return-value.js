const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.then(() => {}) == flow);

flow.stop();
