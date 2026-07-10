<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  selected: { type: Object, required: true },
  expandedId: { type: [Number, String, null], default: null },
  mode: { type: String, required: true },
  meta: { type: Object, required: true },
})
const emit = defineEmits(['toggle'])

const abnormalIndicators = [
  { id: 1, name: '脊柱侧弯倾向', summary: '脊柱侧弯角度 12°', riskLevel: 'high', riskText: '高风险', resultLabel: '脊柱侧弯角度', resultValue: '12°', referenceRange: '< 10°', intervention: '建议进行脊柱专科评估，复查站立位全脊柱影像。', department: '骨科', organ: 'spine' },
  { id: 2, name: '体姿不良倾向', summary: '肩部高低差 2.5cm', riskLevel: 'high', riskText: '高风险', resultLabel: '肩部高低差', resultValue: '2.5cm', referenceRange: '< 1.5cm', intervention: '建议进行体姿评估，减少长期低头和单肩负重。', department: '骨科', organ: 'spine' },
  { id: 3, name: '左眼视力下降', summary: '左眼视力 0.6', riskLevel: 'medium', riskText: '中风险', resultLabel: '左眼裸眼视力', resultValue: '0.6', referenceRange: '>= 0.8', intervention: '建议减少近距离用眼时间，定期复查视力。', department: '眼科', organ: 'eye' },
  { id: 4, name: '右眼视力下降', summary: '右眼视力 0.7', riskLevel: 'medium', riskText: '中风险', resultLabel: '右眼裸眼视力', resultValue: '0.7', referenceRange: '>= 0.8', intervention: '建议完善视力复查，关注双眼屈光状态变化。', department: '眼科', organ: 'eye' },
  { id: 5, name: '心理健康预警', summary: '心理量表提示轻度风险', riskLevel: 'medium', riskText: '中风险', resultLabel: '心理量表结果', resultValue: '轻度风险', referenceRange: '正常', intervention: '建议班主任和家长共同关注情绪变化，必要时进行心理咨询。', department: '心理科', organ: 'body' },
  { id: 6, name: '血压偏高', summary: '收缩压 128mmHg', riskLevel: 'medium', riskText: '中风险', resultLabel: '收缩压', resultValue: '128mmHg', referenceRange: '按年龄身高判断', intervention: '建议复测血压，关注饮食、运动及睡眠情况。', department: '儿保科', organ: 'body' },
  { id: 7, name: 'BMI偏高', summary: 'BMI 23.5', riskLevel: 'low', riskText: '低风险', resultLabel: 'BMI', resultValue: '23.5', referenceRange: '14.0-18.9', intervention: '建议调整膳食结构，保证每日中高强度活动不少于60分钟。', department: '营养科', organ: 'body' },
  { id: 8, name: '龋齿风险', summary: '疑似龋齿 1颗', riskLevel: 'low', riskText: '低风险', resultLabel: '口腔检查', resultValue: '疑似龋齿 1颗', referenceRange: '无龋齿', intervention: '建议加强口腔清洁，定期进行口腔检查。', department: '口腔科', organ: 'body' },
  { id: 9, name: '睡眠质量异常', summary: '睡眠时长不足', riskLevel: 'low', riskText: '低风险', resultLabel: '睡眠情况', resultValue: '睡眠时长不足', referenceRange: '每日 8-10 小时', intervention: '建议规律作息，减少睡前电子产品使用。', department: '儿保科', organ: 'body' },
  { id: 10, name: '足弓发育异常', summary: '足弓偏低', riskLevel: 'low', riskText: '低风险', resultLabel: '足弓评估', resultValue: '足弓偏低', referenceRange: '正常足弓', intervention: '建议穿着合适鞋具，必要时进行专科评估。', department: '骨科', organ: 'spine' },
]

const riskOrder = { high: 0, medium: 1, low: 2 }
const severityMap = { high: 'high', medium: 'moderate', low: 'low' }
const sortedIndicators = computed(() => [...abnormalIndicators].sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.id - b.id))
const riskStats = computed(() => ({
  total: sortedIndicators.value.length,
  high: sortedIndicators.value.filter(item => item.riskLevel === 'high').length,
  medium: sortedIndicators.value.filter(item => item.riskLevel === 'medium').length,
  low: sortedIndicators.value.filter(item => item.riskLevel === 'low').length,
}))
const activeId = ref(sortedIndicators.value[0]?.id ?? null)
const listRef = ref(null)
const showFade = ref(false)

const toLegacyItem = item => ({
  id: item.id,
  name: item.name,
  resultLabel: item.resultLabel,
  value: item.resultValue,
  reference: item.referenceRange,
  severity: severityMap[item.riskLevel],
  organ: item.organ,
  category: '五健异常',
  advice: item.intervention,
  parentAdvice: item.intervention,
  referral: item.department,
})
const checkScroll = () => {
  const el = listRef.value
  if (!el) return
  showFade.value = el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight < el.scrollHeight - 8
}
const toggleIndicator = item => {
  activeId.value = activeId.value === item.id ? null : item.id
  emit('toggle', toLegacyItem(item))
  nextTick(checkScroll)
}

onMounted(() => {
  const first = sortedIndicators.value[0]
  if (first) emit('toggle', toLegacyItem(first))
  nextTick(checkScroll)
})
</script>

