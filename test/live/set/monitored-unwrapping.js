const { live, monitor } = self.yozo;

const $ = live({ foo: 23 });
const call = monitor(['live'], () => {
	live.set($.$bar, $.$foo);
});

let triggers = 0;
call.live.addEventListener('change', () => {
	triggers++;
});

$.bar = 7;
assert(triggers == 0);

$.foo = -1;
assert(triggers == 1);
