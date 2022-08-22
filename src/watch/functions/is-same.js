export default function isSame(target, source){
    if(target === source) return true
    if(typeof target != typeof source) return false
    if(typeof target != 'object') return false
    const targetKeys = Object.keys(target)
    const sourceKeys = Object.keys(source)
    return targetKeys.length == sourceKeys.length
        && targetKeys.every(key => sourceKeys.includes(key))
}
