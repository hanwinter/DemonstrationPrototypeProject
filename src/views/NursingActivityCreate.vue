<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft, Search, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const requiredIconUrl = new URL('../../ProjectImage/必填项.png', import.meta.url).href

const router = useRouter()

const activityForm = reactive({
  name: '母婴陪护线下见面会',
  period: 3,
  link: 'https://mock.ycf.local/nursing/activity/001',
  address: '北京市朝阳区妇幼保健院母婴陪护服务中心 3 层活动室',
  startTime: '2026-07-30 09:30',
  endTime: '2026-07-30 18:00',
})

const staffKeyword = ref('')
const staffDialogVisible = ref(false)
const resumeDialogVisible = ref(false)
const previewDrawerVisible = ref(false)
const sorting = ref(false)
const currentStaff = ref(null)
const currentPreviewResume = ref(null)

const staffPool = [
  { id: '10001', name: '周仁莲', phone: '15012343355', age: 42, hometown: '四川南充', certificates: ['母婴护理师', '催乳师'], experience: '8 年母婴陪护经验，擅长新生儿日常护理与产妇月子餐安排。', intro: '沟通耐心，服务记录稳定，适合线下活动现场咨询和家庭服务转化。' },
  { id: '10002', name: '牛牛', phone: '15912341655', age: 36, hometown: '河南郑州', certificates: ['育婴员', '小儿推拿'], experience: '6 年婴幼儿照护经验，熟悉早教陪伴和作息建立。', intro: '性格亲和，适合婴幼儿照护专题活动的服务介绍。' },
  { id: '10003', name: '郑梅', phone: '13612348821', age: 39, hometown: '安徽合肥', certificates: ['母婴护理师', '营养配餐师'], experience: '7 年住家陪护经验，擅长产妇恢复期营养搭配。', intro: '服务案例完整，适合营养和恢复主题活动。' },
  { id: '10004', name: '焦薇', phone: '13812347208', age: 33, hometown: '河北保定', certificates: ['高级育婴师'], experience: '5 年育婴经验，熟悉宝宝洗护、抚触和家庭照护指导。', intro: '表达清晰，适合活动现场简历展示和家属咨询。' },
]

const resumes = [
  { id: 'resume001', staffId: '10001', consultantName: '李佳杰', shareCount: 3, shareTotal: 3, createTime: '2026-03-25 14:38:33' },
  { id: 'resume002', staffId: '10001', consultantName: '冉晶晶', shareCount: 0, shareTotal: 3, createTime: '2026-05-21 11:07:09' },
  { id: 'resume003', staffId: '10001', consultantName: '李文政', shareCount: 0, shareTotal: 3, createTime: '2026-05-14 09:21:00' },
  { id: 'resume004', staffId: '10002', consultantName: '冉晶晶', shareCount: 0, shareTotal: 3, createTime: '2026-05-21 11:07:09' },
  { id: 'resume005', staffId: '10002', consultantName: '李佳杰', shareCount: 1, shareTotal: 3, createTime: '2026-06-02 10:18:20' },
  { id: 'resume006', staffId: '10003', consultantName: '王晓丽', shareCount: 2, shareTotal: 3, createTime: '2026-04-16 15:32:18' },
  { id: 'resume007', staffId: '10004', consultantName: '陈静', shareCount: 1, shareTotal: 3, createTime: '2026-06-18 13:05:44' },
]

const activityStaff = ref([
  { activityId: '001', staffId: '10001', staffName: '周仁莲', resumeId: 'resume001', signTime: '2026-03-25' },
  { activityId: '001', staffId: '10002', staffName: '牛牛', resumeId: 'resume004', signTime: '2026-05-21' },
])

const filteredStaff = computed(() => {
  const keyword = staffKeyword.value.trim()
  if (!keyword) return staffPool
  return staffPool.filter((item) => item.name.includes(keyword) || item.phone.includes(keyword))
})
const currentStaffResumes = computed(() => resumes.filter((item) => item.staffId === currentStaff.value?.id))
const activityRows = computed(() => activityStaff.value.map((item, index) => ({
  ...item,
  index: index + 1,
  staff: staffPool.find((staff) => staff.id === item.staffId),
  resume: resumes.find((resume) => resume.id === item.resumeId),
})))

