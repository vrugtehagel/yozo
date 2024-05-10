const { monitor } = self.yozo;

let triggers = 0;
const trigger = () => triggers++;
const call = monitor(['undo'], () => {
	monitor.add('undo', trigger);
	monitor.add('undo', trigger);
});

assert(triggers == 0);

call.undo();
assert(triggers == 2);
