<script setup>
import { computed, reactive, ref } from 'vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const activeRegion = ref('hz')
const trendType = ref('vision')
const reportVisible = ref(false)
const activeReport = ref(null)
const query = reactive({ name: '顾禾雨', certNo: '110100********400X', school: '', year: '' })

const regions = {
  zj: { name: '浙江省卫生健康委员会', label: '浙江省', students: '128万人', metrics: ['12个', '128家', '356所', '85万人', '320万条'] },
  hz: { name: '杭州市', label: '杭州市', students: '32万人', metrics: ['5个', '56家', '142所', '28万人', '116万条'] },
  xh: { name: '西湖区', label: '西湖区', students: '5.8万人', metrics: ['1个', '16家', '38所', '5.8万人', '21万条'] },
  xhfy: { name: '西湖区妇幼保健院', label: '西湖区妇幼保健院', students: '1.2万人', metrics: ['1个', '1家', '18所', '1.2万人', '4.6万条'] },
  school: { name: '宁安路第一小学', label: '宁安路第一小学', students: '2800人', metrics: ['1个', '1家', '1所', '2800人', '1.1万条'] },
}
const regionChain = ['zj', 'hz', 'xh', 'xhfy', 'school']
const metricLabels = ['接入区域', '医疗机构', '学校数量', '健康档案', '累计筛查记录']
const sourceRows = [
  { id: 'd1', index: 1, name: '西湖区妇幼保健院', level: '医疗机构', area: '杭州市西湖区', count: '12000', updateTime: '2026-08-12', status: '正常' },
  { id: 'd2', index: 2, name: '杭州市妇幼保健院', level: '医疗机构', area: '杭州市', count: '56000', updateTime: '2026-08-12', status: '正常' },
  { id: 'd3', index: 3, name: '宁安路第一小学', level: '学校', area: '杭州市西湖区', count: '2800', updateTime: '2026-08-11', status: '正常' },
  { id: 'd4', index: 4, name: '宁安路第一中学', level: '学校', area: '杭州市西湖区', count: '3100', updateTime: '2026-08-10', status: '正常' },
]
const sourceColumns = [
  { key: 'index', label: '序号', width: 54 },
  { key: 'name', label: '机构名称', width: 170 },
  { key: 'level', label: '机构级别', width: 90 },
  { key: 'area', label: '所属区域', width: 130 },
  { key: 'count', label: '累计筛查人数', width: 110 },
  { key: 'updateTime', label: '数据更新时间', width: 120 },
  { key: 'status', label: '状态', width: 80 },
]
const archive = {
  name: '顾禾雨',
  gender: '女',
  age: '13岁6个月',
  school: '宁安路第一中学',
  gradeClass: '七年级3班',
  certNo: '110100********400X',
  firstYear: '2022年',
  examCount: '8次',
  abnormalCount: '5项',
  followupCount: '12次',
}
const timeline = [
  { year: '2026年', date: '2026-07-13', type: '入校筛查', school: '宁安路第一中学', result: '异常', abnormal: '视力下降、脊柱侧弯风险、心理风险' },
  { year: '2026年', date: '2026-07-20', type: '院内复筛', school: '西湖区妇幼保健院', result: '待复查', abnormal: '视力复查、脊柱复查' },
  { year: '2025年', date: '2025-09-01', type: '学籍变化', school: '宁安路第一中学', result: '已关联', abnormal: '由宁安路第一小学升学至宁安路第一中学，历史筛查记录保持关联。' },
  { year: '2025年', date: '2025-04-10', type: '入校筛查', school: '宁安路第一小学', result: '异常', abnormal: '裸眼视力下降' },
  { year: '2024年', date: '2024-04-02', type: '入校筛查', school: '宁安路第一小学', result: '正常', abnormal: '--' },
  { year: '2023年', date: '2023-04-03', type: '入校筛查', school: '宁安路第一小学', result: '异常', abnormal: '视力异常首次发现' },
  { year: '2022年', date: '2022-04-02', type: '入校筛查', school: '宁安路第一小学', result: '正常', abnormal: '--' },
]
const abnormalItems = [
  ['视力异常', '2023年', '4次'],
  ['脊柱异常风险', '2025年', '2次'],
  ['心理风险', '2026年', '1次'],
]
const reportRows = [
  { id: 'r1', date: '2026-07-13', type: '入校筛查', org: '西湖区妇幼保健院', result: '异常', report: '查看报告' },
  { id: 'r2', date: '2025-04-10', type: '入校筛查', org: '西湖区妇幼保健院', result: '异常', report: '查看报告' },
  { id: 'r3', date: '2024-04-02', type: '入校筛查', org: '西湖区妇幼保健院', result: '正常', report: '查看报告' },
]
const reportColumns = [
  { key: 'date', label: '检查日期', width: 110 },
  { key: 'type', label: '筛查类型', width: 110 },
  { key: 'org', label: '机构', width: 160 },
  { key: 'result', label: '结果', width: 80 },
  { key: 'actions', label: '报告', width: 100, type: 'actions' },
]
const groupedTimeline = computed(() => timeline.reduce((acc, row) => {
  ;(acc[row.year] ||= []).push(row)
  return acc
}, {}))
const activeMetrics = computed(() => regions[activeRegion.value].metrics)
const trendPoints = computed(() => trendType.value === 'vision' ? [5.0, 4.9, 4.8, 4.6, 4.3] : trendType.value === 'growth' ? [132, 138, 144, 148, 150] : [0, 1, 0, 2, 3])

