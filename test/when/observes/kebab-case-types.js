const { when } = globalThis.yozo;

let constructed = 0;
globalThis.FooBarObserver = class FooBarObserver {
	constructor(callback) {
		constructed++;
	}
	observe() {}
	disconnect() {}
};

const flow = when(globalThis).observes('foo-bar');

assert(constructed == 1);

flow.stop();
delete globalThis.FooBarObserver;
