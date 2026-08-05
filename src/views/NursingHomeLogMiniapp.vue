<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = ref('home')
const activeFormTab = ref('base')

const quickEntries = ['上户日志', '月嫂简历', '升级投诉', '客户评价', '首日资料']
const bottomTabs = [
  { key: 'home', label: '首页' },
  { key: 'logs', label: '日志' },
  { key: 'mine', label: '我的' },
]
const formTabs = [
  { key: 'base', label: '基础信息' },
  { key: 'mother', label: '妈妈日志' },
  { key: 'baby', label: '宝宝日志' },
]

const logs = Array.from({ length: 7 }, (_, index) => {
  const day = 16 - index
  return {
    id: index + 1,
    date: `2026-07-${String(day).padStart(2, '0')}`,
    babyAge: 13 - index,
    serviceDay: 13 - index,
    status: index === 0 ? '待确认' : '已确认',
    staff: '张洪霞',
    customer: '李女士',
  }
})

const currentLog = computed(() => logs[0])
const isHome = computed(() => currentPage.value === 'home')
const pageTitle = computed(() => {
  if (currentPage.value === 'logs') return '上户日志'
  if (currentPage.value === 'new') return '新增日志'
  if (currentPage.value === 'detail') return '日志详情'
  if (currentPage.value === 'mine') return '我的'
  return '家政服务'
})

const baseFields = [
  ['日志日期', '2026-07-16'],
  ['服务第几天', '13'],
  ['宝宝出生第几天', '13'],
  ['室内温度', '26℃'],
  ['室内湿度', '55%'],
  ['护理师早体温', '36.4℃'],
  ['护理师晚体温', '36.5℃'],
  ['护理师健康', '良好'],
  ['家中来客', '无'],
  ['其他备注', '宝宝吃奶规律，宝妈状态稳定'],
]
const motherFields = [
  ['妈妈体温', '36.6℃'],
  ['体温备注', '无异常'],
  ['空腹体重', '58kg'],
  ['妈妈健康', '良好'],
  ['精神状态', '愉悦'],
  ['乳房情况', '正常'],
  ['乳房护理', '无需特殊护理'],
  ['母乳分泌', '正常'],
  ['恶露颜色', '淡红色'],
  ['恶露量', '少'],
  ['恶露异味', '否'],
  ['睡眠情况', '中'],
  ['饮食情况', '好'],
  ['起居', '足浴'],
  ['大便情况', '正常'],
  ['现有疾病', '无'],
  ['现有传染病', '无'],
  ['分娩伤口', '恢复中'],
  ['阴道伤口', '无异常'],
  ['剖宫产伤口', '无'],
]
const babyFields = [
  ['宝宝选择', '宝宝1'],
  ['宝宝体温', '36.8℃'],
  ['体温备注', '无异常'],
  ['体重', '3.8kg'],
  ['身长', '52cm'],
  ['黄疸数值', '5.8'],
  ['黄疸程度', '轻'],
  ['黄疸部位', '头面部'],
  ['黄疸变化', '消退'],
  ['黄疸治疗', '家庭护理'],
  ['湿疹', '无'],
  ['皮肤状态', '正常'],
  ['口腔', '正常'],
  ['眼部', '正常'],
  ['排便次数', '4次'],
  ['排便时间', '08:20 / 12:40 / 17:10 / 21:30'],
  ['排便量', '中'],
  ['排便颜色', '黄色'],
  ['排便气味', '正常'],
  ['排便性状', '糊状'],
  ['睡眠情况', '约16小时'],
]
const mealRecords = ['早餐：小米粥、鸡蛋、青菜', '午餐：鲫鱼汤、米饭、时蔬']
const feedingRecords = ['母乳 08:30 80ml', '母乳 12:20 90ml', '配方奶 18:40 70ml']

function openQuickEntry(label) {
  if (label === '上户日志') currentPage.value = 'logs'
}
function switchBottomTab(key) {
  currentPage.value = key
}
function openLogDetail() {
  currentPage.value = 'detail'
}
function openNewLog() {
  currentPage.value = 'new'
  activeFormTab.value = 'base'
}
function goBack() {
  if (currentPage.value === 'detail' || currentPage.value === 'new') {
    currentPage.value = 'logs'
    return
  }
  if (currentPage.value === 'logs' || currentPage.value === 'mine') {
    currentPage.value = 'home'
    return
  }
  router.push('/')
}
</script>

