const { when } = self.yozo;

let trigger;
let args = [];
let triggers = 0;
self.FooObserver = class FooObserver {
	constructor(callback) {
		trigger = callback;
	}
	observe() {}
	disconnect() {}
};

const flow = when(self).observes('foo').then((...things) => {
	args = things;
	triggers++;
});

trigger(5, 23);
assert(triggers == 1);
assert(args.length == 2);
assert(args[0] == 5 && args[1] == 23);

trigger();
trigger();
assert(triggers == 3);

flow.stop();
delete self.FooObserver;
