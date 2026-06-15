<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  records: { type: Array, required: true },
  compact: { type: Boolean, default: false },
})

const chartElement = ref()
const activeRange = ref('all')
let chartInstance
let resizeObserver

const startTime = new Date('2026-06-15T13:00:00')
const ranges = [
  { key: 'all', label: '全部', hours: null },
  { key: '4h', label: '最近4小时', hours: 4 },
  { key: '8h', label: '最近8小时', hours: 8 },
  { key: '24h', label: '24小时', hours: 24 },
]

function parseTime(value) {
  return new Date(value.replace(' ', 'T'))
}

function relativeHour(value) {
  return Math.round((parseTime(value) - startTime) / 3600000)
}

function formatActualTime(hour) {
  const date = new Date(startTime.getTime() + hour * 3600000)
  return `${String(date.getHours()).padStart(2, '0')}:00`
}

const sortedRecords = computed(() =>
  [...props.records].sort((a, b) => parseTime(a.time) - parseTime(b.time)),
)

function loadEcharts() {
  if (window.echarts) return Promise.resolve(window.echarts)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-echarts-local]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.echarts), { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = `${import.meta.env.BASE_URL}echarts.min.js`
    script.dataset.echartsLocal = 'true'
    script.onload = () => resolve(window.echarts)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function buildTimeline() {
  const firstHour = Math.min(0, relativeHour(sortedRecords.value[0]?.time || startTime.toISOString()))
  const lastHour = Math.max(firstHour + 1, relativeHour(sortedRecords.value.at(-1)?.time || startTime.toISOString()))
  const hours = Array.from({ length: lastHour - firstHour + 1 }, (_, index) => firstHour + index)
  const recordsByHour = new Map(sortedRecords.value.map((item) => [relativeHour(item.time), item]))
  return { firstHour, lastHour, hours, recordsByHour }
}

function chartOption() {
  const { hours, recordsByHour } = buildTimeline()
  const actualTimes = hours.map(formatActualTime)
  const seriesData = (key) => hours.map((hour) => recordsByHour.get(hour)?.[key] ?? null)
  const crossSymbol = 'path://M-6,-1 L-1,-1 L-1,-6 L1,-6 L1,-1 L6,-1 L6,1 L1,1 L1,6 L-1,6 L-1,1 L-6,1 Z'
  const commonCategoryAxis = {
    type: 'category',
    data: hours,
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#cbd8e1' } },
    axisTick: { show: false },
  }

  return {
    animationDuration: 300,
    color: ['#e34b5f', '#3978d4', '#16a085', '#7c9fbd'],
    legend: {
      top: 5,
      right: 12,
      itemWidth: 20,
      itemHeight: 7,
      textStyle: { color: '#5e7080', fontSize: 12 },
      data: ['宫口扩张', '胎先露高低', '胎心率', '宫缩持续'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', link: [{ xAxisIndex: 'all' }], lineStyle: { color: '#9db1c0', type: 'dashed' } },
      formatter(params) {
        const hour = Number(params[0]?.axisValue)
        const record = recordsByHour.get(hour)
        const fullTime = new Date(startTime.getTime() + hour * 3600000)
        const pad = (value) => String(value).padStart(2, '0')
        const dateTime = `${fullTime.getFullYear()}-${pad(fullTime.getMonth() + 1)}-${pad(fullTime.getDate())} ${pad(fullTime.getHours())}:00`
        if (!record) return `<strong>${dateTime}</strong><br/>相对小时：${hour}h<br/>暂无观察记录`
        const frequency = record.interval ? Math.max(1, Math.round(10 / record.interval)) : '-'
        return [
          `<strong>${record.time}</strong>`,
          `相对小时：${hour}h`,
          `宫口扩张：${record.dilation} cm`,
          `胎先露高低：${record.station > 0 ? '+' : ''}${record.station}`,
          `胎心率：${record.fetalHeart} bpm`,
          `宫缩间隔：${record.interval} min`,
          `宫缩持续：${record.duration} sec`,
          `宫缩强度：${record.intensity}`,
          `宫缩频率：${frequency}次/10分钟`,
          `羊水情况：${record.amnioticFluid}`,
        ].join('<br/>')
      },
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    grid: props.compact
      ? [
          { left: 72, right: 72, top: 48, height: 180 },
          { left: 72, right: 72, top: 270, height: 78 },
          { left: 72, right: 72, top: 382, height: 58 },
        ]
      : [
          { left: 72, right: 72, top: 52, height: 285 },
          { left: 72, right: 72, top: 385, height: 125 },
          { left: 72, right: 72, top: 558, height: 105 },
        ],
    xAxis: [
      {
        ...commonCategoryAxis,
        gridIndex: 0,
        position: 'top',
        axisLabel: { formatter: '{value}h', color: '#1683a3', fontWeight: 600 },
        splitLine: { show: true, lineStyle: { color: '#e1e9ef' } },
      },
      {
        ...commonCategoryAxis,
        gridIndex: 0,
        position: 'bottom',
        axisLabel: { formatter: (value) => formatActualTime(Number(value)), color: '#66798b', margin: 11 },
      },
      {
        ...commonCategoryAxis,
        gridIndex: 1,
        axisLabel: { formatter: (value) => formatActualTime(Number(value)), color: '#66798b' },
        splitLine: { show: true, lineStyle: { color: '#e7edf2' } },
      },
      {
        ...commonCategoryAxis,
        gridIndex: 2,
        axisLabel: { formatter: (value) => formatActualTime(Number(value)), color: '#66798b' },
        splitLine: { show: true, lineStyle: { color: '#e7edf2' } },
      },
    ],
    yAxis: [
      {
        type: 'value', gridIndex: 0, min: 0, max: 10, interval: 1,
        name: '宫\n口\n扩\n张\n(cm)', nameLocation: 'middle', nameGap: 48, nameRotate: 0,
        nameTextStyle: { color: '#445c70', fontWeight: 600, lineHeight: 15, align: 'center' },
        axisLabel: { color: '#66798b' },
        axisLine: { show: true, lineStyle: { color: '#cbd8e1' } },
        splitLine: { lineStyle: { color: '#dce6ed' } },
      },
      {
        type: 'value', gridIndex: 0, min: -5, max: 5, inverse: true, interval: 1,
        name: '胎\n先\n露\n高\n低', nameLocation: 'middle', nameGap: 48, nameRotate: 0,
        nameTextStyle: { color: '#445c70', fontWeight: 600, lineHeight: 15, align: 'center' },
        axisLabel: { color: '#66798b', formatter: (value) => (value > 0 ? `+${value}` : value) },
        axisLine: { show: true, lineStyle: { color: '#cbd8e1' } },
        splitLine: { show: false },
      },
      {
        type: 'value', gridIndex: 1, min: 100, max: 180, interval: 20,
        name: '胎\n心\n率\n(bpm)', nameLocation: 'middle', nameGap: 44, nameRotate: 0,
        nameTextStyle: { color: '#445c70', fontWeight: 600, lineHeight: 15, align: 'center' },
        axisLabel: { color: '#66798b' },
        axisLine: { show: true, lineStyle: { color: '#cbd8e1' } },
        splitLine: { lineStyle: { color: '#dce6ed' } },
      },
      {
        type: 'value', gridIndex: 2, min: 0, max: 70, interval: 20,
        name: '宫缩持续(sec)', nameLocation: 'middle', nameGap: 46,
        nameTextStyle: { color: '#445c70', fontWeight: 600 },
        axisLabel: { color: '#66798b' },
        axisLine: { show: true, lineStyle: { color: '#cbd8e1' } },
        splitLine: { lineStyle: { color: '#dce6ed' } },
      },
    ],
    dataZoom: props.compact
      ? []
      : [
          { type: 'inside', xAxisIndex: [0, 1, 2, 3], filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseMove: true },
          { type: 'slider', xAxisIndex: [0, 1, 2, 3], filterMode: 'none', bottom: 4, height: 18, brushSelect: false },
        ],
    series: [
      {
        name: '宫口扩张', type: 'line', xAxisIndex: 0, yAxisIndex: 0,
        data: seriesData('dilation'), connectNulls: true, symbol: 'circle', symbolSize: 8,
        lineStyle: { width: 2, color: '#e34b5f' },
        itemStyle: { color: '#fff', borderColor: '#e34b5f', borderWidth: 2 },
      },
      {
        name: '胎先露高低', type: 'line', xAxisIndex: 0, yAxisIndex: 1,
        data: seriesData('station'), connectNulls: true, symbol: crossSymbol, symbolRotate: 45, symbolSize: 9,
        lineStyle: { width: 2, color: '#3978d4' }, itemStyle: { color: '#3978d4' },
      },
      {
        name: '胎心率', type: 'line', xAxisIndex: 2, yAxisIndex: 2,
        data: seriesData('fetalHeart'), connectNulls: true, symbol: 'circle', symbolSize: 5,
        lineStyle: { width: 1.5, color: '#16a085' }, itemStyle: { color: '#16a085' },
        markArea: {
          silent: true, itemStyle: { color: 'rgba(67, 184, 124, 0.12)' },
          data: [[{ yAxis: 110 }, { yAxis: 160 }]],
        },
      },
      {
        name: '宫缩持续', type: 'bar', xAxisIndex: 3, yAxisIndex: 3,
        data: seriesData('duration'), barMaxWidth: 26,
        itemStyle: { color: '#7c9fbd', borderRadius: [2, 2, 0, 0] },
        label: {
          show: true, position: 'top', color: '#5f7180', fontSize: 11,
          formatter(params) {
            const record = recordsByHour.get(Number(hours[params.dataIndex]))
            return record?.intensity || ''
          },
        },
      },
    ],
  }
}

async function renderChart() {
  const echarts = await loadEcharts()
  await nextTick()
  if (!chartElement.value) return
  chartInstance ||= echarts.init(chartElement.value)
  chartInstance.setOption(chartOption(), true)
  chartInstance.resize()
  activeRange.value = 'all'
}

function selectRange(range) {
  if (!chartInstance) return
  activeRange.value = range.key
  const { firstHour, lastHour } = buildTimeline()
  const startValue = range.hours == null ? firstHour : Math.max(firstHour, lastHour - range.hours)
  chartInstance.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    startValue,
    endValue: lastHour,
  })
  chartInstance.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 1,
    startValue,
    endValue: lastHour,
  })
}

