<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowDown, ArrowLeft, ArrowUp, Clock, Document, Printer, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'
import PartographArchivePrint from '../components/PartographArchivePrint.vue'
import PartographChart from '../components/PartographChart.vue'
import {
  abnormalRecords,
  cloneRecords,
  normalRecords,
  patientInfo,
} from '../mock/partographData'

const router = useRouter()
const scenario = ref('normal')
const records = ref(cloneRecords(normalRecords))
const delivered = ref(false)
const archiveVisible = ref(false)
const editingId = ref(null)
const recordsExpanded = ref(false)
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const startTime = new Date('2026-06-15T13:00:00')

const emptyForm = () => ({
  time: '2026-06-15 21:00',
  dilation: 10,
  station: 3,
  fetalHeart: 148,
  interval: 2,
  duration: 55,
  intensity: '强',
  amnioticFluid: '清',
  bloodPressure: '124/80',
  pulse: 92,
  temperature: 36.9,
  note: '',
})
const form = reactive(emptyForm())

function parseTime(value) {
  return new Date(value.replace(' ', 'T'))
}

function relativeHour(value) {
  return (parseTime(value) - startTime) / 3600000
}

const sortedRecords = computed(() =>
  [...records.value].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
)
const latestRecord = computed(() => sortedRecords.value.at(-1))
const visibleRecords = computed(() =>
  recordsExpanded.value ? sortedRecords.value : sortedRecords.value.slice(-3),
)

function resetForm(values = {}) {
  Object.assign(form, emptyForm(), values)
  editingId.value = null
}

function submitRecord() {
  if (delivered.value) return
  if (editingId.value) {
    const index = records.value.findIndex((item) => item.id === editingId.value)
    records.value[index] = { ...records.value[index], ...form }
    ElMessage.success('观察记录已更新，产程图已同步刷新')
  } else {
    records.value.push({ ...form, id: Date.now() })
    ElMessage.success('观察记录已新增，产程图已同步刷新')
  }
  resetForm()
}

function editRecord(record) {
  Object.assign(form, record)
  editingId.value = record.id
  window.scrollTo({ top: 100, behavior: 'smooth' })
}

