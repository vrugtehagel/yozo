const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.if(() => {}) == flow);

flow.stop();
