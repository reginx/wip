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
  const n = u[0], e = {};
  for (const i of u)
    if ((i == null ? void 0 : i[1]) in document) {
      for (const [s, a] of i.entries())
        e[n[s]] = a;
      return e;
    }
  return !1;
})(), d = {
  change: l.fullscreenchange,
  error: l.fullscreenerror
};
let h = {
  request(n = document.documentElement, e) {
    return new Promise((i, t) => {
      const s = () => {
        h.off("change", s), i();
      };
      h.on("change", s);
      const a = n[l.requestFullscreen](e);
      a instanceof Promise && a.then(s).catch(t);
    });
  },
  exit() {
    return new Promise((n, e) => {
      if (!h.isFullscreen) {
        n();
        return;
      }
      const i = () => {
        h.off("change", i), n();
      };
      h.on("change", i);
      const t = document[l.exitFullscreen]();
      t instanceof Promise && t.then(i).catch(e);
    });
  },
  toggle(n, e) {
    return h.isFullscreen ? h.exit() : h.request(n, e);
  },
  onchange(n) {
    h.on("change", n);
  },
  onerror(n) {
    h.on("error", n);
  },
  on(n, e) {
    const i = d[n];
    i && document.addEventListener(i, e, !1);
  },
  off(n, e) {
    const i = d[n];
    i && document.removeEventListener(i, e, !1);
  },
  raw: l
};
Object.defineProperties(h, {
  isFullscreen: {
    get: () => Boolean(document[l.fullscreenElement])
  },
  element: {
    enumerable: !0,
    get: () => {
      var n;
      return (n = document[l.fullscreenElement]) != null ? n : void 0;
    }
  },
  isEnabled: {
    enumerable: !0,
    get: () => Boolean(document[l.fullscreenEnabled])
  }
});
l || (h = { isEnabled: !1 });
const o = h;
class f {
  decimalMul(e, i) {
    var t = 0, s = e.toString(), a = i.toString();
    try {
      t += s.split(".")[1].length;
    } catch {
    }
    try {
      t += a.split(".")[1].length;
    } catch {
    }
    return Number(s.replace(".", "")) * Number(a.replace(".", "")) / Math.pow(10, t);
  }
  decimalDiv(e, i) {
    var t = 0, s = 0, a, r = e.toString(), c = i.toString();
    try {
      r.split(".")[1] !== void 0 && (t = r.split(".")[1].length);
    } catch {
    }
    try {
      c.split(".")[1] !== void 0 && (s = c.split(".")[1].length);
    } catch {
    }
    return a = Math.pow(10, Math.max(t, s)), this.decimalMul(e, a) / this.decimalMul(i, a);
  }
  createHDCanvas(e, i) {
    var s;
    let t = document.createElement("canvas");
    return t.width = e * this.pixelRatio, t.height = i * this.pixelRatio, t.style.width = `${e}px`, t.style.height = `${i}px`, (s = t.getContext("2d")) == null || s.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), t;
  }
  adapterLayout() {
    var t, s;
    this.width = this.el.offsetWidth, this.height = this.el.offsetHeight, this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio, this.canvas.style.width = `${this.width}px`, this.canvas.style.height = `${this.height}px`, (t = this.canvas.getContext("2d")) == null || t.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), this.videoWidth = this.width, this.videoHeight = parseInt(
      String(
        this.decimalDiv(
          this.imageHeight,
          this.decimalDiv(this.imageWidth, this.width)
        )
      )
    ), this.videoTop = parseInt(String(this.decimalDiv(this.height - this.videoHeight, 2)));
    let e = this.width / 3, i = Math.max(this.videoTop, 30);
    this.statusCanvas.width = e * this.pixelRatio, this.statusCanvas.height = i * this.pixelRatio, this.statusCanvas.style.width = `${e}px`, this.statusCanvas.style.height = `${i}px`, (s = this.statusCanvas.getContext("2d")) == null || s.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0), this.statusCtx.fillStyle = "#fff", this.statusFontSize = Math.max(this.statusCanvas.width / 55, 10);
  }
  constructor(e, i, t) {
    if (this.title = t || "", this.pixelRatio = window.devicePixelRatio || 1, this.el = e, !this.el.offsetWidth)
      throw new Error("el \u5BBD\u5EA6\u4E0D\u80FD\u4E3A 0");
    this.wsUrl = i, this.wsRecvAt = 0, this.width = this.el.offsetWidth, this.height = this.el.offsetHeight, this.el.className = this.el.className + " wip", this.el.childNodes.forEach((s) => {
      var a;
      (a = this.el) == null || a.removeChild(s);
    }), this.canvas = null, this.ctx = null, this.statusCanvas = null, this.status = null, this.btn = null, this.btnMax = null, this.canvas = this.createHDCanvas(this.width, this.height), this.canvas.className = "wip-video", this.el.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.btn = document.createElement("button"), this.btn.className = "wip-btn", this.btn.onclick = () => {
      var s;
      this.ws && ((s = this.btn) != null && s.className.includes("paused") ? (this.btn.className = this.btn.className.replace(" paused", ""), this.videoCanPlay = !0) : (this.btn.className = this.btn.className + " paused", this.videoCanPlay = !1));
    }, this.el.appendChild(this.btn), this.titleSpan = document.createElement("span"), this.titleSpan.className = "wip-title", this.titleSpan.innerText = this.ws ? this.title : "loading", this.el.appendChild(this.titleSpan), this.btnMax = document.createElement("a"), this.btnMax.className = "wip-btn-max", this.btnMax.innerText = "\u5168\u5C4F", this.btnMax.onclick = () => {
      this.fullscreen();
    }, this.el.appendChild(this.btnMax), this.videoCanPlay = !0;
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
      let i = Math.round(Number(new Date()) / 1e3);
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
      if (this.wsRecvAt > 0 && i - this.wsRecvAt >= 1 && this.statusCanvas) {
        let t = "", s = this.wsRecvAt - this.wsStartAt, a = s / 3600 >= 1 ? parseInt(String(s / 3600)) : 0;
        t = String(a < 10 ? "0" + a : a) + ":", s = s % 3600;
        let r = s / 60 >= 1 ? parseInt(String(s / 60)) : 0;
        t = t + String(r < 10 ? "0" + r : r) + ":", s = s % 60, t = t + (s < 10 ? "0" + s : s), this.statusCtx.clearRect(0, 0, this.statusCanvas.offsetWidth, this.statusCanvas.offsetHeight), this.statusCtx.font = this.statusFontSize + "px sans-serif", this.statusCtx.fillText(t, 10 * this.pixelRatio, this.videoTop - 10, 80 * this.pixelRatio);
      }
      this.wsRecvAt = i;
    }, this.ws.onclose = (e) => {
      console.log(e), this.ws = null, this.titleSpan.innerText = "loading";
    }, this.ws.onerror = (e) => {
      console.log(e), this.ws = null, this.titleSpan.innerText = "loading", setTimeout(() => {
        this.start();
      }, 3e3);
    });
  }
  stop() {
    this.ws && (this.ws.close(), this.ws = null);
  }
  fullscreen() {
    o.isEnabled && (o.on("change", () => {
      this.btnMax.innerText = o.isFullscreen ? "\u9000\u51FA" : "\u5168\u5C4F", this.adapterLayout();
    }), o.isFullscreen ? o.exit() : o.request(this.el));
  }
}
window.WsImagePlayer = f;
export {
  f as default
};
