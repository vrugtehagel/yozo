(()=>{var v=class{#e=[];#t=[];#r;#o;#n;constructor(e){a.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}flow(e){return this.#e.push(e),this}now(...e){let t=-1,r=()=>{this.#r||(t++,!(t<this.#n)&&(this.#o&&(this.#n=t+1),this.#e.length+1==this.#n&&this.stop(),this.#e[t]?.(r,...e)))};return r(),this}then(e){return this.flow((t,...r)=>{e(...r),t()})}await(e){return this.flow(async(t,...r)=>{await e(...r),t()})}if(e){return this.flow((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){if(!this.#r)return this.#r=!0,this.#e.splice(0),this.#t.splice(0).map(e=>e()),this}until(e){return typeof e=="function"?this.flow((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#r?e():this.#t.push(e),this}once(){return this.then(()=>this.#o=!0)}debounce(e){let t;return this.flow(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.flow(o=>{if(r)return t=o;o(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var S=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),j=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...o){n.map(i=>i[r]?.call(this,...o))};return e};var O=(...n)=>new Proxy({does:(e,t)=>{let r;return new v(o=>{r=o,n.map(i=>i.addEventListener(e,r,t))}).cleanup(()=>n.map(o=>o.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new v(o=>{r=new self[S(`-${e}-observer`)](o,t),n.map(i=>r.observe(i,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var C=(n,e=queueMicrotask)=>{let t,r=()=>e(()=>o.now()),o=new v().then(()=>{t?.undo(),t=a(["undo","live"],n),t.live.addEventListener("change",r,{once:!0})}).cleanup(()=>{t?.undo(),t?.live.removeEventListener("change",r,{once:!0})});return r(),o};var g=n=>new q({e:{$:g.get(n)}},"$").t,F=new WeakMap,q=class{constructor(e,t,r=this){this.r=e,this.i=t,this.p=r,this.a={},this.t=new Proxy(new EventTarget,{get:(o,i)=>i==Symbol.iterator?()=>(a.add("live",this.t,"keychange"),[...this.e].map((s,l)=>this.n(l).t)[i]()):i[0]=="$"?this.n(i.slice(1)).t:o[i]?o[i].bind(o):(a.add("live",this.n(i).t,"deepchange"),this.e?.[i]),set:(o,i,s)=>g.set(this.n(i).t,s),deleteProperty:(o,i,s)=>g.delete(this.n(i).t),has:(o,i)=>(a.add("live",this.t,"keychange"),this.e!=null&&i in this.e||o[i]),ownKeys:()=>(a.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(o=>`$${o}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),F.set(this.t,this),this.e=this.r.e?.[this.i],this.f=Object.keys(this.e??{})}n(e){return this.a[e]??=new q(this,e,this.p)}c(e,t=new Set([this])){let r=e?.(),o=this.e,i=this.r.e?.[this.i];this.e=i,Object.is(o,i)||this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:o,value:i}}));let s=Object.keys(this.e??{}),l=new Set(this.f);this.f=s;for(let u of s)l.has(u)?l.delete(u):l.add(u);l.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...l]}}));let c=this.r;for(t.add(this);!t.has(c)&&c.r;)c.c(null,t),c=c.r;if(Object.is(o,i))return r;for(let u of Object.values(this.a))u.c(null,t);if(e){for(let u of t)u.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};g.get=(n,e)=>{let t=F.get(n);return t?e!=null?t.n(e).e:(a.add("live",n,"deepchange"),t.e):e==null?n:n[e]};g.set=(n,e)=>{let t=F.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=g.get(e),!0))};g.delete=(n,e)=>{let t=F.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};g.link=(n,e)=>{let t,r=e;e instanceof HTMLElement?r={get:()=>e.value,set:l=>e.value=l,changes:O(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:C(()=>t=e(),l=>l())});let o,i=l=>{o=!0,g.set(n,l),t=l,o=!1},s=()=>{if(!o){if(!r.set)return i(t);r.set(a.ignore(()=>g.get(n))),i(a.ignore(r.get))}};return n.addEventListener("deepchange",s),i(a.ignore(r.get)),(r.changes??new v).then(()=>i(a.ignore(r.get))).if(()=>null).cleanup(()=>n.removeEventListener("deepchange",s))};var M,a=(n,e)=>{let t=M;M={};let r={};return n.map(o=>{M[o]=new D[o],r[o]=M[o].result}),r.result=e(),M=t,r},H=n=>M?new Promise(async e=>{let t=M,r=await n;Object.keys(t).some(o=>t[o].until?.())||(queueMicrotask(()=>M=t),e(r),queueMicrotask(()=>M=null))}):n;a.ignore=n=>a([],n).result;a.add=(n,...e)=>{M?.[n]?.add(...e)};a.register=(n,e)=>{D[n]??=e};var D={result:!0,undo:class{#e=[];#t;result=()=>{this.#t||(this.#e.splice(0).map(n=>n()),this.#t=!0)};add(n){if(this.#t)return n();this.#e.push(n)}until(){return this.#t}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),n.addEventListener(e,()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var V=n=>{let e;return(...t)=>(e?.undo(),e=a(["undo"],()=>n(...t)),e.result)};var P=n=>{let e;return new v(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},R=n=>P(n).once(),z=()=>{let n;return new v(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},W=()=>{let n=0;return z().if(()=>n++).once()};var w=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),a.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(L.map(([o,i])=>[i,(...s)=>(t[i]??=[]).push(s)])));let r=j(L.map(([o,i])=>o(e,t[i]??[])));return Object.entries(r).map(([o,i])=>e.s.prototype[o]??=function(...s){return a.ignore(()=>i.call(this,e.o.get(this),...s))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},L=[];w.register=(n,e,t)=>{L.push([t,e,n]),L.sort((r,o)=>r[2]-o[2])};var K=new Set,I=async n=>{if(K.has(`${n}`))return;K.add(`${n}`);let e=await fetch(n),t=document.createElement("template");return t.innerHTML=await e.text(),w(r=>{for(let o of t.content.children)r[o.localName]?.(Object.fromEntries([...o.attributes].map(i=>[S(i.name),i.value])),o.innerHTML)})},U,N;I.auto=n=>{if(N)return;N=new Set;let e=r=>{if(N.has(r))return;N.add(r);let o=n(r);o&&I(o)},t=r=>{for(let o of r.querySelectorAll(":not(:defined)"))e(o.localName);for(let o of r.querySelectorAll("template"))t(o.content)};return w.register(6,Symbol(),r=>U?{}:(r.u&&t(r.u),{}),{}),O(document).observes("mutation",{childList:!0,subtree:!0}).then(()=>t(document)).now().if(()=>null).cleanup(()=>U=!0)};w.register(0,"title",(n,[e])=>(n.m=e[1],{}));w.register(1,"meta",(n,e)=>{let t=e.filter(s=>s[0].attribute),r=[...e.filter(s=>s[0].property),...t.filter(s=>s[0].type).map(s=>[{property:s[0].as??S(s[0].attribute)}]),...e.filter(s=>s[0].method).map(s=>[{property:s[0].method,readonly:!0}])];return r.map(([s])=>{let l=function(){return a.ignore(()=>g.get(n.o.get(this).x.$,s.property))};Object.defineProperty(n.s.prototype,s.property,"readonly"in s?{get:l}:{get:l,set:function(c){n.o.get(this).x.$[s.property]=c}})}),n.s.observedAttributes=t.map(s=>s[0].attribute),n.s.formAssociated=e.some(s=>s[0].formAssociated!=null),{constructor:function(s){s.x.$=g({attributes:{}}),t.map(([l])=>{let c=S(l.attribute);if(s.x.$.$attributes[c]=null,s.x.$.$attributes[`$${c}`].addEventListener("change",()=>{let u=g.get(s.x.$.$attributes,c);u==null?this.removeAttribute(l.attribute):this.setAttribute(l.attribute,u)}),l.type=="boolean")g.link(s.x.$[`$${l.as??c}`],{get:()=>g.get(s.x.$.$attributes,c)!=null,set:u=>s.x.$.$attributes[c]=u?"":null,changes:O(s.x.$.$attributes[`$${c}`]).change()});else if(l.type){let u=self[S(`-${l.type}`)];g.link(s.x.$[`$${l.as??c}`],{get:()=>u(g.get(s.x.$.$attributes,c)??l.default??""),set:f=>s.x.$.$attributes[c]=f==null?null:`${f}`,changes:O(s.x.$.$attributes[`$${c}`]).change()})}}),r.map(([{property:l}])=>{if(!Object.hasOwn(this,l))return;let c=this[l];delete this[l],this[l]=c})},attributeChangedCallback:function(s,l,c,u){s.x.$.$attributes[S(l)]=u}}});w.register(2,"meta",(n,e)=>j([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:o}=t[0];if(!r)return{};let i=Symbol(),s=Symbol();n.x.add(r);let l=function(u){u.x[r]=f=>{let m=[new v().then((...p)=>{m[1]?.undo(),m[1]=a(["undo"],()=>f?.(...p))}).cleanup(()=>{m[1]?.undo(),u[i].delete(m)})];return u[i].add(m),u[s]&&queueMicrotask(()=>m[0].now(...u[s])),m[0]},u[i]=new Set},c=function(u,...f){u[s]=f;for(let m of u[i])m[0].now(...f)};return o?{constructor:l,[`${r}Callback`]:c,[`${o}Callback`]:function(u,...f){u[s]=null;for(let m of u[i])m[1]?.undo()}}:{constructor:l,[`${r}Callback`]:c}})));w.register(3,Symbol(),n=>{let e=new Map,t=(o,...i)=>{if(e.get(o))return e.get(o);let s=[];e.set(o,s);let l=document.createNodeIterator(o,5),c;for(;c=l.nextNode();)if(c.nodeType==3){let u=c.textContent.split(/{{([^]*?)}}/g);c.after(...u),c.remove(),s.push(...u.map((f,m)=>{if(c=l.nextNode(),m%2==0)return;let p=new Function(...i,`return(${f})`);return(k,b,h)=>C(()=>{b.textContent=p(...h.map(d=>d[1]))})}))}else if(c.getAttribute("#for")){let[u,f]=c.getAttribute("#for").split(" of ");c.before(""),c.removeAttribute("#for"),c.remove();let m=c.localName=="template"?c.content:c,p=new Function(...i,`return(${f})`);s.push((k,b,h)=>{let d=[];a.add("undo",()=>d.splice(0).map(x=>x[1].undo())),C(()=>{let x=[...p(...h.map($=>$[1]))];for(;d.length>x.length;)d.pop()[1].undo();x.map(($,y)=>{d[y]&&d[y][0]===$||(d[y]?.[1].undo(),d[y]=[$,a(["undo"],()=>{let E=k.l(m,[...h,[u,$]]),A=E.nodeType==11?[...E.childNodes]:[E];return a.add("undo",()=>A.map(T=>T.remove())),(d[y-1]?.[1].result.at(-1)??b).after(...A),A})])})})})}else if(c.getAttribute("#if")){c.before("");let u=c.previousSibling,f=[],m=[],p=b=>{let h=u.nextElementSibling;if(h?.hasAttribute(b)){for(;u.nextSibling!=h;)u.nextSibling.remove();return f.push(`()=>(${h.getAttribute(b)||!0})`),m.push(h.localName=="template"?h.content:h),h.removeAttribute(b),h.remove(),!0}};for(p("#if");p("#else-if"););p("#else");let k=new Function(...i,`return[${f}].findIndex(e=>e())`);s.push((b,h,d)=>{let x,$=[];a.add("undo",()=>$.splice(0).map(y=>y.remove())),C(()=>{let y=k(...d.map(T=>T[1]));if(y==x||(x=y,$.splice(0).map(T=>T.remove()),!m[y]))return;let E=b.l(m[y],d),A=E.nodeType==11?E.childNodes:[E];$.push(...A),h.after(...A)})})}else{let u=[...c.attributes].map(f=>{if(f.name[0]==":"){let m=f.name.slice(1),p=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(k,b,h)=>C(()=>{let d=p.call(b,...h.map(x=>x[1]));d==null?b.removeAttribute(m):b.setAttribute(m,d)})}else if(f.name[0]=="."){let m=f.name.slice(1).split(".").at(-1),p=f.name.slice(1).split(".").map(S),k=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(b,h,d)=>C(()=>{let x=k.call(h,...d.map(A=>A[1])),$=[...p],y=$.pop(),E=h;$.map(A=>E=E?.[A]),E!=null&&(E instanceof DOMTokenList?E.toggle(m,x):E[y]=x)})}else if(f.name[0]=="@"){let m=f.name.slice(1),p=new Function(...i,"event",f.value);return c.removeAttribute(f.name),(k,b,h)=>{let d=x=>a.ignore(()=>p.call(b,...h.map($=>$[1]),x));b.addEventListener(m,d),a.add("undo",()=>b.removeEventListener(m,d))}}});s.push((...f)=>{u.map(m=>m?.(...f))})}return s};return{constructor:function(o){o.l=(i,s,l=c=>c())=>{let c=t(i,...s.map(p=>p[0])),u=i.cloneNode(!0),f=document.createNodeIterator(u,5),m=c.map(p=>[f.nextNode(),p]).filter(([p,k])=>k);return l(()=>{m.map(p=>p[1](o,p[0],s))}),u}}}});w.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.u=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected)),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});w.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));w.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let o=r.root.mode?r.root:this.getRootNode(),i=o.adoptedStyleSheets;i.includes(t)||(o.adoptedStyleSheets=[...i,t])}}});w.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:a,until:H,Flow:v,live:g,when:O,purify:V,effect:C,frame:z,interval:P,paint:W,timeout:R};Object.defineProperty(self.yozo,"register",{value:I});})();