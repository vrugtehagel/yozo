await self.yozo.register('./bo-dynamic-class.yz');
const element = document.createElement('drinks-dynamic-class');
document.body.append(element);
await 'microtask';
await 'microtask';

const firstLi = element.shadowRoot.querySelector('li');
const secondLi = element.shadowRoot.querySelector('li:nth-child(2)');
assert(!firstLi.classList.contains('is-tea'));
assert(secondLi.classList.contains('is-tea'));
