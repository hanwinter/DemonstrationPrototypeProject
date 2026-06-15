<script setup>
import { computed } from 'vue'

const props = defineProps({
  patient: { type: Object, required: true },
  records: { type: Array, required: true },
})

const startTime = new Date('2026-06-15T13:00:00')
const unified = {
  width: 840,
  height: 548,
  left: 56,
  right: 52,
  mainTop: 14,
  mainBottom: 306,
  firstTimeBottom: 329,
  firstDateBottom: 352,
  contractionTop: 352,
  contractionBottom: 477,
  secondTimeBottom: 500,
  secondDateBottom: 523,
}
const hours = Array.from({ length: 25 }, (_, hour) => hour)
const dataHours = hours.slice(0, 24)
const dilationTicks = Array.from({ length: 11 }, (_, value) => value)

function parseTime(value) {
  return new Date(value.replace(' ', 'T'))
}

function relativeHour(value) {
  return (parseTime(value) - startTime) / 3600000
}

function xPoint(value) {
  return unified.left + (relativeHour(value) / 24) * (unified.width - unified.left - unified.right)
}

function hourX(hour) {
  return unified.left + (hour / 24) * (unified.width - unified.left - unified.right)
}

function dilationY(value) {
  return unified.mainTop + ((10 - value) / 10) * (unified.mainBottom - unified.mainTop)
}

function stationY(value) {
  return unified.mainTop + ((value + 5) / 10) * (unified.mainBottom - unified.mainTop)
}

function contractionY(value) {
  const normalized = Math.max(0, Math.min(60, value))
  return unified.contractionTop + ((60 - normalized) / 60) * (unified.contractionBottom - unified.contractionTop)
}

const sortedRecords = computed(() =>
  [...props.records].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
)
const dilationPoints = computed(() =>
  sortedRecords.value.map((item) => `${xPoint(item.time)},${dilationY(item.dilation)}`).join(' '),
)
const stationPoints = computed(() =>
  sortedRecords.value.map((item) => `${xPoint(item.time)},${stationY(item.station)}`).join(' '),
)
const recordByHour = computed(() =>
  new Map(sortedRecords.value.map((item) => [Math.round(relativeHour(item.time)), item])),
)

function timeMeta(hour) {
  const date = new Date(startTime.getTime() + hour * 3600000)
  const previous = new Date(date.getTime() - 3600000)
  const crossesDay = date.getDate() !== previous.getDate()
  return {
    date: date.getDate(),
    hour: crossesDay && date.getHours() === 0 ? '24/0' : String(date.getHours()),
  }
}

function intensityMark(intensity) {
  return { 弱: '+', 中: '++', 强: '+++' }[intensity] || ''
}
</script>

