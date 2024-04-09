const { Flow } = self.yozo;
let triggers = 0;
let trigger;
const flow = new Flow(triggerer => {
	trigger = triggerer;
});
flow.then(value => triggers++);
flow.stop();

trigger();

assert(triggers == 0);
