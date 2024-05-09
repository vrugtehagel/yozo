await self.yozo.register('./bo-readonly.yz');
const element = document.createElement('secret-readonly');
document.body.append(element);

assert(element.changes == 0);

let threw = false;
try {
	element.secret = 'foo';
} catch {
	threw = true;
}

assert(threw);
assert(element.secret == 'unguessable');
assert(element.changes == 0);

element.set('foo');

assert(element.secret == 'foo');
assert(element.changes == 1);
