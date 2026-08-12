<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const router = useRouter()
const filters = reactive({
  region: '浙江省',
  org: '全部',
  school: '全部',
  type: '全部',
  dateRange: '2026-01-01 至 2026-08-31',
  status: '全部',
})
const activeType = ref('漏筛')
const warningTitle = ref('筛查覆盖率预警')
const statusChanged = ref(false)
const issueChart = ref()
const trendChart = ref()
let issueInstance
let trendInstance
let resizeObserver

const metrics = [
  ['数据检查总量', '320万条'],
  ['发现问题', '8560条'],
  ['待处理', '1260条'],
  ['已整改', '7200条'],
  ['数据质量率', '97.3%'],
]
const issueTypes = [
  ['漏筛', 3200],
  ['错填', 1800],
  ['缺项', 2100],
  ['重复建档', 560],
  ['数据异常', 900],
]
const issueRows = [
  { id: 'QC20260812001', type: '漏筛', desc: '12名学生未完成筛查', area: '杭州市西湖区', org: '西湖区妇幼保健院', school: '宁安路小学', time: '2026-08-10', status: '待处理' },
  { id: 'QC20260812002', type: '缺项', desc: '视力检查结果缺失34条', area: '杭州市拱墅区', org: '拱墅区妇幼保健院', school: '文澜实验学校', time: '2026-08-11', status: '处理中' },
  { id: 'QC20260812003', type: '重复建档', desc: '同一学生存在2份健康档案', area: '杭州市西湖区', org: '西湖区妇幼保健院', school: '翠苑第二小学', time: '2026-08-12', status: '待处理' },
  { id: 'QC20260812004', type: '错填', desc: '身高单位疑似填报错误', area: '杭州市滨江区', org: '滨江区妇幼保健院', school: '滨江育才小学', time: '2026-08-12', status: '已整改' },
]
const issueColumns = [
  { key: 'type', label: '问题类型', width: 86 },
  { key: 'desc', label: '问题描述', width: 170 },
  { key: 'area', label: '所属区域', width: 120 },
  { key: 'org', label: '机构', width: 140 },
  { key: 'school', label: '学校', width: 120 },
  { key: 'time', label: '发现时间', width: 100 },
  { key: 'status', label: '处理状态', width: 86 },
  { key: 'actions', label: '操作', width: 70, type: 'actions' },
]
const missRows = [
  { id: 'm1', area: '西湖区', should: 12000, done: 11800, missed: 200, rate: '98.3%' },
  { id: 'm2', area: '拱墅区', should: 9800, done: 9180, missed: 620, rate: '93.7%' },
  { id: 'm3', area: '滨江区', should: 7600, done: 7120, missed: 480, rate: '93.6%' },
]
const missColumns = [
  { key: 'area', label: '区域', width: 88 },
  { key: 'should', label: '应筛', width: 76 },
  { key: 'done', label: '已筛', width: 76 },
  { key: 'missed', label: '漏筛', width: 76 },
  { key: 'rate', label: '覆盖率', width: 78 },
]
const integrityRows = [
  { id: 'i1', rule: '身份证缺失', count: '186条', scope: '7所学校', status: '待修正' },
  { id: 'i2', rule: '性别缺失', count: '42条', scope: '3所学校', status: '整改中' },
  { id: 'i3', rule: '学生年龄异常', count: '56条', scope: '3所学校', status: '待修正' },
  { id: 'i4', rule: '检测结果为空', count: '318条', scope: '12所学校', status: '待修正' },
  { id: 'i5', rule: '单位错误', count: '74条', scope: '5所学校', status: '已修正' },
]
const integrityColumns = [
  { key: 'rule', label: '检查规则', width: 130 },
  { key: 'count', label: '异常数量', width: 86 },
  { key: 'scope', label: '影响范围', width: 90 },
  { key: 'status', label: '状态', width: 86 },
]
const duplicateRows = [
  { id: 'd1', name: '顾禾雨', duplicateType: '身份证重复', count: '2份', school: '宁安路小学', status: '待合并' },
  { id: 'd2', name: '陈思然', duplicateType: '姓名+生日重复', count: '2份', school: '文澜实验学校', status: '核查中' },
  { id: 'd3', name: '周若溪', duplicateType: '学籍变化异常', count: '3份', school: '翠苑第二小学', status: '待合并' },
]
const duplicateColumns = [
  { key: 'name', label: '学生姓名', width: 82 },
  { key: 'duplicateType', label: '重复类型', width: 120 },
  { key: 'count', label: '关联档案数', width: 90 },
  { key: 'school', label: '所属学校', width: 120 },
  { key: 'status', label: '处理状态', width: 86 },
]
const warningRows = [
  { title: '筛查覆盖率预警', level: '高风险', object: '西湖区某学校', desc: '筛查完成率72%，低于目标值90%' },
  { title: '复筛率预警', level: '严重', object: '拱墅区', desc: '异常学生2500人，复筛完成1200人，完成率48%' },
  { title: '随访率预警', level: '关注', object: '某医疗机构', desc: '随访完成率65%，低于区域平均' },
  { title: '健康问题增长预警', level: '关注', object: '视力异常率', desc: '同比增长5.2%，涉及18所学校' },
]
const levels = [
  ['严重', '浅红'],
  ['高风险', '浅橙'],
  ['关注', '浅黄'],
  ['正常', '浅绿'],
]
const rectificationRows = [
  { id: 'QC202608001', type: '缺项', org: '西湖区妇幼保健院', owner: '张医生', deadline: '2026-08-15', status: '整改中' },
  { id: 'QC202608002', type: '漏筛', org: '宁安路小学', owner: '李老师', deadline: '2026-08-16', status: '处理中' },
  { id: 'QC202608003', type: '重复建档', org: '拱墅区妇幼保健院', owner: '王医生', deadline: '2026-08-18', status: '复核中' },
]
const rectificationColumns = [
  { key: 'id', label: '问题编号', width: 112 },
  { key: 'type', label: '问题类型', width: 76 },
  { key: 'org', label: '责任机构', width: 140 },
  { key: 'owner', label: '整改负责人', width: 90 },
  { key: 'deadline', label: '整改期限', width: 100 },
  { key: 'status', label: '当前状态', width: 86 },
  { key: 'actions', label: '操作', width: 70, type: 'actions' },
]