function chartPolyline(points) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  return points.map((value, index) => `${36 + index * 64},${116 - ((value - min) / Math.max(1, max - min)) * 78}`).join(' ')
}
function openReport(row) {
  activeReport.value = row
  reportVisible.value = true
}
</script>

<template>
  <div class="regional-page">
    <div class="breadcrumb">单页面演示 &gt; 区域数据汇聚与健康档案</div>
    <section class="aggregation">
      <header>区域数据汇聚情况</header>
      <div class="chain">
        <button v-for="(key,index) in regionChain" :key="key" :class="{ active: activeRegion === key }" type="button" @click="activeRegion = key">
          <strong>{{ regions[key].label }}</strong><span>{{ regions[key].students }}</span>
        </button>
        <i v-for="i in 4" :key="i">→</i>
      </div>
      <div class="metrics"><article v-for="(label,index) in metricLabels" :key="label"><span>{{ label }}</span><strong>{{ activeMetrics[index] }}</strong></article></div>
    </section>
    <section class="source-list">
      <header>数据来源</header>
      <LegacyTable :rows="sourceRows" :columns="sourceColumns"><template #status="{ value }"><em>{{ value }}</em></template></LegacyTable>
    </section>
    <section class="archive-search">
      <strong>连续健康档案查询</strong>
      <label>姓名：<input v-model="query.name" /></label>
      <label>身份证号：<input v-model="query.certNo" /></label>
      <label>学校：<select v-model="query.school"><option value="">请选择</option><option>宁安路第一中学</option><option>宁安路第一小学</option></select></label>
      <label>学年：<select v-model="query.year"><option value="">全部</option><option>2026年</option><option>2025年</option></select></label>
      <button class="primary-btn" type="button">查询</button><button type="button" @click="Object.assign(query,{name:'',certNo:'',school:'',year:''})">重置</button>
    </section>
    <section class="archive-area">
      <div class="archive-main">
        <div class="student-line"><strong>{{ archive.name }}　{{ archive.gender }}　{{ archive.age }}</strong><span>当前学校：{{ archive.school }} {{ archive.gradeClass }}</span><span>身份证：{{ archive.certNo }}</span><span>首次建档：{{ archive.firstYear }}</span><span>累计筛查：{{ archive.examCount }}</span><span>异常记录：{{ archive.abnormalCount }}</span><span>随访记录：{{ archive.followupCount }}</span></div>
        <div class="timeline">
          <h3>健康档案时间轴</h3>
          <section v-for="(rows, year) in groupedTimeline" :key="year">
            <h4>{{ year }}</h4>
            <article v-for="row in rows" :key="row.date + row.type">
              <time>{{ row.date }}</time><div><strong>{{ row.type }}</strong><em :class="row.result">{{ row.result }}</em><p>学校/机构：{{ row.school }}</p><p>异常指标：{{ row.abnormal }}</p></div>
            </article>
          </section>
        </div>
      </div>
      <aside class="archive-side">
        <section>
          <h3>健康指标变化趋势</h3>
          <div class="trend-tabs"><button :class="{ active: trendType === 'vision' }" @click="trendType='vision'">视力变化</button><button :class="{ active: trendType === 'growth' }" @click="trendType='growth'">身高体重变化</button><button :class="{ active: trendType === 'abnormal' }" @click="trendType='abnormal'">异常指标变化</button></div>
          <svg viewBox="0 0 320 140"><line x1="30" y1="120" x2="300" y2="120" stroke="#cfd6df"/><line x1="30" y1="25" x2="30" y2="120" stroke="#cfd6df"/><polyline :points="chartPolyline(trendPoints)" fill="none" stroke="#5f8db8" stroke-width="2"/></svg>
        </section>
        <section><h3>历史异常指标</h3><article v-for="item in abnormalItems" :key="item[0]" class="abnormal"><strong>{{ item[0] }}</strong><span>首次发现：{{ item[1] }}</span><span>累计次数：{{ item[2] }}</span></article></section>
        <section><h3>数据访问范围</h3><p>当前用户：杭州市管理员</p><p>可查看：杭州市全部学生健康档案</p><p>不可查看：其他市级数据</p></section>
        <section class="reports"><h3>历史筛查报告</h3><LegacyTable :rows="reportRows" :columns="reportColumns"><template #actions="{ row }"><button class="link-btn" @click="openReport(row)">查看报告</button></template><template #result="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable></section>
      </aside>
    </section>
    <div v-if="reportVisible" class="modal-mask"><section class="report-dialog"><header>报告预览</header><div><p>学生：{{ archive.name }}</p><p>检查日期：{{ activeReport.date }}</p><p>筛查类型：{{ activeReport.type }}</p><p>筛查结论：{{ activeReport.result }}</p><p>健康建议：持续关注异常指标变化，按区域随访计划完成复查和干预。</p></div><footer><button @click="reportVisible=false">关闭</button></footer></section></div>
  </div>
