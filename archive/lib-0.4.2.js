(()=>{var v=class{#e=[];#t=[];#n;#r;constructor(e){a.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}pipe(e){return this.#e?.push(e),this}now(...e){let t=-1,r=()=>{this.#e&&(t++,!(t<this.#r)&&(this.#n&&(this.#r=t+1),this.#e.length+1==this.#r&&this.stop(),this.#e?.[t]?.(r,...e)))};return r(),this}then(e){return this.pipe((t,...r)=>{e(...r),t()})}await(e){return this.pipe(async(t,...r)=>{await e(...r),t()})}if(e){return this.pipe((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){return this.#e&&this.#t.splice(0).map(e=>e()),this.#e=null,this}until(e){return typeof e=="function"?this.pipe((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#e?this.#t.push(e):e(),this}once(){return this.then(()=>this.#n=!0)}debounce(e){let t;return this.pipe(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.pipe(s=>{if(r)return t=s;s(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var k=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),O=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...s){n.map(i=>i[r]?.call(this,...s))};return e};var T=(...n)=>new Proxy({does:(e,t)=>{let r;return new v(s=>{r=s,n.map(i=>i.addEventListener(e,r,t))}).cleanup(()=>n.map(s=>s.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new v(s=>{r=new self[k(`-${e}-observer`)](s,t),n.map(i=>r.observe(i,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var M=(n,e=queueMicrotask)=>{let t,r=()=>e(()=>s.now()),s=new v().then(()=>{t?.undo(),t=a(["undo","live"],n),t.live.addEventListener("change",r,{once:!0})}).cleanup(()=>{t?.undo(),t?.live.removeEventListener("change",r,{once:!0})});return r(),s};var g=n=>new N({e:{$:g.get(n)}},"$").t,q=new WeakMap,N=class n{constructor(e,t,r=this){this.r=e,this.i=t,this.p=r,this.a={},this.t=new Proxy(new EventTarget,{get:(s,i)=>i==Symbol.iterator?()=>(a.add("live",this.t,"keychange"),[...this.e].map((o,l)=>this.n(l).t)[i]()):i[0]=="$"?this.n(i.slice(1)).t:s[i]?s[i].bind(s):(a.add("live",this.n(i).t,"deepchange"),this.e?.[i]),set:(s,i,o)=>g.set(this.n(i).t,o),deleteProperty:(s,i,o)=>g.delete(this.n(i).t),has:(s,i)=>(a.add("live",this.t,"keychange"),this.e!=null&&i in this.e||s[i]),ownKeys:()=>(a.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(s=>`$${s}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),q.set(this.t,this),this.e=this.r.e?.[this.i],this.f=Object.keys(this.e??{})}n(e){return this.a[e]??=new n(this,e,this.p)}c(e,t=new Set){let r=e?.(),s=this.e,i=this.e=this.r.e?.[this.i];if(typeof i=="object"){let l=Object.keys(this.e??{}),c=new Set(this.f);this.f=l;for(let u of l)c.has(u)?c.delete(u):c.add(u);c.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...c]}}))}if(Object.is(s,i))return r;this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:s,value:i}}));let o=this;for(;!t.has(o)&&o.r;)o.c(null,t),t.add(o),o=o.r;for(let l of Object.values(this.a))l.c(null,t);if(e){for(let l of t)l.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};g.get=(n,e)=>{let t=q.get(n);return t?e!=null?t.n(e).e:(a.add("live",n,"deepchange"),t.e):e==null?n:n[e]};g.set=(n,e)=>{let t=q.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=g.get(e),!0))};g.delete=(n,e)=>{let t=q.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};g.link=(n,e)=>{let t,r=e;self.HTMLElement&&e instanceof HTMLElement?r={get:()=>e.value,set:c=>e.value=c,changes:T(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:M(()=>t=e(),c=>c())});let s=new v;r.changes?.then(()=>s.now());let i,o=c=>{i=!0,g.set(n,c),t=c,i=!1},l=()=>{if(!i){if(!r.set)return o(t);r.set(a.ignore(()=>g.get(n))),o(a.ignore(r.get))}};return n.addEventListener("deepchange",l),o(a.ignore(r.get)),s.then(()=>o(a.ignore(r.get))).cleanup(()=>n.removeEventListener("deepchange",l))};var C,a=(n,e)=>{let t=C;C={};let r={};return n.map(s=>{C[s]=new V[s],r[s]=C[s].result}),r.result=e(),C=t,r},D=n=>C?new Promise(async e=>{let t=C,r=await n;Object.keys(t).some(s=>t[s].until?.())||(queueMicrotask(()=>C=t),e(r),queueMicrotask(()=>C=null))}):n;a.ignore=n=>a([],n).result;a.add=(n,...e)=>{C?.[n]?.add(...e)};a.register=(n,e)=>{V[n]??=e};var V={result:!0,undo:class{#e=[];#t;result=()=>{this.#t||(this.#e.splice(0).map(n=>n()),this.#t=!0)};add(n){if(this.#t)return n();this.#e.push(n)}until(){return this.#t}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),n.addEventListener(e,()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var R=n=>{let e;return(...t)=>(e?.undo(),e=a(["undo"],()=>n(...t)),e.result)};var I=n=>{let e;return new v(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},W=n=>I(n).once(),P=()=>{let n;return new v(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},K=()=>{let n=0;return P().if(()=>n++).once()};var w=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),a.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(j.map(([s,i])=>[i,(...o)=>(t[i]??=[]).push(o)])));let r=O(j.map(([s,i])=>s(e,t[i]??[])));return Object.entries(r).map(([s,i])=>e.s.prototype[s]??=function(...o){return a.ignore(()=>i.call(this,e.o.get(this),...o))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},j=[];w.register=(n,e,t)=>{j.push([t,e,n]),j.sort((r,s)=>r[2]-s[2])};var H=new Map,F=n=>(H.get(`${n}`)||H.set(`${n}`,fetch(n).then(async e=>{if(!e.ok)return;let t=document.createElement("template");return t.innerHTML=await e.text(),w(r=>{for(let s of t.content.children)r[s.localName]?.(Object.fromEntries([...s.attributes].map(i=>[k(i.name),i.value])),s.innerHTML)})})),H.get(`${n}`)),U=new Set,z;F.auto=n=>{if(z)return;z=n;let e=r=>{for(let s of r.querySelectorAll(":not(:defined)"))t(s.localName);for(let s of r.querySelectorAll("template"))e(s.content)},t=r=>{if(U.has(r))return;U.add(r);let s=z(r);s&&F(s)};w.register(6,Symbol(),r=>(r.u&&e(r.u),{})),document.readyState=="loading"?document.addEventListener("readystatechange",()=>e(document),{once:!0}):e(document)};w.register(0,"title",(n,[e])=>(n.m=e[1],{}));w.register(1,"meta",(n,e)=>{let t=e.filter(o=>o[0].attribute),r=[...e.filter(o=>o[0].property),...t.filter(o=>o[0].type).map(o=>[{property:o[0].as??k(o[0].attribute)}]),...e.filter(o=>o[0].method).map(o=>[{property:o[0].method,readonly:!0}])];return r.map(([o])=>{let l=function(){return a.ignore(()=>g.get(n.o.get(this).x.$,o.property))};Object.defineProperty(n.s.prototype,o.property,"readonly"in o?{get:l}:{get:l,set:function(c){n.o.get(this).x.$[o.property]=c}})}),n.s.observedAttributes=t.map(o=>o[0].attribute),n.s.formAssociated=e.some(o=>o[0].formAssociated!=null),{constructor:function(o){o.x.$=g({attributes:{}}),t.map(([l])=>{let c=k(l.attribute);if(o.x.$.$attributes[c]=null,o.x.$.$attributes[`$${c}`].addEventListener("change",()=>{let u=g.get(o.x.$.$attributes,c);this.getAttribute(c)!=u&&(u==null?this.removeAttribute(l.attribute):this.setAttribute(l.attribute,u))}),l.type=="boolean")g.link(o.x.$[`$${l.as??c}`],{get:()=>g.get(o.x.$.$attributes,c)!=null,set:u=>o.x.$.$attributes[c]=u?"":null,changes:T(o.x.$.$attributes[`$${c}`]).change()});else if(l.type){let u=self[k(`-${l.type}`)];g.link(o.x.$[`$${l.as??c}`],{get:()=>u(g.get(o.x.$.$attributes,c)??l.default??""),set:f=>o.x.$.$attributes[c]=f==null?null:`${f}`,changes:T(o.x.$.$attributes[`$${c}`]).change()})}}),r.map(([{property:l}])=>{if(!Object.hasOwn(this,l))return;let c=this[l];delete this[l],this[l]=c})},attributeChangedCallback:function(o,l,c,u){o.x.$.$attributes[k(l)]=u}}});w.register(2,"meta",(n,e)=>O([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:s}=t[0];if(!r)return{};let i=Symbol(),o=Symbol();n.x.add(r);let l=function(u){u.x[r]=f=>{let m=[new v().then((...p)=>{m[1]?.undo(),m[1]=a(["undo"],()=>f?.(...p))}).cleanup(()=>{m[1]?.undo(),u[i].delete(m)})];return u[i].add(m),u[o]&&queueMicrotask(()=>m[0].now(...u[o])),m[0]},u[i]=new Set},c=function(u,...f){u[o]=f;for(let m of u[i])m[0].now(...f)};return s?{constructor:l,[`${r}Callback`]:c,[`${s}Callback`]:function(u,...f){u[o]=null;for(let m of u[i])m[1]?.undo()}}:{constructor:l,[`${r}Callback`]:c}})));w.register(3,Symbol(),n=>{let e=new Map,t=(s,...i)=>{if(e.get(s))return e.get(s);let o=[];e.set(s,o);let l=document.createNodeIterator(s,5),c;for(;c=l.nextNode();)if(c.nodeType==3){let u=c.textContent.split(/{{([^]*?)}}/g);c.after(...u),c.remove(),o.push(...u.map((f,m)=>{if(c=l.nextNode(),m%2==0)return;let p=new Function(...i,`return(${f})`);return(S,b,h)=>M(()=>{b.textContent=p(...h.map(d=>d[1]))})}))}else if(c.getAttribute("#for")){let[u,f]=c.getAttribute("#for").split(" of ");c.before(""),c.removeAttribute("#for"),c.remove();let m=c.localName=="template"?c.content:c,p=new Function(...i,`return(${f})`);o.push((S,b,h)=>{let d=[];a.add("undo",()=>d.splice(0).map(x=>x[1].undo())),M(()=>{let x=[...p(...h.map(y=>y[1]))];for(;d.length>x.length;)d.pop()[1].undo();x.map((y,$)=>{d[$]&&d[$][0]===y||(d[$]?.[1].undo(),d[$]=[y,a(["undo"],()=>{let E=S.l(m,[...h,[u,y]]),A=E.nodeType==11?[...E.childNodes]:[E];return a.add("undo",()=>A.map(L=>L.remove())),(d[$-1]?.[1].result.at(-1)??b).after(...A),A})])})})})}else if(c.getAttribute("#if")){c.before("");let u=c.previousSibling,f=[],m=[],p=b=>{let h=u.nextElementSibling;if(h?.hasAttribute(b)){for(;u.nextSibling!=h;)u.nextSibling.remove();return f.push(`()=>(${h.getAttribute(b)||!0})`),m.push(h.localName=="template"?h.content:h),h.removeAttribute(b),h.remove(),!0}};for(p("#if");p("#else-if"););p("#else");let S=new Function(...i,`return[${f}].findIndex(e=>e())`);o.push((b,h,d)=>{let x,y=[];a.add("undo",()=>y.splice(0).map($=>$.remove())),M(()=>{let $=S(...d.map(L=>L[1]));if($==x||(x=$,y.splice(0).map(L=>L.remove()),!m[$]))return;let E=b.l(m[$],d),A=E.nodeType==11?E.childNodes:[E];y.push(...A),h.after(...A)})})}else{let u=[...c.attributes].map(f=>{if(f.name[0]==":"){let m=f.name.slice(1),p=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(S,b,h)=>M(()=>{let d=p.call(b,...h.map(x=>x[1]));d==null?b.removeAttribute(m):b.setAttribute(m,d)})}else if(f.name[0]=="."){let m=f.name.slice(1).split(".").at(-1),p=f.name.slice(1).split(".").map(k),S=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(b,h,d)=>M(()=>{let x=S.call(h,...d.map(A=>A[1])),y=[...p],$=y.pop(),E=h;y.map(A=>E=E?.[A]),E!=null&&(E instanceof DOMTokenList?E.toggle(m,x):E[$]=x)})}else if(f.name[0]=="@"){let m=f.name.slice(1),p=new Function(...i,"event",f.value);return c.removeAttribute(f.name),(S,b,h)=>{let d=x=>a.ignore(()=>p.call(b,...h.map(y=>y[1]),x));b.addEventListener(m,d),a.add("undo",()=>b.removeEventListener(m,d))}}});o.push((...f)=>{u.map(m=>m?.(...f))})}return o};return{constructor:function(s){s.l=(i,o,l=a.ignore)=>{let c=t(i,...o.map(p=>p[0])),u=i.cloneNode(!0),f=document.createNodeIterator(u,5),m=c.map(p=>[f.nextNode(),p]).filter(([p,S])=>S);return l(()=>{m.map(p=>p[1](s,p[0],o))}),u}}}});w.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.u=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected)),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});w.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));w.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let s=r.root.mode?r.root:this.getRootNode(),i=s.adoptedStyleSheets;i.includes(t)||(s.adoptedStyleSheets=[...i,t])}}});w.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:a,until:D,Flow:v,live:g,when:T,purify:R,effect:M,frame:P,interval:I,paint:K,timeout:W};Object.defineProperty(self.yozo,"register",{value:F});})();
