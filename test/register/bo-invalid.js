let success = true;
try {
	await window.yozo.register('./bo-invalid.yz');
} catch {
	success = false;
}
assert(!success);
