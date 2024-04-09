const { Flow } = self.yozo;
let triggerArgs = [];
const flow = new Flow();
flow.then((...args) => {
	triggerArgs = args;
});

flow.now(23, 'foo');

assert(triggerArgs[0] == 23 && triggerArgs[1] == 'foo');

flow.stop();
