import { createRouter, createWebHashHistory } from 'vue-router'
import SystemPortal from '../views/SystemPortal.vue'
import OcrRecognition from '../views/OcrRecognition.vue'
import PartographDemo from '../views/PartographDemo.vue'
import ExternalReportImaging from '../views/ExternalReportImaging.vue'
import ExternalReportImagingV1 from '../views/ExternalReportImagingV1.vue'
import ConsentManagement from '../views/ConsentManagement.vue'
import ArchiveSupplementWorkbench from '../views/ArchiveSupplementWorkbench.vue'
import EnterpriseWechatCustomerManagement from '../views/EnterpriseWechatCustomerManagement.vue'
import EnterpriseWechatArchiveBindH5 from '../views/EnterpriseWechatArchiveBindH5.vue'
import MaternalReportForms from '../views/MaternalReportForms.vue'
import FiveHealthProfile from '../views/FiveHealthProfile.vue'
import FiveHealthParentMobile from '../views/FiveHealthParentMobile.vue'
import FiveHealthParentHealthH5 from '../views/FiveHealthParentHealthH5.vue'
import FiveHealthZhixingParentH5 from '../views/FiveHealthZhixingParentH5.vue'
import FiveHealthChargeProjectManagement from '../views/FiveHealthChargeProjectManagement.vue'
import NursingActivityCreate from '../views/NursingActivityCreate.vue'
import NursingCrm from '../views/NursingCrm.vue'
import NursingHomeLogMiniapp from '../views/NursingHomeLogMiniapp.vue'
import NursingServiceAdmin from '../views/NursingServiceAdmin.vue'
import SinglePageOptimization from '../views/SinglePageOptimization.vue'
import DemoPagesIndex from '../views/demo-pages/index/DemoPagesIndex.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'system-portal',
      component: SystemPortal,
    },
    {
      path: '/outpatient',
      redirect: '/',
    },
    {
      path: '/ocr-recognition',
      name: 'ocr-recognition',
      component: OcrRecognition,
    },
    {
      path: '/external-report-imaging',
      name: 'external-report-imaging',
      component: ExternalReportImaging,
    },
    {
      path: '/external-report-imaging-v1',
      name: 'external-report-imaging-v1',
      component: ExternalReportImagingV1,
      meta: { title: '外院报告影像 v1.0' },
    },
    {
      path: '/delivery/partograph',
      name: 'partograph',
      component: PartographDemo,
    },
    {
      path: '/consent-management',
      name: 'consent-management',
      component: ConsentManagement,
    },
    {
      path: '/archive-supplement-workbench',
      name: 'archive-supplement-workbench',
      component: ArchiveSupplementWorkbench,
    },
    {
      path: '/enterprise-wechat-customers',
      name: 'enterprise-wechat-customers',
      component: EnterpriseWechatCustomerManagement,
    },
    {
      path: '/enterprise-wechat/archive-bind-h5',
      name: 'enterprise-wechat-archive-bind-h5',
      component: EnterpriseWechatArchiveBindH5,
    },
    {
      path: '/maternal/report-forms',
      name: 'maternal-report-forms',
      component: MaternalReportForms,
    },
    {
      path: '/five-health/profile-360',
      name: 'five-health-profile',
      component: FiveHealthProfile,
    },
    {
      path: '/five-health/parent-mobile',
      name: 'five-health-parent-mobile',
      component: FiveHealthParentMobile,
    },
    {
      path: '/parent/health',
      name: 'parent-health',
      component: FiveHealthParentHealthH5,
    },
    {
      path: '/five-health/zhixing-parent-h5',
      name: 'five-health-zhixing-parent-h5',
      component: FiveHealthZhixingParentH5,
    },
    {
      path: '/five-health/charge-projects',
      name: 'five-health-charge-projects',
      component: FiveHealthChargeProjectManagement,
    },
    {
      path: '/nursing/activity/create',
      name: 'nursing-activity-create',
      component: NursingActivityCreate,
    },
    {
      path: '/nursing/crm',
      name: 'nursing-crm',
      component: NursingCrm,
    },
    {
      path: '/nursing/home-log-miniapp',
      name: 'nursing-home-log-miniapp',
      component: NursingHomeLogMiniapp,
    },
    {
      path: '/nursing/service-admin',
      name: 'nursing-service-admin',
      component: NursingServiceAdmin,
    },
    {
      path: '/maternal-care/single-page-optimization',
      name: 'maternal-care-single-page-optimization',
      component: SinglePageOptimization,
    },
    {
      path: '/demo-pages/physical-exam-data',
      name: 'demo-pages-physical-exam-data',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 体检数据' },
    },
    {
      path: '/demo-pages/patient-archive',
      name: 'demo-pages-patient-archive',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 患者建档' },
    },
    {
      path: '/demo-pages/exam-records',
      name: 'demo-pages-exam-records',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 体检记录' },
    },
    {
      path: '/demo-pages/exam-records/detail/:id',
      name: 'demo-pages-exam-record-detail',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 体检记录详情' },
    },
    {
      path: '/demo-pages/report-config',
      name: 'demo-pages-report-config',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 报告配置' },
    },
    {
      path: '/demo-pages/followup-plan',
      name: 'demo-pages-followup-plan',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 随访方案' },
    },
    {
      path: '/demo-pages/student-health-archive',
      name: 'demo-pages-student-health-archive',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 学生健康档案' },
    },
    {
      path: '/demo-pages/saas-region',
      name: 'demo-pages-saas-region',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - SaaS部署与区域协同管理' },
    },
    {
      path: '/demo-pages/regional-data-archive',
      name: 'demo-pages-regional-data-archive',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 区域数据汇聚与健康档案' },
    },
    {
      path: '/demo-pages/regional-analysis',
      name: 'demo-pages-regional-analysis',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 区域数据分析' },
    },
    {
      path: '/demo-pages/regional-supervision',
      name: 'demo-pages-regional-supervision',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 区域监管驾驶舱' },
    },
    {
      path: '/demo-pages/quality-control',
      name: 'demo-pages-quality-control',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 质量控制与预警管理' },
    },
    {
      path: '/demo-pages/quality-control/detail/:id',
      name: 'demo-pages-quality-control-detail',
      component: DemoPagesIndex,
      meta: { title: '单页面演示 - 问题详情' },
    },
    {
      path: '/nursing/crm/staff/:id',
      name: 'nursing-crm-staff',
      component: NursingCrm,
    },
    {
      path: '/nursing/crm/staff/:id/media-select',
      name: 'nursing-crm-media-select',
      component: NursingCrm,
    },
  ],
})

export default router









