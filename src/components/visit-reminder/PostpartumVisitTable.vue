<script setup>
import { computed, ref } from 'vue'
import { InfoFilled, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  overdueRows: { type: Array, default: () => [] },
  overdueStages: { type: Array, default: () => [] },
  overdueTotal: { type: Number, default: 0 },
})
const emit = defineEmits(['open-detail'])
const stages = [
  { key: '15-30天', label: '产后15-30天', headerLabel: '产后\n15-30天' },
  { key: '30-45天', label: '产后30-45天', headerLabel: '产后\n30-45天' },
  { key: '45-60天', label: '产后45-60天', headerLabel: '产后\n45-60天' },
  { key: '60-75天', label: '产后60-75天', headerLabel: '产后\n60-75天' },
  { key: '75-90天', label: '产后75-90天', headerLabel: '产后\n75-90天' },
  { key: '90-105天', label: '产后90-105天', headerLabel: '产后\n90-105天' },
  { key: '105-120天', label: '产后105-120天', headerLabel: '产后\n105-120天' },
  { key: '120-135天', label: '产后120-135天', headerLabel: '产后\n120-135天' },
  { key: '135-150天', label: '产后135-150天', headerLabel: '产后\n135-150天' },
  { key: '150-165天', label: '产后150-165天', headerLabel: '产后\n150-165天' },
  { key: '165-180天', label: '产后165-180天', headerLabel: '产后\n165-180天' },
]
const advisorFilter = ref('全部')
const overdueAdvisorFilter = ref('全部')
const overdueStageFilterKeys = ref(stages.slice(0, 9).map((stage) => stage.label))
const showAllAdvisors = ref(false)
const showAllOverdueAdvisors = ref(false)
const defaultVisibleStageKeys = stages.slice(0, 8).map((stage) => stage.key)
const visibleStageKeys = ref([...defaultVisibleStageKeys])
const draftVisibleStageKeys = ref([...defaultVisibleStageKeys])
const settingsVisible = ref(false)
const sortStage = ref('')
const sortOrder = ref('')
const advisorOptions = computed(() => ['全部', ...new Set(props.rows.map((row) => row.consultantName).filter(Boolean))])
const overdueAdvisorOptions = computed(() => ['全部', ...new Set(props.overdueRows.map((row) => row.consultantName).filter(Boolean))])
const allOverdueStages = computed(() => stages.map((stage) => ({
  stage: stage.label,
  count: props.overdueStages.find((row) => row.stage === stage.label)?.count || 0,
})))
const overdueStageOptions = computed(() => allOverdueStages.value.map((row) => row.stage))
const visibleStages = computed(() => stages.filter((stage) => visibleStageKeys.value.includes(stage.key)))
const visitTableMinWidth = computed(() => (88 + visibleStages.value.length * 108) + 'px')
const filteredRows = computed(() => advisorFilter.value === '全部' ? props.rows : props.rows.filter((row) => row.consultantName === advisorFilter.value))
const sortedRows = computed(() => {
  if (!sortStage.value || !sortOrder.value) return filteredRows.value
  return filteredRows.value
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const leftCount = left.row.counts[sortStage.value] || 0
      const rightCount = right.row.counts[sortStage.value] || 0
      if (leftCount === rightCount) return left.index - right.index
      return sortOrder.value === 'desc' ? rightCount - leftCount : leftCount - rightCount
    })
    .map((item) => item.row)
})
const displayedRows = computed(() => showAllAdvisors.value ? sortedRows.value : sortedRows.value.slice(0, 5))
const advisorTotal = computed(() => filteredRows.value.length)
const toggleStageSort = (stageKey) => {
  if (sortStage.value !== stageKey) {
    sortStage.value = stageKey
    sortOrder.value = 'desc'
    return
  }
  if (sortOrder.value === 'desc') {
    sortOrder.value = 'asc'
    return
  }
  sortStage.value = ''
  sortOrder.value = ''
}
const handleVisitHeaderClick = (column) => {
  if (stages.some((stage) => stage.key === column.property)) toggleStageSort(column.property)
}
const visitHeaderCellClassName = ({ column }) => {
  if (!stages.some((stage) => stage.key === column.property)) return ''
  if (sortStage.value !== column.property || !sortOrder.value) return 'stage-sort-header'
  return `stage-sort-header is-${sortOrder.value}`
}
const openStageSettings = () => {
  draftVisibleStageKeys.value = [...visibleStageKeys.value]
  settingsVisible.value = true
}
const restoreDefaultStages = () => {
  draftVisibleStageKeys.value = [...defaultVisibleStageKeys]
}
const saveStageSettings = () => {
  if (!draftVisibleStageKeys.value.length) {
    ElMessage.warning('至少选择一个回访阶段')
    return
  }
  visibleStageKeys.value = [...draftVisibleStageKeys.value]
  if (sortStage.value && !visibleStageKeys.value.includes(sortStage.value)) {
    sortStage.value = ''
    sortOrder.value = ''
  }
  settingsVisible.value = false
}
const filteredOverdueRows = computed(() => overdueAdvisorFilter.value === '全部' ? props.overdueRows : props.overdueRows.filter((row) => row.consultantName === overdueAdvisorFilter.value))
const displayedOverdueRows = computed(() => showAllOverdueAdvisors.value ? filteredOverdueRows.value : filteredOverdueRows.value.slice(0, 9))
const filteredOverdueStages = computed(() => allOverdueStages.value.filter((row) => overdueStageFilterKeys.value.includes(row.stage)))
const filteredOverdueTotal = computed(() => {
  if (overdueAdvisorFilter.value !== '全部') return filteredOverdueRows.value.reduce((sum, row) => sum + row.count, 0)
  return filteredOverdueStages.value.reduce((sum, row) => sum + row.count, 0)
})</script>

