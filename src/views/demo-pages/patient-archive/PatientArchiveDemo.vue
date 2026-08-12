<script setup>
import { computed, reactive, ref } from 'vue'
import CompactSearchBar from '../../../components/demo-common/CompactSearchBar.vue'
import LegacyPagination from '../../../components/demo-common/LegacyPagination.vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'
import LegacyToolbar from '../../../components/demo-common/LegacyToolbar.vue'

const today = new Date('2026-08-12')
const columns = [
  { key: 'index', label: '序号', width: 54, fixed: true },
  { key: 'name', label: '姓名', width: 90, fixed: true },
  { key: 'certNo', label: '证件号', width: 200 },
  { key: 'gender', label: '性别', width: 60 },
  { key: 'birthDate', label: '出生日期', width: 112 },
  { key: 'age', label: '年龄', width: 60 },
  { key: 'phone', label: '联系电话', width: 130 },
  { key: 'archiveMethod', label: '建档方式', width: 100 },
  { key: 'archiveTime', label: '建档时间', width: 166 },
  { key: 'actions', label: '操作', width: 150, type: 'actions' },
]

const toolbarActions = [
  { key: 'add', label: '新增', icon: '+' },
  { key: 'wechat', label: '微信建档', icon: '□' },
]

const emptyQuery = () => ({ name: '', certNo: '', phone: '', archiveMethod: '', startTime: '', endTime: '' })
const query = reactive(emptyQuery())
const appliedQuery = ref(emptyQuery())
const page = ref(1)
const pageSize = ref(20)

const options = { archiveMethods: ['院内建档', '微信建档', '批量导入'] }
const sourceRows = [
  ['沈一鸣', '男', '2020-07-01', '370323********2638', '138****5678', '院内建档', '2026-07-23 14:12:55', 1],
  ['陆芷萱', '女', '2022-02-02', '370323********1286', '139****4321', '微信建档', '2026-07-24 09:18:21', 0],
  ['袁嘉禾', '女', '2013-01-01', '370323********3952', '186****5678', '批量导入', '2026-07-25 10:31:08', 1],
  ['邵雨晴', '女', '2016-04-19', '370323********7741', '137****1234', '院内建档', '2026-07-26 15:22:39', 0],
  ['傅子航', '男', '2020-01-01', '370323********9026', '135****7821', '微信建档', '2026-07-27 08:45:17', 0],
  ['程远舟', '男', '2018-11-12', '370323********4816', '188****6193', '院内建档', '2026-07-28 11:09:42', 1],
  ['曹若宁', '女', '2017-05-30', '370323********6508', '136****2839', '院内建档', '2026-07-29 16:37:26', 0],
  ['蒋沐辰', '男', '2015-09-16', '370323********1847', '159****7426', '批量导入', '2026-07-30 13:20:13', 1],
  ['叶知微', '女', '2019-03-08', '370323********5390', '187****9152', '院内建档', '2026-08-01 09:05:49', 0],
  ['梁景行', '男', '2014-12-22', '370323********7204', '138****9045', '院内建档', '2026-08-02 10:44:31', 1],
  ['钟语桐', '女', '2021-06-18', '370323********3169', '150****6382', '微信建档', '2026-08-03 14:26:50', 0],
  ['韩亦宸', '男', '2016-10-05', '370323********8257', '152****4701', '院内建档', '2026-08-04 15:10:06', 0],
  ['汪可然', '女', '2018-01-27', '370323********2475', '178****0529', '批量导入', '2026-08-05 08:32:44', 1],
  ['熊俊逸', '男', '2017-08-09', '370323********6913', '185****3684', '院内建档', '2026-08-06 11:58:19', 0],
  ['潘安琪', '女', '2019-12-14', '370323********4582', '136****8207', '院内建档', '2026-08-07 13:46:33', 0],
  ['任泽霖', '男', '2013-04-03', '370323********0376', '139****6815', '批量导入', '2026-08-08 09:27:11', 1],
  ['薛思涵', '女', '2020-09-21', '370323********5941', '186****2395', '微信建档', '2026-08-09 16:02:28', 0],
  ['丁嘉佑', '男', '2015-02-17', '370323********7420', '137****5086', '院内建档', '2026-08-10 10:19:36', 0],
  ['戴清妍', '女', '2021-11-06', '370323********8614', '158****3160', '院内建档', '2026-08-11 08:51:24', 0],
  ['罗景辰', '男', '2014-07-28', '370323********2053', '177****4926', '批量导入', '2026-08-12 12:08:40', 1],
]

function calcAge(birthDate) {
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1
  return age
}

const rows = ref(sourceRows.map((item, index) => ({
  id: `patient-${index + 1}`,
  index: index + 1,
  name: item[0],
  gender: item[1],
  birthDate: item[2],
  age: calcAge(item[2]),
  certNo: item[3],
  phone: item[4],
  archiveMethod: item[5],
  archiveTime: item[6],
  examCount: item[7],
  certType: '居民身份证',
  remark: '',
})))

