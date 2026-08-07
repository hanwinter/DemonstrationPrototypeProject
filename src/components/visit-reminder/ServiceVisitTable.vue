<script setup>
import { computed, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
  overdueRows: { type: Array, default: () => [] },
  overdueStages: { type: Array, default: () => [] },
})
const emit = defineEmits(['open-detail'])
const stages = [
  { key: '上户5-7天', label: '上户5-7天', headerLabel: '上户\n5-7天' },
  { key: '下户3天', label: '下户3天', headerLabel: '下户\n3天' },
]
const advisorFilter = ref('全部')
const overdueAdvisorFilter = ref('全部')
const overdueStageFilterKeys = ref(stages.map((stage) => stage.label))
const showAllAdvisors = ref(false)
const showAllOverdueAdvisors = ref(false)
const sortStage = ref('')
const sortOrder = ref('')

const advisorOptions = computed(() => ['全部', ...new Set(props.rows.map((row) => row.consultantName).filter(Boolean))])
const overdueAdvisorOptions = computed(() => ['全部', ...new Set(props.overdueRows.map((row) => row.consultantName).filter(Boolean))])
const allOverdueStages = computed(() => stages.map((stage) => ({
  stage: stage.label,
  count: props.overdueStages.find((row) => row.stage === stage.label)?.count || 0,
})))
const overdueStageOptions = computed(() => allOverdueStages.value.map((row) => row.stage))
const visitTableWidth = computed(() => (88 + stages.length * 150) + 'px')
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
const filteredOverdueRows = computed(() => overdueAdvisorFilter.value === '全部' ? props.overdueRows : props.overdueRows.filter((row) => row.consultantName === overdueAdvisorFilter.value))
const displayedOverdueRows = computed(() => showAllOverdueAdvisors.value ? filteredOverdueRows.value : filteredOverdueRows.value.slice(0, 9))
const filteredOverdueStages = computed(() => allOverdueStages.value.filter((row) => overdueStageFilterKeys.value.includes(row.stage)))
const filteredOverdueTotal = computed(() => {
  if (overdueAdvisorFilter.value !== '全部') return filteredOverdueRows.value.reduce((sum, row) => sum + row.count, 0)
  return filteredOverdueStages.value.reduce((sum, row) => sum + row.count, 0)
})

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
</script>

