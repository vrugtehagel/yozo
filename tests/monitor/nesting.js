const { monitor, Flow } = self.yozo;

let inner;
let clean = false;
const outer = monitor(['undo'], () => {
	inner = monitor(['undo'], () => {
		const flow = new Flow();
		flow.cleanup(() => clean = true);
	});
});

outer.undo();
assert(!clean);

inner.undo();
assert(clean);
