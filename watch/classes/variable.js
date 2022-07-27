import watch from '../index.js'
import addToWatch from '../functions/add-to-watch.js'
import when from '../../when/index.js'

export default class Variable extends EventTarget {
    constructor(reference){
        super()
        this.reference = reference
    }

    is(thing){
        addToWatch(this.reference.proxy)
        return this.reference.value == watch.get(thing)
    }
    
    get(){
        addToWatch(this.reference.proxy)
        return this.reference.value
    }
    
    set(value){
        return this.reference.change(() => this.reference.object[this.reference.key] = watch.get(value))
    }
    
    delete(){
        return this.reference.change(() => delete this.reference.object[this.reference.key])
    }
    
    free(){
        addToWatch(this.reference.proxy)
        return this.reference.isFree
    }
    
    typeof(){
        addToWatch(this.reference.proxy)
        return typeof this.reference.value
    }

    #bind({get, set, triggers}){
        const value = this.reference.proxy
        let changing = false
        value.set(get())
        when(value).change().then(() => {
            if(!changing) set(value)
        })
        triggers.now().then(() => {
            changing = true
            value.set(get())
            changing = false
        })
    }

    bind(custom){
        if(custom) return this.#bind(custom)
        const input = element => this.#bind({
            get: () => element.value,
            set: value => element.value = value,
            triggers: when(element).inputs()
        })
        const attribute = (element, name) => this.#bind({
            get: () => element.getAttribute(name),
            set: value => element.setAttribute(name, value),
            triggers: when(element).observes('mutation', {attributes: true, attributeFilter: [name]})
        })
        const css = (element, name) => this.#bind({
            get: () => getComputedStyle(element).getPropertyValue(name),
            set: value => element.style.setProperty(name, value),
            triggers: when(element).observes('mutation', {attributes: true, attributeFilter: ['style']})
        })
        return {input, attribute, css}
    }

}
