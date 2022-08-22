import error from '../development/error.js'//

const registry = []
const priorities = new Map
let locked = false
let current, memory

export default function define(name){
    if(!locked) lock()
    if(memory) useDefinition()
    if(!name.includes('-')) throw error('element-name-needs-dash', name)//
    current = name
    memory = new Map(registry.map(([callback]) => [callback, []]))
    queueMicrotask(() => {
        if(memory) useDefinition()
        memory = null
    })
}

define.register = (name, definition, priority) => {
    if(locked) throw error('register-locked', name)//
    if(locked) return
    registry.push([definition, priority])
    if(!name) return
    define[name] = (...args) => memory.get(definition).push(args)
}

function lock(){
    locked = true
    registry.sort(([,a], [,b]) => a - b)
}

const secrets = new WeakMap

async function useDefinition(){
    const name = current
    class body extends HTMLElement {
        constructor(){
            super()
            secrets.set(this, {})
            compose('constructor', this, [])
        }
    }
    const context = {body, name}
    const additions = (await Promise.all(
        registry.map(([callback]) => callback.call(context, memory.get(callback)))
    )).filter(addition => addition)
    const compose = (name, host, args) => additions
        .map(addition => addition[name])
        .forEach(callback => callback?.call(host, secrets.get(host), ...args))
    const keys = new Set(additions.flatMap(addition => Object.keys(addition)))
    keys.delete('constructor')
    for(const key of keys)
        body.prototype[key] = function(...args){ compose(key, this, args) }
    customElements.define(name, body)
}
