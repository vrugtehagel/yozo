await self.yozo.register('./bo-exists.yz');
const element = document.createElement('internals-exists');

assert(element.internals.shadowRoot == element.shadowRoot);
