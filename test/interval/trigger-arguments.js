const { interval } = self.yozo;

let amount;
const flow = interval(10).then((...args) => {
	amount = args.length;
});

await flow;
assert(amount == 0);

flow.stop();
