await self.yozo.register('./bo-event-argument.yz');

const element = document.createElement('spoiler-event-argument');
document.body.append(element);
const span = element.shadowRoot.querySelector('span');

await 'microtask';
assert(!span.classList.contains('revealed'));

span.dispatchEvent(new CustomEvent('reveal', { detail: true }));
await 'microtask';
assert(span.classList.contains('revealed'));

span.dispatchEvent(new CustomEvent('reveal', { detail: false }));
await 'microtask';
assert(!span.classList.contains('revealed'));
