<script setup>
import { computed, reactive, ref } from 'vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const students = [
  { id: 's1', name: '林若宁', certNo: '110100********400X', gender: '女', age: '13岁6个月', school: '宁安路第一中学', gradeClass: '七年级3班', mother: '许敏', father: '林启明', phone: '185****6881', allergy: '无', history: '无' },
  { id: 's2', name: '周景然', certNo: '110100********2638', gender: '男', age: '12岁8个月', school: '宁安路第一中学', gradeClass: '七年级2班', mother: '马静', father: '周建峰', phone: '138****5678', allergy: '无', history: '哮喘史' },
  { id: 's3', name: '叶清妍', certNo: '110100********1286', gender: '女', age: '11岁2个月', school: '宁安路第一小学', gradeClass: '六年级1班', mother: '蒋洁', father: '叶成', phone: '139****4321', allergy: '花粉过敏', history: '无' },
  { id: 's4', name: '宋亦辰', certNo: '110100********4816', gender: '男', age: '10岁9个月', school: '宁安路第一小学', gradeClass: '五年级4班', mother: '梁敏', father: '宋凯', phone: '188****6193', allergy: '无', history: '无' },
]

const schools = ['宁安路第一中学', '宁安路第一小学', '滨江实验学校']
const query = reactive({ name: '', certNo: '', school: '' })
const selectedStudent = ref(students[0])
const studentDialogVisible = ref(false)
const activeTab = ref('timeline')
const activeTypes = ref(['全部'])
const growthMetric = ref('height')
const visionMetric = ref('naked')
const eyeSide = ref('both')
const reportVisible = ref(false)
const activeReport = ref(null)

const tabs = ['管理时间轴', '生长发育曲线', '视力变化曲线', '筛查记录与报告']
const typeFilters = ['全部', '入校筛查', '院内初筛', '院内复筛', '人工随访', '智能随访']
const matchedStudents = computed(() => students.filter((item) => (!query.name || item.name.includes(query.name)) && (!query.certNo || item.certNo.includes(query.certNo)) && (!query.school || item.school === query.school)))

const timelineRows = [
  { year: '2026年', date: '07-13', type: '入校筛查', status: '异常', title: '2026体检（演示用）', meta: '学校：宁安路第一中学   年级班级：七年级3班', detail: '阳性指标：戴镜视力复查异常、视力不良筛查阳性、脊柱弯曲异常筛查阳性、心理风险。' },
  { year: '2026年', date: '07-13', type: '院内初筛', status: '异常', title: '院内初筛', meta: '机构：XX妇幼保健院', detail: '阳性指标：视力不良、乳牙滞留、龋齿、拇外翻。' },
  { year: '2026年', date: '07-10', type: '院内复筛', status: '待检', title: '院内复筛预约', meta: '机构：XX妇幼保健院', detail: '已生成复筛任务，等待学生到院检查。' },
  { year: '2026年', date: '08-02', type: '智能随访', status: '已发送', title: '视力健康提醒', meta: '随访渠道：微信   阅读状态：已阅读', detail: '发送状态：发送成功。' },
  { year: '2026年', date: '05-29', type: '人工随访', status: '已完成', title: '人工随访（张医生02）', meta: '随访对象：家长', detail: '已重点告知视力下降风险及居家干预要点，耐心解答家长护眼、用眼管控相关疑问。已明确复筛时间及注意事项。' },
  { year: '2026年', date: '05-15', type: '人工随访', status: '已完成', title: '人工随访（张医生02）', meta: '随访对象：家长', detail: '本次五健筛查已结束，已向家长反馈孩子阶段性健康监测结果。建议关注居家用眼习惯，并按计划复查。' },
  { year: '2025年', date: '09-01', type: '学籍变更', status: '已完成', title: '升学档案关联', meta: '由“宁安路第一小学 六年级3班”升学至“宁安路第一中学 七年级3班”', detail: '历史健康档案继续保留并关联。' },
  { year: '2024年', date: '04-02', type: '入校筛查', status: '正常', title: '2024年度体检', meta: '学校：宁安路第一小学   年级班级：五年级3班', detail: '筛查结果正常。' },
  { year: '2023年', date: '04-03', type: '入校筛查', status: '正常', title: '2023年度体检', meta: '学校：宁安路第一小学   年级班级：四年级3班', detail: '筛查结果正常。' },
  { year: '2022年', date: '04-02', type: '入校筛查', status: '正常', title: '2022年度体检', meta: '学校：宁安路第一小学   年级班级：三年级3班', detail: '筛查结果正常。' },
]

