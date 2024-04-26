const { live, when } = self.yozo;

const $ = live({ name: 'Sam' });
live.link($.$capitalized, {
	get: () => $.name.toUpperCase(),
	set: (value) => {
		$.name = value[0] + value.slice(1).toLowerCase();
	},
	changes: when($.$name).changes(),
});
live.link($.$greeting, {
	get: () => `Hello ${$.capitalized}`,
	set: (value) => $.capitalized = value.replace('Hello ', ''),
	changes: when($.$capitalized).changes(),
});

assert($.greeting == 'Hello SAM');

$.name = 'Alex';
assert($.greeting == 'Hello ALEX');

$.capitalized = 'JORDAN';
assert($.name == 'Jordan');
assert($.greeting == 'Hello JORDAN');

$.greeting = 'Hello ROBIN';
assert($.name == 'Robin');
