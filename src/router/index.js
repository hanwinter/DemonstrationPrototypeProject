import { createRouter, createWebHashHistory } from 'vue-router'
import OutpatientPage from '../views/OutpatientPage.vue'
import OcrRecognition from '../views/OcrRecognition.vue'
import PartographDemo from '../views/PartographDemo.vue'

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
      path: '/delivery/partograph',
      name: 'partograph',
      component: PartographDemo,
    },
  ],
})

export default router