const growthRows = [
  { date: '2022-04-02', age: '9岁', height: 132.4, weight: 30.2, bmi: 17.2 },
  { date: '2023-04-03', age: '10岁', height: 138.1, weight: 33.5, bmi: 17.6 },
  { date: '2024-04-02', age: '11岁', height: 143.7, weight: 37.2, bmi: 18.0 },
  { date: '2025-04-08', age: '12岁', height: 147.8, weight: 40.3, bmi: 18.4 },
  { date: '2026-07-13', age: '13岁6月', height: 150.0, weight: 44.0, bmi: 19.56 },
]
const visionRows = [
  { date: '2022-04-02', leftNaked: 5.0, rightNaked: 5.0, leftSphere: '+0.75', rightSphere: '+0.75', leftCorrected: 5.0, rightCorrected: 5.0 },
  { date: '2023-04-03', leftNaked: 4.9, rightNaked: 4.9, leftSphere: '+0.50', rightSphere: '+0.50', leftCorrected: 5.0, rightCorrected: 5.0 },
  { date: '2024-04-02', leftNaked: 4.8, rightNaked: 4.9, leftSphere: '+0.25', rightSphere: '+0.25', leftCorrected: 5.0, rightCorrected: 5.0 },
  { date: '2025-04-08', leftNaked: 4.6, rightNaked: 4.7, leftSphere: '-0.25', rightSphere: '-0.50', leftCorrected: 4.9, rightCorrected: 5.0 },
  { date: '2026-07-13', leftNaked: 4.3, rightNaked: 3.7, leftSphere: '-0.50', rightSphere: '-0.75', leftCorrected: 5.0, rightCorrected: 5.0 },
]
const reportRows = [
  { id: 'r1', date: '2026-07-13', batch: '2026年度体检', type: '入校筛查', org: '宁安路第一中学', result: '异常', positives: '视力/脊柱/心理', report: '已生成' },
  { id: 'r2', date: '2026-07-13', batch: '院内初筛', type: '院内筛查', org: 'XX妇幼保健院', result: '异常', positives: '视力/口腔', report: '已生成' },
  { id: 'r3', date: '2024-04-02', batch: '2024年度体检', type: '入校筛查', org: '宁安路第一小学', result: '正常', positives: '--', report: '已生成' },
]
const reportColumns = [
  { key: 'date', label: '检查日期', width: 110 },
  { key: 'batch', label: '体检批次', width: 140 },
  { key: 'type', label: '筛查类型', width: 100 },
  { key: 'org', label: '学校/机构', width: 150 },
  { key: 'result', label: '筛查结果', width: 90 },
  { key: 'positives', label: '阳性问题', width: 150 },
  { key: 'report', label: '报告状态', width: 90 },
  { key: 'actions', label: '操作', width: 100, type: 'actions' },
]

const filteredTimeline = computed(() => activeTypes.value.includes('全部') ? timelineRows : timelineRows.filter((item) => activeTypes.value.includes(item.type)))
const groupedTimeline = computed(() => filteredTimeline.value.reduce((acc, row) => {
  ;(acc[row.year] ||= []).push(row)
  return acc
}, {}))
const growthPoints = computed(() => growthRows.map((row) => row[growthMetric.value]))
const visionPoints = computed(() => visionRows.map((row) => eyeSide.value === 'right' ? row.rightNaked : row.leftNaked))

function doSearch() {
  studentDialogVisible.value = true
}
function chooseStudent(student) {
  selectedStudent.value = student
  studentDialogVisible.value = false
}
function toggleType(type) {
  if (type === '全部') activeTypes.value = ['全部']
  else {
    const set = new Set(activeTypes.value.filter((item) => item !== '全部'))
    set.has(type) ? set.delete(type) : set.add(type)
    activeTypes.value = set.size ? [...set] : ['全部']
  }
}
function chartPolyline(points) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  return points.map((value, index) => {
    const x = 42 + index * 130
    const y = 170 - ((value - min) / Math.max(1, max - min)) * 120
    return `${x},${y}`
  }).join(' ')
}
function openReport(row) {
  activeReport.value = row
  reportVisible.value = true
}
</script>

