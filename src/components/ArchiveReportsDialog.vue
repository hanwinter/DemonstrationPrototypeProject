<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { Delete, Document, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createArchiveReports } from '../mock/archiveReports'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const reports = ref(createArchiveReports())
const statusFilter = ref('有效')
const selectedReportId = ref()
const imageViewportRef = ref()
const imageScale = ref(1)
const imageScales = [0.5, 0.75, 1, 1.25, 1.5, 2]
const draggingImage = ref(false)
let dragStartX = 0
let dragStartY = 0
let dragStartScrollLeft = 0
let dragStartScrollTop = 0

const visibleReports = computed(() =>
  reports.value.filter((report) =>
    statusFilter.value === '全部' || report.status === statusFilter.value,
  ),
)

const selectedReport = computed(() =>
  reports.value.find((report) => report.id === selectedReportId.value),
)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) selectFirstVisibleReport()
  },
)

watch(statusFilter, selectFirstVisibleReport)
watch(selectedReportId, resetImageView)

function selectFirstVisibleReport() {
  const currentStillVisible = visibleReports.value.some(
    (report) => report.id === selectedReportId.value,
  )
  if (!currentStillVisible) {
    selectedReportId.value = visibleReports.value[0]?.id
  }
}

function closeDialog() {
  emit('update:modelValue', false)
}

function selectReport(report) {
  selectedReportId.value = report.id
}

async function resetImageView() {
  imageScale.value = 1
  await nextTick()
  if (imageViewportRef.value) {
    imageViewportRef.value.scrollLeft = 0
    imageViewportRef.value.scrollTop = 0
  }
}

function setImageScale(scale) {
  imageScale.value = scale
}

function zoomImage(direction) {
  const currentIndex = imageScales.indexOf(imageScale.value)
  const nextIndex = Math.min(
    imageScales.length - 1,
    Math.max(0, currentIndex + direction),
  )
  setImageScale(imageScales[nextIndex])
}

function handleImageWheel(event) {
  if (!event.ctrlKey) return
  event.preventDefault()
  zoomImage(event.deltaY > 0 ? -1 : 1)
}

function startImageDrag(event) {
  const viewport = imageViewportRef.value
  if (!viewport || event.button !== 0) return

  draggingImage.value = true
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragStartScrollLeft = viewport.scrollLeft
  dragStartScrollTop = viewport.scrollTop
  viewport.setPointerCapture(event.pointerId)
}

function moveImage(event) {
  const viewport = imageViewportRef.value
  if (!viewport || !draggingImage.value) return

  viewport.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX)
  viewport.scrollTop = dragStartScrollTop - (event.clientY - dragStartY)
}

function stopImageDrag(event) {
  if (!draggingImage.value) return
  draggingImage.value = false
  imageViewportRef.value?.releasePointerCapture?.(event.pointerId)
}

