!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.GlRenderer=t():e.GlRenderer=t()}(window,function(){return function(e){var t=window.webpackHotUpdate;window.webpackHotUpdate=function(e,r){!function(e,t){if(!w[e]||!x[e])return;for(var r in x[e]=!1,t)Object.prototype.hasOwnProperty.call(t,r)&&(v[r]=t[r]);0==--g&&0===m&&A()}(e,r),t&&t(e,r)};var r,n=!0,o="7a1c898290c9ae51f908",i=1e4,a={},c=[],u=[];function s(e){var t=O[e];if(!t)return P;var n=function(n){return t.hot.active?(O[n]?-1===O[n].parents.indexOf(e)&&O[n].parents.push(e):(c=[e],r=n),-1===t.children.indexOf(n)&&t.children.push(n)):(console.warn("[HMR] unexpected require("+n+") from disposed module "+e),c=[]),P(n)},o=function(e){return{configurable:!0,enumerable:!0,get:function(){return P[e]},set:function(t){P[e]=t}}};for(var i in P)Object.prototype.hasOwnProperty.call(P,i)&&"e"!==i&&"t"!==i&&Object.defineProperty(n,i,o(i));return n.e=function(e){return"ready"===d&&h("prepare"),m++,P.e(e).then(t,function(e){throw t(),e});function t(){m--,"prepare"===d&&(b[e]||T(e),0===m&&0===g&&A())}},n.t=function(e,t){return 1&t&&(e=n(e)),P.t(e,-2&t)},n}function l(e){var t={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_disposeHandlers:[],_main:r!==e,active:!0,accept:function(e,r){if(void 0===e)t._selfAccepted=!0;else if("function"==typeof e)t._selfAccepted=e;else if("object"==typeof e)for(var n=0;n<e.length;n++)t._acceptedDependencies[e[n]]=r||function(){};else t._acceptedDependencies[e]=r||function(){}},decline:function(e){if(void 0===e)t._selfDeclined=!0;else if("object"==typeof e)for(var r=0;r<e.length;r++)t._declinedDependencies[e[r]]=!0;else t._declinedDependencies[e]=!0},dispose:function(e){t._disposeHandlers.push(e)},addDisposeHandler:function(e){t._disposeHandlers.push(e)},removeDisposeHandler:function(e){var r=t._disposeHandlers.indexOf(e);r>=0&&t._disposeHandlers.splice(r,1)},check:_,apply:k,status:function(e){if(!e)return d;f.push(e)},addStatusHandler:function(e){f.push(e)},removeStatusHandler:function(e){var t=f.indexOf(e);t>=0&&f.splice(t,1)},data:a[e]};return r=void 0,t}var f=[],d="idle";function h(e){d=e;for(var t=0;t<f.length;t++)f[t].call(null,e)}var p,v,y,g=0,m=0,b={},x={},w={};function E(e){return+e+""===e?+e:e}function _(e){if("idle"!==d)throw new Error("check() is only allowed in idle status");return n=e,h("check"),(t=i,t=t||1e4,new Promise(function(e,r){if("undefined"==typeof XMLHttpRequest)return r(new Error("No browser support"));try{var n=new XMLHttpRequest,i=P.p+""+o+".hot-update.json";n.open("GET",i,!0),n.timeout=t,n.send(null)}catch(e){return r(e)}n.onreadystatechange=function(){if(4===n.readyState)if(0===n.status)r(new Error("Manifest request to "+i+" timed out."));else if(404===n.status)e();else if(200!==n.status&&304!==n.status)r(new Error("Manifest request to "+i+" failed."));else{try{var t=JSON.parse(n.responseText)}catch(e){return void r(e)}e(t)}}})).then(function(e){if(!e)return h("idle"),null;x={},b={},w=e.c,y=e.h,h("prepare");var t=new Promise(function(e,t){p={resolve:e,reject:t}});v={};return T(0),"prepare"===d&&0===m&&0===g&&A(),t});var t}function T(e){w[e]?(x[e]=!0,g++,function(e){var t=document.createElement("script");t.charset="utf-8",t.src=P.p+""+e+"."+o+".hot-update.js",document.head.appendChild(t)}(e)):b[e]=!0}function A(){h("ready");var e=p;if(p=null,e)if(n)Promise.resolve().then(function(){return k(n)}).then(function(t){e.resolve(t)},function(t){e.reject(t)});else{var t=[];for(var r in v)Object.prototype.hasOwnProperty.call(v,r)&&t.push(E(r));e.resolve(t)}}function k(t){if("ready"!==d)throw new Error("apply() is only allowed in ready status");var r,n,i,u,s;function l(e){for(var t=[e],r={},n=t.slice().map(function(e){return{chain:[e],id:e}});n.length>0;){var o=n.pop(),i=o.id,a=o.chain;if((u=O[i])&&!u.hot._selfAccepted){if(u.hot._selfDeclined)return{type:"self-declined",chain:a,moduleId:i};if(u.hot._main)return{type:"unaccepted",chain:a,moduleId:i};for(var c=0;c<u.parents.length;c++){var s=u.parents[c],l=O[s];if(l){if(l.hot._declinedDependencies[i])return{type:"declined",chain:a.concat([s]),moduleId:i,parentId:s};-1===t.indexOf(s)&&(l.hot._acceptedDependencies[i]?(r[s]||(r[s]=[]),f(r[s],[i])):(delete r[s],t.push(s),n.push({chain:a.concat([s]),id:s})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function f(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}t=t||{};var p={},g=[],m={},b=function(){console.warn("[HMR] unexpected require("+_.moduleId+") to disposed module")};for(var x in v)if(Object.prototype.hasOwnProperty.call(v,x)){var _;s=E(x);var T=!1,A=!1,k=!1,S="";switch((_=v[x]?l(s):{type:"disposed",moduleId:x}).chain&&(S="\nUpdate propagation: "+_.chain.join(" -> ")),_.type){case"self-declined":t.onDeclined&&t.onDeclined(_),t.ignoreDeclined||(T=new Error("Aborted because of self decline: "+_.moduleId+S));break;case"declined":t.onDeclined&&t.onDeclined(_),t.ignoreDeclined||(T=new Error("Aborted because of declined dependency: "+_.moduleId+" in "+_.parentId+S));break;case"unaccepted":t.onUnaccepted&&t.onUnaccepted(_),t.ignoreUnaccepted||(T=new Error("Aborted because "+s+" is not accepted"+S));break;case"accepted":t.onAccepted&&t.onAccepted(_),A=!0;break;case"disposed":t.onDisposed&&t.onDisposed(_),k=!0;break;default:throw new Error("Unexception type "+_.type)}if(T)return h("abort"),Promise.reject(T);if(A)for(s in m[s]=v[s],f(g,_.outdatedModules),_.outdatedDependencies)Object.prototype.hasOwnProperty.call(_.outdatedDependencies,s)&&(p[s]||(p[s]=[]),f(p[s],_.outdatedDependencies[s]));k&&(f(g,[_.moduleId]),m[s]=b)}var L,R=[];for(n=0;n<g.length;n++)s=g[n],O[s]&&O[s].hot._selfAccepted&&R.push({module:s,errorHandler:O[s].hot._selfAccepted});h("dispose"),Object.keys(w).forEach(function(e){!1===w[e]&&function(e){delete installedChunks[e]}(e)});for(var j,D,I=g.slice();I.length>0;)if(s=I.pop(),u=O[s]){var U={},F=u.hot._disposeHandlers;for(i=0;i<F.length;i++)(r=F[i])(U);for(a[s]=U,u.hot.active=!1,delete O[s],delete p[s],i=0;i<u.children.length;i++){var M=O[u.children[i]];M&&((L=M.parents.indexOf(s))>=0&&M.parents.splice(L,1))}}for(s in p)if(Object.prototype.hasOwnProperty.call(p,s)&&(u=O[s]))for(D=p[s],i=0;i<D.length;i++)j=D[i],(L=u.children.indexOf(j))>=0&&u.children.splice(L,1);for(s in h("apply"),o=y,m)Object.prototype.hasOwnProperty.call(m,s)&&(e[s]=m[s]);var C=null;for(s in p)if(Object.prototype.hasOwnProperty.call(p,s)&&(u=O[s])){D=p[s];var G=[];for(n=0;n<D.length;n++)if(j=D[n],r=u.hot._acceptedDependencies[j]){if(-1!==G.indexOf(r))continue;G.push(r)}for(n=0;n<G.length;n++){r=G[n];try{r(D)}catch(e){t.onErrored&&t.onErrored({type:"accept-errored",moduleId:s,dependencyId:D[n],error:e}),t.ignoreErrored||C||(C=e)}}}for(n=0;n<R.length;n++){var B=R[n];s=B.module,c=[s];try{P(s)}catch(e){if("function"==typeof B.errorHandler)try{B.errorHandler(e)}catch(r){t.onErrored&&t.onErrored({type:"self-accept-error-handler-errored",moduleId:s,error:r,originalError:e}),t.ignoreErrored||C||(C=r),C||(C=e)}else t.onErrored&&t.onErrored({type:"self-accept-errored",moduleId:s,error:e}),t.ignoreErrored||C||(C=e)}}return C?(h("fail"),Promise.reject(C)):(h("idle"),new Promise(function(e){e(g)}))}var O={};function P(t){if(O[t])return O[t].exports;var r=O[t]={i:t,l:!1,exports:{},hot:l(t),parents:(u=c,c=[],u),children:[]};return e[t].call(r.exports,r,r.exports,s(t)),r.l=!0,r.exports}return P.m=e,P.c=O,P.d=function(e,t,r){P.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},P.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},P.t=function(e,t){if(1&t&&(e=P(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(P.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)P.d(r,n,function(t){return e[t]}.bind(null,n));return r},P.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return P.d(t,"a",t),t},P.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},P.p="/js/",P.h=function(){return o},s(10)(P.s=10)}([function(e,t,r){e.exports=r(14)},function(e,t){function r(e,t,r,n,o,i,a){try{var c=e[i](a),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,o)}e.exports=function(e){return function(){var t=this,n=arguments;return new Promise(function(o,i){var a=e.apply(t,n);function c(e){r(a,o,i,c,u,"next",e)}function u(e){r(a,o,i,c,u,"throw",e)}c(void 0)})}}},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}e.exports=function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}},function(e,t){e.exports="#ifdef GL_ES\nprecision mediump float;\n#endif\nvoid main() {\n\tgl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);\n}\n"},function(e,t,r){var n=r(11),o=r(12),i=r(13);e.exports=function(e){return n(e)||o(e)||i()}},function(e,t,r){var n=r(15),o=r(16),i=r(17);e.exports=function(e,t){return n(e)||o(e,t)||i()}},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t){e.exports="attribute vec4 a_position;\nvoid main() {\n\tgl_PointSize = 1.0;\n\tgl_Position = a_position;\n}\n"},function(e,t){e.exports="#ifdef GL_ES\nprecision mediump float;\n#endif\nattribute vec4 a_position;\nattribute vec2 a_vertexTextureCoord;\nvarying vec2 vTextureCoord;\nvoid main() {\n\tgl_PointSize = 1.0;\n\tgl_Position = a_position;\n\tvTextureCoord = a_vertexTextureCoord;\n}\n"},function(e,t,r){e.exports=r(18).default},function(e,t){e.exports=function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}},function(e,t){e.exports=function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},function(e,t,r){var n=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(e,t,r,n){var o=t&&t.prototype instanceof v?t:v,i=Object.create(o.prototype),a=new O(n||[]);return i._invoke=function(e,t,r){var n=l;return function(o,i){if(n===d)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw i;return S()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=T(a,r);if(c){if(c===p)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=d;var u=s(e,t,r);if("normal"===u.type){if(n=r.done?h:f,u.arg===p)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg)}}}(e,r,a),i}function s(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var l="suspendedStart",f="suspendedYield",d="executing",h="completed",p={};function v(){}function y(){}function g(){}var m={};m[i]=function(){return this};var b=Object.getPrototypeOf,x=b&&b(b(P([])));x&&x!==r&&n.call(x,i)&&(m=x);var w=g.prototype=v.prototype=Object.create(m);function E(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function _(e){var t;this._invoke=function(r,o){function i(){return new Promise(function(t,i){!function t(r,o,i,a){var c=s(e[r],e,o);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==typeof l&&n.call(l,"__await")?Promise.resolve(l.__await).then(function(e){t("next",e,i,a)},function(e){t("throw",e,i,a)}):Promise.resolve(l).then(function(e){u.value=e,i(u)},function(e){return t("throw",e,i,a)})}a(c.arg)}(r,o,t,i)})}return t=t?t.then(i,i):i()}}function T(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,T(e,r),"throw"===r.method))return p;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var o=s(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,p;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,p):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,p)}function A(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function k(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(A,this),this.reset(!0)}function P(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}return{next:S}}function S(){return{value:t,done:!0}}return y.prototype=w.constructor=g,g.constructor=y,g[c]=y.displayName="GeneratorFunction",e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,g):(e.__proto__=g,c in e||(e[c]="GeneratorFunction")),e.prototype=Object.create(w),e},e.awrap=function(e){return{__await:e}},E(_.prototype),_.prototype[a]=function(){return this},e.AsyncIterator=_,e.async=function(t,r,n,o){var i=new _(u(t,r,n,o));return e.isGeneratorFunction(r)?i:i.next().then(function(e){return e.done?e.value:i.next()})},E(w),w[c]="Generator",w[i]=function(){return this},w.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=P,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(k),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,p):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),p},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),k(r),p}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;k(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:P(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),p}},e}(e.exports);try{regeneratorRuntime=n}catch(e){Function("r","regeneratorRuntime = r")(n)}},function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){var r=[],n=!0,o=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(n=(a=c.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw i}}return r}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}},function(e,t,r){"use strict";r.r(t);var n=r(4),o=r.n(n),i=r(0),a=r.n(i),c=r(5),u=r.n(c),s=r(6),l=r.n(s),f=r(2),d=r.n(f),h=r(7),p=r.n(h),v=r(1),y=r.n(v);var g='This page requires a browser that supports WebGL.<br/>\n<a href="http://get.webgl.org">Click here to upgrade your browser.</a>',m='It doesn\'t appear your computer can support WebGL.<br/>\n<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';function b(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Float32Array,r=e[0].length,n=e.length,o=new t(r*n),i=0,a=0;a<n;a++)for(var c=0;c<r;c++)o[i++]=e[a][c];return o}var x={};function w(e){if(!x[e]){var t=new Image;t.crossOrigin="anonymous",x[e]=new Promise(function(r){t.onload=function(){x[e]=t,r(t)},t.src=e})}return Promise.resolve(x[e])}var E=r(8),_=r.n(E),T=r(3),A=r.n(T),k=r(9),O=r.n(k);r.d(t,"default",function(){return C});var P={},S=Symbol("textures"),L=Symbol("enableTextures"),R=Symbol("samplerMap"),j=Symbol("renderFrameID"),D=Symbol("events"),I=Symbol("uniforms");function U(e){return F.apply(this,arguments)}function F(){return(F=y()(a.a.mark(function e(t){var r,n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:if(404!==(r=e.sent).status){e.next=7;break}n=A.a,e.next=10;break;case 7:return e.next=9,r.text();case 9:n=e.sent;case 10:return e.abrupt("return",n);case 11:case"end":return e.stop()}},e)}))).apply(this,arguments)}var M={int:"1i",float:"1f",vec2:"2f",vec3:"3f",vec4:"4f",mat2:"Matrix2fv",mat3:"Matrix3fv",mat4:"Matrix4fv",sampler2D:"sampler2D"},C=function(){function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};l()(this,e),this.options=Object.assign(r,e.defaultOptions),this.canvas=t,this[R]={};var n=function(e,t){function r(t){var r=e.parentNode;r&&(r.innerHTML='<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>\n    <td align="center">\n    <div style="display: table-cell; vertical-align: middle;">\n    <div>'.concat(t,"</div>\n    </div>\n    </td></tr></table>"))}if(!window.WebGLRenderingContext)return r(g),null;var n=function(e,t){for(var r=["webgl","experimental-webgl","webkit-3d","moz-webgl"],n=null,o=0;o<r.length;++o){try{n=e.getContext(r[o],t)}catch(e){}if(n)break}return n}(e,t);return n||r(m),n}(t,this.options);this.gl=n,n.viewport(0,0,t.width,t.height),n.clearColor(1,1,1,1),this.verticesBuffer=n.createBuffer(),this.cellsBuffer=n.createBuffer(),this.vertices=[[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]],this.cells=[[0,1,3],[3,1,2]]}return d()(e,null,[{key:"addLibs",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.assign(P,e)}}]),d()(e,[{key:"deleteProgram",value:function(){this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:"clip",value:function(e){var t=e.vertices,r=e.cells,n=this.gl;n.bindBuffer(n.ARRAY_BUFFER,this.verticesBuffer),n.bufferData(n.ARRAY_BUFFER,b(t),n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this.cellsBuffer),n.bufferData(n.ELEMENT_ARRAY_BUFFER,b(r,Uint8Array),n.STATIC_DRAW),this.vertices=t,this.cells=r}},{key:"setProgram",value:function(e,t){var r=this;this.clearTextures(),this.deleteProgram(),this.startRender=!1,this[j]&&(cancelAnimationFrame(this[j]),delete this[j]),this[I]={},this[D]={},this[L]=/^\s*uniform\s+sampler2D/gm.test(e),null==e&&(e=A.a),null==t&&(t=this[L]?O.a:_.a),this.fragmentShader=e,this.vertexShader=t;var n=this.gl,o=function(e,t,r){var n=e.createShader(e.VERTEX_SHADER);if(e.shaderSource(n,t),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){var o="Vertex shader failed to compile.  The error log is:".concat(e.getShaderInfoLog(n));return console.error(o),-1}var i=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(i,r),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS)){var a="Fragment shader failed to compile.  The error log is:".concat(e.getShaderInfoLog(i));return console.error(a),-1}var c=e.createProgram();if(e.attachShader(c,n),e.attachShader(c,i),e.linkProgram(c),!e.getProgramParameter(c,e.LINK_STATUS)){var u="Shader program failed to link.  The error log is:".concat(e.getProgramInfoLog(c));return console.error(u),-1}return c}(n,t,e);n.useProgram(o),this.program=o,this.clip({vertices:this.vertices,cells:this.cells});var i=n.getAttribLocation(o,"a_position");n.vertexAttribPointer(i,3,n.FLOAT,!1,0,0),n.enableVertexAttribArray(i),this[L]&&this.setTextureCoordinate();var a=/^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/gm,c=t.match(a)||[];return(c=c.concat(e.match(a)||[]))&&c.forEach(function(e){var t=e.match(/^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/).slice(1),n=u()(t,3),o=n[0],i=n[1],a=n[2];a=!!a,0!==(o=M[o]).indexOf("Matrix")&&a&&(o+="v"),r.declareUniform(i,o)}),this.program=o,o}},{key:"compile",value:function(){var e=y()(a.a.mark(function e(t,r){var n,o,i,c,u,s;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=function(){return(i=y()(a.a.mark(function e(t){var r,i,c,u,s,l,f,d,h;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t=t.replace(/^\s*/gm,""),r=[],!(i=t.match(/^#pragma\s+include\s+.*/gm))){e.next=36;break}c=0;case 5:if(!(c<i.length)){e.next=35;break}if(u=i[c],!(s=u.match(/(?:<|")(.*)(?:>|")/))){e.next=32;break}if(l=0===s[0].indexOf("<")?"lib":"link","graph"===(f=s[1])&&(f="graphics"),n[f]){e.next=31;break}if(n[f]=!0,"lib"!==l){e.next=21;break}return e.next=17,o(P[f]);case 17:d=e.sent,r.push(d),e.next=29;break;case 21:if("link"!==l){e.next=29;break}return e.next=24,U(f);case 24:return h=e.sent,e.next=27,o(h);case 27:h=e.sent,r.push(h);case 29:e.next=32;break;case 31:r.push("/* included ".concat(f," */"));case 32:c++,e.next=5;break;case 35:r.forEach(function(e){t=t.replace(/^#pragma\s+include\s+.*/m,e)});case 36:return e.abrupt("return",t);case 37:case"end":return e.stop()}},e)}))).apply(this,arguments)},o=function(e){return i.apply(this,arguments)},n={},e.next=5,o(t);case 5:if(c=e.sent,!r){e.next=12;break}return e.next=9,o(r);case 9:e.t0=e.sent,e.next=13;break;case 12:e.t0=null;case 13:return u=e.t0,s=this.setProgram(c,u),e.abrupt("return",s);case 16:case"end":return e.stop()}},e,this)}));return function(t,r){return e.apply(this,arguments)}}()},{key:"load",value:function(){var e=y()(a.a.mark(function e(t){var r,n=arguments;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.length>1&&void 0!==n[1]?n[1]:null,e.next=3,U(t);case 3:if(t=e.sent,!r){e.next=8;break}return e.next=7,U(r);case 7:r=e.sent;case 8:return e.abrupt("return",this.compile(t,r));case 9:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"clearTextures",value:function(){var e=this.gl;this[S]&&(this[S].forEach(function(t){e.deleteTexture(t)}),this[S]=null),this[R]={}}},{key:"bindTextures",value:function(e){return e.map(this.bindTexture.bind(this))}},{key:"bindTexture",value:function(e,t){var r=this.gl;r.activeTexture(r.TEXTURE0+t);var n=r.createTexture();return r.bindTexture(r.TEXTURE_2D,n),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,e),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),n}},{key:"setTextureCoordinate",value:function(){var e=this.gl,t=this.vertices.map(function(e){return[.5*(e[0]+1),.5*(e[1]+1)]}),r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,b(t),e.STATIC_DRAW);var n=e.getAttribLocation(this.program,"a_vertexTextureCoord");e.enableVertexAttribArray(n),e.vertexAttribPointer(n,2,e.FLOAT,!1,0,0)}},{key:"loadTexture",value:function(e){return w(e)}},{key:"loadTextures",value:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return Promise.all(t.map(w))}},{key:"declareUniform",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"1f",n=this.gl,i=n.getUniformLocation(this.program,e);r=r.replace(/^m/,"Matrix");var a=/v$/.test(r),c=this;if("sampler2D"===r){var u=this[R][e],s=this[S]||[];Object.defineProperty(this[I],e,{get:function(){return t},set:function(r){t=r;var n=u||s.length;s[n]=r,c.bindTexture(r,n),null==u&&(c[R][e]=n),c.update()},configurable:!1,enumerable:!0})}else Object.defineProperty(this[I],e,{get:function(){return t},set:function(e){t=e,Array.isArray(e)||(e=[e]),a?n["uniform".concat(r)](i,e):n["uniform".concat(r)].apply(n,[i].concat(o()(e))),c.update()},configurable:!1,enumerable:!0})}},{key:"on",value:function(e,t){if(!this[D])throw new Error("Must load shader first.");this[D][e]=this[D][e]||[],this[D][e].push(t)}},{key:"once",value:function(e,t){return this.on(e,function r(){this.off(e,r);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return t.apply(this,o)}),this}},{key:"off",value:function(e,t){if(!this[D])throw new Error("Must load shader first.");if(t&&this[D][e]){var r=this[D][e].indexOf(t);r>=0&&this[D][e].splice(r,1)}else delete this[D][e]}},{key:"trigger",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!this[D])throw new Error("Must load shader first.");(this[D][e]||[]).forEach(function(n){n.call(t,Object.assign({target:t,type:e},r))})}},{key:"render",value:function(){this.startRender=!0,this.trigger("beforeRender");var e=this.gl;this.program||this.setProgram(),e.clear(e.COLOR_BUFFER_BIT),e.drawElements(e.TRIANGLES,3*this.cells.length,e.UNSIGNED_BYTE,0),this[j]=null,this.trigger("rendered")}},{key:"update",value:function(){this.startRender&&null==this[j]&&(this[j]=requestAnimationFrame(this.render.bind(this)))}},{key:"enableTextures",get:function(){return!!this[L]}},{key:"uniforms",get:function(){if(!this[I])throw Error("Must load shader first.");return this[I]}}]),e}();p()(C,"defaultOptions",{preserveDrawingBuffer:!0})}])});