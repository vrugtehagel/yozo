import Thennable from '../classes/thennable.js'
import trackable from '../../trackable/index.js'

export default async function paint(){
    return trackable.define((...args) => {
        let id
        const result = new Thennable(resolve =>
            id = requestAnimationFrame(() => id = requestAnimationFrame(resolve)))
        const undo = () => cancelAnimationFrame(id)
        result.cleanup(undo)
        return {result, undo}
    })
}
