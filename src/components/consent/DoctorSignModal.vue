<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { formatNow } from '../../mock/consentDocuments'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const signature = ref('')
const signedAt = ref(formatNow())

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      signature.value = ''
      signedAt.value = formatNow()
    }
  },
)

function submit() {
  const finalSignature = signature.value || '张医生'
  if (!finalSignature) {
    ElMessage.warning('请完成医生签字')
    return
  }
  emit('submit', {
    doctorSignature: finalSignature,
    doctorSignedAt: signedAt.value,
  })
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="460px"
    title="医生签字"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form label-width="88px">
      <el-form-item label="医生姓名">
        <el-input model-value="张医生" disabled />
      </el-form-item>
      <el-form-item label="签字时间">
        <el-input v-model="signedAt" disabled />
      </el-form-item>
      <el-form-item label="签字区域">
        <div class="doctor-sign-box" @click="signature = '张医生'">
          <span v-if="signature">{{ signature }}</span>
          <em v-else>点击模拟医生签字</em>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认签字</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.doctor-sign-box {
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed #9eacbb;
  background: #fbfdff;
}

.doctor-sign-box span {
  font-family: "KaiTi", "STKaiti", serif;
  font-size: 34px;
}

.doctor-sign-box em {
  color: #8b98a7;
  font-style: normal;
}
</style>
