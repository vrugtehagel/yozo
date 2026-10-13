const { frame, Flow } = globalThis.yozo;
const flow = frame();

assert(flow instanceof Flow);

flow.stop();
