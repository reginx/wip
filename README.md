# ws-image-player

#### 介绍
通过websocket接收图片二进制内容进行渲染的简单播放器

#### 安装
```
    yarn add @reginx/wip
    npm i @reginx/wip
```

#### 使用
```
    import '@reginx/wip/dist/style.css'
    import WsImagePlayer from '@reginx/wip'

    let player = new WsImagePlayer(document.querySelector('#player'), 'ws://10.8.0.65:17890', '实时预览')
    player.start()
```
