<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import '../components/fivehealth/health-archive-theme.css'
import StudentInfoBar from '../components/fivehealth/StudentInfoBar.vue'
import HealthPortraitCard from '../components/fivehealth/HealthPortraitCard.vue'
import AbnormalIndicatorList from '../components/fivehealth/AbnormalIndicatorList.vue'
import ReportHistoryPanel from '../components/fivehealth/ReportHistoryPanel.vue'
import TrendAnalysisPanel from '../components/fivehealth/TrendAnalysisPanel.vue'
import ReportActionPanel from '../components/fivehealth/ReportActionPanel.vue'
import HealthManagementPanel from '../components/fivehealth/HealthManagementPanel.vue'
import {
  fiveHealthAbnormalities as items,
  fiveHealthActions,
  fiveHealthManagement,
  fiveHealthReports,
  fiveHealthStudent as student,
  fiveHealthTrends,
} from '../mock/fiveHealthProfile'

const router = useRouter()
const mode = ref('doctor')
const selected = ref(items[1])
const expandedId = ref(items[1]?.id ?? null)
const show3D = ref(false)
const activeTab = ref('archive')
const tabs = [
  { id: 'archive', label: '健康档案' },
  { id: 'trend', label: '健康趋势' },
  { id: 'manage', label: '健康管理' },
]
const meta = { low: ['低风险', '#34C759'], moderate: ['中风险', '#FFB547'], high: ['高风险', '#FF6B6B'] }
const summary = computed(() => ({
  abnormalCount: items.length,
  highRiskCount: items.filter(item => item.severity === 'high').length,
  assessment: '需关注',
}))
const threeAbnormalities = computed(() => items.map(item => ({ ...item, organ: item.organ === 'eye' ? 'eye_left' : item.organ })))
const selectIndicator = item => {
  selected.value = item
  expandedId.value = expandedId.value === item.id ? null : item.id
}
const selectOrgan = organ => {
  const item = items.find(x => x.organ === organ)
  if (!item) return
  selected.value = item
  expandedId.value = item.id
}
</script>

<template>
  <main class="app-shell profile-shell five-health-theme">
    <header class="system-header profile-header">
      <div class="brand"><strong>五健筛查系统</strong><span>儿童青少年健康管理平台</span></div>
    </header>
    <div class="page profile-page">
      <StudentInfoBar :student="student" @back="router.push('/')" />
      <section class="profile-workbench">
        <aside class="left-column">
          <HealthPortraitCard v-model:show3D="show3D" :selected="selected" :summary="summary" :three-abnormalities="threeAbnormalities" @select-organ="selectOrgan" />
          <AbnormalIndicatorList :items="items" :selected="selected" :expanded-id="expandedId" :mode="mode" :meta="meta" @toggle="selectIndicator" />
        </aside>
        <section class="right-column">
          <div class="tab-shell fh-card">
            <div class="tab-header">
              <button v-for="tab in tabs" :key="tab.id" :class="{active:activeTab===tab.id}" @click="activeTab=tab.id">{{ tab.label }}</button>
            </div>
            <div class="tab-body">
              <div v-if="activeTab==='archive'" class="archive-stack">
                <section><h3>历次体检报告</h3><ReportHistoryPanel :reports="fiveHealthReports" /></section>
                <section><h3>报告管理</h3><ReportActionPanel :actions="fiveHealthActions" /></section>
              </div>
              <div v-else-if="activeTab==='trend'" class="archive-stack">
                <section><h3>五健趋势分析</h3><TrendAnalysisPanel :trends="fiveHealthTrends" /></section>
              </div>
              <HealthManagementPanel v-else :management="fiveHealthManagement" />
            </div>
          </div>
        </section>
      </section>
    </div>
  </main>
</template>

<style scoped>
.profile-shell{background:linear-gradient(135deg,#F5FAFF 0%,#F8FCFA 100%);color:var(--fh-text-primary)}.profile-header{position:relative;overflow:hidden;background:linear-gradient(90deg,#4F8DF7 0%,#6FA8FF 60%,#8CC8FF 100%);box-shadow:0 2px 12px rgba(80,130,220,.18)}.profile-header::before{content:"";position:absolute;right:42px;top:-34px;width:120px;height:120px;border-radius:999px;background:#fff;opacity:.08;filter:blur(2px);pointer-events:none}.profile-header::after{content:"";position:absolute;right:30%;top:10px;width:60px;height:60px;border-radius:999px;background:#fff;opacity:.12;pointer-events:none}.brand{position:relative;z-index:1;gap:14px}.brand::before{content:"";position:absolute;left:-18px;top:50%;width:30px;height:30px;border-radius:999px;background:#fff;opacity:.1;transform:translateY(-50%);pointer-events:none}.brand::after{content:"";position:absolute;left:260px;top:50%;width:160px;height:34px;border-top:1px solid rgba(255,255,255,.05);border-radius:50%;transform:translateY(-15%) rotate(-8deg);pointer-events:none}.brand strong{font-size:18px;font-weight:600;color:#fff}.brand span{padding-left:14px;color:rgba(255,255,255,.65);font-size:12px;border-left:1px solid rgba(255,255,255,.32)}.profile-page{max-width:1800px}.profile-workbench{margin-top:8px;display:grid;grid-template-columns:minmax(390px,35%) minmax(0,65%);gap:8px;align-items:start}.left-column{min-width:0;display:grid;gap:8px}.right-column{min-width:0}.tab-shell{min-height:620px;overflow:hidden}.tab-header{height:44px;padding:0 12px;display:flex;align-items:flex-end;gap:6px;border-bottom:1px solid var(--fh-border-light);background:linear-gradient(90deg,#F0F7FF,#FFFFFF)}.tab-header button{height:34px;padding:0 14px;color:var(--fh-text-secondary);border:0;border-bottom:3px solid transparent;background:transparent;cursor:pointer}.tab-header button.active{color:var(--fh-primary);border-bottom-color:var(--fh-primary);font-weight:600}.tab-body{padding:10px;background:linear-gradient(180deg,#FFFFFF 0%,#FAFBFC 100%);min-height:574px}.archive-stack{display:grid;gap:10px}.archive-stack h3{margin:0 0 8px;color:var(--fh-text-primary);font-size:15px}
@media (max-width:1100px){.profile-workbench{grid-template-columns:1fr}}
</style>


