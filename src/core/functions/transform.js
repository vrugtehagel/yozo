import error from '../../development/error.js'//

export default function transform(string){
    const parser = new DOMParser
    const dom = parser.parseFromString(string, 'text/html')
    const template = dom.querySelector('template')?.innerHTML
    const style = dom.querySelector('style')?.textContent
    if(!dom.querySelector('script')) throw error('need-script-tag') //
    const script = dom.querySelector('script').textContent
    const escape = string => string.replace(/([`\\])/g, '\\$1')
    return `const{define,when}=self.yozo;
const{construct,connect,disconnect,update}=define;
${script};
${template && `define.template(\`${escape(template)}\`);`}
${style && `define.style(\`${escape(style)}\`);`}`
}
