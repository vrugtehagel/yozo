const { Flow, monitor } = self.yozo;
let trigger, flow;
let triggers = 0;
const call = monitor(['undo'], () => {
	flow = new Flow(triggerer => {
		trigger = triggerer;
	});
});
flow.then(() => {
	triggers++;
});
call.undo();
trigger();

assert(triggers == 0);
