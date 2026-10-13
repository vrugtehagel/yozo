const { when } = globalThis.yozo;

const target = new EventTarget();
let pings = 0;
when(target).ping().then(() => {
	pings++;
});

target.dispatchEvent(new CustomEvent('ping'));

assert(pings == 1);
