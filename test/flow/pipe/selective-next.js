const { Flow } = self.yozo;
const flow = new Flow();

const nexts = []
let triggers = 0;
let trigger

flow.pipe((next, ...args) => {
	nexts.push(next)
}).then((...args) => {
	triggers++;
	trigger = args[0];
});

flow.now('foo');
flow.now('bar');
flow.now('baz');

assert(triggers == 0);
assert(nexts.length == 3);

nexts[2]();

assert(triggers == 1);
assert(trigger == 'baz');

nexts[0]();
nexts[1]();

assert(triggers == 3);
assert(trigger == 'bar');
