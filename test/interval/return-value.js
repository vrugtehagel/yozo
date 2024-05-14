const { interval, Flow } = self.yozo;
const flow = interval(100);

assert(flow instanceof Flow);

flow.stop();
