const element = document.createElement('defined-element-defines');
document.body.append(element);
assert(!customElements.get('defined-element-defines'));
assert(!element.matches(':defined'));

await self.yozo.register('./bo-defines.yz');

assert(customElements.get('defined-element-defines'));
assert(element.matches(':defined'));
