(()=>{var v=class{#e=[];#t=[];#n;#r;constructor(e){a.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}flow(e){return this.#e?.push(e),this}now(...e){let t=-1,r=()=>{this.#e&&(t++,!(t<this.#r)&&(this.#n&&(this.#r=t+1),this.#e.length+1==this.#r&&this.stop(),this.#e?.[t]?.(r,...e)))};return r(),this}then(e){return this.flow((t,...r)=>{e(...r),t()})}await(e){return this.flow(async(t,...r)=>{await e(...r),t()})}if(e){return this.flow((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){return this.#e&&this.#t.splice(0).map(e=>e()),this.#e=null,this}until(e){return typeof e=="function"?this.flow((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#e?this.#t.push(e):e(),this}once(){return this.then(()=>this.#n=!0)}debounce(e){let t;return this.flow(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.flow(o=>{if(r)return t=o;o(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var k=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),O=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...o){n.map(i=>i[r]?.call(this,...o))};return e};var T=(...n)=>new Proxy({does:(e,t)=>{let r;return new v(o=>{r=o,n.map(i=>i.addEventListener(e,r,t))}).cleanup(()=>n.map(o=>o.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new v(o=>{r=new self[k(`-${e}-observer`)](o,t),n.map(i=>r.observe(i,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var M=(n,e=queueMicrotask)=>{let t,r=()=>e(()=>o.now()),o=new v().then(()=>{t?.undo(),t=a(["undo","live"],n),t.live.addEventListener("change",r,{once:!0})}).cleanup(()=>{t?.undo(),t?.live.removeEventListener("change",r,{once:!0})});return r(),o};var g=n=>new I({e:{$:g.get(n)}},"$").t,q=new WeakMap,I=class n{constructor(e,t,r=this){this.r=e,this.i=t,this.p=r,this.a={},this.t=new Proxy(new EventTarget,{get:(o,i)=>i==Symbol.iterator?()=>(a.add("live",this.t,"keychange"),[...this.e].map((s,u)=>this.n(u).t)[i]()):i[0]=="$"?this.n(i.slice(1)).t:o[i]?o[i].bind(o):(a.add("live",this.n(i).t,"deepchange"),this.e?.[i]),set:(o,i,s)=>g.set(this.n(i).t,s),deleteProperty:(o,i,s)=>g.delete(this.n(i).t),has:(o,i)=>(a.add("live",this.t,"keychange"),this.e!=null&&i in this.e||o[i]),ownKeys:()=>(a.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(o=>`$${o}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),q.set(this.t,this),this.e=this.r.e?.[this.i],this.f=Object.keys(this.e??{})}n(e){return this.a[e]??=new n(this,e,this.p)}c(e,t=new Set){let r=e?.(),o=this.e,i=this.e=this.r.e?.[this.i];if(typeof i=="object"){let u=Object.keys(this.e??{}),c=new Set(this.f);this.f=u;for(let l of u)c.has(l)?c.delete(l):c.add(l);c.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...c]}}))}if(Object.is(o,i))return r;this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:o,value:i}}));let s=this;for(;!t.has(s)&&s.r;)s.c(null,t),t.add(s),s=s.r;for(let u of Object.values(this.a))u.c(null,t);if(e){for(let u of t)u.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};g.get=(n,e)=>{let t=q.get(n);return t?e!=null?t.n(e).e:(a.add("live",n,"deepchange"),t.e):e==null?n:n[e]};g.set=(n,e)=>{let t=q.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=g.get(e),!0))};g.delete=(n,e)=>{let t=q.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};g.link=(n,e)=>{let t,r=e;self.HTMLElement&&e instanceof HTMLElement?r={get:()=>e.value,set:u=>e.value=u,changes:T(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:M(()=>t=e(),u=>u())});let o,i=u=>{o=!0,g.set(n,u),t=u,o=!1},s=()=>{if(!o){if(!r.set)return i(t);r.set(a.ignore(()=>g.get(n))),i(a.ignore(r.get))}};return n.addEventListener("deepchange",s),i(a.ignore(r.get)),(r.changes??new v).then(()=>i(a.ignore(r.get))).if(()=>null).cleanup(()=>n.removeEventListener("deepchange",s))};var C,a=(n,e)=>{let t=C;C={};let r={};return n.map(o=>{C[o]=new V[o],r[o]=C[o].result}),r.result=e(),C=t,r},D=n=>C?new Promise(async e=>{let t=C,r=await n;Object.keys(t).some(o=>t[o].until?.())||(queueMicrotask(()=>C=t),e(r),queueMicrotask(()=>C=null))}):n;a.ignore=n=>a([],n).result;a.add=(n,...e)=>{C?.[n]?.add(...e)};a.register=(n,e)=>{V[n]??=e};var V={result:!0,undo:class{#e=[];#t;result=()=>{this.#t||(this.#e.splice(0).map(n=>n()),this.#t=!0)};add(n){if(this.#t)return n();this.#e.push(n)}until(){return this.#t}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),n.addEventListener(e,()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var R=n=>{let e;return(...t)=>(e?.undo(),e=a(["undo"],()=>n(...t)),e.result)};var P=n=>{let e;return new v(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},W=n=>P(n).once(),H=()=>{let n;return new v(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},K=()=>{let n=0;return H().if(()=>n++).once()};var w=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),a.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(j.map(([o,i])=>[i,(...s)=>(t[i]??=[]).push(s)])));let r=O(j.map(([o,i])=>o(e,t[i]??[])));return Object.entries(r).map(([o,i])=>e.s.prototype[o]??=function(...s){return a.ignore(()=>i.call(this,e.o.get(this),...s))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},j=[];w.register=(n,e,t)=>{j.push([t,e,n]),j.sort((r,o)=>r[2]-o[2])};var z=new Map,N=n=>(z.get(`${n}`)||z.set(`${n}`,fetch(n).then(async e=>{if(!e.ok)return;let t=document.createElement("template");return t.innerHTML=await e.text(),w(r=>{for(let o of t.content.children)r[o.localName]?.(Object.fromEntries([...o.attributes].map(i=>[k(i.name),i.value])),o.innerHTML)})})),z.get(`${n}`)),U,F;N.auto=n=>{if(F)return;F=new Set;let e=r=>{if(F.has(r))return;F.add(r);let o=n(r);o&&N(o)},t=r=>{for(let o of r.querySelectorAll(":not(:defined)"))e(o.localName);for(let o of r.querySelectorAll("template"))t(o.content)};return w.register(6,Symbol(),r=>U?{}:(r.u&&t(r.u),{}),{}),T(document).observes("mutation",{childList:!0,subtree:!0}).then(()=>t(document)).now().if(()=>null).cleanup(()=>U=!0)};w.register(0,"title",(n,[e])=>(n.m=e[1],{}));w.register(1,"meta",(n,e)=>{let t=e.filter(s=>s[0].attribute),r=[...e.filter(s=>s[0].property),...t.filter(s=>s[0].type).map(s=>[{property:s[0].as??k(s[0].attribute)}]),...e.filter(s=>s[0].method).map(s=>[{property:s[0].method,readonly:!0}])];return r.map(([s])=>{let u=function(){return a.ignore(()=>g.get(n.o.get(this).x.$,s.property))};Object.defineProperty(n.s.prototype,s.property,"readonly"in s?{get:u}:{get:u,set:function(c){n.o.get(this).x.$[s.property]=c}})}),n.s.observedAttributes=t.map(s=>s[0].attribute),n.s.formAssociated=e.some(s=>s[0].formAssociated!=null),{constructor:function(s){s.x.$=g({attributes:{}}),t.map(([u])=>{let c=k(u.attribute);if(s.x.$.$attributes[c]=null,s.x.$.$attributes[`$${c}`].addEventListener("change",()=>{let l=g.get(s.x.$.$attributes,c);this.getAttribute(c)!=l&&(l==null?this.removeAttribute(u.attribute):this.setAttribute(u.attribute,l))}),u.type=="boolean")g.link(s.x.$[`$${u.as??c}`],{get:()=>g.get(s.x.$.$attributes,c)!=null,set:l=>s.x.$.$attributes[c]=l?"":null,changes:T(s.x.$.$attributes[`$${c}`]).change()});else if(u.type){let l=self[k(`-${u.type}`)];g.link(s.x.$[`$${u.as??c}`],{get:()=>l(g.get(s.x.$.$attributes,c)??u.default??""),set:f=>s.x.$.$attributes[c]=f==null?null:`${f}`,changes:T(s.x.$.$attributes[`$${c}`]).change()})}}),r.map(([{property:u}])=>{if(!Object.hasOwn(this,u))return;let c=this[u];delete this[u],this[u]=c})},attributeChangedCallback:function(s,u,c,l){s.x.$.$attributes[k(u)]=l}}});w.register(2,"meta",(n,e)=>O([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:o}=t[0];if(!r)return{};let i=Symbol(),s=Symbol();n.x.add(r);let u=function(l){l.x[r]=f=>{let m=[new v().then((...p)=>{m[1]?.undo(),m[1]=a(["undo"],()=>f?.(...p))}).cleanup(()=>{m[1]?.undo(),l[i].delete(m)})];return l[i].add(m),l[s]&&queueMicrotask(()=>m[0].now(...l[s])),m[0]},l[i]=new Set},c=function(l,...f){l[s]=f;for(let m of l[i])m[0].now(...f)};return o?{constructor:u,[`${r}Callback`]:c,[`${o}Callback`]:function(l,...f){l[s]=null;for(let m of l[i])m[1]?.undo()}}:{constructor:u,[`${r}Callback`]:c}})));w.register(3,Symbol(),n=>{let e=new Map,t=(o,...i)=>{if(e.get(o))return e.get(o);let s=[];e.set(o,s);let u=document.createNodeIterator(o,5),c;for(;c=u.nextNode();)if(c.nodeType==3){let l=c.textContent.split(/{{([^]*?)}}/g);c.after(...l),c.remove(),s.push(...l.map((f,m)=>{if(c=u.nextNode(),m%2==0)return;let p=new Function(...i,`return(${f})`);return(S,b,h)=>M(()=>{b.textContent=p(...h.map(d=>d[1]))})}))}else if(c.getAttribute("#for")){let[l,f]=c.getAttribute("#for").split(" of ");c.before(""),c.removeAttribute("#for"),c.remove();let m=c.localName=="template"?c.content:c,p=new Function(...i,`return(${f})`);s.push((S,b,h)=>{let d=[];a.add("undo",()=>d.splice(0).map(x=>x[1].undo())),M(()=>{let x=[...p(...h.map($=>$[1]))];for(;d.length>x.length;)d.pop()[1].undo();x.map(($,y)=>{d[y]&&d[y][0]===$||(d[y]?.[1].undo(),d[y]=[$,a(["undo"],()=>{let E=S.l(m,[...h,[l,$]]),A=E.nodeType==11?[...E.childNodes]:[E];return a.add("undo",()=>A.map(L=>L.remove())),(d[y-1]?.[1].result.at(-1)??b).after(...A),A})])})})})}else if(c.getAttribute("#if")){c.before("");let l=c.previousSibling,f=[],m=[],p=b=>{let h=l.nextElementSibling;if(h?.hasAttribute(b)){for(;l.nextSibling!=h;)l.nextSibling.remove();return f.push(`()=>(${h.getAttribute(b)||!0})`),m.push(h.localName=="template"?h.content:h),h.removeAttribute(b),h.remove(),!0}};for(p("#if");p("#else-if"););p("#else");let S=new Function(...i,`return[${f}].findIndex(e=>e())`);s.push((b,h,d)=>{let x,$=[];a.add("undo",()=>$.splice(0).map(y=>y.remove())),M(()=>{let y=S(...d.map(L=>L[1]));if(y==x||(x=y,$.splice(0).map(L=>L.remove()),!m[y]))return;let E=b.l(m[y],d),A=E.nodeType==11?E.childNodes:[E];$.push(...A),h.after(...A)})})}else{let l=[...c.attributes].map(f=>{if(f.name[0]==":"){let m=f.name.slice(1),p=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(S,b,h)=>M(()=>{let d=p.call(b,...h.map(x=>x[1]));d==null?b.removeAttribute(m):b.setAttribute(m,d)})}else if(f.name[0]=="."){let m=f.name.slice(1).split(".").at(-1),p=f.name.slice(1).split(".").map(k),S=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(b,h,d)=>M(()=>{let x=S.call(h,...d.map(A=>A[1])),$=[...p],y=$.pop(),E=h;$.map(A=>E=E?.[A]),E!=null&&(E instanceof DOMTokenList?E.toggle(m,x):E[y]=x)})}else if(f.name[0]=="@"){let m=f.name.slice(1),p=new Function(...i,"event",f.value);return c.removeAttribute(f.name),(S,b,h)=>{let d=x=>a.ignore(()=>p.call(b,...h.map($=>$[1]),x));b.addEventListener(m,d),a.add("undo",()=>b.removeEventListener(m,d))}}});s.push((...f)=>{l.map(m=>m?.(...f))})}return s};return{constructor:function(o){o.l=(i,s,u=c=>c())=>{let c=t(i,...s.map(p=>p[0])),l=i.cloneNode(!0),f=document.createNodeIterator(l,5),m=c.map(p=>[f.nextNode(),p]).filter(([p,S])=>S);return u(()=>{m.map(p=>p[1](o,p[0],s))}),l}}}});w.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.u=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected)),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});w.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));w.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let o=r.root.mode?r.root:this.getRootNode(),i=o.adoptedStyleSheets;i.includes(t)||(o.adoptedStyleSheets=[...i,t])}}});w.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:a,until:D,Flow:v,live:g,when:T,purify:R,effect:M,frame:H,interval:P,paint:K,timeout:W};Object.defineProperty(self.yozo,"register",{value:N});})();
