const { paint, Flow } = self.yozo;
const flow = paint();

assert(flow instanceof Flow);

flow.stop();
