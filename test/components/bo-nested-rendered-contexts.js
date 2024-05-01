await self.yozo.register('./bo-nested-rendered-contexts.yz');
const element = document.createElement('nested-rendered-contexts');
element.level = 2;
document.body.append(element);

let microtasks = element.level + 1;
while(microtasks-- > 0) await 'microtask';
assert(element.querySelectorAll('*').length == 2);
assert(element.textContent.trim() == 'Bottom reached!')

element.level = 3;
microtasks = element.level + 1;
while(microtasks-- > 0) await 'microtask';
assert(element.querySelectorAll('*').length == 3);
assert(element.textContent.trim() == 'Bottom reached!')
