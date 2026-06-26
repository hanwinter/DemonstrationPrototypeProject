<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Close,
  Download,
  FullScreen,
  Minus,
  Picture,
  Printer,
  Rank,
  RefreshLeft,
  RefreshRight,
  Search,
  Top,
  ZoomIn,
  ZoomOut,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const activeTab = ref('capture')
const reportTypes = ['检验报告', 'NT报告', 'B超报告', '心电图报告', '唐筛报告', '无创DNA报告', '胎心监护报告', '其他报告']
const hospitals = ['北京市朝阳区妇幼保健院', '北京大学人民医院', '首都医科大学附属北京妇产医院', '北京市密云区医院']
const patient = {
  name: '张某某',
  age: '29岁',
  archiveNo: 'M2026000123',
  idNo: '110***********1234',
  gestationalAge: '28+3周',
  dueDate: '2026-09-15',
  phone: '138****8888',
}

const captureForm = reactive({
  reportType: 'B超报告',
  reportDate: '2026-06-20',
  hospital: '北京市朝阳区妇幼保健院',
  visitDate: '2026-06-20',
  remark: '外院产检携带报告，需归档影像。',
})


const thumbnails = ref([
  { id: 1, name: '第1页', angle: 0 },
  { id: 2, name: '第2页', angle: 0 },
  { id: 3, name: '第3页', angle: 0 },
])

const filters = reactive({
  reportDates: [],
  archiveDates: [],
  reportType: '',
  uploader: '',
  status: '',
})

const reportRows = ref(createReports())
const filteredReports = computed(() =>
  reportRows.value.filter((item) => {
    const typeMatch = !filters.reportType || item.reportType === filters.reportType
    const uploaderMatch = !filters.uploader || item.uploader.includes(filters.uploader)
    const statusMatch = !filters.status || item.status === filters.status
    return typeMatch && uploaderMatch && statusMatch
  }),
)

const viewer = reactive(loadViewerState())
const currentReport = ref(null)
const currentPage = ref(1)
const zoom = ref(1)
const rotation = ref(0)
const imageOffset = reactive({ x: 0, y: 0 })
const movingWindow = ref(false)
const resizingWindow = ref(false)
const panningImage = ref(false)
let pointerStart = { x: 0, y: 0 }
let windowStart = { x: 0, y: 0, width: 0, height: 0 }
let imageStart = { x: 0, y: 0 }

const previewImage = computed(() => createReportImageUrl(currentReport.value || capturePreviewReport.value, currentPage.value))
const capturePreviewReport = computed(() => ({
  reportDate: captureForm.reportDate,
  reportType: captureForm.reportType,
  hospital: captureForm.hospital,
  pages: thumbnails.value.length,
}))

const viewerTitle = computed(() => {
  const report = currentReport.value || capturePreviewReport.value
  return `${report.reportType}　${report.reportDate}`
})

const viewerStyle = computed(() => ({
  left: `${viewer.x}px`,
  top: `${viewer.y}px`,
  width: `${viewer.width}px`,
  height: viewer.minimized ? '42px' : `${viewer.height}px`,
  zIndex: viewer.pinned ? 2200 : 1600,
}))

watch(
  () => [viewer.x, viewer.y, viewer.width, viewer.height, viewer.pinned],
  saveViewerState,
)

function createReports() {
  const statuses = ['正常', '草稿', '正常', '正常', '已作废', '正常', '草稿', '正常', '正常', '正常']
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    reportDate: `2026-06-${String(20 - index).padStart(2, '0')}`,
    reportType: reportTypes[(index + 2) % reportTypes.length],
    hospital: hospitals[index % hospitals.length],
    pages: (index % 3) + 1,
    uploader: index % 2 ? '李护士' : '张医生',
    archivedAt: `2026-06-${String(20 - index).padStart(2, '0')} ${String(9 + index).padStart(2, '0')}:18`,
    status: statuses[index],
    remark: index % 2 ? '外院复查报告' : '孕期常规检查报告',
  }))
}

