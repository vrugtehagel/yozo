const { frame, monitor } = self.yozo;

let triggers = 0;
let flow;
const call = monitor(['undo'], () => {
	flow = frame().then(() => {
		triggers++;
	});
});

assert(triggers == 0);
await new Promise(window.requestAnimationFrame);
call.undo();

assert(triggers == 1);
