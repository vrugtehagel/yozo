const { Flow } = globalThis.yozo;
let triggers = 0;
const flow = new Flow();
flow.then(() => triggers++);

flow.stop();
flow.now();

assert(triggers == 0);
