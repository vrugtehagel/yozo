await self.yozo.register('./bo-unhook.yz');
const element = document.createElement('reset-counter-unhook');
const form1 = document.createElement('form');
const form2 = document.createElement('form');
document.body.append(form1, form2);
form1.append(element);

assert(element.value == 0);
assert(element.undos == 0);

form1.reset();
form1.reset();
assert(element.value == 2);
assert(element.undos == 1);

form2.append(element);
assert(element.value == 2);
assert(element.undos == 2);

form1.append(element);
assert(element.value == 2);
assert(element.undos == 2);
