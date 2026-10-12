const { Flow } = globalThis.yozo;
const flow = new Flow();

assert(flow.until(() => {}) == flow);

flow.stop();
