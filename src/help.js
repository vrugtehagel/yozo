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
	'track-add-$1-not-in-registry': name => `
		An item was added to "${name}", but "${name}" was not registered.
		Register it first using track.register('${name}', class { … }).`,
	'track-cannot-register-result': () => `
		"result" cannot be registered as a trackable.
		Tracked calls already store their result under this key.`,
	'track-registry-already-has-$1': name => `
		track.register('${name}', …) was called, but "${name}" was already registerd.
		You cannot overwrite an existing registration; re-registrations are ignored.`,
	'track-shorthand-$1-not-created': name => `
		Registered the trackable "${name}", but could not create the shorthand.
		track.${name} already exists; instead, use track(['${name}'], () => …).`,
	'track-$1-definition-must-be-class': name => `
		Registering "${name}", but its definition was not a class.
		Register it using track.register('${name}', class { … }).`,
	'flow-stopped-but-triggered': () => `
		A flow was triggered after it stopped. Often, this indicates a memory leak.
		Make sure you use .cleanup(…) to undo everything triggering the flow.`,
	'live-$1-on-non-live': method => `
		live.${method}(…) was called, but its first argument wasn't live.
		This was probably a mistake; it does nothing.`,
	'live-linked-property-set-for-$1': key => `
		${key ? `The "${key}"` : `A live`} property created with live.link(…) was set, but it wasn't given a setter.
		If it should be set-able, provide a "set" function to its options argument.`,
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
	'define-attribute-$1-type-$2-does-not-exist': (attribute, type) => `
		Attribute "${attribute}" defined type "${type}", but that doesn't exist.
		The type attribute is converted to PascalCase, and that must be a global.`
}

