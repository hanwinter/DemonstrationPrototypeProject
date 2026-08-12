<script setup>
import { computed, reactive, ref } from 'vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const filters = reactive({
  province: '浙江省',
  city: '杭州市',
  district: '西湖区',
  school: '',
  stage: '小学',
  grade: '',
  gender: '',
  year: '2025-2026学年',
  batch: '',
})
const activeHealth = ref('vision')
const activeDimension = ref('school')
const trendYear = ref('近四年')
const refreshed = ref(0)

const healthTabs = [
  { key: 'vision', label: '视力健康' },
  { key: 'caries', label: '龋齿健康' },
  { key: 'weight', label: '体重健康' },
  { key: 'spine', label: '脊柱健康' },
  { key: 'mental', label: '心理健康' },
]
const dimensionTabs = [
  ['region', '区域分析'],
  ['school', '学校分析'],
  ['stage', '学段分析'],
  ['grade', '年级分析'],
  ['gender', '性别分析'],
  ['year', '学年分析'],
]
const metrics = [
  ['筛查覆盖率', '92.5%'],
  ['阳性检出率', '18.6%'],
  ['复筛完成率', '86.3%'],
  ['随访完成率', '78.9%'],
  ['累计筛查人数', '128560人'],
]
const visionPie = [
  ['正常', 81400, '#dceafa'],
  ['轻度异常', 26800, '#f7e2c5'],
  ['中高度异常', 11800, '#f2c7bd'],
]
const regionBars = [
  ['杭州市', 22.5],
  ['西湖区', 18.6],
  ['拱墅区', 24.2],
  ['滨江区', 17.8],
  ['上城区', 20.1],
]
const cariesTrend = [
  ['2023', 12.8],
  ['2024', 13.6],
  ['2025', 14.9],
  ['2026', 15.4],
]
const weightBars = [
  ['五年级男', 10.8],
  ['六年级男', 12.5],
  ['五年级女', 8.6],
  ['六年级女', 9.2],
]
const spineTrend = [
  ['2024', 3.6],
  ['2025', 4.1],
  ['2026', 4.8],
]
const mentalBars = [
  ['三年级', 4.2],
  ['四年级', 5.1],
  ['五年级', 6.6],
  ['六年级', 7.4],
]
const dimensionRows = [
  { id: 's1', name: '宁安路第一小学', screened: 3280, abnormal: 612, positive: '18.7%', recheck: '85.4%', followup: '79.2%' },
  { id: 's2', name: '文澜小学', screened: 2860, abnormal: 486, positive: '17.0%', recheck: '87.1%', followup: '80.5%' },
  { id: 's3', name: '西湖实验学校', screened: 3520, abnormal: 752, positive: '21.4%', recheck: '84.2%', followup: '76.8%' },
  { id: 's4', name: '城西第一小学', screened: 2400, abnormal: 392, positive: '16.3%', recheck: '89.0%', followup: '82.3%' },
]
const rankRows = [
  { id: 'r1', region: '拱墅区', screened: 9800, positiveCount: 2100, positive: '21.4%', recheck: '83.2%' },
  { id: 'r2', region: '西湖区', screened: 12000, positiveCount: 2200, positive: '18.3%', recheck: '86.3%' },
  { id: 'r3', region: '滨江区', screened: 7600, positiveCount: 1350, positive: '17.8%', recheck: '88.1%' },
]
const trendRows = [
  ['2023', 17.1, 12.8, 8.6, 3.2, 4.8],
  ['2024', 18.0, 13.6, 9.1, 3.8, 5.4],
  ['2025', 19.4, 14.9, 9.7, 4.2, 6.0],
  ['2026', 21.2, 15.4, 10.3, 4.8, 6.8],
]
const dimensionColumns = [
  { key: 'name', label: '学校名称', width: 160 },
  { key: 'screened', label: '筛查人数', width: 90 },
  { key: 'abnormal', label: '异常人数', width: 90 },
  { key: 'positive', label: '阳性率', width: 80 },
  { key: 'recheck', label: '复筛率', width: 80 },
  { key: 'followup', label: '随访率', width: 80 },
]
const rankColumns = [
  { key: 'region', label: '区域', width: 100 },
  { key: 'screened', label: '筛查人数', width: 90 },
  { key: 'positiveCount', label: '阳性人数', width: 90 },
  { key: 'positive', label: '阳性率', width: 80 },
  { key: 'recheck', label: '复筛率', width: 80 },
]
const healthTitle = computed(() => healthTabs.find((item) => item.key === activeHealth.value)?.label || '')

