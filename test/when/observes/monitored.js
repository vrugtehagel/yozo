const { when, monitor } = globalThis.yozo;

let disconnected = 0;
globalThis.FooObserver = class FooObserver {
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

delete globalThis.FooObserver;
