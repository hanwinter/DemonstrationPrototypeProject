<script setup>
import { computed, ref } from 'vue'
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

const children = [
  { id: 1, name: '林一凡', gender: '男', age: 8, birthday: '2018-03-16', cardNo: '1101********0816', phone: '138****1234', default: true },
  { id: 2, name: '林小雨', gender: '女', age: 6, birthday: '2020-07-02', cardNo: '1101********0902', phone: '138****1234', default: false },
]

const project = {
  name: '儿童青少年视力健康管理专案',
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

        <section v-else-if="activeTab === 'project'" class="screen">
          <div class="page-title"><h2>专案</h2><p>{{ project.stage }}</p></div>
          <article class="project-status-card">
            <div class="section-head"><strong>{{ project.name }}</strong><b>{{ project.progress }}%</b></div>
            <p>{{ project.specialty }}｜主治医生：{{ project.doctor }}｜开始：{{ project.startDate }}</p>
            <div class="progress"><i :style="{ width: project.progress + '%' }"></i></div>
          </article>

          <div class="segmented">
            <button :class="{ active: activeProjectPanel === 'flow' }" type="button" @click="activeProjectPanel = 'flow'">流程</button>
            <button :class="{ active: activeProjectPanel === 'report' }" type="button" @click="activeProjectPanel = 'report'">报告</button>
            <button :class="{ active: activeProjectPanel === 'service' }" type="button" @click="activeProjectPanel = 'service'">家庭服务</button>
          </div>

          <template v-if="activeProjectPanel === 'flow'">
            <article v-for="item in caseFlow" :key="item.title" class="flow-row">
              <div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span>{{ item.status }}</span>
            </article>
            <article class="consent-tip"><strong>知情同意说明</strong><p>未签署时，仅限制个案管理相关功能，不关闭整个 H5。</p></article>
          </template>

          <template v-else-if="activeProjectPanel === 'report'">
            <article class="report-card">
              <div class="section-head"><strong>专科诊疗报告</strong><small>{{ report.time }}</small></div>
              <p>{{ report.conclusion }}</p>
              <div class="problem-tags"><span v-for="item in report.problems" :key="item">{{ item }}</span></div>
            </article>
            <section class="trend-grid">
              <article v-for="item in trends" :key="item.name" class="trend-card">
                <div><strong>{{ item.name }}</strong><span>{{ item.unit }}</span></div>
                <b>{{ item.value }}</b>
                <svg viewBox="0 0 120 44" preserveAspectRatio="none"><polyline :points="item.data.map((v, i) => `${i * 40},${44 - v / 2}`).join(' ')" /></svg>
              </article>
            </section>
          </template>

          <template v-else>
            <article v-for="item in familyServices" :key="item.title" class="service-row">
              <b>{{ item.icon }}</b><div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span>进入</span>
            </article>
            <article class="message-card">
              <strong>在线互动</strong>
              <p v-for="item in messages" :key="item.text"><b>{{ item.from }}：</b>{{ item.text }}</p>
            </article>
            <article v-for="item in assessments" :key="item.title" class="assessment-card">
              <strong>{{ item.title }}</strong><p>{{ item.result }}</p><small>{{ item.advice }}</small>
            </article>
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

      <nav class="bottom-tabs">
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
</style>

