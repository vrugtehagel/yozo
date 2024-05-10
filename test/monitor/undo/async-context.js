const { monitor, until, timeout } = self.yozo;

let triggers = 0;
const call = monitor(['undo'], async () => {
	monitor.add('undo', () => triggers++);
	await until('microtask');
	monitor.add('undo', () => triggers++);
	await until(timeout(10));
	monitor.add('undo', () => triggers++);
});

await call.result;
assert(triggers == 0);

call.undo();
assert(triggers == 3);
