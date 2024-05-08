const { when } = self.yozo;

const target = new EventTarget();
const trigger = () => {
	target.dispatchEvent(new CustomEvent('ping'));
};

await when(target).pings().once()
	.after(() => trigger());
