<script setup>
import { ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'
import ConsentEditModal from '../components/consent/ConsentEditModal.vue'
import ConsentList from '../components/consent/ConsentList.vue'
import ConsentMobileSignPage from '../components/consent/ConsentMobileSignPage.vue'
import ConsentPreviewModal from '../components/consent/ConsentPreviewModal.vue'
import ConsentPrintPreview from '../components/consent/ConsentPrintPreview.vue'
import ConsentQrCodeModal from '../components/consent/ConsentQrCodeModal.vue'
import DoctorSignModal from '../components/consent/DoctorSignModal.vue'
import {
  consentPatient,
  createConsentDraft,
  createMockConsentDocuments,
  formatNow,
} from '../mock/consentDocuments'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const activeArchiveTab = ref('consent')
const documents = ref(createMockConsentDocuments())
const selectedDocument = ref(null)
const editDocument = ref(null)
const editVisible = ref(false)
const previewVisible = ref(false)
const qrVisible = ref(false)
const mobileSignVisible = ref(false)
const doctorSignVisible = ref(false)
const printVisible = ref(false)


function upsertDocument(payload, status = 'draft') {
  const now = formatNow()
  if (payload.id) {
    const index = documents.value.findIndex((item) => item.id === payload.id)
    if (index >= 0) {
      documents.value[index] = {
        ...documents.value[index],
        ...payload,
        status,
      }
      return documents.value[index]
    }
  }

  const created = createConsentDraft({
    ...payload,
    id: Date.now(),
    createdAt: payload.createdAt || now,
    status,
  })
  documents.value.unshift(created)
  return created
}

function openCreate() {
  editDocument.value = null
  editVisible.value = true
}

function openEdit(document) {
  if (document.status !== 'draft') {
    ElMessage.warning('只有草稿状态允许编辑')
    return
  }
  editDocument.value = { ...document }
  editVisible.value = true
}

function openPreview(document) {
  selectedDocument.value = document
  previewVisible.value = true
}

function saveDraft(payload) {
  const document = upsertDocument(payload, 'draft')
  selectedDocument.value = document
  editVisible.value = false
  ElMessage.success('知情同意书草稿已保存')
}

function previewFromEdit(payload) {
  selectedDocument.value = createConsentDraft({
    ...payload,
    id: payload.id || 'preview',
    status: payload.status || 'draft',
  })
  previewVisible.value = true
}

function generateQrFromEdit(payload) {
  const document = upsertDocument(payload, 'draft')
  selectedDocument.value = document
  editVisible.value = false
  qrVisible.value = true
  ElMessage.success('已生成模拟签字二维码')
}

function openQr(document) {
  selectedDocument.value = document
  qrVisible.value = true
}

function openMobileSign(document) {
  selectedDocument.value = document
  qrVisible.value = false
  mobileSignVisible.value = true
}

function submitPatientSignature(payload) {
  updateSelected({
    ...payload,
    patientSignedAt: formatNow(),
  })
  mobileSignVisible.value = false
  ElMessage.success('孕妇/家属签字已提交')
}

function openDoctorSign(document) {
  selectedDocument.value = document
  doctorSignVisible.value = true
}

function submitDoctorSignature(payload) {
  updateSelected(payload)
  doctorSignVisible.value = false
  ElMessage.success('医生签字已完成，可进行归档')
}

async function archiveDocument(document) {
  selectedDocument.value = document
  if (!document.patientSignature || !document.doctorSignature) {
    ElMessage.warning('请完成孕妇/家属签字和医生签字后再归档。')
    return
  }

  try {
    await ElMessageBox.confirm('归档后文书内容将锁定，不允许修改。是否确认归档？', '确认归档', {
      type: 'warning',
      confirmButtonText: '确认归档',
      cancelButtonText: '取消',
    })
    updateSelected({
      status: 'archived',
      archivedAt: formatNow(),
    })
    ElMessage.success('知情同意书已归档')
  } catch {
    // User cancelled.
  }
}

function openPrint(document) {
  if (document.status === 'voided') {
    ElMessage.warning('已作废文书不允许打印')
    return
  }
  selectedDocument.value = document
  printVisible.value = true
}

function printSelected(rows) {
  if (!rows.length) {
    ElMessage.warning('请先选择需要打印的文书')
    return
  }
  const printable = rows.find((item) => item.status !== 'voided')
  if (!printable) {
    ElMessage.warning('已作废文书不允许打印')
    return
  }
  openPrint(printable)
}

function markPrinted() {
  if (!selectedDocument.value) return
  updateSelected({
    printCount: (selectedDocument.value.printCount || 0) + 1,
  })
}

async function voidDocument(document) {
  try {
    const { value } = await ElMessageBox.prompt('请填写作废原因', '作废知情同意书', {
      confirmButtonText: '确认作废',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '作废原因不能为空',
      type: 'warning',
    })
    selectedDocument.value = document
    updateSelected({
      status: 'voided',
      voidReason: value,
    })
    ElMessage.success('文书已作废，原始内容和签字信息已保留')
  } catch {
    // User cancelled.
  }
}

function updateSelected(patch) {
  if (!selectedDocument.value) return
  const index = documents.value.findIndex((item) => item.id === selectedDocument.value.id)
  if (index < 0) return
  documents.value[index] = {
    ...documents.value[index],
    ...patch,
  }
  selectedDocument.value = documents.value[index]
}

function refreshList() {
  ElMessage.success('已刷新 mock 数据列表')
}
</script>

<template>
  <div class="consent-page app-shell">
    <header class="system-header">
      <div class="brand">
        <img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" />
      </div>
      <DemoPageNavigation />
      <div class="header-meta">操作员：张医生</div>
    </header>

    <main class="page consent-main">
      <section class="page-heading">
        <div class="heading-left">
          <el-button text :icon="ArrowLeft" @click="router.push('/outpatient')">返回档案</el-button>
          <span class="heading-divider"></span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>孕产妇档案详情</el-breadcrumb-item>
            <el-breadcrumb-item>知情同意书</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

      </section>

      <section class="patient-bar">
        <span class="patient-label">孕产妇信息</span>
        <div><span>姓名：</span><strong>{{ consentPatient.name }}</strong></div>
        <div><span>档案号：</span><strong>{{ consentPatient.archiveNo }}</strong></div>
        <div><span>年龄：</span><strong>{{ consentPatient.age }}</strong></div>
        <div><span>孕周：</span><strong>{{ consentPatient.gestationalAge }}</strong></div>
        <div><span>联系电话：</span><strong>{{ consentPatient.phone }}</strong></div>
        <div><span>建档机构：</span><strong>{{ consentPatient.institution }}</strong></div>
      </section>

      <section class="archive-tabs">
        <el-tabs v-model="activeArchiveTab">
          <el-tab-pane label="基本信息" name="base" disabled />
          <el-tab-pane label="产检记录" name="check" disabled />
          <el-tab-pane label="高危管理" name="risk" disabled />
          <el-tab-pane label="追访记录" name="follow" disabled />
          <el-tab-pane label="外院报告" name="external" disabled />
          <el-tab-pane label="知情同意书" name="consent" />
          <el-tab-pane label="档案资料" name="archive" disabled />
        </el-tabs>
      </section>


      <ConsentList
        :documents="documents"
        @create="openCreate"
        @edit="openEdit"
        @preview="openPreview"
        @qr="openQr"
        @doctor-sign="openDoctorSign"
        @archive="archiveDocument"
        @print="openPrint"
        @void="voidDocument"
        @print-selected="printSelected"
        @refresh="refreshList"
      />
    </main>

    <ConsentEditModal
      v-model="editVisible"
      :document="editDocument"
      @save-draft="saveDraft"
      @preview="previewFromEdit"
      @generate-qr="generateQrFromEdit"
    />

    <ConsentPreviewModal
      v-model="previewVisible"
      :document="selectedDocument"
      @edit="openEdit"
      @qr="openQr"
      @doctor-sign="openDoctorSign"
      @archive="archiveDocument"
      @print="openPrint"
    />

    <ConsentQrCodeModal
      v-model="qrVisible"
      :document="selectedDocument"
      @copy-link="ElMessage.success('模拟签字链接已复制')"
      @open-sign="openMobileSign"
    />

    <ConsentMobileSignPage
      v-model="mobileSignVisible"
      :document="selectedDocument"
      @submit="submitPatientSignature"
    />

    <DoctorSignModal
      v-model="doctorSignVisible"
      @submit="submitDoctorSignature"
    />

    <ConsentPrintPreview
      v-model="printVisible"
      :document="selectedDocument"
      @printed="markPrinted"
    />
  </div>
</template>

<style scoped>
.consent-page {
  min-width: 1600px;
  background: #edf1f5;
}

.consent-main {
  padding-bottom: 24px;
}

.archive-tabs {
  margin-top: 12px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid var(--border-color);
}

.archive-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.archive-tabs :deep(.el-tabs__item) {
  height: 48px;
  font-size: 15px;
}


@media print {
  .system-header,
  .consent-main,
  :deep(.el-overlay-dialog > .el-dialog__header),
  :deep(.el-overlay-dialog > .el-dialog__body > .print-preview > .print-toolbar) {
    display: none !important;
  }
}
</style>



