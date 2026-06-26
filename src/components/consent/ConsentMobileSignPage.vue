<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

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

const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({
  confirmed: false,
  signerRole: '孕妇本人',
  signer: '王晓梅',
  relation: '',
})
const signature = ref('')

const signerRoleOptions = computed(() => {
  if (props.document?.signatureMode === '孕妇本人签字') return ['孕妇本人']
  if (props.document?.signatureMode === '家属代签') return ['家属代签']
  return ['孕妇本人', '家属代签']
})

function defaultSignerRole() {
  return props.document?.signatureMode === '家属代签' ? '家属代签' : '孕妇本人'
}

function resetSignForm() {
  form.confirmed = false
  form.signerRole = defaultSignerRole()
  form.signer = form.signerRole === '孕妇本人' ? '王晓梅' : ''
  form.relation = ''
  signature.value = ''
}

watch(
  () => [props.modelValue, props.document?.signatureMode],
  ([visible]) => {
    if (visible) {
      resetSignForm()
    }
  },
)

watch(
  () => form.signerRole,
  (role, previousRole) => {
    if (!props.modelValue || role === previousRole) return
    form.signer = role === '孕妇本人' ? '王晓梅' : ''
    if (role !== '家属代签') form.relation = ''
    signature.value = ''
  },
)

function mockSign() {
  signature.value = form.signer || '王晓梅'
}

function submit() {
  if (!form.confirmed) {
    ElMessage.warning('请先勾选知情确认')
    return
  }
  if (!form.signer) {
    ElMessage.warning('请填写签字人姓名')
    return
  }
  if (!signature.value) {
    ElMessage.warning('请完成签名')
    return
  }
  emit('submit', {
    signer: form.signer,
    signerRole: form.signerRole,
    relation: form.signerRole === '家属代签' ? form.relation : '',
    patientSignature: signature.value,
  })
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="430px"
    class="mobile-sign-dialog"
    title="孕产妇扫码签字模拟页"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="document" class="phone-frame">
      <header>
        <strong>北京大学第一医院密云医院</strong>
        <span>知情同意告知书</span>
      </header>
      <main>
        <dl class="mobile-meta">
          <div><dt>患者姓名</dt><dd>王晓梅</dd></div>
          <div><dt>告知时间</dt><dd>{{ document.noticeTime }}</dd></div>
          <div><dt>告知医生</dt><dd>{{ document.createdDoctor }}</dd></div>
          <div><dt>签字方式</dt><dd>{{ document.signatureMode || '本人或家属均可' }}</dd></div>
        </dl>

        <section>
          <h4>病情摘要</h4>
          <p>{{ document.illnessSummary }}</p>
        </section>
        <section>
          <h4>风险告知</h4>
          <p>{{ document.riskNotice }}</p>
        </section>

        <el-checkbox v-model="form.confirmed" class="confirm-checkbox">
          本人已认真阅读以上内容，医生已就相关病情和风险进行说明，本人已知晓并确认。
        </el-checkbox>

        <el-form label-position="top">
          <el-form-item label="签字人身份">
            <el-radio-group v-model="form.signerRole">
              <el-radio-button v-for="item in signerRoleOptions" :key="item" :label="item" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="签字人姓名">
            <el-input v-model="form.signer" />
          </el-form-item>
          <el-form-item v-if="form.signerRole === '家属代签'" label="与孕妇关系">
            <el-input v-model="form.relation" placeholder="如：丈夫、母亲" />
          </el-form-item>
        </el-form>

        <div class="mobile-sign-box">
          <span v-if="signature">{{ signature }}</span>
          <em v-else>手写签名区域</em>
        </div>
        <div class="mobile-sign-actions">
          <el-button size="small" @click="mockSign">模拟签名</el-button>
          <el-button size="small" @click="signature = ''">清除签名</el-button>
        </div>
      </main>
      <footer>
        <el-button type="primary" size="large" @click="submit">提交签字</el-button>
      </footer>
    </div>
  </el-dialog>
</template>

<style scoped>
.phone-frame {
  width: 360px;
  max-height: 70vh;
  margin: 0 auto;
  overflow: auto;
  border: 10px solid #1f2937;
  border-radius: 28px;
  background: #f5f7fb;
}

.phone-frame header {
  padding: 18px 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #fff;
  background: #447afc;
}

.phone-frame main {
  padding: 14px;
}

.mobile-meta {
  margin: 0 0 12px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e1e7ef;
}

.mobile-meta div {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.mobile-meta div:first-child {
  margin-top: 0;
}

.mobile-meta dt {
  color: #7b8795;
}

.mobile-meta dd {
  margin: 0;
  color: #25364a;
}

section {
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e1e7ef;
}

section h4 {
  margin: 0 0 6px;
  color: #30465f;
}

section p {
  margin: 0;
  color: #4f5e70;
  line-height: 1.7;
}

.confirm-checkbox {
  margin: 4px 0 12px;
  white-space: normal;
}

.mobile-sign-box {
  height: 96px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px dashed #9eacbb;
}

.mobile-sign-box span {
  font-family: "KaiTi", "STKaiti", serif;
  font-size: 34px;
}

.mobile-sign-box em {
  color: #97a3b2;
  font-style: normal;
}

.mobile-sign-actions {
  margin-top: 8px;
  text-align: right;
}

.phone-frame footer {
  position: sticky;
  bottom: 0;
  padding: 10px 14px 14px;
  background: #fff;
}

.phone-frame footer .el-button {
  width: 100%;
}
</style>

