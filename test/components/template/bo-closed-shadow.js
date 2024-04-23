await self.yozo.register('./bo-closed-shadow.yz');
const element = document.createElement('message-closed-shadow');
document.body.append(element);

assert(element.shadowRoot == null);
assert(element.children.length == 0);
