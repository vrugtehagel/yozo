const { Flow } = globalThis.yozo;

let amount;
const flow = new Flow();
flow.cleanup((...args) => {
	amount = args.length;
});
flow.stop();

assert(amount == 0);
