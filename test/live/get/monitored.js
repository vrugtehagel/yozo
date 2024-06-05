const { live, monitor } = self.yozo;

const $ = live({ foo: 23, bar: 10 });
const call = monitor(['live'], () => {
	live.get($.$foo);
	live.get($, 'bar');
});

let triggers = 0;
call.live.addEventListener('change', () => {
	triggers++;
});

assert(triggers == 0);

$.foo = 5;
assert(triggers == 1);

$.bar = 7;
assert(triggers == 2);
