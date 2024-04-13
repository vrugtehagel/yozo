const { monitor, until } = self.yozo;

let cleanups = 0;
const call = monitor(['undo'], async () => {
	await until('non-promise');
	monitor.add('undo', () => cleanups++);
});

await call.result;
call.undo();

assert(cleanups == 1);
