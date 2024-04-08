const { when } = self.yozo;

const target = new EventTarget();
let pings = 0;
when(target).pings({ once: true }).then(() => {
	pings++;
});

target.dispatchEvent(new CustomEvent('ping'));
target.dispatchEvent(new CustomEvent('ping'));

assert(pings == 1);
