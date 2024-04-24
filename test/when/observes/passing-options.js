const { when } = self.yozo;

let constructorOptions;
let observeOptions;
self.FooObserver = class FooObserver {
	constructor(callback, options) {
		constructorOptions = options;
	}
	observe(thing, options) {
		observeOptions = options;
	}
	disconnect() {}
};

const options = { foo: 23 };
const flow = when(self).observes('foo', options);

assert(constructorOptions == options);
assert(observeOptions == options);

flow.stop();
delete self.FooObserver;
