import { createRouter, createWebHashHistory } from 'vue-router'
import SystemPortal from '../views/SystemPortal.vue'
import OcrRecognition from '../views/OcrRecognition.vue'
import PartographDemo from '../views/PartographDemo.vue'
import ExternalReportImaging from '../views/ExternalReportImaging.vue'
import ExternalReportImagingV1 from '../views/ExternalReportImagingV1.vue'
import ConsentManagement from '../views/ConsentManagement.vue'
import ArchiveSupplementWorkbench from '../views/ArchiveSupplementWorkbench.vue'
import FiveHealthProfile from '../views/FiveHealthProfile.vue'
import FiveHealthParentMobile from '../views/FiveHealthParentMobile.vue'
import FiveHealthParentHealthH5 from '../views/FiveHealthParentHealthH5.vue'
import FiveHealthZhixingParentH5 from '../views/FiveHealthZhixingParentH5.vue'

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
  ],
})

export default router

