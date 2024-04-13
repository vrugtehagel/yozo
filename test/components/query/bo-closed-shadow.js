await self.yozo.register(`./bo-closed-shadow.yz`);
const element = document.createElement('query-closed-shadow');
document.body.append(element);

assert(element.queried);
assert(element.queried.getRootNode().host == element);
