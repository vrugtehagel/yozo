const { purify } = self.yozo;

const purified = purify(function () {
	return this;
});
const array = [];
assert(purified.call(array) == array);

const object = { purified };
assert(object.purified() == object);
