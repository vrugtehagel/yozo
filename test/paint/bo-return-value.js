const { paint, Flow } = globalThis.yozo;
const flow = paint();

assert(flow instanceof Flow);

flow.stop();
