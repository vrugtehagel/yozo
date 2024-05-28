const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.until(() => {}) == flow);

flow.stop();
