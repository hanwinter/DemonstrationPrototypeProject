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

const emit = defineEmits(['update:modelValue', 'save-unarchived', 'preview', 'generate-qr'])

const patient = {
  name: '王晓梅',
  age: '28岁',
  gestationalAge: '32+4周',
  archiveNo: 'MY202606230001',
  phone: '13800000000',
  institution: '北京大学第一医院密云医院',
  idNo: '110************1234',
}

const illnessTemplates = [
  { name: '高危妊娠告知', content: defaultIllnessSummary },
  { name: '常规产检告知', content: '孕妇目前产检资料基本完整，本次就诊需继续完善常规孕期检查，并按医嘱定期复查。' },
  { name: '住院观察告知', content: '孕妇当前情况需住院观察，医生已说明住院期间监测项目、可能风险及后续处理方案。' },
]

const riskTemplates = [
  { name: '高危风险模板', content: defaultRiskNotice },
  { name: '检查风险模板', content: '已向孕妇及家属说明检查目的、检查过程、可能不适、结果偏差及需复查等情况。孕妇及家属已知晓并确认。' },
  { name: '治疗处置模板', content: '已向孕妇及家属说明拟采取处理措施的必要性、可能获益、潜在风险及替代方案。孕妇及家属已知晓并确认。' },
]

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
    signatureMode: '本人或家属均可',
    confirmText: defaultConfirmText,
    status: 'unarchived',
  }
}

function close() {
  emit('update:modelValue', false)
}

function payload() {
  return { ...form }
}

function applyTemplate(field, content) {
  form[field] = content
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
        <div class="patient-wide"><span>联系电话：</span><strong>{{ patient.phone }}</strong></div>
        <div class="patient-wide"><span>证件号：</span><strong>{{ patient.idNo }}</strong></div>
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
            <el-form-item label="告知医生">
              <el-input v-model="form.createdDoctor" class="doctor-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告知时间">
              <el-date-picker v-model="form.noticeTime" class="notice-time-picker" type="datetime" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告知场景">
              <el-select v-model="form.scene" class="scene-select">
                <el-option v-for="item in consentSceneOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="edit-section">
      <h3>告知内容</h3>
      <div class="content-field">
        <div class="field-heading">
          <span>病情摘要</span>
          <el-dropdown trigger="click" @command="applyTemplate('illnessSummary', $event)">
            <el-button size="small">从模板选择</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in illnessTemplates" :key="item.name" :command="item.content">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-input v-model="form.illnessSummary" type="textarea" :rows="5" maxlength="2000" show-word-limit />
      </div>
      <div class="content-field">
        <div class="field-heading">
          <span>风险告知</span>
          <el-dropdown trigger="click" @command="applyTemplate('riskNotice', $event)">
            <el-button size="small">从模板选择</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in riskTemplates" :key="item.name" :command="item.content">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-input v-model="form.riskNotice" type="textarea" :rows="5" maxlength="2000" show-word-limit />
      </div>
    </div>

    <div class="edit-section">
      <h3>签字设置</h3>
      <div class="signature-settings">
        <span>签字方式</span>
        <el-radio-group v-model="form.signatureMode">
          <el-radio-button label="孕妇本人签字" />
          <el-radio-button label="家属代签" />
          <el-radio-button label="本人或家属均可" />
        </el-radio-group>
      </div>
      <el-input v-model="form.confirmText" type="textarea" :rows="3" />
    </div>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button @click="emit('preview', payload())">预览</el-button>
      <el-button type="warning" :disabled="!form.id" title="请先保存后再生成二维码" @click="emit('generate-qr', payload())">生成二维码</el-button>
      <el-button type="primary" @click="emit('save-unarchived', payload())">保存</el-button>
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
  grid-template-columns: 110px 88px 110px minmax(180px, 1fr);
  gap: 8px 16px;
}

.patient-info-grid div {
  min-width: 0;
  color: #6b7888;
}

.patient-info-grid strong {
  color: #243346;
}

.patient-info-grid .patient-wide {
  grid-column: span 2;
}

.edit-form :deep(.notice-time-picker) {
  width: 250px;
}

.edit-form :deep(.doctor-input) {
  width: 150px;
}

.edit-form :deep(.scene-select) {
  width: 170px;
}

.content-field + .content-field {
  margin-top: 12px;
}

.field-heading {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #30465f;
  font-weight: 600;
}
.signature-settings {
  margin-bottom: 10px;
  display: flex;
  gap: 24px;
}
</style>









