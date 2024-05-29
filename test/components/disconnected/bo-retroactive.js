const { Flow } = self.yozo;
await self.yozo.register('./bo-retroactive.yz');

const element = document.createElement('disconnect-retroactive');
document.body.append(element);
await 'microtask';
element.remove();

let triggers = 0;
element.disconnected(() => triggers++);
await 'microtask';

assert(triggers == 1);
