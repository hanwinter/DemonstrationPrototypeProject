<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const filters = reactive({
  province: '浙江省',
  city: '杭州市',
  district: '西湖区',
  batch: '2026春季五健筛查',
  dateRange: '2026-01-01 至 2026-08-31',
})
const refreshed = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogRows = ref([])
const barChart = ref()
const lineChart = ref()
let barInstance
let lineInstance
let resizeObserver

const metrics = [
  ['筛查任务', '120个'],
  ['学校覆盖', '356所'],
  ['应检学生', '128560人'],
  ['已完成筛查', '119820人'],
  ['异常学生', '22650人'],
  ['待复筛', '3260人'],
]
const schoolSummary = [
  ['学校总数', '356'],
  ['已覆盖', '330'],
  ['未覆盖', '26'],
  ['覆盖率', '92.7%'],
]
const taskRows = [
  { id: 't1', name: '2026春季五健筛查', schools: 356, done: 320, doing: 26, pending: 10, rate: 89.8 },
]
const schoolRows = [
  { id: 's1', school: '宁安路第一小学', area: '西湖区', plan: '560人', done: '540人', rate: '96%', status: '已完成' },
  { id: 's2', school: '文澜实验学校', area: '拱墅区', plan: '820人', done: '748人', rate: '91%', status: '进行中' },
  { id: 's3', school: '滨江育才小学', area: '滨江区', plan: '690人', done: '524人', rate: '76%', status: '处理中' },
  { id: 's4', school: '上城清波中学', area: '上城区', plan: '930人', done: '930人', rate: '100%', status: '已完成' },
]
const schoolColumns = [
  { key: 'school', label: '学校名称', width: 150 },
  { key: 'area', label: '所属区域', width: 90 },
  { key: 'plan', label: '计划筛查人数', width: 110 },
  { key: 'done', label: '已完成人数', width: 100 },
  { key: 'rate', label: '完成率', width: 78 },
  { key: 'status', label: '状态', width: 84 },
]
const participationRows = [
  { name: '小学', plan: 50000, done: 48000, undone: 2000 },
  { name: '初中', plan: 30000, done: 29000, undone: 1000 },
  { name: '高中', plan: 24000, done: 21820, undone: 2180 },
  { name: '其他', plan: 24560, done: 21000, undone: 3560 },
]
const abnormalItems = [
  { name: '视力异常', count: '12560人', rate: '18.5%' },
  { name: '龋齿异常', count: '8560人', rate: '12.3%' },
  { name: '超重肥胖', count: '5320人', rate: '7.8%' },
  { name: '脊柱异常', count: '1860人', rate: '2.7%' },
  { name: '心理风险', count: '980人', rate: '1.4%' },
]
const followupItems = [
  ['异常学生', '22650'],
  ['需要复筛', '8200'],
  ['已完成复筛', '6500'],
  ['复筛完成率', '79.2%'],
  ['随访任务', '12000'],
  ['已完成', '9800'],
  ['随访完成率', '81.6%'],
]
const pendingItems = [
  { name: '待复筛学生', value: '3260人', status: '待处理' },
  { name: '未完成学校', value: '26所', status: '处理中' },
  { name: '超过计划周期任务', value: '8个', status: '待处理' },
  { name: '待审核报告', value: '125份', status: '已完成' },
]
const rankRows = [
  { id: 'r1', area: '西湖区', schools: 56, students: '28600', doneRate: '96%', abnormalRate: '17.8%', recheckRate: '86%' },
  { id: 'r2', area: '拱墅区', schools: 48, students: '22400', doneRate: '91%', abnormalRate: '18.9%', recheckRate: '80%' },
  { id: 'r3', area: '滨江区', schools: 42, students: '19800', doneRate: '88%', abnormalRate: '16.7%', recheckRate: '77%' },
]
const rankColumns = [
  { key: 'area', label: '区域', width: 90 },
  { key: 'schools', label: '学校数量', width: 86 },
  { key: 'students', label: '学生数量', width: 92 },
  { key: 'doneRate', label: '完成率', width: 78 },
  { key: 'abnormalRate', label: '异常率', width: 78 },
  { key: 'recheckRate', label: '复筛率', width: 78 },
]
const batchRows = [
  { id: 'b1', name: '2026春季五健筛查', schools: '356所学校', plan: '128560人', doneRate: '89%', abnormalRate: '17.6%', status: '执行中' },
  { id: 'b2', name: '2025秋季五健筛查', schools: '332所学校', plan: '119300人', doneRate: '100%', abnormalRate: '16.9%', status: '已完成' },
]
const batchColumns = [
  { key: 'name', label: '批次名称', width: 154 },
  { key: 'schools', label: '覆盖学校', width: 100 },
  { key: 'plan', label: '计划人数', width: 96 },
  { key: 'doneRate', label: '完成率', width: 74 },
  { key: 'abnormalRate', label: '异常率', width: 74 },
  { key: 'status', label: '状态', width: 78 },
]
const warnings = [
  ['西湖区', '部分学校筛查完成率低于80%'],
  ['杭州市', '视力异常率较去年增长3.2%'],
  ['某医疗机构', '复筛任务完成滞后'],
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
  Object.assign(filters, { province: '浙江省', city: '杭州市', district: '西湖区', batch: '2026春季五健筛查', dateRange: '2026-01-01 至 2026-08-31' })
  refreshed.value++
}
function openDialog(title, rows) {
  dialogTitle.value = title
  dialogRows.value = rows
  dialogVisible.value = true
}
function openSchool(row) {
  openDialog(`${row.school}执行详情`, [
    ['所属区域', row.area],
    ['计划筛查人数', row.plan],
    ['已完成人数', row.done],
    ['完成率', row.rate],
    ['当前状态', row.status],
  ])
}
function openAbnormal(item) {
  openDialog(`${item.name}明细`, [
    ['检出人数', item.count],
    ['检出率', item.rate],
    ['重点区域', filters.district],
    ['监管动作', '生成复筛名单并纳入随访闭环'],
  ])
}
function openPending(item) {
  openDialog(`${item.name}处理事项`, [
    ['数量', item.value],
    ['状态', item.status],
    ['责任范围', `${filters.city}${filters.district}`],
    ['处理要求', '督导责任单位在计划周期内完成闭环处理'],
  ])
}
async function renderCharts() {
  const echarts = await loadEcharts()
  await nextTick()
  if (!barChart.value || !lineChart.value) return
  barInstance ||= echarts.init(barChart.value)
  lineInstance ||= echarts.init(lineChart.value)
  barInstance.setOption({
    animation: false,
    grid: { left: 46, right: 14, top: 18, bottom: 30 },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 8, itemWidth: 12, itemHeight: 8, textStyle: { fontSize: 12 } },
    xAxis: { type: 'category', data: participationRows.map((item) => item.name), axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { color: '#edf0f2' } } },
    series: [
      { name: '应检人数', type: 'bar', barWidth: 18, data: participationRows.map((item) => item.plan), itemStyle: { color: '#b7d4ee' } },
      { name: '已检人数', type: 'bar', barWidth: 18, data: participationRows.map((item) => item.done), itemStyle: { color: '#8fc7a3' } },
    ],
  })
  lineInstance.setOption({
    animation: false,
    grid: { left: 44, right: 18, top: 18, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['7-1', '7-5', '7-10', '7-15'], boundaryGap: false, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { fontSize: 11 }, splitLine: { lineStyle: { color: '#edf0f2' } } },
    series: [{ name: '每日完成学生数量', type: 'line', data: [12800, 32600, 68500, 119820], smooth: true, symbolSize: 6, lineStyle: { color: '#5f8db8', width: 2 }, itemStyle: { color: '#5f8db8' }, areaStyle: { color: 'rgba(95,141,184,.12)' } }],
  })
}
onMounted(() => {
  renderCharts()
  resizeObserver = new ResizeObserver(() => {
    barInstance?.resize()
    lineInstance?.resize()
  })
  if (barChart.value) resizeObserver.observe(barChart.value)
  if (lineChart.value) resizeObserver.observe(lineChart.value)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  barInstance?.dispose()
  lineInstance?.dispose()
})
</script>

