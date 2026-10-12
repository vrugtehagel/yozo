const { timeout, Flow } = globalThis.yozo;
const flow = timeout(100);

assert(flow instanceof Flow);

flow.stop();
