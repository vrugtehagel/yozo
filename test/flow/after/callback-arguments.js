const { when } = self.yozo;

let amount
const target = new EventTarget();
const trigger = (...args) => {
	amount = args.length;
	target.dispatchEvent(new CustomEvent('ping'));
};

await when(target).pings().once()
	.after((...args) => trigger(...args));

assert(amount == 0);
