await self.yozo.register('./bo-accepts-block.yz');

const element = document.createElement('spoiler-accepts-block');
const span = element.shadowRoot.querySelector('span');
document.body.append(element);

assert(!span.classList.contains('revealed'));

span.click();
await 'microtask';
assert(span.classList.contains('revealed'));
