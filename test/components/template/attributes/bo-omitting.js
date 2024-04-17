await self.yozo.register(`./bo-omitting.yz`);

const element = document.createElement('custom-link-omitting');
const a = element.shadowRoot.querySelector('a');
document.body.append(element);

element.to = 'https://example.com/';
await 'microtask';
assert(a.getAttribute('target') == '_blank');

element.to = './relative/path';
await 'microtask';
assert(!a.hasAttribute('target'));

element.remove();
