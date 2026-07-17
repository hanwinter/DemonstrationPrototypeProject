<script setup>
import { computed, ref } from 'vue'

const lisReportImage = new URL('../../ProjectImage/lis化验单.png', import.meta.url).href
const pacsReportImage = new URL('../../ProjectImage/超声报告单.png', import.meta.url).href
import {
  Bell,
  Calendar,
  ChatDotRound,
  Checked,
  Document,
  House,
  Notebook,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'

const activeTab = ref('home')
const activeChildId = ref(1)
const activeProjectPanel = ref('flow')
const activeSpecialProjectId = ref('vision')
const activeReportDoc = ref(null)
const reportZoom = ref(1)

const children = [
  { id: 1, name: '林一凡', gender: '男', age: 8, birthday: '2018-03-16', cardNo: '1101********0816', phone: '138****1234', default: true },
  { id: 2, name: '林小雨', gender: '女', age: 6, birthday: '2020-07-02', cardNo: '1101********0902', phone: '138****1234', default: false },
]

const project = {
  name: '视力健康管理专案',
  specialty: '儿童眼保健专科',
  doctor: '王医生',
  therapist: '李老师',
  status: '个案管理中',
  stage: '第 2 阶段 / 家庭干预与康复训练',
  startDate: '2026-03-28',
  progress: 68,
  nextVisit: { time: '2026-04-18 09:30', dept: '儿童眼保健专科', doctor: '王医生', place: '门诊三楼 眼保健诊室', status: '待复诊' },
  rehab: { time: '每周二、周五 16:30', item: '视觉训练', therapist: '李老师', status: '待确认' },
}

const todos = [
  { title: '随访问卷待填写', desc: '反馈近一周用眼与户外活动情况', status: '待完成' },
  { title: '本周家庭训练记录待提交', desc: '上传视觉训练完成情况', status: '待提交' },
  { title: '康复预约待确认', desc: '确认本周五 16:30 训练时段', status: '待确认' },
]

const caseFlow = [
  { title: '儿童建档', desc: '已完成基础档案与联系方式登记', status: '已完成' },
  { title: '首诊问卷', desc: '首次专科就诊前填写', status: '已提交' },
  { title: '知情同意书', desc: '参加个案管理前必须签署', status: '已签署' },
  { title: '专科诊疗报告', desc: '查看诊疗结论、主要问题和医生建议', status: '已生成' },
]

const report = {
  time: '2026-04-02',
  conclusion: '左眼裸眼视力低于同龄参考范围，存在近视进展风险；体格发育总体正常，建议结合家庭训练和复诊计划持续管理。',
  problems: ['左眼裸眼视力下降', '近距离用眼时间偏长', '户外活动不足'],
  advice: '继续执行视觉训练，每日户外活动不少于 2 小时，晚间阅读每 30 分钟休息 5 分钟。',
}

const trends = [
  { name: '裸眼视力', value: '4.6 → 4.7', data: [42, 46, 44, 50], unit: '趋势改善' },
  { name: '屈光度', value: '-1.25D → -1.10D', data: [72, 62, 58, 54], unit: '轻度改善' },
  { name: '眼轴长度', value: '24.1mm → 24.0mm', data: [54, 58, 56, 55], unit: '基本稳定' },
  { name: 'BMI', value: '18.7', data: [45, 48, 47, 46], unit: '正常范围' },
]

const rehabPlan = {
  item: '视觉功能训练',
  frequency: '每周 2 次',
  cycle: '8 周',
  goal: '改善调节能力，建立稳定用眼习惯',
}

const appointments = [
  { time: '04月16日 周二 16:30', status: '已预约', action: '变更预约' },
  { time: '04月19日 周五 16:30', status: '待确认', action: '确认预约' },
]

const leaves = [
  { time: '04月12日 16:30', reason: '学校活动冲突', status: '已同意' },
  { time: '04月23日 16:30', reason: '家庭行程待确认', status: '待确认' },
]

const familyServices = [
  { title: '家长手册', desc: '近视防控家庭训练指南', icon: '册' },
  { title: '在线互动', desc: '向王医生提交图文留言', icon: '聊' },
  { title: '随访问卷', desc: '1 份待填写，2 份已提交', icon: '卷' },
  { title: '家庭训练记录', desc: '本周还需提交 1 次', icon: '训' },
]

const messages = [
  { from: '家长', text: '孩子最近晚饭后阅读时间较长，训练后说眼睛有点酸。' },
  { from: '王医生', text: '训练强度可以先降低到 15 分钟，阅读期间保持休息节奏，如酸胀持续请提前复诊。' },
]

const assessments = [
  { title: '身高体重智能评估', result: 'BMI 18.7，体格发育正常', advice: '保持规律运动和均衡饮食。' },
  { title: '营养调查', result: '蔬果摄入略不足', advice: '建议增加深色蔬菜和优质蛋白。' },
]


const specialProjects = ref([
  {
    id: 'vision', type: '视力', name: '视力健康管理专案', specialty: '儿童眼保健专科', doctor: '王医生', status: '管理中', consent: true, progress: 68, startDate: '2026-03-28', stage: '管理', currentStep: 3,
    flow: [
      { title: '儿童建档', desc: '已完成基础档案与联系方式登记', status: '已完成' },
      { title: '首诊问卷', desc: '首次专科就诊信息已提交', status: '已提交' },
      { title: '知情同意书', desc: '该视力专案已完成签署', status: '已签署' },
      { title: '专科诊疗报告', desc: '儿童眼保健专科报告已生成', status: '已生成' },
      { title: '复诊计划', desc: '2026-04-18 09:30 待复诊', status: '待复诊' },
      { title: '家庭训练记录', desc: '本周视觉训练记录待提交', status: '待提交' },
      { title: '结案评估', desc: '完成管理周期后开放', status: '未开始' },
    ],
    report: {
      time: '2026-04-02', conclusion: '存在近视发展风险，建议进行用眼行为干预与定期复查', problems: ['裸眼视力下降', '远视储备不足', '眼轴增长偏快'], advice: '增加户外活动，控制近距离用眼，按计划复诊',
      lis: [
        { name: '维生素D检测', date: '2026-04-08', summary: '25-羟基维生素D偏低', image: lisReportImage },
        { name: '血常规', date: '2026-04-08', summary: '未见明显异常', image: lisReportImage },
        { name: '微量元素检测', date: '2026-04-09', summary: '锌偏低，建议结合医生指导', image: lisReportImage },
      ],
      pacs: [
        { name: '超声报告单', date: '2026-04-08', part: '腹部超声', summary: '未见明显异常', image: pacsReportImage },
        { name: '眼底照相报告', date: '2026-04-09', part: '眼底', summary: '未见明显器质性异常，建议随访观察', image: pacsReportImage },
      ],
      trends: [{ name: '裸眼视力', value: '4.6 → 4.7', data: [42, 46, 44, 50] }, { name: '屈光度', value: '-1.25D → -1.10D', data: [72, 62, 58, 54] }, { name: '眼轴长度', value: '24.1mm → 24.0mm', data: [54, 58, 56, 55] }, { name: '远视储备', value: '+0.25D', data: [38, 40, 42, 43] }],
    },
    services: [
      { title: '个性化健康指导', desc: '医生推送用眼行为建议：每日户外活动不少于 2 小时。', icon: '导' },
      { title: '家庭训练记录', desc: '本周视觉训练待提交，可查看历史训练记录。', icon: '训' },
      { title: '随访问卷', desc: '本月随访问卷待填写。', icon: '卷' },
      { title: '在线互动', desc: '家长留言、图片记录与医生回复。', icon: '聊' },
      { title: '家长手册', desc: '视力健康家庭干预手册。', icon: '册' },
    ],
  },
  {
    id: 'weight', type: '体重', name: '体重与营养管理专案', specialty: '儿童营养专科', doctor: '刘医生', status: '待签署', consent: false, progress: 12, startDate: '2026-04-08', stage: '授权', currentStep: 2,
    flow: [
      { title: '儿童建档', desc: '已完成身高体重与基础信息登记', status: '已完成' },
      { title: '首诊问卷', desc: '饮食与运动情况已提交', status: '已提交' },
      { title: '知情同意书', desc: '该体重营养专案待签署', status: '待签署' },
      { title: '营养评估报告', desc: '签署后开放查看', status: '未开放' },
      { title: '随访问卷', desc: '签署后接收医生推送', status: '未开放' },
      { title: '家庭饮食记录', desc: '签署后开放提交', status: '未开放' },
    ],
    report: { time: '待开放', conclusion: '签署知情同意书后开放营养评估报告。', problems: ['BMI 偏高', '蔬果摄入不足'], advice: '签署后查看医生建议', lis: [], pacs: [], trends: [] },
    services: [],
  },
])

const lifecycleSteps = ['建档', '首诊', '授权', '管理', '复诊', '结案']
const currentProject = computed(() => specialProjects.value.find((item) => item.id === activeSpecialProjectId.value) || specialProjects.value[0])
function selectSpecialProject(id) {
  activeSpecialProjectId.value = id
  activeProjectPanel.value = 'flow'
  activeReportDoc.value = null
}
function openReportDoc(item, type) {
  activeReportDoc.value = { ...item, type }
}
function closeReportDoc() {
  activeReportDoc.value = null
}
function signCurrentProject() {
  currentProject.value.consent = true
  currentProject.value.status = '管理中'
  currentProject.value.progress = Math.max(currentProject.value.progress, 28)
}
function stepState(index) {
  if (index < currentProject.value.currentStep) return 'done'
  if (index === currentProject.value.currentStep) return 'current'
  return 'todo'
}
const currentChild = computed(() => children.find((item) => item.id === activeChildId.value) || children[0])

function go(tab) {
  activeTab.value = tab
}
</script>

<template>
  <main class="zhixing-demo">
    <section class="phone-shell">
      <header class="phone-top">
        <strong>五健智行专案</strong>
        <button type="button" aria-label="消息"><el-icon><Bell /></el-icon></button>
      </header>

      <section class="phone-content">
        <section v-if="activeTab === 'home'" class="screen home-screen">
          <article class="hero-card">
            <span>五健智行专案管理</span>
            <h1>{{ project.name }}</h1>
            <p>{{ currentChild.name }}｜{{ currentChild.gender }}｜{{ currentChild.age }}岁｜{{ project.status }}</p>
          </article>

          <article class="child-card overlap-card">
            <div>
              <strong>{{ currentChild.name }}</strong>
              <p>{{ project.specialty }}｜{{ project.doctor }}</p>
            </div>
            <em>{{ project.status }}</em>
          </article>

          <section class="todo-strip">
            <button v-for="item in todos" :key="item.title" type="button" @click="go('project')">
              <b>{{ item.status }}</b><span>{{ item.title }}</span><small>{{ item.desc }}</small>
            </button>
          </section>

          <article class="visit-card">
            <div class="section-head"><strong>下次复诊提醒</strong><span>{{ project.nextVisit.status }}</span></div>
            <p>{{ project.nextVisit.time }}｜{{ project.nextVisit.dept }}</p>
            <small>{{ project.nextVisit.doctor }}｜{{ project.nextVisit.place }}</small>
          </article>

          <article class="visit-card rehab-home-card">
            <div class="section-head"><strong>本周康复安排</strong><button type="button" @click="go('rehab')">查看</button></div>
            <p>{{ project.rehab.time }}｜{{ project.rehab.item }}</p>
            <small>{{ project.rehab.therapist }}｜{{ project.rehab.status }}</small>
          </article>

          <article class="guide-card">
            <strong>个性化健康指导</strong>
            <p>{{ report.advice }}</p>
          </article>

          <section class="edu-list">
            <div class="section-head"><strong>公共健康科普</strong><small>宣教文章 / 视频</small></div>
            <button type="button"><b>视</b><span>儿童近视防控家庭要点</span><small>3 分钟阅读</small></button>
            <button type="button"><b>动</b><span>户外活动与眼健康</span><small>宣教视频</small></button>
          </section>
        </section>

        <section v-else-if="activeTab === 'project'" class="screen project-screen">
          <article class="project-child-card">
            <strong>{{ currentChild.name }}｜{{ currentChild.gender }}｜{{ currentChild.age }}岁</strong>
            <em>已参与 {{ specialProjects.length }} 个专案</em>
          </article>

          <section class="project-switcher">
            <button v-for="item in specialProjects" :key="item.id" :class="{ active: item.id === currentProject.id }" type="button" @click="selectSpecialProject(item.id)">
              <div><strong>{{ item.name }}</strong><small>{{ item.type }}｜{{ item.status }}</small></div>
            </button>
          </section>

          <article class="project-status-card current-project-card">
            <div class="project-detail-main">
              <strong>{{ currentProject.name }}</strong>
              <p>{{ currentProject.specialty }}｜主治医生：{{ currentProject.doctor }}｜开始：{{ currentProject.startDate }}</p>
              <p v-if="!currentProject.consent" class="consent-inline">知情同意未签署</p>
            </div>
            <section class="lifecycle-card">
              <div v-for="(step, index) in lifecycleSteps" :key="step" :class="['life-step', stepState(index)]"><i></i><span>{{ step }}</span></div>
            </section>
          </article>

          <article v-if="!currentProject.consent" class="project-lock-tip">
            <strong>该专案尚未签署知情同意书</strong>
            <p>签署后可查看该专案报告、健康指导和家庭服务。</p>
            <button type="button" @click="signCurrentProject">去签署知情同意书</button>
          </article>

          <div class="project-tabs">
            <button :class="{ active: activeProjectPanel === 'flow' }" type="button" @click="activeProjectPanel = 'flow'">流程</button>
            <button :class="{ active: activeProjectPanel === 'report' }" type="button" @click="activeProjectPanel = 'report'">报告</button>
            <button :class="{ active: activeProjectPanel === 'service' }" type="button" @click="activeProjectPanel = 'service'">家庭服务</button>
          </div>

          <template v-if="activeProjectPanel === 'flow'">
            <section class="flow-timeline"><article v-for="item in currentProject.flow" :key="item.title" class="flow-row"><i></i><div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span>{{ item.status }}</span></article></section>
          </template>

          <template v-else-if="activeProjectPanel === 'report'">
            <article v-if="!currentProject.consent" class="locked-card"><strong>报告暂未开放</strong><p>该专案尚未签署知情同意书，签署后可查看专科诊疗报告、LIS 化验单、PACS 检查报告和趋势数据。</p><button type="button" @click="signCurrentProject">去签署</button></article>

            <template v-else>
              <article class="report-card"><div class="section-head"><strong>专科诊疗报告</strong><small>{{ currentProject.report.time }}</small></div><p>{{ currentProject.report.conclusion }}</p><div class="problem-tags"><span v-for="item in currentProject.report.problems" :key="item">{{ item }}</span></div><div class="doctor-advice">{{ currentProject.report.advice }}</div></article>
              <section class="archive-section"><div class="archive-head"><strong>LIS 化验单归档</strong><span>共 {{ currentProject.report.lis.length }} 份</span></div><article v-for="item in currentProject.report.lis" :key="item.name" class="archive-card compact"><div class="archive-info"><div class="archive-title"><strong>{{ item.name }}</strong><button type="button" @click="openReportDoc(item, 'lis')">图文报告 ></button></div><p>检查日期：{{ item.date }}</p><small>结果摘要：{{ item.summary }}</small></div></article></section>
              <section class="archive-section"><div class="archive-head"><strong>PACS 检查报告归档</strong><span>共 {{ currentProject.report.pacs.length }} 份</span></div><article v-for="item in currentProject.report.pacs" :key="item.name" class="archive-card compact"><div class="archive-info"><div class="archive-title"><strong>{{ item.name }}</strong><button type="button" @click="openReportDoc(item, 'pacs')">图文报告 ></button></div><p>检查日期：{{ item.date }}</p><p>检查部位：{{ item.part }}</p><small>诊断摘要：{{ item.summary }}</small></div></article></section>
              <section class="trend-grid"><article v-for="item in currentProject.report.trends" :key="item.name" class="trend-card"><div><strong>{{ item.name }}</strong><span>趋势</span></div><b>{{ item.value }}</b><svg viewBox="0 0 120 44" preserveAspectRatio="none"><polyline :points="item.data.map((v, i) => `${i * 40},${44 - v / 2}`).join(' ')" /></svg></article></section>
            </template>
          </template>

          <template v-else>
            <article v-if="!currentProject.consent" class="locked-card"><strong>家庭服务暂未开放</strong><p>签署知情同意书后，可查看医生指导、随访问卷和家庭训练记录。</p><button type="button" @click="signCurrentProject">去签署</button></article>
            <template v-else><article v-for="item in currentProject.services" :key="item.title" class="service-row"><b>{{ item.icon }}</b><div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span>进入</span></article><article class="message-card"><strong>在线互动</strong><p v-for="item in messages" :key="item.text"><b>{{ item.from }}：</b>{{ item.text }}</p></article></template>
          </template>
        </section>
        <section v-else-if="activeTab === 'rehab'" class="screen">
          <div class="page-title"><h2>康复</h2><p>康复计划、预约、变更和请假申请</p></div>
          <article class="rehab-plan-card">
            <div class="section-head"><strong>{{ rehabPlan.item }}</strong><span>执行中</span></div>
            <div class="info-grid"><p><b>频次</b>{{ rehabPlan.frequency }}</p><p><b>周期</b>{{ rehabPlan.cycle }}</p><p><b>目标</b>{{ rehabPlan.goal }}</p></div>
          </article>
          <article v-for="item in appointments" :key="item.time" class="appointment-row">
            <div><strong>{{ item.time }}</strong><p>{{ project.rehab.item }}｜{{ project.therapist }}</p></div><span>{{ item.status }}</span><button type="button">{{ item.action }}</button>
          </article>
          <article class="leave-card">
            <div class="section-head"><strong>请假申请</strong><button type="button">发起请假</button></div>
            <div v-for="item in leaves" :key="item.time" class="leave-row"><span>{{ item.time }}</span><p>{{ item.reason }}</p><b>{{ item.status }}</b></div>
          </article>
          <article class="therapist-card">
            <strong>{{ project.therapist }}</strong><p>儿童康复科｜视觉训练康复师</p><button type="button">联系康复师</button>
          </article>
        </section>

        <section v-else class="screen">
          <article class="profile-card">
            <strong>{{ currentChild.name }}</strong>
            <p>{{ currentChild.gender }}｜{{ currentChild.age }}岁｜生日 {{ currentChild.birthday }}</p>
            <span>当前专案：{{ project.name }}</span>
          </article>
          <section class="children-card">
            <div class="section-head"><strong>儿童档案管理</strong><button type="button">添加儿童</button></div>
            <button v-for="item in children" :key="item.id" :class="{ active: item.id === activeChildId }" type="button" @click="activeChildId = item.id">
              <span><b>{{ item.name }}</b><small>{{ item.cardNo }}｜{{ item.phone }}</small></span><em>{{ item.default ? '默认' : '切换' }}</em>
            </button>
          </section>
          <button class="mine-row" type="button">儿童建档</button>
          <button class="mine-row" type="button">专案参与记录</button>
          <button class="mine-row" type="button">消息通知</button>
          <button class="mine-row" type="button">家长手册</button>
          <button class="mine-row" type="button">设置</button>
        </section>
      </section>

      <section v-if="activeReportDoc" class="report-viewer">
        <header class="viewer-top"><button type="button" @click="closeReportDoc">返回</button><div><strong>图文报告</strong><p>{{ activeReportDoc.name }}｜{{ activeReportDoc.date }}</p></div></header>
        <div class="viewer-tools"><button type="button" @click="zoomReport(.2)">放大</button><button type="button" @click="zoomReport(-.2)">缩小</button><button type="button" @click="fitReport">适应屏幕</button></div>
        <div class="viewer-stage"><img :src="activeReportDoc.image" :alt="activeReportDoc.name" :style="{ width: (reportZoom * 100) + '%' }" /></div>
      </section>

      <nav v-if="!activeReportDoc" class="bottom-tabs">
        <button :class="{ active: activeTab === 'home' }" type="button" @click="go('home')"><el-icon><House /></el-icon><span>首页</span></button>
        <button :class="{ active: activeTab === 'project' }" type="button" @click="go('project')"><el-icon><Document /></el-icon><span>专案</span></button>
        <button :class="{ active: activeTab === 'rehab' }" type="button" @click="go('rehab')"><el-icon><Calendar /></el-icon><span>康复</span></button>
        <button :class="{ active: activeTab === 'mine' }" type="button" @click="go('mine')"><el-icon><User /></el-icon><span>我的</span></button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}button{font:inherit}.zhixing-demo{min-height:100vh;padding:24px;background:linear-gradient(180deg,#f7fefc 0%,#eaf8f5 100%);font-family:"Microsoft YaHei",Arial,sans-serif;color:#20343a}.phone-shell{width:min(390px,100%);height:calc(100vh - 48px);min-height:720px;margin:auto;position:relative;overflow:hidden;border-radius:34px;background:#f8fcfb;border:1px solid rgba(216,238,234,.7);box-shadow:0 20px 60px rgba(18,168,173,.11)}.phone-top{height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #e5efeb}.phone-top strong{font-size:17px}.phone-top button{width:34px;height:34px;border:0;border-radius:50%;display:grid;place-items:center;background:#eef8f4;color:#12a8ad}.phone-content{height:calc(100% - 118px);overflow:auto;padding:14px 14px 24px}.screen{display:flex;flex-direction:column;gap:12px}.hero-card{min-height:174px;margin:-14px -14px 0;padding:22px 22px 34px;color:#fff;background:linear-gradient(135deg,#46d2d2 0%,#12a8ad 100%);border-radius:0 0 30px 30px}.hero-card span{display:inline-flex;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.18);font-size:12px}.hero-card h1{width:260px;margin:12px 0 8px;font-size:24px;line-height:1.28;letter-spacing:0}.hero-card p{margin:0;color:rgba(255,255,255,.88);font-size:13px}.child-card,.visit-card,.guide-card,.edu-list,.project-status-card,.flow-row,.consent-tip,.report-card,.trend-card,.service-row,.message-card,.assessment-card,.rehab-plan-card,.appointment-row,.leave-card,.therapist-card,.profile-card,.children-card,.mine-row{border:1px solid rgba(216,238,234,.72);border-radius:18px;background:#fff;box-shadow:0 10px 28px rgba(38,191,195,.07)}.overlap-card{position:relative;z-index:2;margin:-24px 4px 0}.child-card{padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px}.child-card strong,.profile-card strong{font-size:22px}.child-card p,.visit-card p,.guide-card p,.page-title p,.project-status-card p,.flow-row p,.report-card p,.service-row p,.message-card p,.assessment-card p,.appointment-row p,.therapist-card p,.profile-card p{margin:5px 0 0;color:#60757c;font-size:13px;line-height:1.55}.child-card em,.section-head span,.flow-row span,.appointment-row span,.rehab-plan-card span{padding:4px 8px;border-radius:999px;background:#e4f8f6;color:#12a8ad;font-size:12px;font-style:normal;font-weight:700}.todo-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.todo-strip button{min-width:0;min-height:92px;padding:10px;border:0;border-radius:16px;background:#fff;box-shadow:0 8px 22px rgba(38,191,195,.07);text-align:left}.todo-strip b{display:inline-block;margin-bottom:7px;color:#12a8ad;font-size:12px}.todo-strip span{display:block;color:#20343a;font-size:13px;font-weight:700;line-height:1.25}.todo-strip small{display:block;margin-top:5px;color:#8a9ca1;font-size:11px;line-height:1.35}.visit-card,.guide-card,.edu-list,.project-status-card,.consent-tip,.report-card,.message-card,.assessment-card,.rehab-plan-card,.leave-card,.therapist-card,.profile-card,.children-card{padding:15px}.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.section-head strong{font-size:16px}.section-head small{color:#8a9ca1}.section-head button,.leave-card button,.therapist-card button,.children-card button{border:0;background:transparent;color:#12a8ad;font-weight:700}.visit-card small{display:block;margin-top:4px;color:#8a9ca1}.edu-list{display:flex;flex-direction:column;gap:9px}.edu-list button{border:0;border-radius:14px;background:#f6fbfa;padding:10px;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:9px;text-align:left}.edu-list b,.service-row>b{width:34px;height:34px;border-radius:13px;background:#e4f8f6;color:#12a8ad;display:grid;place-items:center}.edu-list span{font-weight:700}.edu-list small{color:#8a9ca1}.page-title h2{margin:0;font-size:20px}.progress{height:8px;margin:13px 0 0;border-radius:999px;background:#dceae5;overflow:hidden}.progress i{display:block;height:100%;border-radius:999px;background:#12a8ad}.section-head b{color:#12a8ad;font-size:22px}.segmented{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.segmented button{height:32px;border:1px solid rgba(216,238,234,.85);border-radius:999px;background:#fff;color:#60757c}.segmented button.active{border-color:#e4f8f6;background:#e4f8f6;color:#12a8ad;font-weight:700}.flow-row,.appointment-row{padding:13px 14px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.consent-tip{background:#f3faf8}.problem-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.problem-tags span{padding:4px 8px;border-radius:999px;background:#fff0e8;color:#c96d20;font-size:12px}.trend-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.trend-card{padding:12px}.trend-card div{display:flex;justify-content:space-between;gap:8px}.trend-card span{color:#8a9ca1;font-size:12px}.trend-card b{display:block;margin-top:8px;color:#20343a}.trend-card svg{width:100%;height:44px;margin-top:6px}.trend-card polyline{fill:none;stroke:#12a8ad;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.service-row{padding:12px;display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}.service-row span{color:#12a8ad;font-size:13px;font-weight:700}.message-card p{padding:9px 0;border-top:1px solid rgba(216,238,234,.72)}.assessment-card small{color:#12a8ad;font-weight:700}.info-grid{display:grid;gap:8px;margin-top:10px}.info-grid p{margin:0;padding:10px;border-radius:12px;background:#f6fbfa;color:#60757c;font-size:13px;line-height:1.5}.info-grid b{display:block;color:#20343a;margin-bottom:3px}.appointment-row{grid-template-columns:1fr auto auto}.appointment-row button{border:0;border-radius:999px;background:#e4f8f6;color:#12a8ad;padding:6px 9px;font-size:12px;font-weight:700}.leave-row{display:grid;grid-template-columns:86px 1fr auto;gap:8px;align-items:center;padding:10px 0;border-top:1px solid rgba(216,238,234,.72);font-size:13px}.leave-row p{margin:0;color:#60757c}.leave-row b{color:#12a8ad}.therapist-card button{margin-top:10px}.profile-card{background:linear-gradient(135deg,#fff,#e9f9f4)}.profile-card span{display:block;margin-top:8px;color:#12a8ad;font-weight:700}.children-card{display:flex;flex-direction:column;gap:8px}.children-card>button{width:100%;padding:10px;border:1px solid rgba(216,238,234,.72);border-radius:14px;background:#f8fcfb;display:flex;align-items:center;justify-content:space-between;text-align:left}.children-card>button.active{background:#e9f8f2}.children-card span{display:flex;flex-direction:column;gap:3px}.children-card small{color:#8a9ca1}.children-card em{font-style:normal;color:#12a8ad;font-size:12px}.mine-row{width:100%;padding:15px;text-align:left;color:#20343a}.bottom-tabs{height:64px;padding:6px 8px;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:#fff;border-top:1px solid #e5efeb}.bottom-tabs button{min-width:0;border:0;border-radius:14px;background:transparent;color:#7b8a91;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.bottom-tabs button.active{color:#12a8ad;background:#e9f8f2}.bottom-tabs .el-icon{font-size:20px}@media(max-width:520px){.zhixing-demo{width:100vw;height:100dvh;min-height:100dvh;padding:0;overflow:hidden}.phone-shell{width:100%;height:100dvh;min-height:0;border-radius:0;border:0}.hero-card h1{width:250px}.todo-strip{grid-template-columns:repeat(3,minmax(0,1fr))}}
.project-child-card{padding:14px;border:1px solid rgba(216,238,234,.72);border-radius:18px;background:#fff;box-shadow:0 10px 28px rgba(38,191,195,.07);display:flex;align-items:center;justify-content:space-between;gap:10px}.project-child-card span{display:block;color:#8a9ca1;font-size:12px}.project-child-card strong{display:block;margin-top:4px;font-size:17px}.project-child-card em{padding:5px 9px;border-radius:999px;background:#e4f8f6;color:#12a8ad;font-size:12px;font-style:normal;font-weight:700;white-space:nowrap}.project-switcher{display:flex;gap:10px;overflow:auto;padding-bottom:2px}.project-switcher button{min-width:210px;padding:12px;border:1px solid rgba(216,238,234,.78);border-radius:17px;background:#fff;text-align:left;box-shadow:0 8px 22px rgba(38,191,195,.06)}.project-switcher button.active{border-color:#12a8ad;background:#f2fffc;box-shadow:0 10px 26px rgba(18,168,173,.12)}.project-switcher strong{display:block;color:#20343a;font-size:14px;line-height:1.35}.project-switcher small{display:block;margin-top:5px;color:#60757c;font-size:12px}.project-switcher span{display:inline-block;margin-top:9px;padding:3px 7px;border-radius:999px;background:#e4f8f6;color:#12a8ad;font-size:12px}.project-switcher b{float:right;margin-top:9px;color:#12a8ad}.project-meta-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.project-meta-row span{padding:4px 8px;border-radius:999px;background:#e4f8f6;color:#12a8ad;font-size:12px}.lifecycle-card{padding:12px;border:1px solid rgba(216,238,234,.72);border-radius:18px;background:#fff;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.life-step{min-width:0;display:flex;flex-direction:column;align-items:center;gap:5px;color:#9aa9ad;font-size:11px}.life-step i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#eef3f2;color:#8a9ca1;font-style:normal;font-size:12px}.life-step.done i{background:#dff7ef;color:#12a8ad}.life-step.done span{color:#12a8ad}.life-step.current i{background:#12a8ad;color:#fff}.life-step.current span{color:#20343a;font-weight:700}.project-lock-tip,.locked-card,.data-list-card{padding:15px;border:1px solid rgba(216,238,234,.72);border-radius:18px;background:#fff;box-shadow:0 10px 28px rgba(38,191,195,.07)}.project-lock-tip{background:#fffaf2;border-color:#ffe0b5}.project-lock-tip p,.locked-card p{margin:6px 0 10px;color:#60757c;font-size:13px;line-height:1.55}.project-lock-tip button,.locked-card button{border:0;border-radius:999px;background:#12a8ad;color:#fff;padding:8px 12px;font-weight:700}.locked-card{background:linear-gradient(135deg,#fff,#f6fbfa)}.locked-card strong::before{content:'锁定';display:inline-flex;margin-right:8px;padding:3px 7px;border-radius:999px;background:#eef3f2;color:#8a9ca1;font-size:12px}.doctor-advice{margin-top:10px;padding:10px;border-radius:13px;background:#f3faf8;color:#31565c;font-size:13px;line-height:1.55}.data-list-card{display:flex;flex-direction:column;gap:9px}.data-list-card>strong{font-size:16px}.data-list-card div{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-top:1px solid rgba(216,238,234,.72);font-size:13px}.data-list-card span{color:#60757c}.data-list-card b{color:#20343a;text-align:right}
.project-screen{gap:10px}.phone-content{scrollbar-width:thin;scrollbar-color:rgba(96,117,124,.18) transparent}.phone-content::-webkit-scrollbar{width:4px}.phone-content::-webkit-scrollbar-track{background:transparent}.phone-content::-webkit-scrollbar-thumb{background:rgba(96,117,124,.18);border-radius:999px}.project-screen .project-child-card,.project-screen .project-status-card,.project-screen .lifecycle-card,.project-screen .flow-timeline,.project-screen .report-card,.project-screen .data-list-card,.project-screen .trend-card,.project-screen .service-row,.project-screen .message-card,.project-screen .locked-card,.project-screen .project-lock-tip{border:0;border-radius:12px;box-shadow:0 8px 22px rgba(28,91,92,.055)}.project-child-card{padding:13px 14px}.project-child-card span{font-size:12px;color:#8a9ca1}.project-child-card strong{font-size:17px}.project-child-card em{background:transparent;color:#12a8ad;padding:0;font-size:13px}.project-switcher{margin:0 -14px;padding:0 14px 2px;display:flex;gap:9px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.project-switcher::-webkit-scrollbar{display:none}.project-switcher button{min-width:188px;padding:11px 12px;border:0;border-radius:12px;background:#fff;box-shadow:0 7px 18px rgba(28,91,92,.055)}.project-switcher button.active{background:#effbf8;box-shadow:inset 0 0 0 1px rgba(18,168,173,.28),0 8px 18px rgba(18,168,173,.08)}.project-switcher strong{font-size:14px;line-height:1.35}.project-switcher small{margin-top:6px;color:#60757c}.current-project-card{padding:14px;display:flex;flex-direction:column;gap:12px}.project-detail-main>strong{display:block;color:#20343a;font-size:17px;line-height:1.35}.project-detail-main>p{margin:6px 0 0;color:#60757c;font-size:13px;line-height:1.5}.project-detail-main dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:11px 0 0}.project-detail-main dl div{min-width:0;padding:9px 10px;border-radius:9px;background:#f6fbfa}.project-detail-main dt{margin:0 0 4px;color:#8a9ca1;font-size:12px}.project-detail-main dd{margin:0;color:#20343a;font-size:13px;font-weight:700;line-height:1.35}.project-progress-box{padding:10px 11px;border-radius:10px;background:#f6fbfa}.project-progress-box span{color:#60757c;font-size:12px}.project-progress-box b{float:right;color:#12a8ad;font-size:18px}.project-progress-box .progress{clear:both;height:6px;margin-top:9px}.project-meta-row{display:none}.lifecycle-card{padding:11px 9px;background:#fff;gap:2px}.life-step{gap:4px;font-size:11px}.life-step i{width:20px;height:20px;background:#eef3f2;color:transparent;position:relative;font-size:0}.life-step.done i::after{content:'✓';color:#12a8ad;font-size:12px}.life-step.current i{background:#12a8ad}.life-step.current i::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff}.life-step.todo i::after{content:'';width:5px;height:5px;border-radius:50%;background:#b8c4c5}.life-step span{white-space:nowrap}.project-tabs{height:38px;display:grid;grid-template-columns:repeat(3,1fr);align-items:end;border-bottom:1px solid rgba(216,238,234,.72)}.project-tabs button{height:38px;border:0;background:transparent;color:#60757c;font-size:14px;font-weight:700;position:relative}.project-tabs button.active{color:#12a8ad}.project-tabs button.active::after{content:'';position:absolute;left:28%;right:28%;bottom:-1px;height:2px;border-radius:999px;background:#12a8ad}.flow-timeline{padding:4px 0 2px;background:#fff;border-radius:12px;box-shadow:0 8px 22px rgba(28,91,92,.055)}.flow-timeline .flow-row{position:relative;margin:0;padding:13px 13px 13px 35px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;border:0;border-radius:0;box-shadow:none;background:transparent}.flow-timeline .flow-row+ .flow-row{border-top:1px solid rgba(216,238,234,.58)}.flow-timeline .flow-row>i{position:absolute;left:15px;top:19px;width:8px;height:8px;border-radius:50%;background:#12a8ad;z-index:1}.flow-timeline .flow-row:not(:last-child)::after{content:'';position:absolute;left:18px;top:29px;bottom:-8px;width:1px;background:rgba(18,168,173,.18)}.flow-timeline .flow-row strong{font-size:15px}.flow-timeline .flow-row p{margin-top:4px}.flow-timeline .flow-row span{align-self:start;padding:0;background:transparent;color:#12a8ad;font-size:12px;font-weight:700}.project-lock-tip{background:#fffaf2}.project-lock-tip,.locked-card{border-radius:12px}.project-lock-tip button,.locked-card button{border-radius:10px;padding:8px 12px}.data-list-card,.report-card,.trend-card,.service-row,.message-card{border-radius:12px}.data-list-card div{border-top-color:rgba(216,238,234,.58)}
.project-screen .project-child-card{display:flex;align-items:center;justify-content:space-between;padding:13px 14px}.project-screen .project-child-card strong{font-size:17px;margin:0}.project-screen .project-child-card em{font-size:13px;color:#12a8ad;background:transparent;padding:0}.project-screen .project-child-card span{display:none}.project-screen .project-switcher strong{font-size:14px}.project-screen .current-project-card{gap:11px}.project-detail-main .consent-inline{display:inline-flex;margin-top:9px;padding:5px 8px;border-radius:8px;background:#fff7e8;color:#a66a12;font-size:12px;font-weight:700}.project-screen .project-progress-box{display:none}.project-screen .lifecycle-card{box-shadow:none;background:#f6fbfa;border-radius:10px;padding:10px 6px}.project-screen .life-step i{width:18px;height:18px}.project-screen .life-step.done i::after{content:'✓';color:#12a8ad;font-size:11px}.project-screen .life-step.current i{background:#12a8ad}.project-screen .life-step.current i::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff}.project-screen .life-step.todo i::after{content:'';width:5px;height:5px;border-radius:50%;background:#b8c4c5}.report-summary-card{gap:0}.report-card-head{display:flex!important;align-items:center;justify-content:space-between;padding:0 0 9px!important;border-top:0!important}.report-card-head strong{font-size:16px}.report-card-head button{border:0;border-radius:8px;background:#edf8f6;color:#12a8ad;padding:6px 9px;font-size:12px;font-weight:700}.mock-report-sheet{padding:14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);color:#20343a}.mock-report-sheet header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfe8e7;padding-bottom:8px}.mock-report-sheet header b{font-size:15px}.mock-report-sheet header small{color:#8a9ca1;font-size:11px}.mock-report-sheet h3{margin:12px 0 6px;text-align:center;font-size:17px}.mock-report-sheet p{margin:0 0 10px;color:#60757c;font-size:12px;text-align:center}.mock-report-sheet table{width:100%;border-collapse:collapse;font-size:12px}.mock-report-sheet td{border:1px solid #dfe8e7;padding:8px 6px;line-height:1.35}.mock-report-sheet .image-placeholder{height:96px;margin:10px 0;border-radius:8px;background:radial-gradient(circle at 45% 45%,#b3d2c9 0,#5f8279 28%,#223b3a 62%,#172a2d 100%);color:rgba(255,255,255,.86);display:grid;place-items:center;font-size:12px}.mock-report-sheet dl{margin:8px 0 0}.mock-report-sheet dl div{padding:8px 0;border-top:1px solid #dfe8e7}.mock-report-sheet dt{margin:0 0 4px;color:#60757c;font-size:12px}.mock-report-sheet dd{margin:0;font-size:13px;font-weight:700}.project-screen .project-lock-tip{background:#fffaf2}.project-screen .project-lock-tip strong{font-size:15px}.project-screen .project-lock-tip p{margin-top:6px}
.archive-section{padding:14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);display:flex;flex-direction:column;gap:11px}.archive-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.archive-head strong{font-size:16px;color:#20343a}.archive-head span{color:#8a9ca1;font-size:12px}.archive-card{padding:11px;border-radius:10px;background:#f8fcfb;border:1px solid rgba(216,238,234,.62)}.archive-info strong{display:block;color:#20343a;font-size:15px}.archive-info p{margin:5px 0 0;color:#60757c;font-size:12px;line-height:1.45}.archive-info small{display:block;margin-top:6px;color:#20343a;font-size:13px;line-height:1.45;font-weight:700}.archive-card img{width:100%;height:160px;margin-top:10px;border-radius:8px;object-fit:cover;object-position:top center;background:#eef3f2;display:block}.archive-card em{display:block;margin-top:6px;color:#8a9ca1;font-size:11px;font-style:normal;text-align:center}.project-screen .archive-section{border:0}.project-screen .report-summary-card,.project-screen .mock-report-sheet{display:none}
.archive-card.compact{min-height:88px;padding:11px 12px;background:#fff;border:0;border-radius:10px;box-shadow:none;border-top:1px solid rgba(216,238,234,.62)}.archive-section .archive-card.compact:first-of-type{border-top:0}.archive-title{display:flex;align-items:center;justify-content:space-between;gap:10px}.archive-title strong{min-width:0;color:#20343a;font-size:15px}.archive-title button{border:0;background:transparent;color:#12a8ad;font-size:12px;font-weight:800;padding:0;white-space:nowrap}.archive-card.compact p{margin:5px 0 0;color:#60757c;font-size:12px;line-height:1.4}.archive-card.compact small{display:block;margin-top:5px;color:#20343a;font-size:13px;line-height:1.45;font-weight:500}.archive-card.compact img,.archive-card.compact em{display:none}.report-doc-page{padding:14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.doc-title{display:flex;align-items:center;gap:10px;margin-bottom:12px}.doc-title button{border:0;border-radius:8px;background:#edf8f6;color:#12a8ad;padding:7px 9px;font-size:12px;font-weight:800}.doc-title strong{font-size:17px}.doc-title p{margin:3px 0 0;color:#60757c;font-size:12px}.report-doc-page img{width:100%;height:auto;border-radius:8px;background:#eef3f2;display:block}.project-screen .archive-section{gap:0}
.report-viewer{position:absolute;inset:0;z-index:20;background:#f6f8f8;display:flex;flex-direction:column}.viewer-top{min-height:58px;padding:9px 12px;display:flex;align-items:center;gap:10px;background:#fff;border-bottom:1px solid #e5efeb}.viewer-top button{border:0;border-radius:9px;background:#edf8f6;color:#12a8ad;padding:8px 10px;font-size:13px;font-weight:800}.viewer-top strong{display:block;font-size:17px;color:#20343a}.viewer-top p{margin:3px 0 0;color:#60757c;font-size:12px}.viewer-tools{height:44px;padding:6px 10px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#fff;border-bottom:1px solid #e5efeb}.viewer-tools button{border:0;border-radius:9px;background:#eef8f4;color:#12a8ad;font-size:13px;font-weight:800}.viewer-stage{flex:1;overflow:auto;padding:12px;display:block;text-align:center;touch-action:pan-x pan-y;background:#f6f8f8}.viewer-stage img{max-width:none;height:auto;min-width:100%;border-radius:6px;background:#fff;box-shadow:0 8px 24px rgba(31,54,58,.12);transform-origin:top center}.report-doc-page{display:none!important}
</style>


















