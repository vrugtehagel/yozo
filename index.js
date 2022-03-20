import { define, secret } from './define.js'
export { define } from './define.js'
export { default as register } from './register.js'

export { reversible, until } from 'https://deno.land/x/reversibles@v1.0.0/index.js'
export { default as when } from 'https://deno.land/x/reversibles@v1.0.0/library/when/index.js'

export { default as stateify } from 'https://deno.land/x/stateify@v1.0.0/index.js'

define[secret].url = import.meta.url
