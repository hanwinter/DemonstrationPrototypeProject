<script setup>
const props = defineProps({
  document: {
    type: Object,
    required: true,
  },
  copies: {
    type: Array,
    default: () => [
      { index: '一', label: '医院留存' },
      { index: '二', label: '孕产妇留存' },
      { index: '三', label: '档案留存' },
    ],
  },
})

function formatChineseTime(value) {
  if (!value) return '____年__月__日 __时__分'
  const [date = '', time = ''] = value.split(' ')
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')
  return `${year}年${month}月${day}日 ${hour}时${minute}分`
}
</script>

<template>
  <div class="consent-document-stack">
    <article v-for="copy in props.copies" :key="copy.index" class="consent-paper">
      <header class="paper-header">
        <h2>北京大学第一医院密云医院</h2>
        <h1>知情同意告知书（{{ copy.index }}）{{ copy.label }}</h1>
      </header>

      <section class="paper-line">时间：{{ formatChineseTime(document.noticeTime) }}</section>

      <section class="paper-section">
        <h3>病情摘要：</h3>
        <p>{{ document.illnessSummary }}</p>
      </section>

      <section class="paper-section">
        <h3>风险告知：</h3>
        <p>{{ document.riskNotice }}</p>
      </section>

      <section class="signature-grid">
        <div class="signature-block">
          <h3>医生签字：</h3>
          <div class="signature-box" :class="{ signed: document.doctorSignature }">
            {{ document.doctorSignature || '待签字' }}
          </div>
          <div>签字时间：{{ document.doctorSignedAt || '____' }}</div>
        </div>
        <div class="signature-block">
          <h3>孕妇或家属签字：</h3>
          <p class="confirm-text">{{ document.confirmText }}</p>
          <div class="signature-box" :class="{ signed: document.patientSignature }">
            {{ document.patientSignature || '待签字' }}
          </div>
          <div>签字人：{{ document.signer || '____' }} {{ document.signerRole ? `（${document.signerRole}）` : '' }}</div>
          <div>签字时间：{{ document.patientSignedAt || '____' }}</div>
        </div>
      </section>

      <footer v-if="document.status === 'voided'" class="void-mark">
        已作废：{{ document.voidReason || '未填写原因' }}
      </footer>
    </article>
  </div>
</template>

<style scoped>
.consent-document-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.consent-paper {
  width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  padding: 56px 64px;
  color: #1f2933;
  background: #fff;
  border: 1px solid #d9e1ea;
  box-shadow: 0 2px 10px rgba(40, 58, 78, 0.12);
  page-break-after: always;
}

.paper-header {
  text-align: center;
}

.paper-header h2 {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
}

.paper-header h1 {
  margin: 0 0 36px;
  font-size: 25px;
  font-weight: 700;
}

.paper-line {
  margin-bottom: 26px;
  font-size: 17px;
}

.paper-section {
  margin-bottom: 30px;
}

.paper-section h3,
.signature-block h3 {
  margin: 0 0 10px;
  font-size: 17px;
}

.paper-section p,
.confirm-text {
  margin: 0;
  min-height: 92px;
  color: #263442;
  font-size: 16px;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-word;
}

.signature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 36px;
}

.signature-block {
  font-size: 15px;
  line-height: 1.9;
}

.signature-box {
  height: 72px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b98a7;
  border-bottom: 1px solid #2d3642;
}

.signature-box.signed {
  color: #17212f;
  font-family: "KaiTi", "STKaiti", serif;
  font-size: 30px;
}

.void-mark {
  margin-top: 36px;
  padding: 10px 14px;
  color: #b42318;
  border: 1px solid #f1b7b2;
  background: #fff5f4;
}

@media print {
  .consent-paper {
    width: auto;
    min-height: auto;
    margin: 0;
    padding: 22mm 18mm;
    border: 0;
    box-shadow: none;
  }
}
</style>
