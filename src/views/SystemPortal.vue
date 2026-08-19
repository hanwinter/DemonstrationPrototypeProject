<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const functions = [
  { title: '外院报告 OCR 识别', text: '识别、校验并导入外院检验报告', path: '/ocr-recognition' },
  { title: '外院报告影像管理', text: '采集、归档与调阅外院报告影像', path: '/external-report-imaging' },
  { title: '外院报告影像 v1.0', text: '右侧预览布局的外院报告采集与归档', path: '/external-report-imaging-v1' },
  { title: '电子产程图', text: '记录并查看产程进展与关键指标', path: '/delivery/partograph' },
  { title: '知情同意书管理', text: '编辑、签署、归档和打印知情同意书', path: '/consent-management' },
  { title: '档案补录工作台', text: '批量处理孕产妇外院报告补录任务', path: '/archive-supplement-workbench' },
  { title: '患者企微关联管理', text: '患者档案企微绑定、标签及孕产信息同步', path: '/enterprise-wechat-customers' },
  { title: '危重孕产妇上报单据', text: '填写危重孕产妇转会诊申请单等上报材料', path: '/maternal/report-forms' },
]
const fiveHealthFunctions = [
  { title: '个人360档案', text: '查看学生五健画像、异常指标与干预建议', path: '/five-health/profile-360' },
  { title: '家长端 H5 演示', text: '查看报名、问卷、报告、复筛与宣教移动端流程', path: '/five-health/parent-mobile' },
  { title: '五健健康管理家长端 H5', text: '查看报名、问卷、报告、复筛与宣教移动端流程', path: '/parent/health' },
  { title: '五健智行专案家长端 H5', text: '查看专案进度、任务、阶段报告与随访反馈', path: '/five-health/zhixing-parent-h5' },
  { title: '收费项目管理', text: '维护体检项目价格、批次内项目与推荐加项配置', path: '/five-health/charge-projects' },
]
const nursingFunctions = [
  { title: '母婴CRM', text: '服务员资料管理与展示', path: '/nursing/crm' },
  { title: '线下活动创建', text: '创建活动、关联服务员并选择本次使用的简历', path: '/nursing/activity/create' },
  { title: '家政服务移动端', text: '月嫂/家政服务人员移动工作台', path: '/nursing/home-log-miniapp' },
  { title: '家政服务管理后台', text: '服务订单、过程、异常与客户运营管理', path: '/nursing/service-admin' },
  { title: '单页面优化', text: '回访提醒等后台单页面优化入口', path: '/maternal-care/single-page-optimization' },
]
const demoPageFunctions = [
  { title: '单页面演示', text: '独立演示、临时验证、专项改造页面统一入口', path: '/demo-pages/work-center' },
]

const systemGroups = [
  { title: '孕产保健系统', items: functions },
  { title: '五健系统', items: fiveHealthFunctions },
  { title: '母婴陪护', items: nursingFunctions },
  { title: '单页面演示', items: demoPageFunctions },
]
</script>

<template>
  <main class="portal">
    <section class="directory">
      <h1>演示项目</h1>
      <section v-for="group in systemGroups" :key="group.title" class="system-section">
        <div class="section-heading">
          <h2>{{ group.title }}</h2>
          <span>{{ group.items.length }} 项</span>
        </div>
        <div class="entry-grid">
          <button v-for="item in group.items" :key="item.path" type="button" @click="router.push(item.path)">
            <span>{{ item.title }}</span>
            <i>→</i>
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.portal{min-height:100vh;padding:40px 32px;color:#25324b;background:#f4f7fb;font-family:"Microsoft YaHei",Arial,sans-serif}.directory{max-width:1120px;margin:0 auto;padding:34px 42px 46px;background:#fff;border:1px solid #e3e8f0;border-radius:10px;box-shadow:0 10px 28px rgba(44,75,120,.06)}.directory h1{margin:0 0 34px;color:#1f2d45;font-size:26px;font-weight:600;letter-spacing:0}.system-section+.system-section{margin-top:42px}.section-heading{padding-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #e6ebf2}.section-heading h2{margin:0;color:#25324b;font-size:20px;font-weight:600;letter-spacing:0}.section-heading span{flex:0 0 auto;color:#7b8798;font-size:13px}.entry-grid{padding-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:34px;row-gap:4px}.entry-grid button{width:100%;min-height:46px;padding:0 10px 0 0;display:flex;align-items:center;justify-content:space-between;gap:18px;text-align:left;color:#2e3b52;border:0;background:transparent;font-size:15px;font-family:inherit;letter-spacing:0;cursor:pointer;transition:color .16s ease,background .16s ease}.entry-grid button span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.entry-grid button i{flex:0 0 auto;color:#8c98aa;font-size:18px;font-style:normal;transition:color .16s ease}.entry-grid button:hover{color:#2f6fca;background:#f6f9fd}.entry-grid button:hover i{color:#2f6fca}@media(max-width:760px){.portal{padding:20px 14px}.directory{padding:24px 18px 30px;border-radius:8px}.directory h1{margin-bottom:28px;font-size:24px}.system-section+.system-section{margin-top:34px}.section-heading h2{font-size:18px}.entry-grid{grid-template-columns:1fr;column-gap:0}.entry-grid button{min-height:44px;padding-right:6px}.entry-grid button span{white-space:normal;line-height:1.45}}
</style>











