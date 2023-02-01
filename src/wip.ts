import screenfull from 'screenfull'

class WsImagePlayer {
  // warpper
  protected declare el: HTMLDivElement | null
  // btn
  protected declare btn: HTMLButtonElement | null
  // status span
  protected declare status: HTMLSpanElement | null
  // canvas
  protected declare canvas: HTMLCanvasElement | null
  // ctx
  protected declare ctx: CanvasRenderingContext2D | null
  // canvas width
  protected declare width: number
  // canvas height
  protected declare height: number

  // video width
  protected declare videoWidth: number
  // video height
  protected declare videoHeight: number
  // video top
  protected declare videoTop: number
  // 是否可以播放
  protected declare videoCanPlay: boolean

  protected declare imageWidth: number
  protected declare imageHeight: number

  // text canvas
  protected declare statusCanvas: HTMLCanvasElement | null
  // text ctx
  protected declare statusCtx: CanvasRenderingContext2D | null

  protected declare statusFontSize: number

  protected declare titleSpan: HTMLSpanElement | null

  // websocket
  protected declare ws: WebSocket | null

  // websocket url
  protected declare wsUrl: string

  // recv frame at
  protected declare wsRecvAt: number

  // start at
  protected declare wsStartAt: number

  protected declare pixelRatio: number

  // video title
  protected declare title: string

  // video title
  protected declare btnMax: HTMLAnchorElement | null

  /**
   * 乘
   * @param {*} arg1
   * @param {*} arg2
   * @returns
   */
  decimalMul(arg1: number | string, arg2: number | string) {
    var m = 0
    var s1 = arg1.toString()
    var s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {
      //
    }
    try {
      m += s2.split('.')[1].length
    } catch (e) {
      //
    }
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
  }

  /**
   * 除
   * @param {*} arg1
   * @param {*} arg2
   * @returns
   */
  decimalDiv(arg1: number | string, arg2: number | string): number {
    var r1 = 0,
      r2 = 0,
      m,
      s1 = arg1.toString(),
      s2 = arg2.toString()
    try {
      if (s1.split('.')[1] !== undefined) r1 = s1.split('.')[1].length
    } catch (e) {
      //
    }
    try {
      if (s2.split('.')[1] !== undefined) r2 = s2.split('.')[1].length
    } catch (e) {
      //
    }
    m = Math.pow(10, Math.max(r1, r2))
    return this.decimalMul(arg1, m) / this.decimalMul(arg2, m)
  }

