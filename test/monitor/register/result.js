const { monitor } = self.yozo;

const reference = {};

monitor.register('customResult', class {
	result = reference;

	add(item){
		this.result = item;
	}
});


const call = monitor(['customResult'], () => {
	monitor.add('customResult', {});
});

assert(call.customResult == reference);
