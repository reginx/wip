const u = [
  [
    "requestFullscreen",
    "exitFullscreen",
    "fullscreenElement",
    "fullscreenEnabled",
    "fullscreenchange",
    "fullscreenerror"
  ],
  [
    "webkitRequestFullscreen",
    "webkitExitFullscreen",
    "webkitFullscreenElement",
    "webkitFullscreenEnabled",
    "webkitfullscreenchange",
    "webkitfullscreenerror"
  ],
  [
    "webkitRequestFullScreen",
    "webkitCancelFullScreen",
    "webkitCurrentFullScreenElement",
    "webkitCancelFullScreen",
    "webkitfullscreenchange",
    "webkitfullscreenerror"
  ],
  [
    "mozRequestFullScreen",
    "mozCancelFullScreen",
    "mozFullScreenElement",
    "mozFullScreenEnabled",
    "mozfullscreenchange",
    "mozfullscreenerror"
  ],
  [
    "msRequestFullscreen",
    "msExitFullscreen",
    "msFullscreenElement",
    "msFullscreenEnabled",
    "MSFullscreenChange",
    "MSFullscreenError"
  ]
], l = (() => {
  if (typeof document > "u")
    return !1;
  const h = u[0], e = {};
  for (const s of u)
    if ((s == null ? void 0 : s[1]) in document) {
      for (const [t, n] of s.entries())
        e[h[t]] = n;
      return e;
    }
  return !1;
})(), d = {
  change: l.fullscreenchange,
  error: l.fullscreenerror
};
let a = {
  request(h = document.documentElement, e) {
    return new Promise((s, i) => {
      const t = () => {
        a.off("change", t), s();
      };
      a.on("change", t);
      const n = h[l.requestFullscreen](e);
      n instanceof Promise && n.then(t).catch(i);
    });
  },
  exit() {
    return new Promise((h, e) => {
      if (!a.isFullscreen) {
        h();
        return;
      }
      const s = () => {
        a.off("change", s), h();
      };
      a.on("change", s);
      const i = document[l.exitFullscreen]();
      i instanceof Promise && i.then(s).catch(e);
    });
  },
  toggle(h, e) {
    return a.isFullscreen ? a.exit() : a.request(h, e);
  },
  onchange(h) {
    a.on("change", h);
  },
  onerror(h) {
    a.on("error", h);
  },
  on(h, e) {
    const s = d[h];
    s && document.addEventListener(s, e, !1);
  },
  off(h, e) {
    const s = d[h];
    s && document.removeEventListener(s, e, !1);
  },
  raw: l
};
Object.defineProperties(a, {
  isFullscreen: {
    get: () => Boolean(document[l.fullscreenElement])
  },
  element: {
    enumerable: !0,
    get: () => {
      var h;
      return (h = document[l.fullscreenElement]) != null ? h : void 0;
    }
  },
  isEnabled: {
    enumerable: !0,
    get: () => Boolean(document[l.fullscreenEnabled])
  }
});
l || (a = { isEnabled: !1 });
const c = a;
class f {
  decimalMul(e, s) {
    var i = 0, t = e.toString(), n = s.toString();
    try {
      i += t.split(".")[1].length;
    } catch {
    }
    try {
      i += n.split(".")[1].length;
    } catch {
    }
    return Number(t.replace(".", "")) * Number(n.replace(".", "")) / Math.pow(10, i);
  }
  decimalDiv(e, s) {
    var i = 0, t = 0, n, r = e.toString(), o = s.toString();
    try {
      r.split(".")[1] !== void 0 && (i = r.split(".")[1].length);
    } catch {
    }
    try {
      o.split(".")[1] !== void 0 && (t = o.split(".")[1].length);
    } catch {
    }
    return n = Math.pow(10, Math.max(i, t)), this.decimalMul(e, n) / this.decimalMul(s, n);
  }
  createHDCanvas(e, s) {
    var t;
    let i = document.createElement("canvas");
    return i.width = e * this.pixelRatio, i.height = s * this.pixelRatio, i.style.width = `${e}px`, i.style.height = `${s}px`, (t = i.getContext("2d")) == null || t.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), i;
  }
  adapterLayout() {
    var i, t;
    this.width = this.el.offsetWidth, this.height = this.el.offsetHeight, this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio, this.canvas.style.width = `${this.width}px`, this.canvas.style.height = `${this.height}px`, (i = this.canvas.getContext("2d")) == null || i.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), this.videoWidth = this.width, this.videoHeight = parseInt(
      String(
        this.decimalDiv(
          this.imageHeight,
          this.decimalDiv(this.imageWidth, this.width)
        )
      )
    ), this.videoTop = parseInt(String(this.decimalDiv(this.height - this.videoHeight, 2)));
    let e = this.width / 3, s = Math.max(this.videoTop, 30);
    this.statusCanvas.width = e * this.pixelRatio, this.statusCanvas.height = s * this.pixelRatio, this.statusCanvas.style.width = `${e}px`, this.statusCanvas.style.height = `${s}px`, (t = this.statusCanvas.getContext("2d")) == null || t.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), this.statusCtx.fillStyle = "#fff", this.statusFontSize = Math.max(this.statusCanvas.width / 55, 10);
  }
  constructor(e, s, i) {
    if (this.title = i || "", this.pixelRatio = window.devicePixelRatio || 1, this.el = e, !this.el.offsetWidth)
      throw new Error("el \u5BBD\u5EA6\u4E0D\u80FD\u4E3A 0");
    this.wsUrl = s, this.wsRecvAt = 0, this.width = this.el.offsetWidth, this.height = this.el.offsetHeight, this.el.className = this.el.className + " wip", this.el.childNodes.forEach((t) => {
      var n;
      (n = this.el) == null || n.removeChild(t);
    }), this.canvas = null, this.ctx = null, this.statusCanvas = null, this.status = null, this.btn = null, this.btnMax = null, this.canvas = this.createHDCanvas(this.width, this.height), this.canvas.className = "wip-video", this.el.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.btn = document.createElement("button"), this.btn.className = "wip-btn", this.btn.onclick = () => {
      var t;
      this.ws && ((t = this.btn) != null && t.className.includes("paused") ? (this.btn.className = this.btn.className.replace(" paused", ""), this.videoCanPlay = !0) : (this.btn.className = this.btn.className + " paused", this.videoCanPlay = !1));
    }, this.el.appendChild(this.btn), this.titleSpan = document.createElement("span"), this.titleSpan.className = "wip-title", this.titleSpan.innerText = this.ws ? this.title : "loading", this.el.appendChild(this.titleSpan), this.btnMax = document.createElement("a"), this.btnMax.className = "wip-btn-max", this.btnMax.innerText = "\u5168\u5C4F", this.btnMax.onclick = () => {
      this.fullscreen();
    }, this.el.appendChild(this.btnMax), this.videoCanPlay = !0, this.isDestroyed = !1;
  }
  initStatus() {
    this.statusCanvas = this.createHDCanvas(this.width / 3, Math.max(this.videoTop, 30)), this.statusCanvas.className = "wip-status", this.el.appendChild(this.statusCanvas), this.statusCtx = this.statusCanvas.getContext("2d"), this.statusCtx.fillStyle = "#fff", this.statusFontSize = Math.max(this.statusCanvas.width / 55, 10);
  }
  test() {
    for (let e = 0; e < 300; e++)
      new WebSocket(this.wsUrl);
  }
  start() {
    this.ws || (this.ws = new WebSocket(this.wsUrl), this.ws.onopen = () => {
      this.wsStartAt = Math.round(Number(new Date()) / 1e3), this.titleSpan.innerText = this.title;
    }, this.ws.onmessage = (e) => {
      var i;
      if (this.isDestroyed) {
        (i = this.ws) == null || i.close();
        return;
      }
      let s = Math.round(Number(new Date()) / 1e3);
      if (this.videoCanPlay) {
        let t = new Image();
        t.src = window.URL.createObjectURL(e.data), t.onload = () => {
          this.videoWidth || (this.imageWidth = t.naturalWidth, this.imageHeight = t.naturalHeight, this.videoWidth = this.width, this.videoHeight = parseInt(
            String(
              this.decimalDiv(
                this.imageHeight,
                this.decimalDiv(this.imageWidth, this.width)
              )
            )
          ), this.videoTop = parseInt(String(this.decimalDiv(this.height - this.videoHeight, 2))), this.initStatus()), t.setAttribute("width", this.videoWidth * this.pixelRatio + "px"), t.setAttribute("height", this.videoHeight * this.pixelRatio + "px"), this.ctx.drawImage(
            t,
            0,
            this.videoTop > 0 ? this.videoTop : 0,
            this.videoWidth,
            this.videoHeight
          );
        };
      }
      if (this.wsRecvAt > 0 && s - this.wsRecvAt >= 1 && this.statusCanvas) {
        let t = "", n = this.wsRecvAt - this.wsStartAt, r = n / 3600 >= 1 ? parseInt(String(n / 3600)) : 0;
        t = String(r < 10 ? "0" + r : r) + ":", n = n % 3600;
        let o = n / 60 >= 1 ? parseInt(String(n / 60)) : 0;
        t = t + String(o < 10 ? "0" + o : o) + ":", n = n % 60, t = t + (n < 10 ? "0" + n : n), this.statusCtx.clearRect(0, 0, this.statusCanvas.offsetWidth, this.statusCanvas.offsetHeight), this.statusCtx.font = this.statusFontSize + "px sans-serif", this.statusCtx.fillText(t, 10 * this.pixelRatio, this.videoTop - 10, 80 * this.pixelRatio);
      }
      this.wsRecvAt = s;
    }, this.ws.onclose = (e) => {
      console.log(e), this.ws = null, this.titleSpan.innerText = "loading";
    }, this.ws.onerror = (e) => {
      console.log(e), this.ws = null, this.titleSpan.innerText = "loading", this.isDestroyed || setTimeout(() => {
        this.start();
      }, 3e3);
    });
  }
  destroy() {
    this.ws && (this.ws.close(), this.ws = null, this.isDestroyed = !0);
  }
  fullscreen() {
    c.isEnabled && (c.on("change", () => {
      this.btnMax.innerText = c.isFullscreen ? "\u9000\u51FA" : "\u5168\u5C4F", this.adapterLayout();
    }), c.isFullscreen ? c.exit() : c.request(this.el));
  }
}
window.WsImagePlayer = f;
export {
  f as default
};
