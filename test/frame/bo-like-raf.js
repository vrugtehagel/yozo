const { frame } = self.yozo;

let mostRecent;
const flow = frame().then(timestamp => {
	mostRecent = timestamp;
});

const first = await new Promise(window.requestAnimationFrame);
assert(mostRecent == first);

const second = await new Promise(window.requestAnimationFrame);
assert(mostRecent == second);

flow.stop();

const third = await new Promise(window.requestAnimationFrame);
assert(mostRecent != third);
assert(mostRecent == second);
