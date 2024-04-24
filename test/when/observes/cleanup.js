const { when } = self.yozo;

let constructed = 0;
let disconnected = 0;
self.FooObserver = class FooObserver {
	constructor() {
		constructed++;
	}
	observe() {}
	disconnect() {
		disconnected++;
	}
};

const flow = when(5, 23).observes('foo');

assert(constructed == 1);
assert(disconnected == 0);

flow.stop();

assert(constructed == 1);
assert(disconnected == 1);

delete self.FooObserver;
