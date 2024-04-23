await self.yozo.register('./bo-open-shadow.yz');
const element = document.createElement('query-open-shadow');
document.body.append(element);

assert(element.queried);
assert(element.queried.getRootNode().host == element);
