<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ExternalReportImaging from './ExternalReportImaging.vue'

const pageRoot = ref(null)
let leftObserver
let pageObserver

const syncCaptureHeight = () => {
  const layout = pageRoot.value?.querySelector('.capture-layout')
  const reportForm = pageRoot.value?.querySelector('.report-form-card')
  if (!layout || !reportForm) return
  leftObserver?.disconnect()
  leftObserver = new ResizeObserver(() => {
    const height = reportForm.getBoundingClientRect().bottom - layout.getBoundingClientRect().top
    pageRoot.value?.style.setProperty('--capture-panel-height', Math.ceil(height) + 'px')
  })
  leftObserver.observe(reportForm)
}

onMounted(async () => {
  await nextTick()
  syncCaptureHeight()
  pageObserver = new MutationObserver(() => nextTick(syncCaptureHeight))
  pageObserver.observe(pageRoot.value, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  leftObserver?.disconnect()
  pageObserver?.disconnect()
})
</script>

<template><div ref="pageRoot" class="external-report-v1"><ExternalReportImaging layout-variant="v1" /></div></template>

<style>
.external-report-v1 .capture-layout {
  height: var(--capture-panel-height, auto);
  grid-template-columns: 350px minmax(680px, 1fr) 320px;
  grid-template-rows: minmax(0, var(--capture-panel-height, auto));
  align-items: stretch;
}
.external-report-v1 .capture-left {
  align-self: start;
}
.external-report-v1 .capture-right { display: contents; }
.external-report-v1 .scanner-card {
  grid-column: 2;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.external-report-v1 .thumb-card { grid-column: 3; min-width: 0; align-self: stretch; }
.external-report-v1 .scanner-preview {
  height: auto;
  min-height: 0;
  flex: 1;
}
.external-report-v1 .scanner-preview img { width: auto; max-width: calc(100% - 32px); height: calc(100% - 32px); object-fit: contain; }
.external-report-v1 .thumb-heading { height: auto; min-height: 42px; align-items: flex-start; flex-direction: column; }
.external-report-v1 .thumb-save-actions { width: 100%; padding: 0 12px 10px; flex-wrap: wrap; }
.external-report-v1 .thumb-list { grid-template-columns: 1fr; }
.external-report-v1 .thumb-card {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.external-report-v1 .thumb-list {
  min-height: 0;
  flex: 1;
  align-content: start;
  overflow-y: auto;
}
.external-report-v1 .thumb-item {
  grid-template-columns: minmax(0, 1fr) 78px;
  grid-template-rows: auto 178px;
  align-items: start;
}
.external-report-v1 .thumb-meta {
  grid-column: 1 / -1;
  grid-row: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}
.external-report-v1 .thumb-total {
  margin-left: 6px;
  color: #637083;
  font-weight: 500;
}
.external-report-v1 .report-form-card .compact-form-item .el-date-editor {
  width: 180px;
  flex: 0 0 180px;
}
.external-report-v1 .report-form-card .compact-form-item .el-form-item__content {
  justify-content: flex-end;
}
.external-report-v1 .report-form-card .hospital-form-item,
.external-report-v1 .report-form-card .remark-form-item {
  display: flex;
  align-items: flex-start;
}
.external-report-v1 .report-form-card .hospital-form-item .el-form-item__label,
.external-report-v1 .report-form-card .remark-form-item .el-form-item__label {
  width: 96px;
  height: 32px;
  margin: 0;
  padding-right: 10px;
  justify-content: flex-end;
  line-height: 32px;
}
.external-report-v1 .report-form-card .hospital-form-item .el-form-item__content,
.external-report-v1 .report-form-card .remark-form-item .el-form-item__content {
  min-width: 0;
  flex: 1;
  justify-content: flex-end;
}
.external-report-v1 .report-form-card .hospital-form-item .el-textarea,
.external-report-v1 .report-form-card .remark-form-item .el-textarea {
  width: 230px;
  flex: 0 0 230px;
}
.external-report-v1 .report-form-card .el-textarea__inner {
  resize: none;
}
.external-report-v1 .thumb-image {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  height: 178px;
}
.external-report-v1 .thumb-image img { width: 112px; }
.external-report-v1 .thumb-actions {
  grid-column: 2;
  grid-row: 2;
  flex-direction: column;
  align-items: stretch;
  gap: 9px;
}
.external-report-v1 .thumb-actions .el-button {
  width: 100%;
  margin: 0;
  justify-content: flex-start;
}
.external-report-v1 .thumb-actions .el-button:nth-child(1) { order: 1; }
.external-report-v1 .thumb-actions .el-button:nth-child(2) { order: 2; }
.external-report-v1 .thumb-actions .el-button:nth-child(4) { order: 3; }
.external-report-v1 .thumb-actions .el-button:nth-child(5) { order: 4; }
.external-report-v1 .thumb-actions .el-button:nth-child(6) { order: 5; }
.external-report-v1 .thumb-actions .el-button:nth-child(3) {
  order: 6;
  margin-top: 12px;
}
</style>
