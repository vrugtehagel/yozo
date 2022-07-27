let current = {}

const entries = object =>
    Reflect.ownKeys(object).map(key => [key, object[key]])

export default function trackable(definition){
    const fn = function(...args){ return fn.do.apply(this, args).result }
    fn.do = trackable.do(definition)
    return fn
}

trackable.do = definition => function(...args){
    const before = current
    current = {}
    const result = definition.apply(this, args)
    const call = {result}
    for(const key of Reflect.ownKeys(registry)){
        const {transform, bucket} = registry[key]
        call[key] = transform(key in current ? current[key] : bucket())
    }
    current = before
    return call
}

trackable.define = definition => (...args) => {
    const {result, ...things} = definition(...args)
    if(current) for(const key of Reflect.ownKeys(things)){
        if(!registry[key]) continue
        const {bucket, add} = registry[key]
        if(!(key in current)) current[key] = bucket()
        add(current[key], things[key])
    }
    return result
}

trackable.register = (name, registration) => {
    if(name == 'result') return
    registry[name] ??= registration
}

const registry = {}
trackable.register('undo', {
    bucket: () => [],
    add: (bucket, undo) => bucket.unshift(undo),
    transform: bucket => {
        let undone = false
        return () => {
            if(undone) return
            undone = true
            bucket.forEach(undo => undo())
        }
    }
})
trackable.register('watch', {
    bucket: () => new Set,
    add: (bucket, variable) => bucket.add(variable),
    transform: bucket => bucket
})