<template>
  <div class="student-archive-page">
    <div class="breadcrumb">单页面演示 &gt; 学生健康档案</div>
    <section class="student-search">
      <label><span>姓名</span><input v-model="query.name" /></label>
      <label><span>身份证号</span><input v-model="query.certNo" /></label>
      <label><span>学校</span><select v-model="query.school"><option value="">请选择</option><option v-for="item in schools" :key="item">{{ item }}</option></select></label>
      <button class="primary-btn" type="button" @click="doSearch">查询</button>
      <button type="button" @click="Object.assign(query,{name:'',certNo:'',school:''})">重置</button>
    </section>
    <section class="selected-line">搜索结果：{{ selectedStudent.name }}　{{ selectedStudent.gender }}　{{ selectedStudent.age }}　{{ selectedStudent.school }}　{{ selectedStudent.gradeClass }} <button type="button" @click="studentDialogVisible = true">切换学生</button></section>
    <section class="student-summary">
      <div class="avatar">{{ selectedStudent.name.slice(0, 1) }}</div>
      <div><strong>{{ selectedStudent.name }}　{{ selectedStudent.gender }}　{{ selectedStudent.age }}</strong><span>{{ selectedStudent.school }} · {{ selectedStudent.gradeClass }}</span></div>
      <div><span>身份证号：{{ selectedStudent.certNo }}</span><span>母亲：{{ selectedStudent.mother }} {{ selectedStudent.phone }}</span><span>父亲：{{ selectedStudent.father }} {{ selectedStudent.phone }}</span></div>
      <div><span>过敏史：{{ selectedStudent.allergy }}</span><span>既往史：{{ selectedStudent.history }}</span></div>
    </section>
    <nav class="archive-tabs"><button v-for="tab in tabs" :key="tab" :class="{ active: activeTab === tab }" type="button" @click="activeTab = tab">{{ tab }}</button></nav>
    <section class="archive-content">
      <div v-if="activeTab === '管理时间轴'" class="timeline-view">
        <div class="type-filter"><span>记录类型：</span><button v-for="item in typeFilters" :key="item" :class="{ active: activeTypes.includes(item) }" type="button" @click="toggleType(item)">{{ item }}</button></div>
        <section v-for="(rows, year) in groupedTimeline" :key="year" class="year-group">
          <h3>{{ year }}</h3>
          <article v-for="row in rows" :key="year + row.date + row.type" class="timeline-row">
            <div class="date">{{ row.date }}</div>
            <div><header><strong>{{ row.type }}</strong><em :class="row.status">{{ row.status }}</em></header><p>{{ row.title }}</p><p>{{ row.meta }}</p><p>{{ row.detail }}</p></div>
          </article>
        </section>
      </div>
      <div v-else-if="activeTab === '生长发育曲线'" class="chart-view">
        <div class="chart-tools"><label>指标：<select v-model="growthMetric"><option value="height">身高</option><option value="weight">体重</option><option value="bmi">BMI</option></select></label><label>时间范围：<select><option>全部</option></select></label></div>
        <svg class="trend-chart" viewBox="0 0 620 210"><line x1="40" y1="180" x2="590" y2="180" stroke="#cfd6df"/><line x1="40" y1="30" x2="40" y2="180" stroke="#cfd6df"/><polyline :points="chartPolyline(growthPoints)" fill="none" stroke="#5f8db8" stroke-width="2"/><circle v-for="(p,i) in growthPoints" :key="i" :cx="42+i*130" :cy="chartPolyline(growthPoints).split(' ')[i].split(',')[1]" r="3" fill="#5f8db8"/></svg>
        <table><thead><tr><th>检查日期</th><th>年龄</th><th>身高(cm)</th><th>体重(kg)</th><th>BMI</th></tr></thead><tbody><tr v-for="row in growthRows" :key="row.date"><td>{{ row.date }}</td><td>{{ row.age }}</td><td>{{ row.height }}</td><td>{{ row.weight }}</td><td>{{ row.bmi }}</td></tr></tbody></table>
      </div>
      <div v-else-if="activeTab === '视力变化曲线'" class="chart-view">
        <div class="chart-tools"><label>指标：<select v-model="visionMetric"><option value="naked">裸眼视力</option><option value="corrected">矫正视力</option><option value="sphere">球镜</option><option value="cylinder">柱镜</option></select></label><label>眼别：<select v-model="eyeSide"><option value="both">双眼</option><option value="left">左眼</option><option value="right">右眼</option></select></label></div>
        <svg class="trend-chart" viewBox="0 0 620 210"><line x1="40" y1="180" x2="590" y2="180" stroke="#cfd6df"/><line x1="40" y1="30" x2="40" y2="180" stroke="#cfd6df"/><polyline :points="chartPolyline(visionPoints)" fill="none" stroke="#5f8db8" stroke-width="2"/></svg>
        <table><thead><tr><th>检查日期</th><th>左眼裸眼</th><th>右眼裸眼</th><th>左眼球镜</th><th>右眼球镜</th></tr></thead><tbody><tr v-for="row in visionRows" :key="row.date"><td>{{ row.date }}</td><td>{{ row.leftNaked }}</td><td>{{ row.rightNaked }}</td><td>{{ row.leftSphere }}</td><td>{{ row.rightSphere }}</td></tr></tbody></table>
      </div>
      <div v-else class="report-table">
        <LegacyTable :rows="reportRows" :columns="reportColumns"><template #actions="{ row }"><button class="link-btn" type="button" @click="openReport(row)">查看报告</button></template><template #result="{ value }"><em :class="value">{{ value }}</em></template></LegacyTable>
      </div>
    </section>
    <div v-if="studentDialogVisible" class="modal-mask">
      <section class="student-dialog"><header>选择学生</header><table><thead><tr><th>姓名</th><th>身份证号</th><th>性别</th><th>年龄</th><th>学校</th><th>年级班级</th><th>操作</th></tr></thead><tbody><tr v-for="student in matchedStudents" :key="student.id"><td>{{ student.name }}</td><td>{{ student.certNo }}</td><td>{{ student.gender }}</td><td>{{ student.age }}</td><td>{{ student.school }}</td><td>{{ student.gradeClass }}</td><td><button class="link-btn" type="button" @click="chooseStudent(student)">选择</button></td></tr></tbody></table><footer><button type="button" @click="studentDialogVisible = false">关闭</button></footer></section>
    </div>
    <div v-if="reportVisible" class="modal-mask">
      <section class="student-dialog report-dialog"><header>报告预览</header><div class="report-preview"><p>学生：{{ selectedStudent.name }}　{{ selectedStudent.gender }}　{{ selectedStudent.age }}</p><p>检查日期：{{ activeReport.date }}</p><p>筛查结论：{{ activeReport.result }}</p><p>异常指标：{{ activeReport.positives }}</p><p>健康建议：建议家长持续关注相关异常指标，按计划复查，并保持良好生活习惯。</p></div><footer><button type="button" @click="reportVisible = false">关闭</button></footer></section>
    </div>
  </div>
