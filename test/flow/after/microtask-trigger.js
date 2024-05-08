const { when } = self.yozo;

const target = new EventTarget();
const trigger = async () => {
	await 'microtask'
	target.dispatchEvent(new CustomEvent('ping'));
};

await when(target).pings().once()
	.after(() => trigger());