<template>
  <section class="visit-card task-card">
    <div class="section-head"><h2>服务回访提醒</h2><el-tooltip content="根据订单服务日期生成服务阶段回访任务。" placement="top"><button class="hint-btn" type="button" aria-label="服务回访说明"><el-icon><InfoFilled /></el-icon></button></el-tooltip></div>
    <div class="filter-row"><div class="filter-left"><label><span>顾问筛选</span><el-select v-model="advisorFilter" filterable size="small" class="tool-select"><el-option v-for="item in advisorOptions" :key="item" :label="item" :value="item" /></el-select></label><span class="advisor-total">顾问总数：{{ advisorTotal }}人</span></div></div>
    <div class="visit-table-scroll">
      <el-table :data="displayedRows" border :style="{ width: visitTableWidth, minWidth: visitTableWidth }" class="visit-table excel-table" :class="{ 'is-expanded': showAllAdvisors }" :header-cell-class-name="visitHeaderCellClassName" @header-click="handleVisitHeaderClick">
        <el-table-column prop="consultantName" label="负责顾问" fixed width="88" align="center" header-align="center" class-name="advisor-column" header-class-name="advisor-header" />
        <el-table-column align="center" header-align="center">
          <template #header><span class="group-header">待回访客户数量<el-tooltip content="服务回访阶段根据订单上户、下户服务日期生成。" placement="top"><button class="hint-btn table-hint" type="button" aria-label="服务阶段生成规则"><el-icon><InfoFilled /></el-icon></button></el-tooltip></span></template>
          <el-table-column v-for="stage in stages" :key="stage.key" :prop="stage.key" :label="stage.headerLabel" width="150" align="center" header-align="center">
            <template #default="{ row }"><button class="number-link" type="button" @click="emit('open-detail', { mode: 'normal', visitType: '服务回访', stage: stage.key, consultantName: row.consultantName })">{{ row.counts[stage.key] || 0 }}</button></template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div v-if="filteredRows.length > 5" class="table-expand-row"><button class="expand-btn" type="button" @click="showAllAdvisors = !showAllAdvisors">{{ showAllAdvisors ? '收起' : '查看全部' }}</button></div>
    </div>
  </section>

  <section class="visit-card risk-card">
    <div class="sub-head overdue-head"><h3>超期分析</h3><button class="overdue-summary" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '服务回访', consultantName: overdueAdvisorFilter === '全部' ? '' : overdueAdvisorFilter, stage: overdueStageFilterKeys.length === overdueStageOptions.length ? '' : overdueStageFilterKeys.join(',') })"><span>超期未回访客户：</span><strong>{{ filteredOverdueTotal }}</strong><em>人</em></button></div>
    <div class="overdue-tables">
      <div class="mini-table"><div class="mini-head"><span class="dimension-label">按顾问维度统计</span><label><span>顾问</span><el-select v-model="overdueAdvisorFilter" filterable size="small" class="tool-select"><el-option v-for="item in overdueAdvisorOptions" :key="item" :label="item" :value="item" /></el-select></label></div><el-table :data="displayedOverdueRows" border><el-table-column prop="consultantName" label="负责顾问" min-width="120" /><el-table-column label="超期未回访客户" min-width="140"><template #default="{ row }"><button class="number-link danger" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '服务回访', consultantName: row.consultantName, stage: overdueStageFilterKeys.length === overdueStageOptions.length ? '' : overdueStageFilterKeys.join(',') })">{{ row.count }}</button></template></el-table-column></el-table><div v-if="filteredOverdueRows.length > 9" class="mini-expand-row"><button class="expand-btn" type="button" @click="showAllOverdueAdvisors = !showAllOverdueAdvisors">{{ showAllOverdueAdvisors ? '收起' : '查看全部' }}</button></div></div>
      <div class="mini-table"><div class="mini-head"><span class="dimension-label">按阶段维度统计</span><label><span>阶段</span><el-select v-model="overdueStageFilterKeys" multiple collapse-tags collapse-tags-tooltip size="small" class="stage-select"><el-option v-for="item in overdueStageOptions" :key="item" :label="item" :value="item" /></el-select></label></div><el-table :data="filteredOverdueStages" border :height="null"><el-table-column prop="stage" label="阶段" min-width="140" /><el-table-column label="超期未回访客户" min-width="140"><template #default="{ row }"><button class="number-link danger" type="button" @click="emit('open-detail', { mode: 'overdue', visitType: '服务回访', stage: row.stage, consultantName: overdueAdvisorFilter === '全部' ? '' : overdueAdvisorFilter })">{{ row.count }}</button></template></el-table-column></el-table></div>
    </div>
  </section>
</template>

