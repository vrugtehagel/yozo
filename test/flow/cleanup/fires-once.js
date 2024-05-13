const { Flow } = self.yozo;

let triggers = 0;
const flow = new Flow();
flow.cleanup(() => {
	triggers++;
});

flow.stop();
flow.stop();
assert(triggers == 1);