function loadEcharts() {
  if (window.echarts) return Promise.resolve(window.echarts)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-echarts-local]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.echarts), { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = `${import.meta.env.BASE_URL}echarts.min.js`
    script.dataset.echartsLocal = 'true'
    script.onload = () => resolve(window.echarts)
    script.onerror = reject
    document.head.appendChild(script)
  })
}
function resetFilters() {
  Object.assign(filters, { region: '浙江省', org: '全部', school: '全部', type: '全部', dateRange: '2026-01-01 至 2026-08-31', status: '全部' })
}
function openDetail(row) {
  router.push(`/demo-pages/quality-control/detail/${row.id}`)
}
function markHandled(row) {
  row.status = row.status === '整改中' ? '复核通过' : '整改中'
  statusChanged.value = true
}
async function renderCharts() {
  const echarts = await loadEcharts()
  await nextTick()
  if (!issueChart.value || !trendChart.value) return
  issueInstance ||= echarts.init(issueChart.value)
  trendInstance ||= echarts.init(trendChart.value)
  issueInstance.setOption({
    animation: false,
    grid: { left: 40, right: 10, top: 18, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: issueTypes.map((item) => item[0]), axisTick: { show: false }, axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#edf0f2' } }, axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', barWidth: 24, data: issueTypes.map((item) => item[1]), itemStyle: { color: '#9fb7cf' } }],
  })
  trendInstance.setOption({
    animation: false,
    color: ['#b46a5b', '#5f8db8'],
    grid: { left: 42, right: 18, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 8, itemWidth: 14, itemHeight: 8, textStyle: { fontSize: 11 }, data: ['问题数量', '整改完成数量'] },
    xAxis: { type: 'category', data: ['3月', '4月', '5月', '6月', '7月', '8月'], boundaryGap: false, axisTick: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#edf0f2' } }, axisLabel: { fontSize: 11 } },
    series: [
      { name: '问题数量', type: 'line', smooth: true, data: [1680, 1540, 1320, 1180, 1030, 820] },
      { name: '整改完成数量', type: 'line', smooth: true, data: [980, 1120, 1280, 1460, 1680, 7200] },
    ],
  })
}
onMounted(() => {
  renderCharts()
  resizeObserver = new ResizeObserver(() => {
    issueInstance?.resize()
    trendInstance?.resize()
  })
  if (issueChart.value) resizeObserver.observe(issueChart.value)
  if (trendChart.value) resizeObserver.observe(trendChart.value)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  issueInstance?.dispose()
  trendInstance?.dispose()
})
</script>

<template>
  <div class="quality-page">
    <div class="breadcrumb">单页面演示 &gt; 质量控制与预警管理</div>
    <section class="filter-panel">
      <strong>查询条件</strong>
      <label>区域<select v-model="filters.region"><option>浙江省</option><option>杭州市</option><option>西湖区</option></select></label>
      <label>机构<select v-model="filters.org"><option>全部</option><option>西湖区妇幼保健院</option></select></label>
      <label>学校<select v-model="filters.school"><option>全部</option><option>宁安路小学</option><option>文澜实验学校</option></select></label>
      <label>问题类型<select v-model="filters.type"><option>全部</option><option v-for="item in issueTypes" :key="item[0]">{{ item[0] }}</option></select></label>
      <label>时间范围<input v-model="filters.dateRange" /></label>
      <label>状态<select v-model="filters.status"><option>全部</option><option>待处理</option><option>处理中</option><option>已整改</option></select></label>
      <button class="primary-btn" type="button">查询</button><button type="button" @click="resetFilters">重置</button>
    </section>
    <section class="metric-row"><header>数据质量概况</header><article v-for="item in metrics" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></article></section>
    <section class="scroll-area">
      <section class="top-grid">
        <div class="panel chart-panel">
          <header>数据质量问题分布<nav><button v-for="item in issueTypes" :key="item[0]" :class="{ active: activeType === item[0] }" type="button" @click="activeType=item[0]">{{ item[0] }}</button></nav></header>
          <div class="chart" ref="issueChart"></div>
        </div>
        <div class="panel warning-panel">
          <header>区域业务预警</header>
          <button v-for="item in warningRows" :key="item.title" :class="{ active: warningTitle === item.title }" type="button" @click="warningTitle=item.title"><em :class="item.level">{{ item.level }}</em><strong>{{ item.title }}</strong><span>{{ item.object }}：{{ item.desc }}</span></button>
        </div>
      </section>
      <section class="panel issue-panel">
        <header>待处理问题</header>
        <LegacyTable :rows="issueRows" :columns="issueColumns"><template #status="{ value }"><em :class="value">{{ value }}</em></template><template #actions="{ row }"><button class="link-btn" type="button" @click="openDetail(row)">查看</button></template></LegacyTable>
      </section>
      <section class="middle-grid">
        <div class="panel"><header>漏筛情况监控</header><LegacyTable :rows="missRows" :columns="missColumns" /></div>
        <div class="panel"><header>数据完整性检查</header><LegacyTable :rows="integrityRows" :columns="integrityColumns"><template #status="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable></div>
        <div class="panel"><header>重复档案检测</header><LegacyTable :rows="duplicateRows" :columns="duplicateColumns"><template #status="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable></div>
      </section>
      <section class="bottom-grid">
        <div class="panel level-panel"><header>预警等级</header><article v-for="item in levels" :key="item[0]"><em :class="item[0]">{{ item[0] }}</em><span>{{ item[1] }}标签，用于区分处置优先级</span></article></div>
        <div class="panel flow-panel"><header>问题整改闭环</header><div><span>发现问题</span><i>↓</i><span>处理中</span><i>↓</i><span>已整改</span><i>↓</i><span>复核通过</span></div></div>
        <div class="panel rectification-panel"><header>整改任务列表</header><LegacyTable :rows="rectificationRows" :columns="rectificationColumns"><template #status="{ value }"><em :class="value">{{ value }}</em></template><template #actions="{ row }"><button class="link-btn" type="button" @click="markHandled(row)">处理</button></template></LegacyTable></div>
        <div class="panel chart-panel"><header>数据质量趋势</header><div class="chart" ref="trendChart"></div></div>
      </section>
    </section>
  </div>
</template>

<style scoped>
.quality-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.filter-panel{min-height:70px;margin-top:8px;padding:8px 10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;border:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.filter-panel strong{width:100%;font-size:12px}.filter-panel label{display:flex;align-items:center;gap:5px}.filter-panel select,.filter-panel input{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;font-size:12px}.filter-panel select{width:118px}.filter-panel input{width:178px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.metric-row{height:66px;margin-top:8px;display:grid;grid-template-columns:140px repeat(5,1fr);border:1px solid #d8d8d8;background:#fff}.metric-row header{display:flex;align-items:center;padding:0 10px;border-right:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.metric-row article{padding:10px;border-right:1px solid #e6e8eb}.metric-row span{display:block;color:#666;font-size:12px}.metric-row strong{display:block;margin-top:6px;color:#244b70;font-size:17px}.scroll-area{min-height:0;flex:1;margin-top:8px;overflow:auto;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.panel{border:1px solid #d8d8d8;background:#fff;overflow:hidden}.panel header{height:32px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.top-grid{display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:8px}.chart-panel{height:214px}.chart{height:181px}.chart-panel nav{display:flex;gap:4px}.chart-panel nav button.active{border-color:#9fb7cf;background:#dceafa;color:#244b70}.warning-panel{height:214px}.warning-panel button{width:100%;height:45px;padding:6px 10px;display:grid;grid-template-columns:58px 122px minmax(0,1fr);gap:8px;align-items:center;text-align:left;border:0;border-bottom:1px solid #e6e8eb;background:#fff}.warning-panel button.active{background:#f7fbff}.warning-panel strong,.warning-panel span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.warning-panel span{color:#555}.issue-panel{height:204px;margin-top:8px}.panel :deep(.legacy-table-wrap){height:calc(100% - 32px);min-height:0}.issue-panel :deep(.legacy-table){min-width:892px}.middle-grid{margin-top:8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.middle-grid .panel{height:176px}.middle-grid .panel :deep(.legacy-table){min-width:394px}.bottom-grid{margin-top:8px;display:grid;grid-template-columns:250px 210px minmax(0,1fr) minmax(330px,.85fr);gap:8px}.bottom-grid .panel{height:214px}.level-panel article{height:42px;padding:8px 10px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #e6e8eb;font-size:12px}.flow-panel div{height:181px;padding:14px 12px;display:grid;grid-template-columns:1fr;align-content:center;gap:7px;text-align:center;font-size:12px}.flow-panel span{height:28px;display:grid;place-items:center;border:1px solid #cfd6df;background:#fafafa}.flow-panel i{font-style:normal;color:#7b8794}.rectification-panel :deep(.legacy-table){min-width:674px}.link-btn{height:auto;padding:0;border:0;background:transparent;color:#2d6fba}em{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #b8d8c4;border-radius:2px;background:#eef8f1;color:#34724a;font-size:12px;font-style:normal}em.严重{border-color:#efc8bd;background:#fff2ee;color:#a64b35}em.高风险,em.关注,em.待处理,em.待修正,em.待合并{border-color:#e4d2a1;background:#fff9e8;color:#80611c}em.处理中,em.整改中,em.核查中,em.复核中{border-color:#b8cce0;background:#eef5fc;color:#244b70}em.已整改,em.已修正,em.复核通过,em.正常{border-color:#b8d8c4;background:#eef8f1;color:#34724a}
</style>
