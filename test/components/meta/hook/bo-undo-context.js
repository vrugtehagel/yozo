await self.yozo.register('./bo-undo-context.yz');
const element = document.createElement('reset-counter-undo-context');
const form = document.createElement('form');
form.append(element);
document.body.append(form);

assert(element.value == 0);
assert(element.undos == 0);

form.reset();
assert(element.value == 1);
assert(element.undos == 0);

form.reset();
assert(element.value == 2);
assert(element.undos == 1);

form.reset();
form.reset();
assert(element.value == 4);
assert(element.undos == 3);