const filteredRows = computed(() => rows.value.filter((row) => {
  const q = appliedQuery.value
  const archiveDate = row.archiveTime.slice(0, 10)
  return (!q.name || row.name.includes(q.name))
    && (!q.certNo || row.certNo.includes(q.certNo))
    && (!q.phone || row.phone.includes(q.phone))
    && (!q.archiveMethod || row.archiveMethod === q.archiveMethod)
    && (!q.startTime || archiveDate >= q.startTime)
    && (!q.endTime || archiveDate <= q.endTime)
}))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))
const pagedRows = computed(() => filteredRows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const startRecord = computed(() => filteredRows.value.length ? (page.value - 1) * pageSize.value + 1 : 0)
const endRecord = computed(() => Math.min(page.value * pageSize.value, filteredRows.value.length))

const patientDialogVisible = ref(false)
const patientDialogMode = ref('add')
const examDialogVisible = ref(false)
const wechatDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const activePatient = ref(null)
const patientForm = reactive({ name: '', certType: '居民身份证', certNo: '', gender: '男', birthDate: '', phone: '', archiveMethod: '院内建档', remark: '' })
const examForm = reactive({ batch: '2026—2027学年第四次体检', examDate: '2026-08-12', examType: '院内筛查' })

const formAge = computed(() => patientForm.birthDate ? calcAge(patientForm.birthDate) : '')

function search() {
  appliedQuery.value = { ...query }
  page.value = 1
}

function reset() {
  Object.assign(query, emptyQuery())
  search()
}

function openPatientDialog(row) {
  patientDialogMode.value = row ? 'edit' : 'add'
  activePatient.value = row || null
  Object.assign(patientForm, row ? row : { name: '', certType: '居民身份证', certNo: '', gender: '男', birthDate: '', phone: '', archiveMethod: '院内建档', remark: '' })
  patientDialogVisible.value = true
}

function savePatient() {
  const payload = { ...patientForm, age: calcAge(patientForm.birthDate), archiveTime: activePatient.value?.archiveTime || '2026-08-12 14:30:00', examCount: activePatient.value?.examCount || 0 }
  if (patientDialogMode.value === 'edit' && activePatient.value) Object.assign(activePatient.value, payload)
  else rows.value.unshift({ id: `patient-${Date.now()}`, index: 1, ...payload })
  rows.value.forEach((row, index) => { row.index = index + 1 })
  patientDialogVisible.value = false
}

function openExamDialog(row) {
  activePatient.value = row
  examDialogVisible.value = true
}

function saveExam() {
  if (activePatient.value) activePatient.value.examCount += 1
  examDialogVisible.value = false
}

function openDeleteDialog(row) {
  activePatient.value = row
  deleteDialogVisible.value = true
}

function confirmDelete() {
  if (activePatient.value?.examCount > 0) return
  rows.value = rows.value.filter((row) => row.id !== activePatient.value.id)
  rows.value.forEach((row, index) => { row.index = index + 1 })
  deleteDialogVisible.value = false
}
</script>

<template>
  <div class="patient-demo">
    <div class="breadcrumb">单页面演示 &gt; 患者建档</div>
    <CompactSearchBar type="patient" :model="query" :options="options" @search="search" @reset="reset" />
    <LegacyToolbar :actions="toolbarActions" @action="(key) => key === 'add' ? openPatientDialog() : (wechatDialogVisible = true)" />
    <LegacyTable :rows="pagedRows" :columns="columns">
      <template #archiveMethod="{ value }"><span class="method-tag">{{ value }}</span></template>
      <template #actions="{ row }">
        <button class="link-action" type="button" @click="openExamDialog(row)">新增体检</button>
        <button class="link-action" type="button" @click="openPatientDialog(row)">编辑</button>
        <button class="link-action danger" type="button" @click="openDeleteDialog(row)">删除</button>
      </template>
    </LegacyTable>
    <LegacyPagination
      :page-size="pageSize"
      :page="page"
      :total-pages="totalPages"
      :total="filteredRows.length"
      :start="startRecord"
      :end="endRecord"
      @update:page-size="(value) => { pageSize = value; page = 1 }"
      @first="page = 1"
      @prev="page = Math.max(1, page - 1)"
      @next="page = Math.min(totalPages, page + 1)"
      @last="page = totalPages"
      @refresh="search"
    />

    <div v-if="patientDialogVisible" class="modal-mask">
      <section class="legacy-modal patient-modal">
        <header>{{ patientDialogMode === 'add' ? '新增患者' : '编辑患者' }}</header>
        <div class="form-grid">
          <label><span class="required">姓名</span><input v-model="patientForm.name" /></label>
          <label><span class="required">证件类型</span><select v-model="patientForm.certType"><option>居民身份证</option></select></label>
          <label><span class="required">证件号码</span><input v-model="patientForm.certNo" /></label>
          <label><span class="required">性别</span><div class="radio-line"><label><input v-model="patientForm.gender" type="radio" value="男" />男</label><label><input v-model="patientForm.gender" type="radio" value="女" />女</label></div></label>
          <label><span class="required">出生日期</span><input v-model="patientForm.birthDate" type="date" /></label>
          <label><span>年龄</span><input :value="formAge" readonly /></label>
          <label><span>联系电话</span><input v-model="patientForm.phone" /></label>
          <label><span>建档方式</span><select v-model="patientForm.archiveMethod"><option v-for="item in options.archiveMethods" :key="item">{{ item }}</option></select></label>
          <label class="full"><span>备注</span><textarea v-model="patientForm.remark" /></label>
        </div>
        <footer><button class="modal-primary" type="button" @click="savePatient">保存</button><button type="button" @click="patientDialogVisible = false">关闭</button></footer>
      </section>
    </div>

    <div v-if="examDialogVisible" class="modal-mask">
      <section class="legacy-modal exam-modal">
        <header>新增体检</header>
        <div class="patient-info">
          <span>姓名：{{ activePatient.name }}</span><span>性别：{{ activePatient.gender }}</span><span>年龄：{{ activePatient.age }}岁</span><span>证件号：{{ activePatient.certNo }}</span><span>联系电话：{{ activePatient.phone }}</span>
        </div>
        <div class="form-grid simple">
          <label><span>体检批次</span><select v-model="examForm.batch"><option>2026—2027学年第四次体检</option><option>2026—2027学年第三次体检</option></select></label>
          <label><span>体检日期</span><input v-model="examForm.examDate" type="date" /></label>
          <label><span>体检类型</span><select v-model="examForm.examType"><option>院内筛查</option><option>复查</option><option>专项检查</option></select></label>
        </div>
        <footer><button class="modal-primary" type="button" @click="saveExam">保存</button><button type="button" @click="examDialogVisible = false">关闭</button></footer>
      </section>
    </div>

    <div v-if="wechatDialogVisible" class="modal-mask">
      <section class="legacy-modal wechat-modal">
        <header>微信建档</header>
        <p>请使用微信扫描二维码完成患者信息登记。</p>
        <div class="qr-code"></div>
        <p>有效时间：30分钟</p>
        <footer><button type="button">刷新二维码</button><button type="button" @click="wechatDialogVisible = false">关闭</button></footer>
      </section>
    </div>

    <div v-if="deleteDialogVisible" class="modal-mask">
      <section class="legacy-modal delete-modal">
        <header>删除确认</header>
        <p>确定删除患者“{{ activePatient.name }}”的档案信息吗？</p>
        <p v-if="activePatient.examCount > 0" class="delete-tip">该患者已存在体检记录，不允许删除。</p>
        <footer><button class="modal-danger" :disabled="activePatient.examCount > 0" type="button" @click="confirmDelete">确定</button><button type="button" @click="deleteDialogVisible = false">取消</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.patient-demo{height:100%;min-width:0;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;border-bottom:0;background:#fff;color:#333;font-size:13px}.method-tag{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #c8d2dc;border-radius:2px;background:#eef3f8;color:#455a6e;font-size:12px}.link-action{margin-right:10px;padding:0;border:0;background:transparent;color:#2d6fba;font-size:12px;cursor:pointer}.link-action.danger{color:#b3261e}.modal-mask{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(0,0,0,.25)}.legacy-modal{border:1px solid #9facba;background:#fff;color:#333;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.16)}.legacy-modal header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.patient-modal{width:520px}.exam-modal{width:520px}.wechat-modal{width:360px;text-align:center}.delete-modal{width:360px}.form-grid{padding:14px 18px;display:grid;grid-template-columns:1fr;gap:9px}.form-grid label{display:grid;grid-template-columns:88px minmax(0,1fr);align-items:center;gap:8px}.form-grid span{text-align:right}.required::before{content:"*";color:#c62828;margin-right:2px}.form-grid input,.form-grid select,.form-grid textarea{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font:12px "Microsoft YaHei",Arial,sans-serif}.form-grid textarea{height:56px;padding-top:5px;resize:none}.radio-line{display:flex;gap:20px}.radio-line label{display:flex;grid-template-columns:none;gap:4px}.radio-line input{width:14px;height:14px}.full{align-items:start}.patient-info{margin:12px 18px 0;padding:8px 10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;border:1px solid #d8d8d8;background:#f7f9fb}.simple{padding-top:10px}.legacy-modal p{margin:14px 18px;color:#333;line-height:1.7}.delete-tip{padding:7px 9px;border:1px solid #f0c7c3;background:#fff7f6;color:#b3261e}.qr-code{width:128px;height:128px;margin:10px auto;border:1px solid #cfd6df;background:linear-gradient(90deg,#263445 8px,transparent 8px) 0 0/18px 18px,linear-gradient(#263445 8px,transparent 8px) 0 0/18px 18px,#fff}.legacy-modal footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #d8d8d8;background:#f7f9fb}.legacy-modal button{height:27px;padding:0 12px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.legacy-modal button:disabled{color:#999;background:#eee;cursor:not-allowed}.legacy-modal .modal-primary{border-color:#9fb7cf;background:#dceafa;color:#244b70}.legacy-modal .modal-danger{border-color:#d7a19d;color:#a91e18;background:#fff}
</style>
