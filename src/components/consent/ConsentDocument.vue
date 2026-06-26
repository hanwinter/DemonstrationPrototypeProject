<script setup>
defineProps({
  document: {
    type: Object,
    required: true,
  },
})

function formatChineseTime(value) {
  if (!value) return '____年__月__日 __时__分'
  const [date = '', time = ''] = value.split(' ')
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')
  return `${year}年${month}月${day}日 ${hour}时${minute}分`
}

function signerTitle(document) {
  if (document.signerRole === '家属代签') return '家属签字'
  return '孕妇签字'
}
</script>

<template>
  <article class="consent-paper">
    <header class="paper-header">
      <h2>北京大学第一医院密云医院</h2>
      <h1>知情同意告知书</h1>
    </header>

    <section class="paper-line">告知时间：{{ formatChineseTime(document.noticeTime) }}</section>

    <section class="paper-section">
      <h3>病情摘要：</h3>
      <p>{{ document.illnessSummary }}</p>
    </section>

    <section class="paper-section">
      <h3>风险告知：</h3>
      <p>{{ document.riskNotice }}</p>
    </section>

    <section class="paper-section confirm-section">
      <h3>知情确认：</h3>
      <p>{{ document.confirmText }}</p>
    </section>

    <section class="signature-area">
      <div class="signature-block">
        <div class="signature-row">
          <span class="signature-label">医生签字：</span>
          <span class="signature-line" :class="{ signed: document.doctorSignature }">
            {{ document.doctorSignature || '' }}
          </span>
        </div>
        <div class="signature-meta-row">
          <span class="signature-label">签字时间：</span>
          <span>{{ document.doctorSignedAt || '____年__月__日 __时__分' }}</span>
        </div>
      </div>

      <div class="signature-block">
        <div class="signature-row">
          <span class="signature-label">{{ signerTitle(document) }}：</span>
          <span class="signature-line" :class="{ signed: document.patientSignature }">
            {{ document.patientSignature || '' }}
          </span>
        </div>
        <div class="signature-meta-row">
          <span class="signature-label">签字人：</span>
          <span>{{ document.signer || '____' }} {{ document.signerRole ? `（${document.signerRole}）` : '' }}</span>
        </div>
        <div class="signature-meta-row">
          <span class="signature-label">签字时间：</span>
          <span>{{ document.patientSignedAt || '____年__月__日 __时__分' }}</span>
        </div>
      </div>
    </section>

    <footer v-if="document.status === 'voided'" class="void-mark">
      已作废：{{ document.voidReason || '未填写原因' }}
    </footer>
  </article>
</template>

<style scoped>
.consent-paper {
  width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  padding: 56px 64px;
  color: #1f2933;
  font-family: SimSun, "宋体", serif;
  background: #fff;
  border: 1px solid #d9e1ea;
  box-shadow: 0 2px 10px rgba(40, 58, 78, 0.12);
}

.paper-header {
  text-align: center;
}

.paper-header h2 {
  margin: 0 0 14px;
  font-family: SimSun, "宋体", serif;
  font-size: 20pt;
  font-weight: 700;
}

.paper-header h1 {
  margin: 0 0 34px;
  font-family: SimSun, "宋体", serif;
  font-size: 18pt;
  font-weight: 700;
}

.paper-line {
  margin-bottom: 24px;
  font-family: SimSun, "宋体", serif;
  font-size: 10.5pt;
}

.paper-section {
  margin-bottom: 28px;
}

.paper-section h3 {
  margin: 0 0 10px;
  font-family: SimSun, "宋体", serif;
  font-size: 10.5pt;
  font-weight: 700;
}

.paper-section p {
  margin: 0;
  min-height: 84px;
  color: #263442;
  font-family: SimSun, "宋体", serif;
  font-size: 10.5pt;
  line-height: 1.5;
  text-indent: 2em;
  white-space: pre-wrap;
  word-break: break-word;
}

.confirm-section p {
  min-height: 56px;
}

.signature-area {
  width: 330px;
  margin: 36px 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #202b38;
  font-family: SimSun, "宋体", serif;
  font-size: 10.5pt;
}

.signature-row {
  height: 38px;
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: end;
}

.signature-label {
  line-height: 30px;
  text-align: right;
}

.signature-line {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2d3642;
}

.signature-line.signed {
  color: #17212f;
  font-family: SimSun, "宋体", serif;
  font-size: 10.5pt;
}

.signature-meta-row {
  margin-top: 4px;
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  color: #3d4a59;
  line-height: 1.5;
}

.signature-meta-row .signature-label {
  line-height: 1.5;
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




