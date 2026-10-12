const { Flow } = globalThis.yozo;

let trigger;
const flow = new Flow((triggerer) => {
	trigger = triggerer;
});

assert(trigger != undefined);
