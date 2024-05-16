const { monitor, until } = self.yozo;

let earlyStop = false;
let triggers = 0;
monitor.register('customUntilEarlyStop', class {
	result = [];

	add(){}

	until(){
		return earlyStop;
	}
});


monitor(['customUntilEarlyStop'], async () => {
	await until('microtask');
	triggers++;
});

await 'microtask';
await 'microtask';
assert(triggers == 1);

monitor(['customUntilEarlyStop'], async () => {
	await until('microtask');
	triggers++;
});

earlyStop = true;
await 'microtask';
await 'microtask';
assert(triggers == 1);