async function invalidateReport(report) {
  try {
    await ElMessageBox.confirm(
      `确定作废“${report.reportName}”吗？作废后可通过状态筛选查看。`,
      '作废外院报告',
      {
        confirmButtonText: '确认作废',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
  } catch {
    return
  }

  report.status = '已作废'
  selectFirstVisibleReport()
  ElMessage.success('外院报告已作废')
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="当前孕妇外院报告"
    width="90%"
    class="archive-dialog"
    destroy-on-close
    @close="closeDialog"
  >
    <div class="archive-layout">
      <aside class="archive-list-panel">
        <div class="archive-list-tools">
          <strong>外院报告列表</strong>
          <el-select v-model="statusFilter" aria-label="报告状态筛选">
            <el-option label="有效" value="有效" />
            <el-option label="已作废" value="已作废" />
            <el-option label="全部" value="全部" />
          </el-select>
        </div>

        <div v-if="visibleReports.length" class="archive-report-list">
          <div
            v-for="report in visibleReports"
            :key="report.id"
            class="archive-report-item"
            :class="{ active: selectedReportId === report.id }"
            @click="selectReport(report)"
          >
            <div class="archive-item-heading">
              <strong>{{ report.reportName }}</strong>
              <el-tag
                :type="report.status === '有效' ? 'success' : 'info'"
                size="small"
              >
                {{ report.status }}
              </el-tag>
            </div>
            <dl>
              <div><dt>报告时间：</dt><dd>{{ report.reportDate }}</dd></div>
              <div><dt>检查医院：</dt><dd :title="report.hospital">{{ report.hospital }}</dd></div>
              <div><dt>报告类型：</dt><dd>{{ report.reportType }}</dd></div>
              <div><dt>导入时间：</dt><dd>{{ report.importedAt }}</dd></div>
            </dl>
          </div>
        </div>
        <el-empty v-else description="暂无该状态的外院报告" :image-size="80" />
      </aside>

      <section v-if="selectedReport" class="archive-detail-panel">
        <div class="archive-detail-heading">
          <div class="archive-detail-title">
            <el-icon><Document /></el-icon>
            <strong>报告详情</strong>
            <el-tag :type="selectedReport.status === '有效' ? 'success' : 'info'">
              {{ selectedReport.status }}
            </el-tag>
          </div>
          <div class="archive-detail-actions">
            <el-button
              v-if="selectedReport.status === '有效'"
              type="danger"
              plain
              :icon="Delete"
              @click="invalidateReport(selectedReport)"
            >
              作废报告
            </el-button>
          </div>
        </div>

        <div class="archive-report-meta">
          <div class="meta-hospital">
            <span>检查医院：</span><strong>{{ selectedReport.hospital }}</strong>
          </div>
          <div class="meta-name">
            <span>报告名称：</span><strong>{{ selectedReport.reportName }}</strong>
          </div>
          <div>
            <span>报告时间：</span><strong>{{ selectedReport.reportDate }}</strong>
          </div>
          <div>
            <span>报告类型：</span><strong>{{ selectedReport.reportType }}</strong>
          </div>
          <div>
            <span>导入时间：</span><strong>{{ selectedReport.importedAt }}</strong>
          </div>
        </div>

        <div class="archive-detail-content">
          <section class="archive-image-panel">
            <div class="archive-section-title">
              <span class="archive-section-label">OCR识别原图</span>
              <el-button-group>
                <el-button :icon="ZoomOut" title="缩小" @click="zoomImage(-1)" />
                <el-select
                  class="archive-scale-select"
                  :model-value="imageScale"
                  aria-label="原图缩放比例"
                  @change="setImageScale"
                >
                  <el-option
                    v-for="scale in imageScales"
                    :key="scale"
                    :label="`${Math.round(scale * 100)}%`"
                    :value="scale"
                  />
                </el-select>
                <el-button :icon="ZoomIn" title="放大" @click="zoomImage(1)" />
              </el-button-group>
            </div>
            <div
              ref="imageViewportRef"
              class="archive-image-viewport"
              :class="{ 'is-dragging': draggingImage }"
              @wheel="handleImageWheel"
              @pointerdown="startImageDrag"
              @pointermove="moveImage"
              @pointerup="stopImageDrag"
              @pointercancel="stopImageDrag"
            >
              <img
                :src="selectedReport.imageUrl"
                :alt="`${selectedReport.reportName}原图`"
                :style="{ width: `${imageScale * 900}px` }"
                draggable="false"
              />
            </div>
          </section>

          <section class="archive-items-panel">
            <div class="archive-section-title">
              已归档检验项目
              <span>共 {{ selectedReport.items.length }} 项</span>
            </div>
            <el-table
              :data="selectedReport.items"
              border
              stripe
              height="100%"
              class="archive-items-table"
            >
              <el-table-column prop="ocrName" label="识别到的项目" min-width="140" show-overflow-tooltip />
              <el-table-column prop="systemItem" label="对应系统检验项目" min-width="170" show-overflow-tooltip />
              <el-table-column prop="result" label="结果" width="85" />
              <el-table-column prop="unit" label="单位" width="90" />
              <el-table-column prop="abnormal" label="异常" width="65" align="center">
                <template #default="{ row }">
                  <strong :class="{ abnormal: row.abnormal }">{{ row.abnormal || '-' }}</strong>
                </template>
              </el-table-column>
              <el-table-column prop="reference" label="参考值" width="110" />
              <el-table-column prop="status" label="匹配状态" width="90" align="center" />
              <el-table-column prop="source" label="匹配来源" width="100" align="center" />
            </el-table>
          </section>
        </div>
      </section>

      <el-empty v-else class="archive-detail-empty" description="请选择一条外院报告" />
    </div>
  </el-dialog>
</template>
