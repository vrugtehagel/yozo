const { Flow } = self.yozo;
const flow = new Flow();
let triggers = 0;
flow.then(() => {
	triggers++;
});

flow.now().now();

assert(triggers == 2);

flow.stop();
