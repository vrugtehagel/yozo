await self.yozo.register('./bo-options.yz');
const element = document.createElement('message-options');
document.body.append(element);

assert(element.shadowRoot.delegatesFocus == true);
assert(element.shadowRoot.slotAssignment == 'manual');
