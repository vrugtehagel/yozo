const { when } = self.yozo;

const targets = [];
let constructed = 0;
self.FooObserver = class FooObserver {
	constructor() {
		constructed++;
	}
	observe(target) {
		targets.push(target);
	}
	disconnect() {}
};

const flow = when(5, 23).observes('foo');

assert(constructed == 1);
assert(targets.length == 2);
assert(targets[0] == 5 && targets[1] == 23);

flow.stop();
delete self.FooObserver;
