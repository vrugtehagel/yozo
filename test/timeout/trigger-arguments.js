const { timeout } = self.yozo;

let amount;
const flow = timeout(10).then((...args) => {
	amount = args.length;
});

await flow;
assert(amount == 0);

flow.stop();