function resumeText(resume) {
  return resume ? `${resume.consultantName}顾问（${resume.shareCount}/${resume.shareTotal}）` : '未选择'
}
function openStaffDialog() {
  staffKeyword.value = ''
  staffDialogVisible.value = true
}
function selectStaff(staff) {
  currentStaff.value = staff
  staffDialogVisible.value = false
  resumeDialogVisible.value = true
}
function changeResume(row) {
  currentStaff.value = row.staff
  resumeDialogVisible.value = true
}
function chooseResume(resume) {
  const staff = currentStaff.value
  const existing = activityStaff.value.find((item) => item.staffId === staff.id)
  if (existing) {
    existing.resumeId = resume.id
  } else {
    activityStaff.value.push({ activityId: '001', staffId: staff.id, staffName: staff.name, resumeId: resume.id, signTime: resume.createTime.slice(0, 10) })
  }
  resumeDialogVisible.value = false
}
function removeStaff(row) {
  activityStaff.value = activityStaff.value.filter((item) => item.staffId !== row.staffId)
}
function openPreview(resume, staff = currentStaff.value) {
  currentStaff.value = staff
  currentPreviewResume.value = resume
  previewDrawerVisible.value = true
}
function moveStaff(row, step) {
  const index = activityStaff.value.findIndex((item) => item.staffId === row.staffId)
  const nextIndex = index + step
  if (index < 0 || nextIndex < 0 || nextIndex >= activityStaff.value.length) return
  const list = [...activityStaff.value]
  const [item] = list.splice(index, 1)
  list.splice(nextIndex, 0, item)
  activityStaff.value = list
}
function saveActivity() {
  if (!activityForm.name.trim()) {
    ElMessage.warning('请填写活动名称')
    return
  }
  if (!activityForm.period) {
    ElMessage.warning('请填写活动期数')
    return
  }
  if (!activityForm.address.trim()) {
    ElMessage.warning('请填写活动地址')
    return
  }
  if (!activityForm.startTime) {
    ElMessage.warning('请选择开始时间')
    return
  }
  if (!activityForm.endTime) {
    ElMessage.warning('请选择结束时间')
    return
  }
  ElMessage.success('活动已保存，服务员与简历关联已更新')
}
</script>

