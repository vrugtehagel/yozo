(()=>{var v=class{#e=[];#t=[];#n;#r;constructor(e){a.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}pipe(e){return this.#e?.push(e),this}now(...e){let t=-1,r=()=>{this.#e&&(t++,!(t<this.#r)&&(this.#n&&(this.#r=t+1),this.#e.length+1==this.#r&&this.stop(),this.#e?.[t]?.(r,...e)))};return r(),this}then(e){return this.pipe((t,...r)=>{e(...r),t()})}await(e){return this.pipe(async(t,...r)=>{await e(...r),t()})}if(e){return this.pipe((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){return this.#e&&this.#t.splice(0).map(e=>e()),this.#e=null,this}until(e){return typeof e=="function"?this.pipe((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#e?this.#t.push(e):e(),this}once(){return this.then(()=>this.#n=!0)}debounce(e){let t;return this.pipe(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.pipe(s=>{if(r)return t=s;s(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var k=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),L=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...s){n.map(i=>i[r]?.call(this,...s))};return e};var T=(...n)=>new Proxy({does:(e,t)=>{let r;return new v(s=>{r=s,n.map(i=>i.addEventListener(e,r,t))}).cleanup(()=>n.map(s=>s.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new v(s=>{r=new self[k(`-${e}-observer`)](s,t),n.map(i=>r.observe(i,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var M=(n,e=queueMicrotask)=>{let t,r=()=>e(()=>s.now()),s=new v().then(()=>{t?.undo(),t=a(["undo","live"],n),t.live.addEventListener("change",r,{once:!0})}).cleanup(()=>{t?.undo(),t?.live.removeEventListener("change",r,{once:!0})});return r(),s};var g=n=>new q({e:{$:g.get(n)}},"$").t,j=new WeakMap,q=class n{constructor(e,t,r=this){this.r=e,this.i=t,this.f=r,this.l={},this.t=new Proxy(new EventTarget,{get:(s,i)=>i==Symbol.iterator?()=>(a.add("live",this.t,"keychange"),[...this.e].map((o,l)=>this.n(l).t)[i]()):i[0]=="$"?this.n(i.slice(1)).t:s[i]?s[i].bind(s):(a.add("live",this.n(i).t,"deepchange"),this.e?.[i]),set:(s,i,o)=>g.set(this.n(i).t,o),deleteProperty:(s,i,o)=>g.delete(this.n(i).t),has:(s,i)=>(a.add("live",this.t,"keychange"),this.e!=null&&i in this.e||s[i]),ownKeys:()=>(a.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(s=>`$${s}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),j.set(this.t,this),this.e=this.r.e?.[this.i],this.a=Object.keys(this.e??{})}n(e){return this.l[e]??=new n(this,e,this.f)}c(e,t=new Set){let r=e?.(),s=this.e,i=this.e=this.r.e?.[this.i];if(typeof i=="object"){let l=Object.keys(this.e??{}),c=new Set(this.a);this.a=l;for(let u of l)c.has(u)?c.delete(u):c.add(u);c.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...c]}}))}if(Object.is(s,i))return r;this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:s,value:i}}));let o=this;for(;!t.has(o)&&o.r;)o.c(null,t),t.add(o),o=o.r;for(let l of Object.values(this.l))l.c(null,t);if(e){for(let l of t)l.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};g.get=(n,e)=>{let t=j.get(n);return t?e!=null?t.n(e).e:(a.add("live",n,"deepchange"),t.e):e==null?n:n[e]};g.set=(n,e)=>{let t=j.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=g.get(e),!0))};g.delete=(n,e)=>{let t=j.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};g.link=(n,e)=>{let t,r=e;self.HTMLElement&&e instanceof HTMLElement?r={get:()=>e.value,set:c=>e.value=c,changes:T(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:M(()=>t=e(),c=>c())});let s=new v;r.changes?.then(()=>s.now());let i,o=c=>{i=!0,g.set(n,c),t=c,i=!1},l=()=>{if(!i){if(!r.set)return o(t);r.set(a.ignore(()=>g.get(n))),o(a.ignore(r.get))}};return n.addEventListener("deepchange",l),o(a.ignore(r.get)),s.then(()=>o(a.ignore(r.get))).cleanup(()=>n.removeEventListener("deepchange",l))};var C,a=(n,e)=>{let t=C;C={};let r={};return n.map(s=>{C[s]=new z[s],r[s]=C[s].result}),r.result=e(),C=t,r},H=n=>C?new Promise(async e=>{let t=C,r=await n;Object.keys(t).some(s=>t[s].until?.())||(queueMicrotask(()=>C=t),e(r),queueMicrotask(()=>C=null))}):n;a.ignore=n=>a([],n).result;a.add=(n,...e)=>{C?.[n]?.add(...e)};a.register=(n,e)=>{z[n]??=e};var z={result:!0,undo:class{#e=[];#t;result=()=>{this.#t||(this.#e.splice(0).map(n=>n()),this.#t=!0)};add(n){if(this.#t)return n();this.#e.push(n)}until(){return this.#t}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),n.addEventListener(e,()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var D=n=>{let e;return(...t)=>(e?.undo(),e=a(["undo"],()=>n(...t)),e.result)};var I=n=>{let e;return new v(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},V=n=>I(n).once(),N=()=>{let n;return new v(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},W=()=>{let n=0;return N().if(()=>n++).once()};var w=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),a.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(F.map(([s,i])=>[i,(...o)=>(t[i]??=[]).push(o)])));let r=L(F.map(([s,i])=>s(e,t[i]??[])));return Object.entries(r).map(([s,i])=>e.s.prototype[s]??=function(...o){return a.ignore(()=>i.call(this,e.o.get(this),...o))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},F=[];w.register=(n,e,t)=>{F.push([t,e,n]),F.sort((r,s)=>r[2]-s[2])};var P=new Map,K=n=>(P.get(`${n}`)||P.set(`${n}`,fetch(n).then(async e=>{if(!e.ok)return;let t=document.createElement("template");return t.innerHTML=await e.text(),w(r=>{for(let s of t.content.children)r[s.localName]?.(Object.fromEntries([...s.attributes].map(i=>[k(i.name),i.value])),s.innerHTML)})})),P.get(`${n}`));w.register(0,"title",(n,[e])=>(n.m=e[1],{}));w.register(1,"meta",(n,e)=>{let t=e.filter(o=>o[0].attribute),r=[...e.filter(o=>o[0].property),...t.filter(o=>o[0].type).map(o=>[{property:o[0].as??k(o[0].attribute)}]),...e.filter(o=>o[0].method).map(o=>[{property:o[0].method,readonly:!0}])];return r.map(([o])=>{let l=function(){return a.ignore(()=>g.get(n.o.get(this).x.$,o.property))};Object.defineProperty(n.s.prototype,o.property,"readonly"in o?{get:l}:{get:l,set:function(c){n.o.get(this).x.$[o.property]=c}})}),n.s.observedAttributes=t.map(o=>o[0].attribute),n.s.formAssociated=e.some(o=>o[0].formAssociated!=null),{constructor:function(o){o.x.$=g({attributes:{}}),t.map(([l])=>{let c=k(l.attribute);if(o.x.$.$attributes[c]=null,o.x.$.$attributes[`$${c}`].addEventListener("change",()=>{let u=g.get(o.x.$.$attributes,c);this.getAttribute(c)!=u&&(u==null?this.removeAttribute(l.attribute):this.setAttribute(l.attribute,u))}),l.type=="boolean")g.link(o.x.$[`$${l.as??c}`],{get:()=>g.get(o.x.$.$attributes,c)!=null,set:u=>o.x.$.$attributes[c]=u?"":null,changes:T(o.x.$.$attributes[`$${c}`]).change()});else if(l.type){let u=self[k(`-${l.type}`)];g.link(o.x.$[`$${l.as??c}`],{get:()=>u(g.get(o.x.$.$attributes,c)??l.default??""),set:m=>o.x.$.$attributes[c]=m==null?null:`${m}`,changes:T(o.x.$.$attributes[`$${c}`]).change()})}}),r.map(([{property:l}])=>{if(!Object.hasOwn(this,l))return;let c=this[l];delete this[l],this[l]=c})},attributeChangedCallback:function(o,l,c,u){o.x.$.$attributes[k(l)]=u}}});w.register(2,"meta",(n,e)=>L([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:s}=t[0];if(!r)return{};let i=Symbol(),o=Symbol();n.x.add(r);let l=function(u){u.x[r]=m=>{let p=[new v().then((...f)=>{p[1]?.undo(),p[1]=a(["undo"],()=>m?.(...f))}).cleanup(()=>{p[1]?.undo(),u[i].delete(p)})];return u[i].add(p),u[o]&&queueMicrotask(()=>p[0].now(...u[o])),p[0]},u[i]=new Set},c=function(u,...m){u[o]=m;for(let p of u[i])p[0].now(...m)};return s?{constructor:l,[`${r}Callback`]:c,[`${s}Callback`]:function(u,...m){u[o]=null;for(let p of u[i])p[1]?.undo()}}:{constructor:l,[`${r}Callback`]:c}})));w.register(3,Symbol(),n=>{let e=new Map,t=(s,...i)=>{if(e.get(s))return e.get(s);let o=[];e.set(s,o);let l=document.createNodeIterator(s,5),c;for(;c=l.nextNode();)if(c.nodeType==3){let u=c.textContent.split(/{{([^]*?)}}/g);c.after(...u),c.remove(),o.push(...u.map((m,p)=>{if(c=l.nextNode(),p%2==0)return;let f=new Function(...i,`return(${m})`);return(S,b,h)=>M(()=>{b.textContent=f(...h.map(d=>d[1]))})}))}else if(c.getAttribute("#for")){let[u,m]=c.getAttribute("#for").split(" of ");c.before(""),c.removeAttribute("#for"),c.remove();let p=c.localName=="template"?c.content:c,f=new Function(...i,`return(${m})`);o.push((S,b,h)=>{let d=[];a.add("undo",()=>d.splice(0).map(x=>x[1].undo())),M(()=>{let x=[...f(...h.map($=>$[1]))];for(;d.length>x.length;)d.pop()[1].undo();x.map(($,y)=>{d[y]&&d[y][0]===$||(d[y]?.[1].undo(),d[y]=[$,a(["undo"],()=>{let E=S.u(p,[...h,[u,$]]),A=E.nodeType==11?[...E.childNodes]:[E];return a.add("undo",()=>A.map(O=>O.remove())),(d[y-1]?.[1].result.at(-1)??b).after(...A),A})])})})})}else if(c.getAttribute("#if")){c.before("");let u=c.previousSibling,m=[],p=[],f=b=>{let h=u.nextElementSibling;if(h?.hasAttribute(b)){for(;u.nextSibling!=h;)u.nextSibling.remove();return m.push(`()=>(${h.getAttribute(b)||!0})`),p.push(h.localName=="template"?h.content:h),h.removeAttribute(b),h.remove(),!0}};for(f("#if");f("#else-if"););f("#else");let S=new Function(...i,`return[${m}].findIndex(e=>e())`);o.push((b,h,d)=>{let x,$=[];a.add("undo",()=>$.splice(0).map(y=>y.remove())),M(()=>{let y=S(...d.map(O=>O[1]));if(y==x||(x=y,$.splice(0).map(O=>O.remove()),!p[y]))return;let E=b.u(p[y],d),A=E.nodeType==11?E.childNodes:[E];$.push(...A),h.after(...A)})})}else{let u=[...c.attributes].map(m=>{if(m.name[0]==":"){let p=m.name.slice(1),f=new Function(...i,`return(${m.value})`);return c.removeAttribute(m.name),(S,b,h)=>M(()=>{let d=f.call(b,...h.map(x=>x[1]));d==null?b.removeAttribute(p):b.setAttribute(p,d)})}else if(m.name[0]=="."){let p=m.name.slice(1).split(".").at(-1),f=m.name.slice(1).split(".").map(k),S=new Function(...i,`return(${m.value})`);return c.removeAttribute(m.name),(b,h,d)=>M(()=>{let x=S.call(h,...d.map(A=>A[1])),$=[...f],y=$.pop(),E=h;$.map(A=>E=E?.[A]),E!=null&&(E instanceof DOMTokenList?E.toggle(p,x):E[y]=x)})}else if(m.name[0]=="@"){let p=m.name.slice(1),f=new Function(...i,"event",m.value);return c.removeAttribute(m.name),(S,b,h)=>{let d=x=>a.ignore(()=>f.call(b,...h.map($=>$[1]),x));b.addEventListener(p,d),a.add("undo",()=>b.removeEventListener(p,d))}}});o.push((...m)=>{u.map(p=>p?.(...m))})}return o};return{constructor:function(s){s.u=(i,o,l=c=>c())=>{let c=t(i,...o.map(f=>f[0])),u=i.cloneNode(!0),m=document.createNodeIterator(u,5),p=c.map(f=>[m.nextNode(),f]).filter(([f,S])=>S);return l(()=>{p.map(f=>f[1](s,f[0],o))}),u}}}});w.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.p=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.u(n.p,[[`{${[...n.x]}}`,r.x]],r.x.connected)),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.u(n.p,[[`{${[...n.x]}}`,r.x]],r.x.connected),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});w.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));w.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let s=r.root.mode?r.root:this.getRootNode(),i=s.adoptedStyleSheets;i.includes(t)||(s.adoptedStyleSheets=[...i,t])}}});w.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:a,until:H,Flow:v,live:g,when:T,purify:D,effect:M,frame:N,interval:I,paint:W,timeout:V};Object.defineProperty(self.yozo,"register",{value:K});})();
