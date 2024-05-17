await self.yozo.register('./bo-arguments.yz');
const element = document.createElement('reverser-arguments');
document.body.append(element);

element.textContent = 'hello world';

assert(element.textContent == 'hello world');

element.reverse('before - ', ' - after');

assert(element.textContent == 'before - dlrow olleh - after');