function loadViewerState() {
  const fallback = {
    visible: false,
    minimized: false,
    pinned: true,
    x: 730,
    y: 116,
    width: 660,
    height: 650,
  }
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem('external-report-viewer-state') || '{}') }
  } catch {
    return fallback
  }
}

function saveViewerState() {
  localStorage.setItem(
    'external-report-viewer-state',
    JSON.stringify({
      x: viewer.x,
      y: viewer.y,
      width: viewer.width,
      height: viewer.height,
      pinned: viewer.pinned,
    }),
  )
}

function createReportImageUrl(report, page) {
  const pageTitle = `${report.reportType || 'B超报告'}（第${page}页）`
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1220" viewBox="0 0 900 1220">
      <rect width="900" height="1220" fill="#fff"/>
      <rect x="40" y="34" width="820" height="1152" fill="#fff" stroke="#222" stroke-width="2"/>
      <text x="450" y="86" text-anchor="middle" font-size="30" font-family="Microsoft YaHei, Arial" font-weight="700">外院超声检查报告单</text>
      <text x="70" y="134" font-size="18" font-family="Microsoft YaHei, Arial">检查医院：${report.hospital || captureForm.hospital}</text>
      <text x="560" y="134" font-size="18" font-family="Microsoft YaHei, Arial">报告日期：${report.reportDate || captureForm.reportDate}</text>
      <line x1="60" y1="158" x2="840" y2="158" stroke="#333" stroke-width="1"/>
      <text x="70" y="198" font-size="18" font-family="Microsoft YaHei, Arial">姓名：张某某</text>
      <text x="260" y="198" font-size="18" font-family="Microsoft YaHei, Arial">年龄：29岁</text>
      <text x="430" y="198" font-size="18" font-family="Microsoft YaHei, Arial">孕周：28+3周</text>
      <text x="650" y="198" font-size="18" font-family="Microsoft YaHei, Arial">档案号：M2026000123</text>
      <rect x="90" y="235" width="720" height="455" fill="#121820" stroke="#333" stroke-width="1"/>
      <ellipse cx="450" cy="452" rx="235" ry="158" fill="#27303a"/>
      <ellipse cx="450" cy="452" rx="185" ry="118" fill="#35404a"/>
      <path d="M300 448 C360 345 528 340 600 450 C520 532 382 538 300 448Z" fill="#1c242e" stroke="#b8c4ce" stroke-width="4" opacity=".9"/>
      <path d="M360 465 C410 415 498 418 548 470" fill="none" stroke="#d6dde4" stroke-width="5"/>
      <circle cx="515" cy="428" r="26" fill="#111820" stroke="#d6dde4" stroke-width="3"/>
      <text x="112" y="667" fill="#cfd8e2" font-size="15" font-family="Arial">GAIN 68  DEPTH 15.0cm  MI 0.9  ${pageTitle}</text>
      <text x="70" y="744" font-size="20" font-family="Microsoft YaHei, Arial" font-weight="700">检查所见</text>
      <text x="70" y="786" font-size="17" font-family="Microsoft YaHei, Arial">胎儿双顶径约 72mm，股骨长约 54mm，胎心率约 152 次/分。</text>
      <text x="70" y="820" font-size="17" font-family="Microsoft YaHei, Arial">羊水指数约 128mm，胎盘位于子宫前壁，成熟度 I 级。</text>
      <text x="70" y="854" font-size="17" font-family="Microsoft YaHei, Arial">胎儿颈项透明层及结构显示清晰，未见明显异常回声。</text>
      <text x="70" y="925" font-size="20" font-family="Microsoft YaHei, Arial" font-weight="700">提示</text>
      <text x="70" y="966" font-size="17" font-family="Microsoft YaHei, Arial">单活胎，胎儿大小符合孕周，请结合临床定期产检。</text>
      <line x1="60" y1="1040" x2="840" y2="1040" stroke="#333" stroke-width="1"/>
      <text x="70" y="1090" font-size="16" font-family="Microsoft YaHei, Arial">报告医生：王医生</text>
      <text x="350" y="1090" font-size="16" font-family="Microsoft YaHei, Arial">审核医生：赵医生</text>
      <text x="650" y="1090" font-size="16" font-family="Microsoft YaHei, Arial">页码：${page}/${report.pages || thumbnails.value.length}</text>
    </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function openViewer(report = null, page = 1) {
  currentReport.value = report
  currentPage.value = page
  zoom.value = 1
  rotation.value = 0
  imageOffset.x = 0
  imageOffset.y = 0
  viewer.visible = true
  viewer.minimized = false
  nextTick(keepViewerInViewport)
}

function closeViewer() {
  viewer.visible = false
}

function keepViewerInViewport() {
  const maxX = Math.max(0, window.innerWidth - 260)
  const maxY = Math.max(0, window.innerHeight - 80)
  viewer.x = Math.min(Math.max(0, viewer.x), maxX)
  viewer.y = Math.min(Math.max(0, viewer.y), maxY)
}

function startWindowMove(event) {
  if (event.target.closest('.viewer-tool') || event.target.closest('.viewer-window-actions')) return
  movingWindow.value = true
  pointerStart = { x: event.clientX, y: event.clientY }
  windowStart = { x: viewer.x, y: viewer.y, width: viewer.width, height: viewer.height }
  event.currentTarget.setPointerCapture(event.pointerId)
}

function moveWindow(event) {
  if (!movingWindow.value) return
  viewer.x = windowStart.x + event.clientX - pointerStart.x
  viewer.y = windowStart.y + event.clientY - pointerStart.y
  keepViewerInViewport()
}

function stopWindowMove(event) {
  movingWindow.value = false
  event.currentTarget.releasePointerCapture?.(event.pointerId)
}

function startResize(event) {
  resizingWindow.value = true
  pointerStart = { x: event.clientX, y: event.clientY }
  windowStart = { x: viewer.x, y: viewer.y, width: viewer.width, height: viewer.height }
  event.currentTarget.setPointerCapture(event.pointerId)
}

function resizeWindow(event) {
  if (!resizingWindow.value) return
  viewer.width = Math.min(window.innerWidth - viewer.x - 12, Math.max(460, windowStart.width + event.clientX - pointerStart.x))
  viewer.height = Math.min(window.innerHeight - viewer.y - 12, Math.max(380, windowStart.height + event.clientY - pointerStart.y))
}

function stopResize(event) {
  resizingWindow.value = false
  event.currentTarget.releasePointerCapture?.(event.pointerId)
}

function zoomBy(delta) {
  zoom.value = Math.min(2.5, Math.max(0.45, Number((zoom.value + delta).toFixed(2))))
}

function fitWidth() {
  zoom.value = Math.max(0.55, Math.min(1.45, (viewer.width - 72) / 900))
  imageOffset.x = 0
  imageOffset.y = 0
}

function fitWindow() {
  zoom.value = Math.max(0.45, Math.min((viewer.width - 70) / 900, (viewer.height - 128) / 1220))
  imageOffset.x = 0
  imageOffset.y = 0
}

function resetImage() {
  zoom.value = 1
  rotation.value = 0
  imageOffset.x = 0
  imageOffset.y = 0
}

function pageCount() {
  return currentReport.value?.pages || thumbnails.value.length
}

function switchPage(step) {
  currentPage.value = Math.min(pageCount(), Math.max(1, currentPage.value + step))
  imageOffset.x = 0
  imageOffset.y = 0
}

function handleViewerWheel(event) {
  event.preventDefault()
  zoomBy(event.deltaY > 0 ? -0.08 : 0.08)
}

function startImagePan(event) {
  if (event.button !== 0) return
  panningImage.value = true
  pointerStart = { x: event.clientX, y: event.clientY }
  imageStart = { x: imageOffset.x, y: imageOffset.y }
  event.currentTarget.setPointerCapture(event.pointerId)
}

function panImage(event) {
  if (!panningImage.value) return
  imageOffset.x = imageStart.x + event.clientX - pointerStart.x
  imageOffset.y = imageStart.y + event.clientY - pointerStart.y
}

function stopImagePan(event) {
  panningImage.value = false
  event.currentTarget.releasePointerCapture?.(event.pointerId)
}

function statusType(status) {
  if (status === '正常') return 'success'
  if (status === '草稿') return 'warning'
  return 'info'
}

function saveDraft() {
  ElMessage.success('草稿已保存')
}

function archiveReport() {
  ElMessage.success('外院报告已保存归档')
  activeTab.value = 'archive'
}

function resetFilters() {
  Object.assign(filters, {
    reportDates: [],
    archiveDates: [],
    reportType: '',
    uploader: '',
    status: '',
  })
}

function rotateThumb(item) {
  item.angle = (item.angle + 90) % 360
  ElMessage.success(`${item.name} 已旋转`)
}

function deleteThumb(item) {
  thumbnails.value = thumbnails.value.filter((thumb) => thumb.id !== item.id)
  ElMessage.success(`${item.name} 已删除`)
}

function moveThumb(item, step) {
  const index = thumbnails.value.findIndex((thumb) => thumb.id === item.id)
  const target = index + step
  if (target < 0 || target >= thumbnails.value.length) return
  const list = [...thumbnails.value]
  ;[list[index], list[target]] = [list[target], list[index]]
  thumbnails.value = list
}

function retakeThumb(item) {
  ElMessage.success(`${item.name} 已重拍`)
}

function addPhoto() {
  const id = Date.now()
  thumbnails.value.push({ id, name: `第${thumbnails.value.length + 1}页`, angle: 0 })
  ElMessage.success('已模拟新增拍照页')
}

function printViewer() {
  ElMessage.success('已触发打印演示')
}

function downloadViewer() {
  ElMessage.success('已触发下载演示')
}

function retakeReport(row) {
  Object.assign(captureForm, {
    reportType: row.reportType,
    reportDate: row.reportDate,
    hospital: row.hospital,
    visitDate: row.reportDate,
    remark: row.remark || '补拍外院报告图片。',
  })
  thumbnails.value = Array.from({ length: row.pages || 1 }, (_, index) => ({
    id: Date.now() + index,
    name: `第${index + 1}页`,
    angle: 0,
  }))
  activeTab.value = 'capture'
  ElMessage.info(`已切换到采集页，可补拍 ${row.reportType}`)
}

function voidReport(row) {
  ElMessageBox.confirm(`确认作废 ${row.reportDate} 的${row.reportType}？`, '作废确认', {
    type: 'warning',
    confirmButtonText: '作废',
    cancelButtonText: '取消',
  })
    .then(() => {
      row.status = '已作废'
      ElMessage.success('报告已作废')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="external-page">
    <header class="system-header external-header">
      <div class="brand">
        <img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" />
      </div>
      <DemoPageNavigation />
      <div class="header-meta">门诊工作台 ｜ 操作员：张医生</div>
    </header>

    <main class="external-main">
      <section class="page-heading external-heading">
        <div class="heading-left">
          <el-button text :icon="ArrowLeft" @click="router.push('/outpatient')">返回</el-button>
          <span class="heading-divider"></span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>门诊</el-breadcrumb-item>
            <el-breadcrumb-item>外院报告影像管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </section>

      <section class="external-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="外院报告采集" name="capture" />
          <el-tab-pane label="外院报告查阅" name="archive" />
        </el-tabs>
      </section>

      <section v-if="activeTab === 'capture'" class="capture-layout">
        <aside class="capture-left">
          <section class="his-card patient-card">
            <div class="card-title">孕产妇信息</div>
            <dl>
              <div><dt>姓名</dt><dd>{{ patient.name }}</dd></div>
              <div><dt>年龄</dt><dd>{{ patient.age }}</dd></div>
              <div><dt>档案号</dt><dd>{{ patient.archiveNo }}</dd></div>
              <div><dt>身份证号</dt><dd>{{ patient.idNo }}</dd></div>
              <div><dt>孕周</dt><dd>{{ patient.gestationalAge }}</dd></div>
              <div><dt>预产期</dt><dd>{{ patient.dueDate }}</dd></div>
              <div><dt>联系电话</dt><dd>{{ patient.phone }}</dd></div>
            </dl>
          </section>

          <section class="his-card report-form-card">
            <div class="card-title">报告信息</div>
            <el-form label-position="top">
              <el-form-item label="报告类型">
                <el-radio-group v-model="captureForm.reportType" class="report-type-radios">
                  <el-radio-button v-for="item in reportTypes" :key="item" :label="item" :value="item" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="报告日期" class="compact-form-item">
                <el-date-picker v-model="captureForm.reportDate" type="date" value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item label="检查医院">
                <el-input v-model="captureForm.hospital" />
              </el-form-item>
              <el-form-item label="关联产检日期" class="compact-form-item">
                <el-date-picker v-model="captureForm.visitDate" type="date" value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="captureForm.remark" type="textarea" :rows="4" />
              </el-form-item>
            </el-form>
          </section>
        </aside>

        <section class="capture-right">
          <section class="his-card scanner-card">
            <div class="scanner-topline">
              <div>
                <div class="card-title">高拍仪采集</div>

              </div>
            </div>
            <div class="scanner-preview">
              <img :src="createReportImageUrl(capturePreviewReport, 1)" alt="高拍仪预览" />
              <div class="scanner-overlay">
                <el-icon><Camera /></el-icon>
                <span>当前采集：{{ captureForm.reportType }} ｜ 设备已连接</span>
              </div>
            </div>
            <div class="scanner-actions">
              <el-button :icon="Camera">打开高拍仪</el-button>
              <el-button type="primary" :icon="Picture" @click="addPhoto">拍照</el-button>
              <el-button :icon="RefreshLeft">重拍</el-button>
            </div>
          </section>

          <section class="his-card thumb-card">
            <div class="thumb-heading">
              <div class="card-title">报告图片预览</div>
              <div class="thumb-save-actions">
                <el-button @click="saveDraft">保存草稿</el-button>
                <el-button type="primary" @click="archiveReport">保存归档</el-button>
                <el-button @click="router.push('/outpatient')">返回档案</el-button>
              </div>
            </div>
            <div class="thumb-list">
              <article v-for="(item, index) in thumbnails" :key="item.id" class="thumb-item">
                <div class="thumb-image" @dblclick="openViewer(null, index + 1)">
                  <img
                    :src="createReportImageUrl(capturePreviewReport, index + 1)"
                    :alt="item.name"
                    :style="{ transform: `rotate(${item.angle}deg)` }"
                  />
                </div>
                <div class="thumb-meta">
                  <strong>{{ item.name }}</strong>
                  <span>{{ captureForm.reportType }}</span>
                </div>
                <div class="thumb-actions">
                  <el-button link type="primary" @click="openViewer(null, index + 1)">查看</el-button>
                  <el-button link @click="rotateThumb(item)">旋转</el-button>
                  <el-button link type="danger" @click="deleteThumb(item)">删除</el-button>
                  <el-button link @click="retakeThumb(item)">重拍</el-button>
                  <el-button link :disabled="index === 0" @click="moveThumb(item, -1)">上移</el-button>
                  <el-button link :disabled="index === thumbnails.length - 1" @click="moveThumb(item, 1)">下移</el-button>
                </div>
              </article>
            </div>
          </section>

        </section>
      </section>

      <section v-else class="archive-page-layout">
        <section class="patient-summary">
          <span class="patient-label">孕妇信息</span>
          <div><span>姓名：</span><strong>{{ patient.name }}</strong></div>
          <div><span>年龄：</span><strong>{{ patient.age }}</strong></div>
          <div><span>档案号：</span><strong>{{ patient.archiveNo }}</strong></div>
          <div><span>孕周：</span><strong>{{ patient.gestationalAge }}</strong></div>
          <div><span>预产期：</span><strong>{{ patient.dueDate }}</strong></div>
        </section>

        <section class="archive-content">
          <section class="report-list-panel">            <section class="his-card filter-card">
              <el-form class="filter-grid archive-filter-grid" label-position="left">
                <el-form-item label="报告日期" class="filter-date"><el-date-picker v-model="filters.reportDates" type="daterange" value-format="YYYY-MM-DD" /></el-form-item>
                <el-form-item label="归档日期" class="filter-date"><el-date-picker v-model="filters.archiveDates" type="daterange" value-format="YYYY-MM-DD" /></el-form-item>
                <el-form-item label="上传人" class="filter-uploader"><el-input v-model="filters.uploader" clearable /></el-form-item>
                <el-form-item label="报告类型" class="filter-type">
                  <el-select v-model="filters.reportType" clearable>
                    <el-option v-for="item in reportTypes" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="报告状态" class="filter-status">
                  <el-select v-model="filters.status">
                    <el-option label="全部" value="" />
                    <el-option label="正常" value="正常" />
                    <el-option label="草稿" value="草稿" />
                    <el-option label="已作废" value="已作废" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="filter-actions">
                <el-button type="primary" :icon="Search">查询</el-button>
                <el-button @click="resetFilters">重置</el-button>
              </div>
            </section>

            <section class="his-card list-card">              <div class="list-title">
                <div class="list-title-left">
                  <div class="card-title">报告列表</div>
                  <span>共 {{ filteredReports.length }} 条</span>
                </div>
                <el-button type="primary" plain :icon="Camera" @click="activeTab = 'capture'">新增外院报告</el-button>
              </div>
              <el-table :data="filteredReports" border stripe height="calc(100vh - 360px)" class="report-table">
                <el-table-column prop="reportDate" label="报告日期" width="112" />
                <el-table-column prop="reportType" label="报告类型" width="120" />
                <el-table-column prop="hospital" label="检查医院" min-width="210" show-overflow-tooltip />
                <el-table-column prop="pages" label="页数" width="70" align="center" />
                <el-table-column prop="uploader" label="上传人" width="92" />
                <el-table-column prop="archivedAt" label="归档时间" width="150" />
                <el-table-column prop="status" label="状态" width="88" align="center">
                  <template #default="{ row }">
                    <el-tag :type="statusType(row.status)" effect="plain" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="{ row }">
                    <div class="operation-actions">
                      <el-button link type="primary" @click="openViewer(row)">查看</el-button>
                      <el-button link @click="retakeReport(row)">补拍</el-button>
                      <el-button link type="danger" @click="voidReport(row)">作废</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </section>
        </section>
      </section>
    </main>

    <section
      v-if="viewer.visible"
      class="floating-viewer"
      :class="{ 'is-minimized': viewer.minimized, 'is-pinned': viewer.pinned }"
      :style="viewerStyle"
    >
      <header
        class="viewer-titlebar"
        @pointerdown="startWindowMove"
        @pointermove="moveWindow"
        @pointerup="stopWindowMove"
        @pointercancel="stopWindowMove"
      >
        <div class="viewer-title">
          <el-icon><Rank /></el-icon>
          <strong>外院报告查看</strong>
          <span>{{ viewerTitle }}</span>
        </div>
        <div class="viewer-window-actions">
          <el-button class="viewer-tool" text :icon="Top" :type="viewer.pinned ? 'primary' : ''" title="置顶" @click="viewer.pinned = !viewer.pinned" />
          <el-button class="viewer-tool" text :icon="Minus" title="最小化" @click="viewer.minimized = !viewer.minimized" />
          <el-button class="viewer-tool" text :icon="Close" title="关闭" @click="closeViewer" />
        </div>
      </header>

      <template v-if="!viewer.minimized">
        <div class="viewer-toolbar">
          <el-button-group>
            <el-button :icon="ZoomIn" title="放大" @click="zoomBy(0.12)" />
            <el-button :icon="ZoomOut" title="缩小" @click="zoomBy(-0.12)" />
            <el-button title="适应宽度" @click="fitWidth">适应宽度</el-button>
            <el-button :icon="FullScreen" title="适应窗口" @click="fitWindow" />
            <el-button title="原始大小" @click="resetImage">原始大小</el-button>
          </el-button-group>
          <el-button-group>
            <el-button :icon="RefreshLeft" title="左旋转" @click="rotation -= 90" />
            <el-button :icon="RefreshRight" title="右旋转" @click="rotation += 90" />
          </el-button-group>
          <el-button-group>
            <el-button :icon="ArrowLeft" title="上一页" :disabled="currentPage === 1" @click="switchPage(-1)" />
            <el-button disabled>{{ currentPage }} / {{ pageCount() }}</el-button>
            <el-button :icon="ArrowRight" title="下一页" :disabled="currentPage === pageCount()" @click="switchPage(1)" />
          </el-button-group>
          <el-button-group>
            <el-button :icon="Printer" title="打印" @click="printViewer" />
            <el-button :icon="Download" title="下载" @click="downloadViewer" />
          </el-button-group>
        </div>

        <div
          class="viewer-image-area"
          :class="{ 'is-panning': panningImage }"
          @wheel="handleViewerWheel"
          @pointerdown="startImagePan"
          @pointermove="panImage"
          @pointerup="stopImagePan"
          @pointercancel="stopImagePan"
        >
          <img
            :src="previewImage"
            alt="外院报告影像"
            :style="{
              width: `${900 * zoom}px`,
              transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) rotate(${rotation}deg)`,
            }"
            draggable="false"
          />
        </div>

        <div
          class="viewer-resize"
          @pointerdown.stop="startResize"
          @pointermove.stop="resizeWindow"
          @pointerup.stop="stopResize"
          @pointercancel.stop="stopResize"
        ></div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.external-page {
  min-height: 100vh;
  background: #edf1f5;
  color: #303846;
}

.external-header {
  min-width: 1600px;
}

.external-main {
  min-width: 1600px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 12px 16px 18px;
}

.external-heading {
  border-bottom: 1px solid var(--border-color);
}

.external-tabs {
  height: 48px;
  margin-top: 8px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid var(--border-color);
}

.external-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.capture-layout {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr);
  gap: 10px;
}

.capture-left,
.capture-right,
.report-list-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.his-card {
  background: #fff;
  border: 1px solid #d8e0e8;
}

.card-title {
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #273b52;
  border-bottom: 1px solid #e3e9ef;
  font-weight: 600;
}

.patient-card dl {
  margin: 0;
  padding: 10px 14px 12px;
}

.patient-card dl div {
  min-height: 34px;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  align-items: center;
  border-bottom: 1px solid #edf1f4;
}

.patient-card dl div:last-child {
  border-bottom: none;
}

.patient-card dt {
  color: #748293;
}

.patient-card dd {
  margin: 0;
  color: #2f4054;
  font-weight: 600;
}

.report-form-card {
  padding-bottom: 2px;
}

.report-form-card :deep(.el-form) {
  padding: 10px 12px 0;
}

.report-form-card :deep(.el-select),
.report-form-card :deep(.el-date-editor) {
  width: 100%;
}

.report-type-radios {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.report-type-radios :deep(.el-radio-button__inner) {
  width: 100%;
  padding: 8px 6px;
  border-left: 1px solid var(--el-border-color);
  border-radius: 2px;
}
.compact-form-item :deep(.el-form-item__label) {
  width: 96px;
  height: 32px;
  margin: 0;
  padding-right: 10px;
  justify-content: flex-end;
  line-height: 32px;
}

.compact-form-item :deep(.el-form-item__content) {
  min-width: 0;
  flex: 1;
}

.report-form-card :deep(.compact-form-item) {
  display: flex;
  align-items: center;
}
.scanner-card {
  padding-bottom: 12px;
}

.scanner-topline,
.list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scanner-topline .card-title,
.list-title .card-title {
  border-bottom: none;
}


.scanner-preview {
  position: relative;
  height: 410px;
  margin: 0 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: #d9dde1;
  border: 1px solid #c8d0d9;
}

.scanner-preview img {
  width: 315px;
  height: auto;
  margin: 16px auto;
  background: #fff;
  box-shadow: 0 2px 10px rgba(30, 43, 57, 0.2);
}

.scanner-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 7px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  background: rgba(33, 48, 65, 0.82);
  border-radius: 2px;
}

.scanner-actions,
.filter-actions {
  padding: 10px 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.thumb-heading {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e3e9ef;
}

.thumb-heading .card-title {
  border-bottom: none;
}

.thumb-save-actions {
  padding-right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.thumb-card {
  min-height: 190px;
}

.thumb-list {
  padding: 10px 12px 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.thumb-item {
  min-width: 0;
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 8px;
  padding: 8px;
  border: 1px solid #dfe6ed;
  background: #f8fafc;
}

.thumb-image {
  width: 92px;
  height: 118px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: #d7dce1;
  border: 1px solid #c7d0d9;
  cursor: pointer;
}

.thumb-image img {
  width: 72px;
  transform-origin: center center;
  transition: transform .15s ease;
}

.thumb-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.thumb-meta span {
  color: #7a8795;
  font-size: 13px;
}

.thumb-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
}


.archive-page-layout {
  margin-top: 10px;
}

.patient-summary {
  height: 54px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 34px;
  background: #f7fbff;
  border: 1px solid var(--border-color);
}

.patient-summary div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.patient-summary span {
  color: #778596;
}

.archive-content {
  margin-top: 10px;
  display: block;
}

.filter-card {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.filter-grid {
  display: flex;
  align-items: center;
  gap: 12px;
}

.archive-filter-grid {
  flex: 0 0 auto;
}

.archive-filter-grid :deep(.el-form-item) {
  margin-bottom: 0;
  align-items: center;
}

.archive-filter-grid :deep(.el-form-item__label) {
  width: 76px;
  height: 32px;
  padding-right: 8px;
  justify-content: flex-end;
  line-height: 32px;
  color: #637083;
}

.archive-filter-grid :deep(.el-form-item__content) {
  min-width: 0;
}

.archive-filter-grid :deep(.filter-date .el-date-editor) {
  width: 248px;
}

.archive-filter-grid :deep(.filter-uploader .el-input) {
  width: 140px;
}

.archive-filter-grid :deep(.filter-type .el-select),
.archive-filter-grid :deep(.filter-status .el-select) {
  width: 160px;
}

.filter-actions {
  width: 100%;
  padding-left: 0;
  justify-content: center;
}
.list-title-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.list-title span {
  padding-right: 12px;
  color: #8793a0;
}

.operation-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.operation-actions .el-button {
  margin: 0;
}
.report-table {
  --el-table-header-bg-color: #edf4fa;
  --el-table-header-text-color: #41556b;
}


.floating-viewer {
  position: fixed;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #526171;
  box-shadow: 0 10px 28px rgba(27, 39, 53, .28);
}

.viewer-titlebar {
  height: 42px;
  flex: 0 0 42px;
  padding: 0 8px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: #2f5fa8;
  cursor: move;
  user-select: none;
}

.viewer-title {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.viewer-title span {
  overflow: hidden;
  color: rgba(255, 255, 255, .84);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.viewer-window-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.viewer-window-actions :deep(.el-button) {
  color: #fff;
}

.viewer-toolbar {
  min-height: 42px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  background: #f4f6f8;
  border-bottom: 1px solid #d7dfe8;
}

.viewer-toolbar :deep(.el-button) {
  border-radius: 0;
}

.viewer-image-area {
  min-height: 0;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  background: #cfd4da;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.viewer-image-area.is-panning {
  cursor: grabbing;
}

.viewer-image-area img {
  max-width: none;
  transform-origin: center center;
  background: #fff;
  box-shadow: 0 2px 12px rgba(31, 45, 61, .25);
  pointer-events: none;
}

.viewer-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
}

.viewer-resize::after {
  content: "";
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 9px;
  height: 9px;
  border-right: 2px solid #6e7d8d;
  border-bottom: 2px solid #6e7d8d;
}

.floating-viewer.is-minimized {
  width: 360px !important;
}

@media (max-width: 1450px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>






























