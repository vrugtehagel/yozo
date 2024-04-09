const { monitor, until } = self.yozo;

let ranFull = false;
const call = monitor(['undo'], async () => {
	await until(new Promise((resolve) => setTimeout(resolve, 10)));
	ranFull = true;
});

call.undo();
await new Promise((resolve) => setTimeout(resolve, 50));

assert(!ranFull);
