<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhysicalExamDataDemo from '../physical-exam-data/PhysicalExamDataDemo.vue'
import PatientArchiveDemo from '../patient-archive/PatientArchiveDemo.vue'
import ExamRecordsList from '../exam-records/ExamRecordsList.vue'
import ExamRecordDetail from '../exam-records/ExamRecordDetail.vue'
import ReportConfigDemo from '../report-config/ReportConfigDemo.vue'
import FollowupPlanDemo from '../followup-plan/FollowupPlanDemo.vue'
import StudentHealthArchiveDemo from '../student-health-archive/StudentHealthArchiveDemo.vue'
import SaasRegionManagementDemo from '../saas-region/SaasRegionManagementDemo.vue'
import RegionalDataArchiveDemo from '../regional-data-archive/RegionalDataArchiveDemo.vue'
import RegionalDataAnalysisDemo from '../regional-analysis/RegionalDataAnalysisDemo.vue'
import RegionalSupervisionDashboard from '../regional-supervision/RegionalSupervisionDashboard.vue'
import QualityControlWarningDemo from '../quality-control/QualityControlWarningDemo.vue'
import QualityIssueDetail from '../quality-control/QualityIssueDetail.vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('physical-exam-data')
const expanded = ref(true)
const menus = [
  { key: 'physical-exam-data', label: '体检数据', path: '/demo-pages/physical-exam-data' },
  { key: 'patient-archive', label: '患者建档', path: '/demo-pages/patient-archive' },
  { key: 'exam-records', label: '体检记录', path: '/demo-pages/exam-records' },
  { key: 'report-config', label: '报告配置', path: '/demo-pages/report-config' },
  { key: 'followup-plan', label: '随访方案', path: '/demo-pages/followup-plan' },
  { key: 'student-health-archive', label: '学生健康档案', path: '/demo-pages/student-health-archive' },
  { key: 'saas-region', label: 'SaaS部署与区域协同管理', path: '/demo-pages/saas-region' },
  { key: 'regional-data-archive', label: '区域数据汇聚与健康档案', path: '/demo-pages/regional-data-archive' },
  { key: 'regional-analysis', label: '区域数据分析', path: '/demo-pages/regional-analysis' },
  { key: 'regional-supervision', label: '区域监管驾驶舱', path: '/demo-pages/regional-supervision' },
  { key: 'quality-control', label: '质量控制与预警管理', path: '/demo-pages/quality-control' },
]

watch(
  () => route.path,
  (path) => {
    activeMenu.value = path.startsWith('/demo-pages/exam-records') ? 'exam-records' : path.startsWith('/demo-pages/quality-control') ? 'quality-control' : menus.find((item) => item.path === path)?.key || 'physical-exam-data'
  },
  { immediate: true },
)
</script>

<template>
  <main class="demo-shell">
    <header class="topbar">
      <div class="brand">
        <span>演示</span>
        <div>
          <strong>妇幼健康业务系统</strong>
          <small>单页面演示</small>
        </div>
      </div>
      <button type="button" @click="router.push('/')">返回入口</button>
    </header>
    <section class="layout">
      <aside class="sidebar">
        <button class="parent-menu" type="button" @click="expanded = !expanded">
          <span>单页面演示</span><b>{{ expanded ? '▾' : '▸' }}</b>
        </button>
        <div v-show="expanded" class="submenu">
          <button
            v-for="item in menus"
            :key="item.key"
            :class="{ active: activeMenu === item.key }"
            type="button"
            @click="router.push(item.path)"
          >
            {{ item.label }}
          </button>
        </div>
      </aside>
      <section class="content-area">
        <PhysicalExamDataDemo v-if="activeMenu === 'physical-exam-data'" />
        <PatientArchiveDemo v-else-if="activeMenu === 'patient-archive'" />
        <ExamRecordDetail v-else-if="route.name === 'demo-pages-exam-record-detail'" />
        <ExamRecordsList v-else-if="activeMenu === 'exam-records'" />
        <ReportConfigDemo v-else-if="activeMenu === 'report-config'" />
        <FollowupPlanDemo v-else-if="activeMenu === 'followup-plan'" />
        <StudentHealthArchiveDemo v-else-if="activeMenu === 'student-health-archive'" />
        <SaasRegionManagementDemo v-else-if="activeMenu === 'saas-region'" />
        <RegionalDataArchiveDemo v-else-if="activeMenu === 'regional-data-archive'" />
        <RegionalDataAnalysisDemo v-else-if="activeMenu === 'regional-analysis'" />
        <RegionalSupervisionDashboard v-else-if="activeMenu === 'regional-supervision'" />
        <QualityIssueDetail v-else-if="route.name === 'demo-pages-quality-control-detail'" />
        <QualityControlWarningDemo v-else-if="activeMenu === 'quality-control'" />
      </section>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.demo-shell{height:100vh;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.topbar{height:56px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #cfd6df}.brand{display:flex;align-items:center;gap:10px}.brand>span{width:36px;height:36px;display:grid;place-items:center;color:#fff;font-size:13px;font-weight:700;border-radius:4px;background:#5f8db8}.brand strong{display:block;color:#24384a;font-size:15px}.brand small{display:block;margin-top:2px;color:#666;font-size:12px}.topbar button{height:28px;padding:0 12px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.layout{height:calc(100vh - 56px);display:grid;grid-template-columns:210px minmax(0,1fr);gap:0}.sidebar{height:100%;padding:8px;border-right:1px solid #cfd6df;background:#edf1f5;overflow:auto}.parent-menu,.submenu button{width:100%;height:30px;padding:0 9px;text-align:left;border:1px solid transparent;border-radius:2px;background:transparent;color:#333;font-size:12px;cursor:pointer}.parent-menu{display:flex;align-items:center;justify-content:space-between;font-weight:600}.parent-menu:hover,.submenu button:hover{border-color:#c7d8e9;background:#f7fbff}.submenu{padding:2px 0 0 14px}.submenu button.active{border-color:#b8cce0;background:#dceafa;color:#1f4d75;font-weight:600}.content-area{min-width:0;height:100%;padding:10px;overflow:hidden;background:#f5f6f7}
</style>
