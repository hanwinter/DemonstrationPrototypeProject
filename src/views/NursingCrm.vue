<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const activeEditor = ref('')
const editorVisible = ref(false)
const sourceSheetVisible = ref(false)
const sourceTarget = ref('')
const mediaTarget = ref('')
const selectedMedia = ref([])

const workPhoto = new URL('../../ProjectImage/工作照.png', import.meta.url).href
const mealPhoto = new URL('../../ProjectImage/月子餐.png', import.meta.url).href
const reviewPhoto = new URL('../../ProjectImage/好评照.png', import.meta.url).href

const staffList = [
  { id: 1, name: '张洪霞', age: 50, nativePlace: '吉林', nation: '汉族', star: '暂无星级', serviceArea: '北京公司服务', avatar: '' },
  { id: 2, name: '邢会平', age: 53, nativePlace: '河南', nation: '汉族', star: '四星', serviceArea: '北京公司服务', avatar: '' },
  { id: 3, name: '张菊霞', age: 44, nativePlace: '甘肃', nation: '汉族', star: '五星', serviceArea: '北京公司服务', avatar: '' },
  { id: 4, name: '李秀兰', age: 48, nativePlace: '河北', nation: '汉族', star: '三星', serviceArea: '朝阳区服务', avatar: '' },
  { id: 5, name: '王春梅', age: 46, nativePlace: '山东', nation: '汉族', star: '四星', serviceArea: '海淀区服务', avatar: '' },
]

const staffMedia = {
  staffId: 1,
  category: '个人照片',
  photos: [
    { url: workPhoto, uploadTime: '2026-07-20 09:30' },
    { url: workPhoto, uploadTime: '2026-07-21 14:12' },
    { url: workPhoto, uploadTime: '2026-07-22 10:05' },
    { url: mealPhoto, uploadTime: '2026-07-23 16:40' },
    { url: reviewPhoto, uploadTime: '2026-07-24 11:18' },
  ],
}

const displayProfiles = reactive({
  1: {
    staffId: 1,
    personalIntro: '本人从事母婴护理行业10余年，具有丰富的新生儿护理和产妇照护经验。熟悉宝宝日常护理、喂养指导、睡眠调整及产后恢复护理。工作认真负责，耐心细致，深受客户认可。',
    workPhotos: [workPhoto, workPhoto, workPhoto],
    mealPhotos: [mealPhoto, mealPhoto],
    reviewPhotos: [reviewPhoto, reviewPhoto, reviewPhoto],
  },
})
const emptyProfile = reactive({ staffId: 0, personalIntro: '', workPhotos: [], mealPhotos: [], reviewPhotos: [] })

const editDraft = reactive({
  personalIntro: '',
  workPhotos: [],
  mealPhotos: [],
  reviewPhotos: [],
})
const visibility = reactive({
  personalIntro: true,
  workPhotos: true,
  mealPhotos: true,
  reviewPhotos: true,
})

const mediaSelectMode = computed(() => route.name === 'nursing-crm-media-select')
const detailMode = computed(() => route.name === 'nursing-crm-staff')
const currentStaff = computed(() => staffList.find((item) => String(item.id) === String(route.params.id)) || staffList[0])
const staffDisplayProfile = computed(() => displayProfiles[currentStaff.value.id] || emptyProfile)
const filteredStaff = computed(() => {
  const value = keyword.value.trim()
  if (!value) return staffList
  return staffList.filter((item) => item.name.includes(value) || String(13612340000 + item.id).includes(value))
})

