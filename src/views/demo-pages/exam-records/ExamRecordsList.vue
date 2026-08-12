<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CompactSearchBar from '../../../components/demo-common/CompactSearchBar.vue'
import LegacyPagination from '../../../components/demo-common/LegacyPagination.vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'
import { examRecords, recordStatuses, screenTypes } from './mock'

const router = useRouter()
const columns = [
  { key: 'index', label: '序号', width: 60, fixed: true },
  { key: 'patientName', label: '患者姓名', width: 100, fixed: true },
  { key: 'certNo', label: '证件号', width: 200 },
  { key: 'gender', label: '性别', width: 60 },
  { key: 'age', label: '年龄', width: 80 },
  { key: 'phone', label: '联系电话', width: 120 },
  { key: 'visitDate', label: '就诊日期', width: 110 },
  { key: 'screenType', label: '筛查类型', width: 110 },
  { key: 'status', label: '状态', width: 90 },
  { key: 'reportStatus', label: '报告', width: 90 },
  { key: 'updateTime', label: '更新时间', width: 160 },
  { key: 'actions', label: '操作', width: 120, type: 'actions' },
]
const emptyQuery = () => ({ patientName: '', certNo: '', phone: '', screenType: '', status: '', startDate: '', endDate: '' })
const query = reactive(emptyQuery())
const appliedQuery = ref(emptyQuery())
const rows = ref([...examRecords])
const page = ref(1)
const pageSize = ref(20)
const deleteVisible = ref(false)
const activeRecord = ref(null)
const options = { screenTypes, statuses: recordStatuses }

const filteredRows = computed(() => rows.value.filter((row) => {
  const q = appliedQuery.value
  return (!q.patientName || row.patientName.includes(q.patientName))
    && (!q.certNo || row.certNo.includes(q.certNo))
    && (!q.phone || row.phone.includes(q.phone))
    && (!q.screenType || row.screenType === q.screenType)
    && (!q.status || row.status === q.status)
    && (!q.startDate || row.visitDate >= q.startDate)
    && (!q.endDate || row.visitDate <= q.endDate)
}))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const pagedRows = computed(() => filteredRows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const startRecord = computed(() => filteredRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0)
const endRecord = computed(() => Math.min(page.value * pageSize.value, filteredRows.value.length))

function search() {
  appliedQuery.value = { ...query }
  page.value = 1
}

function reset() {
  Object.assign(query, emptyQuery())
  search()
}

function openDelete(row) {
  activeRecord.value = row
  deleteVisible.value = true
}

function confirmDelete() {
  rows.value = rows.value.filter((row) => row.id !== activeRecord.value.id)
  rows.value.forEach((row, index) => { row.index = index + 1 })
  deleteVisible.value = false
}
</script>

<template>
  <div class="exam-records-page">
    <div class="breadcrumb">单页面演示 &gt; 体检记录</div>
    <CompactSearchBar type="exam-records" :model="query" :options="options" @search="search" @reset="reset" />
    <LegacyTable :rows="pagedRows" :columns="columns">
      <template #status="{ value }"><span class="soft-tag">{{ value }}</span></template>
      <template #reportStatus="{ value }"><span class="soft-tag">{{ value }}</span></template>
      <template #actions="{ row }">
        <button class="link-action" type="button" @click="router.push(`/demo-pages/exam-records/detail/${row.id}`)">详情</button>
        <button class="link-action danger" type="button" @click="openDelete(row)">删除</button>
      </template>
    </LegacyTable>
    <LegacyPagination
      :page-size="pageSize"
      :page="page"
      :total-pages="totalPages"
      :total="filteredRows.length"
      :start="startRecord"
      :end="endRecord"
      @update:page-size="(value) => { pageSize = value; page = 1 }"
      @first="page = 1"
      @prev="page = Math.max(1, page - 1)"
      @next="page = Math.min(totalPages, page + 1)"
      @last="page = totalPages"
      @refresh="search"
    />
    <div v-if="deleteVisible" class="modal-mask">
      <section class="legacy-modal delete-modal">
        <header>删除确认</header>
        <p>确定删除该体检记录吗？</p>
        <p class="delete-tip">删除后，该次体检记录及相关结果将无法恢复。</p>
        <footer><button class="modal-danger" type="button" @click="confirmDelete">确定</button><button type="button" @click="deleteVisible = false">取消</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.exam-records-page{height:100%;min-width:0;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;border-bottom:0;background:#fff;color:#333;font-size:13px}.soft-tag{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #c8d2dc;border-radius:2px;background:#eef3f8;color:#455a6e;font-size:12px}.link-action{margin-right:10px;padding:0;border:0;background:transparent;color:#2d6fba;font-size:12px;cursor:pointer}.link-action.danger{color:#b3261e}.modal-mask{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(0,0,0,.25)}.legacy-modal{border:1px solid #9facba;background:#fff;color:#333;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.16)}.legacy-modal header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.delete-modal{width:360px}.legacy-modal p{margin:14px 18px;color:#333;line-height:1.7}.delete-tip{padding:7px 9px;border:1px solid #f0c7c3;background:#fff7f6;color:#b3261e}.legacy-modal footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #d8d8d8;background:#f7f9fb}.legacy-modal button{height:27px;padding:0 12px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.legacy-modal .modal-danger{border-color:#d7a19d;color:#a91e18;background:#fff}
</style>
