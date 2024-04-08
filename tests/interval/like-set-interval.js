const { interval } = self.yozo;

let triggers = 0;
const flow = interval(100).then(() => {
	triggers++;
});

assert(triggers == 0);

await new Promise((resolve) => setTimeout(resolve, 150));
assert(triggers == 1);

await new Promise((resolve) => setTimeout(resolve, 200));
assert(triggers == 3);

flow.stop();
