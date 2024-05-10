const { monitor, until } = self.yozo;

let triggers = 0;
const call = monitor(['undo'], async () => {
	await until('microtask');
	call.undo();
	monitor.add('undo', () => triggers++);
});

await call.result;

assert(triggers == 1);
