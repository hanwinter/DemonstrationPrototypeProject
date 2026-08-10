<script setup>
import { computed, ref } from 'vue'
import PostpartumVisitTable from '../components/visit-reminder/PostpartumVisitTable.vue'
import ServiceVisitTable from '../components/visit-reminder/ServiceVisitTable.vue'
import VisitTaskDetail from '../components/visit-reminder/VisitTaskDetail.vue'

const query = { viewDate: '2026-08-07', consultantName: '全部', visitType: '全部', status: '全部', customerName: '' }
const detailVisible = ref(false)
const detailContext = ref({ mode: 'normal', visitType: '', stage: '', consultantName: '' })

const visitTasks = [
  { id: 1, customerName: '王女士', consultantName: '包洁', visitType: '产后回访', visitStage: '15-30天', productionDate: '2026-07-20', currentPostpartumDays: 18, planDate: '2026-08-07', status: '待回访' },
  { id: 2, customerName: '陈女士', consultantName: '包洁', visitType: '产后回访', visitStage: '15-30天', productionDate: '2026-07-19', currentPostpartumDays: 19, planDate: '2026-08-07', status: '今日到期' },
  { id: 3, customerName: '刘女士', consultantName: '包洁', visitType: '产后回访', visitStage: '30-45天', productionDate: '2026-06-25', currentPostpartumDays: 43, planDate: '2026-08-07', status: '待回访' },
  { id: 4, customerName: '赵女士', consultantName: '曹晓君', visitType: '产后回访', visitStage: '15-30天', productionDate: '2026-07-18', currentPostpartumDays: 20, planDate: '2026-08-08', status: '待回访' },
  { id: 5, customerName: '周女士', consultantName: '曹晓君', visitType: '产后回访', visitStage: '45-60天', productionDate: '2026-06-10', currentPostpartumDays: 58, planDate: '2026-08-07', status: '今日到期' },
  { id: 6, customerName: '吴女士', consultantName: '包洁', visitType: '服务回访', visitStage: '上户5-7天', productionDate: '2026-07-28', currentPostpartumDays: 10, planDate: '2026-08-07', status: '待回访' },
  { id: 7, customerName: '郑女士', consultantName: '包洁', visitType: '服务回访', visitStage: '下户3天', productionDate: '2026-06-20', currentPostpartumDays: 49, planDate: '2026-08-07', status: '已完成' },
  { id: 8, customerName: '马女士', consultantName: '曹振兴', visitType: '服务回访', visitStage: '下户3天', productionDate: '2026-06-30', currentPostpartumDays: 39, planDate: '2026-08-07', status: '今日到期' },
]
const overdueTasks = [
  { id: 'p1', customerName: '孙女士', consultantName: '包洁', visitType: '产后回访', visitStage: '产后15-30天', planDate: '2026-08-02', overdueDays: 5, status: '已逾期' },
  { id: 'p2', customerName: '黄女士', consultantName: '包洁', visitType: '产后回访', visitStage: '产后30-45天', planDate: '2026-08-03', overdueDays: 4, status: '已逾期' },
  { id: 'p3', customerName: '林女士', consultantName: '曹晓君', visitType: '产后回访', visitStage: '产后30-45天', planDate: '2026-08-01', overdueDays: 6, status: '已逾期' },
  { id: 'p4', customerName: '何女士', consultantName: '曹晓君', visitType: '产后回访', visitStage: '产后45-60天', planDate: '2026-08-04', overdueDays: 3, status: '已逾期' },
  { id: 'p5', customerName: '罗女士', consultantName: '曹振兴', visitType: '产后回访', visitStage: '产后60-75天', planDate: '2026-08-05', overdueDays: 2, status: '已逾期' },
  { id: 's1', customerName: '高女士', consultantName: '包洁', visitType: '服务回访', visitStage: '上户5-7天', planDate: '2026-08-04', overdueDays: 3, status: '已逾期' },
  { id: 's2', customerName: '唐女士', consultantName: '曹晓君', visitType: '服务回访', visitStage: '下户3天', planDate: '2026-08-02', overdueDays: 5, status: '已逾期' },
  { id: 's3', customerName: '宋女士', consultantName: '曹振兴', visitType: '服务回访', visitStage: '下户3天', planDate: '2026-08-06', overdueDays: 1, status: '已逾期' },
]
const postpartumSummarySource = [
  { consultantName: '包洁', counts: { '15-30天': 8, '30-45天': 8, '45-60天': 9, '60-75天': 6, '75-90天': 5, '90-105天': 1 } },
  { consultantName: '曹晓君', counts: { '15-30天': 10, '30-45天': 8, '45-60天': 5, '60-75天': 1, '75-90天': 1, '90-105天': 2 } },
  { consultantName: '曹振兴', counts: { '15-30天': 0, '30-45天': 0, '45-60天': 0, '75-90天': 0, '90-105天': 0 } },
  { consultantName: '李娜', counts: { '15-30天': 6, '30-45天': 4, '45-60天': 3, '60-75天': 2, '75-90天': 1, '90-105天': 0 } },
  { consultantName: '王芳', counts: { '15-30天': 5, '30-45天': 7, '45-60天': 2, '60-75天': 3, '75-90天': 0, '90-105天': 1 } },
  { consultantName: '张敏', counts: { '15-30天': 3, '30-45天': 6, '45-60天': 4, '60-75天': 2, '75-90天': 2, '90-105天': 0 } },
  { consultantName: '刘洋', counts: { '15-30天': 9, '30-45天': 3, '45-60天': 5, '60-75天': 1, '75-90天': 0, '90-105天': 0 } },
  { consultantName: '陈晨', counts: { '15-30天': 2, '30-45天': 5, '45-60天': 6, '60-75天': 4, '75-90天': 1, '90-105天': 1 } },
  { consultantName: '杨静', counts: { '15-30天': 7, '30-45天': 2, '45-60天': 3, '60-75天': 5, '75-90天': 2, '90-105天': 0 } },
  { consultantName: '赵倩', counts: { '15-30天': 4, '30-45天': 4, '45-60天': 4, '60-75天': 2, '75-90天': 1, '90-105天': 1 } },
  { consultantName: '周婷', counts: { '15-30天': 8, '30-45天': 1, '45-60天': 2, '60-75天': 3, '75-90天': 2, '90-105天': 0 } },
  { consultantName: '吴丽', counts: { '15-30天': 1, '30-45天': 6, '45-60天': 5, '60-75天': 2, '75-90天': 0, '90-105天': 2 } },
  { consultantName: '郑雅', counts: { '15-30天': 6, '30-45天': 3, '45-60天': 1, '60-75天': 4, '75-90天': 1, '90-105天': 0 } },
  { consultantName: '孙悦', counts: { '15-30天': 5, '30-45天': 5, '45-60天': 2, '60-75天': 1, '75-90天': 3, '90-105天': 1 } },
  { consultantName: '黄璐', counts: { '15-30天': 2, '30-45天': 2, '45-60天': 7, '60-75天': 3, '75-90天': 1, '90-105天': 0 } },
  { consultantName: '林青', counts: { '15-30天': 7, '30-45天': 4, '45-60天': 2, '60-75天': 2, '75-90天': 0, '90-105天': 1 } },
  { consultantName: '何佳', counts: { '15-30天': 3, '30-45天': 8, '45-60天': 1, '60-75天': 1, '75-90天': 2, '90-105天': 0 } },
  { consultantName: '罗曼', counts: { '15-30天': 4, '30-45天': 3, '45-60天': 6, '60-75天': 2, '75-90天': 1, '90-105天': 1 } },
  { consultantName: '高雪', counts: { '15-30天': 6, '30-45天': 2, '45-60天': 2, '60-75天': 5, '75-90天': 0, '90-105天': 0 } },
  { consultantName: '唐欣', counts: { '15-30天': 1, '30-45天': 7, '45-60天': 3, '60-75天': 2, '75-90天': 2, '90-105天': 1 } },
]
const serviceSummarySource = [
  { consultantName: '包洁', counts: { '上户5-7天': 5, '下户3天': 2 } },
  { consultantName: '曹晓君', counts: { '上户5-7天': 2, '下户3天': 1 } },
  { consultantName: '曹振兴', counts: { '上户5-7天': 1, '下户3天': 4 } },
  { consultantName: '李娜', counts: { '上户5-7天': 3, '下户3天': 2 } },
  { consultantName: '王芳', counts: { '上户5-7天': 4, '下户3天': 1 } },
  { consultantName: '张敏', counts: { '上户5-7天': 2, '下户3天': 3 } },
  { consultantName: '刘洋', counts: { '上户5-7天': 6, '下户3天': 2 } },
  { consultantName: '陈晨', counts: { '上户5-7天': 1, '下户3天': 2 } },
  { consultantName: '杨静', counts: { '上户5-7天': 0, '下户3天': 1 } },
  { consultantName: '赵倩', counts: { '上户5-7天': 4, '下户3天': 4 } },
  { consultantName: '周婷', counts: { '上户5-7天': 3, '下户3天': 0 } },
  { consultantName: '吴丽', counts: { '上户5-7天': 2, '下户3天': 5 } },
  { consultantName: '郑雅', counts: { '上户5-7天': 1, '下户3天': 1 } },
  { consultantName: '孙悦', counts: { '上户5-7天': 5, '下户3天': 3 } },
  { consultantName: '黄璐', counts: { '上户5-7天': 2, '下户3天': 2 } },
  { consultantName: '林青', counts: { '上户5-7天': 4, '下户3天': 1 } },
  { consultantName: '何佳', counts: { '上户5-7天': 0, '下户3天': 0 } },
  { consultantName: '罗曼', counts: { '上户5-7天': 3, '下户3天': 2 } },
  { consultantName: '高雪', counts: { '上户5-7天': 2, '下户3天': 4 } },
  { consultantName: '唐欣', counts: { '上户5-7天': 1, '下户3天': 3 } },
]
const postpartumOverdueRows = [
  { consultantName: '包洁', count: 5 },
  { consultantName: '曹晓君', count: 8 },
  { consultantName: '曹振兴', count: 1 },
  { consultantName: '李娜', count: 4 },
  { consultantName: '王芳', count: 3 },
  { consultantName: '张敏', count: 6 },
  { consultantName: '刘洋', count: 2 },
  { consultantName: '陈晨', count: 5 },
  { consultantName: '杨静', count: 0 },
  { consultantName: '赵倩', count: 4 },
  { consultantName: '周婷', count: 2 },
  { consultantName: '吴丽', count: 3 },
  { consultantName: '郑雅', count: 0 },
  { consultantName: '孙悦', count: 5 },
  { consultantName: '黄璐', count: 2 },
  { consultantName: '林青', count: 4 },
  { consultantName: '何佳', count: 0 },
  { consultantName: '罗曼', count: 3 },
  { consultantName: '高雪', count: 2 },
  { consultantName: '唐欣', count: 4 },
]
const postpartumOverdueStages = [{ stage: '产后15-30天', count: 3 }, { stage: '产后30-45天', count: 8 }, { stage: '产后45-60天', count: 2 }, { stage: '产后60-75天', count: 1 }]
const serviceOverdueRows = [
  { consultantName: '包洁', count: 1 },
  { consultantName: '曹晓君', count: 5 },
  { consultantName: '曹振兴', count: 1 },
  { consultantName: '李娜', count: 2 },
  { consultantName: '王芳', count: 0 },
  { consultantName: '张敏', count: 3 },
  { consultantName: '刘洋', count: 1 },
  { consultantName: '陈晨', count: 0 },
  { consultantName: '杨静', count: 2 },
  { consultantName: '赵倩', count: 4 },
  { consultantName: '周婷', count: 0 },
  { consultantName: '吴丽', count: 2 },
  { consultantName: '郑雅', count: 1 },
  { consultantName: '孙悦', count: 3 },
  { consultantName: '黄璐', count: 0 },
  { consultantName: '林青', count: 2 },
  { consultantName: '何佳', count: 0 },
  { consultantName: '罗曼', count: 1 },
  { consultantName: '高雪', count: 2 },
  { consultantName: '唐欣', count: 1 },
]
const serviceOverdueStages = [{ stage: '上户5-7天', count: 9 }, { stage: '下户3天', count: 21 }]

