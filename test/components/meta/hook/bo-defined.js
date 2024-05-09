await self.yozo.register('./bo-defined.yz');
const element = document.createElement('reset-counter-defined');
document.body.append(element);

assert(element.definedCallback);