<template>
  <article class="panel abnormal-list-card fh-card">
    <div class="panel-title">
      <div class="title-main"><h3>异常指标 <b>{{ riskStats.total }}项</b></h3><span>当前查看 {{ sortedIndicators.findIndex(item => item.id === activeId) + 1 || 0 }} / {{ riskStats.total }}</span></div>
      <div class="risk-summary"><span class="high-text">高风险 {{ riskStats.high }}</span><span class="medium-text">中风险 {{ riskStats.medium }}</span><span class="low-text">低风险 {{ riskStats.low }}</span></div>
    </div>
    <div class="abnormal-list-wrap" :class="{fade:showFade}">
      <div ref="listRef" class="abnormal-list" @scroll="checkScroll">
        <div v-for="item in sortedIndicators" :key="item.id" class="indicator" :class="{expanded:activeId===item.id}">
          <button class="indicator-row" @click="toggleIndicator(item)">
            <span class="indicator-main"><b>{{ item.name }}</b><small>{{ item.summary }}</small></span>
            <em class="risk-tag" :class="item.riskLevel">{{ item.riskText }}</em>
            <i>{{ activeId===item.id ? '⌄' : '›' }}</i>
          </button>
          <div v-if="activeId===item.id" class="detail-wrap">
            <div class="abnormal-detail">
              <div class="detail-grid">
                <div class="detail-field"><dt>检查结果</dt><dd>{{ item.resultLabel }} {{ item.resultValue }}</dd></div>
                <div class="detail-field"><dt>参考范围</dt><dd>{{ item.referenceRange }}</dd></div>
              </div>
              <div class="detail-field wide"><dt>干预建议</dt><dd>{{ item.intervention }}</dd></div>
              <div class="detail-field"><dt>建议科室</dt><dd>{{ item.department }}</dd></div>
            </div>
          </div>
        </div>
        <div class="scroll-hint">继续下滑查看更多异常指标</div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.panel-title{min-height:58px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--fh-border-light);background:linear-gradient(90deg,#F0F7FF,#FFFFFF)}.title-main{display:flex;flex-direction:column;gap:4px}.title-main h3{margin:0;color:var(--fh-text-primary);font-size:15px}.title-main h3 b{color:var(--fh-text-secondary);font-size:13px;font-weight:500}.title-main span{color:var(--fh-text-tertiary);font-size:12px}.risk-summary{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;color:var(--fh-text-secondary);font-size:12px}.high-text{color:var(--fh-risk-high)}.medium-text{color:var(--fh-risk-medium)}.low-text{color:var(--fh-risk-low)}.abnormal-list-wrap{position:relative}.abnormal-list-wrap.fade::after{content:'';position:absolute;left:0;right:0;bottom:0;height:40px;pointer-events:none;background:linear-gradient(to bottom,rgba(245,250,255,0),rgba(245,250,255,.95))}.abnormal-list{max-height:560px;overflow-y:auto;padding:10px 8px 0}.abnormal-list::-webkit-scrollbar{width:4px}.abnormal-list::-webkit-scrollbar-thumb{background:rgba(91,143,249,.25);border-radius:999px}.abnormal-list::-webkit-scrollbar-track{background:transparent}.indicator{margin-bottom:10px;border-radius:10px;background:#fff;box-shadow:0 1px 8px rgba(16,24,40,.035);transition:background .16s,box-shadow .16s,transform .16s}.indicator:hover{background:var(--fh-hover-bg);transform:translateY(-1px)}.indicator.expanded{background:#EAF3FF;border:1px solid rgba(91,143,249,.18);box-shadow:none}.indicator-row{width:100%;min-height:56px;padding:9px 11px;display:grid;grid-template-columns:minmax(0,1fr) auto 18px;align-items:center;gap:10px;text-align:left;border:0;background:transparent;cursor:pointer}.indicator-main{min-width:0;display:flex;flex-direction:column;gap:4px}.indicator-main b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--fh-text-primary);font-size:14px}.indicator-main small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--fh-text-secondary);font-size:13px}.risk-tag{height:28px;padding:0 12px;border-radius:999px;font-size:14px;font-style:normal;display:inline-flex;align-items:center;justify-content:center}.risk-tag.high{color:var(--fh-risk-high);background:var(--fh-risk-high-bg)}.risk-tag.medium{color:var(--fh-risk-medium);background:var(--fh-risk-medium-bg)}.risk-tag.low{color:var(--fh-risk-low);background:var(--fh-risk-low-bg)}.indicator-row i{color:var(--fh-text-tertiary);font-size:18px;font-style:normal;text-align:center}.detail-wrap{padding:0 12px 12px}.abnormal-detail{margin-top:4px;padding:12px;border-radius:12px;background:rgba(255,255,255,.92)}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.detail-field{min-width:0;margin-top:12px;text-align:left}.detail-grid .detail-field{margin-top:0}.detail-field.wide{grid-column:1/-1}dt{margin:0 0 6px;color:var(--fh-text-secondary);font-size:13px}dd{margin:0;color:var(--fh-text-primary);font-size:15px;line-height:1.6;font-weight:500}.scroll-hint{padding:0 0 12px;color:var(--fh-text-tertiary);font-size:12px;text-align:center}
</style>
