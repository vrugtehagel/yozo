import { track, until } from './track.js'
import { Flow } from './flow.js'
import { live } from './live.js'
import { when } from './when.js'
import { purify } from './purify.js'
import { effect } from './effect.js'
import { frame, interval, timeout } from './timers.js'

import { register } from './register.js'

import './mods/00-title.js'
import './mods/01-$.js'
import './mods/02-hooks.js'
import './mods/03-transforms.js'
import './mods/05-template.js'
import './mods/07-elements.js'
import './mods/08-style.js'
import './mods/09-meta.js'
import './mods/10-script.js'

import './transforms/00-inline-text.js'
import './transforms/01-for.js'
import './transforms/02-if-else.js'
import './transforms/03-attributes.js'
import './transforms/04-properties.js'
import './transforms/05-events.js'

self.yozo = {
	track, until,
	Flow,
	live,
	when,
	purify,
	effect,
	frame, interval, timeout,
}

Object.defineProperty(self.yozo, 'register', {value: register})
