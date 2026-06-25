<script setup>
import { Printer } from '@element-plus/icons-vue'
import ConsentDocument from './ConsentDocument.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  document: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'printed'])

function printPage() {
  emit('printed')
  window.print()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    class="consent-print-dialog"
    fullscreen
    title="打印预览"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="document" class="print-preview">
      <div class="print-toolbar">
        <el-button type="primary" :icon="Printer" @click="printPage">打印</el-button>
        <el-button @click="emit('update:modelValue', false)">返回</el-button>
      </div>
      <div class="print-canvas">
        <ConsentDocument :document="document" />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.consent-print-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #dfe4ea;
}

.print-toolbar {
  position: sticky;
  z-index: 10;
  top: 0;
  height: 56px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-bottom: 1px solid #d7e0ea;
}

.print-canvas {
  padding: 24px 0;
}

@media print {
  .print-toolbar,
  :deep(.el-dialog__header) {
    display: none !important;
  }

  .consent-print-dialog :deep(.el-dialog),
  .consent-print-dialog :deep(.el-dialog__body),
  .print-canvas {
    padding: 0;
    background: #fff;
  }
}
</style>

