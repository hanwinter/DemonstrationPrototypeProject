<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VisitReminder from './VisitReminder.vue'

const router = useRouter()
const activeMenu = ref('visit-reminder')
const menus = [
  { key: 'visit-reminder', label: '回访提醒' },
]
</script>

<template>
  <main class="single-page-shell">
    <header class="topbar">
      <div class="brand">
        <span>母婴</span>
        <div>
          <strong>单页面优化</strong>
          <small>母婴陪护</small>
        </div>
      </div>
      <button type="button" @click="router.push('/')">返回入口</button>
    </header>
    <section class="layout">
      <aside class="sidebar">
        <div class="side-title">单页面优化</div>
        <button
          v-for="item in menus"
          :key="item.key"
          :class="{ active: activeMenu === item.key }"
          type="button"
          @click="activeMenu = item.key"
        >
          {{ item.label }}
        </button>
      </aside>
      <section class="content-area">
        <VisitReminder v-if="activeMenu === 'visit-reminder'" />
      </section>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.single-page-shell{height:100vh;overflow:hidden;color:#1f2937;background:#f5f7fa;font-family:"Microsoft YaHei",Arial,sans-serif}.topbar{position:fixed;top:0;left:0;right:0;z-index:20;height:68px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #e5e7eb;box-shadow:0 2px 10px rgba(31,41,55,.05)}.brand{display:flex;align-items:center;gap:12px}.brand>span{width:42px;height:42px;display:grid;place-items:center;color:#fff;font-weight:700;border-radius:10px;background:#ff6b9a}.brand strong{display:block;font-size:18px}.brand small{display:block;margin-top:3px;color:#6b7280}.topbar button{height:32px;padding:0 14px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#374151;cursor:pointer}.topbar button:hover{color:#ff6b9a;border-color:#ff6b9a;background:#fff1f5}.layout{height:100vh;max-width:1440px;margin:0 auto;padding:84px 24px 16px;display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px}.sidebar{height:calc(100vh - 100px);min-height:0;position:sticky;top:84px;padding:14px 10px;border:0;border-radius:8px;background:#fff;box-shadow:0 0 10px rgba(15,23,42,.08);overflow:auto}.side-title{padding:0 12px 12px;color:#ff6b9a;font-weight:700;border-bottom:1px solid #edf0f4}.sidebar button{width:100%;height:38px;margin-top:5px;padding:0 12px;text-align:left;border:0;border-radius:6px;background:transparent;color:#4b5563;cursor:pointer}.sidebar button.active,.sidebar button:hover{color:#ff6b9a;background:#fff1f5;font-weight:700}.content-area{min-width:0;height:calc(100vh - 100px);overflow:auto;padding:0 4px 16px 0;scrollbar-width:thin;scrollbar-color:#cfd6e1 transparent}.content-area::-webkit-scrollbar{width:6px;height:6px}.content-area::-webkit-scrollbar-track{background:transparent}.content-area::-webkit-scrollbar-thumb{background:#cfd6e1;border-radius:999px}.content-area:hover::-webkit-scrollbar-thumb{background:#9aa5b5}@media(max-width:900px){.single-page-shell{overflow:auto}.topbar{padding:0 16px}.layout{height:auto;min-height:100vh;grid-template-columns:1fr;padding:80px 12px 12px}.sidebar{height:auto;min-height:0;position:static}.sidebar button{display:inline-flex;width:auto;margin-right:6px}.content-area{height:auto;overflow:visible}}
</style>


