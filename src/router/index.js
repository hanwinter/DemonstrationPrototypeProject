import { createRouter, createWebHashHistory } from 'vue-router'
import OutpatientPage from '../views/OutpatientPage.vue'
import OcrRecognition from '../views/OcrRecognition.vue'

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
  ],
})

export default router
