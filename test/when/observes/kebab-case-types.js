const { when } = self.yozo;

let constructed = 0;
self.FooBarObserver = class FooBarObserver {
	constructor(callback) {
		constructed++;
	}
	observe() {}
	disconnect() {}
};

const flow = when(self).observes('foo-bar');

assert(constructed == 1);

flow.stop();
delete self.FooBarObserver;
