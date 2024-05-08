const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.after(() => {}) == flow);

flow.stop();
