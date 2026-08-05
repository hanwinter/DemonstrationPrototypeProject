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









