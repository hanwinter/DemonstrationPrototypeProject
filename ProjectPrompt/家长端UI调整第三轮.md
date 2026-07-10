请继续修正家长端登录页顶部导航栏样式，只修改登录页顶部栏，不要影响其他页面。

当前问题：
登录页顶部导航栏中的“儿童健康管理平台”文字几乎看不到。原因是顶部栏背景偏浅，同时标题文字使用了白色，导致对比度不足。左侧返回按钮也过淡。

本次目标：
让登录页顶部导航栏与青绿色主视觉背景融合，同时保证标题和返回按钮清晰可见。

一、登录页顶部导航栏改为透明叠加模式

仅登录页使用该样式，不影响其他页面顶部导航栏。

登录页顶部导航栏要求：

1. 顶部导航栏背景改为透明：
background: transparent;

2. 不要使用浅白色蒙层。
如果当前有 backdrop-filter、opacity、rgba(255,255,255,0.6) 等样式，请在登录页中覆盖掉。

3. 顶部栏标题文字：
color: #FFFFFF;
font-weight: 700;

4. 标题可以增加轻微文字阴影，提高可读性：
text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

5. 顶部栏底部分割线隐藏：
border-bottom: none;
box-shadow: none;

二、返回按钮修正

登录页左侧返回按钮要求：

1. 按钮背景：
background: rgba(255, 255, 255, 0.22);

2. 图标颜色：
color: #FFFFFF;

3. 按钮边框：
border: 1px solid rgba(255, 255, 255, 0.28);

4. 按钮可增加轻微模糊质感：
backdrop-filter: blur(8px);

5. 不要使用当前过浅、几乎不可见的返回按钮样式。

三、右侧图标处理

登录页未登录状态不建议突出通知入口。

请按以下方式处理：

优先方案：
1. 登录页隐藏右侧铃铛图标。

如果项目结构必须保留右侧图标占位：
1. 图标背景使用 rgba(255,255,255,0.16)
2. 图标颜色使用 #FFFFFF
3. 透明度不低于 0.85，避免不可见
4. 不要使用浅绿背景 + 白色图标的组合

四、顶部栏所在区域

当前登录页顶部青绿色背景从导航栏下方开始，导致导航栏处于浅色区域。请调整背景层级：

1. 青绿色渐变背景需要从页面最顶部开始铺开，包括状态栏和顶部导航栏区域。
2. 不要让顶部导航栏单独落在浅薄荷绿背景上。
3. 登录页背景伪元素或背景层 top 必须为 0。
4. 顶部青绿色背景高度保持 46% 左右即可。

参考样式：

.login-page {
  position: relative;
  min-height: 100vh;
  background: #EAF8F5;
  overflow: hidden;
}

.login-page::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 48%;
  background: linear-gradient(135deg, #46D2D2 0%, #12A8AD 100%);
  border-bottom-left-radius: 36px;
  border-bottom-right-radius: 36px;
  z-index: 0;
}

.login-page .page-header {
  position: relative;
  z-index: 2;
  background: transparent;
  border-bottom: none;
  box-shadow: none;
}

.login-page .page-header-title {
  color: #FFFFFF;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.login-page .back-button {
  background: rgba(255, 255, 255, 0.22);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(8px);
}

五、主视觉内容位置微调

当前主视觉中已经有“儿童健康管理平台 / 关注孩子成长健康 / 筛查报告、复筛提醒、健康建议一站查看”，这部分可以保留。

但要注意：
1. 顶部导航栏标题与主视觉小标题不要挤在一起。
2. 主视觉内容建议距离顶部导航栏下方 48px-64px。
3. 主视觉内容不要遮挡导航栏标题。

六、不要做的事情

1. 不要把顶部标题改成浅色背景上的白色文字。
2. 不要让顶部导航栏继续使用半透明浅白背景。
3. 不要影响首页、报告页、复筛页等其他页面的顶部栏样式。
4. 不要修改登录逻辑。
5. 不要重做登录页。
6. 不要删除主视觉区域。

七、验收标准

完成后登录页应满足：

1. 顶部“儿童健康管理平台”清晰可见。
2. 标题为白色，并叠加在青绿色渐变背景上。
3. 返回按钮清晰可见。
4. 顶部栏与主视觉背景融合，不再出现浅色背景吃掉白字的问题。
5. 只影响登录页，不影响其他家长端页面。