const filteredTasks = computed(() => filterTasks(visitTasks))
const filteredOverdueTasks = computed(() => filterTasks(overdueTasks))
const postpartumRows = computed(() => filterSummary(postpartumSummarySource, '产后回访'))
const serviceRows = computed(() => filterSummary(serviceSummarySource, '服务回访'))
const visiblePostpartumOverdueRows = computed(() => filterOverdueSummary(postpartumOverdueRows, '产后回访'))
const visibleServiceOverdueRows = computed(() => filterOverdueSummary(serviceOverdueRows, '服务回访'))
const visiblePostpartumOverdueStages = computed(() => query.visitType === '服务回访' ? [] : postpartumOverdueStages)
const postpartumOverdueTotal = computed(() => visiblePostpartumOverdueRows.value.reduce((sum, row) => sum + row.count, 0))
const detailMode = computed(() => detailContext.value.mode || 'normal')
const detailTasks = computed(() => {
  const context = detailContext.value
  const source = detailMode.value === 'overdue' ? filteredOverdueTasks.value : filteredTasks.value
  return source.filter((task) => {
    const typeMatch = !context.visitType || task.visitType === context.visitType
    const consultantMatch = !context.consultantName || task.consultantName === context.consultantName
    const stageMatch = !context.stage || task.visitStage === context.stage || task.visitStage === context.stage.replace('产后', '')
    return typeMatch && consultantMatch && stageMatch
  })
})
const detailTitle = computed(() => {
  const context = detailContext.value
  const suffix = detailMode.value === 'overdue' ? '超期客户列表' : '客户任务列表'
  return [context.consultantName, context.visitType, context.stage, suffix].filter(Boolean).join(' ')
})

