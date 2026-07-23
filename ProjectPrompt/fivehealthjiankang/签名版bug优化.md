继续修复“五健健康管理家长端H5”模块中的全屏手写签名页。

当前问题：
签名页虽然尝试做横屏，但实现方式错误。页面外层仍按竖屏布局，导致签名区域变成右侧竖长白框，页面大面积空白，按钮文字竖排显示，用户横握手机时无法正常阅读和签名。

请重点修复签名页的横屏布局，不要改其他页面。

修改要求：

1. 不要分别旋转按钮、文字、画布
- 删除签名页中针对单个按钮、单个文字、单个画布的 rotate / writing-mode 等样式。
- 不允许出现“确认签名”文字竖排显示。
- 所有文字都必须按横屏方向正常横向阅读。

2. 将整个签名页作为一个横屏容器统一处理
- 签名页使用 fixed 全屏覆盖：
  position: fixed;
  inset: 0;
  z-index 足够高;
  background 使用当前页面浅色背景;
- 内部创建一个横屏签名容器 signature-landscape。
- 在竖屏设备上，通过整体容器旋转实现横屏效果，而不是分别旋转子元素。

推荐实现方式：
- signature-landscape 的视觉宽度使用 100dvh
- 视觉高度使用 100dvw
- 使用 transform: rotate(90deg) translateY(-100%);
- transform-origin: top left;
- 容器内部按正常横向 flex 布局排版。

示例思路：

.signature-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  background: #f3fbf9;
}

.signature-landscape {
  width: 100dvh;
  height: 100dvw;
  transform: rotate(90deg) translateY(-100%);
  transform-origin: top left;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
}

3. 横屏容器内部按正常页面布局
- 顶部显示标题：“请手写家长签名”
- 中间是签名画布，占满主要空间
- 底部一排按钮：返回、清除重签、确认签名
- 按钮横向排列，文字横向显示
- 不要让按钮贴边或遮挡画布

4. 签名画布尺寸
- canvas 外层 flex: 1
- 宽度 100%
- 高度随容器自适应
- 白色背景、浅灰边框、小圆角
- 画布中间提示“请在此处手写签名”，文字横向显示
- 初始化 canvas 时要根据实际容器尺寸设置 canvas.width / canvas.height，避免显示尺寸和绘制尺寸不一致。

5. 禁止签名页滚动
- 签名页打开时 body 不应滚动。
- 签名过程中 touchmove 不能触发页面滚动。
- 关闭签名页后恢复原页面滚动。

6. 适配检查
修复后检查以下效果：
- 进入签名页后，用户横握手机时，标题、按钮、提示文字都是正常方向。
- 签名画布是横向大区域，不是右侧竖长条。
- 页面没有大面积异常空白。
- “返回”“清除重签”“确认签名”按钮不遮挡画布。
- 点击确认签名后，能回到知情同意书页面并正常展示签名图片。

只修改全屏签名页相关布局、样式和签名画布初始化逻辑，不影响知情同意书正文页及其他模块。