import { createRouter, createWebHashHistory } from 'vue-router'
import OutpatientPage from '../views/OutpatientPage.vue'
import OcrRecognition from '../views/OcrRecognition.vue'
import PartographDemo from '../views/PartographDemo.vue'
import ExternalReportImaging from '../views/ExternalReportImaging.vue'
import ConsentManagement from '../views/ConsentManagement.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/outpatient',
    },
    {
      path: '/outpatient',
      name: 'outpatient',
      component: OutpatientPage,
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
      path: '/delivery/partograph',
      name: 'partograph',
      component: PartographDemo,
    },
    {
      path: '/consent-management',
      name: 'consent-management',
      component: ConsentManagement,
    },
  ],
})

export default router
