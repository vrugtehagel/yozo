await self.yozo.register('./bo-remove-intermediate.yz');
const element = document.createElement('color-swatch-remove-intermediate');
document.body.append(element);

await 'microtask';
assert(element.shadowRoot.children.length == 1);
const comments = [...element.shadowRoot.childNodes]
	.filter((node) => node.nodeType == Node.COMMENT_NODE);
assert(comments.length == 1);

const textNodes = [...element.shadowRoot.childNodes]
	.filter((node) => node.nodeType == Node.TEXT_NODE)
	.filter((node) => node.nodeValue.trim() != '');
assert(textNodes.length == 0);
