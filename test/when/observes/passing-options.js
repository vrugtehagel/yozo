const { when } = globalThis.yozo;

let constructorOptions;
let observeOptions;
globalThis.FooObserver = class FooObserver {
	constructor(callback, options) {
		constructorOptions = options;
	}
	observe(thing, options) {
		observeOptions = options;
	}
	disconnect() {}
};

const options = { foo: 23 };
const flow = when(globalThis).observes('foo', options);

assert(constructorOptions == options);
assert(observeOptions == options);

flow.stop();
delete globalThis.FooObserver;
