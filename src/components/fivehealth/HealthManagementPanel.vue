<script setup>
defineProps({ management: { type: Object, required: true } })
</script>

<template>
  <div class="management-panel">
    <section class="manage-block">
      <h3>健康标签</h3>
      <div class="tag-list health-tags"><span v-for="tag in management.healthTags" :key="tag">{{ tag }}</span></div>
    </section>
    <section class="manage-block">
      <h3>运营标签</h3>
      <div class="tag-list operation-tags"><span v-for="tag in management.operationTags" :key="tag">{{ tag }}</span></div>
    </section>
    <section class="manage-block timeline-block">
      <h3>随访记录</h3>
      <article v-for="item in management.followUps" :key="item.date + item.type" class="timeline-item">
        <time>{{ item.date }}</time>
        <div><strong>{{ item.type }}</strong><em>{{ item.status }}</em><p>{{ item.note }}</p></div>
      </article>
    </section>
    <section class="manage-block timeline-block">
      <h3>复诊记录</h3>
      <article v-for="item in management.revisits" :key="item.date + item.type" class="timeline-item">
        <time>{{ item.date }}</time>
        <div><strong>{{ item.type }}</strong><em>{{ item.status }}</em><p>{{ item.note }}</p></div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.management-panel{display:grid;grid-template-columns:1fr 1fr;gap:8px}.manage-block{padding:12px;background:#fff;border-radius:12px;box-shadow:0 1px 8px rgba(16,24,40,.04)}.manage-block h3{margin:0 0 12px;color:var(--fh-text-primary);font-size:15px}.tag-list{display:flex;flex-wrap:wrap;gap:8px}.tag-list span{padding:6px 10px;border-radius:999px;font-size:13px}.health-tags span{color:var(--fh-vision);background:#EAF8FF}.health-tags span:nth-child(2){color:var(--fh-body);background:var(--fh-risk-low-bg)}.health-tags span:nth-child(3){color:var(--fh-oral);background:#E9FBF9}.operation-tags span{color:#52637A;background:#EEF2F7}.timeline-block{grid-column:span 1;display:grid;gap:8px}.timeline-item{display:grid;grid-template-columns:92px 1fr;gap:12px;padding:10px;background:linear-gradient(90deg,#FAFBFC,#FFFFFF);border-radius:10px}.timeline-item time{color:var(--fh-text-secondary);font-size:13px}.timeline-item div{min-width:0}.timeline-item strong{color:var(--fh-text-primary);font-size:14px}.timeline-item em{margin-left:8px;padding:3px 8px;color:var(--fh-primary);background:var(--fh-primary-light);border-radius:999px;font-size:12px;font-style:normal}.timeline-item p{margin:7px 0 0;color:var(--fh-text-secondary);font-size:13px;line-height:1.6}
@media (max-width:1200px){.management-panel{grid-template-columns:1fr}.timeline-block{grid-column:auto}}
</style>
