const { frame, monitor } = self.yozo;

let triggers = 0;
let flow;
const call = monitor(['undo'], () => {
	flow = frame().then(() => {
		triggers++;
	});
});

await 'microtask';
call.undo();

await new Promise(window.requestAnimationFrame);
assert(triggers == 0);
