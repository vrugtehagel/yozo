const { Flow, timeout } = self.yozo;
let trigger;
const flow = new Flow();
flow.throttle(10).then((...args) => {
	trigger = args[0];
});

flow.now(5);
flow.now(-1);
await 'microtask';
flow.now(23);
assert(trigger == 5);

await timeout(20);
assert(trigger == 23);

flow.stop();
