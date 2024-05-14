const { timeout } = self.yozo;

let triggers = 0;
const flow = timeout(100).then(() => {
	triggers++;
});

await new Promise((resolve) => setTimeout(resolve, 50));
assert(triggers == 0);

await new Promise((resolve) => setTimeout(resolve, 100));
assert(triggers == 1);

await new Promise((resolve) => setTimeout(resolve, 150));
assert(triggers == 1);

flow.stop();
