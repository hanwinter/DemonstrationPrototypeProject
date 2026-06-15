<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const outpatientImageUrl = `${import.meta.env.BASE_URL}outpatient-page.png`

function openScanner() {
  router.push('/ocr-recognition')
}
</script>

<template>
  <main class="outpatient-page">
    <div class="outpatient-image-wrap">
      <img :src="outpatientImageUrl" alt="门诊管理页面" />
      <button
        class="scanner-hotspot"
        type="button"
        title="进入高拍仪识别"
        aria-label="进入高拍仪识别"
        @click="openScanner"
      ></button>
    </div>
  </main>
</template>

<style scoped>
.outpatient-page {
  min-width: 1180px;
  min-height: 100vh;
  overflow: auto;
  background: #f4f6f9;
}

.outpatient-image-wrap {
  position: relative;
  width: 100%;
  min-width: 1180px;
}

.outpatient-image-wrap img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

.scanner-hotspot {
  position: absolute;
  top: 19.7%;
  left: 64.5%;
  width: 5.2%;
  height: 3.2%;
  min-width: 76px;
  min-height: 28px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.scanner-hotspot:hover,
.scanner-hotspot:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: -2px;
  box-shadow: 0 0 0 2px #447afc;
}
</style>
