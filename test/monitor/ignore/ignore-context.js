const { monitor } = self.yozo;

let count = 0;
const call = monitor(['undo'], () => {
	monitor.ignore(() => {
		count++;
		monitor.add('undo', () => count--);
	});
});

call.undo();
assert(count == 1);
