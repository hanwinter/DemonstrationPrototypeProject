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
</script>

<template>
  <main class="portal">
    <header><h1>妇幼健康业务系统</h1></header>
    <section class="hero"><h2>业务应用总入口</h2></section>
    <section class="systems">
      <article class="system maternal">
        <div class="heading"><h3>孕产保健系统</h3><em>{{ functions.length }} 项功能</em></div>
        <div class="function-grid">
          <button v-for="item in functions" :key="item.path" type="button" @click="router.push(item.path)">
            <span><strong>{{ item.title }}</strong><small>{{ item.text }}</small></span><i>→</i>
          </button>
        </div>
      </article>
      <article class="system five-health-system">
        <div class="heading"><div class="five-heading"><div class="five-health">五健</div><h3>五健系统</h3></div><em>5 项功能</em></div>
        <div class="function-grid single"><button v-for="item in fiveHealthFunctions" :key="item.path" type="button" @click="router.push(item.path)"><span><strong>{{ item.title }}</strong><small>{{ item.text }}</small></span><i>→</i></button></div>
      </article>
      <article class="system nursing-system">
        <div class="heading"><div class="five-heading"><div class="five-health nursing-icon">母婴</div><h3>母婴陪护</h3></div><em>{{ nursingFunctions.length }} 项功能</em></div>
        <p class="system-desc">母婴服务人员管理、线下活动、家政服务移动端及管理后台</p>
        <div class="function-grid single"><button v-for="item in nursingFunctions" :key="item.path" type="button" @click="router.push(item.path)"><span><strong>{{ item.title }}</strong><small>{{ item.text }}</small></span><i>→</i></button></div>
      </article>
    </section>
    <footer>妇幼健康信息化平台 · 演示环境</footer>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.portal{min-height:100vh;color:#25324b;background:radial-gradient(circle at 85% 0,#dcecff 0,transparent 28%),#f4f7fb;font-family:"Microsoft YaHei",Arial,sans-serif}header{height:72px;padding:0 max(32px,calc((100vw - 1280px)/2));display:flex;align-items:center;background:rgba(255,255,255,.92);border-bottom:1px solid #e5eaf2}header h1{margin:0;font-size:18px}.hero{max-width:1280px;margin:auto;padding:38px 32px 24px}.hero h2{margin:0;font-size:34px}.system p{margin:0;color:#718096}.systems{max-width:1280px;margin:auto;padding:0 32px 48px;display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:22px}.system{border:1px solid #e2e8f2;border-radius:18px;background:#fff;box-shadow:0 12px 36px rgba(44,75,120,.08)}.maternal{padding:28px}.heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.system b{display:inline-block;padding:4px 9px;color:#24745a;font-size:12px;border-radius:20px;background:#e8f7f1}.system h3{margin:0;font-size:23px}.disabled h3{margin:12px 0 7px}.heading em{color:#3878d1;font-size:13px;font-style:normal}.function-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.function-grid button{min-height:66px;padding:10px 14px;display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #e6ebf3;border-radius:13px;background:#fbfcfe;cursor:pointer;transition:.18s}.function-grid button:hover{border-color:#80aff1;background:#f4f8ff;transform:translateY(-2px);box-shadow:0 8px 20px rgba(46,111,202,.1)}.function-grid button span{flex:1;display:flex;flex-direction:column;gap:3px}.function-grid small{color:#8490a2;line-height:1.4}.function-grid i{color:#91a0b5;font-size:20px;font-style:normal}.disabled{padding:28px;display:flex;flex-direction:column;align-items:flex-start;background:linear-gradient(160deg,#fff,#f7f9fc)}.five-health{width:64px;height:64px;margin-bottom:26px;display:grid;place-items:center;color:#8d99aa;font-weight:700;border-radius:18px;background:#edf0f4}.disabled b{color:#7b8491;background:#edf0f3}.disabled p{line-height:1.7}.disabled button{width:100%;height:40px;margin-top:auto;color:#98a2b1;border:1px solid #dce1e8;border-radius:9px;background:#f1f3f6;cursor:not-allowed}footer{padding:0 32px 28px;color:#a0a9b7;font-size:12px;text-align:center}@media(max-width:900px){.systems{grid-template-columns:1fr}.function-grid{grid-template-columns:1fr}.disabled p{margin-bottom:24px}}
.five-health-system,.nursing-system{padding:28px}.five-heading{display:flex;align-items:center;gap:14px}.five-heading .five-health{width:52px;height:52px;margin:0;color:#fff;border-radius:14px;background:#447afc}.five-heading .nursing-icon{background:#12a8ad}.five-health-system .function-grid.single,.nursing-system .function-grid.single{grid-template-columns:1fr}.system-desc{min-height:40px;margin:-8px 0 18px;color:#718096;line-height:1.6}
</style>











