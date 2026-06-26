<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft, ArrowRight, Download, FullScreen, Printer, RefreshLeft, RefreshRight, Search, View, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const reportTypes = ['检验报告', 'NT报告', 'B超报告', '心电图报告', '唐筛报告', '无创DNA报告', '胎心监护报告', '其他报告']
const statusOptions = ['待录入', '录入中', '已录入', '已作废']
const hospitals = ['北京市朝阳区妇幼保健院', '北京大学人民医院', '首都医科大学附属北京妇产医院', '北京市密云区医院', '北京市通州区妇幼保健院']
const doctors = ['张医生', '王医生', '李医生', '赵医生']
const filters = reactive({ archiveDates: [], status: '', doctor: '', archiveNo: '' })
const mothers = ref(createMothers())
const selectedMotherId = ref(mothers.value[0]?.id)
const selectedReportId = ref(mothers.value[0]?.reports[0]?.id)
const currentPage = ref(1)
const zoom = ref(0.72)
const rotation = ref(0)
const imageOffset = reactive({ x: 0, y: 0 })
const draggingImage = ref(false)
let dragStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 }

const allReports = computed(() => mothers.value.flatMap((mother) => mother.reports.map((report) => ({ mother, report }))))
const filteredMothers = computed(() => mothers.value.filter((mother) => filteredReportsForMother(mother).length > 0))
const selectedMother = computed(() => filteredMothers.value.find((mother) => mother.id === selectedMotherId.value) || filteredMothers.value[0] || mothers.value[0])
const selectedReports = computed(() => selectedMother.value ? filteredReportsForMother(selectedMother.value) : [])
const selectedReport = computed(() => selectedReports.value.find((report) => report.id === selectedReportId.value) || selectedReports.value[0] || selectedMother.value?.reports[0])
const selectedMotherIndex = computed(() => Math.max(0, filteredMothers.value.findIndex((mother) => mother.id === selectedMother.value?.id)))
const selectedReportIndex = computed(() => Math.max(0, selectedReports.value.findIndex((report) => report.id === selectedReport.value?.id)))
const stats = computed(() => {
  const reports = filteredMothers.value.flatMap((mother) => filteredReportsForMother(mother))
  return { mothers: filteredMothers.value.length, total: reports.length, pending: reports.filter((r) => r.status === '待录入').length, entered: reports.filter((r) => r.status === '已录入').length }
})
const processedCount = computed(() => allReports.value.filter(({ report }) => report.status === '已录入').length)
const templateTitle = computed(() => `${normalizeTemplateType(selectedReport.value?.reportType)}补录`)
const currentImage = computed(() => createReportImageUrl(selectedMother.value, selectedReport.value, currentPage.value))

function createMothers() {
  const names = ['吴敏', '王敏', '李娜', '赵倩', '陈静', '刘芳', '周琴', '孙悦', '黄燕', '徐婷', '马丽', '朱琳']
  const plans = [['B超报告', 'NT报告', '检验报告', '心电图报告'], ['检验报告', '唐筛报告', 'B超报告'], ['NT报告', '无创DNA报告', 'B超报告', '检验报告'], ['B超报告', '胎心监护报告', '心电图报告'], ['检验报告', 'B超报告', '唐筛报告', '其他报告']]
  const statuses = ['待录入', '录入中', '已录入', '待录入', '待录入', '已录入', '已作废']
  return names.map((name, mi) => ({
    id: mi + 1,
    name,
    age: 24 + (mi % 13),
    archiveNo: `M2026${String(1200 + mi).padStart(6, '0')}`,
    gestationalWeek: `${12 + (mi % 20)}+${mi % 7}周`,
    phone: `138****${String(8800 + mi).slice(-4)}`,
    reports: plans[mi % plans.length].map((reportType, ri) => ({
      id: `m${mi + 1}-r${ri + 1}`,
      reportType,
      reportDate: `2026-06-${String(24 - ((mi + ri) % 18)).padStart(2, '0')}`,
      hospital: hospitals[(mi + ri) % hospitals.length],
      uploadDoctor: doctors[(mi + ri) % doctors.length],
      archivedAt: `2026-06-${String(25 - ((mi + ri) % 16)).padStart(2, '0')} ${String(8 + ((mi + ri) % 9)).padStart(2, '0')}:30`,
      pages: 1 + ((mi + ri) % 4),
      status: statuses[(mi * 2 + ri) % statuses.length],
      supplement: createSupplementData(reportType, mi + ri),
    })),
  }))
}

