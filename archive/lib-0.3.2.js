(()=>{var x=class{#e=[];#t=[];#r;#o;#n;constructor(e){a.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}flow(e){return this.#e.push(e),this}now(...e){let t=-1,r=()=>{this.#r||(t++,!(t<this.#n)&&(this.#o&&(this.#n=t+1),this.#e.length+1==this.#n&&this.stop(),this.#e[t]?.(r,...e)))};return r(),this}then(e){return this.flow((t,...r)=>{e(...r),t()})}await(e){return this.flow(async(t,...r)=>{await e(...r),t()})}if(e){return this.flow((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){if(!this.#r)return this.#r=!0,this.#e.splice(0),this.#t.splice(0).map(e=>e()),this}until(e){return typeof e=="function"?this.flow((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#r?e():this.#t.push(e),this}once(){return this.then(()=>this.#o=!0)}debounce(e){let t;return this.flow(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.flow(o=>{if(r)return t=o;o(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var E=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),j=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...o){n.map(i=>i[r]?.call(this,...o))};return e};var b=(...n)=>new Proxy({does:(e,t)=>{let r;return new x(o=>{r=o,n.map(i=>i.addEventListener(e,r,t))}).cleanup(()=>n.map(o=>o.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new x(o=>{r=new self[E(`-${e}-observer`)](o,t),n.map(i=>r.observe(i,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var M=(n,e=queueMicrotask)=>{let t,r=new x().then(()=>{let o=a(["undo","live"],n);t=a.ignore(()=>b(o.live).change()).once().then(()=>e(()=>r.now())).cleanup(()=>o.undo())}).cleanup(()=>t?.stop());return e(()=>r.now()),r};var h=n=>new q({e:{$:h.get(n)}},"$").t,F=new WeakMap,q=class{constructor(e,t,r=this){this.r=e,this.i=t,this.p=r,this.a={},this.t=new Proxy(new EventTarget,{get:(o,i)=>i==Symbol.iterator?()=>(a.add("live",this.t,"keychange"),[...this.e].map((s,u)=>this.n(u).t)[i]()):i[0]=="$"?this.n(i.slice(1)).t:o[i]?o[i].bind(o):(a.add("live",this.n(i).t,"deepchange"),this.e?.[i]),set:(o,i,s)=>h.set(this.n(i).t,s),deleteProperty:(o,i,s)=>h.delete(this.n(i).t),has:(o,i)=>(a.add("live",this.t,"keychange"),this.e!=null&&i in this.e||o[i]),ownKeys:()=>(a.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(o=>`$${o}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),F.set(this.t,this),this.e=this.r.e?.[this.i],this.f=Object.keys(this.e??{})}n(e){return this.a[e]??=new q(this,e,this.p)}c(e,t=new Set([this])){let r=e?.(),o=this.e,i=this.r.e?.[this.i];this.e=i,Object.is(o,i)||this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:o,value:i}}));let s=Object.keys(this.e??{}),u=new Set(this.f);this.f=s;for(let l of s)u.has(l)?u.delete(l):u.add(l);u.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...u]}}));let c=this.r;for(t.add(this);!t.has(c)&&c.r;)c.c(null,t),c=c.r;if(Object.is(o,i))return r;for(let l of Object.values(this.a))l.c(null,t);if(e){for(let l of t)l.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};h.get=(n,e)=>{let t=F.get(n);return t?e!=null?t.n(e).e:(a.add("live",n,"deepchange"),t.e):e==null?n:n[e]};h.set=(n,e)=>{let t=F.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=h.get(e),!0))};h.delete=(n,e)=>{let t=F.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};h.link=(n,e)=>{let t,r=e;e instanceof HTMLElement?r={get:()=>e.value,set:u=>e.value=u,changes:b(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:M(()=>t=e(),u=>u())});let o,i=u=>{o=!0,h.set(n,u),t=u,o=!1},s=b(n).deepchange().then(()=>{if(!o){if(!r.set)return i(t);r.set(a.ignore(()=>h.get(n))),i(a.ignore(r.get))}});return i(a.ignore(r.get)),(r.changes??new x).then(()=>i(a.ignore(r.get))).if(()=>null).cleanup(()=>s.stop())};var O,a=(n,e)=>{let t=O;O={};let r={};return n.map(o=>{O[o]=new D[o],r[o]=O[o].result}),r.result=e(),O=t,r},H=n=>{if(!O)return n;let e=O;return{then:t=>Promise.resolve(n).then(r=>{Object.keys(e).some(o=>e[o].until?.())||(queueMicrotask(()=>O=e),t(r),queueMicrotask(()=>O=null))})}};a.ignore=n=>a([],n).result;a.add=(n,...e)=>{O?.[n]?.add(...e)};a.register=(n,e)=>{D[n]??=e};var D={result:!0,undo:class{#e=[];#t;result=()=>{this.#t||(this.#e.splice(0).map(n=>n()),this.#t=!0)};add(n){if(this.#t)return n();this.#e.push(n)}until(){return this.#t}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),a.ignore(()=>b(n).does(e)).then(()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var V=n=>{let e;return(...t)=>(e?.undo(),e=a(["undo"],()=>n(...t)),e.result)};var L=n=>{let e;return new x(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},R=n=>L(n).once(),z=()=>{let n;return new x(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},W=()=>{let n=0;return z().if(()=>n++).once()};var d=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),a.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(I.map(([o,i])=>[i,(...s)=>(t[i]??=[]).push(s)])));let r=j(I.map(([o,i])=>o(e,t[i]??[])));return Object.entries(r).map(([o,i])=>e.s.prototype[o]??=function(...s){return a.ignore(()=>i.call(this,e.o.get(this),...s))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},I=[];d.register=(n,e,t)=>{I.push([t,e,n]),I.sort((r,o)=>r[2]-o[2])};var K=new Set,P=async n=>{if(K.has(`${n}`))return;K.add(`${n}`);let e=await fetch(n),t=document.createElement("template");return t.innerHTML=await e.text(),d(r=>{for(let o of t.content.children)r[o.localName]?.(Object.fromEntries([...o.attributes].map(i=>[E(i.name),i.value])),o.innerHTML)})},U,N;P.auto=n=>{if(N)return;N=new Set;let e=r=>{if(N.has(r))return;N.add(r);let o=n(r);o&&P(o)},t=r=>{for(let o of r.querySelectorAll(":not(:defined)"))e(o.localName);for(let o of r.querySelectorAll("template"))t(o.content)};return d.register(6,Symbol(),r=>U?{}:(r.u&&t(r.u),{}),{}),b(document).observes("mutation",{childList:!0,subtree:!0}).then(()=>t(document)).now().if(()=>null).cleanup(()=>U=!0)};d.register(0,"title",(n,[e])=>(n.m=e[1],{}));d.register(1,"meta",(n,e)=>{let t=e.filter(s=>s[0].attribute),r=[...e.filter(s=>s[0].property),...t.filter(s=>s[0].type).map(s=>[{property:s[0].as??E(s[0].attribute)}]),...e.filter(s=>s[0].method).map(s=>[{property:s[0].method,readonly:!0}])];return r.map(([s])=>{let u=function(){return a.ignore(()=>h.get(n.o.get(this).x.$,s.property))};Object.defineProperty(n.s.prototype,s.property,"readonly"in s?{get:u}:{get:u,set:function(c){n.o.get(this).x.$[s.property]=c}})}),n.s.observedAttributes=t.map(s=>s[0].attribute),n.s.formAssociated=e.some(s=>s[0].formAssociated!=null),{constructor:function(s){s.x.$=h({attributes:{}}),t.map(([u])=>{let c=E(u.attribute);if(s.x.$.$attributes[c]=null,b(s.x.$.$attributes[`$${c}`]).change().then(()=>{let l=h.get(s.x.$.$attributes,c);l==null?this.removeAttribute(u.attribute):this.setAttribute(u.attribute,l)}),u.type=="boolean")h.link(s.x.$[`$${u.as??c}`],{get:()=>h.get(s.x.$.$attributes,c)!=null,set:l=>s.x.$.$attributes[c]=l?"":null,changes:b(s.x.$.$attributes[`$${c}`]).change()});else if(u.type){let l=self[E(`-${u.type}`)];h.link(s.x.$[`$${u.as??c}`],{get:()=>l(h.get(s.x.$.$attributes,c)??u.default??""),set:f=>s.x.$.$attributes[c]=f==null?null:`${f}`,changes:b(s.x.$.$attributes[`$${c}`]).change()})}}),r.map(([{property:u}])=>{if(!Object.hasOwn(this,u))return;let c=this[u];delete this[u],this[u]=c})},attributeChangedCallback:function(s,u,c,l){s.x.$.$attributes[E(u)]=l}}});d.register(2,"meta",(n,e)=>j([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:o}=t[0];if(!r)return{};let i=Symbol(),s=Symbol();n.x.add(r);let u=function(l){l.x[r]=f=>{let m=[new x().then((...v)=>{m[1]?.undo(),m[1]=a(["undo"],()=>f?.(...v))}).cleanup(()=>{m[1]?.undo(),l[i].delete(m)})];return l[i].add(m),l[s]&&queueMicrotask(()=>m[0].now(...l[s])),m[0]},l[i]=new Set},c=function(l,...f){l[s]=f;for(let m of l[i])m[0].now(...f)};return o?{constructor:u,[`${r}Callback`]:c,[`${o}Callback`]:function(l,...f){l[s]=null;for(let m of l[i])m[1]?.undo()}}:{constructor:u,[`${r}Callback`]:c}})));d.register(3,Symbol(),n=>{let e=new Map,t=(o,...i)=>{if(e.get(o))return e.get(o);let s=[];e.set(o,s);let u=document.createNodeIterator(o,5),c;for(;c=u.nextNode();)if(c.nodeType==3){let l=c.textContent.split(/{{([^]*?)}}/g);c.after(...l),c.remove(),s.push(...l.map((f,m)=>{if(c=u.nextNode(),m%2==0)return;let v=new Function(...i,`return(${c.textContent})`);return($,g,p)=>$.x.connected(()=>M(()=>g.textContent=v(...p.map(w=>w[1]))))}))}else if(c.getAttribute("#for")){let[l,f]=c.getAttribute("#for").split(" of ");c.before(""),c.removeAttribute("#for"),c.remove();let m=c,v=new Function(...i,`return(${f})`);s.push(($,g,p)=>{let w=[];$.x.connected(()=>M(()=>{let y=[...v.call(c,...p.map(A=>A[1]))];for(;w.length>y.length;)w.pop()[1].undo();y.map((A,k)=>{if(w[k]&&w[k][0]===A)return;let S=a(["undo"],()=>{let C=$.l(m,[...p,[l,A]]),T=C.nodeType==11?C.childNodes:[C];return a.add("undo",()=>T.map(B=>B.remove())),(w[k-1]?.[1].result.at(-1)??g).after(...T),T});w[k]?.[1](),w[k]=[A,S]})}))})}else if(c.getAttribute("#if")){c.before("");let l=c.previousSibling,f=[],m=[],v=g=>{let p=l.nextElementSibling;if(p?.hasAttribute(g))return f.push(`()=>(${p.getAttribute(g)||!0})`),m.push(p.localName=="template"?p.content:p),p.removeAttribute(g),p.remove(),!0};for(v("#if");v("#else-if"););v("#else");let $=new Function(...i,`return[${f}].findIndex(e=>e())`);s.push((g,p,w)=>{let y,A=[];g.x.connected(()=>M(()=>{let k=$.call(null,...w.map(T=>T[1]));if(k==y||(y=k,A.splice(0).map(T=>T.remove()),!m[k]))return;let S=g.l(m[k],w),C=S.nodeType==11?S.childNodes:[S];A.push(...C),p.after(...C)}))})}else{let l=[...c.attributes].map(f=>{if(f.name[0]==":"){let m=f.name.slice(1),v=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),($,g,p)=>$.x.connected(()=>M(()=>{let w=v.call(g,...p.map(y=>y[1]));w==null?g.removeAttribute(m):g.setAttribute(m,w)}))}else if(f.name[0]=="."){let m=f.name.slice(1).split(".").at(-1),v=f.name.slice(1).split(".").map(E),$=new Function(...i,`return(${f.value})`);return c.removeAttribute(f.name),(g,p,w)=>g.x.connected(()=>M(()=>{let y=$.call(p,...w.map(C=>C[1])),A=[...v],k=A.pop(),S=p;A.map(C=>S=S?.[C]),S!=null&&(S instanceof DOMTokenList?S.toggle(m,y):S[k]=y)}))}else if(f.name[0]=="@"){let m=f.name.slice(1),v=new Function(...i,"event",f.value);return c.removeAttribute(f.name),($,g,p)=>$.x.connected(()=>{b(g).does(m).then(w=>a.ignore(()=>{v.call(g,...p.map(y=>y[1]),w)}))})}});s.push((...f)=>{l.map(m=>m?.(...f))})}return s};return{constructor:function(o){o.l=(i,s)=>{let u=t(i,...s.map(f=>f[0])),c=i.cloneNode(!0),l=document.createNodeIterator(c,5);return u.map(f=>{let m=l.nextNode();f?.(o,m,s)}),c}}}});d.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.u=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.l(n.u,[[`{${[...n.x]}}`,r.x]])),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.l(n.u,[[`{${[...n.x]}}`,r.x]]),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});d.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));d.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let o=r.root.mode?r.root:this.getRootNode(),i=o.adoptedStyleSheets;i.includes(t)||(o.adoptedStyleSheets=[...i,t])}}});d.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:a,until:H,Flow:x,live:h,when:b,purify:V,effect:M,frame:z,interval:L,paint:W,timeout:R};Object.defineProperty(self.yozo,"register",{value:P});})();
