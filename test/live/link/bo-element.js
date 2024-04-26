const { live } = self.yozo;

const element = document.createElement('fake-input');
element.value = 'foo';

const $ = live({});
live.link($.$value, element);

assert($.value == 'foo');

element.value = 'bar';
assert($.value == 'foo');

element.dispatchEvent(new CustomEvent('input'));
assert($.value == 'bar');

$.value = 'baz';
assert(element.value == 'baz');
