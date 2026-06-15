<script setup>
import { DocumentChecked, TrendCharts } from '@element-plus/icons-vue'

const navigationItems = [
  { label: 'OCR 识别工作台', path: '/ocr-recognition', icon: DocumentChecked },
  { label: '产程图', path: '/delivery/partograph', icon: TrendCharts },
]
</script>

<template>
  <nav class="demo-navigation" aria-label="演示页面切换">
    <router-link
      v-for="item in navigationItems"
      :key="item.path"
      :to="item.path"
      class="demo-navigation__item"
    >
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.demo-navigation {
  align-self: stretch;
  display: flex;
  align-items: stretch;
  gap: 2px;
}

.demo-navigation__item {
  min-width: 154px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.78);
  border-bottom: 3px solid transparent;
  text-decoration: none;
  transition: background 0.16s ease, color 0.16s ease;
}

.demo-navigation__item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.demo-navigation__item.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border-bottom-color: #fff;
  font-weight: 600;
}

.demo-navigation__item .el-icon {
  font-size: 17px;
}
</style>
