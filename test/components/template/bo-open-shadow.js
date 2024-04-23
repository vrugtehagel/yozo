await self.yozo.register('./bo-open-shadow.yz');
const element = document.createElement('message-open-shadow');
document.body.append(element);

assert(element.shadowRoot != null);
assert(element.children.length == 0);
