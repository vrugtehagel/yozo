const { paint } = self.yozo;
await self.yozo.register('./bo-shadowless-in-shadow.yz');
const element = document.createElement('italic-shadowless-in-shadow');
const p = document.createElement('p');
const div = document.createElement('div');
p.textContent = 'Content';
div.attachShadow({ mode: 'open' });
div.shadowRoot.append(element);
document.body.append(div, p);

await 'microtask';
const innerP = element.querySelector('p');

await paint();

assert(getComputedStyle(p).fontStyle != 'italic');
assert(getComputedStyle(innerP).fontStyle == 'italic');

export const refresh = true