<template>
  <div class="supervision-page">
    <div class="breadcrumb">单页面演示 &gt; 区域监管驾驶舱</div>
    <section class="filter-panel">
      <strong>监管范围</strong>
      <label>行政区域<select v-model="filters.province"><option>浙江省</option></select></label>
      <label>城市<select v-model="filters.city"><option>杭州市</option><option>宁波市</option></select></label>
      <label>区县<select v-model="filters.district"><option>西湖区</option><option>拱墅区</option><option>滨江区</option></select></label>
      <label>筛查批次<select v-model="filters.batch"><option>2026春季五健筛查</option><option>2025秋季五健筛查</option></select></label>
      <label>时间范围<input v-model="filters.dateRange" /></label>
      <button class="primary-btn" type="button" @click="refreshed++">查询</button><button type="button" @click="resetFilters">重置</button>
    </section>
    <section class="metric-row"><header>区域筛查总体情况</header><article v-for="item in metrics" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></article></section>
    <section class="scroll-area">
      <section class="task-panel">
        <header>筛查任务执行情况</header>
        <article v-for="row in taskRows" :key="row.id">
          <strong>{{ row.name }}</strong>
          <span>任务学校：{{ row.schools }}</span><span>已完成：{{ row.done }}</span><span>进行中：{{ row.doing }}</span><span>未开始：{{ row.pending }}</span><span>完成率：{{ row.rate }}%</span>
          <div class="progress"><i :style="{ width: `${row.rate}%` }"></i></div>
        </article>
      </section>
      <section class="main-grid">
        <div class="panel school-panel">
          <header>学校覆盖情况</header>
          <div class="summary-strip"><span v-for="item in schoolSummary" :key="item[0]">{{ item[0] }}：<b>{{ item[1] }}</b></span></div>
          <LegacyTable :rows="schoolRows" :columns="schoolColumns"><template #school="{ row }"><button class="link-btn" type="button" @click="openSchool(row)">{{ row.school }}</button></template><template #status="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable>
        </div>
        <div class="panel chart-panel"><header>学生参检情况</header><div class="chart" ref="barChart"></div></div>
        <div class="panel abnormal-panel">
          <header>异常检出情况</header>
          <button v-for="item in abnormalItems" :key="item.name" type="button" @click="openAbnormal(item)"><span>{{ item.name }}</span><strong>{{ item.count }}</strong><small>检出率：{{ item.rate }}</small></button>
        </div>
        <div class="panel follow-panel"><header>复筛与随访进度</header><article v-for="item in followupItems" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></article></div>
        <div class="panel pending-panel"><header>待处理任务</header><button v-for="item in pendingItems" :key="item.name" type="button" @click="openPending(item)"><span>{{ item.name }}</span><strong>{{ item.value }}</strong><em :class="item.status">{{ item.status }}</em></button></div>
        <div class="panel rank-panel"><header>区域执行情况排名</header><LegacyTable :rows="rankRows" :columns="rankColumns" /></div>
        <div class="panel batch-panel"><header>筛查批次管理</header><LegacyTable :rows="batchRows" :columns="batchColumns"><template #status="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable></div>
        <div class="panel chart-panel"><header>工作进度趋势</header><div class="chart" ref="lineChart"></div></div>
        <div class="panel warning-panel"><header>监管预警</header><article v-for="item in warnings" :key="item[0]"><strong>{{ item[0] }}</strong><span>{{ item[1] }}</span></article></div>
      </section>
    </section>
    <div v-if="dialogVisible" class="modal-mask">
      <section class="dialog"><header>{{ dialogTitle }}</header><div><p v-for="row in dialogRows" :key="row[0]"><span>{{ row[0] }}</span><strong>{{ row[1] }}</strong></p></div><footer><button type="button" @click="dialogVisible=false">关闭</button></footer></section>
    </div>
  </div>
