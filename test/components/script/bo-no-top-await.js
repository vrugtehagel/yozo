let failed = false;
try {
	await globalThis.yozo.register('./bo-no-top-await.yz');
	const element = document.createElement('construct-no-top-await');
} catch {
	failed = true;
}

assert(failed);