<template>
  <div class="nursing-page">
    <header class="system-header">
      <div class="header-title">母婴陪护</div><div class="header-meta">演示账号：运营专员</div>
    </header>

    <main class="nursing-main">
      <section class="page-heading">
        <div class="heading-left">
          <el-button text :icon="ArrowLeft" @click="router.push('/')">返回首页</el-button>
          <span class="heading-divider"></span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>nursing</el-breadcrumb-item>
            <el-breadcrumb-item>线下活动创建</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <span class="page-code">活动编号：001</span>
      </section>

      <section class="activity-card">
        <div class="card-title">
          <div><h2>活动详情</h2></div>
          <el-button type="primary" @click="saveActivity">保存活动</el-button>
        </div>
        <el-form label-position="left" label-width="100px" class="activity-form">
          <el-form-item><template #label><span class="field-label required"><img :src="requiredIconUrl" alt="" />活动名称：</span></template><el-input v-model="activityForm.name" /></el-form-item>
          <el-form-item><template #label><span class="field-label required"><img :src="requiredIconUrl" alt="" />活动期数：</span></template><el-input-number v-model="activityForm.period" :min="1" controls-position="right" /></el-form-item>
          <el-form-item label="活动链接：" class="full"><div class="readonly-link">{{ activityForm.link }}</div></el-form-item>
          <el-form-item class="full"><template #label><span class="field-label required"><img :src="requiredIconUrl" alt="" />活动地址：</span></template><el-input v-model="activityForm.address" type="textarea" :rows="3" /></el-form-item>
          <el-form-item><template #label><span class="field-label required"><img :src="requiredIconUrl" alt="" />开始时间：</span></template><el-date-picker v-model="activityForm.startTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item>
          <el-form-item><template #label><span class="field-label required"><img :src="requiredIconUrl" alt="" />结束时间：</span></template><el-date-picker v-model="activityForm.endTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item>
        </el-form>
      </section>

      <section class="staff-card">
        <div class="card-title">
          <div><h2>本期服务员</h2></div>
          <div class="title-actions"><el-button type="primary" plain @click="openStaffDialog">关联服务员</el-button><el-button @click="sorting = !sorting">{{ sorting ? '完成排序' : '调整顺序' }}</el-button></div>
        </div>
        <el-table :data="activityRows" border class="staff-table">
          <el-table-column prop="index" label="序号" width="72" align="center" />
          <el-table-column prop="staffName" label="服务员姓名" width="105" />
          <el-table-column label="手机号" width="125"><template #default="{ row }">{{ row.staff?.phone }}</template></el-table-column>
          <el-table-column label="使用简历" min-width="220"><template #default="{ row }"><span class="resume-name"><strong>{{ row.resume?.consultantName }}</strong>顾问版本</span></template></el-table-column>
          <el-table-column prop="signTime" label="签约时间" width="130" />
          <el-table-column v-if="sorting" label="排序" width="92">
            <template #default="{ row }">
              <el-button link type="primary" :disabled="row.index === 1" @click="moveStaff(row, -1)">↑</el-button>
              <el-button link type="primary" :disabled="row.index === activityRows.length" @click="moveStaff(row, 1)">↓</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <div class="row-actions"><el-button link type="primary" @click="openPreview(row.resume, row.staff)">查看简历</el-button><el-button link type="primary" @click="changeResume(row)">更换简历</el-button><el-button link type="danger" @click="removeStaff(row)">删除</el-button></div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </main>

    <el-dialog v-model="staffDialogVisible" title="选择服务员" width="720px">
      <div class="dialog-toolbar"><el-input v-model="staffKeyword" clearable placeholder="姓名/手机号"><template #prefix><el-icon><Search /></el-icon></template></el-input></div>
      <el-table :data="filteredStaff" border>
        <el-table-column label="选择" width="82"><template #default="{ row }"><el-button link type="primary" @click="selectStaff(row)">选择</el-button></template></el-table-column>
        <el-table-column prop="name" label="服务员姓名" />
        <el-table-column prop="phone" label="手机号" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="resumeDialogVisible" title="选择服务员简历" width="860px">
      <div class="current-staff">当前服务员：<strong>{{ currentStaff?.name }}</strong></div>
      <el-table :data="currentStaffResumes" border>
        <el-table-column prop="consultantName" label="顾问姓名" />
        <el-table-column prop="shareCount" label="分享次数" width="110" />
        <el-table-column prop="shareTotal" label="分享总数" width="110" />
        <el-table-column prop="createTime" label="创建时间" min-width="170" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="chooseResume(row)">选择</el-button>
            <el-button link type="primary" @click="openPreview(row)">查看简历</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-drawer v-model="previewDrawerVisible" title="服务员简历预览" size="420px">
      <div v-if="currentPreviewResume && currentStaff" class="phone-preview">
        <section class="phone-card profile-card">
          <div class="avatar">{{ currentStaff.name.slice(0, 1) }}</div>
          <h3>{{ currentStaff.name }}</h3>
          <p>{{ currentStaff.age }} 岁 ｜ {{ currentStaff.hometown }}</p>
          <span>{{ resumeText(currentPreviewResume) }}</span>
        </section>
        <section class="phone-card"><h4>专业证书</h4><p>{{ currentStaff.certificates.join('、') }}</p></section>
        <section class="phone-card"><h4>工作经验</h4><p>{{ currentStaff.experience }}</p></section>
        <section class="phone-card"><h4>个人简介</h4><p>{{ currentStaff.intro }}</p></section>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.nursing-page { min-height: 100vh; color: #303846; background: #edf1f5; }
.nursing-main { max-width: 1280px; margin: 0 auto; padding: 12px 18px 28px; }
.header-title { font-size: 16px; font-weight: 600; }
.page-heading { height: 52px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); }
.heading-left { display: flex; align-items: center; gap: 12px; }
.heading-divider { width: 1px; height: 18px; background: #d8e0e8; }
.page-code { color: #718096; font-size: 13px; }
.activity-card, .staff-card { margin-top: 14px; padding: 18px; background: #fff; border: 1px solid #d8e0e8; }
.card-title { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.card-title h2 { margin: 0; color: #24364b; font-size: 20px; }
.card-title p { margin: 6px 0 0; color: #718096; font-size: 13px; }
.activity-form { display: grid; grid-template-columns: minmax(0, calc(100px + 30em)) 300px; gap: 0 10px; align-items: start; }
.activity-form .full { grid-column: 1 / -1; }
.activity-form :deep(.el-form-item) { margin-bottom: 14px; }
.activity-form :deep(.el-form-item__label) { height: 32px; line-height: 32px; padding-right: 4px; justify-content: flex-end; text-align: right; color: #5f6f82; }
.activity-form :deep(.el-form-item__content) { line-height: 32px; }
.activity-form :deep(.el-input-number) { width: 86px; }
.activity-form :deep(.el-date-editor) { width: 200px; }
.readonly-link { min-height: 32px; display: flex; align-items: center; color: #33465b; }
.field-label { width: 100%; display: inline-flex; align-items: center; justify-content: flex-end; }
.field-label.required img { width: 12px; height: 12px; margin-right: 4px; object-fit: contain; }
.resume-name strong { font-weight: 600; }
.title-actions { display: flex; align-items: center; gap: 8px; }
.staff-table { --el-table-header-bg-color: #f3f6fa; }
.row-actions { display: flex; align-items: center; gap: 12px; white-space: nowrap; }
.row-actions :deep(.el-button) { margin: 0; padding: 0; }
.dialog-toolbar { margin-bottom: 12px; }
.current-staff { margin-bottom: 12px; color: #5f6f82; }
.phone-preview { width: 320px; min-height: 620px; margin: 0 auto; padding: 18px; border: 10px solid #202936; border-radius: 30px; background: #f7fbfa; }
.phone-card { margin-bottom: 12px; padding: 14px; background: #fff; border-radius: 8px; box-shadow: 0 8px 22px rgba(28, 91, 92, .055); }
.profile-card { text-align: center; }
.avatar { width: 64px; height: 64px; margin: 0 auto 10px; display: grid; place-items: center; color: #fff; font-size: 26px; font-weight: 700; border-radius: 50%; background: #12a8ad; }
.phone-card h3, .phone-card h4 { margin: 0 0 8px; color: #20343a; }
.phone-card p { margin: 0; color: #60757c; line-height: 1.6; }
.phone-card span { display: inline-block; margin-top: 8px; padding: 4px 9px; color: #12a8ad; background: #e8f8f6; border-radius: 999px; font-size: 12px; font-weight: 700; }
@media (max-width: 760px) {
  .page-heading, .card-title { height: auto; align-items: stretch; flex-direction: column; }
  .activity-form { grid-template-columns: 1fr; }
}
</style>












