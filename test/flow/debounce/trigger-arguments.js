const { Flow, timeout } = self.yozo;
let trigger;
const flow = new Flow();
flow.debounce(10).then((...args) => {
	trigger = args[0];
});

flow.now(5);
flow.now(-1);
await 'microtask';
flow.now(23);

await timeout(20);
assert(trigger == 23);

flow.stop();
