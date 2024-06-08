const { paint } = self.yozo;
await self.yozo.register('./bo-scoped-styles.yz');
const element = document.createElement('italic-scoped-styles');
const innerP = element.shadowRoot.querySelector('p');
const p = document.createElement('p');
p.textContent = 'Content';
document.body.append(element, p);

await paint();

assert(getComputedStyle(p).fontStyle != 'italic');
assert(getComputedStyle(innerP).fontStyle == 'italic');

export const refresh = true
