export default class Thennable {
    #callbacks = []
    #ors = []
    #cleanup = []

    constructor(callback){
        callback((...args) => this.#trigger(...args))
    }

    #trigger(...args){
        for(const callback of this.#callbacks)
            if(callback(...args)) return
    }

    #die(){
        this.#cleanup.forEach(callback => callback())
        this.#ors.forEach(thennable => thennable.#die?.())
    }

    then(callback){
        this.#callbacks.push((...args) => { callback(...args) })
        return this
    }

    cleanup(callback){
        this.#cleanup.push(callback)
        return this
    }

    only(callback){
        this.#callbacks.push((...args) => !callback(...args))
        return this
    }

    or(thennable){
        this.#ors.push(thennable)
        thennable.then((...args) => this.#trigger(...args))
        return this
    }

    after(callback){
        queueMicrotask(() => queueMicrotask(callback))
        return this
    }

    until(thing){
        if(typeof thing == 'function')
            this.#callbacks.push((...args) => thing(...args) && !this.#die())
        else Promise.resolve(thing).then(() => this.#die())
        return this
    }

    now(...args){
        this.#trigger(...args)
        return this
    }

}
