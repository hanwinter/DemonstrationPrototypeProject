<script setup>
import { computed, nextTick, ref } from 'vue'
import {
  ArrowLeft,
  Camera,
  CirclePlus,
  Download,
  Refresh,
  Search,
  ZoomIn,
  ZoomOut,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { createLabRows, systemItems } from '../mock/labData'

const router = useRouter()
const rows = ref(createLabRows())
const hasScanned = ref(false)
const recognizing = ref(false)
const scanning = ref(false)
const matching = ref(false)
const reportScale = ref(0.72)
const matchStatus = ref('全部')
const matchSource = ref('全部')
const reportType = ref('检验报告')
const testGroups = ref(['血常规', '血型'])
const hospitalName = ref('北京市通州区妇幼保健院')
const reportName = ref('北京市密云区医院检验报告单')
const reportDate = ref('2026-06-11')
const recognitionTime = ref('2026-06-11 10:23')
const tableRef = ref()
const reportViewportRef = ref()
const scanVersion = ref(0)
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const reportImageUrl = computed(
  () => `${import.meta.env.BASE_URL}mock-lab-report.svg?v=${scanVersion.value}`,
)
const draggingReport = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragStartScrollLeft = 0
let dragStartScrollTop = 0

const matchedCount = computed(() => rows.value.filter((row) => row.status === '已匹配').length)
const unmatchedCount = computed(() => rows.value.filter((row) => row.status === '未匹配').length)
const ruleCount = computed(() => rows.value.filter((row) => row.source === '规则匹配').length)
const manualCount = computed(() => rows.value.filter((row) => row.source === '人工选择').length)
const filteredRows = computed(() =>
  rows.value.filter((row) => {
    const statusMatches = matchStatus.value === '全部' || row.status === matchStatus.value
    const sourceMatches = matchSource.value === '全部' || row.source === matchSource.value
    return statusMatches && sourceMatches
  }),
)

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function handleSystemItemChange(row, value) {
  row.systemItem = value
  row.status = value ? '已匹配' : '未匹配'
  row.source = value ? (row.manual ? '人工新增' : '人工选择') : ''
}

function zoom(step) {
  reportScale.value = Math.min(1.6, Math.max(0.45, Number((reportScale.value + step).toFixed(2))))
}

function handleReportWheel(event) {
  if (event.ctrlKey) {
    event.preventDefault()
    zoom(event.deltaY > 0 ? -0.08 : 0.08)
  }
}

function startReportDrag(event) {
  const viewport = reportViewportRef.value
  if (!viewport || event.button !== 0) return

  draggingReport.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragStartScrollLeft = viewport.scrollLeft
  dragStartScrollTop = viewport.scrollTop
  viewport.setPointerCapture(event.pointerId)
}

function moveReport(event) {
  const viewport = reportViewportRef.value
  if (!viewport || !draggingReport.value) return

  viewport.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX)
  viewport.scrollTop = dragStartScrollTop - (event.clientY - dragStartY)
}

function stopReportDrag(event) {
  if (!draggingReport.value) return
  draggingReport.value = false
  reportViewportRef.value?.releasePointerCapture?.(event.pointerId)
}

async function scanAgain() {
  scanning.value = true
  await new Promise((resolve) => setTimeout(resolve, 2200))
  scanVersion.value += 1
  reportScale.value = 0.72
  hasScanned.value = true
  await nextTick()
  if (reportViewportRef.value) {
    reportViewportRef.value.scrollLeft = 0
    reportViewportRef.value.scrollTop = 0
  }
  scanning.value = false
  ElMessage.success('高拍仪重新扫描完成')
}

function returnToOutpatient() {
  router.push('/outpatient')
}

async function recognizeAgain() {
  recognizing.value = true
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const candidates = rows.value.filter((row) => !row.manual)
  candidates.forEach((row, index) => {
    const shouldMatch = index < 18 + Math.floor(Math.random() * 6)
    row.status = shouldMatch ? '已匹配' : '未匹配'
    row.systemItem = shouldMatch ? systemItems[index] : ''
    row.source = shouldMatch ? (index % 5 === 0 ? '人工选择' : '规则匹配') : ''
  })
  recognitionTime.value = formatDateTime(new Date())
  recognizing.value = false
  ElMessage.success('重新识别成功')
}

