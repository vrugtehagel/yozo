await self.yozo.register('./bo-is-constructor.yz');

const element = document.createElement('construct-is-constructor');
assert(element.constructed);
