await self.yozo.register('./bo-spreads-yozo.yz');

const element = document.createElement('construct-spreads-yozo');
assert(element.liveDefined);
assert(element.whenDefined);
assert(!element.registerDefined);
