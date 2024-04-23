await self.yozo.register('./bo-no-shadow.yz');
const element = document.createElement('message-no-shadow');
document.body.append(element);

assert(element.shadowRoot == null);
assert(element.children.length > 0);
