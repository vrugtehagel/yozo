const { timeout, Flow } = self.yozo;
const flow = timeout(100);

assert(flow instanceof Flow);

flow.stop();
