const { effect, live, when } = self.yozo;

const target = new EventTarget();
const $ = live({ type: 'ping' });
let triggers = 0;
effect(() => {
	when(target).does($.type).then(() => {
		triggers++;
	});
});

await 'microtask'
target.dispatchEvent(new CustomEvent('ping'))

assert(triggers == 1);

target.dispatchEvent(new CustomEvent('ping'))
assert(triggers == 2);

target.dispatchEvent(new CustomEvent('pong'))
assert(triggers == 2);

$.type = 'pong';

target.dispatchEvent(new CustomEvent('ping'))
assert(triggers == 3);

target.dispatchEvent(new CustomEvent('pong'))
assert(triggers == 3);

await 'microtask';
target.dispatchEvent(new CustomEvent('pong'))
assert(triggers == 4);

target.dispatchEvent(new CustomEvent('ping'))
assert(triggers == 4);

target.dispatchEvent(new CustomEvent('pong'))
assert(triggers == 5);
