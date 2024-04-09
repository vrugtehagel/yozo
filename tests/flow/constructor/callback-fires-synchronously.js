const { Flow } = self.yozo;

let trigger;
const flow = new Flow(triggerer => {
	trigger = triggerer;
});

assert(trigger != undefined);
