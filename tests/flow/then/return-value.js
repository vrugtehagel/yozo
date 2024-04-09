const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.then(() => {}) == flow);

flow.stop();
