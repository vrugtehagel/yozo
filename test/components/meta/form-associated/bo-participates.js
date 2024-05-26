await self.yozo.register('./bo-participates.yz');
const form = document.createElement('form');
const element = document.createElement('seven-participates');
document.body.append(form);
form.append(element);

element.setAttribute('name', 'seven');
const formData = new FormData(form);
assert(formData.get('seven') == 7);
