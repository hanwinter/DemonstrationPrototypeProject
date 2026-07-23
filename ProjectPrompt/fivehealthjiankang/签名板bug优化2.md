继续修复“五健健康管理家长端H5”的手写签名功能。

前几次通过 rotate / transform 模拟横屏签名，导致手机容器尺寸变形、canvas 鼠标落点和笔画位置偏移。现在不要继续使用旋转方案，改为更稳定的“独立横屏签名页”方案。

具体要求：

1. 不再使用 transform: rotate() 实现横屏签名
- 删除签名页中用于旋转整体页面、旋转按钮、旋转文字、旋转 canvas 的样式。
- 不使用 writing-mode。
- 不做竖屏容器内的旋转横屏模拟。

2. 签名时切换到独立横屏签名页
- 用户在知情同意书页面点击“点击手写签名”后，进入一个独立签名状态。
- 此时隐藏原竖屏手机页面内容。
- 显示一个横屏签名页面，视觉尺寸参考手机横屏，例如宽 812px、高 375px，或使用当前预览区域可容纳的等比例尺寸。
- 横屏签名页不要撑大原来的手机竖屏容器。
- 如果项目有 phone-frame / mobile-container，不要把横屏签名页塞进原竖屏容器里。

3. 横屏签名页本身直接按横屏布局写
- 顶部标题：“请手写家长签名”
- 中间是大面积 canvas 签名板
- 底部按钮横向排列：返回、清除重签、确认签名
- 所有文字正常横向显示，不需要用户歪头看。

4. canvas 不允许使用 CSS 旋转
- canvas 按实际显示尺寸初始化。
- 使用 getBoundingClientRect() 获取 canvas 位置。
- 使用 Pointer Events 处理鼠标和触摸：
  pointerdown / pointermove / pointerup / pointercancel
- 坐标计算：
  x = event.clientX - rect.left
  y = event.clientY - rect.top
- 同步 devicePixelRatio：
  canvas.width = rect.width * devicePixelRatio
  canvas.height = rect.height * devicePixelRatio
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
- canvas 设置 touch-action: none，避免手写时页面滚动。

5. 签名完成后返回知情同意书页
- 点击“确认签名”后，将 canvas 转为图片数据。
- 回到原竖屏知情同意书页面。
- 在“家长手写签名”区域展示签名图片预览。
- 已签署后只读展示签名图片。

6. 验证重点
- 打开签名页后，原手机页面尺寸不能变形。
- 横屏签名页不能出现大面积异常空白。
- 鼠标位置和笔画位置必须一致。
- 触摸签名不能偏移。
- 返回后签名图片能正常显示。
- 不影响儿童建档、首诊问卷、专案页、康复页等其他页面。