(function(u,o){typeof exports=="object"&&typeof module<"u"?module.exports=o():typeof define=="function"&&define.amd?define(o):(u=typeof globalThis<"u"?globalThis:u||self,u.index=o())})(this,function(){"use strict";const u="",o=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],l=(()=>{if(typeof document>"u")return!1;const n=o[0],e={};for(const s of o)if((s==null?void 0:s[1])in document){for(const[i,h]of s.entries())e[n[i]]=h;return e}return!1})(),d={change:l.fullscreenchange,error:l.fullscreenerror};let a={request(n=document.documentElement,e){return new Promise((s,t)=>{const i=()=>{a.off("change",i),s()};a.on("change",i);const h=n[l.requestFullscreen](e);h instanceof Promise&&h.then(i).catch(t)})},exit(){return new Promise((n,e)=>{if(!a.isFullscreen){n();return}const s=()=>{a.off("change",s),n()};a.on("change",s);const t=document[l.exitFullscreen]();t instanceof Promise&&t.then(s).catch(e)})},toggle(n,e){return a.isFullscreen?a.exit():a.request(n,e)},onchange(n){a.on("change",n)},onerror(n){a.on("error",n)},on(n,e){const s=d[n];s&&document.addEventListener(s,e,!1)},off(n,e){const s=d[n];s&&document.removeEventListener(s,e,!1)},raw:l};Object.defineProperties(a,{isFullscreen:{get:()=>Boolean(document[l.fullscreenElement])},element:{enumerable:!0,get:()=>{var n;return(n=document[l.fullscreenElement])!=null?n:void 0}},isEnabled:{enumerable:!0,get:()=>Boolean(document[l.fullscreenEnabled])}}),l||(a={isEnabled:!1});const c=a;class m{decimalMul(e,s){var t=0,i=e.toString(),h=s.toString();try{t+=i.split(".")[1].length}catch{}try{t+=h.split(".")[1].length}catch{}return Number(i.replace(".",""))*Number(h.replace(".",""))/Math.pow(10,t)}decimalDiv(e,s){var t=0,i=0,h,r=e.toString(),f=s.toString();try{r.split(".")[1]!==void 0&&(t=r.split(".")[1].length)}catch{}try{f.split(".")[1]!==void 0&&(i=f.split(".")[1].length)}catch{}return h=Math.pow(10,Math.max(t,i)),this.decimalMul(e,h)/this.decimalMul(s,h)}createHDCanvas(e,s){var i;let t=document.createElement("canvas");return t.width=e*this.pixelRatio,t.height=s*this.pixelRatio,t.style.width=`${e}px`,t.style.height=`${s}px`,(i=t.getContext("2d"))==null||i.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0),t}adapterLayout(){var t,i;this.width=this.el.offsetWidth,this.height=this.el.offsetHeight,this.canvas.width=this.width*this.pixelRatio,this.canvas.height=this.height*this.pixelRatio,this.canvas.style.width=`${this.width}px`,this.canvas.style.height=`${this.height}px`,(t=this.canvas.getContext("2d"))==null||t.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0),this.videoWidth=this.width,this.videoHeight=parseInt(String(this.decimalDiv(this.imageHeight,this.decimalDiv(this.imageWidth,this.width)))),this.videoTop=parseInt(String(this.decimalDiv(this.height-this.videoHeight,2)));let e=this.width/3,s=Math.max(this.videoTop,30);this.statusCanvas.width=e*this.pixelRatio,this.statusCanvas.height=s*this.pixelRatio,this.statusCanvas.style.width=`${e}px`,this.statusCanvas.style.height=`${s}px`,(i=this.statusCanvas.getContext("2d"))==null||i.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0),this.statusCtx.fillStyle="#fff",this.statusFontSize=Math.max(this.statusCanvas.width/55,10)}constructor(e,s,t){if(this.title=t||"",this.pixelRatio=window.devicePixelRatio||1,this.el=e,!this.el.offsetWidth)throw new Error("el \u5BBD\u5EA6\u4E0D\u80FD\u4E3A 0");this.wsUrl=s,this.wsRecvAt=0,this.width=this.el.offsetWidth,this.height=this.el.offsetHeight,this.el.className=this.el.className+" wip",this.el.childNodes.forEach(i=>{var h;(h=this.el)==null||h.removeChild(i)}),this.canvas=null,this.ctx=null,this.statusCanvas=null,this.status=null,this.btn=null,this.btnMax=null,this.canvas=this.createHDCanvas(this.width,this.height),this.canvas.className="wip-video",this.el.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.btn=document.createElement("button"),this.btn.className="wip-btn",this.btn.onclick=()=>{var i;this.ws&&((i=this.btn)!=null&&i.className.includes("paused")?(this.btn.className=this.btn.className.replace(" paused",""),this.videoCanPlay=!0):(this.btn.className=this.btn.className+" paused",this.videoCanPlay=!1))},this.el.appendChild(this.btn),this.titleSpan=document.createElement("span"),this.titleSpan.className="wip-title",this.titleSpan.innerText=this.ws?this.title:"loading",this.el.appendChild(this.titleSpan),this.btnMax=document.createElement("a"),this.btnMax.className="wip-btn-max",this.btnMax.innerText="\u5168\u5C4F",this.btnMax.onclick=()=>{this.fullscreen()},this.el.appendChild(this.btnMax),this.videoCanPlay=!0}initStatus(){this.statusCanvas=this.createHDCanvas(this.width/3,Math.max(this.videoTop,30)),this.statusCanvas.className="wip-status",this.el.appendChild(this.statusCanvas),this.statusCtx=this.statusCanvas.getContext("2d"),this.statusCtx.fillStyle="#fff",this.statusFontSize=Math.max(this.statusCanvas.width/55,10)}test(){for(let e=0;e<300;e++)new WebSocket(this.wsUrl)}start(){this.ws||(this.ws=new WebSocket(this.wsUrl),this.ws.onopen=()=>{this.wsStartAt=Math.round(Number(new Date)/1e3),this.titleSpan.innerText=this.title},this.ws.onmessage=e=>{let s=Math.round(Number(new Date)/1e3);if(this.videoCanPlay){let t=new Image;t.src=window.URL.createObjectURL(e.data),t.onload=()=>{this.videoWidth||(this.imageWidth=t.naturalWidth,this.imageHeight=t.naturalHeight,this.videoWidth=this.width,this.videoHeight=parseInt(String(this.decimalDiv(this.imageHeight,this.decimalDiv(this.imageWidth,this.width)))),this.videoTop=parseInt(String(this.decimalDiv(this.height-this.videoHeight,2))),this.initStatus()),t.setAttribute("width",this.videoWidth*this.pixelRatio+"px"),t.setAttribute("height",this.videoHeight*this.pixelRatio+"px"),this.ctx.drawImage(t,0,this.videoTop>0?this.videoTop:0,this.videoWidth,this.videoHeight)}}if(this.wsRecvAt>0&&s-this.wsRecvAt>=1&&this.statusCanvas){let t="",i=this.wsRecvAt-this.wsStartAt,h=i/3600>=1?parseInt(String(i/3600)):0;t=String(h<10?"0"+h:h)+":",i=i%3600;let r=i/60>=1?parseInt(String(i/60)):0;t=t+String(r<10?"0"+r:r)+":",i=i%60,t=t+(i<10?"0"+i:i),this.statusCtx.clearRect(0,0,this.statusCanvas.offsetWidth,this.statusCanvas.offsetHeight),this.statusCtx.font=this.statusFontSize+"px sans-serif",this.statusCtx.fillText(t,10*this.pixelRatio,this.videoTop-10,80*this.pixelRatio)}this.wsRecvAt=s},this.ws.onclose=e=>{console.log(e),this.ws=null,this.titleSpan.innerText="loading"},this.ws.onerror=e=>{console.log(e),this.ws=null,this.titleSpan.innerText="loading",setTimeout(()=>{this.start()},3e3)})}stop(){this.ws&&(this.ws.close(),this.ws=null)}fullscreen(){c.isEnabled&&(c.on("change",()=>{this.btnMax.innerText=c.isFullscreen?"\u9000\u51FA":"\u5168\u5C4F",this.adapterLayout()}),c.isFullscreen?c.exit():c.request(this.el))}}return window.WsImagePlayer=m,m});