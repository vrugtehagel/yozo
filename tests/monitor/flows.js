const { monitor, Flow } = self.yozo;

let clean = false;
const call = monitor(['undo'], () => {
	const flow = new Flow();
	flow.cleanup(() => clean = true);
});

assert(!clean);
call.undo();
assert(clean);
