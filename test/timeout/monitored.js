const { timeout, monitor } = self.yozo;

let triggers = 0;
let flow;
const call = monitor(['undo'], () => {
	flow = timeout(20).then(() => {
		triggers++;
	});
});

call.undo();
await new Promise((resolve) => setTimeout(resolve, 40));
assert(triggers == 0);
