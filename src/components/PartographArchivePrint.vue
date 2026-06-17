<script setup>
import { computed } from 'vue'

const props = defineProps({
  patient: { type: Object, required: true },
  records: { type: Array, required: true },
})

const startTime = new Date('2026-06-15T13:00:00')
const layout = {
  width: 1030,
  height: 590,
  diagonalWidth: 72,
  timeWidth: 58,
  graphLeft: 130,
  graphRight: 640,
  notesLeft: 640,
  signLeft: 940,
  right: 1030,
  top: 8,
  mainTop: 70,
  mainBottom: 512,
  contractionStartHour: 3,
  contractionEndHour: 18,
  contractionTop: 382,
  contractionBottom: 512,
  bottom: 560,
}

const hours = Array.from({ length: 25 }, (_, hour) => hour)
const noteRows = Array.from({ length: 12 }, (_, index) => index)
const dilationTicks = Array.from({ length: 11 }, (_, value) => value)
const stationTicks = Array.from({ length: 11 }, (_, index) => index - 5)
const fetalHeartTicks = [120, 130, 140, 150, 160]
const contractionTicks = [20, 30, 40, 50, 60]

function parseTime(value) {
  return new Date(value.replace(' ', 'T'))
}

function relativeHour(value) {
  return (parseTime(value) - startTime) / 3600000
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function hourX(hour) {
  return layout.graphLeft + (hour / 24) * (layout.graphRight - layout.graphLeft)
}

function recordX(value) {
  return hourX(clamp(relativeHour(value), 0, 24))
}

function dilationY(value) {
  return layout.mainTop + ((10 - value) / 10) * (layout.mainBottom - layout.mainTop)
}

function stationY(value) {
  return layout.mainTop + ((value + 5) / 10) * (layout.mainBottom - layout.mainTop)
}

function fetalHeartY(value) {
  const top = layout.mainTop
  const height = layout.mainBottom - layout.mainTop
  return top + ((160 - value) / 80) * height
}

function contractionY(value) {
  return layout.contractionTop + ((60 - clamp(value, 20, 60)) / 40) * (layout.contractionBottom - layout.contractionTop)
}

function contractionX(value) {
  return recordX(value)
}

function verticalText(text) {
  return [...text]
}

function timeMeta(hour) {
  const date = new Date(startTime.getTime() + hour * 3600000)
  const previous = new Date(date.getTime() - 3600000)
  const crossesDay = date.getDate() !== previous.getDate()
  return {
    date: date.getDate(),
    hour: crossesDay && date.getHours() === 0 ? '24/0' : String(date.getHours()),
  }
}

function formatDateTime(value) {
  if (!value) return ''
  return String(value).replace('2026-', '').replace(' ', ' ')
}

function intensityMark(intensity) {
  return { 弱: '+', 中: '++', 强: '+++' }[intensity] || ''
}

const sortedRecords = computed(() =>
  [...props.records].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
)

const dilationPoints = computed(() =>
  sortedRecords.value.map((item) => `${recordX(item.time)},${dilationY(item.dilation)}`).join(' '),
)

const stationPoints = computed(() =>
  sortedRecords.value.map((item) => `${recordX(item.time)},${stationY(item.station)}`).join(' '),
)

const fetalHeartPoints = computed(() =>
  sortedRecords.value.map((item) => `${recordX(item.time)},${fetalHeartY(item.fetalHeart)}`).join(' '),
)

const recordByHour = computed(() =>
  new Map(sortedRecords.value.map((item) => [Math.round(relativeHour(item.time)), item])),
)

const contractionRecords = computed(() =>
  sortedRecords.value.filter((item) => {
    const hour = relativeHour(item.time)
    return hour >= layout.contractionStartHour && hour <= layout.contractionEndHour
  }),
)
</script>

<template>
  <article class="archive-form">
    <header class="archive-header">
      <h1>产 程 记 录 单</h1>
      <div class="patient-line">
        <span>姓名 <b>{{ patient.name }}</b></span>
        <span>年龄 <b class="short">{{ patient.age }}</b></span>
        <span class="blank-bracket">（　　　）</span>
        <span>住院号 <b>{{ patient.inpatientNo }}</b></span>
      </div>
    </header>

    <svg :viewBox="`0 0 ${layout.width} ${layout.height}`" class="archive-sheet" aria-label="产程记录单归档打印样式">
      <rect x="0" :y="layout.top" :width="layout.width" :height="layout.bottom - layout.top" fill="none" class="outer-line" />

      <line :x1="layout.notesLeft" :x2="layout.notesLeft" :y1="layout.top" :y2="layout.bottom" class="heavy-line" />
      <line :x1="layout.signLeft" :x2="layout.signLeft" :y1="layout.top" :y2="layout.bottom" class="thin-line" />
      <line :x1="layout.diagonalWidth" :x2="layout.diagonalWidth" :y1="layout.top" :y2="layout.bottom" class="thin-line" />
      <line :x1="layout.diagonalWidth + layout.timeWidth" :x2="layout.diagonalWidth + layout.timeWidth" :y1="layout.top" :y2="layout.bottom" class="thin-line" />

      <line x1="0" :x2="layout.right" :y1="layout.mainTop" :y2="layout.mainTop" class="heavy-line" />
      <line x1="0" :x2="layout.graphRight" :y1="layout.mainBottom" :y2="layout.mainBottom" class="heavy-line" />
      <line x1="0" :x2="layout.graphRight" :y1="layout.bottom" :y2="layout.bottom" class="heavy-line" />

      <line x1="0" :x2="layout.diagonalWidth" :y1="layout.top" :y2="layout.mainTop" class="thin-line" />
      <line x1="0" :x2="layout.diagonalWidth" :y1="layout.mainTop" :y2="layout.top" class="thin-line" />
      <text x="18" y="30" class="normal-text">日</text>
      <text x="48" y="58" class="normal-text">月</text>
      <g class="vertical-label">
        <text
          v-for="(char, index) in verticalText('时间')"
          :key="`time-${char}`"
          :x="layout.diagonalWidth + 28"
          :y="32 + index * 18"
        >
          {{ char }}
        </text>
      </g>

      <text :x="layout.notesLeft + 150" y="48" text-anchor="middle" class="notes-title">处 理 及 附 注</text>
      <text :x="layout.signLeft + 45" y="48" text-anchor="middle" class="notes-title">签 字</text>
      <g v-for="row in noteRows" :key="`note-row-${row}`">
        <line
          :x1="layout.notesLeft"
          :x2="layout.right"
          :y1="layout.mainTop + row * ((layout.bottom - layout.mainTop) / noteRows.length)"
          :y2="layout.mainTop + row * ((layout.bottom - layout.mainTop) / noteRows.length)"
          class="thin-line"
        />
      </g>
      <g v-for="(item, index) in sortedRecords" :key="`note-${item.id}`">
        <text
          :x="layout.notesLeft + 8"
          :y="layout.mainTop + 28 + index * ((layout.bottom - layout.mainTop) / noteRows.length)"
          class="note-text"
        >
          {{ item.note }}
        </text>
      </g>

      <g v-for="hour in hours" :key="`hour-line-${hour}`">
        <line
          :x1="hourX(hour)"
          :x2="hourX(hour)"
          :y1="layout.top"
          :y2="layout.bottom"
          :class="hour % 4 === 0 ? 'heavy-grid-line' : 'grid-line'"
        />
        <text :x="hourX(hour)" :y="layout.mainTop - 10" text-anchor="middle" class="normal-text">
          {{ hour }}
        </text>
      </g>

      <g v-for="tick in dilationTicks" :key="`dilation-${tick}`">
        <line
          :x1="layout.graphLeft"
          :x2="layout.graphRight"
          :y1="dilationY(tick)"
          :y2="dilationY(tick)"
          :class="tick === 5 ? 'heavy-grid-line' : 'grid-line'"
        />
        <text :x="layout.graphLeft - 15" :y="dilationY(tick) + 4" text-anchor="end" class="normal-text">
          {{ tick }}
        </text>
      </g>

      <g v-for="tick in stationTicks" :key="`station-${tick}`">
        <text :x="layout.notesLeft - 22" :y="stationY(tick) + 4" class="normal-text">
          {{ tick > 0 ? `+${tick}` : tick === 0 ? 'S' : tick }}
        </text>
      </g>
      <g v-for="tick in fetalHeartTicks" :key="`fhr-${tick}`">
        <text :x="layout.notesLeft - 38" :y="fetalHeartY(tick) + 4" text-anchor="end" class="normal-text">
          {{ tick }}
        </text>
      </g>

      <text :x="layout.graphLeft + 250" y="34" text-anchor="middle" class="legend-text">宫口开大用○表示</text>
      <g class="vertical-label">
        <text
          v-for="(char, index) in verticalText('胎头下降厘米')"
          :key="`station-title-${char}-${index}`"
          :x="layout.notesLeft - 14"
          :y="400 + index * 13"
          text-anchor="middle"
        >
          {{ char }}
        </text>
        <text :x="layout.notesLeft - 14" y="528" text-anchor="middle">×</text>
      </g>
      <text :x="layout.graphRight - 150" :y="layout.contractionTop - 12" class="legend-text">胎儿娩出－红⊗</text>
      <text :x="layout.graphRight - 115" :y="layout.mainTop + 18" class="legend-text">胎心……红・160</text>

      <polyline :points="dilationPoints" fill="none" stroke="#b22222" stroke-width="1.5" />
      <polyline :points="stationPoints" fill="none" stroke="#111" stroke-width="1.25" />
      <polyline :points="fetalHeartPoints" fill="none" stroke="#b22222" stroke-width="1.05" stroke-dasharray="3 3" />
      <g v-for="item in sortedRecords" :key="`point-${item.id}`">
        <circle :cx="recordX(item.time)" :cy="dilationY(item.dilation)" r="5.2" fill="#fff" stroke="#b22222" stroke-width="1.5" />
        <path
          :d="`M ${recordX(item.time)-5.2} ${stationY(item.station)-5.2} L ${recordX(item.time)+5.2} ${stationY(item.station)+5.2} M ${recordX(item.time)+5.2} ${stationY(item.station)-5.2} L ${recordX(item.time)-5.2} ${stationY(item.station)+5.2}`"
          stroke="#111"
          stroke-width="1.45"
        />
        <circle :cx="recordX(item.time)" :cy="fetalHeartY(item.fetalHeart)" r="2.4" fill="#b22222" />
      </g>

      <text x="26" y="284" class="vertical-side">估计胎儿大小：__________ 克。</text>
      <text x="26" y="470" class="vertical-side">胎位：__________。</text>
      <text x="26" y="536" class="vertical-side">破膜时间：__________。</text>

      <rect
        :x="hourX(layout.contractionStartHour)"
        :y="layout.contractionTop"
        :width="hourX(layout.contractionEndHour) - hourX(layout.contractionStartHour)"
        :height="layout.contractionBottom - layout.contractionTop"
        fill="#fff"
        class="thin-line"
      />
      <text :x="hourX(layout.contractionStartHour) - 45" :y="layout.contractionTop + 35" class="contraction-label">宫缩</text>
      <text :x="hourX(layout.contractionStartHour) - 45" :y="layout.contractionTop + 56" class="contraction-label">持续</text>
      <text :x="hourX(layout.contractionStartHour) - 45" :y="layout.contractionTop + 77" class="contraction-label">时间</text>
      <text :x="hourX(layout.contractionStartHour) - 45" :y="layout.contractionTop + 98" class="contraction-label">&lt;秒&gt;</text>
      <text :x="hourX(layout.contractionStartHour) + 112" :y="layout.contractionTop + 32" class="legend-text">宫缩间歇（每格一小时）</text>
      <text :x="hourX(layout.contractionStartHour) + 113" :y="layout.contractionTop + 58" class="legend-text">弱±　+　++表示强度</text>
      <g
        v-for="hour in hours.filter((item) => item >= layout.contractionStartHour && item <= layout.contractionEndHour)"
        :key="`contraction-hour-${hour}`"
      >
        <line
          :x1="hourX(hour)"
          :x2="hourX(hour)"
          :y1="layout.contractionTop"
          :y2="layout.contractionBottom"
          class="grid-line"
        />
      </g>
      <g v-for="tick in contractionTicks" :key="`contraction-tick-${tick}`">
        <line
          :x1="hourX(layout.contractionStartHour)"
          :x2="hourX(layout.contractionEndHour)"
          :y1="contractionY(tick)"
          :y2="contractionY(tick)"
          class="grid-line"
        />
        <text :x="hourX(layout.contractionStartHour) - 12" :y="contractionY(tick) + 4" text-anchor="end" class="normal-text">
          {{ tick }}
        </text>
      </g>
      <g v-for="item in contractionRecords" :key="`contraction-${item.id}`">
        <line
          :x1="contractionX(item.time)"
          :x2="contractionX(item.time)"
          :y1="contractionY(item.duration)"
          :y2="layout.contractionBottom"
          stroke="#111"
          stroke-width="1.2"
        />
        <text :x="contractionX(item.time)" :y="contractionY(item.duration) - 5" text-anchor="middle" class="strength-mark">
          {{ intensityMark(item.intensity) }}
        </text>
      </g>

      <g v-for="hour in hours.slice(0, 24)" :key="`bottom-time-${hour}`">
        <text :x="(hourX(hour) + hourX(hour + 1)) / 2" :y="layout.contractionBottom + 22" text-anchor="middle" class="normal-text">
          {{ recordByHour.has(hour) ? timeMeta(hour).hour : '' }}
        </text>
        <text :x="(hourX(hour) + hourX(hour + 1)) / 2" :y="layout.contractionBottom + 48" text-anchor="middle" class="normal-text">
          {{ recordByHour.has(hour) ? timeMeta(hour).date : '' }}
        </text>
      </g>
      <text :x="layout.diagonalWidth + 28" :y="layout.contractionBottom + 22" text-anchor="middle" class="normal-text">时</text>
      <text :x="layout.diagonalWidth + 28" :y="layout.contractionBottom + 48" text-anchor="middle" class="normal-text">日</text>
    </svg>

    <footer class="archive-footer">
      <span>估计胎儿大小：<b>{{ patient.fetalWeight }}</b></span>
      <span>胎位：<b>{{ patient.fetalPosition }}</b></span>
      <span>破膜时间：<b>{{ formatDateTime(patient.ruptureTime) }}</b></span>
    </footer>
  </article>
</template>

<style scoped>
.archive-form {
  width: 273mm;
  height: 190mm;
  padding: 0 6mm 3mm;
  display: flex;
  flex-direction: column;
  color: #111;
  background: #fff;
  font-family: "SimSun", "宋体", serif;
  font-size: 10px;
  box-sizing: border-box;
}

.archive-header h1 {
  margin: 2mm 0 4mm;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 12px;
}

.patient-line {
  height: 9mm;
  padding: 0 10mm;
  display: flex;
  align-items: flex-end;
  gap: 7mm;
  font-size: 12px;
  box-sizing: border-box;
}

.patient-line b {
  display: inline-block;
  min-width: 30mm;
  padding: 0 2mm .7mm;
  text-align: center;
  border-bottom: 1px solid #111;
  font-weight: 400;
}

.patient-line b.short {
  min-width: 18mm;
}

.blank-bracket {
  flex: 1;
  text-align: center;
  font-size: 15px;
}

.archive-sheet {
  width: 100%;
  flex: 1;
  display: block;
}

.archive-sheet text {
  fill: #111;
  font-family: "SimSun", "宋体", serif;
  font-size: 10px;
}

.outer-line {
  stroke: #111;
  stroke-width: 1.6;
}

.heavy-line,
.heavy-grid-line {
  stroke: #111;
  stroke-width: 1.1;
}

.thin-line,
.grid-line {
  stroke: #111;
  stroke-width: .55;
}

.notes-title {
  font-size: 14px !important;
  font-weight: 600;
  letter-spacing: 6px;
}

.normal-text {
  font-size: 11px !important;
}

.note-text {
  font-size: 9px !important;
}

.legend-text {
  font-size: 12px !important;
  font-weight: 600;
}

.vertical-label text {
  font-size: 12px !important;
  font-weight: 600;
}

.vertical-side {
  writing-mode: tb;
  glyph-orientation-vertical: 0;
  font-size: 12px !important;
  letter-spacing: 2px;
}

.contraction-label {
  font-size: 12px !important;
  font-weight: 600;
}

.strength-mark {
  font-size: 12px !important;
  font-weight: 700;
}

.archive-footer {
  height: 7mm;
  padding: 0 9mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  box-sizing: border-box;
}

.archive-footer b {
  display: inline-block;
  min-width: 22mm;
  padding-bottom: .5mm;
  text-align: center;
  border-bottom: 1px solid #111;
  font-weight: 400;
}
</style>
