let success = true;
try {
	await window.yozo.register('./bo-twice.yz');
	await window.yozo.register('./bo-twice.yz');
} catch {
	success = false;
}
assert(success);