</template>

<style scoped>
.student-archive-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.student-search,.selected-line{border:1px solid #d8d8d8;border-top:0;background:#f7f9fb}.student-search{height:42px;padding:7px 10px;display:flex;align-items:center;gap:10px}.student-search label{display:flex;align-items:center;gap:5px;font-size:12px}.student-search span{min-width:48px;text-align:right}.student-search input,.student-search select,.chart-tools select{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px}.student-search input{width:140px}.student-search select{width:160px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.selected-line{height:32px;padding:0 10px;display:flex;align-items:center;gap:10px;font-size:12px}.student-summary{height:92px;margin-top:8px;padding:10px;display:grid;grid-template-columns:54px 250px 1fr 220px;gap:12px;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:12px}.avatar{width:42px;height:42px;display:grid;place-items:center;border:1px solid #b8cce0;background:#eef5fc;color:#244b70;font-weight:700}.student-summary strong{display:block;margin-bottom:7px;font-size:15px}.student-summary span{display:block;line-height:1.8}.archive-tabs{height:36px;margin-top:8px;padding:5px 6px 0;display:flex;gap:4px;border:1px solid #d8d8d8;background:#fff}.archive-tabs button{height:30px;border-bottom:0;background:#f7f9fb}.archive-tabs button.active{background:#dceafa;color:#1f4d75;border-color:#b8cce0;font-weight:600}.archive-content{min-height:0;flex:1;overflow:auto;border:1px solid #d8d8d8;border-top:0;background:#fff;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.type-filter{height:38px;padding:5px 10px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.type-filter button.active{background:#dceafa;color:#244b70}.year-group{padding:8px 12px}.year-group h3{height:28px;margin:0;border-bottom:1px solid #d8d8d8;font-size:13px}.timeline-row{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid #edf0f2;font-size:12px}.timeline-row .date{color:#555}.timeline-row header{display:flex;align-items:center;gap:10px}.timeline-row p{margin:4px 0;color:#555;line-height:1.5}em{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #c8d2dc;border-radius:2px;background:#eef3f8;color:#455a6e;font-size:12px;font-style:normal}em.异常{border-color:#efc8bd;background:#fff2ee;color:#a64b35}em.正常{border-color:#b8d8c4;background:#eef8f1;color:#34724a}em.待检{background:#f1f1f1;color:#777}.chart-view{padding:10px}.chart-tools{height:34px;display:flex;align-items:center;gap:16px;font-size:12px}.trend-chart{width:100%;max-width:720px;height:230px;border:1px solid #d8d8d8;background:#fafafa}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}th,td{height:30px;padding:0 8px;border:1px solid #d8d8d8;text-align:left}th{background:#eee}.report-table{height:100%;padding:0}.report-table :deep(.legacy-table-wrap){height:100%;min-height:360px}.link-btn{padding:0;border:0;background:transparent;color:#2d6fba}.modal-mask{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(0,0,0,.25)}.student-dialog{width:820px;max-height:520px;display:flex;flex-direction:column;border:1px solid #9facba;background:#fff;font-size:12px}.student-dialog header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.student-dialog table{margin:0}.student-dialog footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;border-top:1px solid #d8d8d8;background:#f7f9fb}.report-dialog{width:520px}.report-preview{padding:14px 18px;line-height:1.9}.report-preview p{margin:0 0 6px}
</style>
