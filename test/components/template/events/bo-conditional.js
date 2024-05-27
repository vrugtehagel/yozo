await self.yozo.register('./bo-conditional.yz');

const element = document.createElement('spoiler-conditional');
document.body.append(element);
await 'microtask';

const span = element.shadowRoot.querySelector('span');
assert(!span.classList.contains('revealed'));

span.click();
await 'microtask';
assert(span.classList.contains('revealed'));