function resetFilters() {
  Object.assign(filters, { province: '浙江省', city: '杭州市', district: '西湖区', school: '', stage: '小学', grade: '', gender: '', year: '2025-2026学年', batch: '' })
}
function barHeight(value) {
  return Math.max(8, value * 4)
}
function linePoints(rows, index) {
  const values = rows.map((row) => row[index])
  const min = Math.min(...values)
  const max = Math.max(...values)
  return values.map((value, i) => `${42 + i * 88},${132 - ((value - min) / Math.max(1, max - min)) * 88}`).join(' ')
}
</script>

<template>
  <div class="analysis-page">
    <div class="breadcrumb">单页面演示 &gt; 区域数据分析</div>
    <section class="filter-panel">
      <strong>分析条件</strong>
      <label>区域<select v-model="filters.province"><option>浙江省</option></select></label>
      <label>城市<select v-model="filters.city"><option>杭州市</option></select></label>
      <label>区县<select v-model="filters.district"><option>西湖区</option><option>拱墅区</option></select></label>
      <label>学校<select v-model="filters.school"><option value="">请选择</option><option>宁安路第一小学</option></select></label>
      <label>学段<select v-model="filters.stage"><option>小学</option><option>初中</option></select></label>
      <label>年级<select v-model="filters.grade"><option value="">全部</option><option>六年级</option></select></label>
      <label>性别<select v-model="filters.gender"><option value="">全部</option><option>男</option><option>女</option></select></label>
      <label>学年<select v-model="filters.year"><option>2025-2026学年</option></select></label>
      <label>筛查批次<select v-model="filters.batch"><option value="">全部</option><option>2026年度体检</option></select></label>
      <button class="primary-btn" @click="refreshed++">查询</button><button @click="resetFilters">重置</button>
    </section>
    <section class="metric-row"><header>区域筛查工作指标</header><article v-for="item in metrics" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></article></section>
    <section class="health-panel">
      <header><strong>五健健康指标分析</strong><nav><button v-for="item in healthTabs" :key="item.key" :class="{ active: activeHealth === item.key }" @click="activeHealth = item.key">{{ item.label }}</button></nav></header>
      <div v-if="activeHealth === 'vision'" class="health-grid">
        <div class="chart-box"><h3>视力异常情况</h3><svg viewBox="0 0 220 150"><circle cx="70" cy="76" r="42" fill="#dceafa"/><path d="M70 76 L70 34 A42 42 0 0 1 108 94 Z" fill="#f7e2c5"/><path d="M70 76 L108 94 A42 42 0 0 1 46 111 Z" fill="#f2c7bd"/></svg><p v-for="item in visionPie" :key="item[0]"><i :style="{background:item[2]}"></i>{{ item[0] }} {{ item[1] }}人</p></div>
        <div class="chart-box"><h3>不同区域阳性率</h3><div class="bar-chart"><span v-for="item in regionBars" :key="item[0]"><b :style="{height: `${barHeight(item[1])}px`}"></b><em>{{ item[0] }}</em><strong>{{ item[1] }}%</strong></span></div></div>
      </div>
      <div v-else-if="activeHealth === 'caries'" class="health-grid"><div class="chart-box"><h3>龋齿检出率趋势</h3><svg viewBox="0 0 390 160"><polyline :points="linePoints(cariesTrend,1)" fill="none" stroke="#5f8db8" stroke-width="2"/><line x1="30" y1="135" x2="360" y2="135" stroke="#ccc"/></svg></div><div class="chart-box table-mini"><h3>学校排名</h3><table><tr><th>学校</th><th>筛查人数</th><th>龋齿人数</th><th>检出率</th></tr><tr><td>西湖实验学校</td><td>3520</td><td>620</td><td>17.6%</td></tr><tr><td>宁安路第一小学</td><td>3280</td><td>486</td><td>14.8%</td></tr></table></div></div>
      <div v-else-if="activeHealth === 'weight'" class="health-grid"><div class="chart-box"><h3>体重健康分析</h3><div class="bar-chart"><span v-for="item in weightBars" :key="item[0]"><b :style="{height: `${barHeight(item[1])}px`}"></b><em>{{ item[0] }}</em><strong>{{ item[1] }}%</strong></span></div></div><div class="chart-box"><h3>BMI分布</h3><p>正常 78.4%</p><p>超重 11.3%</p><p>肥胖 10.3%</p></div></div>
      <div v-else-if="activeHealth === 'spine'" class="health-grid"><div class="chart-box"><h3>脊柱健康分析</h3><p>正常 95.2%</p><p>低风险 3.6%</p><p>高风险 1.2%</p></div><div class="chart-box"><h3>近三年风险变化</h3><svg viewBox="0 0 390 160"><polyline :points="linePoints(spineTrend,1)" fill="none" stroke="#5f8db8" stroke-width="2"/><line x1="30" y1="135" x2="360" y2="135" stroke="#ccc"/></svg></div></div>
      <div v-else class="health-grid"><div class="chart-box"><h3>心理健康分析</h3><p>正常 93.2%</p><p>关注 5.6%</p><p>高风险 1.2%</p></div><div class="chart-box"><h3>不同年级心理风险比例</h3><div class="bar-chart"><span v-for="item in mentalBars" :key="item[0]"><b :style="{height: `${barHeight(item[1])}px`}"></b><em>{{ item[0] }}</em><strong>{{ item[1] }}%</strong></span></div></div></div>
    </section>
    <section class="bottom-grid">
      <div class="panel dimension"><header>维度分析<nav><button v-for="item in dimensionTabs" :key="item[0]" :class="{ active: activeDimension === item[0] }" @click="activeDimension = item[0]">{{ item[1] }}</button></nav></header><LegacyTable :rows="dimensionRows" :columns="dimensionColumns" /></div>
      <div class="panel"><header>重点关注区域</header><LegacyTable :rows="rankRows" :columns="rankColumns" /></div>
      <div class="panel trend"><header>健康趋势变化<select v-model="trendYear"><option>近四年</option><option>2026年</option></select></header><svg viewBox="0 0 420 170"><line x1="35" y1="140" x2="390" y2="140" stroke="#ccc"/><polyline :points="linePoints(trendRows,1)" fill="none" stroke="#5f8db8" stroke-width="2"/><polyline :points="linePoints(trendRows,2)" fill="none" stroke="#c58b4f" stroke-width="2"/><polyline :points="linePoints(trendRows,3)" fill="none" stroke="#8aa06a" stroke-width="2"/></svg></div>
      <div class="panel warning"><header>重点关注指标</header><article><strong>视力异常率连续两年升高</strong><span>涉及学校：12所</span></article><article><strong>肥胖率超过区域平均水平</strong><span>涉及学校：8所</span></article><article><strong>心理风险比例需关注</strong><span>涉及学校：5所</span></article></div>
    </section>
  </div>
