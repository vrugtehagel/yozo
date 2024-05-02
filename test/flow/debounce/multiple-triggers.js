const { Flow, timeout } = self.yozo;
let triggers = 0;
const flow = new Flow();
flow.debounce(10).then(() => {
	triggers++;
});

flow.now();
flow.now();
await 'microtask';
flow.now();
assert(triggers == 0);

await timeout(20);
assert(triggers == 1);

flow.stop();
