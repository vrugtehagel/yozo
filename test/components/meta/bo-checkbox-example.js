await self.yozo.register('./bo-checkbox-example.yz');
const form = document.createElement('form');
const element = document.createElement('checkbox-example');
document.body.append(form);
form.append(element);

element.name = 'foo';
element.checked = true;
element.toggle();
element.shadowRoot.querySelector('div')?.click();

const formData = new FormData(form);
assert(formData.get('foo') == 'true');
