await self.yozo.register('./bo-no-shadow.yz');
const element = document.createElement('query-no-shadow');
document.body.append(element);

assert(element.queried);
assert(element.queried.closest('query-no-shadow') == element);
