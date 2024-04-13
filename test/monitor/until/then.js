const { monitor, until } = self.yozo;

let cleanups = 0;
const call = monitor(['undo'], async () => {
	until(new Promise((resolve) => setTimeout(resolve, 10))).then(() => {
		monitor.add('undo', () => cleanups++);
	});
	await new Promise((resolve) => setTimeout(resolve, 20));
});

await call.result;
call.undo();

assert(cleanups == 1);
