import Reference from './classes/reference.js'

export default function watch(thing){
    const value = {_: watch.get(thing)}
    const {proxy} = new Reference({value}, '_', true)
    return proxy
}

watch.get = value => value?.[Reference.symbol] ? value.get() : value
watch.made = value => !!value?.[Reference.symbol]
watch.typeof = value => typeof watch.get(value)
