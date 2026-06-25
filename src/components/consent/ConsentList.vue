<script setup>
import { computed, reactive, ref } from 'vue'
import { DocumentAdd, Printer, Refresh } from '@element-plus/icons-vue'
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
  'patient-sign',
  'doctor-sign',
  'archive',
  'print',
  'void',
  'print-selected',
  'refresh',
])

const filters = reactive({
  status: '',
  dates: [],
  doctor: '',
})

const selectedRows = ref([])

const filteredDocuments = computed(() =>
  props.documents.filter((item) => {
    const statusMatched = !filters.status || item.status === filters.status
    const doctorMatched = !filters.doctor || item.createdDoctor.includes(filters.doctor)
    const dateMatched =
      !filters.dates?.length ||
      (item.createdAt.slice(0, 10) >= filters.dates[0] && item.createdAt.slice(0, 10) <= filters.dates[1])
    return statusMatched && doctorMatched && dateMatched
  }),
)

function actionVisible(status, action) {
  const rules = {
    draft: ['edit', 'preview', 'qr', 'void'],
    pendingPatient: ['preview', 'qr', 'patient-sign', 'void'],
    pendingDoctor: ['preview', 'doctor-sign', 'archive', 'void'],
    archived: ['preview', 'print', 'void'],
    voided: ['preview'],
  }
  return rules[status]?.includes(action)
}

function printSelected() {
  emit('print-selected', selectedRows.value)
}
</script>

<template>
  <section class="consent-list">
    <div class="list-heading">
      <h2>知情同意书</h2>
      <div class="list-actions">
        <el-button type="primary" :icon="DocumentAdd" @click="emit('create')">新建知情同意书</el-button>
        <el-button :icon="Printer" @click="printSelected">打印选中</el-button>
        <el-button :icon="Refresh" @click="emit('refresh')">刷新</el-button>
      </div>
    </div>

    <div class="filter-panel">
      <el-form inline label-width="76px">
        <el-form-item label="文书状态">
          <el-select v-model="filters.status" class="filter-control">
            <el-option
              v-for="item in consentStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

    <el-table
      class="consent-table"
      :data="filteredDocuments"
      border
      @selection-change="selectedRows = $event"
    >
      <el-table-column type="selection" width="44" />
      <el-table-column type="index" label="序号" width="62" />
      <el-table-column prop="documentName" label="文书名称" min-width="150" />
      <el-table-column prop="scene" label="告知场景" width="110" />
      <el-table-column prop="createdAt" label="创建时间" width="150" />
      <el-table-column prop="createdDoctor" label="创建医生" width="96" />
      <el-table-column label="签字人" width="120">
        <template #default="{ row }">{{ row.signer || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="consentStatusMeta[row.status].type">{{ consentStatusMeta[row.status].label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="归档时间" width="150">
        <template #default="{ row }">{{ row.archivedAt || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="330" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button v-if="actionVisible(row.status, 'edit')" link type="primary" @click="emit('edit', row)">编辑</el-button>
            <el-button v-if="actionVisible(row.status, 'preview')" link type="primary" @click="emit('preview', row)">
              {{ row.status === 'archived' || row.status === 'voided' ? '查看' : '预览' }}
            </el-button>
            <el-button v-if="actionVisible(row.status, 'qr')" link type="warning" @click="emit('qr', row)">
              {{ row.status === 'pendingPatient' ? '二维码' : '生成二维码' }}
            </el-button>
            <el-button v-if="actionVisible(row.status, 'patient-sign')" link type="warning" @click="emit('patient-sign', row)">
              模拟孕妇签字
            </el-button>
            <el-button v-if="actionVisible(row.status, 'doctor-sign')" link type="primary" @click="emit('doctor-sign', row)">
              医生签字
            </el-button>
            <el-button v-if="actionVisible(row.status, 'archive')" link type="success" @click="emit('archive', row)">归档</el-button>
            <el-button v-if="actionVisible(row.status, 'print')" link type="primary" @click="emit('print', row)">打印</el-button>
            <el-button v-if="actionVisible(row.status, 'void')" link type="danger" @click="emit('void', row)">作废</el-button>
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

.filter-control {
  width: 180px;
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
  flex-wrap: wrap;
  gap: 2px 6px;
}
</style>
