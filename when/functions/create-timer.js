import Thennable from '../classes/thennable.js'
import trackable from '../../trackable/index.js'

export default function createTimer(setup, destroy){
    return trackable.define((...args) => {
        let id
        const result = new Thennable(resolve => id = setup(resolve, ...args))
        const undo = () => destroy(id)
        result.cleanup(undo)
        return {result, undo}
    })
}