<template>
  <main class="miniapp-page">
    <section class="phone">
      <header class="wx-nav">
        <button type="button" class="back-btn" @click="goBack">‹</button>
        <strong>{{ pageTitle }}</strong>
        <span class="capsule">··· ○</span>
      </header>

      <div class="content">
        <template v-if="isHome">
          <section class="home-hero">
            <p>服务员 张洪霞</p>
            <h1>李女士母婴陪护服务</h1>
            <span>宝宝出生13天 · 服务第13天</span>
          </section>
          <section class="quick-grid">
            <button v-for="item in quickEntries" :key="item" type="button" @click="openQuickEntry(item)">
              <span>{{ item.slice(0, 1) }}</span>
              <strong>{{ item }}</strong>
            </button>
          </section>
          <section class="card notice">
            <h2>服务公告</h2>
            <p>请每日完成上户日志，客户确认后进入服务档案。</p>
          </section>
          <section class="card order">
            <h2>近期订单</h2>
            <div><strong>李女士</strong><span>月嫂陪护 · 服务中</span></div>
            <p>2026-07-04 至 2026-08-01</p>
          </section>
          <button class="contact-btn" type="button">联系客服</button>
        </template>

        <template v-else-if="currentPage === 'logs'">
          <div class="list-head">
            <div><strong>日志列表</strong><span>最近7天上户日志</span></div>
            <button type="button" @click="openNewLog">新增</button>
          </div>
          <button v-for="log in logs" :key="log.id" class="log-card" type="button" @click="openLogDetail">
            <div><strong>{{ log.date }}</strong><em>{{ log.status }}</em></div>
            <p>宝宝出生{{ log.babyAge }}天 · 服务第{{ log.serviceDay }}天</p>
            <span>{{ log.staff }} / {{ log.customer }}</span>
          </button>
        </template>

        <template v-else-if="currentPage === 'new'">
          <nav class="form-tabs">
            <button v-for="tab in formTabs" :key="tab.key" :class="{ active: activeFormTab === tab.key }" type="button" @click="activeFormTab = tab.key">
              {{ tab.label }}
            </button>
          </nav>
          <section v-if="activeFormTab === 'base'" class="form-panel">
            <label v-for="field in baseFields" :key="field[0]"><span>{{ field[0] }}</span><input :value="field[1]" readonly></label>
          </section>
          <section v-if="activeFormTab === 'mother'" class="form-panel">
            <label v-for="field in motherFields" :key="field[0]"><span>{{ field[0] }}</span><input :value="field[1]" readonly></label>
            <div class="record-box"><strong>宝妈餐食</strong><p v-for="item in mealRecords" :key="item">{{ item }}</p><button type="button">新增餐食</button></div>
          </section>
          <section v-if="activeFormTab === 'baby'" class="form-panel">
            <label v-for="field in babyFields" :key="field[0]"><span>{{ field[0] }}</span><input :value="field[1]" readonly></label>
            <div class="record-box"><strong>喂养情况</strong><p v-for="item in feedingRecords" :key="item">{{ item }}</p><button type="button">新增喂养</button></div>
          </section>
        </template>

        <template v-else-if="currentPage === 'detail'">
          <section class="service-card">
            <div><strong>宝宝出生{{ currentLog.babyAge }}天</strong><span>服务{{ currentLog.serviceDay }}天</span></div>
            <p>2026-05-19 日志详情</p>
          </section>
          <section v-for="group in ['基础信息', '妈妈情况', '宝宝情况', '喂养情况', '宝妈餐食', '其他健康情况及护理建议']" :key="group" class="detail-block">
            <h2>{{ group }}</h2>
            <p v-if="group === '基础信息'">室温26℃，湿度55%，护理师健康良好，家中无来客。</p>
            <p v-else-if="group === '妈妈情况'">体温36.6℃，精神状态愉悦，饮食好，睡眠中。</p>
            <p v-else-if="group === '宝宝情况'">体温36.8℃，黄疸轻度消退，皮肤与口腔正常。</p>
            <p v-else-if="group === '喂养情况'">{{ feedingRecords.join('；') }}</p>
            <p v-else-if="group === '宝妈餐食'">{{ mealRecords.join('；') }}</p>
            <p v-else>继续观察黄疸变化，保持室内通风，按需记录喂养和排便。</p>
          </section>
          <div class="detail-actions"><button type="button">确认日志</button><button type="button">投诉反馈</button></div>
        </template>

        <template v-else>
          <section class="card mine-card">
            <h2>我的</h2>
            <p>张洪霞 · 当前服务客户 李女士</p>
          </section>
        </template>
      </div>

      <footer class="tabbar">
        <button v-for="tab in bottomTabs" :key="tab.key" :class="{ active: currentPage === tab.key }" type="button" @click="switchBottomTab(tab.key)">
          <span></span>{{ tab.label }}
        </button>
      </footer>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.miniapp-page{min-height:100vh;padding:28px 0;background:#eef3f8;display:flex;justify-content:center;color:#1f2d3d;font-family:"Microsoft YaHei",Arial,sans-serif}.phone{width:390px;min-height:820px;display:flex;flex-direction:column;overflow:hidden;border:1px solid #d8e0ea;border-radius:32px;background:#f7f8fa;box-shadow:0 20px 54px rgba(47,74,105,.16)}.wx-nav{height:62px;padding:0 14px;display:grid;grid-template-columns:44px 1fr 72px;align-items:center;background:#fff;border-bottom:1px solid #edf0f4}.wx-nav strong{text-align:center;font-size:17px}.back-btn{width:36px;height:36px;border:0;background:transparent;font-size:30px;color:#1f2d3d}.capsule{height:30px;display:grid;place-items:center;border:1px solid #d9dde5;border-radius:16px;color:#6b7280;font-size:14px}.content{flex:1;min-height:0;padding:14px 14px 88px;overflow:auto}.home-hero{padding:22px 18px;border-radius:18px;background:linear-gradient(135deg,#12b886,#0ca678);color:#fff}.home-hero p,.home-hero h1{margin:0}.home-hero h1{margin:8px 0 12px;font-size:21px}.home-hero span{font-size:13px;opacity:.9}.quick-grid{margin:14px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.quick-grid button{height:82px;border:0;border-radius:14px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#25324b}.quick-grid span{width:32px;height:32px;display:grid;place-items:center;border-radius:10px;background:#e9f8f1;color:#0ca678;font-weight:700}.quick-grid strong{font-size:13px}.card,.log-card,.form-panel,.service-card,.detail-block{border:1px solid #edf0f4;border-radius:14px;background:#fff}.card{padding:14px;margin-bottom:12px}.card h2,.detail-block h2{margin:0 0 8px;font-size:16px}.card p,.order p,.detail-block p{margin:0;color:#677485;line-height:1.6}.order div{display:flex;justify-content:space-between;margin-bottom:8px}.order span{color:#0ca678;font-size:13px}.contact-btn{width:100%;height:46px;border:0;border-radius:24px;background:#07c160;color:#fff;font-size:15px}.tabbar{height:68px;display:grid;grid-template-columns:repeat(3,1fr);background:#fff;border-top:1px solid #e8ecf1}.tabbar button{border:0;background:transparent;color:#8b95a1;font-size:12px}.tabbar span{width:22px;height:22px;margin:0 auto 4px;display:block;border-radius:8px;background:#dce3ea}.tabbar .active{color:#07c160}.tabbar .active span{background:#07c160}.list-head{display:flex;align-items:center;justify-content:space-between;margin:4px 0 12px}.list-head div{display:flex;flex-direction:column;gap:4px}.list-head strong{font-size:19px}.list-head span{color:#8792a1;font-size:13px}.list-head button,.record-box button{border:0;border-radius:16px;background:#07c160;color:#fff;padding:7px 13px}.log-card{width:100%;padding:14px;margin-bottom:10px;text-align:left}.log-card div{display:flex;justify-content:space-between}.log-card strong{font-size:16px}.log-card em{font-style:normal;color:#fa8c16;background:#fff7e6;border-radius:12px;padding:3px 8px;font-size:12px}.log-card p{margin:10px 0 4px;color:#25324b}.log-card span{color:#8792a1;font-size:13px}.form-tabs{position:sticky;top:-14px;z-index:1;margin:-14px -14px 12px;padding:10px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#f7f8fa}.form-tabs button{height:36px;border:1px solid #e2e8f0;border-radius:18px;background:#fff;color:#596579}.form-tabs .active{border-color:#07c160;background:#e9f9f0;color:#07c160}.form-panel{padding:12px}.form-panel label{display:grid;grid-template-columns:120px 1fr;align-items:center;min-height:44px;border-bottom:1px solid #f0f2f5}.form-panel label:last-child{border-bottom:0}.form-panel span{color:#5f6b7a;font-size:13px}.form-panel input{width:100%;border:0;background:transparent;color:#1f2d3d;text-align:right;font-size:14px}.record-box{margin-top:12px;padding:12px;border-radius:12px;background:#f7fafc}.record-box strong{display:block;margin-bottom:8px}.record-box p{margin:0 0 6px;color:#5f6b7a}.service-card{padding:16px;margin-bottom:12px;background:#ecfdf5;border-color:#c9f2dc}.service-card div{display:flex;justify-content:space-between}.service-card p{margin:10px 0 0;color:#0f7b4f}.detail-block{padding:14px;margin-bottom:10px}.detail-actions{position:sticky;bottom:-74px;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding-top:8px;background:#f7f8fa}.detail-actions button{height:44px;border:0;border-radius:22px;background:#07c160;color:#fff}.detail-actions button:last-child{background:#fff;border:1px solid #ff7875;color:#cf1322}.mine-card{margin-top:12px}@media(max-width:480px){.miniapp-page{padding:0;background:#f7f8fa}.phone{width:100%;min-height:100vh;border:0;border-radius:0;box-shadow:none}}
</style>