async function removeRecord(record) {
  try {
    await ElMessageBox.confirm(`确认删除 ${record.time.slice(11)} 的观察记录？`, '删除记录', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    records.value = records.value.filter((item) => item.id !== record.id)
    ElMessage.success('记录已删除，页面数据已同步刷新')
  } catch {
    // User cancelled.
  }
}

function simulateNextHour() {
  if (delivered.value) return
  const latest = latestRecord.value
  const next = new Date(parseTime(latest.time).getTime() + 3600000)
  const pad = (value) => String(value).padStart(2, '0')
  records.value.push({
    ...latest,
    id: Date.now(),
    time: `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())} ${pad(next.getHours())}:${pad(next.getMinutes())}`,
    dilation: Math.min(10, latest.dilation + (scenario.value === 'normal' ? 1 : 0.5)),
    station: Math.min(5, latest.station + 1),
    fetalHeart: scenario.value === 'normal' ? 150 : Math.min(178, latest.fetalHeart + 3),
    duration: Math.min(60, latest.duration + 3),
    intensity: latest.duration >= 40 ? '强' : '中',
    note: '系统模拟下一小时观察记录',
  })
  ElMessage.success('已模拟追加下一小时记录')
}

function switchScenario() {
  scenario.value = scenario.value === 'normal' ? 'alternate' : 'normal'
  records.value = cloneRecords(scenario.value === 'normal' ? normalRecords : abnormalRecords)
  delivered.value = false
  resetForm()
  ElMessage.info('已切换演示数据')
}

async function finishDelivery() {
  try {
    await ElMessageBox.confirm('确认结束本次产程记录并生成归档数据？', '分娩结束', {
      type: 'success',
      confirmButtonText: '确认结束',
      cancelButtonText: '取消',
    })
    delivered.value = true
    ElMessage.success('本次产程记录已结束，可打印归档产程图')
  } catch {
    // User cancelled.
  }
}

function saveDraft() {
  ElMessage.success('草稿已保存（演示）')
}

function printArchive() {
  window.print()
}
</script>

<template>
  <div class="partograph-page">
    <header class="partograph-header">
      <div class="partograph-brand">
        <img :src="systemLogoUrl" alt="孕产妇保健管理系统" />
        <span>产房工作台</span>
      </div>
      <DemoPageNavigation />
      <div>操作员：张医生</div>
    </header>

    <main class="partograph-main">
      <section class="partograph-heading">
        <div class="heading-copy">
          <el-button text :icon="ArrowLeft" @click="router.push('/outpatient')">返回</el-button>
          <span class="heading-separator"></span>
          <h1>产程图</h1>
          <p>基于产程观察记录实时生成产程曲线</p>
        </div>
        <div class="heading-buttons">
          <el-button :icon="Refresh" @click="switchScenario">切换演示数据</el-button>
          <el-button type="primary" plain :icon="Printer" @click="archiveVisible = true">
            打印归档产程图
          </el-button>
        </div>
      </section>

      <section class="patient-strip">
        <div class="patient-strip-row">
          <strong>{{ patientInfo.name }}</strong>
          <span>{{ patientInfo.age }}岁</span>
          <span>{{ patientInfo.gestationalAge }}</span>
          <span>胎儿大小：<b>{{ patientInfo.fetalWeight }}</b></span>
          <span>胎位：<b>{{ patientInfo.fetalPosition }}</b></span>
        </div>
        <div class="patient-strip-row patient-times">
          <span>第一产程开始：<b>{{ patientInfo.admissionTime }}</b></span>
          <span>第二产程开始：<b>{{ patientInfo.secondStageTime }}</b></span>
          <span>破膜时间：<b>{{ patientInfo.ruptureTime }}</b></span>
        </div>
      </section>

      <section class="partograph-workspace">
        <section class="chart-panel panel-card">
          <div class="panel-title">
            <div><strong>产程图</strong><el-tag type="success" effect="plain" size="small">实时更新</el-tag></div>
          </div>
          <PartographChart :records="records" />
        </section>

        <aside class="entry-panel panel-card">
          <div class="panel-title">
            <div><el-icon><Document /></el-icon><strong>产程数据录入</strong></div>
            <el-tag v-if="editingId" type="warning">编辑记录</el-tag>
          </div>
          <el-alert v-if="delivered" title="本次产程已结束，录入区已锁定" type="success" :closable="false" show-icon />
          <el-form class="entry-form" label-position="top" :disabled="delivered">
            <el-form-item label="记录时间" class="full-field"><el-input v-model="form.time" /></el-form-item>
            <el-form-item label="宫口扩张"><el-input-number v-model="form.dilation" :min="0" :max="10" :step="0.5" /><span class="unit">cm</span></el-form-item>
            <el-form-item label="胎先露高低"><el-input-number v-model="form.station" :min="-5" :max="5" /><span class="unit">station</span></el-form-item>
            <el-form-item label="胎心率"><el-input-number v-model="form.fetalHeart" :min="80" :max="200" /><span class="unit">bpm</span></el-form-item>
            <el-form-item label="宫缩间隔"><el-input-number v-model="form.interval" :min="1" :max="10" /><span class="unit">min</span></el-form-item>
            <el-form-item label="宫缩持续"><el-input-number v-model="form.duration" :min="10" :max="90" /><span class="unit">sec</span></el-form-item>
            <el-form-item label="宫缩强度">
              <el-select v-model="form.intensity">
                <el-option v-for="item in ['弱', '中', '强']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="羊水情况">
              <el-select v-model="form.amnioticFluid">
                <el-option v-for="item in ['未破', '清', 'Ⅰ度', 'Ⅱ度', 'Ⅲ度', '血性']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="血压"><el-input v-model="form.bloodPressure" /></el-form-item>
            <el-form-item label="脉搏"><el-input-number v-model="form.pulse" :min="40" :max="180" /><span class="unit">次/分</span></el-form-item>
            <el-form-item label="体温"><el-input-number v-model="form.temperature" :min="34" :max="42" :step="0.1" :precision="1" /><span class="unit">℃</span></el-form-item>
            <el-form-item label="备注" class="full-field"><el-input v-model="form.note" type="textarea" :rows="2" /></el-form-item>
          </el-form>
          <div class="entry-actions">
            <el-button type="primary" :disabled="delivered" @click="submitRecord">{{ editingId ? '保存修改' : '新增记录' }}</el-button>
            <el-button :disabled="delivered" @click="saveDraft">保存草稿</el-button>
            <el-button type="primary" plain :disabled="delivered" :icon="Clock" @click="simulateNextHour">模拟下一小时</el-button>
            <el-button v-if="!delivered" type="danger" plain @click="finishDelivery">分娩结束</el-button>
            <el-button v-else type="success" :icon="Printer" @click="archiveVisible = true">生成归档产程图</el-button>
          </div>
        </aside>
      </section>

      <section class="records-panel panel-card">
        <div class="panel-title">
          <div><el-icon><Document /></el-icon><strong>产程观察记录</strong><span class="record-count">共 {{ records.length }} 条</span></div>
          <el-button
            text
            type="primary"
            :icon="recordsExpanded ? ArrowUp : ArrowDown"
            @click="recordsExpanded = !recordsExpanded"
          >
            {{ recordsExpanded ? '收起' : '展开全部' }}
          </el-button>
        </div>
        <el-table :data="visibleRecords" border stripe>
          <el-table-column prop="time" label="记录时间" min-width="145" />
          <el-table-column label="相对小时" width="80"><template #default="{ row }">{{ relativeHour(row.time) }}h</template></el-table-column>
          <el-table-column label="宫口扩张" width="86"><template #default="{ row }">{{ row.dilation }}cm</template></el-table-column>
          <el-table-column label="胎先露" width="75"><template #default="{ row }">{{ row.station > 0 ? '+' : '' }}{{ row.station }}</template></el-table-column>
          <el-table-column prop="fetalHeart" label="胎心率" width="75" />
          <el-table-column prop="interval" label="宫缩间隔" width="85" />
          <el-table-column prop="duration" label="宫缩持续" width="85" />
          <el-table-column prop="intensity" label="宫缩强度" width="85" />
          <el-table-column prop="amnioticFluid" label="羊水" width="70" />
          <el-table-column prop="bloodPressure" label="血压" width="85" />
          <el-table-column prop="pulse" label="脉搏" width="65" />
          <el-table-column prop="temperature" label="体温" width="65" />
          <el-table-column prop="note" label="备注" min-width="170" show-overflow-tooltip />
          <el-table-column label="操作" width="105" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :disabled="delivered" @click="editRecord(row)">编辑</el-button>
              <el-button link type="danger" :disabled="delivered" @click="removeRecord(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </main>

    <el-dialog v-model="archiveVisible" width="1120px" class="archive-preview-dialog" title="产程图归档预览">
      <div class="archive-preview-viewport">
        <PartographArchivePrint :patient="patientInfo" :records="records" />
      </div>
      <template #footer>
        <el-button @click="archiveVisible = false">关闭</el-button>
        <el-button type="primary" :icon="Printer" @click="printArchive">打印</el-button>
      </template>
    </el-dialog>

    <div class="archive-print-root" aria-hidden="true">
      <PartographArchivePrint :patient="patientInfo" :records="records" />
    </div>
  </div>
</template>

<style scoped>
.partograph-page { min-height: 100vh; color: #29394b; background: #edf3f7; font-size: 14px; }
.partograph-header { height: 50px; padding: 0 26px; display: flex; align-items: center; justify-content: space-between; color: #fff; background: #447afc; box-shadow: 0 1px 4px rgba(16, 61, 105, .25); }
.partograph-brand { display: flex; align-items: center; gap: 20px; }
.partograph-brand img { width: 255px; max-height: 36px; object-fit: contain; }
.partograph-main { min-width: 1500px; max-width: 1900px; margin: 0 auto; padding: 10px 16px 22px; }
.partograph-heading, .patient-strip, .panel-card { background: #fff; border: 1px solid #dbe5ec; box-shadow: 0 1px 3px rgba(27, 58, 79, .05); }
.partograph-heading { height: 54px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; }
.heading-copy { display: flex; align-items: center; }
.partograph-heading h1 { margin: 0 12px 0 0; color: #1d3850; font-size: 18px; }
.partograph-heading p { margin: 0; color: #7b8b99; }
.heading-separator { width: 1px; height: 18px; margin: 0 14px 0 5px; background: #d9e2e8; }
.heading-buttons { display: flex; gap: 8px; }
.patient-strip { height: 58px; margin-top: 8px; padding: 5px 18px; display: grid; align-content: center; gap: 5px; }
.patient-strip-row { display: flex; align-items: center; gap: 0; color: #687a89; white-space: nowrap; }
.patient-strip-row > * { display: inline-flex; align-items: center; }
.patient-strip-row > * + *::before { content: ""; width: 1px; height: 14px; margin: 0 14px; background: #d8e1e8; }
.patient-strip-row strong { color: #263d50; }
.patient-strip-row b { color: #334c60; font-weight: 600; }
.patient-times { color: #778793; font-size: 13px; }
.partograph-workspace { margin-top: 8px; display: grid; grid-template-columns: minmax(0, 3fr) minmax(360px, 1fr); gap: 10px; align-items: start; }
.panel-card { min-width: 0; }
.panel-title { height: 45px; padding: 0 13px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e9ee; }
.panel-title > div { display: flex; align-items: center; gap: 8px; }
.panel-title .el-icon { color: #447afc; font-size: 17px; }
.chart-panel { grid-column: 1; grid-row: 1; }
.entry-panel { grid-column: 2; grid-row: 1; padding-bottom: 12px; }
.entry-panel .el-alert { margin: 10px 12px 0; width: auto; }
.entry-form { padding: 10px 12px 2px; display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
.entry-form :deep(.el-form-item) { margin-bottom: 9px; }
.entry-form :deep(.el-form-item__label) { margin-bottom: 3px; color: #637485; font-size: 13px; line-height: 19px; }
.entry-form :deep(.el-input-number), .entry-form :deep(.el-select) { width: 100%; }
.entry-form :deep(.el-input-number .el-input__inner) { text-align: left; }
.full-field { grid-column: 1 / -1; }
.unit { position: absolute; right: 34px; color: #94a0aa; font-size: 12px; pointer-events: none; }
.entry-actions { padding: 0 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.entry-actions .el-button { width: 100%; margin: 0; }
.entry-actions .el-button:nth-last-child(1) { grid-column: 1 / -1; }
.records-panel { margin-top: 8px; padding-bottom: 10px; }
.record-count { color: #87949f; font-size: 12px; font-weight: 400; }
.records-panel :deep(.el-table) { width: calc(100% - 20px); margin: 10px; --el-table-header-bg-color: #edf5f8; --el-table-header-text-color: #466071; }
.records-panel :deep(.el-table__cell) { padding: 6px 0; }
.archive-preview-viewport { height: 74vh; overflow: auto; padding: 18px; background: #cfd3d7; }
.archive-preview-viewport :deep(.archive-form) { margin: 0 auto; transform-origin: top center; box-shadow: 0 2px 12px rgba(0, 0, 0, .24); }
.archive-print-root { position: fixed; z-index: -1; top: 0; left: -200vw; }
@media print {
  @page { size: A4 landscape; margin: 10mm 12mm; }
  .partograph-header, .partograph-main, :deep(.el-overlay) { display: none !important; }
  .archive-print-root { position: static; display: block; }
  .archive-print-root :deep(.archive-form) { width: 273mm; height: 190mm; margin: 0 auto; box-shadow: none; }
}
</style>
