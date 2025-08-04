const { paint } = self.yozo;
await self.yozo.register('./bo-style-timing.yz');
const element = document.createElement('detect-style-timing');

assert(element.borderStyle != 'dotted');

document.body.append(element);

assert(element.borderStyle == 'dotted');

export const refresh = true;
