const { Flow, timeout } = self.yozo;
let triggers = 0;
const flow = new Flow();
flow.throttle(10).then(() => {
	triggers++;
});

flow.now();
assert(triggers == 1);

flow.now();
await 'microtask';
flow.now();
flow.stop();

await timeout(20);
assert(triggers == 1);
