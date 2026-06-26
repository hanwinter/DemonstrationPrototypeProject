<script setup>
import { consentStatusMeta } from '../../mock/consentDocuments'
import ConsentDocument from './ConsentDocument.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  document: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'edit', 'qr', 'doctor-sign', 'archive', 'print'])

function hasPatientSignature() {
  return Boolean(props.document?.patientSignature)
}

function hasDoctorSignature() {
  return Boolean(props.document?.doctorSignature)
}

function canShow(action) {
  const document = props.document
  if (!document || document.status === 'voided') return false
  if (action === 'edit') return document.status === 'draft'
  if (action === 'qr') return document.status === 'draft' && !hasPatientSignature()
  if (action === 'doctor-sign') return document.status === 'draft' && !hasDoctorSignature()
  if (action === 'archive') return document.status === 'draft' && hasPatientSignature() && hasDoctorSignature()
  if (action === 'print') return document.status === 'archived'
  return false
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    class="consent-preview-dialog"
    width="1280px"
    title="知情同意书预览"
    top="4vh"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="document" class="preview-layout">
      <div class="preview-document">
        <ConsentDocument :document="document" />
      </div>
      <aside class="preview-side">
        <h3>签字状态与操作</h3>
        <dl>
          <div>
            <dt>文书状态</dt>
            <dd><el-tag :type="consentStatusMeta[document.status].type">{{ consentStatusMeta[document.status].label }}</el-tag></dd>
          </div>
          <div>
            <dt>孕妇/家属签字状态</dt>
            <dd>{{ document.patientSignature ? '已签字' : '未签字' }}</dd>
          </div>
          <div>
            <dt>医生签字状态</dt>
            <dd>{{ document.doctorSignature ? '已签字' : '未签字' }}</dd>
          </div>
          <div>
            <dt>归档状态</dt>
            <dd>{{ document.archivedAt ? '已归档' : '未归档' }}</dd>
          </div>
          <div>
            <dt>打印次数</dt>
            <dd>{{ document.printCount }}次</dd>
          </div>
        </dl>

        <div class="side-actions">
          <el-button v-if="canShow('edit')" @click="emit('edit', document)">返回编辑</el-button>
          <el-button v-if="canShow('qr')" type="warning" @click="emit('qr', document)">二维码</el-button>
          <el-button v-if="canShow('doctor-sign')" type="primary" @click="emit('doctor-sign', document)">医生签字</el-button>
          <el-button v-if="canShow('archive')" type="success" @click="emit('archive', document)">归档</el-button>
          <el-button v-if="canShow('print')" type="primary" @click="emit('print', document)">打印预览</el-button>
        </div>

        <el-alert
          v-if="document.status === 'voided'"
          title="该文书已作废，只允许查看原始内容。"
          type="error"
          :closable="false"
          show-icon
        />
      </aside>
    </div>
  </el-dialog>
</template>

<style scoped>
.consent-preview-dialog :deep(.el-dialog__body) {
  padding: 12px;
}

.preview-layout {
  height: 78vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 12px;
}

.preview-document {
  overflow: auto;
  padding: 18px;
  background: #dfe4ea;
  border: 1px solid #cfd8e3;
}

.preview-side {
  min-width: 0;
  padding: 14px;
  background: #fbfdff;
  border: 1px solid #dce5ee;
}

.preview-side h3 {
  margin: 0 0 12px;
  color: #25364a;
  font-size: 17px;
}

.preview-side dl {
  margin: 0 0 16px;
}

.preview-side dl div {
  padding: 10px 0;
  border-bottom: 1px solid #e8edf3;
}

.preview-side dt {
  color: #7b8795;
  font-size: 13px;
}

.preview-side dd {
  margin: 6px 0 0;
  color: #263442;
  font-weight: 600;
}

.side-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.side-actions .el-button {
  width: 100%;
  margin-left: 0;
}
</style>