async function autoMatch() {
  const unmatched = rows.value.filter((row) => row.status === '未匹配')
  if (!unmatched.length) {
    ElMessage.info('当前没有需要匹配的项目')
    return
  }
  matching.value = true
  await new Promise((resolve) => setTimeout(resolve, 700))
  const count = Math.max(1, Math.ceil(unmatched.length * 0.7))
  unmatched.slice(0, count).forEach((row) => {
    const match = systemItems.find((item) => item.includes(row.ocrName.replace(/[数%]/g, ''))) || row.ocrName
    row.systemItem = match
    row.status = '已匹配'
    row.source = '规则匹配'
  })
  matching.value = false
  ElMessage.success(`自动匹配完成，成功匹配 ${count} 项`)
}

async function addRow() {
  const id = Math.max(...rows.value.map((row) => row.id), 0) + 1
  rows.value.push({
    id,
    ocrName: '人工新增',
    systemItem: '',
    result: '',
    unit: '',
    abnormal: '',
    reference: '',
    status: '未匹配',
    source: '人工新增',
    manual: true,
  })
  matchStatus.value = '全部'
  matchSource.value = '全部'
  await nextTick()
  tableRef.value?.setScrollTop(9999)
}

function removeRow(row) {
  rows.value = rows.value.filter((item) => item.id !== row.id)
  ElMessage.success('已删除新增记录')
}

function saveDraft() {
  ElMessage.success('暂存成功')
}

async function importToSystem() {
  if (unmatchedCount.value > 0) {
    try {
      await ElMessageBox.confirm(
        `当前仍有 ${unmatchedCount.value} 项未匹配，是否继续导入？`,
        '导入确认',
        {
          confirmButtonText: '继续导入',
          cancelButtonText: '返回校验',
          type: 'warning',
        },
      )
    } catch {
      return
    }
  }
  ElMessageBox.alert('已生成外院检验报告归档记录', '导入成功', {
    confirmButtonText: '确定',
    type: 'success',
  })
}
</script>

