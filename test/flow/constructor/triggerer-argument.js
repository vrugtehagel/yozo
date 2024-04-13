const { Flow } = self.yozo;
const triggers = [];
let trigger;
const flow = new Flow((triggerer) => {
	trigger = triggerer;
});
flow.then((value) => triggers.push(value));

trigger(23);

assert(triggers[0] == 23);
