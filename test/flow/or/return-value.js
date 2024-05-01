const { Flow } = self.yozo;
const flow = new Flow();
const other = new Flow();

assert(flow.or(other) == flow);

flow.stop();
