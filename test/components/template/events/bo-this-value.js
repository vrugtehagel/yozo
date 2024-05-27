await self.yozo.register('./bo-this-value.yz');

const element = document.createElement('spoiler-this-value');
document.body.append(element);
const span = element.shadowRoot.querySelector('span');

await 'microtask';
assert(!span.classList.contains('revealed'));

span.dataset.reveal = 'true';
span.click();
await 'microtask';
assert(span.classList.contains('revealed'));

delete span.dataset.reveal;
span.click();
await 'microtask';
assert(!span.classList.contains('revealed'));
