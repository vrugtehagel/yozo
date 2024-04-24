const { when, monitor } = self.yozo;

let disconnected = 0;
self.FooObserver = class FooObserver {
	observe() {}
	disconnect() {
		disconnected++;
	}
};

let flow;
const call = monitor(['undo'], () => {
	flow = when(5, 23).observes('foo');
});

call.undo();

assert(disconnected == 1);

delete self.FooObserver;