onMounted(async () => {
  await renderChart()
  resizeObserver = new ResizeObserver(() => chartInstance?.resize())
  resizeObserver.observe(chartElement.value)
})

watch(() => props.records, renderChart, { deep: true })

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>

<template>
  <div class="partograph-chart-shell">
    <div v-if="!compact" class="chart-range-tools">
      <span>时间范围</span>
      <button
        v-for="range in ranges"
        :key="range.key"
        type="button"
        :class="{ active: activeRange === range.key }"
        @click="selectRange(range)"
      >
        {{ range.label }}
      </button>
      <small>支持滚轮缩放和拖拽平移</small>
    </div>
    <div ref="chartElement" class="partograph-chart" :class="{ 'is-compact': compact }"></div>
  </div>
</template>

<style scoped>
.partograph-chart-shell { width: 100%; }
.chart-range-tools { height: 38px; padding: 5px 14px 0; display: flex; align-items: center; gap: 7px; color: #687a89; font-size: 12px; }
.chart-range-tools button { height: 26px; padding: 0 10px; color: #5d7081; background: #fff; border: 1px solid #cfdae3; border-radius: 3px; cursor: pointer; }
.chart-range-tools button:hover, .chart-range-tools button.active { color: #447afc; border-color: #8fb1ff; background: #f1f6ff; }
.chart-range-tools small { margin-left: auto; color: #94a0aa; }
.partograph-chart { width: 100%; height: 735px; }
.partograph-chart.is-compact { height: 470px; }
</style>