  /**
   * 创建 canvas 对象
   * @param w 
   * @param h 
   * @returns 
   */
  createHDCanvas (w: number, h: number) : HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.width = w * this.pixelRatio; // 实际渲染像素
    canvas.height = h * this.pixelRatio; // 实际渲染像素
    canvas.style.width = `${w}px`; // 控制显示大小
    canvas.style.height = `${h}px`; // 控制显示大小
    canvas.getContext('2d')?.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    return canvas;
  }

  /**
   * 自适应
   */
  adapterLayout() {
    this.width = this.el!.offsetWidth
    this.height = this.el!.offsetHeight

    // vidoe canvas
    this.canvas!.width = this.width * this.pixelRatio
    this.canvas!.height = this.height * this.pixelRatio
    this.canvas!.style.width = `${this.width}px`
    this.canvas!.style.height = `${this.height}px`
    this.canvas!.getContext('2d')?.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);

    this.videoWidth = this.width
    this.videoHeight = parseInt(
      String(
        this.decimalDiv(
          this.imageHeight,
          this.decimalDiv(this.imageWidth, this.width)
        )
      )
    )
    this.videoTop = parseInt(String(this.decimalDiv(this.height - this.videoHeight, 2)))

    // status canvas
    let w = this.width / 3, h =  Math.max(this.videoTop, 30)
    this.statusCanvas!.width = w * this.pixelRatio
    this.statusCanvas!.height = h * this.pixelRatio
    this.statusCanvas!.style.width = `${w}px`
    this.statusCanvas!.style.height = `${h}px`
    this.statusCanvas!.getContext('2d')?.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.statusCtx!.fillStyle = "#fff";
    this.statusFontSize = Math.max(this.statusCanvas!.width / 55, 10)
  }

  /**
   * 架构方法
   * @param el
   * @param url
   */
  constructor(el: HTMLDivElement, url: string, title: string | null) {
    this.title = title || ''
    this.pixelRatio = window.devicePixelRatio || 1
    this.el = el
    if (!this.el.offsetWidth) {
      throw new Error('el 宽度不能为 0')
    }

    this.wsUrl = url
    this.wsRecvAt = 0

    this.width = this.el!.offsetWidth
    this.height = this.el!.offsetHeight

    this.el!.className = this.el!.className + ' wip'
    this.el!.childNodes.forEach(n => {
      this.el?.removeChild(n)
    })
    this.canvas = null
    this.ctx = null
    this.statusCanvas = null
    this.status = null
    this.btn = null
    this.btnMax = null

    // video canvas
    this.canvas = this.createHDCanvas(this.width, this.height)
    this.canvas.className = 'wip-video'
    this.el!.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    // button
    this.btn = document.createElement('button')
    this.btn.className = 'wip-btn'
    this.btn.onclick = () => {
      if (this.ws) {
        if (this.btn?.className.includes('paused')) {
          this.btn.className = this.btn.className.replace(' paused', '')
          this.videoCanPlay = true
        } else {
          this.btn!.className = this.btn!.className + ' paused'
          this.videoCanPlay = false
        }
      }
    }
    this.el!.appendChild(this.btn)

    // title
    this.titleSpan = document.createElement('span')
    this.titleSpan.className = 'wip-title'
    this.titleSpan.innerText = this.ws ? this.title : 'loading'
    this.el!.appendChild(this.titleSpan)


    // max btn
    this.btnMax = document.createElement('a')
    this.btnMax.className = 'wip-btn-max'
    this.btnMax.innerText = '全屏'
    this.btnMax.onclick = () => {
      this.fullscreen()
    }
    this.el!.appendChild(this.btnMax)

    this.videoCanPlay = true
  }

  /**
   * 初始化状态
   */
  initStatus () {
    // status
    this.statusCanvas = this.createHDCanvas(this.width / 3, Math.max(this.videoTop, 30))
    this.statusCanvas.className = 'wip-status'
    this.el!.appendChild(this.statusCanvas)
    this.statusCtx = this.statusCanvas.getContext('2d')
    this.statusCtx!.fillStyle = "#fff";
    this.statusFontSize = Math.max(this.statusCanvas.width / 55, 10)
  }

  /**
   * 测试服务端并发
   */
  test () {
    for (let i = 0; i < 300; i ++) {
      new WebSocket(this.wsUrl)
    }
  }

  /**
   * 开始播放
   */
  start() {
    if (!this.ws) {
      this.ws = new WebSocket(this.wsUrl)
      this.ws.onopen = () => {
        this.wsStartAt = Math.round(Number(new Date()) / 1000)
        this.titleSpan!.innerText = this.title
      }

      this.ws.onmessage = e => {
        let timeNow = Math.round(Number(new Date()) / 1000)
        if (this.videoCanPlay) {
          let image = new Image()
          image.src = window.URL.createObjectURL(e.data)
          image.onload = () => {
            if (!this.videoWidth) {
              this.imageWidth = image.naturalWidth
              this.imageHeight = image.naturalHeight

              this.videoWidth = this.width
              this.videoHeight = parseInt(
                String(
                  this.decimalDiv(
                    this.imageHeight,
                    this.decimalDiv(this.imageWidth, this.width)
                  )
                )
              )
              this.videoTop = parseInt(String(this.decimalDiv(this.height - this.videoHeight, 2)))
              this.initStatus()
            }
            image.setAttribute('width', this.videoWidth * this.pixelRatio + 'px')
            image.setAttribute('height', this.videoHeight * this.pixelRatio + 'px')

            this.ctx!.drawImage(
              image,
              0,
              this.videoTop > 0 ? this.videoTop : 0,
              this.videoWidth,
              this.videoHeight
            )
          }
        }

        if (this.wsRecvAt > 0  && timeNow - this.wsRecvAt >= 1 && this.statusCanvas) {
          let text = ''
          let seconds = this.wsRecvAt - this.wsStartAt
          let hour = seconds / 3600 >= 1 ? parseInt(String(seconds / 3600)) : 0
          text = String(hour < 10 ? ('0' + hour) : hour) + ":"

          seconds = seconds % 3600
          let min = seconds / 60 >= 1 ? parseInt(String(seconds / 60)) : 0
          text = text + String(min < 10 ? ('0' + min) : min) + ":"

          seconds = seconds % 60
          text = text + (seconds < 10 ? ('0' + seconds) : seconds)
          
          
          this.statusCtx!.clearRect(0, 0, this.statusCanvas!.offsetWidth, this.statusCanvas!.offsetHeight)
          this.statusCtx!.font =  this.statusFontSize + 'px sans-serif'
          this.statusCtx!.fillText(text, 10 * this.pixelRatio, (this.videoTop - 10) , 80 * this.pixelRatio)
        }

        this.wsRecvAt = timeNow
      }

      this.ws.onclose = e => {
        console.log(e)
        this.ws = null
        this.titleSpan!.innerText = 'loading'
      }
      this.ws.onerror = e => {
        console.log(e)
        this.ws = null
        this.titleSpan!.innerText = 'loading'
        setTimeout(() => {
          this.start()
        }, 3000)
      }
    }
  }

  /**
   * 结束
   */
  stop () {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 全屏
   */
  fullscreen () {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        this.btnMax!.innerText = screenfull.isFullscreen ? '退出' : '全屏'
        this.adapterLayout()
      });
      if (screenfull.isFullscreen) {
        screenfull.exit()
      } else {
        screenfull.request(<Element>this.el)
      }
    }
  }
}

export default WsImagePlayer
