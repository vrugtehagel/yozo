await self.yozo.register('./bo-inline.yz');
const element = document.createElement('internals-inline');
document.body.append(element);
await 'microtask';

assert(element.textContent.trim() == 'ElementInternals');
