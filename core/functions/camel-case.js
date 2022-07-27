export default function camelCase(string){
    return string.replace(/-+\w/g, match => match.slice(-1).toUpperCase())
}
