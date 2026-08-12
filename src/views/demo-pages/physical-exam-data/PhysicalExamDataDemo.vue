<script setup>
import { computed, reactive, ref } from 'vue'
import CompactSearchBar from '../../../components/demo-common/CompactSearchBar.vue'
import LegacyPagination from '../../../components/demo-common/LegacyPagination.vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'
import LegacyToolbar from '../../../components/demo-common/LegacyToolbar.vue'

const emptyQuery = () => ({
  schoolYear: '',
  batch: '',
  school: '',
  grade: '',
  className: '',
  name: '',
  idCard: '',
  startDate: '',
  endDate: '',
  finalStatus: '',
  examStatus: '',
})

const query = reactive(emptyQuery())
const appliedQuery = ref(emptyQuery())
const page = ref(1)
const pageSize = ref(20)

const options = {
  schoolYears: ['2026—2027学年', '2025—2026学年'],
  batches: ['2026—2027学年第四次体检', '2026—2027学年第三次体检', '2025—2026学年第四次体检'],
  schools: ['明德小学', '滨江实验学校', '文澜小学', '城南第二小学', '启航中学'],
  grades: ['四年级', '五年级', '七年级'],
  classes: ['1班', '2班', '3班'],
  finalStatuses: ['待总检', '总检中', '已总检'],
  examStatuses: ['待检查', '检查中', '已完成'],
}

const names = ['沈一鸣', '陆芷萱', '袁嘉禾', '邵雨晴', '傅子航', '程远舟', '曹若宁', '蒋沐辰', '叶知微', '梁景行', '钟语桐', '韩亦宸']
const allergy = ['无', '青霉素过敏', '花粉过敏', '无', '无']
const history = ['无', '哮喘史', '无', '扁桃体术后', '无']

const allRows = Array.from({ length: 531 }, (_, i) => {
  const school = options.schools[i % options.schools.length]
  const grade = options.grades[i % options.grades.length]
  const className = options.classes[i % options.classes.length]
  const pending = i % 11 === 0
  const date = `2026-09-${String(15 + (i % 12)).padStart(2, '0')}`
  return {
    id: `exam-${i + 1}`,
    index: i + 1,
    schoolYear: options.schoolYears[i % 2],
    batch: options.batches[i % options.batches.length],
    school,
    grade,
    className,
    name: names[i % names.length],
    gender: i % 2 ? '女' : '男',
    idCard: `330102201${i % 10}${String(i + 10000000).slice(0, 8)}`,
    checkDate: date,
    examStatus: pending ? '待检查' : i % 7 === 0 ? '检查中' : '已完成',
    finalStatus: pending || i % 5 === 0 ? '待总检' : i % 8 === 0 ? '总检中' : '已总检',
    allergyHistory: allergy[i % allergy.length],
    medicalHistory: history[i % history.length],
    fatherHeight: 168 + (i % 14),
    motherHeight: 156 + (i % 12),
    height: pending ? '--' : (128 + (i % 36)).toFixed(1),
    weight: pending ? '--' : (27 + (i % 24) + (i % 3) * 0.4).toFixed(1),
    bmi: pending ? '--' : (15.1 + (i % 38) / 10).toFixed(1),
    waist: pending ? '--' : 52 + (i % 18),
    leftVision: pending ? '--' : (4.6 + (i % 5) / 10).toFixed(1),
    rightVision: pending ? '--' : (4.7 + (i % 4) / 10).toFixed(1),
    leftSphere: pending ? '--' : i % 6 === 0 ? '-1.25' : '0.00',
    rightSphere: pending ? '--' : i % 8 === 0 ? '-1.00' : '0.00',
    leftCylinder: pending ? '--' : i % 9 === 0 ? '-0.50' : '0.00',
    rightCylinder: pending ? '--' : i % 10 === 0 ? '-0.75' : '0.00',
  }
})

const filteredRows = computed(() => allRows.filter((row) => {
  const q = appliedQuery.value
  return (!q.schoolYear || row.schoolYear === q.schoolYear)
    && (!q.batch || row.batch === q.batch)
    && (!q.school || row.school === q.school)
    && (!q.grade || row.grade === q.grade)
    && (!q.className || row.className === q.className)
    && (!q.name || row.name.includes(q.name))
    && (!q.idCard || row.idCard.includes(q.idCard))
    && (!q.startDate || row.checkDate >= q.startDate)
    && (!q.endDate || row.checkDate <= q.endDate)
    && (!q.finalStatus || row.finalStatus === q.finalStatus)
    && (!q.examStatus || row.examStatus === q.examStatus)
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})
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

function setPageSize(value) {
  pageSize.value = value
  page.value = 1
}
</script>

<template>
  <div class="physical-demo">
    <div class="breadcrumb">单页面演示 &gt; 体检数据</div>
    <CompactSearchBar :model="query" :options="options" @search="search" @reset="reset" />
    <LegacyToolbar />
    <LegacyTable :rows="pagedRows" />
    <LegacyPagination
      :page-size="pageSize"
      :page="page"
      :total-pages="totalPages"
      :total="filteredRows.length"
      :start="startRecord"
      :end="endRecord"
      @update:page-size="setPageSize"
      @first="page = 1"
      @prev="page = Math.max(1, page - 1)"
      @next="page = Math.min(totalPages, page + 1)"
      @last="page = totalPages"
      @refresh="search"
    />
  </div>
</template>

<style scoped>
.physical-demo{height:100%;min-width:0;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}
.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;border-bottom:0;background:#fff;color:#333;font-size:13px}
</style>
