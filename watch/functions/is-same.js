export default function isSame(target, source){
    if(target === source) return true
    if(typeof target != typeof source) return false
    if(typeof target != 'object') return false
    const targetKeys = new Set(Object.keys(target))
    const sourceKeys = new Set(Object.keys(source))
    if(targetKeys.size != sourceKeys.size) return false
    for(const key of targetKeys) if(!sourceKeys.has(key)) return false
    return true
}
