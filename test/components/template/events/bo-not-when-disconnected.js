await self.yozo.register('./bo-not-when-disconnected.yz');

const element = document.createElement('spoiler-not-when-disconnected');
const span = element.shadowRoot.querySelector('span');

assert(!span.classList.contains('revealed'));

span.click();
await 'microtask';
assert(!span.classList.contains('revealed'));

document.body.append(element);
span.click();
await 'microtask';
assert(span.classList.contains('revealed'));
