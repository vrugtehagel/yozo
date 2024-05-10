const { monitor } = self.yozo;

let triggers = 0;
const call = monitor(['undo'], () => {
	monitor.add('undo', () => triggers++);
});

assert(triggers == 0);
call.undo();
assert(triggers == 1);
