import Thennable from './classes/thennable.js'
import trackable from '../trackable/index.js'
import error from '../development/error.js'//

export default function when(...targets){
    const does = trackable.define((type, options) => {
        let handler
        const result = new Thennable(resolve => {
            handler = resolve
            //
            const isEventTarget = target => {//
                return typeof target.addEventListener == 'function'//
                    && typeof target.removeEventListener == 'function'//
            }//
            if(targets.some(target => !isEventTarget(target)))//
                throw error('not-event-target')//
            //
            targets.forEach(target => target.addEventListener(type, handler, options))
        })
        const undo = () => targets
            .forEach(target => target.removeEventListener(type, handler, options))
        result.cleanup(undo)
        return {result, undo}
    })

    const observes = trackable.define((type, options) => {
        const name = type[0].toUpperCase() + type.slice(1)
        let observer
        const result = new Thennable(resolve => {
            observer = new self[name + 'Observer'](resolve, options)
            targets.forEach(target => observer.observe(target, options))
        })
        const undo = () => observer.disconnect()
        result.cleanup(undo)
        return {result, undo}
    })

    const get = (source, property) => source[property]
        ?? does.bind(null, when.strict ? property : property.replace(/s$/, ''))

    return new Proxy({does, observes}, {get})
}
