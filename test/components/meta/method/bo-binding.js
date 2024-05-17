await self.yozo.register('./bo-binding.yz');
const element = document.createElement('reverser-binding');
document.body.append(element);

element.textContent = 'hello world';

assert(element.textContent == 'hello world');

element.reverse();

assert(element.textContent == 'dlrow olleh');
