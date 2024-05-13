const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.cleanup(() => {}) == flow);

flow.stop();
