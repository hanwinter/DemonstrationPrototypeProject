<script setup>
import { computed, reactive } from 'vue'
import { DocumentAdd, Refresh } from '@element-plus/icons-vue'
import { consentStatusMeta, consentStatusOptions } from '../../mock/consentDocuments'

const props = defineProps({
  documents: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'create',
  'edit',
  'preview',
  'qr',
  'doctor-sign',
  'archive',
  'print',
  'void',
  'refresh',
])

const selectableStatusOptions = consentStatusOptions.filter((item) => item.value)

const filters = reactive({
  statuses: [],
  dates: [],
  doctor: '',
})

const filteredDocuments = computed(() =>
  props.documents.filter((item) => {
    const statusMatched = !filters.statuses.length || filters.statuses.includes(item.status)
    const doctorMatched = !filters.doctor || item.createdDoctor.includes(filters.doctor)
    const dateMatched =
      !filters.dates?.length ||
      (item.createdAt.slice(0, 10) >= filters.dates[0] && item.createdAt.slice(0, 10) <= filters.dates[1])
    return statusMatched && doctorMatched && dateMatched
  }),
)

function hasPatientSignature(row) {
  return Boolean(row.patientSignature)
}

function hasDoctorSignature(row) {
  return Boolean(row.doctorSignature)
}

function canArchive(row) {
  return row.status === 'unarchived' && hasPatientSignature(row) && hasDoctorSignature(row)
}

function actionDisabled(row, action) {
  if (action === 'view') return false
  if (action === 'edit') {
    return row.status !== 'unarchived' || hasPatientSignature(row) || hasDoctorSignature(row)
  }
  if (action === 'patient-sign') return row.status !== 'unarchived' || hasPatientSignature(row)
  if (action === 'doctor-sign') return row.status !== 'unarchived' || hasDoctorSignature(row)
  if (action === 'archive') return !canArchive(row)
  if (action === 'print') return row.status !== 'archived'
  if (action === 'void') return row.status === 'voided'
  return true
}

function signerRoleLabel(row) {
  if (!row.signerRole) return '-'
  if (row.signerRole.includes('本人')) return '本人'
  if (row.signerRole.includes('家属')) return '家属'
  return row.signerRole
}

</script>

<template>
  <section class="consent-list">
    <div class="filter-panel">
      <el-form inline label-width="76px">
        <el-form-item label="状态">
          <el-checkbox-group v-model="filters.statuses" class="status-checkboxes">
            <el-checkbox v-for="item in selectableStatusOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filters.dates"
            class="date-range"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建医生">
          <el-input v-model="filters.doctor" class="filter-control" clearable placeholder="请输入医生姓名" />
        </el-form-item>
      </el-form>
    </div>

    <div class="list-heading">
      <h2>知情同意书</h2>
      <div class="list-actions">
        <el-button type="primary" :icon="DocumentAdd" @click="emit('create')">新建知情同意书</el-button>
        <el-button :icon="Refresh" @click="emit('refresh')">刷新</el-button>
      </div>
    </div>

    <el-table
      class="consent-table"
      :data="filteredDocuments"
      border
    >
      <el-table-column type="index" label="序号" width="62" />
      <el-table-column prop="documentName" label="文书名称" min-width="150" />
      <el-table-column prop="scene" label="告知场景" width="110" />
      <el-table-column prop="createdAt" label="创建时间" width="150" />
      <el-table-column prop="createdDoctor" label="创建医生" width="96" />
      <el-table-column label="签字身份" width="86">
        <template #default="{ row }">{{ signerRoleLabel(row) }}</template>
      </el-table-column>
      <el-table-column label="签字人" width="120">
        <template #default="{ row }">{{ row.signer || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="230">
        <template #default="{ row }">
          <div class="status-stack">
            <el-tag :type="consentStatusMeta[row.status].type" effect="plain">{{ consentStatusMeta[row.status].label }}</el-tag>
            <span>医生：<em :class="hasDoctorSignature(row) ? 'signed' : 'unsigned'">{{ hasDoctorSignature(row) ? '已签' : '未签' }}</em></span>
            <span>孕产妇：<em :class="hasPatientSignature(row) ? 'signed' : 'unsigned'">{{ hasPatientSignature(row) ? '已签' : '未签' }}</em></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="归档时间" width="150">
        <template #default="{ row }">{{ row.archivedAt || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="430" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button link type="primary" :disabled="actionDisabled(row, 'edit')" @click="emit('edit', row)">编辑</el-button>
            <el-button link type="primary" @click="emit('preview', row)">查看</el-button>
            <el-button link type="primary" :disabled="actionDisabled(row, 'doctor-sign')" @click="emit('doctor-sign', row)">医生签字</el-button>
            <el-button link type="warning" :disabled="actionDisabled(row, 'patient-sign')" @click="emit('qr', row)">患者签字</el-button>
            <el-button link type="success" :disabled="actionDisabled(row, 'archive')" @click="emit('archive', row)">归档</el-button>
            <el-button link type="primary" :disabled="actionDisabled(row, 'print')" @click="emit('print', row)">打印</el-button>
            <el-button link type="danger" :disabled="actionDisabled(row, 'void')" @click="emit('void', row)">作废</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<style scoped>
.consent-list {
  background: #fff;
  border: 1px solid var(--border-color);
}

.list-heading,
.list-actions,
.row-actions {
  display: flex;
  align-items: center;
}

.list-heading {
  height: 54px;
  padding: 0 14px;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.list-heading h2 {
  margin: 0;
  color: #25364a;
  font-size: 18px;
}

.list-actions {
  gap: 8px;
}

.filter-panel {
  padding: 12px 14px 2px;
  background: #f8fbff;
  border-bottom: 1px solid var(--border-color);
}

.filter-panel :deep(.el-form--inline .el-form-item),
.filter-panel :deep(.el-form-item__content) {
  align-items: center;
}

.filter-panel :deep(.el-form-item__label) {
  height: 32px;
  line-height: 32px;
}

.filter-control {
  width: 180px;
}

.status-checkboxes {
  display: flex;
  height: 32px;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
}

.status-checkboxes :deep(.el-checkbox) {
  margin-right: 0;
}

.date-range {
  width: 270px;
}

.consent-table {
  font-size: 14px;
  --el-table-header-bg-color: #edf4fa;
  --el-table-header-text-color: #41556b;
}

.row-actions {
  flex-wrap: nowrap;
  gap: 0 6px;
  white-space: nowrap;
}

.row-actions :deep(.el-button.is-disabled),
.row-actions :deep(.el-button.is-disabled:hover),
.row-actions :deep(.el-button.is-disabled:focus) {
  color: #a8afb9;
}

.status-stack {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #566579;
  font-size: 12px;
  white-space: nowrap;
}

.status-stack em {
  font-style: normal;
  font-weight: 600;
}

.status-stack .signed {
  color: #159947;
}

.status-stack .unsigned {
  color: #d93026;
}
</style>














