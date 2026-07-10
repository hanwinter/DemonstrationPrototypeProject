<script setup>
import ThreeHumanViewer from '../three/ThreeHumanViewer.vue'

defineProps({
  selected: { type: Object, required: true },
  show3D: { type: Boolean, required: true },
  summary: { type: Object, required: true },
  threeAbnormalities: { type: Array, required: true },
})
const emit = defineEmits(['select-organ', 'update:show3D'])
</script>

<template>
  <article class="panel portrait-card fh-card">
    <div class="panel-title">
      <h3>人体健康画像</h3>
      <div class="view-switch">
        <button :class="{active:!show3D}" @click="emit('update:show3D', false)">二维</button>
        <button :class="{active:show3D}" @click="emit('update:show3D', true)">3D</button>
      </div>
    </div>
    <div class="portrait-body">
      <ThreeHumanViewer v-if="show3D" :abnormalities="threeAbnormalities" @select="emit('select-organ', $event.organ === 'eye_left' ? 'eye' : $event.organ)" />
      <div v-else class="body-area">
        <div class="growth-silhouette"></div>
        <svg viewBox="0 0 260 440">
          <defs><linearGradient id="humanGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#A8D8FF"/><stop offset="1" stop-color="#6BAAF8"/></linearGradient></defs>
          <g class="body-base"><circle cx="130" cy="48" r="30"/><path d="M105 86Q130 76 155 86L174 198 158 282 151 410H125L117 282 109 410H83L102 282 86 198Z"/><path d="M91 101 52 230M169 101 208 230"/></g>
          <ellipse class="spot eye" :class="{active:selected.organ==='eye'}" cx="119" cy="45" rx="11" ry="7" @click="emit('select-organ', 'eye')"/>
          <path class="spot spine" :class="{active:selected.organ==='spine'}" d="M130 91C122 122 138 151 128 181S136 235 128 270" @click="emit('select-organ', 'spine')"/>
          <ellipse class="spot body-risk" :class="{active:selected.organ==='body'}" cx="130" cy="184" rx="49" ry="91" @click="emit('select-organ', 'body')"/>
        </svg>
      </div>
    </div>
  </article>
</template>

<style scoped>
.panel-title{height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--fh-border-light);background:linear-gradient(90deg,#F0F7FF,#FFFFFF)}.panel-title h3{margin:0;color:var(--fh-text-primary);font-size:16px}.view-switch{padding:3px;display:flex;background:var(--fh-control-bg);border-radius:6px}.view-switch button{height:30px;padding:0 12px;color:#344054;border:0;border-radius:6px;background:transparent;cursor:pointer}.view-switch button.active{color:#fff;background:var(--fh-primary);box-shadow:0 2px 8px rgba(91,143,249,.22)}.portrait-body{min-height:292px}.body-area{position:relative;min-height:292px;display:grid;place-items:center;overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(91,143,249,.12),transparent 42%),linear-gradient(180deg,#FFFFFF 0%,#F5F9FF 100%)}.body-area::before,.body-area::after{content:'';position:absolute;border-radius:999px;pointer-events:none}.body-area::before{width:220px;height:220px;background:rgba(90,200,250,.08);left:calc(50% - 110px);top:38px}.body-area::after{width:180px;height:180px;border:1px solid rgba(91,143,249,.10);left:calc(50% - 90px);top:58px}.growth-silhouette{position:absolute;width:88px;height:180px;right:12%;bottom:28px;opacity:.07;background:linear-gradient(180deg,var(--fh-body),var(--fh-primary));clip-path:polygon(45% 0,58% 0,67% 15%,65% 42%,78% 100%,57% 100%,52% 55%,45% 100%,24% 100%,38% 42%,36% 15%)}.portrait-card :deep(.three-human-viewer){height:292px;background:#F5F9FF;border-radius:0 0 var(--fh-card-radius) var(--fh-card-radius)}svg{position:relative;z-index:1;width:172px;height:286px;filter:drop-shadow(0 16px 22px rgba(91,143,249,.20));opacity:.96}.body-base{fill:url(#humanGradient);stroke:#D6ECFF;stroke-width:2}.body-base path:last-child{fill:none;stroke-width:19;stroke-linecap:round}.spot{cursor:pointer}.eye{fill:var(--fh-vision)}.spine{fill:none;stroke:var(--fh-bone);stroke-width:12;stroke-linecap:round}.body-risk{fill:rgba(52,199,89,.14);stroke:var(--fh-body);stroke-width:2}.spot.active{filter:drop-shadow(0 0 9px rgba(91,143,249,.65))}
</style>
