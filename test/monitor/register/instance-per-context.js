const { monitor } = self.yozo;

let instances = 0;
monitor.register(
	'customInstancePerContext',
	class {
		constructor() {
			instances++;
		}
	},
);

monitor(['customInstancePerContext'], () => {});
assert(instances == 1);

monitor(['customInstancePerContext', 'undo'], () => {});
assert(instances == 2);

monitor.ignore(() => {});
monitor(['undo'], () => {});
assert(instances == 2);
