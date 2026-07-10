请继续优化“五健家长端 / 儿童健康管理平台”首页快捷入口区域。只替换快捷入口的 4 个 icon，不要修改页面结构、业务逻辑和其他页面。

请将快捷入口的图标替换为以下本地图片：

1. 报告查询
使用：
ProjectImage\报告查询.png

2. 体检报名
使用：
ProjectImage\体检报名.png

3. 问卷量表
使用：
ProjectImage\问卷量表.png

4. 复筛通知
使用：
ProjectImage\复筛通知.png

图片使用要求：

1. 优先按当前项目可访问的相对路径直接引用。
2. 如果不能直接访问 ProjectImage 目录，请复制到项目静态资源目录，例如：
   - public/images/icons/report.png
   - public/images/icons/register.png
   - public/images/icons/questionnaire.png
   - public/images/icons/rescreen.png
3. 前端显示尺寸控制在 44px × 44px 到 48px × 48px。
4. 图片不要拉伸变形，使用：
   object-fit: contain;
5. 保持快捷入口现有布局：
   - 报告查询
   - 体检报名
   - 问卷量表
   - 复筛通知
6. 不要修改快捷入口文字、角标、点击逻辑和卡片样式。

验收标准：

1. 首页快捷入口 4 个入口均显示对应本地图标。
2. 图标清晰、不变形。
3. 快捷入口整体布局不变。
4. 其他模块不受影响。