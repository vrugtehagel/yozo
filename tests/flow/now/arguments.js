const { Flow } = self.yozo;
const flow = new Flow();
let triggers = [];
flow.then((...args) => triggers.push(args));

flow.now(23, 'foo');

assert(triggers[0]?.[0] == 23);
assert(triggers[0]?.[1] == 'foo');

flow.stop();