<template>
  <div class="app-shell">
    <header class="system-header">
      <div class="brand">
        <img
          class="system-logo"
          :src="systemLogoUrl"
          alt="孕产妇保健管理系统"
        />
      </div>
      <div class="header-meta">门诊工作台　｜　操作员：张医生</div>
    </header>

    <main class="page">
      <section class="page-heading">
        <div class="heading-left">
          <el-button text :icon="ArrowLeft" @click="returnToOutpatient">返回</el-button>
          <span class="heading-divider"></span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>门诊</el-breadcrumb-item>
            <el-breadcrumb-item>高拍仪识别</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <span class="page-code">业务日期：2026-06-11</span>
      </section>

      <section class="patient-bar">
        <span class="patient-label">孕妇信息</span>
        <div><span>姓名</span><strong>张桂兰</strong></div>
        <div><span>产检档案号</span><strong>20260401</strong></div>
        <div><span>身份证号</span><strong>xxxxxxxxxxxxxx</strong></div>
      </section>

      <section v-if="!hasScanned" class="scan-empty-workspace">
        <el-empty description="尚未扫描检验报告" :image-size="120">
          <el-button type="primary" :icon="Camera" :loading="scanning" @click="scanAgain">
            {{ scanning ? '高拍仪扫描中' : '开始扫描' }}
          </el-button>
        </el-empty>
      </section>

      <section v-else class="workspace">
        <aside class="left-panel">
          <div class="section-title">
            <h2>OCR 识别结果</h2>
            <div class="ocr-actions">
              <el-button :icon="Camera" :loading="scanning" @click="scanAgain">
                重新扫描
              </el-button>
              <el-button
                type="primary"
                plain
                :icon="Refresh"
                :loading="recognizing"
                :disabled="scanning"
                @click="recognizeAgain"
              >
                重新识别
              </el-button>
            </div>
          </div>

          <div class="summary-strip">
            <div><span>识别项目</span><strong>{{ rows.length }}</strong><small>项</small></div>
            <div><span>规则自动匹配</span><strong>{{ ruleCount }}</strong><small>项</small></div>
            <div><span>人工匹配</span><strong>{{ manualCount }}</strong><small>项</small></div>
          </div>
          <div class="recognition-time">识别时间：{{ recognitionTime }}</div>

          <div class="report-toolbar">
            <span>报告原图</span>
            <div>
              <el-button-group>
                <el-button :icon="ZoomOut" title="缩小" @click="zoom(-0.1)" />
                <el-button class="scale-text">{{ Math.round(reportScale * 100) }}%</el-button>
                <el-button :icon="ZoomIn" title="放大" @click="zoom(0.1)" />
              </el-button-group>
            </div>
          </div>
          <div
            ref="reportViewportRef"
            class="report-viewport"
            :class="{ 'is-dragging': draggingReport }"
            @wheel="handleReportWheel"
            @pointerdown="startReportDrag"
            @pointermove="moveReport"
            @pointerup="stopReportDrag"
            @pointercancel="stopReportDrag"
          >
            <div v-if="scanning" class="scan-mask">
              <el-icon class="scan-icon"><Camera /></el-icon>
              <span>高拍仪扫描中...</span>
            </div>
            <img
              :src="reportImageUrl"
              alt="北京市密云区医院血常规检验报告扫描件"
              :style="{ width: `${reportScale * 900}px` }"
              draggable="false"
            />
          </div>
        </aside>

        <section class="right-panel">
          <div class="right-content">
            <div class="right-heading">
              <h2>外院报告识别校验</h2>
              <div class="heading-actions">
                <el-button @click="saveDraft">暂存</el-button>
                <el-button type="primary" :icon="Download" @click="importToSystem">导入系统</el-button>
              </div>
            </div>

            <div class="form-section">
              <div class="subheading">报告基础信息</div>
              <el-form label-position="left" class="base-form">
                <el-form-item label="报告类型" class="field-report-type">
                <el-select v-model="reportType">
                  <el-option label="检验报告" value="检验报告" />
                </el-select>
              </el-form-item>
              <el-form-item class="field-test-groups">
                <template #label>
                  <span class="label-with-help">
                    <span>检验组</span>
                    <el-tooltip content="用于限制自动匹配的项目搜索范围" placement="top">
                      <span class="form-help">?</span>
                    </el-tooltip>
                  </span>
                </template>
                <el-select v-model="testGroups" multiple collapse-tags :max-collapse-tags="2">
                  <el-option
                    v-for="item in ['血常规', '血型', '肝功能', '肾功能', '血脂', '甲功', 'TORCH', '糖耐量']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="医院名称">
                <el-input v-model="hospitalName" />
              </el-form-item>
              <el-form-item label="报告名称" class="field-report-name">
                <el-input v-model="reportName" />
              </el-form-item>
              <el-form-item label="报告时间" class="field-report-date">
                <el-date-picker
                  v-model="reportDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-form>
            </div>

            <div class="table-section">
            <div class="table-tools">
              <div class="filters">
                <span class="filter-label">筛选</span>
                <el-select v-model="matchStatus" style="width: 120px">
                  <el-option v-for="item in ['全部', '已匹配', '未匹配']" :key="item" :label="`状态：${item}`" :value="item" />
                </el-select>
                <el-select v-model="matchSource" style="width: 145px">
                  <el-option v-for="item in ['全部', '规则匹配', '人工选择', '人工新增']" :key="item" :label="`来源：${item}`" :value="item" />
                </el-select>
                <span class="result-count">共 {{ filteredRows.length }} 项，未匹配 {{ unmatchedCount }} 项</span>
              </div>
              <div>
                <el-button :icon="CirclePlus" @click="addRow">新增行</el-button>
                <el-button type="primary" plain :icon="Search" :loading="matching" @click="autoMatch">
                  自动匹配
                </el-button>
              </div>
            </div>

            <el-table
              ref="tableRef"
              :data="filteredRows"
              height="calc(100vh - 430px)"
              min-height="360"
              border
              stripe
              row-key="id"
              class="result-table"
            >
              <el-table-column prop="ocrName" label="识别到的项目" width="145" fixed />
              <el-table-column label="对应系统检验项目" width="205">
                <template #default="{ row }">
                  <el-select
                    :model-value="row.systemItem"
                    filterable
                    clearable
                    placeholder="请选择"
                    @change="handleSystemItemChange(row, $event)"
                  >
                    <el-option v-for="item in systemItems" :key="item" :label="item" :value="item" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="结果" width="88">
                <template #default="{ row }"><el-input v-model="row.result" /></template>
              </el-table-column>
              <el-table-column label="单位" width="100">
                <template #default="{ row }"><el-input v-model="row.unit" /></template>
              </el-table-column>
              <el-table-column label="异常" width="62" align="center">
                <template #default="{ row }">
                  <strong :class="{ abnormal: row.abnormal }">{{ row.abnormal || '-' }}</strong>
                </template>
              </el-table-column>
              <el-table-column label="参考值" width="122">
                <template #default="{ row }"><el-input v-model="row.reference" /></template>
              </el-table-column>
              <el-table-column label="匹配状态" width="86" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.status === '已匹配' ? 'success' : 'warning'" size="small">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="匹配来源" width="90" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.source" :type="row.source === '规则匹配' ? 'primary' : 'info'" effect="plain" size="small">
                    {{ row.source }}
                  </el-tag>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="72" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="row.manual" type="danger" link @click="removeRow(row)">删除</el-button>
                  <span v-else class="disabled-action">--</span>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>
