const { Flow } = self.yozo;
const flow = new Flow();

assert(flow.once() == flow);

flow.stop();
