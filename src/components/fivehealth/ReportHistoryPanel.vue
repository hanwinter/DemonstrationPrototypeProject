<script setup>
defineProps({ reports: { type: Array, required: true } })
</script>

<template>
  <div class="report-history">
    <div v-for="report in reports" :key="report.id" class="report-row">
      <div class="report-date"><strong>{{ report.date }}</strong><span>五健筛查记录</span></div>
      <div class="report-metric"><span>异常项</span><b>{{ report.abnormalCount }}</b></div>
      <div class="report-metric"><span>高风险</span><b class="danger">{{ report.highRiskCount }}</b></div>
      <div class="assessment">{{ report.assessment }}</div>
      <button>查看</button>
    </div>
  </div>
</template>

<style scoped>
.report-history{display:grid;gap:8px}.report-row{min-height:68px;padding:10px 12px;display:grid;grid-template-columns:1.35fr .62fr .62fr .75fr 64px;align-items:center;gap:10px;background:#fff;border-radius:12px;box-shadow:0 1px 8px rgba(16,24,40,.04);transition:background .16s,transform .16s}.report-row:hover{background:var(--fh-hover-bg);transform:translateY(-1px)}.report-date{display:flex;flex-direction:column;gap:5px}.report-date strong{color:var(--fh-text-primary);font-size:15px}.report-date span,.report-metric span{color:var(--fh-text-tertiary);font-size:12px}.report-metric{display:flex;align-items:baseline;gap:7px}.report-metric b{color:var(--fh-risk-medium);font-size:22px}.report-metric .danger{color:var(--fh-risk-high)}.assessment{padding:6px 10px;width:max-content;color:var(--fh-risk-attention);background:var(--fh-risk-attention-bg);border-radius:999px;font-size:12px}button{height:30px;color:var(--fh-primary);border:0;border-radius:6px;background:transparent;cursor:pointer}button:hover{background:var(--fh-primary-light)}
</style>