</template>

<style scoped>
.regional-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.aggregation,.source-list,.archive-search,.archive-area{border:1px solid #d8d8d8;background:#fff}.aggregation{height:148px;margin-top:8px}.aggregation header,.source-list header{height:30px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.chain{height:58px;padding:8px 10px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px;position:relative}.chain button{height:42px;border:1px solid #cfd6df;background:#fff;text-align:left}.chain button.active{background:#eef5fc;border-color:#9fb7cf}.chain strong,.chain span{display:block;padding-left:8px;font-size:12px}.chain span{color:#666}.chain i{position:relative;top:-37px;left:100%;color:#999}.metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:0 10px}.metrics article{height:44px;padding:6px 8px;border:1px solid #d8d8d8;background:#fafafa}.metrics span{display:block;color:#666;font-size:12px}.metrics strong{font-size:16px;color:#244b70}.source-list{height:150px;margin-top:8px;display:flex;flex-direction:column}.source-list :deep(.legacy-table-wrap){height:119px;min-height:0}.source-list :deep(.legacy-table){min-width:850px}.archive-search{height:42px;margin-top:8px;padding:7px 10px;display:flex;align-items:center;gap:10px;font-size:12px}.archive-search input,.archive-search select{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;font-size:12px}.archive-search input{width:135px}.archive-search select{width:130px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.archive-area{min-height:0;flex:1;margin-top:8px;display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:0}.archive-main,.archive-side{min-height:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.student-line{min-height:62px;padding:9px 10px;display:flex;align-items:center;flex-wrap:wrap;gap:6px 20px;border-bottom:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.student-line strong{font-size:14px}.timeline{padding:10px}.timeline h3,.archive-side h3{height:28px;margin:0;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;font-size:12px}.timeline h4{margin:10px 0 4px;font-size:13px}.timeline article{display:grid;grid-template-columns:92px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid #edf0f2;font-size:12px}.timeline p{margin:4px 0;color:#555}.archive-side{border-left:1px solid #d8d8d8;background:#fafafa}.archive-side section{padding:8px 10px;border-bottom:1px solid #d8d8d8}.trend-tabs{display:flex;gap:4px;margin:8px 0}.trend-tabs button.active{background:#dceafa;color:#244b70}.archive-side svg{width:100%;height:130px;border:1px solid #d8d8d8;background:#fff}.abnormal{padding:7px 0;border-bottom:1px solid #e6e8eb;font-size:12px}.abnormal strong,.abnormal span{display:block;line-height:1.7}.archive-side p{margin:6px 0;font-size:12px}.reports :deep(.legacy-table-wrap){height:150px;min-height:0}.reports :deep(.legacy-table){min-width:540px}.link-btn{padding:0;border:0;background:transparent;color:#2d6fba}em{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #b8d8c4;border-radius:2px;background:#eef8f1;color:#34724a;font-size:12px;font-style:normal}em.异常,em.待复查{border-color:#efc8bd;background:#fff2ee;color:#a64b35}em.已关联{border-color:#b8cce0;background:#eef5fc;color:#244b70}.modal-mask{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(0,0,0,.25)}.report-dialog{width:460px;border:1px solid #9facba;background:#fff;font-size:12px}.report-dialog header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.report-dialog div{padding:14px 18px;line-height:1.8}.report-dialog footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;border-top:1px solid #d8d8d8;background:#f7f9fb}
</style>
