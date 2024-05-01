const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.pipe(() => {}) == flow);

flow.stop();