function createSupplementData(type, index) {
  if (type === '检验报告') return { labRows: [{ id: 1, item: '血红蛋白', result: String(112 + index), unit: 'g/L', reference: '110-150', abnormal: '' }, { id: 2, item: '白细胞', result: '7.2', unit: '10^9/L', reference: '3.5-9.5', abnormal: '' }, { id: 3, item: '血小板', result: '218', unit: '10^9/L', reference: '125-350', abnormal: '' }] }
  if (type === 'NT报告') return { checkWeek: '12+4周', crl: '62', nt: '1.6', fetalHeart: '152', nasalBone: '可见', ductus: '正常', tricuspid: '未见反流', conclusion: 'NT测值在正常范围', remark: '' }
  if (type === 'B超报告' || type === '胎心监护报告' || type === '其他报告') return { checkWeek: '28+3周', fetusCount: '单胎', position: 'LOA', bpd: '72', hc: '265', ac: '238', fl: '54', afi: '128', placenta: '前壁', maturity: 'I级', fetalHeart: '152', ultrasound: '胎儿大小符合孕周', remark: '' }
  if (type === '心电图报告') return { heartRate: '82', rhythm: '窦性心律', pr: '156', qrs: '86', qt: '386/420', stt: '未见明显异常', diagnosis: '大致正常心电图', remark: '' }
  return { project: type, t21: '低风险', t18: '低风险', t13: '低风险', ntd: '低风险', riskLevel: '低风险', conclusion: '建议常规产检随访', suggestion: '按期复查', remark: '' }
}

