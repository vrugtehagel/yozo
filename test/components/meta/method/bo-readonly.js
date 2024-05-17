await self.yozo.register('./bo-readonly.yz');
const element = document.createElement('reverser-readonly');
document.body.append(element);
element.textContent = 'hello world';

let threw = false;
try {
	element.reverse = () => element.textContent = 'foo';
} catch {
	threw = true;
}

assert(threw);

element.reverse();

assert(element.textContent == 'dlrow olleh');
