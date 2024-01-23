import{r as g,R as Ke}from"./react-8db41b9c.js";import{r as it}from"./react-dom-44ec3eea.js";const W=Math.min,$=Math.max,fe=Math.round,ie=Math.floor,U=e=>({x:e,y:e}),st={left:"right",right:"left",bottom:"top",top:"bottom"},ct={start:"end",end:"start"};function ve(e,t,n){return $(e,W(t,n))}function j(e,t){return typeof e=="function"?e(t):e}function _(e){return e.split("-")[0]}function oe(e){return e.split("-")[1]}function be(e){return e==="x"?"y":"x"}function Ee(e){return e==="y"?"height":"width"}function Z(e){return["top","bottom"].includes(_(e))?"y":"x"}function Ce(e){return be(Z(e))}function lt(e,t,n){n===void 0&&(n=!1);const o=oe(e),r=Ce(e),i=Ee(r);let s=r==="x"?o===(n?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(s=ae(s)),[s,ae(s)]}function ut(e){const t=ae(e);return[xe(e),t,xe(t)]}function xe(e){return e.replace(/start|end/g,t=>ct[t])}function ft(e,t,n){const o=["left","right"],r=["right","left"],i=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return n?t?r:o:t?o:r;case"left":case"right":return t?i:s;default:return[]}}function at(e,t,n,o){const r=oe(e);let i=ft(_(e),n==="start",o);return r&&(i=i.map(s=>s+"-"+r),t&&(i=i.concat(i.map(xe)))),i}function ae(e){return e.replace(/left|right|bottom|top/g,t=>st[t])}function dt(e){return{top:0,right:0,bottom:0,left:0,...e}}function Ae(e){return typeof e!="number"?dt(e):{top:e,right:e,bottom:e,left:e}}function te(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function ke(e,t,n){let{reference:o,floating:r}=e;const i=Z(t),s=Ce(t),l=Ee(s),c=_(t),u=i==="y",p=o.x+o.width/2-r.width/2,a=o.y+o.height/2-r.height/2,h=o[l]/2-r[l]/2;let f;switch(c){case"top":f={x:p,y:o.y-r.height};break;case"bottom":f={x:p,y:o.y+o.height};break;case"right":f={x:o.x+o.width,y:a};break;case"left":f={x:o.x-r.width,y:a};break;default:f={x:o.x,y:o.y}}switch(oe(t)){case"start":f[s]-=h*(n&&u?-1:1);break;case"end":f[s]+=h*(n&&u?-1:1);break}return f}const mt=async(e,t,n)=>{const{placement:o="bottom",strategy:r="absolute",middleware:i=[],platform:s}=n,l=i.filter(Boolean),c=await(s.isRTL==null?void 0:s.isRTL(t));let u=await s.getElementRects({reference:e,floating:t,strategy:r}),{x:p,y:a}=ke(u,o,c),h=o,f={},d=0;for(let m=0;m<l.length;m++){const{name:R,fn:w}=l[m],{x:b,y:E,data:y,reset:x}=await w({x:p,y:a,initialPlacement:o,placement:h,strategy:r,middlewareData:f,rects:u,platform:s,elements:{reference:e,floating:t}});if(p=b??p,a=E??a,f={...f,[R]:{...f[R],...y}},x&&d<=50){d++,typeof x=="object"&&(x.placement&&(h=x.placement),x.rects&&(u=x.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:r}):x.rects),{x:p,y:a}=ke(u,h,c)),m=-1;continue}}return{x:p,y:a,placement:h,strategy:r,middlewareData:f}};async function Pe(e,t){var n;t===void 0&&(t={});const{x:o,y:r,platform:i,rects:s,elements:l,strategy:c}=e,{boundary:u="clippingAncestors",rootBoundary:p="viewport",elementContext:a="floating",altBoundary:h=!1,padding:f=0}=j(t,e),d=Ae(f),R=l[h?a==="floating"?"reference":"floating":a],w=te(await i.getClippingRect({element:(n=await(i.isElement==null?void 0:i.isElement(R)))==null||n?R:R.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(l.floating)),boundary:u,rootBoundary:p,strategy:c})),b=a==="floating"?{...s.floating,x:o,y:r}:s.reference,E=await(i.getOffsetParent==null?void 0:i.getOffsetParent(l.floating)),y=await(i.isElement==null?void 0:i.isElement(E))?await(i.getScale==null?void 0:i.getScale(E))||{x:1,y:1}:{x:1,y:1},x=te(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({rect:b,offsetParent:E,strategy:c}):b);return{top:(w.top-x.top+d.top)/y.y,bottom:(x.bottom-w.bottom+d.bottom)/y.y,left:(w.left-x.left+d.left)/y.x,right:(x.right-w.right+d.right)/y.x}}const gt=e=>({name:"arrow",options:e,async fn(t){const{x:n,y:o,placement:r,rects:i,platform:s,elements:l,middlewareData:c}=t,{element:u,padding:p=0}=j(e,t)||{};if(u==null)return{};const a=Ae(p),h={x:n,y:o},f=Ce(r),d=Ee(f),m=await s.getDimensions(u),R=f==="y",w=R?"top":"left",b=R?"bottom":"right",E=R?"clientHeight":"clientWidth",y=i.reference[d]+i.reference[f]-h[f]-i.floating[d],x=h[f]-i.reference[f],T=await(s.getOffsetParent==null?void 0:s.getOffsetParent(u));let S=T?T[E]:0;(!S||!await(s.isElement==null?void 0:s.isElement(T)))&&(S=l.floating[E]||i.floating[d]);const F=y/2-x/2,I=S/2-m[d]/2-1,k=W(a[w],I),O=W(a[b],I),M=k,P=S-m[d]-O,v=S/2-m[d]/2+F,C=ve(M,v,P),A=!c.arrow&&oe(r)!=null&&v!=C&&i.reference[d]/2-(v<M?k:O)-m[d]/2<0,D=A?v<M?v-M:v-P:0;return{[f]:h[f]+D,data:{[f]:C,centerOffset:v-C-D,...A&&{alignmentOffset:D}},reset:A}}}),pt=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:r,middlewareData:i,rects:s,initialPlacement:l,platform:c,elements:u}=t,{mainAxis:p=!0,crossAxis:a=!0,fallbackPlacements:h,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:m=!0,...R}=j(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};const w=_(r),b=_(l)===l,E=await(c.isRTL==null?void 0:c.isRTL(u.floating)),y=h||(b||!m?[ae(l)]:ut(l));!h&&d!=="none"&&y.push(...at(l,m,d,E));const x=[l,...y],T=await Pe(t,R),S=[];let F=((o=i.flip)==null?void 0:o.overflows)||[];if(p&&S.push(T[w]),a){const M=lt(r,s,E);S.push(T[M[0]],T[M[1]])}if(F=[...F,{placement:r,overflows:S}],!S.every(M=>M<=0)){var I,k;const M=(((I=i.flip)==null?void 0:I.index)||0)+1,P=x[M];if(P)return{data:{index:M,overflows:F},reset:{placement:P}};let v=(k=F.filter(C=>C.overflows[0]<=0).sort((C,A)=>C.overflows[1]-A.overflows[1])[0])==null?void 0:k.placement;if(!v)switch(f){case"bestFit":{var O;const C=(O=F.map(A=>[A.placement,A.overflows.filter(D=>D>0).reduce((D,L)=>D+L,0)]).sort((A,D)=>A[1]-D[1])[0])==null?void 0:O[0];C&&(v=C);break}case"initialPlacement":v=l;break}if(r!==v)return{reset:{placement:v}}}return{}}}};function ze(e){const t=W(...e.map(i=>i.left)),n=W(...e.map(i=>i.top)),o=$(...e.map(i=>i.right)),r=$(...e.map(i=>i.bottom));return{x:t,y:n,width:o-t,height:r-n}}function ht(e){const t=e.slice().sort((r,i)=>r.y-i.y),n=[];let o=null;for(let r=0;r<t.length;r++){const i=t[r];!o||i.y-o.y>o.height/2?n.push([i]):n[n.length-1].push(i),o=i}return n.map(r=>te(ze(r)))}const yt=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:n,elements:o,rects:r,platform:i,strategy:s}=t,{padding:l=2,x:c,y:u}=j(e,t),p=Array.from(await(i.getClientRects==null?void 0:i.getClientRects(o.reference))||[]),a=ht(p),h=te(ze(p)),f=Ae(l);function d(){if(a.length===2&&a[0].left>a[1].right&&c!=null&&u!=null)return a.find(R=>c>R.left-f.left&&c<R.right+f.right&&u>R.top-f.top&&u<R.bottom+f.bottom)||h;if(a.length>=2){if(Z(n)==="y"){const k=a[0],O=a[a.length-1],M=_(n)==="top",P=k.top,v=O.bottom,C=M?k.left:O.left,A=M?k.right:O.right,D=A-C,L=v-P;return{top:P,bottom:v,left:C,right:A,width:D,height:L,x:C,y:P}}const R=_(n)==="left",w=$(...a.map(k=>k.right)),b=W(...a.map(k=>k.left)),E=a.filter(k=>R?k.left===b:k.right===w),y=E[0].top,x=E[E.length-1].bottom,T=b,S=w,F=S-T,I=x-y;return{top:y,bottom:x,left:T,right:S,width:F,height:I,x:T,y}}return h}const m=await i.getElementRects({reference:{getBoundingClientRect:d},floating:o.floating,strategy:s});return r.reference.x!==m.reference.x||r.reference.y!==m.reference.y||r.reference.width!==m.reference.width||r.reference.height!==m.reference.height?{reset:{rects:m}}:{}}}};async function wt(e,t){const{placement:n,platform:o,elements:r}=e,i=await(o.isRTL==null?void 0:o.isRTL(r.floating)),s=_(n),l=oe(n),c=Z(n)==="y",u=["left","top"].includes(s)?-1:1,p=i&&c?-1:1,a=j(t,e);let{mainAxis:h,crossAxis:f,alignmentAxis:d}=typeof a=="number"?{mainAxis:a,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...a};return l&&typeof d=="number"&&(f=l==="end"?d*-1:d),c?{x:f*p,y:h*u}:{x:h*u,y:f*p}}const fn=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var n,o;const{x:r,y:i,placement:s,middlewareData:l}=t,c=await wt(t,e);return s===((n=l.offset)==null?void 0:n.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:r+c.x,y:i+c.y,data:{...c,placement:s}}}}},vt=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:r}=t,{mainAxis:i=!0,crossAxis:s=!1,limiter:l={fn:R=>{let{x:w,y:b}=R;return{x:w,y:b}}},...c}=j(e,t),u={x:n,y:o},p=await Pe(t,c),a=Z(_(r)),h=be(a);let f=u[h],d=u[a];if(i){const R=h==="y"?"top":"left",w=h==="y"?"bottom":"right",b=f+p[R],E=f-p[w];f=ve(b,f,E)}if(s){const R=a==="y"?"top":"left",w=a==="y"?"bottom":"right",b=d+p[R],E=d-p[w];d=ve(b,d,E)}const m=l.fn({...t,[h]:f,[a]:d});return{...m,data:{x:m.x-n,y:m.y-o}}}}},xt=function(e){return e===void 0&&(e={}),{options:e,fn(t){const{x:n,y:o,placement:r,rects:i,middlewareData:s}=t,{offset:l=0,mainAxis:c=!0,crossAxis:u=!0}=j(e,t),p={x:n,y:o},a=Z(r),h=be(a);let f=p[h],d=p[a];const m=j(l,t),R=typeof m=="number"?{mainAxis:m,crossAxis:0}:{mainAxis:0,crossAxis:0,...m};if(c){const E=h==="y"?"height":"width",y=i.reference[h]-i.floating[E]+R.mainAxis,x=i.reference[h]+i.reference[E]-R.mainAxis;f<y?f=y:f>x&&(f=x)}if(u){var w,b;const E=h==="y"?"width":"height",y=["top","left"].includes(_(r)),x=i.reference[a]-i.floating[E]+(y&&((w=s.offset)==null?void 0:w[a])||0)+(y?0:R.crossAxis),T=i.reference[a]+i.reference[E]+(y?0:((b=s.offset)==null?void 0:b[a])||0)-(y?R.crossAxis:0);d<x?d=x:d>T&&(d=T)}return{[h]:f,[a]:d}}}},Rt=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){const{placement:n,rects:o,platform:r,elements:i}=t,{apply:s=()=>{},...l}=j(e,t),c=await Pe(t,l),u=_(n),p=oe(n),a=Z(n)==="y",{width:h,height:f}=o.floating;let d,m;u==="top"||u==="bottom"?(d=u,m=p===(await(r.isRTL==null?void 0:r.isRTL(i.floating))?"start":"end")?"left":"right"):(m=u,d=p==="end"?"top":"bottom");const R=f-c[d],w=h-c[m],b=!t.middlewareData.shift;let E=R,y=w;if(a){const T=h-c.left-c.right;y=p||b?W(w,T):T}else{const T=f-c.top-c.bottom;E=p||b?W(R,T):T}if(b&&!p){const T=$(c.left,0),S=$(c.right,0),F=$(c.top,0),I=$(c.bottom,0);a?y=h-2*(T!==0||S!==0?T+S:$(c.left,c.right)):E=f-2*(F!==0||I!==0?F+I:$(c.top,c.bottom))}await s({...t,availableWidth:y,availableHeight:E});const x=await r.getDimensions(i.floating);return h!==x.width||f!==x.height?{reset:{rects:!0}}:{}}}};function J(e){return je(e)?(e.nodeName||"").toLowerCase():"#document"}function B(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Y(e){var t;return(t=(je(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function je(e){return e instanceof Node||e instanceof B(e).Node}function X(e){return e instanceof Element||e instanceof B(e).Element}function N(e){return e instanceof HTMLElement||e instanceof B(e).HTMLElement}function Ie(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof B(e).ShadowRoot}function re(e){const{overflow:t,overflowX:n,overflowY:o,display:r}=H(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!["inline","contents"].includes(r)}function bt(e){return["table","td","th"].includes(J(e))}function Te(e){const t=Oe(),n=H(e);return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!t&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!t&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(n.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(n.contain||"").includes(o))}function Et(e){let t=ne(e);for(;N(t)&&!me(t);){if(Te(t))return t;t=ne(t)}return null}function Oe(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function me(e){return["html","body","#document"].includes(J(e))}function H(e){return B(e).getComputedStyle(e)}function ge(e){return X(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function ne(e){if(J(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Ie(e)&&e.host||Y(e);return Ie(t)?t.host:t}function Xe(e){const t=ne(e);return me(t)?e.ownerDocument?e.ownerDocument.body:e.body:N(t)&&re(t)?t:Xe(t)}function q(e,t,n){var o;t===void 0&&(t=[]),n===void 0&&(n=!0);const r=Xe(e),i=r===((o=e.ownerDocument)==null?void 0:o.body),s=B(r);return i?t.concat(s,s.visualViewport||[],re(r)?r:[],s.frameElement&&n?q(s.frameElement):[]):t.concat(r,q(r,[],n))}function Ye(e){const t=H(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const r=N(e),i=r?e.offsetWidth:n,s=r?e.offsetHeight:o,l=fe(n)!==i||fe(o)!==s;return l&&(n=i,o=s),{width:n,height:o,$:l}}function Le(e){return X(e)?e:e.contextElement}function ee(e){const t=Le(e);if(!N(t))return U(1);const n=t.getBoundingClientRect(),{width:o,height:r,$:i}=Ye(t);let s=(i?fe(n.width):n.width)/o,l=(i?fe(n.height):n.height)/r;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const Ct=U(0);function Ge(e){const t=B(e);return!Oe()||!t.visualViewport?Ct:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function At(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==B(e)?!1:t}function Q(e,t,n,o){t===void 0&&(t=!1),n===void 0&&(n=!1);const r=e.getBoundingClientRect(),i=Le(e);let s=U(1);t&&(o?X(o)&&(s=ee(o)):s=ee(e));const l=At(i,n,o)?Ge(i):U(0);let c=(r.left+l.x)/s.x,u=(r.top+l.y)/s.y,p=r.width/s.x,a=r.height/s.y;if(i){const h=B(i),f=o&&X(o)?B(o):o;let d=h.frameElement;for(;d&&o&&f!==h;){const m=ee(d),R=d.getBoundingClientRect(),w=H(d),b=R.left+(d.clientLeft+parseFloat(w.paddingLeft))*m.x,E=R.top+(d.clientTop+parseFloat(w.paddingTop))*m.y;c*=m.x,u*=m.y,p*=m.x,a*=m.y,c+=b,u+=E,d=B(d).frameElement}}return te({width:p,height:a,x:c,y:u})}function Pt(e){let{rect:t,offsetParent:n,strategy:o}=e;const r=N(n),i=Y(n);if(n===i)return t;let s={scrollLeft:0,scrollTop:0},l=U(1);const c=U(0);if((r||!r&&o!=="fixed")&&((J(n)!=="body"||re(i))&&(s=ge(n)),N(n))){const u=Q(n);l=ee(n),c.x=u.x+n.clientLeft,c.y=u.y+n.clientTop}return{width:t.width*l.x,height:t.height*l.y,x:t.x*l.x-s.scrollLeft*l.x+c.x,y:t.y*l.y-s.scrollTop*l.y+c.y}}function Tt(e){return Array.from(e.getClientRects())}function qe(e){return Q(Y(e)).left+ge(e).scrollLeft}function Ot(e){const t=Y(e),n=ge(e),o=e.ownerDocument.body,r=$(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),i=$(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let s=-n.scrollLeft+qe(e);const l=-n.scrollTop;return H(o).direction==="rtl"&&(s+=$(t.clientWidth,o.clientWidth)-r),{width:r,height:i,x:s,y:l}}function Lt(e,t){const n=B(e),o=Y(e),r=n.visualViewport;let i=o.clientWidth,s=o.clientHeight,l=0,c=0;if(r){i=r.width,s=r.height;const u=Oe();(!u||u&&t==="fixed")&&(l=r.offsetLeft,c=r.offsetTop)}return{width:i,height:s,x:l,y:c}}function Mt(e,t){const n=Q(e,!0,t==="fixed"),o=n.top+e.clientTop,r=n.left+e.clientLeft,i=N(e)?ee(e):U(1),s=e.clientWidth*i.x,l=e.clientHeight*i.y,c=r*i.x,u=o*i.y;return{width:s,height:l,x:c,y:u}}function Fe(e,t,n){let o;if(t==="viewport")o=Lt(e,n);else if(t==="document")o=Ot(Y(e));else if(X(t))o=Mt(t,n);else{const r=Ge(e);o={...t,x:t.x-r.x,y:t.y-r.y}}return te(o)}function Ue(e,t){const n=ne(e);return n===t||!X(n)||me(n)?!1:H(n).position==="fixed"||Ue(n,t)}function Dt(e,t){const n=t.get(e);if(n)return n;let o=q(e,[],!1).filter(l=>X(l)&&J(l)!=="body"),r=null;const i=H(e).position==="fixed";let s=i?ne(e):e;for(;X(s)&&!me(s);){const l=H(s),c=Te(s);!c&&l.position==="fixed"&&(r=null),(i?!c&&!r:!c&&l.position==="static"&&!!r&&["absolute","fixed"].includes(r.position)||re(s)&&!c&&Ue(e,s))?o=o.filter(p=>p!==s):r=l,s=ne(s)}return t.set(e,o),o}function St(e){let{element:t,boundary:n,rootBoundary:o,strategy:r}=e;const s=[...n==="clippingAncestors"?Dt(t,this._c):[].concat(n),o],l=s[0],c=s.reduce((u,p)=>{const a=Fe(t,p,r);return u.top=$(a.top,u.top),u.right=W(a.right,u.right),u.bottom=W(a.bottom,u.bottom),u.left=$(a.left,u.left),u},Fe(t,l,r));return{width:c.right-c.left,height:c.bottom-c.top,x:c.left,y:c.top}}function kt(e){const{width:t,height:n}=Ye(e);return{width:t,height:n}}function It(e,t,n){const o=N(t),r=Y(t),i=n==="fixed",s=Q(e,!0,i,t);let l={scrollLeft:0,scrollTop:0};const c=U(0);if(o||!o&&!i)if((J(t)!=="body"||re(r))&&(l=ge(t)),o){const u=Q(t,!0,i,t);c.x=u.x+t.clientLeft,c.y=u.y+t.clientTop}else r&&(c.x=qe(r));return{x:s.left+l.scrollLeft-c.x,y:s.top+l.scrollTop-c.y,width:s.width,height:s.height}}function $e(e,t){return!N(e)||H(e).position==="fixed"?null:t?t(e):e.offsetParent}function Je(e,t){const n=B(e);if(!N(e))return n;let o=$e(e,t);for(;o&&bt(o)&&H(o).position==="static";)o=$e(o,t);return o&&(J(o)==="html"||J(o)==="body"&&H(o).position==="static"&&!Te(o))?n:o||Et(e)||n}const Ft=async function(e){let{reference:t,floating:n,strategy:o}=e;const r=this.getOffsetParent||Je,i=this.getDimensions;return{reference:It(t,await r(n),o),floating:{x:0,y:0,...await i(n)}}};function $t(e){return H(e).direction==="rtl"}const Bt={convertOffsetParentRelativeRectToViewportRelativeRect:Pt,getDocumentElement:Y,getClippingRect:St,getOffsetParent:Je,getElementRects:Ft,getClientRects:Tt,getDimensions:kt,getScale:ee,isElement:X,isRTL:$t};function Ht(e,t){let n=null,o;const r=Y(e);function i(){clearTimeout(o),n&&n.disconnect(),n=null}function s(l,c){l===void 0&&(l=!1),c===void 0&&(c=1),i();const{left:u,top:p,width:a,height:h}=e.getBoundingClientRect();if(l||t(),!a||!h)return;const f=ie(p),d=ie(r.clientWidth-(u+a)),m=ie(r.clientHeight-(p+h)),R=ie(u),b={rootMargin:-f+"px "+-d+"px "+-m+"px "+-R+"px",threshold:$(0,W(1,c))||1};let E=!0;function y(x){const T=x[0].intersectionRatio;if(T!==c){if(!E)return s();T?s(!1,T):o=setTimeout(()=>{s(!1,1e-7)},100)}E=!1}try{n=new IntersectionObserver(y,{...b,root:r.ownerDocument})}catch{n=new IntersectionObserver(y,b)}n.observe(e)}return s(!0),i}function an(e,t,n,o){o===void 0&&(o={});const{ancestorScroll:r=!0,ancestorResize:i=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:c=!1}=o,u=Le(e),p=r||i?[...u?q(u):[],...q(t)]:[];p.forEach(w=>{r&&w.addEventListener("scroll",n,{passive:!0}),i&&w.addEventListener("resize",n)});const a=u&&l?Ht(u,n):null;let h=-1,f=null;s&&(f=new ResizeObserver(w=>{let[b]=w;b&&b.target===u&&f&&(f.unobserve(t),cancelAnimationFrame(h),h=requestAnimationFrame(()=>{f&&f.observe(t)})),n()}),u&&!c&&f.observe(u),f.observe(t));let d,m=c?Q(e):null;c&&R();function R(){const w=Q(e);m&&(w.x!==m.x||w.y!==m.y||w.width!==m.width||w.height!==m.height)&&n(),m=w,d=requestAnimationFrame(R)}return n(),()=>{p.forEach(w=>{r&&w.removeEventListener("scroll",n),i&&w.removeEventListener("resize",n)}),a&&a(),f&&f.disconnect(),f=null,c&&cancelAnimationFrame(d)}}const dn=vt,mn=pt,gn=Rt,Be=gt,pn=yt,hn=xt,Wt=(e,t,n)=>{const o=new Map,r={platform:Bt,...n},i={...r.platform,_c:o};return mt(e,t,{...r,platform:i})},yn=e=>{function t(n){return{}.hasOwnProperty.call(n,"current")}return{name:"arrow",options:e,fn(n){const{element:o,padding:r}=typeof e=="function"?e(n):e;return o&&t(o)?o.current!=null?Be({element:o.current,padding:r}).fn(n):{}:o?Be({element:o,padding:r}).fn(n):{}}}};var se=typeof document<"u"?g.useLayoutEffect:g.useEffect;function de(e,t){if(e===t)return!0;if(typeof e!=typeof t)return!1;if(typeof e=="function"&&e.toString()===t.toString())return!0;let n,o,r;if(e&&t&&typeof e=="object"){if(Array.isArray(e)){if(n=e.length,n!=t.length)return!1;for(o=n;o--!==0;)if(!de(e[o],t[o]))return!1;return!0}if(r=Object.keys(e),n=r.length,n!==Object.keys(t).length)return!1;for(o=n;o--!==0;)if(!{}.hasOwnProperty.call(t,r[o]))return!1;for(o=n;o--!==0;){const i=r[o];if(!(i==="_owner"&&e.$$typeof)&&!de(e[i],t[i]))return!1}return!0}return e!==e&&t!==t}function Qe(e){return typeof window>"u"?1:(e.ownerDocument.defaultView||window).devicePixelRatio||1}function He(e,t){const n=Qe(e);return Math.round(t*n)/n}function We(e){const t=g.useRef(e);return se(()=>{t.current=e}),t}function _t(e){e===void 0&&(e={});const{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:r,elements:{reference:i,floating:s}={},transform:l=!0,whileElementsMounted:c,open:u}=e,[p,a]=g.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:!1}),[h,f]=g.useState(o);de(h,o)||f(o);const[d,m]=g.useState(null),[R,w]=g.useState(null),b=g.useCallback(A=>{A!=T.current&&(T.current=A,m(A))},[m]),E=g.useCallback(A=>{A!==S.current&&(S.current=A,w(A))},[w]),y=i||d,x=s||R,T=g.useRef(null),S=g.useRef(null),F=g.useRef(p),I=We(c),k=We(r),O=g.useCallback(()=>{if(!T.current||!S.current)return;const A={placement:t,strategy:n,middleware:h};k.current&&(A.platform=k.current),Wt(T.current,S.current,A).then(D=>{const L={...D,isPositioned:!0};M.current&&!de(F.current,L)&&(F.current=L,it.flushSync(()=>{a(L)}))})},[h,t,n,k]);se(()=>{u===!1&&F.current.isPositioned&&(F.current.isPositioned=!1,a(A=>({...A,isPositioned:!1})))},[u]);const M=g.useRef(!1);se(()=>(M.current=!0,()=>{M.current=!1}),[]),se(()=>{if(y&&(T.current=y),x&&(S.current=x),y&&x){if(I.current)return I.current(y,x,O);O()}},[y,x,O,I]);const P=g.useMemo(()=>({reference:T,floating:S,setReference:b,setFloating:E}),[b,E]),v=g.useMemo(()=>({reference:y,floating:x}),[y,x]),C=g.useMemo(()=>{const A={position:n,left:0,top:0};if(!v.floating)return A;const D=He(v.floating,p.x),L=He(v.floating,p.y);return l?{...A,transform:"translate("+D+"px, "+L+"px)",...Qe(v.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:D,top:L}},[n,l,v.floating,p.x,p.y]);return g.useMemo(()=>({...p,update:O,refs:P,elements:v,floatingStyles:C}),[p,O,P,v,C])}var z=typeof document<"u"?g.useLayoutEffect:g.useEffect;let he=!1,Vt=0;const _e=()=>"floating-ui-"+Vt++;function Nt(){const[e,t]=g.useState(()=>he?_e():void 0);return z(()=>{e==null&&t(_e())},[]),g.useEffect(()=>{he||(he=!0)},[]),e}const Kt=Ke["useId".toString()],Ze=Kt||Nt;function zt(){const e=new Map;return{emit(t,n){var o;(o=e.get(t))==null||o.forEach(r=>r(n))},on(t,n){e.set(t,[...e.get(t)||[],n])},off(t,n){var o;e.set(t,((o=e.get(t))==null?void 0:o.filter(r=>r!==n))||[])}}}const jt=g.createContext(null),Xt=g.createContext(null),et=()=>{var e;return((e=g.useContext(jt))==null?void 0:e.id)||null},Me=()=>g.useContext(Xt);function G(e){return(e==null?void 0:e.ownerDocument)||document}function Yt(){const e=navigator.userAgentData;return e!=null&&e.platform?e.platform:navigator.platform}function Gt(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(t=>{let{brand:n,version:o}=t;return n+"/"+o}).join(" "):navigator.userAgent}function pe(e){return G(e).defaultView||window}function V(e){return e?e instanceof Element||e instanceof pe(e).Element:!1}function tt(e){return e?e instanceof HTMLElement||e instanceof pe(e).HTMLElement:!1}function qt(e){if(typeof ShadowRoot>"u")return!1;const t=pe(e).ShadowRoot;return e instanceof t||e instanceof ShadowRoot}function Ut(e){if(e.mozInputSource===0&&e.isTrusted)return!0;const t=/Android/i;return(t.test(Yt())||t.test(Gt()))&&e.pointerType?e.type==="click"&&e.buttons===1:e.detail===0&&!e.pointerType}function Jt(e){return e.width===0&&e.height===0||e.width===1&&e.height===1&&e.pressure===0&&e.detail===0&&e.pointerType!=="mouse"||e.width<1&&e.height<1&&e.pressure===0&&e.detail===0}function nt(e,t){const n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function Qt(e){return"nativeEvent"in e}function Re(e,t){if(!e||!t)return!1;const n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&qt(n)){let o=t;for(;o;){if(e===o)return!0;o=o.parentNode||o.host}}return!1}function ot(e){return"data-floating-ui-"+e}function Ve(e){const t=g.useRef(e);return z(()=>{t.current=e}),t}const Ne=ot("safe-polygon");function ce(e,t,n){return n&&!nt(n)?0:typeof e=="number"?e:e==null?void 0:e[t]}function wn(e,t){t===void 0&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:i,elements:{domReference:s,floating:l},refs:c}=e,{enabled:u=!0,delay:p=0,handleClose:a=null,mouseOnly:h=!1,restMs:f=0,move:d=!0}=t,m=Me(),R=et(),w=Ve(a),b=Ve(p),E=g.useRef(),y=g.useRef(),x=g.useRef(),T=g.useRef(),S=g.useRef(!0),F=g.useRef(!1),I=g.useRef(()=>{}),k=g.useCallback(()=>{var v;const C=(v=r.current.openEvent)==null?void 0:v.type;return(C==null?void 0:C.includes("mouse"))&&C!=="mousedown"},[r]);g.useEffect(()=>{if(!u)return;function v(){clearTimeout(y.current),clearTimeout(T.current),S.current=!0}return i.on("dismiss",v),()=>{i.off("dismiss",v)}},[u,i]),g.useEffect(()=>{if(!u||!w.current||!n)return;function v(A){k()&&o(!1,A)}const C=G(l).documentElement;return C.addEventListener("mouseleave",v),()=>{C.removeEventListener("mouseleave",v)}},[l,n,o,u,w,r,k]);const O=g.useCallback(function(v,C){C===void 0&&(C=!0);const A=ce(b.current,"close",E.current);A&&!x.current?(clearTimeout(y.current),y.current=setTimeout(()=>o(!1,v),A)):C&&(clearTimeout(y.current),o(!1,v))},[b,o]),M=g.useCallback(()=>{I.current(),x.current=void 0},[]),P=g.useCallback(()=>{if(F.current){const v=G(c.floating.current).body;v.style.pointerEvents="",v.removeAttribute(Ne),F.current=!1}},[c]);return g.useEffect(()=>{if(!u)return;function v(){return r.current.openEvent?["click","mousedown"].includes(r.current.openEvent.type):!1}function C(L){if(clearTimeout(y.current),S.current=!1,h&&!nt(E.current)||f>0&&ce(b.current,"open")===0)return;const K=ce(b.current,"open",E.current);K?y.current=setTimeout(()=>{o(!0,L)},K):o(!0,L)}function A(L){if(v())return;I.current();const K=G(l);if(clearTimeout(T.current),w.current){n||clearTimeout(y.current),x.current=w.current({...e,tree:m,x:L.clientX,y:L.clientY,onClose(){P(),M(),O(L)}});const Se=x.current;K.addEventListener("mousemove",Se),I.current=()=>{K.removeEventListener("mousemove",Se)};return}(E.current==="touch"?!Re(l,L.relatedTarget):!0)&&O(L)}function D(L){v()||w.current==null||w.current({...e,tree:m,x:L.clientX,y:L.clientY,onClose(){P(),M(),O(L)}})(L)}if(V(s)){const L=s;return n&&L.addEventListener("mouseleave",D),l==null||l.addEventListener("mouseleave",D),d&&L.addEventListener("mousemove",C,{once:!0}),L.addEventListener("mouseenter",C),L.addEventListener("mouseleave",A),()=>{n&&L.removeEventListener("mouseleave",D),l==null||l.removeEventListener("mouseleave",D),d&&L.removeEventListener("mousemove",C),L.removeEventListener("mouseenter",C),L.removeEventListener("mouseleave",A)}}},[s,l,u,e,h,f,d,O,M,P,o,n,m,b,w,r]),z(()=>{var v;if(u&&n&&(v=w.current)!=null&&v.__options.blockPointerEvents&&k()){const D=G(l).body;if(D.setAttribute(Ne,""),D.style.pointerEvents="none",F.current=!0,V(s)&&l){var C,A;const L=s,K=m==null||(C=m.nodesRef.current.find(De=>De.id===R))==null||(A=C.context)==null?void 0:A.elements.floating;return K&&(K.style.pointerEvents=""),L.style.pointerEvents="auto",l.style.pointerEvents="auto",()=>{L.style.pointerEvents="",l.style.pointerEvents=""}}}},[u,n,R,l,s,m,w,r,k]),z(()=>{n||(E.current=void 0,M(),P())},[n,M,P]),g.useEffect(()=>()=>{M(),clearTimeout(y.current),clearTimeout(T.current),P()},[u,M,P]),g.useMemo(()=>{if(!u)return{};function v(C){E.current=C.pointerType}return{reference:{onPointerDown:v,onPointerEnter:v,onMouseMove(C){n||f===0||(clearTimeout(T.current),T.current=setTimeout(()=>{S.current||o(!0,C.nativeEvent)},f))}},floating:{onMouseEnter(){clearTimeout(y.current)},onMouseLeave(C){i.emit("dismiss",{type:"mouseLeave",data:{returnFocus:!1}}),O(C.nativeEvent,!1)}}}},[i,u,f,n,o,O])}const rt=g.createContext({delay:0,initialDelay:0,timeoutMs:0,currentId:null,setCurrentId:()=>{},setState:()=>{},isInstantPhase:!1}),Zt=()=>g.useContext(rt),vn=e=>{let{children:t,delay:n,timeoutMs:o=0}=e;const[r,i]=g.useReducer((c,u)=>({...c,...u}),{delay:n,timeoutMs:o,initialDelay:n,currentId:null,isInstantPhase:!1}),s=g.useRef(null),l=g.useCallback(c=>{i({currentId:c})},[]);return z(()=>{r.currentId?s.current===null?s.current=r.currentId:i({isInstantPhase:!0}):(i({isInstantPhase:!1}),s.current=null)},[r.currentId]),g.createElement(rt.Provider,{value:g.useMemo(()=>({...r,setState:i,setCurrentId:l}),[r,i,l])},t)},xn=(e,t)=>{let{open:n,onOpenChange:o}=e,{id:r}=t;const{currentId:i,setCurrentId:s,initialDelay:l,setState:c,timeoutMs:u}=Zt();z(()=>{i&&(c({delay:{open:1,close:ce(l,"close")}}),i!==r&&o(!1))},[r,o,c,i,l]),z(()=>{function p(){o(!1),c({delay:l,currentId:null})}if(!n&&i===r)if(u){const a=window.setTimeout(p,u);return()=>{clearTimeout(a)}}else p()},[n,c,i,r,o,l,u]),z(()=>{n&&s(r)},[n,s,r])};function en(e){let t=e.activeElement;for(;((n=t)==null||(o=n.shadowRoot)==null?void 0:o.activeElement)!=null;){var n,o;t=t.shadowRoot.activeElement}return t}function ye(e,t){let n=e.filter(r=>{var i;return r.parentId===t&&((i=r.context)==null?void 0:i.open)}),o=n;for(;o.length;)o=e.filter(r=>{var i;return(i=o)==null?void 0:i.some(s=>{var l;return r.parentId===s.id&&((l=r.context)==null?void 0:l.open)})}),n=n.concat(o);return n}function tn(e){return"composedPath"in e?e.composedPath()[0]:e.target}const nn=Ke["useInsertionEffect".toString()],on=nn||(e=>e());function le(e){const t=g.useRef(()=>{});return on(()=>{t.current=e}),g.useCallback(function(){for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return t.current==null?void 0:t.current(...o)},[])}function ue(e,t){if(t==null)return!1;if("composedPath"in e)return e.composedPath().includes(t);const n=e;return n.target!=null&&t.contains(n.target)}const rn={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},sn={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},cn=e=>{var t,n;return{escapeKeyBubbles:typeof e=="boolean"?e:(t=e==null?void 0:e.escapeKey)!=null?t:!1,outsidePressBubbles:typeof e=="boolean"?e:(n=e==null?void 0:e.outsidePress)!=null?n:!0}};function Rn(e,t){t===void 0&&(t={});const{open:n,onOpenChange:o,events:r,nodeId:i,elements:{reference:s,domReference:l,floating:c},dataRef:u}=e,{enabled:p=!0,escapeKey:a=!0,outsidePress:h=!0,outsidePressEvent:f="pointerdown",referencePress:d=!1,referencePressEvent:m="pointerdown",ancestorScroll:R=!1,bubbles:w}=t,b=Me(),E=et()!=null,y=le(typeof h=="function"?h:()=>!1),x=typeof h=="function"?y:h,T=g.useRef(!1),{escapeKeyBubbles:S,outsidePressBubbles:F}=cn(w),I=le(O=>{if(!n||!p||!a||O.key!=="Escape")return;const M=b?ye(b.nodesRef.current,i):[];if(!S&&(O.stopPropagation(),M.length>0)){let P=!0;if(M.forEach(v=>{var C;if((C=v.context)!=null&&C.open&&!v.context.dataRef.current.__escapeKeyBubbles){P=!1;return}}),!P)return}r.emit("dismiss",{type:"escapeKey",data:{returnFocus:{preventScroll:!1}}}),o(!1,Qt(O)?O.nativeEvent:O)}),k=le(O=>{const M=T.current;if(T.current=!1,M||typeof x=="function"&&!x(O))return;const P=tn(O);if(tt(P)&&c){const A=P.clientWidth>0&&P.scrollWidth>P.clientWidth,D=P.clientHeight>0&&P.scrollHeight>P.clientHeight;let L=D&&O.offsetX>P.clientWidth;if(D&&pe(c).getComputedStyle(P).direction==="rtl"&&(L=O.offsetX<=P.offsetWidth-P.clientWidth),L||A&&O.offsetY>P.clientHeight)return}const v=b&&ye(b.nodesRef.current,i).some(A=>{var D;return ue(O,(D=A.context)==null?void 0:D.elements.floating)});if(ue(O,c)||ue(O,l)||v)return;const C=b?ye(b.nodesRef.current,i):[];if(C.length>0){let A=!0;if(C.forEach(D=>{var L;if((L=D.context)!=null&&L.open&&!D.context.dataRef.current.__outsidePressBubbles){A=!1;return}}),!A)return}r.emit("dismiss",{type:"outsidePress",data:{returnFocus:E?{preventScroll:!0}:Ut(O)||Jt(O)}}),o(!1,O)});return g.useEffect(()=>{if(!n||!p)return;u.current.__escapeKeyBubbles=S,u.current.__outsidePressBubbles=F;function O(v){o(!1,v)}const M=G(c);a&&M.addEventListener("keydown",I),x&&M.addEventListener(f,k);let P=[];return R&&(V(l)&&(P=q(l)),V(c)&&(P=P.concat(q(c))),!V(s)&&s&&s.contextElement&&(P=P.concat(q(s.contextElement)))),P=P.filter(v=>{var C;return v!==((C=M.defaultView)==null?void 0:C.visualViewport)}),P.forEach(v=>{v.addEventListener("scroll",O,{passive:!0})}),()=>{a&&M.removeEventListener("keydown",I),x&&M.removeEventListener(f,k),P.forEach(v=>{v.removeEventListener("scroll",O)})}},[u,c,l,s,a,x,f,n,o,R,p,S,F,I,k]),g.useEffect(()=>{T.current=!1},[x,f]),g.useMemo(()=>p?{reference:{onKeyDown:I,[rn[m]]:O=>{d&&(r.emit("dismiss",{type:"referencePress",data:{returnFocus:!1}}),o(!1,O.nativeEvent))}},floating:{onKeyDown:I,[sn[f]]:()=>{T.current=!0}}}:{},[p,r,d,f,m,o,I])}function bn(e){var t;e===void 0&&(e={});const{open:n=!1,onOpenChange:o,nodeId:r}=e,[i,s]=g.useState(null),l=((t=e.elements)==null?void 0:t.reference)||i,c=_t(e),u=Me(),p=le((y,x)=>{y&&(h.current.openEvent=x),o==null||o(y,x)}),a=g.useRef(null),h=g.useRef({}),f=g.useState(()=>zt())[0],d=Ze(),m=g.useCallback(y=>{const x=V(y)?{getBoundingClientRect:()=>y.getBoundingClientRect(),contextElement:y}:y;c.refs.setReference(x)},[c.refs]),R=g.useCallback(y=>{(V(y)||y===null)&&(a.current=y,s(y)),(V(c.refs.reference.current)||c.refs.reference.current===null||y!==null&&!V(y))&&c.refs.setReference(y)},[c.refs]),w=g.useMemo(()=>({...c.refs,setReference:R,setPositionReference:m,domReference:a}),[c.refs,R,m]),b=g.useMemo(()=>({...c.elements,domReference:l}),[c.elements,l]),E=g.useMemo(()=>({...c,refs:w,elements:b,dataRef:h,nodeId:r,floatingId:d,events:f,open:n,onOpenChange:p}),[c,r,d,f,n,p,w,b]);return z(()=>{const y=u==null?void 0:u.nodesRef.current.find(x=>x.id===r);y&&(y.context=E)}),g.useMemo(()=>({...c,context:E,refs:w,elements:b}),[c,w,b,E])}function En(e,t){t===void 0&&(t={});const{open:n,onOpenChange:o,dataRef:r,events:i,refs:s,elements:{floating:l,domReference:c}}=e,{enabled:u=!0,keyboardOnly:p=!0}=t,a=g.useRef(""),h=g.useRef(!1),f=g.useRef();return g.useEffect(()=>{if(!u)return;const m=G(l).defaultView||window;function R(){!n&&tt(c)&&c===en(G(c))&&(h.current=!0)}return m.addEventListener("blur",R),()=>{m.removeEventListener("blur",R)}},[l,c,n,u]),g.useEffect(()=>{if(!u)return;function d(m){(m.type==="referencePress"||m.type==="escapeKey")&&(h.current=!0)}return i.on("dismiss",d),()=>{i.off("dismiss",d)}},[i,u]),g.useEffect(()=>()=>{clearTimeout(f.current)},[]),g.useMemo(()=>u?{reference:{onPointerDown(d){let{pointerType:m}=d;a.current=m,h.current=!!(m&&p)},onMouseLeave(){h.current=!1},onFocus(d){var m;h.current||d.type==="focus"&&((m=r.current.openEvent)==null?void 0:m.type)==="mousedown"&&ue(r.current.openEvent,c)||o(!0,d.nativeEvent)},onBlur(d){h.current=!1;const m=d.relatedTarget,R=V(m)&&m.hasAttribute(ot("focus-guard"))&&m.getAttribute("data-type")==="outside";f.current=setTimeout(()=>{Re(s.floating.current,m)||Re(c,m)||R||o(!1,d.nativeEvent)})}}}:{},[u,p,c,s,r,o])}function we(e,t,n){const o=new Map;return{...n==="floating"&&{tabIndex:-1},...e,...t.map(r=>r?r[n]:null).concat(e).reduce((r,i)=>(i&&Object.entries(i).forEach(s=>{let[l,c]=s;if(l.indexOf("on")===0){if(o.has(l)||o.set(l,[]),typeof c=="function"){var u;(u=o.get(l))==null||u.push(c),r[l]=function(){for(var p,a=arguments.length,h=new Array(a),f=0;f<a;f++)h[f]=arguments[f];return(p=o.get(l))==null?void 0:p.map(d=>d(...h)).find(d=>d!==void 0)}}}else r[l]=c}),r),{})}}function Cn(e){e===void 0&&(e=[]);const t=e,n=g.useCallback(i=>we(i,e,"reference"),t),o=g.useCallback(i=>we(i,e,"floating"),t),r=g.useCallback(i=>we(i,e,"item"),e.map(i=>i==null?void 0:i.item));return g.useMemo(()=>({getReferenceProps:n,getFloatingProps:o,getItemProps:r}),[n,o,r])}function An(e,t){t===void 0&&(t={});const{open:n,floatingId:o}=e,{enabled:r=!0,role:i="dialog"}=t,s=Ze();return g.useMemo(()=>{const l={id:o,role:i};return r?i==="tooltip"?{reference:{"aria-describedby":n?o:void 0},floating:l}:{reference:{"aria-expanded":n?"true":"false","aria-haspopup":i==="alertdialog"?"dialog":i,"aria-controls":n?o:void 0,...i==="listbox"&&{role:"combobox"},...i==="menu"&&{id:s}},floating:{...l,...i==="menu"&&{"aria-labelledby":s}}}:{}},[r,i,n,o,s])}export{vn as F,an as a,yn as b,gn as c,Zt as d,Cn as e,mn as f,q as g,wn as h,pn as i,En as j,An as k,hn as l,Rn as m,xn as n,fn as o,dn as s,bn as u};