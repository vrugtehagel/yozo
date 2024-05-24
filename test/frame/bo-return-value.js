const { frame, Flow } = self.yozo;
const flow = frame();

assert(flow instanceof Flow);

flow.stop();