function filterTasks(rows) {
  return rows.filter((task) => {
    const consultantMatch = query.consultantName === '全部' || task.consultantName === query.consultantName
    const typeMatch = query.visitType === '全部' || task.visitType === query.visitType
    const statusMatch = query.status === '全部' || task.status === query.status
    const customerMatch = !query.customerName.trim() || task.customerName.includes(query.customerName.trim())
    return consultantMatch && typeMatch && statusMatch && customerMatch
  })
}
function filterSummary(rows, visitType) { if (query.visitType !== '全部' && query.visitType !== visitType) return []; return rows.filter((row) => query.consultantName === '全部' || row.consultantName === query.consultantName) }
function filterOverdueSummary(rows, visitType) { if (query.visitType !== '全部' && query.visitType !== visitType) return []; return rows.filter((row) => query.consultantName === '全部' || row.consultantName === query.consultantName) }
function openDetail(context) { detailContext.value = { mode: 'normal', ...context }; detailVisible.value = true }
</script>

<template>
  <section class="visit-reminder">
    <header class="page-head"><div><h1>回访提醒</h1></div></header>

    <PostpartumVisitTable v-if="query.visitType !== '服务回访'" :rows="postpartumRows" :overdue-rows="visiblePostpartumOverdueRows" :overdue-stages="visiblePostpartumOverdueStages" :overdue-total="postpartumOverdueTotal" @open-detail="openDetail" />
    <ServiceVisitTable v-if="query.visitType !== '产后回访'" :rows="serviceRows" :overdue-rows="visibleServiceOverdueRows" :overdue-stages="serviceOverdueStages" @open-detail="openDetail" />
    <VisitTaskDetail v-model="detailVisible" :title="detailTitle" :tasks="detailTasks" :mode="detailMode" />
  </section>
</template>

<style scoped>
.visit-reminder{min-width:0}.page-head{margin-bottom:16px}.page-head h1{margin:0;color:#1f2937;font-size:22px;font-weight:700}
</style>