</template>

<style scoped>
.supervision-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.filter-panel{min-height:70px;margin-top:8px;padding:8px 10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;border:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.filter-panel strong{width:100%;font-size:12px}.filter-panel label{display:flex;align-items:center;gap:5px}.filter-panel select,.filter-panel input{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;font-size:12px}.filter-panel select{width:126px}.filter-panel input{width:178px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.metric-row{height:68px;margin-top:8px;display:grid;grid-template-columns:150px repeat(6,1fr);border:1px solid #d8d8d8;background:#fff}.metric-row header{display:flex;align-items:center;padding:0 10px;border-right:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.metric-row article{padding:10px;border-right:1px solid #e6e8eb}.metric-row span{display:block;color:#666;font-size:12px}.metric-row strong{display:block;margin-top:6px;color:#244b70;font-size:17px}.scroll-area{min-height:0;flex:1;margin-top:8px;overflow:auto;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.task-panel,.panel{border:1px solid #d8d8d8;background:#fff}.task-panel header,.panel header{height:32px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.task-panel article{min-height:70px;padding:9px 10px;display:grid;grid-template-columns:1.2fr repeat(5,.7fr);gap:8px;align-items:center;font-size:12px}.task-panel strong{color:#244b70}.progress{grid-column:1/-1;height:10px;border:1px solid #c6ddd0;background:#f1f8f3}.progress i{display:block;height:100%;background:#9ed2af}.main-grid{margin-top:8px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:8px}.school-panel,.rank-panel,.batch-panel{min-height:210px}.summary-strip{height:36px;padding:0 10px;display:flex;align-items:center;gap:22px;border-bottom:1px solid #e6e8eb;background:#fafafa;font-size:12px}.summary-strip b{color:#244b70}.panel :deep(.legacy-table-wrap){height:170px;min-height:0}.school-panel :deep(.legacy-table){min-width:612px}.rank-panel :deep(.legacy-table){min-width:502px}.batch-panel :deep(.legacy-table){min-width:576px}.link-btn{height:auto;padding:0;border:0;background:transparent;color:#2d6fba}.chart-panel{height:210px}.chart{height:176px}.abnormal-panel{display:grid;grid-template-columns:repeat(5,1fr);align-content:start}.abnormal-panel header,.follow-panel header,.pending-panel header{grid-column:1/-1}.abnormal-panel button{height:78px;margin:8px 0 8px 8px;padding:8px;text-align:left;border-color:#d8d8d8;background:#fafafa}.abnormal-panel button:last-child{margin-right:8px}.abnormal-panel span,.abnormal-panel strong,.abnormal-panel small{display:block}.abnormal-panel strong{margin:8px 0 4px;color:#244b70;font-size:16px}.abnormal-panel small{color:#666}.follow-panel{display:grid;grid-template-columns:repeat(7,1fr)}.follow-panel article{height:72px;padding:10px;border-right:1px solid #e6e8eb;font-size:12px}.follow-panel span,.follow-panel strong{display:block}.follow-panel strong{margin-top:7px;color:#244b70;font-size:16px}.pending-panel{display:grid;grid-template-columns:repeat(4,1fr)}.pending-panel button{height:68px;margin:8px 0 8px 8px;padding:8px;text-align:left;border-color:#d8d8d8;background:#fff}.pending-panel button:last-child{margin-right:8px}.pending-panel span,.pending-panel strong{display:block}.pending-panel strong{margin:5px 0;color:#244b70;font-size:15px}em{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #b8d8c4;border-radius:2px;background:#eef8f1;color:#34724a;font-size:12px;font-style:normal}em.待处理{border-color:#efc8bd;background:#fff2ee;color:#a64b35}em.处理中,em.进行中,em.执行中{border-color:#d7c591;background:#fff9e8;color:#80611c}.warning-panel{height:210px}.warning-panel article{padding:12px 10px;border-bottom:1px solid #e6e8eb;font-size:12px}.warning-panel strong{display:block;color:#244b70}.warning-panel span{display:block;margin-top:5px;color:#555}.modal-mask{position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:rgba(0,0,0,.24)}.dialog{width:430px;border:1px solid #9facba;background:#fff;font-size:12px}.dialog header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.dialog div{padding:12px 16px}.dialog p{margin:0;display:grid;grid-template-columns:120px 1fr;min-height:30px;align-items:center;border-bottom:1px solid #edf0f2}.dialog span{color:#666}.dialog footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;border-top:1px solid #d8d8d8;background:#f7f9fb}
</style>