<style scoped>
.visit-card{margin-bottom:22px;padding:18px;border:0;border-radius:8px;background:#fff;box-shadow:0 0 10px rgba(15,23,42,.08)}.section-head{display:flex;align-items:center;gap:8px;margin-bottom:16px}.section-head h2{margin:0;color:#1f2937;font-size:17px}.hint-btn{width:24px;height:24px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:#98a2b3;cursor:pointer;font-size:16px}.filter-row{margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}.filter-left{display:flex;align-items:center;gap:30px}.filter-row label,.mini-head label{display:flex;align-items:center;gap:8px;color:#374151;font-size:13px}.tool-select{width:120px}.stage-select{width:168px}.advisor-total{color:#667085;font-size:13px}.sub-head{margin:0 0 16px;display:flex;align-items:center;gap:8px}.overdue-head{align-items:center;gap:30px}.sub-head h3{margin:0;color:#1f2937;font-size:15px}.visit-table-scroll{max-width:100%;width:fit-content;margin-bottom:10px;overflow-x:auto;overflow-y:hidden}.visit-table-scroll::-webkit-scrollbar{height:6px}.visit-table-scroll::-webkit-scrollbar-thumb{background:#cfd6e1;border-radius:999px}.visit-table-scroll::-webkit-scrollbar-track{background:transparent}.visit-table{width:auto;margin-bottom:0}.visit-table :deep(th.el-table__cell),.mini-table :deep(th.el-table__cell){background:#f9fafb;color:#1f2937;font-weight:700}.visit-table :deep(.el-table__cell),.mini-table :deep(.el-table__cell){font-size:13px}.excel-table.is-expanded :deep(.el-table__inner-wrapper),.excel-table.is-expanded :deep(.el-table__body-wrapper),.excel-table.is-expanded :deep(.el-scrollbar),.excel-table.is-expanded :deep(.el-scrollbar__wrap),.excel-table.is-expanded :deep(.el-scrollbar__view){height:auto!important;max-height:none!important}.excel-table.is-expanded :deep(.el-table__body-wrapper),.excel-table.is-expanded :deep(.el-scrollbar__wrap){overflow:visible!important}.excel-table :deep(.el-table__header .is-group th.el-table__cell){height:30px;background:#f8fafc;text-align:center}.excel-table :deep(.el-table__header .is-group th.el-table__cell .cell){display:flex;min-height:28px;align-items:center;justify-content:center;padding-bottom:0;color:#1f2937;font-size:14px;font-weight:700}.excel-table :deep(.el-table__header tr:nth-child(2) th.el-table__cell){height:48px;background:#fbfcfe;color:#667085;font-size:12px;font-weight:600;text-align:center}.excel-table :deep(.el-table__header tr:nth-child(2) th.el-table__cell .cell){display:flex;min-height:44px;align-items:center;justify-content:center;padding-top:0}.excel-table :deep(.el-table__header .cell){line-height:1.35}.excel-table :deep(.advisor-column),.excel-table :deep(.advisor-header .cell){text-align:center}.group-header{display:inline-flex;align-items:center;justify-content:center;gap:6px}.table-hint{width:18px;height:18px;color:#98a2b3;font-size:14px}.number-link{padding:0;border:0;background:transparent;color:#2563eb;font-weight:700;cursor:pointer}.number-link:hover,.expand-btn:hover{text-decoration:underline}.number-link.danger{color:#d92d20}.risk-card{margin-bottom:22px}.overdue-summary{height:28px;margin:0;padding:0;display:inline-flex;align-items:center;gap:4px;border:0;background:transparent;color:#667085;box-shadow:none;cursor:pointer}.overdue-summary span{font-size:13px}.overdue-summary strong{color:#d92d20;font-size:20px;line-height:1}.overdue-summary em{font-style:normal;color:#d92d20;font-size:13px}.expand-btn{height:auto;padding:0;border:0;background:transparent;color:#2563eb;font-size:13px;font-weight:600;cursor:pointer}.overdue-tables{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:14px}.mini-table{min-width:0}.mini-head{margin-bottom:16px;display:flex;align-items:center;justify-content:flex-start;gap:30px}.dimension-label{color:#1f2937;font-size:14px;font-weight:700}.mini-expand-row,.table-expand-row{margin-top:8px;text-align:center}.excel-table :deep(.stage-sort-header){cursor:pointer}.excel-table :deep(.stage-sort-header .cell){position:relative;padding-right:22px;white-space:pre-line;line-height:1.25}.excel-table :deep(.stage-sort-header .cell::after){content:'↕';position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#98a2b3;font-size:12px;opacity:.55}.excel-table :deep(.stage-sort-header:hover .cell::after),.excel-table :deep(.stage-sort-header.is-desc .cell::after),.excel-table :deep(.stage-sort-header.is-asc .cell::after){opacity:1}.excel-table :deep(.stage-sort-header.is-desc .cell::after){content:'↓';color:#2563eb}.excel-table :deep(.stage-sort-header.is-asc .cell::after){content:'↑';color:#2563eb}@media(max-width:1000px){.overdue-tables{grid-template-columns:1fr}}
</style>