<template>
  <article class="archive-form">
    <header class="archive-header">
      <h1>产 程 记 录 单</h1>
      <div class="archive-patient-line">
        <span>姓名 <b>{{ patient.name }}</b></span>
        <span>年龄 <b>{{ patient.age }}岁</b></span>
        <span class="archive-number">住院号 <b>{{ patient.inpatientNo }}</b></span>
      </div>
    </header>

    <table class="archive-main-table">
      <tbody>
        <tr>
          <td class="archive-left-cell">
            <div class="archive-chart-heading">
              <span>宫口开大用<span class="circle-symbol">○</span>表示</span>
              <span>胎头下降用<span class="cross-symbol">×</span>表示</span>
            </div>

            <svg :viewBox="`0 0 ${unified.width} ${unified.height}`" class="unified-chart" aria-label="统一归档产程图">
              <line :x1="unified.left" :x2="unified.left" :y1="unified.mainTop" :y2="unified.secondDateBottom" class="section-line" />
              <line :x1="unified.width-unified.right" :x2="unified.width-unified.right" :y1="unified.mainTop" :y2="unified.secondDateBottom" class="section-line" />
              <g v-for="tick in dilationTicks" :key="`y-${tick}`">
                <line
                  :x1="unified.left" :x2="unified.width-unified.right"
                  :y1="dilationY(tick)" :y2="dilationY(tick)"
                  stroke="#222" :stroke-width="tick === 5 ? 1 : 0.45"
                />
                <text :x="unified.left-10" :y="dilationY(tick)+3" text-anchor="end">{{ tick }}</text>
                <text :x="unified.width-unified.right+9" :y="stationY(tick-5)+3">
                  {{ tick-5 > 0 ? `+${tick-5}` : tick-5 }}
                </text>
              </g>
              <g v-for="hour in hours" :key="`h-${hour}`">
                <line
                  :x1="hourX(hour)" :x2="hourX(hour)"
                  :y1="unified.mainTop" :y2="unified.secondDateBottom"
                  stroke="#222" :stroke-width="hour % 4 === 0 ? 0.85 : 0.4"
                />
                <text :x="hourX(hour)" :y="unified.mainBottom-6" text-anchor="middle">{{ hour }}</text>
              </g>
              <line x1="0" :x2="unified.width" :y1="unified.mainBottom" :y2="unified.mainBottom" class="section-line" />
              <line x1="0" :x2="unified.width" :y1="unified.firstTimeBottom" :y2="unified.firstTimeBottom" class="thin-section-line" />
              <line x1="0" :x2="unified.width" :y1="unified.firstDateBottom" :y2="unified.firstDateBottom" class="section-line" />
              <line x1="0" :x2="unified.width" :y1="unified.contractionBottom" :y2="unified.contractionBottom" class="section-line" />
              <line x1="0" :x2="unified.width" :y1="unified.secondTimeBottom" :y2="unified.secondTimeBottom" class="thin-section-line" />
              <line x1="0" :x2="unified.width" :y1="unified.secondDateBottom" :y2="unified.secondDateBottom" class="section-line" />
              <text x="17" y="105" class="vertical-title">
                <tspan x="17">宫</tspan><tspan x="17" dy="15">口</tspan><tspan x="17" dy="15">开</tspan>
                <tspan x="17" dy="15">大</tspan><tspan x="17" dy="15">厘</tspan><tspan x="17" dy="15">米</tspan>
              </text>
              <text :x="unified.width-18" y="105" class="vertical-title">
                <tspan :x="unified.width-18">胎</tspan><tspan :x="unified.width-18" dy="15">头</tspan>
                <tspan :x="unified.width-18" dy="15">下</tspan><tspan :x="unified.width-18" dy="15">降</tspan>
                <tspan :x="unified.width-18" dy="15">厘</tspan><tspan :x="unified.width-18" dy="15">米</tspan>
              </text>
              <polyline :points="dilationPoints" fill="none" stroke="#b22222" stroke-width="1.7" />
              <polyline :points="stationPoints" fill="none" stroke="#111" stroke-width="1.4" />
              <g v-for="item in sortedRecords" :key="item.id">
                <circle :cx="xPoint(item.time)" :cy="dilationY(item.dilation)" r="4" fill="#fff" stroke="#b22222" stroke-width="1.7" />
                <path
                  :d="`M ${xPoint(item.time)-4} ${stationY(item.station)-4} L ${xPoint(item.time)+4} ${stationY(item.station)+4} M ${xPoint(item.time)+4} ${stationY(item.station)-4} L ${xPoint(item.time)-4} ${stationY(item.station)+4}`"
                  stroke="#111" stroke-width="1.5"
                />
              </g>
              <text x="28" :y="(unified.mainBottom + unified.firstTimeBottom) / 2 + 3" text-anchor="middle" class="row-heading">时间</text>
              <text x="28" :y="(unified.firstTimeBottom + unified.firstDateBottom) / 2 + 3" text-anchor="middle" class="row-heading">日期</text>
              <text x="28" :y="(unified.contractionBottom + unified.secondTimeBottom) / 2 + 3" text-anchor="middle" class="row-heading">时间</text>
              <text x="28" :y="(unified.secondTimeBottom + unified.secondDateBottom) / 2 + 3" text-anchor="middle" class="row-heading">日期</text>
              <g v-for="hour in dataHours" :key="`meta-${hour}`">
                <text :x="(hourX(hour)+hourX(hour+1))/2" :y="unified.firstTimeBottom-7" text-anchor="middle">
                  {{ recordByHour.has(hour) ? timeMeta(hour).hour : '' }}
                </text>
                <text :x="(hourX(hour)+hourX(hour+1))/2" :y="unified.firstDateBottom-7" text-anchor="middle">
                  {{ recordByHour.has(hour) ? timeMeta(hour).date : '' }}
                </text>
                <text :x="(hourX(hour)+hourX(hour+1))/2" :y="unified.secondTimeBottom-7" text-anchor="middle">
                  {{ recordByHour.has(hour) ? timeMeta(hour).hour : '' }}
                </text>
                <text :x="(hourX(hour)+hourX(hour+1))/2" :y="unified.secondDateBottom-7" text-anchor="middle">
                  {{ recordByHour.has(hour) ? timeMeta(hour).date : '' }}
                </text>
              </g>
              <text :x="unified.width/2" :y="unified.contractionTop+13" text-anchor="middle" class="contraction-heading">宫 缩 图</text>
              <g v-for="value in [20, 40, 60]" :key="value">
                <line
                  :x1="unified.left" :x2="unified.width-unified.right"
                  :y1="contractionY(value)" :y2="contractionY(value)"
                  stroke="#333" stroke-width="0.45"
                />
                <text :x="unified.left-8" :y="contractionY(value)+3" text-anchor="end">{{ value }}秒</text>
              </g>
              <text :x="unified.left-8" :y="unified.contractionBottom-3" text-anchor="end">&lt;20秒</text>
              <g v-for="item in sortedRecords" :key="`contraction-${item.id}`">
                <line
                  :x1="xPoint(item.time)" :x2="xPoint(item.time)"
                  :y1="contractionY(item.duration)" :y2="unified.contractionBottom"
                  stroke="#111" stroke-width="1.2"
                />
                <text :x="xPoint(item.time)" :y="contractionY(item.duration)-4" text-anchor="middle" class="strength-mark">
                  {{ intensityMark(item.intensity) }}
                </text>
                <text :x="xPoint(item.time)" :y="unified.contractionBottom-4" text-anchor="middle">
                  {{ item.duration }}
                </text>
              </g>
            </svg>

            <div class="archive-fetal-line">
              <span>胎儿娩出：________</span>
              <span>胎心：________ 次/分</span>
            </div>
          </td>

          <td class="archive-notes-cell">
            <table class="notes-table">
              <thead>
                <tr>
                  <th>处 理 及 附 注</th>
                  <th>签 字</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hour in dataHours" :key="`note-${hour}`">
                  <td>{{ recordByHour.get(hour)?.note || '' }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <footer class="archive-footer">
      <span>估计胎儿大小：<b>{{ patient.fetalWeight }}</b></span>
      <span>胎位：<b>{{ patient.fetalPosition }}</b></span>
      <span>破膜时间：<b>{{ patient.ruptureTime }}</b></span>
    </footer>
  </article>
</template>

<style scoped>
.archive-form {
  width: 273mm;
  height: 190mm;
  padding: 0;
  display: flex;
  flex-direction: column;
  color: #111;
  background: #fff;
  font-family: "SimSun", "宋体", serif;
  font-size: 9px;
  box-sizing: border-box;
}
.archive-header h1 { margin: 2mm 0 3.5mm; text-align: center; font-size: 23px; font-weight: 500; letter-spacing: 8px; }
.archive-patient-line { height: 8mm; padding: 0 3mm 1.5mm; display: flex; align-items: flex-end; gap: 18mm; border-bottom: 1.3px solid #111; font-size: 11px; box-sizing: border-box; }
.archive-patient-line b { display: inline-block; min-width: 24mm; padding: 0 2mm .8mm; text-align: center; border-bottom: 1px solid #111; }
.archive-number { margin-left: auto; }
.archive-main-table { width: 100%; flex: 1; table-layout: fixed; border-collapse: collapse; border: 1.3px solid #111; border-top: 0; }
.archive-main-table > tbody > tr > td { padding: 0; vertical-align: top; border: 1.3px solid #111; }
.archive-left-cell { width: 68%; }
.archive-notes-cell { width: 32%; }
.archive-chart-heading { height: 6mm; padding: 0 4mm; display: flex; align-items: center; justify-content: flex-end; gap: 7mm; border-bottom: 1px solid #111; box-sizing: border-box; }
.circle-symbol { font-size: 14px; }
.cross-symbol { font-size: 14px; }
.unified-chart { width: 100%; height: 130mm; display: block; border-bottom: 1px solid #111; }
.unified-chart text { fill: #111; font-size: 8px; font-family: "SimSun", "宋体", serif; }
.section-line { stroke: #111; stroke-width: 1; }
.thin-section-line { stroke: #222; stroke-width: .5; }
.vertical-title { font-weight: 600; }
.row-heading { font-size: 8px !important; }
.contraction-heading { font-size: 10px !important; letter-spacing: 4px; }
.strength-mark { font-size: 10px !important; font-weight: 700; }
.archive-fetal-line { height: 7mm; padding: 0 6mm; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; }
.notes-table { width: 100%; height: 100%; table-layout: fixed; border-collapse: collapse; }
.notes-table th, .notes-table td { border: .7px solid #111; }
.notes-table th:first-child, .notes-table td:first-child { width: 76%; }
.notes-table th:last-child, .notes-table td:last-child { width: 24%; border-right: 0; }
.notes-table th { height: 17mm; font-size: 13px; font-weight: 500; letter-spacing: 4px; }
.notes-table td { height: 5.05mm; padding: .5mm 1mm; overflow: hidden; font-size: 8px; box-sizing: border-box; }
.archive-footer { height: 9mm; padding: 0 5mm; display: flex; align-items: center; justify-content: space-between; border: 1.3px solid #111; border-top: 0; font-size: 10px; box-sizing: border-box; }
.archive-footer b { display: inline-block; min-width: 23mm; padding-bottom: .8mm; text-align: center; border-bottom: 1px solid #111; }
</style>