<template>
  <section class="visit-card postpartum-analysis-card">
    <div class="analysis-head">
      <div class="analysis-title"><h2>产后回访分析</h2><el-tooltip content="根据客户生产日期计算当前产后阶段，展示当前需要执行的产后回访任务。" placement="top"><button class="hint-btn" type="button" aria-label="产后回访分析说明"><el-icon><InfoFilled /></el-icon></button></el-tooltip></div>
    </div>

    <section class="analysis-section">
      <div class="submodule-head"><h3>待回访任务</h3></div>
      <div class="task-toolbar">
        <label><span>顾问筛选</span><el-select v-model="advisorFilter" filterable size="small" class="tool-select"><el-option v-for="item in advisorOptions" :key="item" :label="item" :value="item" /></el-select></label>
        <div class="head-tools"><span class="advisor-total">顾问总数：<strong>{{ advisorTotal }}</strong><em>人</em></span><button class="config-link" type="button" aria-label="回访阶段展示设置" title="回访阶段展示设置" @click="openStageSettings"><el-icon><Setting /></el-icon></button></div>
      </div>
      <div v-if="!showAllAdvisors" class="visit-table-scroll">
        <el-table :data="displayedRows" border :style="{ width: '100%', minWidth: visitTableMinWidth }" class="visit-table excel-table" :header-cell-class-name="visitHeaderCellClassName" @header-click="handleVisitHeaderClick">
          <el-table-column prop="consultantName" label="负责顾问" fixed width="88" align="center" header-align="center" class-name="advisor-column" header-class-name="advisor-header" />
          <el-table-column align="center" header-align="center">
            <template #header><span class="group-header">待回访产妇数量<el-tooltip content="产后阶段按照左闭右开规则计算：15≤产后天数＜30，30≤产后天数＜45，依次类推。" placement="top"><button class="hint-btn table-hint" type="button" aria-label="产后阶段计算规则"><el-icon><InfoFilled /></el-icon></button></el-tooltip></span></template>
            <el-table-column v-for="stage in visibleStages" :key="stage.key" :prop="stage.key" :label="stage.headerLabel" width="108" align="center" header-align="center">
              <template #default="{ row }"><button class="number-link" type="button" @click="emit('open-detail', { mode: 'normal', visitType: '产后回访', stage: stage.key, consultantName: row.consultantName })">{{ row.counts[stage.key] || 0 }}</button></template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="visit-table-scroll">
        <el-table :data="displayedRows" border :style="{ width: '100%', minWidth: visitTableMinWidth }" class="visit-table excel-table is-expanded" :header-cell-class-name="visitHeaderCellClassName" @header-click="handleVisitHeaderClick">
          <el-table-column prop="consultantName" label="负责顾问" fixed width="88" align="center" header-align="center" class-name="advisor-column" header-class-name="advisor-header" />
          <el-table-column align="center" header-align="center">
            <template #header><span class="group-header">待回访产妇数量<el-tooltip content="产后阶段按照左闭右开规则计算：15≤产后天数＜30，30≤产后天数＜45，依次类推。" placement="top"><button class="hint-btn table-hint" type="button" aria-label="产后阶段计算规则"><el-icon><InfoFilled /></el-icon></button></el-tooltip></span></template>
            <el-table-column v-for="stage in visibleStages" :key="stage.key" :prop="stage.key" :label="stage.headerLabel" width="108" align="center" header-align="center">
              <template #default="{ row }"><button class="number-link" type="button" @click="emit('open-detail', { mode: 'normal', visitType: '产后回访', stage: stage.key, consultantName: row.consultantName })">{{ row.counts[stage.key] || 0 }}</button></template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="filteredRows.length > 5" class="table-expand-row"><button class="text-link" type="button" @click="showAllAdvisors = !showAllAdvisors">{{ showAllAdvisors ? '收起' : '查看全部' }}</button></div>
    </section>

    <section class="analysis-section risk-section">
      <div class="submodule-head overdue-head">
        <h3>超期分析（顾问、阶段维度）</h3>
        <div class="head-tools"><button class="overdue-summary" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '产后回访', consultantName: overdueAdvisorFilter === '全部' ? '' : overdueAdvisorFilter, stage: overdueStageFilterKeys.length === overdueStageOptions.length ? '' : overdueStageFilterKeys.join(',') })"><span>超期未回访产妇：</span><strong>{{ filteredOverdueTotal }}</strong><em>人</em></button></div>
      </div>
      <div class="overdue-tables">
        <div class="mini-table"><div class="dimension-head"><span>按顾问维度统计</span><label><span>顾问筛选</span><el-select v-model="overdueAdvisorFilter" filterable size="small" class="tool-select"><el-option v-for="item in overdueAdvisorOptions" :key="item" :label="item" :value="item" /></el-select></label></div><el-table :data="displayedOverdueRows" border><el-table-column prop="consultantName" label="负责顾问" min-width="120" /><el-table-column label="超期未回访产妇" min-width="140"><template #default="{ row }"><button class="number-link danger" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '产后回访', consultantName: row.consultantName, stage: overdueStageFilterKeys.length === overdueStageOptions.length ? '' : overdueStageFilterKeys.join(',') })">{{ row.count }}</button></template></el-table-column></el-table><div v-if="filteredOverdueRows.length > 9" class="mini-expand-row"><button class="text-link" type="button" @click="showAllOverdueAdvisors = !showAllOverdueAdvisors">{{ showAllOverdueAdvisors ? '收起' : '查看全部' }}</button></div></div>
        <div class="mini-table"><div class="dimension-head"><span>按阶段维度统计</span><label><span>阶段筛选</span><el-select v-model="overdueStageFilterKeys" multiple collapse-tags collapse-tags-tooltip size="small" class="stage-select"><el-option v-for="item in overdueStageOptions" :key="item" :label="item" :value="item" /></el-select></label></div><el-table :data="filteredOverdueStages" border :height="null"><el-table-column prop="stage" label="阶段" min-width="140" /><el-table-column label="超期未回访产妇" min-width="140"><template #default="{ row }"><button class="number-link danger" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '产后回访', stage: row.stage, consultantName: overdueAdvisorFilter === '全部' ? '' : overdueAdvisorFilter })">{{ row.count }}</button></template></el-table-column></el-table></div>
      </div>
    </section>
  </section>

  <el-dialog v-model="settingsVisible" title="回访阶段展示设置" width="520px" class="stage-settings-dialog">
    <el-checkbox-group v-model="draftVisibleStageKeys" class="stage-options">
      <el-checkbox v-for="stage in stages" :key="stage.key" :label="stage.key">{{ stage.label }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <button class="dialog-link" type="button" @click="restoreDefaultStages">恢复默认</button>
      <el-button @click="settingsVisible = false">取消</el-button>
      <el-button type="primary" @click="saveStageSettings">保存</el-button>
    </template>
  </el-dialog>
</template>
<style scoped>
.visit-card{margin-bottom:22px;padding:18px;border:0;border-radius:8px;background:#fff;box-shadow:0 0 10px rgba(15,23,42,.08)}
.analysis-head{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:22px;padding:0;background:transparent}
.analysis-title{display:flex;align-items:center;gap:8px;min-width:0}.analysis-title h2{margin:0;color:#111827;font-size:19px;font-weight:800}
.head-tools{display:flex;align-items:center;justify-content:flex-end;gap:16px;flex:0 0 230px;min-width:230px;white-space:nowrap}
.hint-btn{width:24px;height:24px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:#98a2b3;cursor:pointer;font-size:16px}
.analysis-section{margin-top:30px}.analysis-section:first-of-type{margin-top:0}.risk-section{margin-top:30px;padding-top:24px;border-top:1px solid #edf1f5}
.submodule-head{margin:0 0 14px;padding:0 0 2px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:#fff}.submodule-head h3{margin:0;display:flex;align-items:center;color:#111827;font-size:15px;font-weight:700}.submodule-head h3::before{content:"";width:4px;height:28px;margin-right:10px;border-radius:999px;background:#5b8ff9}.submodule-head label,.dimension-head label,.task-toolbar label{display:flex;align-items:center;gap:8px;color:#374151;font-size:13px;white-space:nowrap}
.task-toolbar{margin:0 0 14px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.tool-select{width:120px}.stage-select{width:168px}.advisor-total{color:#475467;font-size:13px;font-weight:400;font-variant-numeric:tabular-nums}.advisor-total strong{color:#111827;font-size:16px;font-weight:800}.advisor-total em{font-style:normal;color:#111827;font-size:13px;font-weight:700}.config-link{width:24px;height:24px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:#98a2b3;font-size:16px;line-height:1;cursor:pointer}.config-link:hover{color:#667085}.text-link{height:auto;padding:0;border:0;background:transparent;color:#667085;font-size:12px;font-weight:500;cursor:pointer}.text-link:hover{text-decoration:underline}
.visit-table-scroll{max-width:100%;width:100%;margin-bottom:10px;overflow-x:auto;overflow-y:hidden}.visit-table-scroll::-webkit-scrollbar{height:6px}.visit-table-scroll::-webkit-scrollbar-thumb{background:#cfd6e1;border-radius:999px}.visit-table-scroll::-webkit-scrollbar-track{background:transparent}.visit-table{width:auto;margin-bottom:0}
.table-expand-row{margin-top:-2px;text-align:center}
.visit-table :deep(th.el-table__cell),.mini-table :deep(th.el-table__cell){background:#f2f5f9;color:#111827;font-weight:700}.visit-table :deep(.el-table__cell),.mini-table :deep(.el-table__cell){font-size:13px}.excel-table.is-expanded :deep(.el-table__inner-wrapper),.excel-table.is-expanded :deep(.el-table__body-wrapper),.excel-table.is-expanded :deep(.el-scrollbar),.excel-table.is-expanded :deep(.el-scrollbar__wrap),.excel-table.is-expanded :deep(.el-scrollbar__view){height:auto!important;max-height:none!important}.excel-table.is-expanded :deep(.el-table__body-wrapper),.excel-table.is-expanded :deep(.el-scrollbar__wrap){overflow:visible!important}
.excel-table :deep(.el-table__header .is-group th.el-table__cell){height:32px;background:#eef3f8;text-align:center}.excel-table :deep(.el-table__header .is-group th.el-table__cell .cell){display:flex;min-height:30px;align-items:center;justify-content:center;padding-bottom:0;color:#111827;font-size:14px;font-weight:800}.excel-table :deep(.el-table__header tr:nth-child(2) th.el-table__cell){height:48px;background:#f2f5f9;color:#475467;font-size:12px;font-weight:700;text-align:center}.excel-table :deep(.el-table__header tr:nth-child(2) th.el-table__cell .cell){display:flex;min-height:44px;align-items:center;justify-content:center;padding-top:0}.excel-table :deep(.el-table__header .cell){line-height:1.35}.excel-table :deep(.advisor-column),.excel-table :deep(.advisor-header .cell){text-align:center}
.group-header{display:inline-flex;align-items:center;justify-content:center;gap:6px}.table-hint{width:18px;height:18px;color:#98a2b3;font-size:14px}.number-link{padding:0;border:0;background:transparent;color:#2563eb;font-weight:700;cursor:pointer}.number-link:hover,.dialog-link:hover{text-decoration:underline}.number-link.danger{color:#d92d20}
.overdue-summary{height:28px;margin:0;padding:0;display:inline-flex;align-items:center;gap:4px;border:0;background:transparent;color:#667085;box-shadow:none;cursor:pointer;white-space:nowrap}.overdue-summary span{font-size:13px}.overdue-summary strong{color:#d92d20;font-size:21px;font-weight:800;line-height:1}.overdue-summary em{font-style:normal;color:#d92d20;font-size:14px;font-weight:700}
.dimension-head{min-width:0;margin:0 0 12px;padding:0 0 2px;display:flex;align-items:center;justify-content:space-between;gap:18px;background:#fff}.dimension-head>span{display:flex;align-items:center;color:#1f2937;font-size:13px;font-weight:600;white-space:nowrap}
.overdue-tables{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:14px}.mini-table{min-width:0}.mini-expand-row{margin-top:8px;text-align:center}.excel-table :deep(.stage-sort-header){cursor:pointer}.excel-table :deep(.stage-sort-header .cell){position:relative;padding-right:22px;white-space:pre-line;line-height:1.25}.excel-table :deep(.stage-sort-header .cell::after){content:'↕';position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#98a2b3;font-size:12px;opacity:.55}.excel-table :deep(.stage-sort-header:hover .cell::after),.excel-table :deep(.stage-sort-header.is-desc .cell::after),.excel-table :deep(.stage-sort-header.is-asc .cell::after){opacity:1}.excel-table :deep(.stage-sort-header.is-desc .cell::after){content:'↓';color:#2563eb}.excel-table :deep(.stage-sort-header.is-asc .cell::after){content:'↑';color:#2563eb}
.stage-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 18px}.stage-options :deep(.el-checkbox){margin-right:0}.dialog-link{margin-right:auto;padding:0;border:0;background:transparent;color:#2563eb;font-size:13px;cursor:pointer}.stage-settings-dialog :deep(.el-dialog__footer){display:flex;align-items:center;gap:10px}.stage-settings-dialog :deep(.el-dialog__footer .el-button){margin-left:10px}.stage-settings-dialog :deep(.el-dialog__footer .dialog-link + .el-button){margin-left:10px}
@media(max-width:1000px){.analysis-head,.submodule-head,.task-toolbar{align-items:flex-start;flex-direction:column}.head-tools{justify-content:flex-start;flex:0 0 auto;min-width:0}.overdue-tables{grid-template-columns:1fr}.dimension-head{justify-content:flex-start}}
</style>