function filteredReportsForMother(mother) {
  const archiveNo = filters.archiveNo.trim()
  return mother.reports.filter((report) => {
    const archiveDate = report.archivedAt.slice(0, 10)
    const archiveDateMatch = !filters.archiveDates?.length || (archiveDate >= filters.archiveDates[0] && archiveDate <= filters.archiveDates[1])
    const statusMatch = !filters.status || report.status === filters.status
    const doctorMatch = !filters.doctor || report.uploadDoctor === filters.doctor
    const archiveNoMatch = !archiveNo || mother.archiveNo.includes(archiveNo)
    return archiveDateMatch && statusMatch && doctorMatch && archiveNoMatch
  })
}
function normalizeTemplateType(type = 'B超报告') { if (type === '胎心监护报告' || type === '其他报告') return 'B超报告'; if (type === '无创DNA报告') return '唐筛/无创DNA报告'; return type }
function motherProgress(mother) { const activeReports = mother.reports.filter((r) => r.status !== '已作废'); const completed = activeReports.filter((r) => r.status === '已录入').length; return { completed, total: activeReports.length, pending: activeReports.filter((r) => r.status === '待录入').length } }
function motherStatus(mother) { const activeReports = mother.reports.filter((r) => r.status !== '已作废'); if (mother.reports.length && activeReports.length === 0) return '已作废'; if (activeReports.length && activeReports.every((r) => r.status === '已录入')) return '已录入'; if (activeReports.some((r) => r.status === '录入中')) return '录入中'; return '待录入' }
function createReportImageUrl(mother, report, page) {
  if (!mother || !report) return ''
  const isUltrasound = ['B超报告', 'NT报告', '胎心监护报告', '其他报告'].includes(report.reportType)
  const isEcg = report.reportType === '心电图报告'
  const isLab = report.reportType === '检验报告'
  const title = `${report.reportType}影像（第${page}页）`
  const middle = isUltrasound
    ? `<rect x="95" y="250" width="710" height="420" fill="#151d25"/><ellipse cx="450" cy="458" rx="245" ry="150" fill="#303a43"/><path d="M296 456 C360 348 535 350 610 456 C530 550 385 548 296 456Z" fill="#1e2730" stroke="#c9d2dc" stroke-width="4"/><text x="110" y="642" fill="#d7e1ea" font-size="15">DEPTH 15.0cm  GAIN 68  ${title}</text>`
    : isEcg
      ? `<rect x="72" y="250" width="756" height="420" fill="#fff" stroke="#d44" stroke-width="1"/><g stroke="#f2b6b6" stroke-width="1">${Array.from({ length: 24 }, (_, i) => `<line x1="${72 + i * 32}" y1="250" x2="${72 + i * 32}" y2="670"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<line x1="72" y1="${250 + i * 32}" x2="828" y2="${250 + i * 32}"/>`).join('')}</g><path d="M90 480 L160 480 L176 440 L190 535 L208 480 L350 480 L365 462 L380 498 L394 480 L540 480 L560 438 L578 528 L596 480 L812 480" fill="none" stroke="#1d2630" stroke-width="3"/>`
      : isLab
        ? `<rect x="78" y="245" width="744" height="432" fill="#fff" stroke="#333"/><g font-size="17" font-family="Microsoft YaHei, Arial"><text x="105" y="300">检验项目</text><text x="405" y="300">结果</text><text x="545" y="300">单位</text><text x="665" y="300">参考范围</text><text x="105" y="360">血红蛋白</text><text x="405" y="360">116</text><text x="545" y="360">g/L</text><text x="665" y="360">110-150</text><text x="105" y="420">白细胞</text><text x="405" y="420">7.2</text><text x="545" y="420">10^9/L</text><text x="665" y="420">3.5-9.5</text><text x="105" y="480">血小板</text><text x="405" y="480">218</text><text x="545" y="480">10^9/L</text><text x="665" y="480">125-350</text></g>`
        : `<rect x="86" y="250" width="728" height="400" fill="#f8fafc" stroke="#333"/><text x="112" y="330" font-size="22" font-family="Microsoft YaHei, Arial">21三体风险：低风险</text><text x="112" y="390" font-size="22" font-family="Microsoft YaHei, Arial">18三体风险：低风险</text><text x="112" y="450" font-size="22" font-family="Microsoft YaHei, Arial">13三体风险：低风险</text><text x="112" y="510" font-size="22" font-family="Microsoft YaHei, Arial">报告结论：建议常规产检随访</text>`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="#fff"/><rect x="42" y="34" width="816" height="1130" fill="#fff" stroke="#222" stroke-width="2"/><text x="450" y="88" text-anchor="middle" font-size="30" font-family="Microsoft YaHei, Arial" font-weight="700">${report.hospital}</text><text x="450" y="126" text-anchor="middle" font-size="24" font-family="Microsoft YaHei, Arial">${report.reportType}</text><line x1="62" y1="154" x2="838" y2="154" stroke="#333"/><text x="78" y="198" font-size="18" font-family="Microsoft YaHei, Arial">姓名：${mother.name}</text><text x="250" y="198" font-size="18" font-family="Microsoft YaHei, Arial">年龄：${mother.age}岁</text><text x="410" y="198" font-size="18" font-family="Microsoft YaHei, Arial">孕周：${mother.gestationalWeek}</text><text x="630" y="198" font-size="18" font-family="Microsoft YaHei, Arial">档案号：${mother.archiveNo}</text>${middle}<text x="76" y="750" font-size="21" font-family="Microsoft YaHei, Arial" font-weight="700">报告内容</text><text x="76" y="795" font-size="18" font-family="Microsoft YaHei, Arial">本页为外院报告影像归档件，用于档案室结构化补录演示。</text><text x="76" y="835" font-size="18" font-family="Microsoft YaHei, Arial">检查日期：${report.reportDate}　上传医生：${report.uploadDoctor}　归档时间：${report.archivedAt}</text><text x="76" y="875" font-size="18" font-family="Microsoft YaHei, Arial">报告页码：${page}/${report.pages}</text><line x1="62" y1="1030" x2="838" y2="1030" stroke="#333"/><text x="76" y="1080" font-size="17" font-family="Microsoft YaHei, Arial">报告医生：外院医师</text><text x="620" y="1080" font-size="17" font-family="Microsoft YaHei, Arial">${title}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
function selectMother(mother) { selectedMotherId.value = mother.id; const reports = filteredReportsForMother(mother); selectedReportId.value = reports[0]?.id || mother.reports[0]?.id; currentPage.value = 1; resetImage() }
function selectReport(report) { selectedReportId.value = report.id; currentPage.value = 1; resetImage() }
function clearFilters() { Object.assign(filters, { archiveDates: [], status: '', doctor: '', archiveNo: '' }); if (mothers.value.length) selectMother(mothers.value[0]) }
function statusType(status) { return { 待录入: 'warning', 录入中: 'primary', 已录入: 'success', 已作废: 'info' }[status] || 'info' }
function switchMother(step) { if (!filteredMothers.value.length) return; const nextIndex = Math.min(filteredMothers.value.length - 1, Math.max(0, selectedMotherIndex.value + step)); selectMother(filteredMothers.value[nextIndex]) }
function updateCurrentStatus(status) { if (selectedReport.value) selectedReport.value.status = status }
function saveCurrent() { updateCurrentStatus(selectedReport.value.status === '待录入' ? '录入中' : selectedReport.value.status); ElMessage.success('当前报告补录数据已保存') }
function markEntered() { updateCurrentStatus('已录入'); ElMessage.success('当前报告已完成录入') }
function printReport() { ElMessage.success('已触发打印演示') }
function downloadReport() { ElMessage.success('已触发下载演示') }
function zoomBy(delta) { zoom.value = Math.min(2.2, Math.max(0.42, Number((zoom.value + delta).toFixed(2)))) }
function fitWidth() { zoom.value = 0.78; imageOffset.x = 0; imageOffset.y = 0 }
function fitWindow() { zoom.value = 0.58; imageOffset.x = 0; imageOffset.y = 0 }
function resetImage() { zoom.value = 0.72; rotation.value = 0; imageOffset.x = 0; imageOffset.y = 0 }
function switchPage(step) { if (!selectedReport.value) return; currentPage.value = Math.min(selectedReport.value.pages, Math.max(1, currentPage.value + step)); imageOffset.x = 0; imageOffset.y = 0 }
function handleWheel(event) { event.preventDefault(); zoomBy(event.deltaY > 0 ? -0.08 : 0.08) }
function startImageDrag(event) { if (event.button !== 0) return; draggingImage.value = true; dragStart = { x: event.clientX, y: event.clientY, offsetX: imageOffset.x, offsetY: imageOffset.y }; event.currentTarget.setPointerCapture(event.pointerId) }
function moveImage(event) { if (!draggingImage.value) return; imageOffset.x = dragStart.offsetX + event.clientX - dragStart.x; imageOffset.y = dragStart.offsetY + event.clientY - dragStart.y }
function stopImageDrag(event) { draggingImage.value = false; event.currentTarget.releasePointerCapture?.(event.pointerId) }
function addLabRow() { selectedReport.value.supplement.labRows.push({ id: Date.now(), item: '', result: '', unit: '', reference: '', abnormal: '' }) }
function removeLabRow(row) { selectedReport.value.supplement.labRows = selectedReport.value.supplement.labRows.filter((item) => item.id !== row.id) }
</script>
<template>
  <div class="archive-workbench">
    <header class="system-header workbench-header">
      <div class="brand"><img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" /></div>
      <DemoPageNavigation />
      <div class="header-meta">档案室工作台 ｜ 操作员：刘护士</div>
    </header>
    <main class="workbench-main">
      <section class="page-heading workbench-heading">
        <div class="heading-left"><el-button text :icon="ArrowLeft" @click="router.push('/outpatient')">返回</el-button><span class="heading-divider"></span><el-breadcrumb separator="/"><el-breadcrumb-item>档案室</el-breadcrumb-item><el-breadcrumb-item>外院报告补录工作台</el-breadcrumb-item></el-breadcrumb></div>
        <span class="page-code">今日已处理 {{ processedCount }} / {{ allReports.length }}　当前第 {{ selectedMotherIndex + 1 }} 位产妇，第 {{ selectedReportIndex + 1 }} 份报告</span>
      </section>
      <section class="filter-panel">
        <el-form class="filter-grid archive-filter-grid" label-position="left">
          <el-form-item label="归档日期"><el-date-picker v-model="filters.archiveDates" type="daterange" value-format="YYYY-MM-DD" /></el-form-item>
          <el-form-item label="处理状态"><el-select v-model="filters.status" clearable><el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="上传医生"><el-select v-model="filters.doctor" clearable><el-option v-for="item in doctors" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="产妇档案号"><el-input v-model="filters.archiveNo" clearable /></el-form-item>
        </el-form>
        <div class="filter-actions"><el-button type="primary" :icon="Search">查询</el-button><el-button @click="clearFilters">重置</el-button></div>
      </section>
      <section class="workbench-layout">
        <aside class="task-panel">
          <div class="task-summary"><div><strong>{{ stats.mothers }}</strong><span>位产妇</span></div><div><strong>{{ stats.total }}</strong><span>份报告</span></div><div><strong>{{ stats.pending }}</strong><span>待录入</span></div><div><strong>{{ stats.entered }}</strong><span>已录入</span></div></div>
          <div class="task-nav"><el-button :icon="ArrowLeft" :disabled="selectedMotherIndex === 0" @click="switchMother(-1)">上一位</el-button><el-button :icon="ArrowRight" :disabled="selectedMotherIndex >= filteredMothers.length - 1" @click="switchMother(1)">下一位</el-button></div>
          <div class="task-list">
            <article v-for="mother in filteredMothers" :key="mother.id" class="task-item" :class="{ active: selectedMother?.id === mother.id }" @click="selectMother(mother)">
              <div class="task-line"><strong>{{ mother.name }}</strong><span>{{ mother.age }}岁</span><el-tag :type="statusType(motherStatus(mother))" effect="plain" size="small">{{ motherStatus(mother) }}</el-tag></div>
              <div class="task-line muted"><span>{{ mother.gestationalWeek }}</span><span>{{ mother.archiveNo }}</span></div>
              <div class="mother-progress"><span>报告 {{ motherProgress(mother).completed }}/{{ motherProgress(mother).total }} 已完成</span><span>待录入 {{ motherProgress(mother).pending }}</span></div>
              <div class="mother-report-tags"><span v-for="report in mother.reports" :key="report.id">{{ report.reportType }}</span></div>
            </article>
          </div>
        </aside>
        <section class="viewer-panel" v-if="selectedMother && selectedReport">
          <div class="mother-strip"><div><strong>{{ selectedMother.name }}</strong><span>{{ selectedMother.archiveNo }}</span><span>{{ selectedMother.gestationalWeek }}</span><span>{{ selectedMother.phone }}</span></div><el-tag :type="statusType(motherStatus(selectedMother))" effect="plain">产妇任务：{{ motherStatus(selectedMother) }}</el-tag></div>
          <div class="report-tabs"><button v-for="report in selectedReports" :key="report.id" type="button" :class="{ active: selectedReport.id === report.id }" @click="selectReport(report)"><strong>{{ report.reportType }}</strong><span>{{ report.reportDate }}</span><el-tag :type="statusType(report.status)" effect="plain" size="small">{{ report.status }}</el-tag></button></div>
          <div class="viewer-meta"><dl><div><dt>报告类型</dt><dd>{{ selectedReport.reportType }}</dd></div><div><dt>上传医生</dt><dd>{{ selectedReport.uploadDoctor }}</dd></div><div><dt>归档时间</dt><dd>{{ selectedReport.archivedAt }}</dd></div></dl></div>
          <div class="viewer-toolbar"><el-button-group><el-button :icon="ZoomIn" title="放大" @click="zoomBy(0.1)" /><el-button :icon="ZoomOut" title="缩小" @click="zoomBy(-0.1)" /><el-button @click="fitWidth">适应宽度</el-button><el-button :icon="FullScreen" title="适应窗口" @click="fitWindow" /><el-button @click="resetImage">原始大小</el-button></el-button-group><el-button-group><el-button :icon="RefreshLeft" title="左旋转" @click="rotation -= 90" /><el-button :icon="RefreshRight" title="右旋转" @click="rotation += 90" /></el-button-group><el-button-group><el-button :icon="ArrowLeft" :disabled="currentPage === 1" @click="switchPage(-1)" /><el-button disabled>{{ currentPage }} / {{ selectedReport.pages }}</el-button><el-button :icon="ArrowRight" :disabled="currentPage === selectedReport.pages" @click="switchPage(1)" /></el-button-group><el-button-group><el-button :icon="Printer" @click="printReport">打印</el-button><el-button :icon="Download" @click="downloadReport">下载</el-button><el-button :icon="View" @click="resetImage">查看原图</el-button></el-button-group></div>
          <div class="report-viewport" :class="{ dragging: draggingImage }" @wheel="handleWheel" @pointerdown="startImageDrag" @pointermove="moveImage" @pointerup="stopImageDrag" @pointercancel="stopImageDrag"><img :src="currentImage" alt="外院报告图片" :style="{ width: `${900 * zoom}px`, transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) rotate(${rotation}deg)` }" draggable="false" /></div>
          <div class="thumb-strip"><button v-for="page in selectedReport.pages" :key="page" type="button" :class="{ active: currentPage === page }" @click="currentPage = page"><img :src="createReportImageUrl(selectedMother, selectedReport, page)" :alt="`第${page}页`" /><span>第{{ page }}页</span></button></div>
        </section>
        <aside class="supplement-panel" v-if="selectedReport">
          <div class="supplement-title"><strong>{{ templateTitle }}</strong><el-tag :type="statusType(selectedReport.status)" effect="plain">{{ selectedReport.status }}</el-tag></div>
          <el-form v-if="normalizeTemplateType(selectedReport.reportType) === 'NT报告'" class="supplement-form" label-position="top"><el-form-item label="检查孕周"><el-input v-model="selectedReport.supplement.checkWeek" /></el-form-item><el-form-item label="CRL"><el-input v-model="selectedReport.supplement.crl" /></el-form-item><el-form-item label="NT值"><el-input v-model="selectedReport.supplement.nt" /></el-form-item><el-form-item label="胎心率"><el-input v-model="selectedReport.supplement.fetalHeart" /></el-form-item><el-form-item label="鼻骨"><el-input v-model="selectedReport.supplement.nasalBone" /></el-form-item><el-form-item label="静脉导管血流"><el-input v-model="selectedReport.supplement.ductus" /></el-form-item><el-form-item label="三尖瓣反流"><el-input v-model="selectedReport.supplement.tricuspid" /></el-form-item><el-form-item label="报告结论" class="full"><el-input v-model="selectedReport.supplement.conclusion" type="textarea" :rows="2" /></el-form-item><el-form-item label="备注" class="full"><el-input v-model="selectedReport.supplement.remark" type="textarea" :rows="2" /></el-form-item></el-form>
          <el-form v-else-if="normalizeTemplateType(selectedReport.reportType) === 'B超报告'" class="supplement-form" label-position="top"><el-form-item label="检查孕周"><el-input v-model="selectedReport.supplement.checkWeek" /></el-form-item><el-form-item label="胎儿数"><el-input v-model="selectedReport.supplement.fetusCount" /></el-form-item><el-form-item label="胎位"><el-input v-model="selectedReport.supplement.position" /></el-form-item><el-form-item label="双顶径 BPD"><el-input v-model="selectedReport.supplement.bpd" /></el-form-item><el-form-item label="头围 HC"><el-input v-model="selectedReport.supplement.hc" /></el-form-item><el-form-item label="腹围 AC"><el-input v-model="selectedReport.supplement.ac" /></el-form-item><el-form-item label="股骨长 FL"><el-input v-model="selectedReport.supplement.fl" /></el-form-item><el-form-item label="羊水指数 AFI"><el-input v-model="selectedReport.supplement.afi" /></el-form-item><el-form-item label="胎盘位置"><el-input v-model="selectedReport.supplement.placenta" /></el-form-item><el-form-item label="胎盘成熟度"><el-input v-model="selectedReport.supplement.maturity" /></el-form-item><el-form-item label="胎心率"><el-input v-model="selectedReport.supplement.fetalHeart" /></el-form-item><el-form-item label="超声提示" class="full"><el-input v-model="selectedReport.supplement.ultrasound" type="textarea" :rows="2" /></el-form-item><el-form-item label="备注" class="full"><el-input v-model="selectedReport.supplement.remark" type="textarea" :rows="2" /></el-form-item></el-form>
          <el-form v-else-if="normalizeTemplateType(selectedReport.reportType) === '心电图报告'" class="supplement-form" label-position="top"><el-form-item label="心率"><el-input v-model="selectedReport.supplement.heartRate" /></el-form-item><el-form-item label="心律"><el-input v-model="selectedReport.supplement.rhythm" /></el-form-item><el-form-item label="PR间期"><el-input v-model="selectedReport.supplement.pr" /></el-form-item><el-form-item label="QRS时限"><el-input v-model="selectedReport.supplement.qrs" /></el-form-item><el-form-item label="QT/QTc"><el-input v-model="selectedReport.supplement.qt" /></el-form-item><el-form-item label="ST-T改变"><el-input v-model="selectedReport.supplement.stt" /></el-form-item><el-form-item label="诊断结论" class="full"><el-input v-model="selectedReport.supplement.diagnosis" type="textarea" :rows="2" /></el-form-item><el-form-item label="备注" class="full"><el-input v-model="selectedReport.supplement.remark" type="textarea" :rows="2" /></el-form-item></el-form>
          <div v-else-if="normalizeTemplateType(selectedReport.reportType) === '检验报告'" class="lab-editor"><div class="lab-toolbar"><span>检验报告补录项目</span><el-button type="primary" plain @click="addLabRow">新增一行</el-button></div><el-table :data="selectedReport.supplement.labRows" border height="330" class="lab-table"><el-table-column prop="item" label="检验项目" min-width="116"><template #default="{ row }"><el-input v-model="row.item" /></template></el-table-column><el-table-column prop="result" label="结果值" width="92"><template #default="{ row }"><el-input v-model="row.result" /></template></el-table-column><el-table-column prop="unit" label="单位" width="92"><template #default="{ row }"><el-input v-model="row.unit" /></template></el-table-column><el-table-column prop="reference" label="参考范围" width="112"><template #default="{ row }"><el-input v-model="row.reference" /></template></el-table-column><el-table-column prop="abnormal" label="异常" width="72"><template #default="{ row }"><el-input v-model="row.abnormal" /></template></el-table-column><el-table-column label="操作" width="70"><template #default="{ row }"><el-button link type="danger" @click="removeLabRow(row)">删除</el-button></template></el-table-column></el-table></div>
          <el-form v-else class="supplement-form" label-position="top"><el-form-item label="检查项目"><el-input v-model="selectedReport.supplement.project" /></el-form-item><el-form-item label="21三体风险"><el-input v-model="selectedReport.supplement.t21" /></el-form-item><el-form-item label="18三体风险"><el-input v-model="selectedReport.supplement.t18" /></el-form-item><el-form-item label="13三体风险"><el-input v-model="selectedReport.supplement.t13" /></el-form-item><el-form-item label="开放性神经管缺陷风险"><el-input v-model="selectedReport.supplement.ntd" /></el-form-item><el-form-item label="风险等级"><el-input v-model="selectedReport.supplement.riskLevel" /></el-form-item><el-form-item label="报告结论" class="full"><el-input v-model="selectedReport.supplement.conclusion" type="textarea" :rows="2" /></el-form-item><el-form-item label="处理建议" class="full"><el-input v-model="selectedReport.supplement.suggestion" type="textarea" :rows="2" /></el-form-item><el-form-item label="备注" class="full"><el-input v-model="selectedReport.supplement.remark" type="textarea" :rows="2" /></el-form-item></el-form>
          <div class="supplement-actions"><el-button @click="saveCurrent">保存</el-button><el-button type="success" plain @click="markEntered">完成录入</el-button></div>
        </aside>
      </section>
    </main>
  </div>
</template>

<style scoped>
.archive-workbench { min-height: 100vh; color: #303846; background: #edf1f5; }
.workbench-header, .workbench-main { min-width: 1600px; }
.workbench-main { max-width: 1880px; margin: 0 auto; padding: 12px 16px 16px; }
.workbench-heading { border-bottom: 1px solid var(--border-color); }
.filter-panel, .task-panel, .viewer-panel, .supplement-panel { background: #fff; border: 1px solid #d8e0e8; }
.filter-panel { margin-top: 10px; padding: 8px 12px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; }
.filter-grid { display: grid; grid-template-columns: 300px 190px 190px 210px; gap: 0 12px; align-items: center; }
.filter-grid :deep(.el-form-item) { margin-bottom: 0; }
.filter-grid :deep(.el-date-editor), .filter-grid :deep(.el-select), .filter-grid :deep(.el-input) { width: 100%; }
.archive-filter-grid :deep(.el-form-item__label) { height: 32px; line-height: 32px; padding-right: 8px; color: #5f6f82; }
.filter-actions { display: flex; align-items: center; gap: 8px; padding-bottom: 1px; }
.workbench-layout { margin-top: 10px; height: calc(100vh - 174px); min-height: 700px; display: grid; grid-template-columns: 340px minmax(0, 1fr) 430px; gap: 10px; }
.task-panel, .viewer-panel, .supplement-panel { min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.task-summary { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid #e3e9ef; }
.task-summary div { height: 40px; display: flex; align-items: center; justify-content: center; gap: 4px; border-right: 1px solid #edf1f4; }
.task-summary div:last-child { border-right: none; }
.task-summary strong { color: #2f66d0; font-size: 16px; }
.task-summary span { color: #768596; font-size: 12px; }
.task-nav { height: 45px; padding: 0 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center; border-bottom: 1px solid #e3e9ef; }
.task-list { min-height: 0; flex: 1; overflow: auto; padding: 8px; }
.task-item { margin-bottom: 8px; padding: 9px; background: #f8fafc; border: 1px solid #dfe6ed; cursor: pointer; }
.task-item:hover { border-color: #9ab8ee; }
.task-item.active { background: #f1f6ff; border-color: #447afc; box-shadow: inset 3px 0 #447afc; }
.task-line, .mother-progress { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 8px; }
.task-line strong { min-width: 0; overflow: hidden; color: #25364a; text-overflow: ellipsis; white-space: nowrap; }
.task-line.muted, .mother-progress { margin-top: 6px; color: #758293; font-size: 13px; }
.mother-report-tags { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 4px; }
.mother-report-tags span { padding: 2px 6px; color: #303846; font-size: 12px; line-height: 18px; background: #f1f3f5; border: 1px solid #dfe5eb; }
.mother-strip { height: 46px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8ef; }
.mother-strip > div { display: flex; align-items: center; gap: 12px; min-width: 0; }
.mother-strip strong { color: #24364b; font-size: 16px; }
.mother-strip span { color: #667487; }
.report-tabs { min-height: 72px; padding: 8px; display: flex; gap: 8px; overflow-x: auto; background: #f8fafc; border-bottom: 1px solid #d8e0e8; }
.report-tabs button { min-width: 138px; padding: 7px 8px; display: grid; gap: 4px; text-align: left; color: #33465b; background: #fff; border: 1px solid #d8e0e8; cursor: pointer; }
.report-tabs button.active { border-color: #447afc; box-shadow: inset 3px 0 #447afc; background: #f1f6ff; }
.report-tabs strong { font-size: 14px; }
.report-tabs span { color: #7b8795; font-size: 12px; }
.viewer-meta { flex: 0 0 auto; border-bottom: 1px solid #e2e8ef; }
.viewer-meta dl { margin: 0; padding: 7px 12px; display: grid; grid-template-columns: 180px 180px minmax(260px, 1fr); gap: 8px 16px; background: #fff; }
.viewer-meta dl > div { display: flex; min-width: 0; align-items: center; gap: 6px; }
.viewer-meta dt { flex: 0 0 auto; color: #8793a1; font-size: 12px; }
.viewer-meta dd { min-width: 0; margin: 0; overflow: hidden; color: #33465b; text-overflow: ellipsis; white-space: nowrap; }
.viewer-toolbar { min-height: 44px; padding: 5px 8px; display: flex; flex-wrap: wrap; gap: 7px; align-items: center; background: #f4f6f8; border-bottom: 1px solid #d8e0e8; }
.viewer-toolbar :deep(.el-button) { border-radius: 0; }
.report-viewport { min-height: 0; flex: 1; overflow: hidden; display: flex; align-items: flex-start; justify-content: center; padding: 16px; background: #cfd4da; cursor: grab; touch-action: none; user-select: none; }
.report-viewport.dragging { cursor: grabbing; }
.report-viewport img { max-width: none; transform-origin: center center; background: #fff; box-shadow: 0 2px 12px rgba(31, 45, 61, .25); pointer-events: none; }
.thumb-strip { height: 110px; padding: 8px; display: flex; gap: 8px; overflow-x: auto; background: #f7f9fb; border-top: 1px solid #d8e0e8; }
.thumb-strip button { width: 76px; height: 92px; flex: 0 0 76px; padding: 4px; color: #526173; background: #fff; border: 1px solid #d8e0e8; cursor: pointer; }
.thumb-strip button.active { border-color: #447afc; box-shadow: inset 0 0 0 2px rgba(68, 122, 252, .18); }
.thumb-strip img { display: block; width: 48px; height: 64px; margin: 0 auto 3px; object-fit: cover; object-position: top; border: 1px solid #d7dfe8; }
.thumb-strip span { font-size: 12px; }
.supplement-title { height: 56px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8ef; }
.supplement-title strong { color: #24364b; font-size: 16px; }
.supplement-form { min-height: 0; flex: 1; overflow: auto; padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; align-content: start; }
.supplement-form :deep(.el-form-item) { margin-bottom: 10px; }
.supplement-form .full { grid-column: 1 / -1; }
.lab-editor { min-height: 0; flex: 1; padding: 12px; overflow: hidden; }
.lab-toolbar { height: 38px; display: flex; align-items: center; justify-content: space-between; }
.lab-toolbar span { color: #33465b; font-weight: 600; }
.lab-table { --el-table-header-bg-color: #edf4fa; }
.lab-table :deep(.el-table__cell) { padding: 5px 0; }
.lab-table :deep(.el-input__wrapper) { min-height: 28px; }
.supplement-actions { flex: 0 0 auto; padding: 10px 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; border-top: 1px solid #d8e0e8; }
.supplement-actions .el-button { width: 100%; margin: 0; }
@media (max-width: 1650px) { .workbench-layout { grid-template-columns: 320px minmax(0, 1fr) 400px; } .filter-grid { grid-template-columns: 300px 180px 180px 200px; } }
</style>








