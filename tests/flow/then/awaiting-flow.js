const { Flow } = self.yozo;
const flow = new Flow();
let awaited = false;
(async () => {
	await flow;
	awaited = true;
})();
await 'microtask';

flow.now();
await 'microtask';

assert(awaited == true);

flow.stop();
