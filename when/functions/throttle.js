export default function throttle(duration, callback){
    let id
    let last = 0
    const trigger = () => {
        id = 0
        last = Date.now()
        callback()
    }
    return () => {
        if(id) return
        const delta = Date.now() - last
        if(delta > duration) trigger()
        else id = setTimeout(trigger, duration - delta)
    }
}
