import { Thenable } from './thenable.js'
import { when } from './when.js'

const realFetch = self.fetch
export const fetch = (resource, options = {}) => {
	let controller = new AbortController
	const signals = options.signal
		? [controller.signal, options.signal]
		: [controller.signal]
	return new Thenable(resolve =>
		realFetch(resource, {...options, signal: controller.signal}).then(resolve)
	)
		.once()
		.then(() => controller = null)
		.cleanup(() => controller?.abort())
		.until(when(...signals).abort().once())
}
