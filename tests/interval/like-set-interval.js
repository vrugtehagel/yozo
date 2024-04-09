const { interval } = self.yozo;

let triggers = 0;
const flow = interval(40).then(() => {
	triggers++;
});

assert(triggers == 0);

await new Promise((resolve) => setTimeout(resolve, 60));
assert(triggers == 1);

await new Promise((resolve) => setTimeout(resolve, 80));
assert(triggers == 3);

flow.stop();
