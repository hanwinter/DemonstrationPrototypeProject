<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <section class="legacy-info-bar">
    <span v-for="item in items" :key="item.label"><b>{{ item.label }}：</b>{{ item.value }}</span>
  </section>
</template>

<style scoped>
.legacy-info-bar{min-height:38px;padding:7px 10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px 24px;border:1px solid #d8d8d8;background:#fff;color:#333;font-size:12px}
.legacy-info-bar b{color:#263445;font-weight:600}
</style>
