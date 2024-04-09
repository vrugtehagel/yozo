const { monitor, until } = self.yozo;

let cleanups = 0;
const call = monitor(['undo'], async () => {
	await until(new Promise((resolve) => setTimeout(resolve, 10)));
	monitor.add('undo', () => cleanups++);
});

await call.result;
call.undo();

assert(cleanups == 1);
