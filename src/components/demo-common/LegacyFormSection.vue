<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <section class="legacy-form-section">
    <header>{{ title }}<slot name="extra" /></header>
    <div class="legacy-form-section__body"><slot /></div>
  </section>
</template>

<style scoped>
.legacy-form-section{margin-bottom:10px;border:1px solid #d8d8d8;background:#fff;color:#333;font-size:12px}
.legacy-form-section header{height:30px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-weight:600}
.legacy-form-section__body{padding:10px}
</style>
