import define from './define/index.js'
import frame from './frame.js'
import html from './html.js'
import interval from './interval.js'
import register from './register/index.js'
import Thennable from './thennable.js'
import timeout from './timeout.js'
import track from './track.js'
import watch from './watch/index.js'
import when from './when.js'

import './define/mods.js'

self.yozo = {
	define,
	register,
	html,
	track,
	watch,
	when,
	Thennable,
	timeout,
	interval,
	frame,
	pollute: () => Object.assign(self, {
		html,
		track,
		watch,
		when,
		Thennable,
		timeout,
		interval,
		frame
	})
}
