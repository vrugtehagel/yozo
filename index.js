import './core/registrations.js'
import { meta } from './core/register.js'
Object.assign(meta, import.meta)

export { default as define } from './core/define.js'
export { default as register } from './core/register.js'

export { default as trackable } from './trackable/index.js'

export { default as watch } from './watch/index.js'

export { default as when } from './when/index.js'
export { default as timeout } from './when/functions/timeout.js'
export { default as interval } from './when/functions/interval.js'
export { default as frame } from './when/functions/frame.js'
export { default as paint } from './when/functions/paint.js'
