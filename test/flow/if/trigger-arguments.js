const { Flow } = self.yozo;
let triggers = 0;
const flow = new Flow();
flow.if((a, b) => a + b > 0).then(() => {
	triggers++;
});

flow.now(5, 7);
assert(triggers == 1);

flow.now(-5, -7);
flow.now(5, -7);
assert(triggers == 1);

flow.now(-5, 7);
assert(triggers == 2);
flow.stop();
