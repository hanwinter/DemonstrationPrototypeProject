<script setup>
import { ArrowDown, Document, MoreFilled, Share, Tickets } from '@element-plus/icons-vue'

defineProps({ actions: { type: Array, required: true } })
const primaryActions = ['查看报告', '发送家长', '生成复筛任务']
const secondaryActions = ['编辑报告', '重新生成', '打印报告', '导出PDF']
const icons = { 查看报告: Document, 发送家长: Share, 生成复筛任务: Tickets }
</script>

<template>
  <div class="action-panel">
    <div class="primary-actions">
      <button v-for="action in primaryActions" :key="action">
        <el-icon><component :is="icons[action]" /></el-icon>
        <span>{{ action }}</span>
      </button>
    </div>
    <details class="more-actions">
      <summary><el-icon><MoreFilled /></el-icon><span>更多操作</span><el-icon><ArrowDown /></el-icon></summary>
      <div class="secondary-actions"><button v-for="action in secondaryActions" :key="action">{{ action }}</button></div>
    </details>
  </div>
</template>

<style scoped>
.action-panel{display:grid;gap:8px}.primary-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.primary-actions button{height:72px;padding:0 12px;display:flex;align-items:center;justify-content:center;gap:8px;color:#344054;background:#fff;border:0;border-radius:12px;box-shadow:0 1px 8px rgba(16,24,40,.04);cursor:pointer;transition:background .16s,color .16s,transform .16s}.primary-actions button:hover{color:var(--fh-primary);background:var(--fh-hover-bg);transform:translateY(-1px)}.primary-actions :deep(.el-icon){font-size:18px}.primary-actions span{font-size:14px}.more-actions{background:#fff;border-radius:12px;box-shadow:0 1px 8px rgba(16,24,40,.04)}.more-actions summary{height:42px;padding:0 12px;display:flex;align-items:center;gap:8px;color:var(--fh-text-secondary);cursor:pointer;list-style:none}.more-actions summary::-webkit-details-marker{display:none}.more-actions summary span{flex:1}.secondary-actions{padding:0 12px 12px;display:flex;flex-wrap:wrap;gap:8px}.secondary-actions button{height:30px;padding:0 10px;color:var(--fh-text-secondary);border:0;border-radius:999px;background:#F2F4F7;cursor:pointer}.secondary-actions button:hover{color:var(--fh-primary);background:var(--fh-primary-light)}
@media (max-width:1200px){.primary-actions{grid-template-columns:1fr}}
</style>
