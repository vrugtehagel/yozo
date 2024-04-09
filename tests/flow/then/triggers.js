const { Flow } = self.yozo;
let triggers = 0;
const flow = new Flow();
flow.then(() => {
	triggers++
});

flow.now();
assert(triggers == 1);

flow.now();
assert(triggers == 2);

flow.stop();