function avatarText(name = '') {
  return name.slice(0, 1)
}
function openStaff(staff) {
  router.push(`/nursing/crm/staff/${staff.id}`)
}
function backToList() {
  router.push('/nursing/crm')
}
function backToDetail() {
  router.push(`/nursing/crm/staff/${currentStaff.value.id}`)
}
function ensureCurrentProfile() {
  if (!displayProfiles[currentStaff.value.id]) {
    displayProfiles[currentStaff.value.id] = { staffId: currentStaff.value.id, personalIntro: '', workPhotos: [], mealPhotos: [], reviewPhotos: [] }
  }
  return displayProfiles[currentStaff.value.id]
}
function openEditor(type) {
  activeEditor.value = type
  editorVisible.value = true
  editDraft.personalIntro = staffDisplayProfile.value.personalIntro
  editDraft.workPhotos = [...staffDisplayProfile.value.workPhotos]
  editDraft.mealPhotos = [...staffDisplayProfile.value.mealPhotos]
  editDraft.reviewPhotos = [...staffDisplayProfile.value.reviewPhotos]
}
function closeEditor() {
  editorVisible.value = false
  activeEditor.value = ''
}
function saveEditor() {
  const profile = ensureCurrentProfile()
  if (activeEditor.value === '个人简介') profile.personalIntro = editDraft.personalIntro
  if (activeEditor.value === '工作照') profile.workPhotos = [...editDraft.workPhotos]
  if (activeEditor.value === '月子餐') profile.mealPhotos = [...editDraft.mealPhotos]
  if (activeEditor.value === '好评照') profile.reviewPhotos = [...editDraft.reviewPhotos]
  ElMessage.success('展示资料已保存')
  closeEditor()
}
function sharePoster() {
  ElMessage.success('已生成分享海报')
}
function openSourcePicker(target) {
  sourceTarget.value = target
  sourceSheetVisible.value = true
}
function openMediaSelect() {
  mediaTarget.value = sourceTarget.value
  selectedMedia.value = []
  sourceSheetVisible.value = false
  router.push(`/nursing/crm/staff/${currentStaff.value.id}/media-select`)
}
function mediaKey(photo, index) {
  return `${photo}-${index}`
}
function toggleMedia(photo, index) {
  const key = mediaKey(photo, index)
  if (selectedMedia.value.includes(key)) selectedMedia.value = selectedMedia.value.filter((item) => item !== key)
  else selectedMedia.value.push(key)
}
function isMediaSelected(photo, index) {
  return selectedMedia.value.includes(mediaKey(photo, index))
}
function confirmMediaSelect() {
  const photos = staffMedia.photos.filter((photo, index) => isMediaSelected(photo, index)).map((photo) => photo.url)
  if (mediaTarget.value === 'workPhotos') editDraft.workPhotos.push(...photos)
  if (mediaTarget.value === 'mealPhotos') editDraft.mealPhotos.push(...photos)
  if (mediaTarget.value === 'reviewPhotos') editDraft.reviewPhotos.push(...photos)
  selectedMedia.value = []
  ElMessage.success('照片已添加')
  backToDetail()
}
function selectPhotoSource(type = 'upload') {
  if (type === 'media') {
    openMediaSelect()
    return
  }
  if (sourceTarget.value === 'workPhotos') editDraft.workPhotos.push(workPhoto)
  if (sourceTarget.value === 'mealPhotos') editDraft.mealPhotos.push(mealPhoto)
  if (sourceTarget.value === 'reviewPhotos') editDraft.reviewPhotos.push(reviewPhoto)
  sourceSheetVisible.value = false
  ElMessage.success('照片已添加')
}
function currentEditPhotos() {
  if (activeEditor.value === '工作照') return editDraft.workPhotos
  if (activeEditor.value === '月子餐') return editDraft.mealPhotos
  return editDraft.reviewPhotos
}
function removePhoto(index) {
  ElMessageBox.confirm('是否删除该照片？', '提示', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
    .then(() => {
      currentEditPhotos().splice(index, 1)
      ElMessage.success('照片已删除')
    })
    .catch(() => {})
}
</script>

<template>
  <main class="crm-shell">
    <section class="phone-frame">
      <template v-if="!detailMode && !mediaSelectMode"><section class="crm-list-page">
        <section class="crm-banner"><div><h1>母婴陪护服务员资料库</h1><p>专业月嫂 / 育儿嫂展示</p></div></section>
        <section class="search-card"><el-input v-model="keyword" clearable placeholder="请输入服务员姓名/手机号"><template #prefix><el-icon><Search /></el-icon></template></el-input><button type="button">查询</button></section>
        <section class="result-section"><h2>查询结果</h2><button v-for="staff in filteredStaff" :key="staff.id" class="staff-row" type="button" @click="openStaff(staff)"><span class="avatar">{{ avatarText(staff.name) }}</span><span class="staff-info"><strong>{{ staff.name }}<em>{{ staff.age }}岁 | {{ staff.nativePlace }}</em></strong><small>{{ staff.serviceArea }}</small></span><i>&gt;</i></button></section>
      </section></template>

      <template v-else-if="mediaSelectMode">
        <section class="media-select-page">
          <header class="detail-nav"><button type="button" @click="backToDetail"><el-icon><ArrowLeft /></el-icon></button><span>选择照片</span></header>
          <section class="media-owner">当前服务员：<strong>{{ currentStaff.name }}</strong></section>
          <section class="media-category"><h2>个人照片（{{ staffMedia.photos.length }}）</h2><div class="media-grid"><button v-for="(photo,index) in staffMedia.photos" :key="`${photo.url}-${index}`" type="button" :class="['media-item',{ selected:isMediaSelected(photo,index) }]" @click="toggleMedia(photo,index)"><span class="media-thumb"><img :src="photo.url" alt="" /><i>✓</i></span><small>上传时间：{{ photo.uploadTime }}</small></button></div></section>
          <footer class="media-actions"><strong>已选择 {{ selectedMedia.length }} 张</strong><button type="button" @click="backToDetail">取消</button><button type="button" :disabled="!selectedMedia.length" @click="confirmMediaSelect">确认添加</button></footer>
        </section>
      </template>
      <template v-else>
        <header class="detail-nav"><button type="button" @click="backToList"><el-icon><ArrowLeft /></el-icon></button><span>服务员展示资料</span></header>
        <section class="profile-hero"><div><h1>{{ currentStaff.name }}</h1><p>年龄：{{ currentStaff.age }}岁</p></div><span class="profile-avatar">{{ avatarText(currentStaff.name) }}</span><ul><li>{{ currentStaff.nativePlace }}</li><li>{{ currentStaff.nation }}</li><li>{{ currentStaff.star }}</li></ul></section>
        <section class="module-list detail-scroll">
          <article class="module-card"><div class="module-head"><h2>个人简介</h2><div class="module-tools"><el-switch v-model="visibility.personalIntro" size="small" /><button type="button" @click="openEditor('个人简介')">编辑</button></div></div><p v-if="staffDisplayProfile.personalIntro">{{ staffDisplayProfile.personalIntro }}</p></article>
          <article class="module-card"><div class="module-head"><h2>工作照</h2><div class="module-tools"><el-switch v-model="visibility.workPhotos" size="small" /><button type="button" @click="openEditor('工作照')">编辑</button></div></div><div v-if="staffDisplayProfile.workPhotos.length" class="photo-grid"><img v-for="(photo,index) in staffDisplayProfile.workPhotos" :key="`${photo}-${index}`" :src="photo" alt="" /></div></article>
          <article class="module-card"><div class="module-head"><h2>月子餐</h2><div class="module-tools"><el-switch v-model="visibility.mealPhotos" size="small" /><button type="button" @click="openEditor('月子餐')">编辑</button></div></div><div v-if="staffDisplayProfile.mealPhotos.length" class="photo-grid"><img v-for="(photo,index) in staffDisplayProfile.mealPhotos" :key="`${photo}-${index}`" :src="photo" alt="" /></div></article>
          <article class="module-card"><div class="module-head"><h2>好评照</h2><div class="module-tools"><el-switch v-model="visibility.reviewPhotos" size="small" /><button type="button" @click="openEditor('好评照')">编辑</button></div></div><div v-if="staffDisplayProfile.reviewPhotos.length" class="photo-grid"><img v-for="(photo,index) in staffDisplayProfile.reviewPhotos" :key="`${photo}-${index}`" :src="photo" alt="" /></div></article>
        </section>
        <footer class="bottom-actions"><button type="button" @click="sharePoster">分享</button><button type="button" @click="sharePoster">生成海报到手机</button></footer>
      </template>

      <div v-if="editorVisible && !mediaSelectMode" class="sheet-mask" @click.self="closeEditor">
        <section class="bottom-sheet">
          <header><h2>编辑{{ activeEditor }}</h2></header>
          <section v-if="activeEditor === '个人简介'" class="editor-form"><textarea v-model="editDraft.personalIntro" /></section>
          <section v-else-if="activeEditor === '工作照'" class="sheet-content"><div class="sheet-count">当前照片（{{ editDraft.workPhotos.length }}）</div><div class="edit-photo-grid"><div v-for="(photo,index) in editDraft.workPhotos" :key="`${photo}-${index}`" class="edit-photo-item"><img :src="photo" alt="" /><button type="button" @click="removePhoto(index)">×</button></div></div><button class="add-photo" type="button" @click="openSourcePicker('workPhotos')">+ 添加照片</button></section>
          <section v-else-if="activeEditor === '月子餐'" class="sheet-content"><div class="sheet-count">当前照片（{{ editDraft.mealPhotos.length }}）</div><div class="edit-photo-grid"><div v-for="(photo,index) in editDraft.mealPhotos" :key="`${photo}-${index}`" class="edit-photo-item"><img :src="photo" alt="" /><button type="button" @click="removePhoto(index)">×</button></div></div><button class="add-photo" type="button" @click="openSourcePicker('mealPhotos')">+ 添加照片</button></section>
          <section v-else class="sheet-content"><div class="sheet-count">当前照片（{{ editDraft.reviewPhotos.length }}）</div><div class="edit-photo-grid"><div v-for="(photo,index) in editDraft.reviewPhotos" :key="`${photo}-${index}`" class="edit-photo-item"><img :src="photo" alt="" /><button type="button" @click="removePhoto(index)">×</button></div></div><button class="add-photo" type="button" @click="openSourcePicker('reviewPhotos')">+ 添加照片</button></section>
          <footer><button type="button" @click="closeEditor">取消</button><button type="button" @click="saveEditor">保存</button></footer>
        </section>
      </div>
      <div v-if="sourceSheetVisible && !mediaSelectMode" class="sheet-mask source-mask" @click.self="sourceSheetVisible = false"><section class="source-sheet"><h2>选择照片来源</h2><button type="button" @click="selectPhotoSource('media')">从服务员资料库选择</button><button type="button" @click="selectPhotoSource('upload')">从手机相册上传</button><button type="button" @click="selectPhotoSource('camera')">拍照上传</button></section></div>
    </section>
  </main>
</template>

<style scoped>
.crm-shell{min-height:100vh;padding:22px 0;background:#f2f4f7;font-family:"Microsoft YaHei",Arial,sans-serif;color:#2d3340}.phone-frame{width:375px;height:720px;margin:0 auto;background:#fff;border-radius:26px;box-shadow:0 16px 40px rgba(48,55,72,.14);overflow:hidden;position:relative}.crm-list-page{height:100%;overflow-y:auto;overflow-x:hidden;background:#fff}.crm-list-page::-webkit-scrollbar,.detail-scroll::-webkit-scrollbar,.sheet-content::-webkit-scrollbar{width:4px}.crm-list-page::-webkit-scrollbar-track,.detail-scroll::-webkit-scrollbar-track,.sheet-content::-webkit-scrollbar-track{background:transparent}.crm-list-page::-webkit-scrollbar-thumb,.detail-scroll::-webkit-scrollbar-thumb,.sheet-content::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,111,145,.35)}.crm-banner{height:168px;padding:28px 24px;display:flex;align-items:flex-end;color:#fff;background:linear-gradient(135deg,#ff8aa2,#ff5d83 48%,#ff9a70);border-bottom-left-radius:28px;border-bottom-right-radius:28px}.crm-banner h1{margin:0;font-size:23px;line-height:1.25}.crm-banner p{margin:8px 0 0;font-size:14px;opacity:.92}.search-card{margin:-20px 16px 16px;padding:12px;display:grid;grid-template-columns:1fr 72px;gap:8px;background:#fff;border-radius:16px;box-shadow:0 10px 26px rgba(229,76,113,.12);position:relative}.search-card button{border:0;border-radius:10px;color:#fff;background:#ff6f91;font-weight:700}.result-section{padding:0 16px 22px}.result-section h2{margin:0 0 12px;font-size:17px}.staff-row{width:100%;min-height:82px;margin-bottom:10px;padding:12px;display:grid;grid-template-columns:52px minmax(0,1fr) 18px;gap:12px;align-items:center;text-align:left;border:0;border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(32,42,58,.08)}.avatar,.profile-avatar{display:grid;place-items:center;border-radius:50%;color:#fff;background:linear-gradient(135deg,#ff8aa2,#ff5d83);font-weight:800}.avatar{width:52px;height:52px}.staff-info{display:grid;gap:6px}.staff-info strong{display:flex;align-items:baseline;gap:8px;font-size:16px}.staff-info em{font-style:normal;font-weight:400;color:#6c7482;font-size:13px}.staff-info small{color:#9aa2ad}.staff-row i{color:#c0c6cf;font-style:normal}.detail-nav{height:48px;padding:0 14px;display:grid;grid-template-columns:34px 1fr 34px;align-items:center}.detail-nav button{border:0;background:transparent;color:#4b5565}.detail-nav span{text-align:center;font-weight:700}.profile-hero{margin:6px 16px 16px;padding:18px;display:grid;grid-template-columns:1fr 66px;gap:14px;color:#fff;border-radius:24px;background:linear-gradient(135deg,#f85d74,#ff8a64)}.profile-avatar{width:66px;height:66px;background:rgba(255,255,255,.24)}.profile-hero h1{margin:0;font-size:22px}.profile-hero p{margin:8px 0 0}.profile-hero ul{grid-column:1/-1;margin:4px 0 0;padding:0;display:flex;gap:8px;list-style:none}.profile-hero li{padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.22);font-size:12px}.module-list{padding:0 16px 92px}.detail-scroll{height:488px;overflow-y:auto;overflow-x:hidden}.module-card{margin-bottom:12px;padding:14px 16px;border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(32,42,58,.08)}.module-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.module-head h2{margin:0;font-size:17px}.module-tools{display:flex;align-items:center;gap:8px}.module-tools :deep(.el-switch){--el-switch-on-color:#ff6688;--el-switch-off-color:#eef1f5}.module-tools :deep(.el-switch__core){height:18px;min-width:34px;border-color:transparent;background:#eef1f5}.module-tools :deep(.el-switch.is-checked .el-switch__core){background:linear-gradient(135deg,#ff8aa2,#ff5d83);box-shadow:0 3px 8px rgba(255,95,133,.24)}.module-tools :deep(.el-switch__action){width:14px;height:14px}.module-head button{border:0;background:transparent;color:#ff6688;font-weight:700}.module-card p{margin:0;color:#5c6573;font-size:13px;line-height:1.65}.empty-state{height:64px;display:grid;place-items:center;color:#a2aab6;background:#f7f8fa;border-radius:12px}.photo-grid,.edit-photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.photo-grid img,.edit-photo-grid img{width:100%;aspect-ratio:1;border-radius:12px;object-fit:cover;background:#f4f5f7}.bottom-actions{position:absolute;left:0;right:0;bottom:0;padding:12px 16px 18px;display:grid;grid-template-columns:1fr 1.55fr;gap:10px;background:linear-gradient(180deg,rgba(255,255,255,.8),#fff)}.bottom-actions button{height:42px;border:0;border-radius:999px;color:#fff;background:linear-gradient(135deg,#ff7b9b,#ff5f85);font-weight:800}.sheet-mask{position:absolute;inset:0;z-index:30;display:flex;align-items:flex-end;justify-content:center;background:rgba(22,28,38,.34)}.bottom-sheet,.source-sheet{width:100%;max-height:78%;padding:16px;background:#fff;border-top-left-radius:22px;border-top-right-radius:22px;box-shadow:0 -14px 34px rgba(34,40,52,.18)}.bottom-sheet header h2,.source-sheet h2{margin:0 0 14px;font-size:18px}.bottom-sheet footer{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.bottom-sheet footer button,.source-sheet button,.add-photo{height:42px;border:0;border-radius:12px;font-weight:800}.bottom-sheet footer button:first-child{color:#667085;background:#f1f3f6}.bottom-sheet footer button:last-child,.add-photo{color:#fff;background:#ff6688}.editor-form textarea{width:100%;min-height:150px;border:1px solid #dce2ea;border-radius:10px;padding:9px;font:inherit;resize:none}.sheet-content{max-height:56vh;overflow-y:auto;display:grid;gap:12px;padding-right:2px}.source-mask{z-index:40}.source-sheet{display:grid;gap:10px}.source-sheet button{color:#374151;background:#f7f8fa;text-align:left;padding:0 14px}.media-select-page{height:100%;position:relative;background:#fff;overflow:hidden}.media-owner{padding:4px 16px 12px;color:#6b7280;font-size:14px}.media-owner strong{color:#2d3340;font-weight:800}.media-category{height:574px;padding:0 16px 86px;overflow-y:auto;overflow-x:hidden}.media-category::-webkit-scrollbar{width:4px}.media-category::-webkit-scrollbar-track{background:transparent}.media-category::-webkit-scrollbar-thumb{border-radius:999px;background:rgba(255,111,145,.28)}.media-category h2{margin:0 0 10px;font-size:16px}.media-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.media-item{position:relative;padding:0;border:0;border-radius:14px;overflow:hidden;background:#f5f6f8;text-align:left}.media-thumb{position:relative;display:block}.media-thumb img{width:100%;aspect-ratio:1;display:block;object-fit:cover}.media-thumb::after{content:"";position:absolute;inset:0;background:transparent;transition:.16s}.media-item i{position:absolute;top:8px;right:8px;z-index:1;width:22px;height:22px;display:none;place-items:center;color:#fff;font-size:13px;font-style:normal;border-radius:50%;background:linear-gradient(135deg,#ff8aa2,#ff5d83);box-shadow:0 3px 8px rgba(255,95,133,.3)}.media-item small{display:block;padding:7px 8px 8px;color:#8a94a3;font-size:11px;line-height:1.2}.media-item.selected{box-shadow:0 0 0 2px #ff6688 inset}.media-item.selected .media-thumb::after{background:rgba(0,0,0,.18)}.media-item.selected i{display:grid}.media-actions{position:absolute;left:0;right:0;bottom:0;padding:12px 16px 18px;display:grid;grid-template-columns:1fr 72px 92px;gap:8px;align-items:center;background:linear-gradient(180deg,rgba(255,255,255,.88),#fff)}.media-actions strong{color:#4b5565;font-size:13px}.media-actions button{height:40px;border:0;border-radius:999px;font-weight:800}.media-actions button:nth-child(2){color:#667085;background:#f1f3f6}.media-actions button:nth-child(3){color:#fff;background:linear-gradient(135deg,#ff7b9b,#ff5f85)}.media-actions button:disabled{color:#a8b0bd;background:#eef1f5;box-shadow:none;cursor:not-allowed}.sheet-count{color:#6b7280;font-size:13px}.edit-photo-item{position:relative}.edit-photo-item img{width:100%;aspect-ratio:1;border-radius:12px;object-fit:cover;background:#f4f5f7}.edit-photo-item button{position:absolute;top:5px;right:5px;width:22px;height:22px;padding:0;border:0;border-radius:50%;color:#fff;background:rgba(35,42,55,.72);font-size:16px;line-height:22px}@media(max-width:420px){.crm-shell{padding:0}.phone-frame{width:100%;height:100vh;border-radius:0}.detail-scroll{height:calc(100vh - 232px)}}
</style>













