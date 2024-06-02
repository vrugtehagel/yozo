await self.yozo.register('./bo-this-value.yz');

const element = document.createElement('construct-this-value');
assert(element.this == element);
