const { live, monitor, until } = self.yozo;

const $ = live({ foo: 23 });
const call = monitor(['live'], async () => {
	await until('microtask');
	live.set($.$foo, 5);
});

let triggers = 0;
call.live.addEventListener('change', () => {
	triggers++;
});

await 'microtask';
$.foo = -1;

assert(triggers == 0);
