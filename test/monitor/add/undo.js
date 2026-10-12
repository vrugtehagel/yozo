const { monitor } = globalThis.yozo;

let undone = false;
const call = monitor(['undo'], () => {
	monitor.add('undo', () => {
		undone = true;
	});
});

assert(!undone);
call.undo();
assert(undone);
