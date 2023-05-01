import { Thenable } from './thenable.js'
import { when } from './when.js'

export const fetch = (resource, options) => {
	const controller = new AbortContoller
	const signals = options.signal
		? [controller.signal, options.signal]
		: [controller.signal]
	return new Thenable(resolve =>
		fetch(resource, {...options, signal: controller.signal}).then(resolve)
	)
		.cleanup(() => controller.abort())
		.once()
		.until(when(...signals).abort().once())
}
