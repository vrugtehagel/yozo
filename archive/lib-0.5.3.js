(()=>{var v=class{#e=[];#r=[];#n;#t;constructor(e){f.add("undo",()=>this.stop()),e?.((...t)=>{this.now(...t)})}pipe(e){return this.#e?.push(e),this}now(...e){let t=-1,r=()=>{this.#e&&(t++,!(t<this.#t)&&(this.#n&&(this.#t=t+1),this.#e.length+1==this.#t&&this.stop(),this.#e?.[t]?.(r,...e)))};return r(),this}then(e){return this.pipe((t,...r)=>{e(...r),t()})}await(e){return this.pipe(async(t,...r)=>{await e(...r),t()})}if(e){return this.pipe((t,...r)=>{e(...r)&&t()})}or(e){return e.then((...t)=>this.now(...t)),this.cleanup(()=>e.stop?.())}stop(){return this.#e&&this.#r.splice(0).map(e=>e()),this.#e=null,this}until(e){return typeof e=="function"?this.pipe((t,...r)=>e(...r)?this.stop():t()):(this.cleanup(()=>e.stop?.()),e.then(()=>this.stop()),this)}cleanup(e){return this.#e?this.#r.push(e):e(),this}once(){return this.then(()=>this.#n=!0)}debounce(e){let t;return this.pipe(r=>{clearTimeout(t),t=setTimeout(r,e)}).cleanup(()=>clearTimeout(t))}throttle(e){let t,r;return this.pipe(s=>{if(r)return t=s;s(),r=setInterval(()=>{if(!t){clearTimeout(r),r=0;return}t(),t=null},e)}).cleanup(()=>clearTimeout(r))}after(e){return queueMicrotask(()=>queueMicrotask(e)),this}};var S=n=>n.replace(/-+(\w?)/g,(e,t)=>t.toUpperCase()),T=n=>{let e={constructor:null};for(let t of n)for(let r of Object.keys(t))e[r]??=function(...s){n.map(c=>c[r]?.call(this,...s))};return e};var O=(...n)=>new Proxy({does:(e,t)=>{let r;return new v(s=>{r=s,n.map(c=>c.addEventListener(e,r,t))}).cleanup(()=>n.map(s=>s.removeEventListener(e,r,t)))},observes:(e,t)=>{let r;return new v(s=>{r=new self[S(`-${e}-observer`)](s,t),n.map(c=>r.observe(c,t))}).cleanup(()=>r.disconnect())}},{get:(e,t)=>e[t]??e.does.bind(null,t.replace(/s$/,""))});var k=(n,e=queueMicrotask)=>{let t,r=()=>e(()=>s.now()),s=new v().then(()=>{t?.undo(),t=f(["undo","live"],n),t.live.addEventListener("change",r,{once:!0})}).cleanup(()=>{t?.undo(),t?.live.removeEventListener("change",r,{once:!0})});return r(),s};var w=n=>new N({e:{$:w.get(n)}},"$").t,j=new WeakMap,N=class n{constructor(e,t,r=this){this.r=e,this.i=t,this.p=r,this.a={},this.t=new Proxy(new EventTarget,{get:(s,c)=>c==Symbol.iterator?()=>(f.add("live",this.t,"keychange"),[...this.e].map((i,a)=>this.n(a).t)[c]()):c[0]=="$"?this.n(c.slice(1)).t:s[c]?s[c].bind(s):(f.add("live",this.n(c).t,"deepchange"),this.e?.[c]),set:(s,c,i)=>w.set(this.n(c).t,i),deleteProperty:(s,c,i)=>w.delete(this.n(c).t),has:(s,c)=>(f.add("live",this.t,"keychange"),this.e!=null&&c in this.e||s[c]),ownKeys:()=>(f.add("live",this.t,"keychange"),Object.keys(this.e??{}).map(s=>`$${s}`)),getOwnPropertyDescriptor:()=>({configurable:!0,enumerable:!0}),defineProperty:()=>!1}),j.set(this.t,this),this.e=this.r.e?.[this.i],this.f=this.e instanceof Object?Object.keys(this.e??{}):[]}n(e){return this.a[e]??=new n(this,e,this.p)}c(e,t=new Set){let r=e?.(),s=this.e,c=this.e=this.r.e?.[this.i],i=this.e instanceof Object?Object.keys(this.e??{}):[],a=new Set(this.f);this.f=i;for(let u of i)a.has(u)?a.delete(u):a.add(u);if(a.size&&this.t.dispatchEvent(new CustomEvent("keychange",{detail:{keys:[...a]}})),Object.is(s,c))return r;this.t.dispatchEvent(new CustomEvent("change",{detail:{oldValue:s,value:c}}));let o=this;for(;!t.has(o)&&o.r;)o.c(null,t),t.add(o),o=o.r;for(let u of Object.values(this.a))u.c(null,t);if(e){for(let u of t)u.t.dispatchEvent(new CustomEvent("deepchange"));return r}}};w.get=(n,e)=>{let t=j.get(n);if(!t)return e==null?n:n[e];let r=e==null?t:t.n(e);return f.add("live",r.t,"deepchange"),r.e};w.set=(n,e)=>{let t=j.get(n);return!!t?.c(()=>t.r.e==null?!1:(t.r.e[t.i]=w.get(e),!0))};w.delete=(n,e)=>{let t=j.get(n);return!!t?.c(()=>t.r.e==null?!1:delete t.r.e[t.i])};w.link=(n,e)=>{let t,r=e;self.HTMLElement&&e instanceof HTMLElement?r={get:()=>e.value,set:o=>e.value=o,changes:O(e).input()}:typeof e=="function"&&(r={get:()=>t,changes:k(()=>t=e(),o=>o())});let s=new v;r.changes?.then(()=>s.now());let c,i=o=>{c=!0,w.set(n,o),t=o,c=!1},a=()=>{if(!c){if(!r.set)return i(t);r.set(f.ignore(()=>w.get(n))),i(f.ignore(r.get))}};return n.addEventListener("deepchange",a),i(f.ignore(r.get)),s.then(()=>i(f.ignore(r.get))).cleanup(()=>n.removeEventListener("deepchange",a))};var A,f=(n,e)=>{let t=A;A={};let r={};return n.map(s=>{A[s]=new V[s],r[s]=A[s].result}),r.result=e(),A=t,r},D=n=>A?new Promise(async e=>{let t=A,r=await n;Object.keys(t).some(s=>t[s].until?.())||(queueMicrotask(()=>A=t),e(r),queueMicrotask(()=>A=null))}):n;f.ignore=n=>f([],n).result;f.add=(n,...e)=>{A?.[n]?.add(...e)};f.register=(n,e)=>{V[n]??=e};var V={undo:class{#e=[];result=()=>{this.#e?.map(n=>n()),this.#e=null};add(n){return this.#e?.push(n)??n()}until(){return!this.#e}},live:class{#e=new Map;result=new EventTarget;add(n,e){let t=this.#e.get(n)??[];t.includes(e)||(t.push(e),this.#e.set(n,t),n.addEventListener(e,()=>this.result.dispatchEvent(new CustomEvent("change"))))}}};var R=n=>{let e;return function(...t){return e?.undo(),e=f(["undo"],()=>n.call(this,...t)),e.result}};var I=n=>{let e;return new v(t=>e=setInterval(t,n)).cleanup(()=>clearInterval(e))},W=n=>I(n).once(),P=()=>{let n;return new v(e=>{let t=()=>n=requestAnimationFrame(r=>{t(),e(r)});t()}).cleanup(()=>cancelAnimationFrame(n))},K=()=>{let n=0;return P().if(()=>n++).once()};var b=n=>{let e={x:new Set(["query","$"]),o:new WeakMap,s:class extends HTMLElement{constructor(){super(),e.o.set(this,{x:{}}),f.ignore(()=>r.constructor.call(this,e.o.get(this)))}}},t={};n(Object.fromEntries(q.map(([s,c])=>[c,(...i)=>(t[c]??=[]).push(i)])));let r=T(q.map(([s,c])=>s(e,t[c]??[])));return Object.entries(r).map(([s,c])=>e.s.prototype[s]??=function(...i){return f.ignore(()=>c.call(this,e.o.get(this),...i))}),customElements.define(e.m,e.s),customElements.whenDefined(e.m)},q=[];b.register=(n,e,t)=>{q.push([t,e,n]),q.sort((r,s)=>r[2]-s[2])};var H=new Map,F=n=>(H.get(`${n}`)||H.set(`${n}`,fetch(n).then(async e=>{if(!e.ok)return;let t=document.createElement("template");return t.innerHTML=await e.text(),b(r=>{for(let s of t.content.children)r[s.localName]?.(Object.fromEntries([...s.attributes].map(c=>[S(c.name),c.value])),s.innerHTML)})})),H.get(`${n}`)),U=new Set,z;F.auto=n=>{if(z)return;z=n;let e=r=>{for(let s of r.querySelectorAll(":not(:defined)"))t(s.localName);for(let s of r.querySelectorAll("template"))e(s.content)},t=r=>{if(U.has(r))return;U.add(r);let s=z(r);s&&F(s)};b.register(6,Symbol(),r=>(r.u&&e(r.u),{})),document.readyState=="loading"?document.addEventListener("readystatechange",()=>e(document),{once:!0}):e(document)};b.register(0,"title",(n,[e])=>(n.m=e[1],{}));b.register(1,"meta",(n,e)=>{let t=e.filter(i=>i[0].attribute),r=[...e.filter(i=>i[0].property),...t.filter(i=>i[0].type).map(i=>[{property:i[0].as??S(i[0].attribute)}]),...e.filter(i=>i[0].method).map(i=>[{property:i[0].method,readonly:!0}])];return r.map(([i])=>{let a=function(){return f.ignore(()=>w.get(n.o.get(this).x.$,i.property))};Object.defineProperty(n.s.prototype,i.property,"readonly"in i?{get:a}:{get:a,set:function(o){n.o.get(this).x.$[i.property]=o}})}),n.s.observedAttributes=t.map(i=>i[0].attribute),n.s.formAssociated=e.some(i=>i[0].formAssociated!=null),{constructor:function(i){i.x.$=w({attributes:{}}),t.map(([a])=>{let o=S(a.attribute);if(i.x.$.$attributes[o]=null,i.x.$.$attributes[`$${o}`].addEventListener("change",()=>{let u=w.get(i.x.$.$attributes,o);this.getAttribute(o)!=u&&(u==null?this.removeAttribute(a.attribute):this.setAttribute(a.attribute,u))}),a.type=="boolean")w.link(i.x.$[`$${a.as??o}`],{get:()=>w.get(i.x.$.$attributes,o)!=null,set:u=>i.x.$.$attributes[o]=u?"":null,changes:O(i.x.$.$attributes[`$${o}`]).change()});else if(a.type){let u=self[S(`-${a.type}`)];w.link(i.x.$[`$${a.as??o}`],{get:()=>u(w.get(i.x.$.$attributes,o)??a.default??""),set:l=>i.x.$.$attributes[o]=l==null?null:`${l}`,changes:O(i.x.$.$attributes[`$${o}`]).change()})}}),r.map(([{property:a}])=>{if(!Object.hasOwn(this,a))return;let o=this[a];delete this[a],this[a]=o})},attributeChangedCallback:function(i,a,o,u){i.x.$.$attributes[S(a)]=u}}});b.register(2,"meta",(n,e)=>T([...e,[{hook:"connected",unhook:"disconnected"}],[{hook:"disconnected"}]].map(t=>{let{hook:r,unhook:s}=t[0];if(!r)return{};let c=Symbol(),i=Symbol();n.x.add(r);let a=function(o){o.x[r]=u=>{let l=[new v().then((...m)=>{l[1]?.undo(),l[1]=f(["undo"],()=>u?.(...m))}).cleanup(()=>{l[1]?.undo(),o[c].delete(l)})];return o[c].add(l),o[i]&&queueMicrotask(()=>l[0].now(...o[i])),l[0]},o[c]=new Set};return s?{constructor:a,[`${r}Callback`]:function(o,...u){o[i]=u;for(let l of o[c])l[0].now(...u)},[`${s}Callback`]:function(o,...u){o[i]=null;for(let l of o[c])l[1]?.undo()}}:{constructor:a,[`${r}Callback`]:function(o,...u){o[i]=u;for(let l of o[c])l[0].now(...u)}}})));b.register(3,Symbol(),n=>{let e=new Map,t=(s,...c)=>{if(e.get(s))return e.get(s);let i=[];e.set(s,i);let a=document.createNodeIterator(s,5),o;for(;o=a.nextNode();)if(o.nodeType==3){let u=o.textContent.split(/{{([^]*?)}}/g);o.after(...u),o.remove(),i.push(...u.map((l,m)=>{if(o=a.nextNode(),m%2==0)return;let d=new Function(...c,`return(${l})`);return(M,h,g)=>k(()=>{h.textContent=d(...g.map(p=>p[1]))})}))}else if(o.getAttribute("#for")){let[u,l]=o.getAttribute("#for").split(" of ");o.before(""),o.removeAttribute("#for"),o.remove();let m=o.localName=="template"?o.content:o,d=new Function(...c,`return(${l})`);i.push((M,h,g)=>{let p=[];f.add("undo",()=>p.splice(0).map(x=>x[1].undo())),k(()=>{let x=[...d(...g.map(y=>y[1]))];for(;p.length>x.length;)p.pop()[1].undo();x.map((y,$)=>{p[$]&&p[$][0]===y||(p[$]?.[1].undo(),p[$]=[y,f(["undo"],()=>{let E=M.l(m,[...g,[u,y]]),C=E.nodeType==11?[...E.childNodes]:[E];return f.add("undo",()=>C.map(L=>L.remove())),(p[$-1]?.[1].result.at(-1)??h).after(...C),C})])})})})}else if(o.getAttribute("#if")){o.before("");let u=o.previousSibling,l=[],m=[],d=h=>{let g=u.nextElementSibling;if(g?.hasAttribute(h)){for(;u.nextSibling!=g;)u.nextSibling.remove();return l.push(`()=>(${g.getAttribute(h)||!0})`),m.push(g.localName=="template"?g.content:g),g.removeAttribute(h),g.remove(),!0}};for(d("#if");d("#else-if"););d("#else");let M=new Function(...c,`return[${l}].findIndex(e=>e())`);i.push((h,g,p)=>{let x,y,$=[];f.add("undo",()=>x?.undo()),k(()=>{let E=M(...p.map(C=>C[1]));E!=y&&(x?.undo(),y=E,m[E]&&(x=f(["undo"],()=>{let C=h.l(m[E],p),L=C.nodeType==11?C.childNodes:[C];f.add("undo",()=>$.splice(0).map(B=>B.remove())),$.push(...L),g.after(...L)})))})})}else{let u=[...o.attributes].map(l=>{if(l.name[0]==":"){let m=l.name.slice(1),d=new Function(...c,`return(${l.value})`);return o.removeAttribute(l.name),(M,h,g)=>k(()=>{let p=d.call(h,...g.map(x=>x[1]));m.slice(0,6)=="class+"?h.classList.toggle(m.slice(6),p??""):p==null?h.removeAttribute(m):h.setAttribute(m,p)})}else if(l.name[0]=="."){let m=l.name.slice(1).split(".").map(S),d=new Function(...c,`return(${l.value})`);return o.removeAttribute(l.name),(M,h,g)=>k(()=>{let p=d.call(h,...g.map(E=>E[1])),x=[...m],y=x.pop(),$=h;x.map(E=>$=$?.[E]),$!=null&&($[y]=p)})}else if(l.name[0]=="@"){let m=l.name.slice(1),d=new Function(...c,"event",l.value);return o.removeAttribute(l.name),(M,h,g)=>{let p=x=>f.ignore(()=>d.call(h,...g.map(y=>y[1]),x));h.addEventListener(m,p),f.add("undo",()=>h.removeEventListener(m,p))}}});i.push((...l)=>{u.map(m=>m?.(...l))})}return i};return{constructor:function(s){s.l=(c,i,a=o=>o())=>{let o=t(c,...i.map(d=>d[0])),u=c.cloneNode(!0),l=document.createNodeIterator(u,5),m=o.map(d=>[l.nextNode(),d]).filter(([d,M])=>M);return a(()=>{m.map(d=>d[1](s,d[0],i))}),u}}}});b.register(5,"template",(n,[e])=>{if(!e)return{constructor:function(r){r.root=this}};let t=document.createElement("template");return t.innerHTML=e[1],n.u=t.content,e[0].mode?{constructor:function(r){r.root=this.attachShadow(e[0]),r.root.append(r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected)),customElements.upgrade(r.root)}}:{constructor:function(r){r.root=r.l(n.u,[[`{${[...n.x]}}`,r.x]],r.x.connected),customElements.upgrade(r.root)},connectedCallback:function(r){r.root!=this&&(this.replaceChildren(r.root),r.root=this)}}});b.register(7,Symbol(),n=>({constructor:function(t){t.x.query=r=>t.root.querySelector(r),t.x.query.all=r=>[...t.root.querySelectorAll(r)]}}));b.register(8,"style",(n,[e])=>{if(!e)return{};let t=new CSSStyleSheet;return t.replace(e[1]),{connectedCallback:function(r){let s=r.root.mode?r.root:this.getRootNode(),c=s.adoptedStyleSheets;c.includes(t)||(s.adoptedStyleSheets=[...c,t])}}});b.register(10,"script",(n,[e])=>{if(!e)return{};let t=new Function(`{${[...n.x]}}`,`const{${Object.keys(self.yozo)}}=self.yozo;${e[1]}`);return{constructor:function(r){t.call(this,r.x)}}});self.yozo={monitor:f,until:D,Flow:v,live:w,when:O,purify:R,effect:k,frame:P,interval:I,paint:K,timeout:W};Object.defineProperty(self.yozo,"register",{value:F});})();
