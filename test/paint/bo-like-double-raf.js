const { paint } = self.yozo;

let mostRecent;
const flow = paint().then((timestamp) => {
	mostRecent = timestamp;
});

const first = await new Promise(window.requestAnimationFrame);
assert(mostRecent != first);

const second = await new Promise(window.requestAnimationFrame);
assert(mostRecent == second);

const third = await new Promise(window.requestAnimationFrame);
assert(mostRecent == second);

flow.stop();
