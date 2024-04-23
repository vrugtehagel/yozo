await self.yozo.register('./bo-overwriting-default.yz');

const element = document.createElement('custom-link-overwriting-default');
const a = element.shadowRoot.querySelector('a');
document.body.append(element);

await 'microtask';
assert(a.getAttribute('href') == '#');

element.remove();
