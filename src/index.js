import { define } from './define/index.js'
import { register } from './register/index.js'
import { fetch } from './fetch.js'
import { purify } from './purify.js'
import { Thenable } from './thenable.js'
import { interval, timeout, frame } from './timers.js'
import { track, until } from './track.js'
import { watch } from './watch/index.js'
import { when } from './when.js'

import './define/mods.js'

self.yozo = {
	track,
	until,
	watch,
	when,
	purify,
	Thenable,
	timeout,
	interval,
	frame,
	fetch
}

Object.defineProperty(self.yozo, 'define', {value: define})
Object.defineProperty(self.yozo, 'register', {value: register})
