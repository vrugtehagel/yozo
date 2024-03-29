// Just printing the errors. Not super efficient or anything, but it doesn't
// really need to be.
const printer = (show = console.log, suppress) => (parts, ...subs) => {
	const expanded = String.raw(parts, ...subs)
	const id = String.raw(parts, ...subs.map((sub, index) => `$${index + 1}`))
	if(suppress && printer.memory.has(expanded)) return
	printer.memory.add(expanded)
	const indentedMessage = messages[id](...subs)
	let message = indentedMessage.replaceAll(/^\s+/gm, '').trim()
	if(suppress) message += '\n' + suppress
	show(message)
}
printer.memory = new Set

export const error = printer(message => { throw new Error(message) })
export const warn = printer(message => console.warn(message))
export const warnOnce = printer(message => console.warn(message),
	'Warnings after this one will be suppressed')

const messages = {
	'when-arg-not-event-target': () => `
		Could not attach event listener(s) with when(…);
		Not all of its arguments were EventTargets.`,
	'when-cannot-observe-$1-no-$2': (type, name) => `
		Failed at when(…).observe(\'${type}\').
		This occurred because "${name}Observer" doesn't exist.`,
	'when-$1-instead-of-$2-mistake': (property, type) => `
		when(…).{property}() may be a mistake, as it listens to the "${type}" event.
		If you want to listen to the "${property}" event, use .does('${property}').`,
	'monitor-add-$1-not-in-registry': name => `
		An item was added to "${name}", but "${name}" was not registered.
		Register it first using monitor.register('${name}', class { … }).`,
	'monitor-cannot-register-result': () => `
		"result" cannot be registered as a monitorable.
		Tracked calls already store their result under this key.`,
	'monitor-registry-already-has-$1': name => `
		monitor.register('${name}', …) was called, but "${name}" was already registerd.
		You cannot overwrite an existing registration; re-registrations are ignored.`,
	'monitor-$1-definition-should-be-class': name => `
		Registering "${name}", but its definition didn't look like a class.
		If this wasn't intentional, use monitor.register('${name}', class { … }) instead.`,
	'flow-stopped-but-triggered': () => `
		A flow was triggered after it stopped. Often, this indicates a memory leak.
		Make sure you use .cleanup(…) to undo everything triggering the flow.`,
	'live-property-$1-not-iterable': key => `
		Cannot iterate over .$${key} because its value is not iterable.`,
	'live-link-target-$1-not-live': guess => `
		Something non-live was passed to live.link(…).
		Probably, you missed the $ in .$${guess}.`,
	'live-link-target-not-live': () => `
		Something non-live was passed to live.link(…).
		Make sure its first argument is a live variable.`,
	'live-property-$1-doubled': key => `
		Objects with (nested) live properties should not be live themselves.
		Now .${key} is live and .$${key} is double-live, which is confusing.`,
	'live-property-set-$1-has-$': key => `
		The "${key}" property was set, which may have been unintentional.
		To set the "${key.slice(1)}" property instead, use $object.${key.slice(1)} = ….`,
	'live-property-delete-$1-has-$': key => `
		The "${key}" property was deleted, which may have been unintentional.
		To delete the "${key.slice(1)}" property, use delete $object.${key.slice(1)}.`,
	'define-missing-title': () => `
		Component definition is missing <title>…</title>.
		This is required, as it determines the component's tag name.`,
	'define-attribute-$1-is-type-bigint-instead-of-big-int': attribute => `
		Attribute "${attribute}" defined type "bigint". That should probably be "big-int".
		Other valid types are "string", "boolean", or "number".`,
	'define-attribute-$1-type-$2-unknown': (attribute, type) => `
		Attribute "${attribute}" defined unknown type "${type}".
		Valid types are "string", "boolean", "number", and "big-int"`,
	'define-attribute-$1-type-$2-does-not-exist': (attribute, type) => `
		Attribute "${attribute}" defined type "${type}", but that doesn't exist.
		The type attribute is converted to PascalCase, and that must be a global.`,
	'transform-for-$1-not-iterable': expression => `
		Expression "${expression}" in #for is not iterable.`,
	'transform-for-and-if-simultaneously': () => `
		Found a #for and #if attribute on the same element. This is ambiguous.
		Instead, use a wrapper <template #for="…"> or <template #if="">.`,
	'transform-if-found-loose-$1': statement => `
		Found an "${statement}" attribute without an #if.
		Make sure the element follows an element with an #if or #else-if.`,
	'transform-mixing-class-and-class-list': () => `
		Found both a .class-list and a :class attribute on a single element.
		:class overwrites all classes when it updates, so mixing them is not advised.`,
	'transform-elseif-instead-of-else-if': () => `
		Found an "#elseif" attribute; that should probably be "#else-if".`,
	'transform-loose-flow-control-$1': flowControl => `
		Found an unrecognized flow control attribute "${flowControl}".
		It's okay to have it, but it'll be ignored.`,
	'transform-for-without-of': () => `
		Found a #for without " of ", which is the only type of #for expression supported.
		If you need to loop over numbers, generate an array of numbers and iterate that.`
}

