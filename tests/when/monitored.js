const { when, monitor } = self.yozo;

const target = new EventTarget();
let pings = 0;
const call = monitor(['undo'], () => {
	when(target).does('ping').then(() => {
		pings++;
	});
});

call.undo();
target.dispatchEvent(new CustomEvent('ping'));

assert(pings == 0);
