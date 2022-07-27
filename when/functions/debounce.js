export default function debounce(duration, callback){
    let id = 0
    return () => {
        clearTimeout(id)
        id = setTimeout(callback, duration)
    }
}
