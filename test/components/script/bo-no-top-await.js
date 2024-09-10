let failed = false;
try {
	await self.yozo.register('./bo-no-top-await.yz');
	const element = document.createElement('construct-no-top-await');
} catch {
	failed = true;
}

assert(failed);
