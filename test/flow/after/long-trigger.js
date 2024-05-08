const { when, timeout } = self.yozo;

const target = new EventTarget();
const trigger = async () => {
	await timeout(10);
	target.dispatchEvent(new CustomEvent('ping'));
};

await when(target).pings().once()
	.after(() => trigger());
