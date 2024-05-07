const { live, monitor } = self.yozo;

const $ = live({ foo: 23 });
const call = monitor(['live'], () => {
	live.get($.$foo);
});

let triggers = 0;
call.live.addEventListener('change', () => {
	triggers++;
});

assert(triggers == 0);

$.foo = 5;
console.log({ triggers });
assert(triggers == 1);