</template>

<style scoped>
.analysis-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.filter-panel{min-height:76px;margin-top:8px;padding:8px 10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;border:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.filter-panel strong{width:100%}.filter-panel label{display:flex;align-items:center;gap:5px}.filter-panel select{height:28px;width:120px;border:1px solid #bfc7d1;background:#fff;font-size:12px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn,.health-panel nav button.active,.dimension nav button.active{border-color:#9fb7cf;background:#dceafa;color:#244b70}.metric-row{height:80px;margin-top:8px;display:grid;grid-template-columns:150px repeat(5,1fr);border:1px solid #d8d8d8;background:#fff}.metric-row header{display:flex;align-items:center;padding:0 10px;border-right:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.metric-row article{padding:12px 10px;border-right:1px solid #e6e8eb}.metric-row span{display:block;color:#666;font-size:12px}.metric-row strong{display:block;margin-top:7px;color:#244b70;font-size:18px}.health-panel{height:250px;margin-top:8px;border:1px solid #d8d8d8;background:#fff}.health-panel>header,.panel header{height:34px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px}.health-panel nav,.dimension nav{display:flex;gap:4px}.health-grid{height:214px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.chart-box{border:1px solid #d8d8d8;background:#fafafa;padding:8px;font-size:12px;overflow:hidden}.chart-box h3{margin:0 0 6px;font-size:12px}.chart-box svg{height:145px;max-width:100%}.chart-box p{margin:5px 0}.chart-box i{display:inline-block;width:10px;height:10px;margin-right:5px}.bar-chart{height:170px;display:flex;align-items:end;gap:14px;padding:8px 10px}.bar-chart span{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px}.bar-chart b{width:28px;background:#9fb7cf}.bar-chart em{font-style:normal}.bar-chart strong{font-weight:400;color:#244b70}.table-mini table{width:100%;border-collapse:collapse}.table-mini th,.table-mini td{height:28px;border:1px solid #d8d8d8;padding:0 6px}.bottom-grid{min-height:0;flex:1;margin-top:8px;display:grid;grid-template-columns:1.2fr 1fr;grid-template-rows:1fr 170px;gap:8px}.panel{min-height:0;border:1px solid #d8d8d8;background:#fff;overflow:hidden}.panel :deep(.legacy-table-wrap){height:calc(100% - 34px);min-height:0}.panel :deep(.legacy-table){min-width:580px}.trend svg{width:100%;height:130px;margin-top:4px}.trend select{height:26px;border:1px solid #bfc7d1;background:#fff;font-size:12px}.warning article{padding:10px;border-bottom:1px solid #e6e8eb;font-size:12px}.warning strong,.warning span{display:block;line-height:1.7}.warning span{color:#666}
</style>
