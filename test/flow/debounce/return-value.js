const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.debounce(100) == flow);

flow.stop();
