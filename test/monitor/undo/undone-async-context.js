const { monitor, until, timeout } = self.yozo;

let triggers = 0;
let reached = false;
const call = monitor(['undo'], async () => {
	monitor.add('undo', () => triggers++);
	await until('microtask');
	monitor.add('undo', () => triggers++);
	await until(timeout(10));
	reached = true;
	monitor.add('undo', () => triggers++);
});

await 'microtask';
await 'microtask';
call.undo();
assert(triggers == 2);

await timeout(20);
assert(triggers == 2);
assert(!reached);
