<script setup>
const props = defineProps({ trends: { type: Array, required: true } })
const points = trend => {
  const max = Math.max(...trend.values)
  const min = Math.min(...trend.values)
  const range = Math.max(max - min, 1)
  return trend.values.map((value, index) => {
    const x = 18 + index * (164 / Math.max(trend.values.length - 1, 1))
    const y = 84 - ((value - min) / range) * 56
    return `${x},${y}`
  }).join(' ')
}
</script>

<template>
  <div class="trend-grid">
    <article v-for="trend in trends" :key="trend.id" class="trend-card">
      <div class="trend-head"><h3>{{ trend.title }}</h3><strong :style="{color:trend.color}">{{ trend.current }}{{ trend.unit }}</strong></div>
      <svg viewBox="0 0 200 110" preserveAspectRatio="none">
        <line x1="18" y1="84" x2="188" y2="84"/>
        <line x1="18" y1="22" x2="18" y2="84"/>
        <polyline :points="points(trend)" :stroke="trend.color"/>
        <circle v-for="point in points(trend).split(' ')" :key="point" :cx="point.split(',')[0]" :cy="point.split(',')[1]" r="3" :fill="trend.color"/>
      </svg>
      <div class="years"><span v-for="label in trend.labels" :key="label">{{ label }}</span></div>
      <p>{{ trend.description }}</p>
    </article>
  </div>
</template>

<style scoped>
.trend-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.trend-card{min-height:260px;padding:12px;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.04)}.trend-head{display:flex;align-items:center;justify-content:space-between}.trend-head h3{margin:0;color:var(--fh-text-primary);font-size:15px}.trend-head strong{font-size:24px}svg{width:100%;height:130px;margin-top:10px;background:radial-gradient(circle at 70% 20%,rgba(91,143,249,.08),transparent 42%),linear-gradient(180deg,#FFFFFF 0%,#F5F9FF 100%);border-radius:12px}line{stroke:var(--fh-border-light);stroke-width:1}polyline{fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.years{display:flex;justify-content:space-between;color:var(--fh-text-tertiary);font-size:12px}p{margin:12px 0 0;color:var(--fh-text-secondary);line-height:1.7;font-size:13px}
@media (max-width:1300px){.trend-grid{grid-template-columns:1fr}}
</style>



