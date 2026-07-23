继续修复“五健健康管理家长端H5”模块的全屏横向手写签名页。

当前问题：
1. 打开签名页后，外层手机预览容器被撑变形，页面已经不是正常手机尺寸。
2. PC端用鼠标签名时，鼠标位置和实际笔画位置偏移明显，无法正常签名。

请只修复签名页相关布局和 canvas 坐标逻辑，不影响其他页面。

修改要求：

1. 签名页必须脱离手机页面布局
- 签名页使用 fixed 全屏覆盖：
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
- 签名页不要放在会影响手机预览宽高的普通文档流中。
- 打开签名页后，原手机页面尺寸不能变化。
- 不要让签名页内容撑大 `.phone-frame`、`.mobile-container`、`.app-shell` 等外层容器。

2. 横屏签名页整体旋转，不要局部旋转
- 不要分别旋转按钮、文字、canvas。
- 使用一个独立的横屏容器统一旋转。
- 内部标题、按钮、提示文字都按正常横向排版。

参考样式：

.signature-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f3fbf9;
}

.signature-landscape {
  position: absolute;
  left: 0;
  top: 0;
  width: 100dvh;
  height: 100dvw;
  transform: rotate(90deg) translateY(-100%);
  transform-origin: top left;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

3. 修复 canvas 绘制偏移
- canvas 的 CSS 显示尺寸和实际绘制尺寸必须同步。
- 初始化或窗口尺寸变化时，使用 canvas 容器的真实尺寸设置：
  canvas.width = rect.width * devicePixelRatio
  canvas.height = rect.height * devicePixelRatio
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
- 绘制时统一使用 canvas.getBoundingClientRect() 计算坐标。
- 坐标计算必须基于当前 canvas 的实际显示区域：
  x = event.clientX - rect.left
  y = event.clientY - rect.top
- 如果 canvas 所在的横屏容器使用了 transform rotate，必须确认 getBoundingClientRect 后的坐标仍与视觉位置一致。
- 不要再使用页面级 offsetLeft、offsetTop、scrollTop 来计算签名坐标。

4. 鼠标和触摸事件统一处理
- 使用 Pointer Events：
  pointerdown / pointermove / pointerup / pointercancel
- 在 canvas 上设置：
  touch-action: none;
- 签名过程中调用 preventDefault，避免页面滚动。
- 使用 event.clientX / event.clientY，不要使用 pageX/pageY。

5. canvas 布局
- canvas 外层作为签名板主体区域：
  flex: 1;
  width: 100%;
  min-height: 0;
- canvas 自身：
  width: 100%;
  height: 100%;
  display: block;
  background: #fff;
  border: 1px solid #d9e8e4;
  border-radius: 8px;
  touch-action: none;

6. 验证要求
- 打开签名页后，原页面手机尺寸不能变宽、变高或变形。
- 签名页应覆盖整个浏览器视口。
- 用户横握手机时，标题、按钮、提示文字方向正常。
- PC端鼠标落点与笔画位置必须一致。
- 移动端触摸签名不能产生明显偏移。
- 点击确认签名后，返回知情同意书页面，签名图片正常展示。