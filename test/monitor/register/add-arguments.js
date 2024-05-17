const { monitor } = self.yozo;

monitor.register(
	'customAddArguments',
	class {
		result = [];

		add(...args) {
			this.result.push(args);
		}
	},
);

const call = monitor(['customAddArguments'], () => {
	monitor.add('customAddArguments', 23, 'foo', true);
	monitor.add('customAddArguments', 5);
});

assert(call.customAddArguments.length == 2);

assert(call.customAddArguments[0].length == 3);
assert(call.customAddArguments[0][0] == 23);
assert(call.customAddArguments[0][1] == 'foo');
assert(call.customAddArguments[0][2] == true);

assert(call.customAddArguments[1].length == 1);
assert(call.customAddArguments[1][0] == 5);
