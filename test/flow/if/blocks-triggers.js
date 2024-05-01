const { Flow } = self.yozo;
let triggers = 0;
let pass = true;
const flow = new Flow();
flow.if(() => pass).then(() => {
	triggers++;
});

flow.now();
assert(triggers == 1);

pass = false;
flow.now();
flow.now();
assert(triggers == 1);

pass = true;
flow.now();
assert(triggers == 2);
flow.stop();
