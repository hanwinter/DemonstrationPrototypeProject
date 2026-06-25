<script setup>
import { Iphone, Link } from '@element-plus/icons-vue'

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

const emit = defineEmits(['update:modelValue', 'open-sign', 'copy-link'])
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="520px"
    title="孕产妇扫码阅读并签字"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="document" class="qr-dialog-body">
      <div class="mock-qr">
        <el-icon><Iphone /></el-icon>
        <span>QR Code</span>
      </div>
      <p class="qr-tip">请孕产妇使用手机扫描二维码，阅读知情同意告知书内容并完成手写签字。</p>
      <dl>
        <div><dt>文书名称：</dt><dd>{{ document.documentName }}</dd></div>
        <div><dt>孕产妇姓名：</dt><dd>王晓梅</dd></div>
        <div><dt>有效时间：</dt><dd>30分钟</dd></div>
      </dl>
    </div>

    <template #footer>
      <el-button :icon="Link" @click="emit('copy-link')">复制签字链接</el-button>
      <el-button type="primary" @click="emit('open-sign', document)">打开模拟签字页</el-button>
      <el-button @click="emit('update:modelValue', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.qr-dialog-body {
  text-align: center;
}

.mock-qr {
  width: 170px;
  height: 170px;
  margin: 4px auto 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #2f66d0;
  border: 8px solid #edf4ff;
  outline: 1px solid #9dbbf5;
  background:
    linear-gradient(90deg, #1f2b3a 10px, transparent 10px) 20px 20px / 38px 38px,
    linear-gradient(#1f2b3a 10px, transparent 10px) 20px 20px / 38px 38px,
    #fff;
}

.mock-qr .el-icon {
  padding: 7px;
  font-size: 34px;
  background: #fff;
}

.mock-qr span {
  padding: 3px 7px;
  background: #fff;
  font-weight: 700;
}

.qr-tip {
  margin: 0 26px 16px;
  color: #5d6b7b;
  line-height: 1.7;
}

dl {
  width: 300px;
  margin: 0 auto;
  text-align: left;
}

dl div {
  display: flex;
  margin-top: 8px;
}

dt {
  color: #7b8795;
}

dd {
  margin: 0;
  color: #263442;
  font-weight: 600;
}
</style>
