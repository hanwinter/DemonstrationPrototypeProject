<script setup>
defineProps({ modelValue: { type: Boolean, default: false }, title: { type: String, default: '回访任务明细' }, tasks: { type: Array, default: () => [] }, mode: { type: String, default: 'normal' } })
const emit = defineEmits(['update:modelValue'])
function statusType(status) { if (status === '已完成') return 'success'; if (status === '今日到期') return 'warning'; if (status === '已逾期') return 'danger'; return 'info' }
function postpartumDays(row) { return row.currentPostpartumDays ? row.currentPostpartumDays + '天' : '-' }
function overdueDays(row) { return row.overdueDays ? row.overdueDays + '天' : '-' }
</script>

<template>
  <el-drawer :model-value="modelValue" :title="title" size="860px" direction="rtl" @update:model-value="emit('update:modelValue', $event)">
    <el-table :data="tasks" border height="520" class="detail-table">
      <el-table-column prop="customerName" label="客户姓名" fixed min-width="110" />
      <el-table-column prop="consultantName" label="负责顾问" min-width="100" />
      <el-table-column prop="productionDate" label="生产日期" min-width="120" />
      <el-table-column label="当前产后天数" min-width="120"><template #default="{ row }"><span>{{ postpartumDays(row) }}</span></template></el-table-column>
      <el-table-column prop="visitStage" label="回访阶段" min-width="150" />
      <el-table-column prop="planDate" label="计划回访日期" min-width="120" />
      <el-table-column label="逾期天数" min-width="100"><template #default="{ row }"><span :class="{ 'danger-text': row.overdueDays }">{{ overdueDays(row) }}</span></template></el-table-column>
      <el-table-column label="状态" min-width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)" effect="light">{{ row.status }}</el-tag></template></el-table-column>
    </el-table>
  </el-drawer>
</template>

<style scoped>
.detail-table{width:100%}.detail-table :deep(th.el-table__cell){background:#f9fafb;color:#1f2937;font-weight:700}.detail-table :deep(.el-table__cell){font-size:13px}.danger-text{color:#d92d20;font-weight:700}
</style>
