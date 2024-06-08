const { paint } = self.yozo;
await self.yozo.register('./bo-shadowless.yz');
const element = document.createElement('italic-shadowless');
const p = document.createElement('p');
p.textContent = 'Content';
document.body.append(element, p);

await paint();

assert(getComputedStyle(p).fontStyle == 'italic');

export const refresh = true
