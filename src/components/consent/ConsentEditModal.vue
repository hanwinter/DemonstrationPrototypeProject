<script setup>
import { reactive, watch } from 'vue'
import {
  consentSceneOptions,
  defaultConfirmText,
  defaultIllnessSummary,
  defaultRiskNotice,
  formatNow,
} from '../../mock/consentDocuments'

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

const emit = defineEmits(['update:modelValue', 'save-draft', 'preview', 'generate-qr'])

const patient = {
  name: '王晓梅',
  age: '28岁',
  gestationalAge: '32+4周',
  archiveNo: 'MY202606230001',
  phone: '13800000000',
  institution: '北京大学第一医院密云医院',
  idNo: '110************1234',
}

const form = reactive(createEmptyForm())

watch(
  () => [props.modelValue, props.document],
  () => {
    if (props.modelValue) {
      Object.assign(form, createEmptyForm(), props.document || {})
    }
  },
  { immediate: true },
)

function createEmptyForm() {
  const now = formatNow()
  return {
    id: null,
    documentName: '知情同意告知书',
    noticeTime: now,
    createdAt: now,
    createdDoctor: '张医生',
    scene: '高危告知',
    illnessSummary: defaultIllnessSummary,
    riskNotice: defaultRiskNotice,
    needPatientSignature: true,
    allowFamilySignature: true,
    confirmText: defaultConfirmText,
    status: 'draft',
  }
}

function close() {
  emit('update:modelValue', false)
}

function payload() {
  return { ...form }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    class="consent-edit-dialog"
    width="980px"
    :title="document?.id ? '编辑知情同意书' : '新建知情同意书'"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="edit-section">
      <h3>孕产妇基本信息</h3>
      <div class="patient-info-grid">
        <div><span>姓名：</span><strong>{{ patient.name }}</strong></div>
        <div><span>年龄：</span><strong>{{ patient.age }}</strong></div>
        <div><span>孕周：</span><strong>{{ patient.gestationalAge }}</strong></div>
        <div><span>档案号：</span><strong>{{ patient.archiveNo }}</strong></div>
        <div><span>联系电话：</span><strong>{{ patient.phone }}</strong></div>
        <div><span>建档机构：</span><strong>{{ patient.institution }}</strong></div>
        <div><span>证件号：</span><strong>{{ patient.idNo }}</strong></div>
      </div>
    </div>

    <div class="edit-section">
      <h3>文书基本信息</h3>
      <el-form class="edit-form" label-width="104px">
        <el-row :gutter="14">
          <el-col :span="12">
            <el-form-item label="文书名称">
              <el-input v-model="form.documentName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告知时间">
              <el-date-picker v-model="form.noticeTime" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告知医生">
              <el-input v-model="form.createdDoctor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告知场景">
              <el-select v-model="form.scene">
                <el-option v-for="item in consentSceneOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="edit-section">
      <h3>告知内容</h3>
      <el-form label-width="90px">
        <el-form-item label="病情摘要">
          <el-input v-model="form.illnessSummary" type="textarea" :rows="5" maxlength="2000" show-word-limit />
        </el-form-item>
        <el-form-item label="风险告知">
          <el-input v-model="form.riskNotice" type="textarea" :rows="5" maxlength="2000" show-word-limit />
        </el-form-item>
      </el-form>
    </div>

    <div class="edit-section">
      <h3>签字设置</h3>
      <div class="signature-settings">
        <el-checkbox v-model="form.needPatientSignature">是否需要孕妇本人签字</el-checkbox>
        <el-checkbox v-model="form.allowFamilySignature">是否允许家属代签</el-checkbox>
      </div>
      <el-input v-model="form.confirmText" type="textarea" :rows="3" />
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button @click="emit('preview', payload())">预览</el-button>
      <el-button type="warning" @click="emit('generate-qr', payload())">生成二维码</el-button>
      <el-button type="primary" @click="emit('save-draft', payload())">保存草稿</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.edit-section {
  margin-bottom: 14px;
  padding: 14px;
  border: 1px solid #dce5ee;
  background: #fbfdff;
}

.edit-section h3 {
  margin: 0 0 12px;
  padding-left: 9px;
  color: #30465f;
  border-left: 3px solid var(--medical-blue);
  font-size: 16px;
}

.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px 18px;
}

.patient-info-grid div {
  min-width: 0;
  color: #6b7888;
}

.patient-info-grid strong {
  color: #243346;
}

.edit-form :deep(.el-date-editor),
.edit-form :deep(.el-select) {
  width: 100%;
}

.signature-settings {
  margin-bottom: 10px;
  display: flex;
  gap: 24px;
}
</style>
