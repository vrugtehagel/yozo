const { monitor, until } = self.yozo;

monitor.register(
	'tags',
	class FooMonitor {
		result = new Set();
		add(item) {
			this.result.add(item);
		}
	},
);

const call = monitor(['tags'], async () => {
	monitor.add('tags', 'my-tag');
	await until(new Promise((resolve) => setTimeout(resolve, 10)));
	monitor.add('tags', 'other-tag');
});

assert(call.tags.has('my-tag'));
assert(!call.tags.has('other-tag'));
await call.result;
assert(call.tags.has('other-tag'));
