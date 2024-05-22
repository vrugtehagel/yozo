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
assert(triggers == 1);

await timeout(20);
assert(triggers == 2);

await timeout(10);
assert(triggers == 2);

flow.now();
assert(triggers == 3);

flow.stop();
