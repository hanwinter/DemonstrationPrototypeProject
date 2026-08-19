<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const currentMother = reactive({ name: '王某某', age: '31岁', gestationalWeek: '35+2周', idCard: '110101199503081234', medicalNo: 'M20260805001', phone: '13800000000', highRiskDiagnosis: '妊娠期高血压疾病；血压控制欠稳定' })
const activeTab = ref('basic')
const mode = ref('list')
const selectedId = ref(null)
const activeDocumentType = ref('critical_referral')
const documents = ref([])
const formModel = reactive(createEmptyReferral())
const readOnly = computed(() => mode.value === 'view')
const drawerVisible = computed({ get: () => mode.value !== 'list', set: (value) => { if (!value) mode.value = 'list' } })
const currentDocumentType = computed(() => documentTypeOf(activeDocumentType.value))
const isReferralDocument = computed(() => activeDocumentType.value === 'critical_referral')
const isSyphilisDocument = computed(() => activeDocumentType.value === 'syphilis_pregnancy')
const isHepatitisBDocument = computed(() => activeDocumentType.value === 'hepatitis_b_pregnancy')
const currentMotherDisplay = computed(() => `${currentMother.name}，${currentMother.age}，${currentMother.gestationalWeek}，病历号 ${currentMother.medicalNo}`)

const documentTypes = [
  { type: 'critical_referral', label: '危重孕产妇转会诊申请单', prefix: 'ZZ' },
  { type: 'syphilis_pregnancy', label: '梅毒感染/既往感染孕产妇', prefix: 'MD' },
  { type: 'hepatitis_b_pregnancy', label: '乙肝感染孕产妇', prefix: 'YG' },
]
documents.value = createMockDocuments()

const hospitalOptions = ['XX妇幼保健院', '北京市危重孕产妇救治中心', '朝阳区妇幼保健院', '通州区妇幼保健院', '北京大学人民医院', '首都医科大学附属北京妇产医院']
const regionOptions = [
  { value: '北京市', label: '北京市', children: [{ value: '北京市', label: '北京市', children: [{ value: '朝阳区', label: '朝阳区', children: [{ value: '妇幼街道', label: '妇幼街道' }, { value: '建国门街道', label: '建国门街道' }] }, { value: '通州区', label: '通州区', children: [{ value: '新华街道', label: '新华街道' }] }, { value: '密云区', label: '密云区', children: [{ value: '鼓楼街道', label: '鼓楼街道' }] }] }] },
]
const rescueOutputFields = [
  { label: '总出血量', key: 'total', unit: 'ml' },
  { label: '阴道出血量', key: 'vaginalBleeding', unit: 'ml' },
  { label: '尿量', key: 'urine', unit: 'ml' },
  { label: '盆腔引流量', key: 'pelvicDrainage', unit: 'ml' },
  { label: '其他', key: 'other' },
]
const vitalFields = [
  { label: '意识', key: 'consciousness' },
  { label: 'RR', key: 'rr' },
  { label: 'HR', key: 'hr' },
  { label: 'SpO2', key: 'spo2' },
  { label: 'BP', key: 'bp' },
  { label: '休克指数', key: 'shockIndex' },
  { label: '体温', key: 'temperature' },
]
const bloodGasFields = [
  { label: 'PH', key: 'ph' },
  { label: 'PO2', key: 'po2' },
  { label: 'PCO2', key: 'pco2' },
  { label: 'HCO3', key: 'hco3' },
  { label: '乳酸', key: 'lactate' },
  { label: 'BE', key: 'be' },
]
const pregnancyComplications = ['意识障碍', '抽搐', '高热', '高血压危象', '心律失常', '呼吸困难', '低血氧', '其他']
const drugTreatments = ['地塞米松', '硫酸镁', '口服降压药', '静脉降压药', '抗生素', '宫缩抑制剂', '血管活性药物', '其他']
const operationTreatments = ['宫腔球囊', '会阴III-IV度裂伤缝合', '阴道壁血肿切开缝合', '子宫BLynch缝合', '子宫动脉上/下行支结扎', '宫腔填纱', '子宫切除', '其他']
const prepOptions = ['交通工具', '监测设备', '护送人员', '吸氧设备', '抢救药物', '抢救设备']
const oxygenPrepOptions = ['成人复苏球囊', '氧源']
const medicinePrepOptions = ['促宫缩剂', '硫酸镁', '降压药', '镇静药']
const equipmentPrepOptions = ['除颤仪', '呼吸机', '气管插管', '开口器']

function createEmptyReferral() {
  return {
    applicationNo: '', medicalNo: currentMother.medicalNo, motherName: currentMother.name, age: currentMother.age, gestationalWeek: currentMother.gestationalWeek, husbandName: '', province: '', city: '', district: '', street: '', accountRegion: [], addressRegion: [], detailAddress: '', address: '', mobile: currentMother.phone, homePhone: '', diagnosis: '', toHospital: '', fromHospital: '', applyDoctor: '', applyTime: '', status: '未完成',
    critical: { patientName: currentMother.name, age: currentMother.age, applyHospital: '', referralHospital: '', dateTime: '', reasonDiagnosis: '', rescueStart: '', rescueDuration: '', input: { crystal: '', colloid: '', bloodProduct: '' }, output: { total: '', vaginalBleeding: '', urine: '', pelvicDrainage: '', other: '' }, intubation: '否', vital: { consciousness: '清醒', rr: '', hr: '', spo2: '', bp: '', shockIndex: '', temperature: '', other: '' }, bloodGas: { ph: '', po2: '', pco2: '', hco3: '', lactate: '', be: '' }, lab: { myocardialEnzyme: '', liverKidney: '', other: '' }, pregnancyComplications: [], patientComplaint: '', vitalSignAbnormal: '否', complicationOther: '', specialChecks: [], specialCheckResult: '', treatmentDetails: { dexamethasoneCount: '', dexamethasoneLastTime: '', magnesiumDays: '', magnesiumTodayDose: '', oralAntihypertensive: '', intravenousAntihypertensive: '', antibiotic: '', tocolytic: '', vasoactive: '', other: '' }, delivery: { fetalDeliveryTime: '', deliveryMethod: '自然分娩', fetalWeight: '', apgar: '', placentaDeliveryTime: '', placentaDelivered: '是', placentaNotDeliveredReason: '', placentaComplete: '是', placentaDeliveryMethod: '自然', placentaCordAbnormal: '', laborProcess: '', surgeryProcess: '', operationDetails: { balloonTime: '', balloonWater: '', other: '' }, handoverItems: [], handoverDetails: { gauze: '', drainage: '', sutureTime: '', catheter: '', other: '' } }, drugTreatments: [], operationTreatments: [] },
    assessment: { beforeReason: '病情', beforeReasonOther: '', decisionMaker: '值班三线', decisionMakerOther: '', preparation: ['交通工具', '监测设备', '护送人员', '吸氧设备', '抢救药物'], escortStaffNote: '', oxygenPreparation: [], medicinePreparation: [], equipmentPreparation: [], beforeChecks: [], before: { distance: '', vitalSigns: '', consciousness: '', peripheralVein: '', contactPhone: '', receptionLocation: '' }, duringTransport: '急救车', duringChecks: [], during: { consciousness: '', vitalSigns: '', bleeding: '', special: '', input: '', output: '', rescueProcess: '' }, after: { smooth: '是', trafficSmooth: '是', vehicleAvailable: '是', hospitalContactEasy: '是', locationClear: '是', staffCommunicationEasy: '是', specialProblem: '' }, specialRescueRecord: '', perinatalSpecial: '', referralTime: '', leaveTime: '', arriveTime: '', escortStaff: '', contact: '', medicalOffice: '', ward: '', attendingDoctor: '' },
  }
}
function createDemoReferral() {
  const data = createEmptyReferral()
  Object.assign(data, { applicationNo: 'ZZ20260805001', husbandName: '李某某', province: '北京市', city: '北京市', district: '朝阳区', street: '妇幼街道', accountRegion: ['北京市', '北京市', '朝阳区', '妇幼街道'], addressRegion: ['北京市', '北京市', '朝阳区', '妇幼街道'], detailAddress: '示范路 18 号', address: '北京市朝阳区示范路 18 号', mobile: currentMother.phone, homePhone: '010-88886666', diagnosis: '妊娠期高血压疾病', toHospital: '北京市危重孕产妇救治中心', fromHospital: 'XX妇幼保健院', applyDoctor: '张医生', applyTime: '2026-08-05 09:20', status: '待打印' })
  Object.assign(data.critical, { applyHospital: data.fromHospital, referralHospital: data.toHospital, dateTime: data.applyTime, reasonDiagnosis: data.diagnosis, rescueStart: '2026-08-05 08:40', rescueDuration: '40分钟', intubation: '否', pregnancyComplications: ['高血压危象'], specialCheckResult: '心彩超及腹部超声结果待补充。', drugTreatments: ['硫酸镁', '静脉降压药'], operationTreatments: [] })
  Object.assign(data.critical.input, { crystal: '晶体液 500ml，胶体液 0ml，血制品 0ml', colloid: '', bloodProduct: '' })
  Object.assign(data.critical.output, { total: '300ml', vaginalBleeding: '50ml', urine: '250ml' })
  Object.assign(data.critical.vital, { consciousness: '清醒', rr: '20次/分', hr: '96次/分', spo2: '98%', bp: '158/102mmHg', shockIndex: '0.8', temperature: '36.8℃' })
  Object.assign(data.critical.bloodGas, { ph: '7.39', po2: '92mmHg', pco2: '36mmHg', hco3: '22mmol/L', lactate: '1.6mmol/L', be: '-2' })
  Object.assign(data.critical.lab, { myocardialEnzyme: '未见明显异常', liverKidney: '肝肾功能待复查', other: '尿蛋白阳性' })
  Object.assign(data.assessment.before, { distance: '12公里', vitalSigns: '血压偏高，氧饱和度稳定', consciousness: '清醒', peripheralVein: '已建立静脉通道', contactPhone: '010-66668888', receptionLocation: '急诊产科抢救室' })
  Object.assign(data.assessment.during, { consciousness: '清醒', vitalSigns: '途中生命体征平稳', bleeding: '少量', special: '持续心电监护', input: '晶体液 300ml', output: '尿量 100ml', rescueProcess: '途中继续降压、吸氧及胎心监护。' })
  Object.assign(data.assessment, { referralTime: '2026-08-05 09:20', leaveTime: '2026-08-05 09:35', arriveTime: '2026-08-05 10:05', escortStaff: '刘医生、赵护士', contact: '13900001111', medicalOffice: '医务处王老师', ward: '产科二病区', attendingDoctor: '张医生' })
  return data
}
function clone(data) { return JSON.parse(JSON.stringify(data)) }
function createEmptySimpleForm(type) {
  return {
    documentNo: createDocumentNo(type),
    motherName: currentMother.name,
    medicalNo: currentMother.medicalNo,
    age: currentMother.age,
    gestationalWeek: currentMother.gestationalWeek,
    doctor: '张医生',
    fillTime: formatDateTime(),
    summary: type === 'syphilis_pregnancy' ? '既往梅毒感染史，孕期复查需随访滴度变化。' : '乙肝表面抗原阳性，需按孕期感染管理流程随访。',
    advice: type === 'syphilis_pregnancy' ? '完善感染指标复查，必要时转感染科会诊。' : '完善肝功能及病毒载量复查，提醒新生儿免疫阻断。',
    status: '未完成',
    printedAt: '',
  }
}
function createEmptySyphilisForm() {
  return {
    documentNo: createDocumentNo('syphilis_pregnancy'),
    motherName: currentMother.name,
    medicalNo: currentMother.medicalNo,
    age: currentMother.age,
    gestationalWeek: currentMother.gestationalWeek,
    doctor: '张医生',
    fillTime: formatDateTime(),
    summary: '既往梅毒感染史，孕期复查需随访滴度变化。',
    advice: '完善感染指标复查，必要时转感染科会诊。',
    status: '未完成',
    printedAt: '',
    syphilis: {
      basic: { name: currentMother.name, medicalNo: currentMother.medicalNo, lastMenstrualPeriod: '', expectedDeliveryDate: '', phone: currentMother.phone, doctor: '张医生' },
      firstTest: { gestationalWeek: '12+3周', date: '2026-08-05', tppa: '+', rprTrustTiter: '1:8' },
      referral: { destination: '未转诊', destinationOther: '', gestationalWeek: '', date: '', usedReferralForm: '否', usedConsentForm: '否', communicatedWithExternalHospital: false, receivedReferralReceipt: false },
      firstTreatment: { institution: '本院', institutionOther: '', referralTreatmentFormFilled: '否', medicine: '苄星青霉素', medicineOther: '', startGestationalWeek: '', startDate: '', recordSources: [] },
      pregnancyMonitoring: createSyphilisMonitoringRows(),
      newbornFollowup: { informedPediatrics: '否', informer: '', preventiveTreatment: '苄星青霉素预防性治疗', preventiveTreatmentReason: '', newbornRprTrustTiter: '', dischargeGuidanceIssued: '否' },
    },
  }
}
function createEmptyHepatitisBForm() {
  return {
    documentNo: createDocumentNo('hepatitis_b_pregnancy'),
    motherName: currentMother.name,
    medicalNo: currentMother.medicalNo,
    age: currentMother.age,
    gestationalWeek: currentMother.gestationalWeek,
    doctor: '张医生',
    fillTime: formatDateTime(),
    summary: '乙肝表面抗原阳性，需按孕期感染管理流程随访。',
    advice: '完善肝功能及病毒载量复查，提醒新生儿免疫阻断。',
    status: '未完成',
    printedAt: '',
    hepatitisB: {
      basic: { name: currentMother.name, medicalNo: currentMother.medicalNo, lastMenstrualPeriod: '', expectedDeliveryDate: '', phone: currentMother.phone, doctor: '张医生' },
      firstFiveItems: { hbsag: '+', antiHbs: '-', hbeag: '-', antiHbe: '+', antiHbc: '+', gestationalWeek: currentMother.gestationalWeek, date: '2026-08-05', dataSource: '检验报告' },
      hbvDnaReviews: createHbvDnaReviewRows(),
      liverFunctionReviews: createLiverFunctionReviewRows(),
      antiviralTreatment: { treated: '否', startGestationalWeek: '', startDate: '', medicine: '', remark: '', treatmentRecords: createAntiviralTreatmentRows() },
      referral: { gestationalWeek: '', date: '', usedReferralForm: '否', usedConsentForm: '否', followedExternalArchive: false, communicatedWithExternalHospital: false, receivedReferralReceipt: false },
      newbornFollowup: { immunoglobulinAndVaccine: '', dischargeGuidanceIssued: '否', highExposureFollowupRequired: '否' },
    },
  }
}
function createHbvDnaReviewRows() {
  return Array.from({ length: 3 }, () => ({ date: '', gestationalWeek: '', result: '', remark: '' }))
}
function createLiverFunctionReviewRows() {
  return Array.from({ length: 3 }, () => ({ date: '', gestationalWeek: '', result: '' }))
}
function createAntiviralTreatmentRows() {
  return Array.from({ length: 3 }, () => ({ content: '' }))
}
function createSyphilisMonitoringRows() {
  return Array.from({ length: 4 }, () => ({ gestationalWeek: '', date: '', rprTrustTiter: '' }))
}
function addHbvDnaReviewRow() { formModel.hepatitisB.hbvDnaReviews.push({ date: '', gestationalWeek: '', result: '', remark: '' }) }
function addLiverFunctionReviewRow() { formModel.hepatitisB.liverFunctionReviews.push({ date: '', gestationalWeek: '', result: '' }) }
function addAntiviralTreatmentRow() { formModel.hepatitisB.antiviralTreatment.treatmentRecords.push({ content: '' }) }
function removeHbvDnaReviewRow(index) { if (formModel.hepatitisB.hbvDnaReviews.length > 1) formModel.hepatitisB.hbvDnaReviews.splice(index, 1) }
function removeLiverFunctionReviewRow(index) { if (formModel.hepatitisB.liverFunctionReviews.length > 1) formModel.hepatitisB.liverFunctionReviews.splice(index, 1) }
function removeAntiviralTreatmentRow(index) { if (formModel.hepatitisB.antiviralTreatment.treatmentRecords.length > 1) formModel.hepatitisB.antiviralTreatment.treatmentRecords.splice(index, 1) }
function addSyphilisMonitoringRow() { formModel.syphilis.pregnancyMonitoring.push({ gestationalWeek: '', date: '', rprTrustTiter: '' }) }
function removeSyphilisMonitoringRow(index) { if (formModel.syphilis.pregnancyMonitoring.length > 1) formModel.syphilis.pregnancyMonitoring.splice(index, 1) }
function createMockDocuments() {
  const referral = createDemoReferral()
  const syphilis = createEmptySyphilisForm()
  Object.assign(syphilis, { documentNo: 'MD20260805001', fillTime: '2026-08-05 10:10', status: '未完成' })
  const hepatitis = createEmptyHepatitisBForm()
  Object.assign(hepatitis, { documentNo: 'YG20260805001', fillTime: '2026-08-04 15:30', status: '已打印', printedAt: '2026-08-04 16:00' })
  return [
    createDocumentFromData(1, 'critical_referral', referral, '2026-08-05 09:20'),
    createDocumentFromData(2, 'syphilis_pregnancy', syphilis, syphilis.fillTime),
    createDocumentFromData(3, 'hepatitis_b_pregnancy', hepatitis, hepatitis.fillTime),
  ]
}
function documentTypeOf(type) { return documentTypes.find((item) => item.type === type) || documentTypes[0] }
function documentLabel(type) { return documentTypeOf(type).label }
function createDocumentNo(type) { return `${documentTypeOf(type).prefix}${Date.now().toString().slice(-10)}` }
function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
function createFormData(type) {
  if (type === 'hepatitis_b_pregnancy') return createEmptyHepatitisBForm()
  if (type === 'syphilis_pregnancy') return createEmptySyphilisForm()
  if (type !== 'critical_referral') return createEmptySimpleForm(type)
  return Object.assign(createEmptyReferral(), { applicationNo: createDocumentNo(type), applyTime: formatDateTime(), fromHospital: 'XX妇幼保健院', toHospital: '北京市危重孕产妇救治中心', diagnosis: currentMother.highRiskDiagnosis })
}
function createDocumentFromData(id, type, data, updatedAt = formatDateTime()) {
  const formData = clone(data)
  const documentNo = type === 'critical_referral' ? formData.applicationNo : formData.documentNo
  const diagnosisOrSummary = type === 'critical_referral' ? formData.diagnosis : formData.summary
  return { id, type, documentNo, diagnosisOrSummary, status: formData.status, updatedAt, printedAt: formData.printedAt || '', formData }
}
function openDocument(row, nextMode) {
  selectedId.value = row.id
  activeDocumentType.value = row.type
  Object.assign(formModel, clone(row.formData))
  mode.value = nextMode
  activeTab.value = row.type === 'critical_referral' ? 'basic' : row.type === 'hepatitis_b_pregnancy' ? 'hepatitisB' : row.type === 'syphilis_pregnancy' ? 'syphilis' : 'simple'
}
function showDetail(row) { openDocument(row, 'view') }
function editForm(row) { openDocument(row, 'edit') }
function continueForm(row) { openDocument(row, 'edit') }
function createForm(type = 'critical_referral') {
  selectedId.value = null
  activeDocumentType.value = type
  Object.assign(formModel, createFormData(type))
  mode.value = 'create'
  activeTab.value = type === 'critical_referral' ? 'basic' : type === 'hepatitis_b_pregnancy' ? 'hepatitisB' : type === 'syphilis_pregnancy' ? 'syphilis' : 'simple'
}
function saveTemporary() { saveDocumentWithStatus('未完成', '已临时保存') }
function saveApplication() { saveDocumentWithStatus('待打印', '申请单已保存，待打印') }
function saveAndPrint() { saveDocumentWithStatus('已打印', '申请单已保存并记录打印时间', formatDateTime()) }
function saveDocumentWithStatus(status, message, printedAt) {
  formModel.status = status
  formModel.updatedAt = formatDateTime()
  if (printedAt) formModel.printedAt = printedAt
  else if (status !== '已打印') formModel.printedAt = ''
  upsertDocument()
  mode.value = 'list'
  ElMessage.success(message)
}
function upsertDocument() {
  const data = clone(formModel)
  const document = createDocumentFromData(selectedId.value || Date.now(), activeDocumentType.value, data, data.updatedAt || formatDateTime())
  const index = documents.value.findIndex((item) => item.id === selectedId.value)
  if (index >= 0) documents.value[index] = document
  else documents.value.unshift(document)
}
async function voidDocument(row) {
  await ElMessageBox.confirm(`确认作废单据编号 ${row.documentNo} 吗？作废后不会从列表移除。`, '作废确认', { type: 'warning' })
  row.status = '已作废'
  row.updatedAt = formatDateTime()
  row.formData.status = '已作废'
  row.formData.updatedAt = row.updatedAt
  ElMessage.success('单据已作废')
}
function previewDocument(row) { ElMessage.success(`已打开打印预览：${row.documentNo}`) }
function printDocument(row) {
  const printedAt = formatDateTime()
  row.status = '已打印'
  row.printedAt = printedAt
  row.updatedAt = printedAt
  row.formData.status = '已打印'
  row.formData.printedAt = printedAt
  row.formData.updatedAt = printedAt
  ElMessage.success(`已打印：${row.documentNo}`)
}
function downloadPdf(row) { ElMessage.success(`已生成PDF：${row.documentNo}`) }
function canOperate(row, action) {
  const rules = {
    未完成: ['view', 'edit', 'void'],
    待打印: ['view', 'edit', 'preview', 'print', 'download', 'void'],
    已打印: ['view', 'edit', 'preview', 'print', 'download'],
    已作废: ['view'],
  }
  return (rules[row.status] || []).includes(action)
}
function statusType(status) { return { 未完成: 'warning', 待打印: 'primary', 已打印: 'success', 已作废: 'info' }[status] || 'info' }
</script>

<template>
  <div class="referral-page">
    <header class="system-header">
      <div class="brand"><img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" /></div>
      <DemoPageNavigation />
      <div class="header-meta">孕产相关单据 ｜ 操作员：产科医师</div>
    </header>
    <main class="page-main">
      <section v-if="mode === 'list'" class="document-list-shell">
        <div class="document-breadcrumb"><el-button text :icon="ArrowLeft" @click="router.push('/')">返回</el-button><span class="heading-divider"></span><el-breadcrumb separator="/"><el-breadcrumb-item>孕产保健系统</el-breadcrumb-item><el-breadcrumb-item>相关单据</el-breadcrumb-item></el-breadcrumb></div>
        <div class="list-title">
          <div><h1>相关单据</h1></div>
          <el-dropdown trigger="click" @command="createForm">
            <el-button type="primary">+ 新建单据</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in documentTypes" :key="item.type" :command="item.type">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="mother-profile-line">
          <span>当前孕妇：</span><strong>{{ currentMother.name }}，{{ currentMother.age }}，{{ currentMother.gestationalWeek }}，病历号 {{ currentMother.medicalNo }}</strong><i>|</i><span>身份证号：{{ currentMother.idCard }}</span><i>|</i><span>联系电话：{{ currentMother.phone }}</span><i>|</i><span>高危因素/主要诊断：{{ currentMother.highRiskDiagnosis }}</span>
        </div>
        <el-table :data="documents" border class="application-table">
          <el-table-column type="index" label="序号" width="64" align="center" />
          <el-table-column label="单据类型" min-width="210" show-overflow-tooltip><template #default="{ row }">{{ documentLabel(row.type) }}</template></el-table-column>
          <el-table-column prop="documentNo" label="单据编号" width="150" />
          <el-table-column label="状态" width="96" align="center"><template #default="{ row }"><el-tag :type="statusType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column>
          <el-table-column prop="updatedAt" label="最近填写时间" width="150" />
          <el-table-column prop="printedAt" label="打印时间" width="150"><template #default="{ row }">{{ row.printedAt || '-' }}</template></el-table-column>
          <el-table-column label="操作" width="420" fixed="right">
            <template #default="{ row }">
              <div class="table-actions">
                <el-button link type="primary" :disabled="!canOperate(row, 'view')" @click="showDetail(row)">查看</el-button>
                <el-button link type="primary" :disabled="!canOperate(row, 'edit')" @click="editForm(row)">修改</el-button>
                <el-button link type="primary" :disabled="!canOperate(row, 'preview')" @click="previewDocument(row)">预览</el-button>
                <el-button link type="primary" :disabled="!canOperate(row, 'print')" @click="printDocument(row)">打印</el-button>
                <el-button link type="primary" :disabled="!canOperate(row, 'download')" @click="downloadPdf(row)">下载</el-button>
                <el-button link :type="canOperate(row, 'void') ? 'danger' : 'info'" :disabled="!canOperate(row, 'void')" @click="voidDocument(row)">作废</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-drawer v-model="drawerVisible" direction="rtl" size="92%" :with-header="false" class="referral-drawer" destroy-on-close>
        <section class="form-shell" :class="{ 'document-mode': readOnly }">
          <div class="drawer-head">
            <div class="drawer-context">孕产保健系统 / 孕产相关单据 / {{ currentDocumentType.label }}</div>
            <div class="form-title"><div><h1><span v-if="mode === 'create'" class="title-action">新建</span><strong>{{ currentDocumentType.label }}</strong></h1></div><el-tag :type="statusType(formModel.status)" effect="plain">{{ formModel.status }}</el-tag></div>
            <div class="drawer-mother-line"><span>当前孕妇：</span><strong>{{ currentMotherDisplay }}</strong><i>|</i><span>单据类型：{{ currentDocumentType.label }}</span></div>
          </div>
        <el-tabs v-if="isReferralDocument" v-model="activeTab" class="paper-tabs">
          <el-tab-pane label="转会诊申请单" name="basic">
            <div class="paper-section basic-paper"><el-form class="inline-medical-form referral-basic-form" label-position="left" :disabled="readOnly" label-width="112px"><div class="form-row identity-row"><el-form-item label="编号" class="readonly-field w-code"><el-input v-model="formModel.applicationNo" disabled /></el-form-item><el-form-item label="病历号" class="readonly-field w-medical"><el-input v-model="formModel.medicalNo" disabled /></el-form-item><el-form-item label="孕产妇姓名" class="readonly-field w-name"><el-input v-model="formModel.motherName" disabled /></el-form-item><el-form-item label="丈夫姓名" class="w-name"><el-input v-model="formModel.husbandName" /></el-form-item></div><div class="form-row full-row"><el-form-item label="户口所在地" class="region-field"><el-cascader v-model="formModel.accountRegion" :options="regionOptions" clearable /></el-form-item></div><div class="form-row full-row"><el-form-item label="现住址" class="region-field address-field"><el-cascader v-model="formModel.addressRegion" :options="regionOptions" clearable /><el-input v-model="formModel.detailAddress" placeholder="详细地址" /></el-form-item></div><div class="form-row"><el-form-item label="移动电话" class="w-phone"><el-input v-model="formModel.mobile" /></el-form-item><el-form-item label="家庭/单位电话" class="w-phone"><el-input v-model="formModel.homePhone" /></el-form-item></div><div class="form-row full-row"><el-form-item label="诊断" class="long-field"><el-input v-model="formModel.diagnosis" type="textarea" :rows="2" /></el-form-item></div><div class="form-row full-row"><el-form-item label="转往医院" class="single-wide"><el-select v-model="formModel.toHospital" filterable><el-option v-for="item in hospitalOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item></div><div class="form-row full-row"><el-form-item label="申请单位" class="single-wide"><el-input v-model="formModel.fromHospital" /></el-form-item></div><div class="form-row full-row"><el-form-item label="申请医生" class="single-narrow"><el-input v-model="formModel.applyDoctor" /></el-form-item></div><div class="form-row full-row"><el-form-item label="申请时间" class="single-time"><el-input v-model="formModel.applyTime" placeholder="YYYY-MM-DD HH:mm" /></el-form-item></div></el-form></div>
          </el-tab-pane>
          <el-tab-pane label="危重孕产妇转会诊申请单" name="critical">
            <div class="emr-section"><h2>一、患者基础信息</h2><el-form class="emr-form" :disabled="readOnly"><div class="emr-field-grid"><div class="readonly-field-line"><span>姓名：</span><strong>{{ formModel.critical.patientName }}</strong></div><div class="readonly-field-line"><span>年龄：</span><strong>{{ formModel.critical.age }}</strong></div><div class="readonly-field-line"><span>孕周：</span><strong>{{ formModel.gestationalWeek }}</strong></div><label>申请医院：<el-input v-model="formModel.critical.applyHospital" /></label><label>转入医院：<el-input v-model="formModel.critical.referralHospital" /></label><label>申请时间：<el-date-picker v-model="formModel.critical.dateTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label></div><label class="emr-textarea">转诊原因及诊断<el-input v-model="formModel.critical.reasonDiagnosis" type="textarea" :rows="4" /></label></el-form></div>
            <div class="emr-section"><h2>二、抢救过程</h2><el-form class="emr-form" :disabled="readOnly"><div class="emr-field-grid rescue-time-fields"><label>抢救开始时间：<el-date-picker v-model="formModel.critical.rescueStart" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label><label>持续时间：<el-input v-model="formModel.critical.rescueDuration" /></label></div><div class="rescue-flow"><section class="rescue-flow-group"><h3>入量：</h3><label class="rescue-flow-field rescue-input-field"><span>晶体、胶体、血制品：</span><el-input v-model="formModel.critical.input.crystal" /><em>ml</em></label></section><section class="rescue-flow-group"><h3>出量：</h3><label v-for="item in rescueOutputFields" :key="item.key" class="rescue-flow-field"><span>{{ item.label }}：</span><el-input v-model="formModel.critical.output[item.key]" /><em>ml</em></label></section></div></el-form></div>
            <div class="emr-section vital-emphasis"><h2>三、转诊生命体征情况（描述最低值）</h2><el-form class="emr-form" :disabled="readOnly"><div class="vital-consciousness"><label>意识状态：<el-input v-model="formModel.critical.vital.consciousness" /></label><div class="intubation-field"><span>是否气管插管：</span><el-radio-group v-model="formModel.critical.intubation"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div><div class="vital-metrics"><label>RR：<el-input v-model="formModel.critical.vital.rr" /></label><label>HR：<el-input v-model="formModel.critical.vital.hr" /></label><label>SpO2：<el-input v-model="formModel.critical.vital.spo2" /></label><label>BP：<el-input v-model="formModel.critical.vital.bp" /></label><label>体温：<el-input v-model="formModel.critical.vital.temperature" /></label></div><label class="emr-textarea">其他异常情况<el-input v-model="formModel.critical.vital.other" type="textarea" :rows="3" /></label></el-form></div>
            <div class="emr-section"><h2>四、血气分析</h2><el-form class="emr-form gas-form" :disabled="readOnly"><div class="gas-grid"><label v-for="item in bloodGasFields" :key="item.key">{{ item.label }}：<el-input v-model="formModel.critical.bloodGas[item.key]" /></label></div></el-form></div>
            <div class="emr-section"><h2>五、其他异常化验（心肌酶、肝肾功能等）（描述最低值）</h2><el-form class="emr-form" :disabled="readOnly"><label class="emr-textarea"><el-input v-model="formModel.critical.lab.other" type="textarea" :rows="4" /></label></el-form></div>
            <div class="emr-section"><h2>六、妊娠合并症及并发症</h2><el-form class="emr-form document-groups" :disabled="readOnly"><section class="doc-subsection"><h3>特殊情况</h3><div class="special-situation-fields"><label>患者特殊主诉：<el-input v-model="formModel.critical.patientComplaint" /></label><label>生命体征异常：<el-radio-group v-model="formModel.critical.vitalSignAbnormal"><el-radio label="否" /><el-radio label="是" /></el-radio-group></label></div><el-checkbox-group v-model="formModel.critical.pregnancyComplications" class="inline-checks"><el-checkbox v-for="item in pregnancyComplications" :key="item" :label="item" /></el-checkbox-group><label class="inline-extra">其他描述：<el-input v-model="formModel.critical.complicationOther" /></label><label class="emr-textarea">特殊异常检查（心彩超、腹部超声、MRI等）<el-input v-model="formModel.critical.specialCheckResult" type="textarea" :rows="3" /></label></section><section class="doc-subsection"><h3>特殊治疗</h3><el-checkbox-group v-model="formModel.critical.drugTreatments" class="treatment-list"><div class="treatment-item"><el-checkbox label="地塞米松" /><div v-if="formModel.critical.drugTreatments.includes('地塞米松')" class="treatment-extra"><label>共<el-input v-model="formModel.critical.treatmentDetails.dexamethasoneCount" />针</label><label>末次注射时间<el-input v-model="formModel.critical.treatmentDetails.dexamethasoneLastTime" /></label></div></div><div class="treatment-item"><el-checkbox label="硫酸镁" /><div v-if="formModel.critical.drugTreatments.includes('硫酸镁')" class="treatment-extra"><label>共<el-input v-model="formModel.critical.treatmentDetails.magnesiumDays" />天</label><label>当日已用<el-input v-model="formModel.critical.treatmentDetails.magnesiumTodayDose" />g</label></div></div><div class="treatment-item"><el-checkbox label="口服降压药" /><label v-if="formModel.critical.drugTreatments.includes('口服降压药')"><el-input v-model="formModel.critical.treatmentDetails.oralAntihypertensive" /></label></div><div class="treatment-item"><el-checkbox label="静脉降压药" /><label v-if="formModel.critical.drugTreatments.includes('静脉降压药')"><el-input v-model="formModel.critical.treatmentDetails.intravenousAntihypertensive" /></label></div><div class="treatment-item"><el-checkbox label="抗生素" /><label v-if="formModel.critical.drugTreatments.includes('抗生素')">用法用量：<el-input v-model="formModel.critical.treatmentDetails.antibiotic" /></label></div><div class="treatment-item"><el-checkbox label="宫缩抑制剂" /><label v-if="formModel.critical.drugTreatments.includes('宫缩抑制剂')"><el-input v-model="formModel.critical.treatmentDetails.tocolytic" /></label></div><div class="treatment-item"><el-checkbox label="血管活性药物" /><label v-if="formModel.critical.drugTreatments.includes('血管活性药物')"><el-input v-model="formModel.critical.treatmentDetails.vasoactive" /></label></div><div class="treatment-item"><el-checkbox label="其他" /><label v-if="formModel.critical.drugTreatments.includes('其他')"><el-input v-model="formModel.critical.treatmentDetails.other" /></label></div></el-checkbox-group></section></el-form></div>
            <div class="emr-section"><h2>七、分娩期并发症</h2><el-form class="emr-form document-groups" :disabled="readOnly"><section class="doc-subsection"><h3>特殊情况</h3><div class="delivery-line-form"><label>胎儿分娩时间：<el-date-picker v-model="formModel.critical.delivery.fetalDeliveryTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label><label>分娩方式：<el-radio-group v-model="formModel.critical.delivery.deliveryMethod"><el-radio label="自然分娩" /><el-radio label="产钳/胎吸" /><el-radio label="剖宫产" /></el-radio-group></label><label>胎儿体重：<el-input v-model="formModel.critical.delivery.fetalWeight" /></label><label>Apgar评分：<el-input v-model="formModel.critical.delivery.apgar" /></label><label>胎盘娩出时间：<el-input v-model="formModel.critical.delivery.placentaDeliveryTime" /></label><label>胎盘是否娩出：<el-radio-group v-model="formModel.critical.delivery.placentaDelivered"><el-radio label="是" /><el-radio label="否" /></el-radio-group></label><label v-if="formModel.critical.delivery.placentaDelivered === '否'">原因：<el-input v-model="formModel.critical.delivery.placentaNotDeliveredReason" /></label><label>胎盘娩出方式：<el-radio-group v-model="formModel.critical.delivery.placentaDeliveryMethod"><el-radio label="自然" /><el-radio label="手取" /></el-radio-group></label><label>胎盘/胎膜异常情况：<el-input v-model="formModel.critical.delivery.placentaCordAbnormal" /></label><label>若阴道分娩，产程情况：<el-input v-model="formModel.critical.delivery.laborProcess" /></label><label>若刨宫产，手术情况：<el-input v-model="formModel.critical.delivery.surgeryProcess" /></label></div></section><section class="doc-subsection"><h3>特殊治疗</h3><el-checkbox-group v-model="formModel.critical.operationTreatments" class="treatment-list obstetric-treatment-list"><div class="treatment-item"><el-checkbox label="宫腔球囊" /><div v-if="formModel.critical.operationTreatments.includes('宫腔球囊')" class="treatment-extra"><label>放置时间：<el-input v-model="formModel.critical.delivery.operationDetails.balloonTime" /></label><label>注水量：<el-input v-model="formModel.critical.delivery.operationDetails.balloonWater" />ml</label></div></div><div class="treatment-item"><el-checkbox label="会阴III-IV度裂伤缝合" /></div><div class="treatment-item"><el-checkbox label="阴道壁血肿切开缝合" /></div><div class="treatment-item"><el-checkbox label="子宫BLynch缝合" /></div><div class="treatment-item"><el-checkbox label="子宫动脉上/下行支结扎" /></div><div class="treatment-item"><el-checkbox label="宫腔填纱" /></div><div class="treatment-item"><el-checkbox label="子宫切除" /></div><div class="treatment-item"><el-checkbox label="其他" /><label v-if="formModel.critical.operationTreatments.includes('其他')"><el-input v-model="formModel.critical.delivery.operationDetails.other" /></label></div></el-checkbox-group><div class="handover-group"><h4>特殊交班：</h4><el-checkbox-group v-model="formModel.critical.delivery.handoverItems" class="treatment-list obstetric-treatment-list"><div class="treatment-item"><el-checkbox label="纱布" /><label v-if="formModel.critical.delivery.handoverItems.includes('纱布')"><el-input v-model="formModel.critical.delivery.handoverDetails.gauze" /></label></div><div class="treatment-item"><el-checkbox label="引流" /><label v-if="formModel.critical.delivery.handoverItems.includes('引流')"><el-input v-model="formModel.critical.delivery.handoverDetails.drainage" /></label></div><div class="treatment-item"><el-checkbox label="（放置时间）缝线" /><label v-if="formModel.critical.delivery.handoverItems.includes('（放置时间）缝线')"><el-input v-model="formModel.critical.delivery.handoverDetails.sutureTime" /></label></div><div class="treatment-item"><el-checkbox label="尿管" /><label v-if="formModel.critical.delivery.handoverItems.includes('尿管')"><el-input v-model="formModel.critical.delivery.handoverDetails.catheter" /></label></div><div class="treatment-item"><el-checkbox label="其他" /><label v-if="formModel.critical.delivery.handoverItems.includes('其他')"><el-input v-model="formModel.critical.delivery.handoverDetails.other" /></label></div></el-checkbox-group></div></section></el-form></div>
          </el-tab-pane>
          <el-tab-pane label="转诊评估表" name="assessment">
            <div class="emr-section"><h2>一、转诊前</h2><el-form class="emr-form assessment-form" :disabled="readOnly"><section class="doc-subsection assessment-subsection"><label class="assessment-choice-line"><span>转诊原因：</span><el-radio-group v-model="formModel.assessment.beforeReason"><el-radio label="病情" /><el-radio label="患者要求" /><el-radio label="其他" /></el-radio-group><el-input v-if="formModel.assessment.beforeReason === '其他'" v-model="formModel.assessment.beforeReasonOther" /></label></section><section class="doc-subsection assessment-subsection"><label class="assessment-choice-line"><span>转诊决策者：</span><el-radio-group v-model="formModel.assessment.decisionMaker"><el-radio label="科室行政主任" /><el-radio label="值班三线" /><el-radio label="二线/一线" /><el-radio label="其他" /></el-radio-group><el-input v-if="formModel.assessment.decisionMaker === '其他'" v-model="formModel.assessment.decisionMakerOther" /></label></section><section class="doc-subsection assessment-subsection"><div class="assessment-prep"><span>转诊前准备：</span><div><el-checkbox-group v-model="formModel.assessment.preparation" class="inline-checks"><el-checkbox v-for="item in prepOptions" :key="item" :label="item" /></el-checkbox-group><div v-if="formModel.assessment.preparation.includes('护送人员')" class="prep-children"><label>补充说明：<el-input v-model="formModel.assessment.escortStaffNote" placeholder="医生、护士" /></label></div><el-checkbox-group v-if="formModel.assessment.preparation.includes('吸氧设备')" v-model="formModel.assessment.oxygenPreparation" class="inline-checks prep-children"><el-checkbox v-for="item in oxygenPrepOptions" :key="item" :label="item" /></el-checkbox-group><el-checkbox-group v-if="formModel.assessment.preparation.includes('抢救药物')" v-model="formModel.assessment.medicinePreparation" class="inline-checks prep-children"><el-checkbox v-for="item in medicinePrepOptions" :key="item" :label="item" /></el-checkbox-group><el-checkbox-group v-if="formModel.assessment.preparation.includes('抢救设备')" v-model="formModel.assessment.equipmentPreparation" class="inline-checks prep-children"><el-checkbox v-for="item in equipmentPrepOptions" :key="item" :label="item" /></el-checkbox-group></div></div></section><section class="doc-subsection assessment-subsection"><div class="assessment-prep"><span>转诊前评估：</span><el-checkbox-group v-model="formModel.assessment.beforeChecks" class="before-eval-checks"><el-checkbox label="转诊距离" /><el-checkbox label="生命体征" /><el-checkbox label="意识状态" /><el-checkbox label="外周静脉" /><label class="before-eval-input"><el-checkbox label="接诊医院联系人/电话" /><el-input v-model="formModel.assessment.before.contactPhone" /></label><label class="before-eval-input"><el-checkbox label="接诊医院接诊位置" /><el-input v-model="formModel.assessment.before.receptionLocation" /></label></el-checkbox-group></div></section></el-form></div>
            <div class="emr-section"><h2>二、转诊中</h2><el-form class="emr-form assessment-form" :disabled="readOnly"><section class="doc-subsection assessment-subsection"><label class="assessment-choice-line"><span>交通工具：</span><el-radio-group v-model="formModel.assessment.duringTransport"><el-radio label="急救车" /><el-radio label="私家车" /></el-radio-group></label></section><section class="doc-subsection assessment-subsection"><div class="assessment-prep"><span>患者状况：</span><el-checkbox-group v-model="formModel.assessment.duringChecks" class="before-eval-checks"><el-checkbox label="意识" /><el-checkbox label="生命体征" /><el-checkbox label="出血量" /><label class="before-eval-input"><el-checkbox label="特殊情况" /><el-input v-if="formModel.assessment.duringChecks.includes('特殊情况')" v-model="formModel.assessment.during.special" /></label></el-checkbox-group></div></section><section class="doc-subsection assessment-subsection"><div class="assessment-volume"><label><span>入量：</span><el-input v-model="formModel.assessment.during.input" /><em>ml</em></label><label><span>出量：</span><el-input v-model="formModel.assessment.during.output" /><em>ml</em></label></div></section><section class="doc-subsection assessment-subsection"><label class="emr-textarea assessment-rescue-text">抢救过程<el-input v-model="formModel.assessment.during.rescueProcess" type="textarea" :rows="4" /></label></section></el-form></div>
            <div class="emr-section"><h2>三、转诊后</h2><el-form class="emr-form assessment-form" :disabled="readOnly"><section class="doc-subsection assessment-subsection"><div class="assessment-eval-grid"><label v-for="item in [{label:'转诊过程顺利',key:'smooth'},{label:'交通顺畅',key:'trafficSmooth'},{label:'交通工具易于获得',key:'vehicleAvailable'},{label:'接诊医院便于联系',key:'hospitalContactEasy'},{label:'接诊医院接诊位置明确',key:'locationClear'},{label:'接诊医院医务人员易于沟通',key:'staffCommunicationEasy'}]" :key="item.key">{{ item.label }}：<el-radio-group v-model="formModel.assessment.after[item.key]"><el-radio label="是" /><el-radio label="否" /></el-radio-group></label></div></section><section class="doc-subsection assessment-subsection"><label class="emr-textarea assessment-rescue-text">特殊问题<el-input v-model="formModel.assessment.after.specialProblem" type="textarea" :rows="4" /></label></section></el-form></div>
            <div class="emr-section"><h2>四、转诊补充记录</h2><el-form class="emr-form assessment-form" :disabled="readOnly"><section class="doc-subsection assessment-subsection"><label class="emr-textarea assessment-rescue-text">抢救过程特殊情况记录<el-input v-model="formModel.assessment.specialRescueRecord" type="textarea" :rows="4" /></label></section><section class="doc-subsection assessment-subsection"><label class="emr-textarea assessment-rescue-text">围产期特殊情况<el-input v-model="formModel.assessment.perinatalSpecial" type="textarea" :rows="4" /></label></section><section class="doc-subsection assessment-subsection"><div class="assessment-extra-grid"><label>转诊时间：<el-date-picker v-model="formModel.assessment.referralTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label><label>离开时间：<el-date-picker v-model="formModel.assessment.leaveTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label><label>到达转诊医院时间：<el-date-picker v-model="formModel.assessment.arriveTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></label></div></section><section class="doc-subsection assessment-subsection"><div class="assessment-extra-grid"><label>送诊医务人员：<el-input v-model="formModel.assessment.escortStaff" /></label><label>联系方式：<el-input v-model="formModel.assessment.contact" /></label><label>病房：<el-input v-model="formModel.assessment.ward" /></label><label>主管医师：<el-input v-model="formModel.assessment.attendingDoctor" /></label></div></section></el-form></div>
          </el-tab-pane>
        </el-tabs>
        <div v-else-if="isSyphilisDocument" class="syphilis-document-panel">
          <div class="emr-section syphilis-section"><h2>一、基础信息</h2><el-form class="emr-form syphilis-form" :disabled="readOnly"><div class="syphilis-field-grid"><label>姓名：<el-input v-model="formModel.syphilis.basic.name" disabled /></label><label>病历号：<el-input v-model="formModel.syphilis.basic.medicalNo" disabled /></label><label>末次月经：<el-date-picker v-model="formModel.syphilis.basic.lastMenstrualPeriod" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label><label>预产期：<el-date-picker v-model="formModel.syphilis.basic.expectedDeliveryDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label><label>孕产妇联系电话：<el-input v-model="formModel.syphilis.basic.phone" /></label><label>主管医师：<el-input v-model="formModel.syphilis.basic.doctor" /></label></div></el-form></div>
          <div class="emr-section syphilis-section"><h2>二、首次检测信息</h2><div class="readonly-result-table syphilis-readonly-table"><table><thead><tr><th>项目</th><th>结果</th></tr></thead><tbody><tr><td>首次检测孕周</td><td><strong>{{ formModel.syphilis.firstTest.gestationalWeek || '--' }}</strong></td></tr><tr><td>检测日期</td><td><strong>{{ formModel.syphilis.firstTest.date || '--' }}</strong></td></tr><tr><td>TPPA</td><td><strong>{{ formModel.syphilis.firstTest.tppa || '--' }}</strong></td></tr><tr><td>RPR/TRUST 滴度</td><td><strong>{{ formModel.syphilis.firstTest.rprTrustTiter || '--' }}</strong></td></tr></tbody></table></div></div>
          <div class="emr-section syphilis-section"><h2>三、转诊专科医院建档</h2><el-form class="emr-form syphilis-form" :disabled="readOnly"><div class="syphilis-choice-line"><span>是否转诊专科医院建档：</span><div class="syphilis-choice-options"><el-radio-group v-model="formModel.syphilis.referral.destination" class="compact-radio-group"><el-radio value="未转诊">未转诊</el-radio><el-radio value="地坛医院">地坛医院</el-radio><el-radio value="佑安医院">佑安医院</el-radio><el-radio value="第五医学中心">第五医学中心</el-radio><el-radio value="其他">其他</el-radio></el-radio-group><el-input v-if="formModel.syphilis.referral.destination === '其他'" v-model="formModel.syphilis.referral.destinationOther" placeholder="其他说明" class="syphilis-other-input" /></div></div><div class="syphilis-field-grid"><label>转诊孕周：<el-input v-model="formModel.syphilis.referral.gestationalWeek" /></label><label>转诊日期：<el-date-picker v-model="formModel.syphilis.referral.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label></div><div class="syphilis-yes-no-grid"><div class="syphilis-yes-no-row"><span class="syphilis-yes-no-label">使用转诊单进行转诊：</span><el-radio-group v-model="formModel.syphilis.referral.usedReferralForm" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div><div class="syphilis-yes-no-row right-baseline-row"><span class="syphilis-yes-no-label">使用转诊知情同意书：</span><el-radio-group v-model="formModel.syphilis.referral.usedConsentForm" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div><div class="syphilis-follow-line"><span class="syphilis-follow-label">已明确追访病人在外院建档产检：</span><div class="syphilis-follow-options"><el-checkbox v-model="formModel.syphilis.referral.communicatedWithExternalHospital">和外院沟通确定</el-checkbox><el-checkbox v-model="formModel.syphilis.referral.receivedReferralReceipt">收到外院转诊单回执</el-checkbox></div></div></el-form></div>
          <div class="emr-section syphilis-section"><h2>四、第一疗程治疗情况</h2><el-form class="emr-form syphilis-form" :disabled="readOnly"><div class="syphilis-choice-line"><span>治疗机构：</span><div class="syphilis-choice-options"><el-radio-group v-model="formModel.syphilis.firstTreatment.institution" class="compact-radio-group"><el-radio value="本院">本院</el-radio><el-radio value="地坛医院">地坛医院</el-radio><el-radio value="佑安医院">佑安医院</el-radio><el-radio value="第五医学中心">第五医学中心</el-radio><el-radio value="其他">其他</el-radio></el-radio-group><el-input v-if="formModel.syphilis.firstTreatment.institution === '其他'" v-model="formModel.syphilis.firstTreatment.institutionOther" placeholder="其他治疗机构" class="syphilis-other-input" /></div></div><div class="syphilis-choice-line"><span>治疗药物：</span><div class="syphilis-choice-options"><el-radio-group v-model="formModel.syphilis.firstTreatment.medicine" class="compact-radio-group"><el-radio value="苄星青霉素">苄星青霉素</el-radio><el-radio value="其他">其他</el-radio></el-radio-group><el-input v-if="formModel.syphilis.firstTreatment.medicine === '其他'" v-model="formModel.syphilis.firstTreatment.medicineOther" placeholder="其他药物" class="syphilis-other-input" /></div></div><div class="syphilis-yes-no-grid single-row"><div class="syphilis-yes-no-row"><span class="syphilis-yes-no-label">转诊治疗是否填写转诊单：</span><el-radio-group v-model="formModel.syphilis.firstTreatment.referralTreatmentFormFilled" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div><div class="syphilis-field-grid"><label>治疗开始孕周：<el-input v-model="formModel.syphilis.firstTreatment.startGestationalWeek" /></label><label>治疗开始日期：<el-date-picker v-model="formModel.syphilis.firstTreatment.startDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label></div><div class="syphilis-follow-line source-line"><span class="syphilis-follow-label">治疗记录来源：</span><div class="syphilis-follow-options"><el-checkbox-group v-model="formModel.syphilis.firstTreatment.recordSources" class="compact-check-group"><el-checkbox label="本院病历记录" /><el-checkbox label="外院病历记录" /><el-checkbox label="外院转诊单回执" /></el-checkbox-group></div></div></el-form></div>
          <div class="emr-section syphilis-section"><div class="section-title-line syphilis-monitor-title-line"><div class="syphilis-title-main"><h2>五、孕期监测</h2><span class="section-title-note">双阳孕产妇应每月监测、单阳孕产妇治疗完成 1 个月后、孕中期、孕晚期（36周后）需要监测</span></div><el-button v-if="!readOnly" link type="primary" @click="addSyphilisMonitoringRow">新增一行</el-button></div><el-form class="emr-form" :disabled="readOnly"><el-table :data="formModel.syphilis.pregnancyMonitoring" border class="syphilis-review-table"><el-table-column type="index" label="序号" width="58" align="center" /><el-table-column label="检测孕周" width="160"><template #default="{ row }"><el-input v-model="row.gestationalWeek" /></template></el-table-column><el-table-column label="检测日期" width="170"><template #default="{ row }"><el-date-picker v-model="row.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></template></el-table-column><el-table-column label="RPR/TRUST 滴度" min-width="260"><template #default="{ row }"><el-input v-model="row.rprTrustTiter" /></template></el-table-column><el-table-column label="操作" width="80" align="center"><template #default="{ $index }"><el-button link type="danger" :disabled="formModel.syphilis.pregnancyMonitoring.length <= 1" @click="removeSyphilisMonitoringRow($index)">删除</el-button></template></el-table-column></el-table></el-form></div>
          <div class="emr-section syphilis-section"><h2>六、新生儿及出院随访</h2><el-form class="emr-form syphilis-form" :disabled="readOnly"><div class="syphilis-choice-line"><span>告知儿科产妇感染/既往感染情况：</span><div class="syphilis-choice-options"><el-radio-group v-model="formModel.syphilis.newbornFollowup.informedPediatrics" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group><el-input v-if="formModel.syphilis.newbornFollowup.informedPediatrics === '是'" v-model="formModel.syphilis.newbornFollowup.informer" placeholder="告知人" class="syphilis-other-input" /></div></div><div class="syphilis-choice-line"><span>新生儿预防性治疗情况：</span><div class="syphilis-choice-options"><el-radio-group v-model="formModel.syphilis.newbornFollowup.preventiveTreatment" class="compact-radio-group"><el-radio value="苄星青霉素预防性治疗">苄星青霉素预防性治疗</el-radio><el-radio value="否">否</el-radio></el-radio-group><el-input v-if="formModel.syphilis.newbornFollowup.preventiveTreatment === '否'" v-model="formModel.syphilis.newbornFollowup.preventiveTreatmentReason" placeholder="否，原因" class="syphilis-other-input" /></div></div><div class="syphilis-field-grid"><label>新生儿 RPR/TRUST 滴度：<el-input v-model="formModel.syphilis.newbornFollowup.newbornRprTrustTiter" /></label><div class="syphilis-yes-no-row followup-guide-row"><span class="syphilis-yes-no-label">发放出院指导：</span><el-radio-group v-model="formModel.syphilis.newbornFollowup.dischargeGuidanceIssued" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div></el-form></div>
        </div>
        <div v-else-if="isHepatitisBDocument" class="hepatitis-document-panel">
          <div class="emr-section hepatitis-section"><h2>一、基础信息</h2><el-form class="emr-form hepatitis-form" :disabled="readOnly"><div class="hepatitis-field-grid"><label>姓名：<el-input v-model="formModel.hepatitisB.basic.name" disabled /></label><label>病历号：<el-input v-model="formModel.hepatitisB.basic.medicalNo" disabled /></label><label>末次月经：<el-date-picker v-model="formModel.hepatitisB.basic.lastMenstrualPeriod" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label><label>预产期：<el-date-picker v-model="formModel.hepatitisB.basic.expectedDeliveryDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label><label>孕产妇联系电话：<el-input v-model="formModel.hepatitisB.basic.phone" /></label><label>主管医师：<el-input v-model="formModel.hepatitisB.basic.doctor" /></label></div></el-form></div>
          <div class="emr-section hepatitis-section"><h2>二、首次乙肝五项</h2><div class="readonly-result-table"><table><thead><tr><th>检查项目</th><th>结果</th></tr></thead><tbody><tr v-for="item in [{label:'HBsAg',key:'hbsag'},{label:'抗-HBs',key:'antiHbs'},{label:'HBeAg',key:'hbeag'},{label:'抗-HBe',key:'antiHbe'},{label:'抗-HBc',key:'antiHbc'}]" :key="item.key"><td>{{ item.label }}</td><td><strong>{{ formModel.hepatitisB.firstFiveItems[item.key] || '--' }}</strong></td></tr></tbody></table></div></div>
          <div class="emr-section hepatitis-section"><div class="section-title-line"><h2>三、HBV DNA（每两月复查）</h2><el-button v-if="!readOnly" link type="primary" @click="addHbvDnaReviewRow">新增一行</el-button></div><el-form class="emr-form" :disabled="readOnly"><el-table :data="formModel.hepatitisB.hbvDnaReviews" border class="hepatitis-review-table"><el-table-column type="index" label="序号" width="58" align="center" /><el-table-column label="检查日期" width="150"><template #default="{ row }"><el-date-picker v-model="row.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></template></el-table-column><el-table-column label="孕周" width="120"><template #default="{ row }"><el-input v-model="row.gestationalWeek" /></template></el-table-column><el-table-column label="HBV DNA 结果" min-width="190"><template #default="{ row }"><el-input v-model="row.result" /></template></el-table-column><el-table-column label="备注" min-width="190"><template #default="{ row }"><el-input v-model="row.remark" /></template></el-table-column><el-table-column label="操作" width="80" align="center"><template #default="{ $index }"><el-button link type="danger" :disabled="formModel.hepatitisB.hbvDnaReviews.length <= 1" @click="removeHbvDnaReviewRow($index)">删除</el-button></template></el-table-column></el-table></el-form></div>
          <div class="emr-section hepatitis-section"><div class="section-title-line"><h2>四、肝功能检测（每两月复查）</h2><el-button v-if="!readOnly" link type="primary" @click="addLiverFunctionReviewRow">新增一行</el-button></div><el-form class="emr-form" :disabled="readOnly"><el-table :data="formModel.hepatitisB.liverFunctionReviews" border class="hepatitis-review-table"><el-table-column type="index" label="序号" width="58" align="center" /><el-table-column label="检查日期" width="140"><template #default="{ row }"><el-date-picker v-model="row.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></template></el-table-column><el-table-column label="孕周" width="104"><template #default="{ row }"><el-input v-model="row.gestationalWeek" /></template></el-table-column><el-table-column label="检查结果" min-width="360"><template #default="{ row }"><el-input v-model="row.result" /></template></el-table-column><el-table-column label="操作" width="80" align="center"><template #default="{ $index }"><el-button link type="danger" :disabled="formModel.hepatitisB.liverFunctionReviews.length <= 1" @click="removeLiverFunctionReviewRow($index)">删除</el-button></template></el-table-column></el-table></el-form></div>
          <div class="emr-section hepatitis-section"><div class="section-title-line antiviral-title-line"><div class="antiviral-title-main"><h2>五、抗病毒治疗</h2><span class="section-title-note">HBV DNA ≥ 2×10^5 IU/mL，应于孕 28 周采取抗病毒治疗</span></div><el-button v-if="!readOnly" link type="primary" @click="addAntiviralTreatmentRow">新增一行</el-button></div><el-form class="emr-form" :disabled="readOnly"><el-table :data="formModel.hepatitisB.antiviralTreatment.treatmentRecords" border class="hepatitis-review-table antiviral-table"><el-table-column type="index" label="序号" width="58" align="center" /><el-table-column label="治疗记录" min-width="420"><template #default="{ row }"><el-input v-model="row.content" /></template></el-table-column><el-table-column label="操作" width="80" align="center"><template #default="{ $index }"><el-button link type="danger" :disabled="formModel.hepatitisB.antiviralTreatment.treatmentRecords.length <= 1" @click="removeAntiviralTreatmentRow($index)">删除</el-button></template></el-table-column></el-table></el-form></div>
          <div class="emr-section hepatitis-section"><h2>六、转诊外院建档产检分娩</h2><el-form class="emr-form hepatitis-form" :disabled="readOnly"><div class="hepatitis-field-grid"><label>转诊孕周：<el-input v-model="formModel.hepatitisB.referral.gestationalWeek" /></label><label>转诊日期：<el-date-picker v-model="formModel.hepatitisB.referral.date" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></label></div><div class="hbv-yes-no-grid"><div class="hbv-yes-no-row"><span class="hbv-yes-no-label">使用转诊单进行转诊：</span><el-radio-group v-model="formModel.hepatitisB.referral.usedReferralForm" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div><div class="hbv-yes-no-row right-baseline-row"><span class="hbv-yes-no-label">使用转诊知情同意书：</span><el-radio-group v-model="formModel.hepatitisB.referral.usedConsentForm" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div><div class="hepatitis-follow-line"><span class="hepatitis-follow-label">已明确追访病人在外院建档产检：</span><div class="hepatitis-follow-options"><el-checkbox v-model="formModel.hepatitisB.referral.communicatedWithExternalHospital">和外院沟通确定</el-checkbox><el-checkbox v-model="formModel.hepatitisB.referral.receivedReferralReceipt">收到外院转诊单回执</el-checkbox></div></div></el-form></div>
          <div class="emr-section hepatitis-section"><h2>七、新生儿及出院随访</h2><el-form class="emr-form hepatitis-form" :disabled="readOnly"><div class="hepatitis-field-grid followup-grid"><label>新生儿球蛋白及乙肝疫苗接种情况：<el-input v-model="formModel.hepatitisB.newbornFollowup.immunoglobulinAndVaccine" class="vaccine-input" /></label></div><div class="followup-radio-center-line"><div class="hbv-yes-no-row"><span class="hbv-yes-no-label">发放出院指导：</span><el-radio-group v-model="formModel.hepatitisB.newbornFollowup.dischargeGuidanceIssued" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div><div class="hbv-yes-no-row right-baseline-row"><span class="hbv-yes-no-label">是否为高暴露需要医疗机构追访：</span><el-radio-group v-model="formModel.hepatitisB.newbornFollowup.highExposureFollowupRequired" class="compact-radio-group"><el-radio value="是">是</el-radio><el-radio value="否">否</el-radio></el-radio-group></div></div></el-form></div>
        </div>
        <div v-else class="simple-document-panel">
          <div class="paper-section">
            <h2>{{ currentDocumentType.label }}</h2>
            <el-form class="simple-document-form" label-position="left" label-width="118px" :disabled="readOnly">
              <el-form-item label="单据编号"><el-input v-model="formModel.documentNo" disabled /></el-form-item>
              <el-form-item label="当前孕妇"><el-input :model-value="currentMotherDisplay" disabled /></el-form-item>
              <el-form-item label="填写医生"><el-input v-model="formModel.doctor" /></el-form-item>
              <el-form-item label="填写时间"><el-input v-model="formModel.fillTime" placeholder="YYYY-MM-DD HH:mm" /></el-form-item>
              <el-form-item label="主要情况说明"><el-input v-model="formModel.summary" type="textarea" :rows="4" /></el-form-item>
              <el-form-item label="处理建议"><el-input v-model="formModel.advice" type="textarea" :rows="4" /></el-form-item>
              <el-form-item label="状态"><el-tag :type="statusType(formModel.status)" effect="plain">{{ formModel.status }}</el-tag></el-form-item>
            </el-form>
          </div>
        </div>
          <div class="form-actions drawer-actions"><el-button v-if="readOnly" @click="mode = 'list'">返回列表</el-button><el-button v-if="!readOnly" @click="mode = 'list'">取消</el-button><el-button v-if="!readOnly" @click="saveTemporary">临时保存</el-button><el-button v-if="!readOnly" type="primary" @click="saveApplication">保存申请单</el-button><el-button v-if="!readOnly" type="success" @click="saveAndPrint">保存并打印</el-button></div>
        </section>
      </el-drawer>
    </main>
  </div>
</template>

<style scoped>
.referral-page { min-height: 100vh; color: #303846; background: #edf1f5; }
.page-main { max-width: 1520px; margin: 0 auto; padding: 10px 12px 22px; }
.page-heading, .list-panel, .form-shell { background: #fff; border: 1px solid #d8e0e8; }
.page-heading { height: 50px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; }
.heading-left { display: flex; align-items: center; gap: 10px; }
.document-breadcrumb { min-height: 38px; display: flex; align-items: center; gap: 10px; color: #607186; font-size: 13px; border-bottom: 1px solid #e3e9ef; }
.heading-divider { width: 1px; height: 18px; background: #d7dee8; }
.page-code { color: #6c7a8d; font-size: 13px; }
.mother-strip { margin-top: 10px; min-height: 58px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.mother-strip div { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }
.mother-strip strong { color: #25364a; font-size: 18px; }
.mother-strip span { color: #657386; }
.empty-state { min-height: 360px; margin-top: 10px; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; }
.empty-state h1 { margin: 0; color: #25364a; font-size: 22px; }
.empty-state p { margin: 0; color: #748296; }
.document-list-shell { padding: 0 16px 16px; background: #fff; border: 1px solid #d8e0e8; }
.list-panel { margin-top: 10px; padding: 18px; }
.form-shell { height: 100%; display: flex; flex-direction: column; background: #fff; }
.list-title { min-height: 54px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-bottom: 1px solid #e3e9ef; }
.list-title h1 { margin: 0; color: #25364a; font-size: 20px; }
.list-title p { margin: 8px 0 0; color: #6b798c; }
.application-table { margin-top: 10px; font-size: 13px; }
.application-table :deep(.el-table__header th) { padding: 7px 0; background: #f8fafc; color: #516176; font-weight: 600; }
.application-table :deep(.el-table__cell) { padding: 6px 0; }
.application-table :deep(.cell) { padding: 0 8px; line-height: 20px; }
.application-table :deep(.el-button.is-link) { padding: 0 4px; font-size: 13px; }
.application-table :deep(.el-button.is-link.is-disabled) { color: #a8b2bf; }
.application-table :deep(.el-tag) { height: 22px; padding: 0 7px; font-size: 12px; }
.table-actions { display: grid; grid-template-columns: 44px 44px 44px 44px 68px 44px; gap: 0 8px; align-items: center; justify-content: start; }
.table-actions :deep(.el-button) { margin-left: 0; min-height: 24px; justify-content: center; }
.mother-profile-line { min-height: 40px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: #556477; font-size: 13px; line-height: 22px; border-bottom: 1px solid #edf2f7; }
.mother-profile-line strong { color: #25364a; }
.mother-profile-line i { color: #c0cad6; font-style: normal; }
.card-title, .form-title { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid #e3e9ef; }
.card-title h1, .form-title h1 { margin: 0; color: #25364a; font-size: 22px; }
.card-title p, .form-title p { margin: 8px 0 0; color: #6b798c; }
.record-grid { margin: 16px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid #e1e7ef; }
.record-grid div { min-width: 0; padding: 13px 14px; border-right: 1px solid #e1e7ef; border-bottom: 1px solid #e1e7ef; }
.record-grid div:nth-child(4n) { border-right: none; }
.record-grid dt, .mother-info span { color: #7a8798; font-size: 12px; }
.record-grid dd { margin: 6px 0 0; color: #26384f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-actions, .form-actions { margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px; }
.mother-info { margin-top: 14px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid #e1e7ef; }
.mother-info div { padding: 12px 14px; border-right: 1px solid #e1e7ef; }
.mother-info div:last-child { border-right: none; }
.mother-info strong { display: block; margin-top: 6px; color: #25364a; }
.paper-tabs { min-height: 0; flex: 1; display: flex; flex-direction: column; margin-top: 0; padding: 0 18px; overflow: hidden; }
.paper-section { margin-bottom: 10px; padding: 10px 12px; background: #fbfcfe; border: 1px solid #dfe6ed; }
.paper-section h2 { margin: 0 0 12px; color: #25364a; font-size: 17px; }
.paper-grid { display: block; }
.paper-grid :deep(.el-form-item) { margin-bottom: 8px; }
.inline-medical-form :deep(.el-form-item) { display: inline-flex; width: auto; margin-right: 12px; vertical-align: top; }
.inline-medical-form :deep(.el-form-item__label) { height: 32px; line-height: 32px; padding-right: 6px; color: #4f5f72; font-size: 13px; }
.inline-medical-form :deep(.el-form-item__label) { justify-content: flex-end; text-align: right; }
.inline-medical-form :deep(.el-form-item__label::after) { content: '：'; }
.referral-basic-form .form-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0 12px; margin-bottom: 8px; }
.referral-basic-form .identity-row { gap: 0 10px; }
.referral-basic-form .full-row { display: block; }
.referral-basic-form .long-field { display: flex; width: 760px; }
.referral-basic-form .long-field :deep(.el-form-item__content) { flex: 1; }
.referral-basic-form .long-field :deep(.el-textarea) { width: 660px; }
.referral-basic-form .single-wide :deep(.el-input), .referral-basic-form .single-wide :deep(.el-select) { width: 360px; }
.referral-basic-form .single-narrow :deep(.el-input) { width: 160px; }
.referral-basic-form .single-time :deep(.el-input) { width: 185px; }
.referral-basic-form .region-field { display: flex; width: 720px; }
.referral-basic-form .region-field :deep(.el-form-item__content) { display: flex; flex: 1; gap: 10px; }
.referral-basic-form .region-field :deep(.el-cascader) { width: 520px; }
.referral-basic-form .address-field { width: 1040px; }
.referral-basic-form .address-field :deep(.el-input) { width: 380px; }
.basic-paper .region-block { margin: 0 0 8px; }
.inline-medical-form :deep(.el-form-item__content) { width: auto; flex: none; }
.inline-medical-form :deep(.el-input), .inline-medical-form :deep(.el-select) { width: 160px; }
.inline-medical-form :deep(.el-textarea) { width: 100%; }
.inline-medical-form .w-code :deep(.el-input) { width: 150px; }
.inline-medical-form .w-medical :deep(.el-input) { width: 145px; }
.inline-medical-form .w-name :deep(.el-input), .inline-medical-form .w-doctor :deep(.el-input) { width: 120px; }
.inline-medical-form .w-phone :deep(.el-input) { width: 150px; }
.inline-medical-form .w-time :deep(.el-input) { width: 165px; }
.inline-medical-form .w-hospital :deep(.el-input), .inline-medical-form .w-hospital :deep(.el-select) { width: 240px; }
.inline-medical-form .readonly-field :deep(.el-input__wrapper) { background: #f3f5f8; box-shadow: 0 0 0 1px #d8e0e8 inset; }
.paper-grid .full, .paper-section :deep(.full) { grid-column: 1 / -1; }
.paper-section :deep(.el-checkbox-group), .paper-section :deep(.el-radio-group) { display: flex; flex-wrap: wrap; gap: 8px 14px; }
.paper-tabs :deep(.el-tabs__header) { flex: 0 0 auto; margin-bottom: 8px; }
.paper-tabs :deep(.el-tabs__content) { min-height: 0; flex: 1; overflow: auto; }
.paper-tabs :deep(.el-tab-pane) { min-height: 100%; }
.title-action { margin-right: 8px; color: #1f6fff; font-weight: 700; }
.drawer-mother-line { margin-top: 8px; display: flex; align-items: center; gap: 9px; color: #556477; font-size: 14px; }
.drawer-mother-line strong { color: #25364a; }
.drawer-mother-line i { color: #c0cad6; font-style: normal; }
.region-block { display: grid; grid-template-columns: 92px 330px 280px; gap: 10px; align-items: center; margin-bottom: 8px; }
.region-block h3 { margin: 0; color: #25364a; font-size: 14px; }
.region-block :deep(.el-cascader), .region-block :deep(.el-input), .paper-grid :deep(.el-select) { width: 100%; }
.form-actions { padding: 12px 18px; background: #fff; border-top: 1px solid #e3e9ef; }
.simple-document-panel { min-height: 0; flex: 1; padding: 18px; overflow: auto; background: #edf1f5; }
.simple-document-panel .paper-section { width: 860px; max-width: 100%; margin: 0; padding: 18px 20px; background: #fff; }
.simple-document-form { max-width: 760px; }
.simple-document-form :deep(.el-input), .simple-document-form :deep(.el-textarea) { width: 100%; }
.hepatitis-document-panel { min-height: 0; flex: 1; padding: 16px 18px; overflow-y: auto; overflow-x: hidden; background: #edf1f5; }
.hepatitis-section { width: min(100%, 1120px); min-width: 0; box-sizing: border-box; }
.hepatitis-form label { color: #44566c; font-size: 13px; }
.hepatitis-field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px; max-width: 940px; }
.hepatitis-field-grid label { display: grid; grid-template-columns: 150px minmax(0, 240px); gap: 8px; align-items: center; text-align: right; white-space: nowrap; }
.hepatitis-field-grid :deep(.el-input), .hepatitis-field-grid :deep(.el-date-editor.el-input) { width: 100%; max-width: 240px; }
.hepatitis-field-grid :deep(.el-radio-group) { justify-self: start; display: inline-flex; flex-wrap: nowrap; gap: 12px; }
.hepatitis-field-grid :deep(.el-radio) { margin-right: 0; }
.readonly-result-table { width: 420px; max-width: 100%; }
.readonly-result-table table { width: 100%; border-collapse: collapse; table-layout: fixed; color: #34465c; font-size: 13px; }
.readonly-result-table th, .readonly-result-table td { height: 34px; padding: 0 12px; border: 1px solid #dfe6ed; text-align: left; }
.readonly-result-table th { background: #f8fafc; color: #516176; font-weight: 600; }
.readonly-result-table td:last-child { text-align: center; }
.readonly-result-table strong { color: #1f344d; font-size: 15px; }
.section-title-line { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; min-height: 32px; }
.section-title-line h2 { margin-bottom: 0; }
.section-title-line .el-button { margin-left: auto; align-self: center; }
.section-title-note { min-width: 0; color: #6e7d90; font-size: 13px; line-height: 20px; }
.antiviral-title-line { align-items: center; }
.antiviral-title-main { display: flex; align-items: baseline; gap: 12px; min-height: 30px; }
.antiviral-title-main h2 { margin: 0; line-height: 22px; }
.antiviral-title-main .section-title-note { line-height: 18px; }
.hepatitis-review-table { width: 100%; max-width: 100%; font-size: 13px; }
.hepatitis-review-table :deep(.el-table__header th) { padding: 6px 0; background: #f8fafc; color: #516176; font-weight: 600; }
.hepatitis-review-table :deep(.el-table__cell) { padding: 5px 0; }
.hepatitis-review-table :deep(.cell) { padding: 0 6px; line-height: 20px; }
.hepatitis-review-table :deep(.el-input), .hepatitis-review-table :deep(.el-date-editor.el-input) { width: 100%; }
.antiviral-table { max-width: 820px; }
.hepatitis-follow-line { margin-top: 16px; display: grid; grid-template-columns: 230px max-content; gap: 8px; align-items: center; max-width: 940px; color: #34465c; font-size: 13px; }
.hepatitis-follow-label { color: #44566c; font-weight: 400; line-height: 32px; text-align: right; white-space: nowrap; }
.hepatitis-follow-options { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 12px 24px; min-height: 32px; }
.hepatitis-follow-line :deep(.el-checkbox) { margin-right: 0; }
.hbv-yes-no-grid { margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px; max-width: 940px; }
.hbv-yes-no-row { display: grid; grid-template-columns: 150px max-content; gap: 8px; align-items: center; min-height: 32px; }
.hbv-yes-no-row.right-baseline-row { grid-template-columns: 240px max-content; transform: translateX(-90px); }
.hbv-yes-no-label { color: #44566c; font-size: 13px; line-height: 32px; text-align: right; white-space: nowrap; }
.hepatitis-check-line { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 12px 26px; max-width: 900px; }
.hepatitis-check-line :deep(.el-checkbox) { margin-right: 0; }
.followup-grid { margin-top: 14px; }
.followup-grid label:first-child { grid-template-columns: 230px minmax(0, 560px); }
.followup-grid .vaccine-input { width: 560px; max-width: 100%; }
.followup-grid .vaccine-input :deep(.el-input__wrapper) { width: 560px; max-width: 100%; }
.followup-radio-center-line { margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: center; gap: 14px 28px; max-width: 940px; }
@media (max-width: 900px) {
  .record-grid, .mother-info, .paper-grid { grid-template-columns: 1fr; }
  .mother-strip, .card-title, .form-title { align-items: flex-start; flex-direction: column; }
  .record-grid div, .mother-info div { border-right: none; }
}
.referral-drawer :deep(.el-drawer__body) { height: 100%; padding: 0; overflow: hidden; background: #edf1f5; }
.referral-drawer :deep(.el-drawer) { height: 100%; }
.drawer-head { flex: 0 0 auto; padding: 16px 18px 12px; background: #fff; border-bottom: 1px solid #d8e0e8; }
.drawer-context { margin-bottom: 10px; color: #5f6f82; font-size: 13px; }
.drawer-mother-info { margin-top: 12px; }
.drawer-actions { flex: 0 0 auto; position: sticky; bottom: 0; z-index: 2; }
.document-mode .paper-section { background: #fff; }
.document-mode :deep(.el-input__wrapper), .document-mode :deep(.el-textarea__inner) { background: #fff; box-shadow: 0 0 0 1px #dfe6ed inset; }
.critical-form .form-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0 18px; margin-bottom: 10px; }
.critical-form .compact-row { gap: 0 18px; }
.critical-form .critical-datetime :deep(.el-input) { width: 170px; }
.critical-form .stacked-field { width: 760px; margin-bottom: 8px; }
.critical-form .stacked-field > span { display: block; margin-bottom: 6px; color: #4f5f72; font-size: 13px; text-align: left; }
.critical-form .stacked-field :deep(.el-textarea) { width: 720px; }
.critical-form .compact-stack { width: 720px; }
.critical-form .w-delivery :deep(.el-radio-group) { width: 250px; }
.critical-form .full-row { display: block; }
.critical-form .critical-long { display: flex; width: 840px; }
.critical-form .critical-long :deep(.el-form-item__content) { flex: 1; }
.critical-form .critical-long :deep(.el-textarea) { width: 680px; }
.critical-form .w-age :deep(.el-input), .critical-form .w-small :deep(.el-input) { width: 96px; }
.critical-form .w-radio :deep(.el-radio-group) { width: 120px; }
.critical-form .w-lab :deep(.el-input) { width: 220px; }
.critical-form .subline { display: flex; align-items: flex-start; gap: 0 10px; margin-bottom: 8px; }
.critical-form .subline > span { width: 44px; height: 32px; line-height: 32px; color: #25364a; font-weight: 600; text-align: right; }
.critical-form .subline > span::after { content: '：'; }
.critical-paper h2 { margin-bottom: 10px; padding-left: 8px; border-left: 3px solid #447afc; }
.emr-section { width: 90%; min-width: 980px; margin-bottom: 16px; padding: 18px 20px; background: #fff; border: 1px solid #e4ebf3; box-shadow: 0 1px 0 rgba(31, 76, 116, 0.03); }
.emr-section h2 { margin: 0 0 16px; padding-left: 10px; color: #18324d; font-size: 16px; line-height: 22px; border-left: 3px solid #2f7df6; }
.emr-form label { color: #44566c; font-size: 13px; }
.emr-form :deep(.el-input), .emr-form :deep(.el-select), .emr-form :deep(.el-date-editor.el-input) { width: 240px; height: 32px; }
.emr-form :deep(.el-input__wrapper), .emr-form :deep(.el-textarea__inner) { background: #fff; border-radius: 4px; }
.emr-field-grid { display: grid; grid-template-columns: repeat(2, minmax(360px, 420px)); gap: 14px 36px; max-width: 900px; }
.emr-field-grid label, .vital-consciousness > label, .gas-grid label, .vital-metrics label { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.emr-field-grid label :deep(.el-input), .emr-field-grid label :deep(.el-date-editor.el-input) { flex: 0 0 auto; width: 240px; }
.assessment-form .assessment-grid { display: grid; grid-template-columns: repeat(2, minmax(430px, 520px)); gap: 14px 36px; max-width: 1120px; }
.assessment-form .assessment-grid > label { display: grid; grid-template-columns: 148px 1fr; gap: 8px; align-items: center; color: #44566c; text-align: right; white-space: nowrap; }
.assessment-form .assessment-grid > label :deep(.el-input) { width: 240px; }
.assessment-form .assessment-grid > label :deep(.el-radio-group) { display: inline-flex; flex-wrap: wrap; gap: 8px 14px; justify-self: start; }
.assessment-form .assessment-grid > label :deep(.el-radio) { margin-right: 0; }
.assessment-subsection { margin-top: 16px; }
.assessment-subsection:first-child { margin-top: 0; }
.assessment-choice-line { display: grid; grid-template-columns: 112px max-content 180px; gap: 8px; align-items: center; width: max-content; color: #44566c; font-size: 13px; white-space: nowrap; }
.assessment-choice-line > span { text-align: right; }
.assessment-choice-line :deep(.el-radio-group) { display: inline-flex; flex-wrap: nowrap; gap: 12px; }
.assessment-choice-line :deep(.el-radio) { margin-right: 0; }
.assessment-choice-line :deep(.el-input) { width: 180px; }
.assessment-prep { display: grid; grid-template-columns: 112px 1fr; gap: 8px; align-items: flex-start; max-width: 960px; color: #44566c; font-size: 13px; }
.assessment-prep > span { line-height: 32px; text-align: right; }
.prep-children { margin-top: 8px; padding-left: 24px; }
.prep-children label { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.prep-children :deep(.el-input) { width: 180px; }
.before-eval-checks { display: flex; flex-wrap: wrap; gap: 12px 24px; align-items: center; }
.before-eval-checks :deep(.el-checkbox) { margin-right: 0; }
.before-eval-input { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.before-eval-input :deep(.el-input) { width: 220px; }
.assessment-volume { display: grid; gap: 10px; width: max-content; }
.assessment-volume label { display: grid; grid-template-columns: 64px 118px 24px; gap: 8px; align-items: center; color: #44566c; font-size: 13px; white-space: nowrap; }
.assessment-volume span { text-align: right; }
.assessment-volume em { color: #52657a; font-style: normal; }
.assessment-volume :deep(.el-input) { width: 118px; }
.assessment-rescue-text { margin-top: 0; }
.assessment-eval-grid { display: grid; grid-template-columns: repeat(2, minmax(430px, 520px)); gap: 14px 36px; max-width: 1120px; }
.assessment-eval-grid > label { display: grid; grid-template-columns: 190px max-content; gap: 8px; align-items: center; color: #44566c; font-size: 13px; text-align: right; white-space: nowrap; }
.assessment-eval-grid > label :deep(.el-radio-group) { display: inline-flex; flex-wrap: nowrap; gap: 12px; justify-self: start; }
.assessment-eval-grid > label :deep(.el-radio) { margin-right: 0; }
.assessment-extra-grid { display: grid; grid-template-columns: repeat(2, minmax(360px, 420px)); gap: 14px 36px; max-width: 900px; }
.assessment-extra-grid > label { display: grid; grid-template-columns: 128px 240px; gap: 8px; align-items: center; color: #44566c; font-size: 13px; text-align: right; white-space: nowrap; }
.assessment-extra-grid > label :deep(.el-input), .assessment-extra-grid > label :deep(.el-date-editor.el-input) { width: 240px; }
.emr-two-col { display: grid; grid-template-columns: repeat(2, minmax(260px, 360px)); gap: 14px 32px; max-width: 820px; }
.emr-two-col label, .delivery-form label { display: grid; gap: 6px; }
.readonly-line { min-height: 32px; display: grid; grid-template-columns: 76px 1fr; align-items: center; color: #44566c; }
.readonly-line strong { color: #1f344d; }
.readonly-field-line { min-height: 32px; display: flex; align-items: center; gap: 8px; color: #44566c; }
.readonly-field-line strong { color: #1f344d; }
.emr-textarea { margin-top: 16px; display: grid; gap: 8px; max-width: 820px; }
.emr-textarea :deep(.el-textarea) { width: 100%; }
.emr-textarea :deep(.el-textarea__inner) { min-height: 108px !important; }
.rescue-time-fields { grid-template-columns: repeat(2, minmax(360px, 420px)); max-width: 900px; }
.rescue-time-fields :deep(.is-disabled .el-input__wrapper) { background: #f3f6f9; }
.rescue-flow { display: flex; align-items: flex-start; gap: 64px; margin-top: 16px; }
.rescue-flow-group { display: grid; gap: 10px; }
.rescue-flow-group h3 { margin: 0; color: #18324d; font-size: 13px; font-weight: 700; line-height: 1.4; text-align: right; }
.rescue-flow-group:first-child h3 { width: 132px; }
.rescue-flow-group:last-child h3 { width: 92px; }
.rescue-flow-field { display: grid; grid-template-columns: 92px 118px 24px; gap: 8px; align-items: center; width: max-content; color: #44566c; font-size: 13px; white-space: nowrap; }
.rescue-input-field { grid-template-columns: 132px 118px 24px; }
.rescue-flow-field span { text-align: right; }
.rescue-flow-field em { color: #52657a; font-style: normal; }
.rescue-flow-field :deep(.el-input) { width: 118px; }
.vital-emphasis { background: #fbfdff; border-color: #cfe1f7; }
.vital-consciousness { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 34px; margin-bottom: 16px; }
.emr-form .vital-consciousness > label { display: grid; grid-template-columns: 72px 160px; gap: 8px; align-items: center; text-align: right; }
.vital-consciousness :deep(.el-input) { width: 160px; }
.intubation-field { display: inline-grid; grid-template-columns: 98px max-content; gap: 6px; align-items: center; white-space: nowrap; }
.intubation-field span { text-align: right; }
.vital-consciousness .intubation-field :deep(.el-radio-group) { display: inline-flex; flex-wrap: nowrap; gap: 10px; }
.vital-consciousness :deep(.el-radio) { margin-right: 0; }
.vital-metrics { display: grid; grid-template-columns: repeat(3, 190px); gap: 14px 34px; max-width: 640px; }
.emr-form .vital-metrics label { display: grid; grid-template-columns: 72px 118px; gap: 8px; align-items: center; }
.vital-metrics label { text-align: right; }
.vital-metrics :deep(.el-input) { width: 118px; }
.gas-grid { display: grid; grid-template-columns: repeat(2, 230px); gap: 14px 46px; width: fit-content; }
.emr-form .gas-grid label { display: grid; grid-template-columns: 64px 150px; gap: 8px; align-items: center; text-align: right; }
.gas-grid :deep(.el-input) { width: 150px; }
.delivery-form { grid-template-columns: repeat(2, 260px); }
.delivery-form :deep(.el-radio-group) { width: 220px; }
.document-groups { max-width: 980px; }
.doc-subsection { padding: 4px 0 16px; border-bottom: 1px solid #edf2f7; }
.doc-subsection + .doc-subsection { padding-top: 16px; }
.doc-subsection:last-child { padding-bottom: 0; border-bottom: none; }
.doc-subsection h3 { margin: 0 0 12px; color: #18324d; font-size: 14px; font-weight: 700; }
.special-situation-fields { display: flex; flex-wrap: wrap; gap: 12px 34px; margin-bottom: 12px; }
.special-situation-fields label { display: flex; align-items: center; gap: 8px; color: #44566c; white-space: nowrap; }
.special-situation-fields :deep(.el-input) { width: 320px; }
.special-situation-fields :deep(.el-radio-group) { display: inline-flex; flex-wrap: nowrap; gap: 12px; }
.special-situation-fields :deep(.el-radio) { margin-right: 0; }
.inline-checks { display: flex; flex-wrap: wrap; gap: 10px 24px; max-width: 760px; }
.inline-checks :deep(.el-checkbox) { margin-right: 0; }
.inline-extra { margin-top: 12px; display: flex; align-items: center; gap: 8px; color: #44566c; }
.inline-extra :deep(.el-input) { width: 320px; }
.treatment-list { display: grid; gap: 10px; max-width: 760px; }
.treatment-item { min-height: 32px; display: flex; align-items: center; gap: 16px; }
.treatment-item :deep(.el-checkbox) { width: 128px; margin-right: 0; }
.treatment-item label { display: flex; align-items: center; gap: 8px; color: #44566c; white-space: nowrap; }
.treatment-item :deep(.el-input) { width: 260px; }
.treatment-extra { display: flex; align-items: center; flex-wrap: wrap; gap: 12px 18px; }
.treatment-extra label { display: flex; align-items: center; gap: 8px; color: #44566c; white-space: nowrap; }
.treatment-extra :deep(.el-input) { width: 96px; }
.treatment-extra label:last-child :deep(.el-input) { width: 180px; }
.obstetric-treatment-list .treatment-item :deep(.el-checkbox) { width: 190px; }
.obstetric-treatment-list .treatment-extra label:first-child :deep(.el-input) { width: 180px; }
.obstetric-treatment-list .treatment-extra label:last-child :deep(.el-input) { width: 96px; }
.handover-group { margin-top: 14px; padding-top: 14px; border-top: 1px solid #edf2f7; }
.handover-group h4 { margin: 0 0 10px; color: #18324d; font-size: 14px; font-weight: 700; }
.delivery-line-form { display: flex; flex-wrap: wrap; gap: 14px 30px; max-width: 1120px; }
.delivery-line-form > label { display: grid; grid-template-columns: 150px 220px; gap: 8px; align-items: center; color: #44566c; text-align: right; white-space: nowrap; }
.delivery-line-form :deep(.el-input), .delivery-line-form :deep(.el-date-editor.el-input) { width: 220px; }
.delivery-line-form :deep(.el-radio-group) { display: inline-flex; flex-wrap: nowrap; gap: 12px; }
.delivery-line-form :deep(.el-radio) { margin-right: 0; }
.referral-basic-form .region-field :deep(.el-form-item__content) { display: flex; align-items: center; gap: 6px; width: auto; flex: none; }
.referral-basic-form .region-field :deep(.el-cascader) { width: 520px !important; }
.referral-basic-form .region-field :deep(.el-cascader .el-input) { width: 100% !important; }
.referral-basic-form .address-field :deep(.el-input) { width: 340px !important; }
.hepatitis-form .compact-radio-group { display: inline-flex; align-items: center; flex-wrap: nowrap; gap: 18px; justify-self: start; width: auto; }
.hepatitis-form .compact-radio-group :deep(.el-radio) { width: auto; margin-right: 0; display: inline-flex; align-items: center; gap: 4px; }
.hepatitis-form .compact-radio-group :deep(.el-radio__label) { padding-left: 4px; line-height: 1; }
.hepatitis-review-table :deep(.el-input), .hepatitis-review-table :deep(.el-date-editor.el-input) { width: 100% !important; max-width: none !important; }
.hepatitis-review-table :deep(.el-input__wrapper) { width: 100%; box-sizing: border-box; }
.antiviral-table :deep(.el-input) { width: 100% !important; }
.syphilis-document-panel { min-height: 0; flex: 1; padding: 16px 18px; overflow-y: auto; overflow-x: hidden; background: #edf1f5; }
.syphilis-section { width: min(100%, 1120px); min-width: 0; box-sizing: border-box; }
.syphilis-form label { color: #44566c; font-size: 13px; }
.syphilis-field-grid { margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px; max-width: 940px; }
.syphilis-field-grid label, .syphilis-field-row { display: grid; grid-template-columns: 190px minmax(0, 240px); gap: 8px; align-items: center; color: #44566c; font-size: 13px; text-align: right; white-space: nowrap; }
.syphilis-field-grid :deep(.el-input), .syphilis-field-grid :deep(.el-date-editor.el-input), .syphilis-field-row :deep(.el-input) { width: 100%; max-width: 240px; }
.syphilis-readonly-table { width: 460px; }
.syphilis-choice-line { margin-top: 14px; display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 8px; align-items: center; max-width: 940px; color: #44566c; font-size: 13px; }
.syphilis-choice-line:first-child { margin-top: 0; }
.syphilis-choice-line > span { line-height: 32px; text-align: right; white-space: nowrap; }
.syphilis-choice-options { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 18px; min-height: 32px; }
.syphilis-other-input { width: 240px !important; max-width: 240px !important; flex: 0 0 240px; }
.syphilis-yes-no-grid { margin-top: 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px; max-width: 940px; }
.syphilis-yes-no-grid.single-row { grid-template-columns: minmax(0, 1fr); }
.syphilis-yes-no-row { display: grid; grid-template-columns: 190px max-content; gap: 8px; align-items: center; min-height: 32px; }
.syphilis-yes-no-row.right-baseline-row { grid-template-columns: 240px max-content; transform: translateX(-50px); }
.syphilis-yes-no-row.long-label-row { grid-template-columns: 240px max-content; transform: translateX(-50px); }
.syphilis-yes-no-row.followup-guide-row { grid-template-columns: 190px max-content; }
.syphilis-yes-no-label { color: #44566c; font-size: 13px; line-height: 32px; text-align: right; white-space: nowrap; }
.syphilis-follow-line { margin-top: 18px; display: grid; grid-template-columns: 230px max-content; gap: 8px; align-items: center; max-width: 940px; color: #34465c; font-size: 13px; }
.syphilis-follow-line.source-line { grid-template-columns: 190px max-content; }
.syphilis-follow-label { color: #44566c; font-weight: 400; line-height: 32px; text-align: right; white-space: nowrap; }
.syphilis-follow-options { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 12px 24px; min-height: 32px; }
.syphilis-form .compact-radio-group, .syphilis-form .compact-check-group { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 10px 18px; justify-self: start; width: auto; }
.syphilis-form .compact-radio-group :deep(.el-radio), .syphilis-form .compact-check-group :deep(.el-checkbox), .syphilis-follow-line :deep(.el-checkbox) { width: auto; margin-right: 0; display: inline-flex; align-items: center; gap: 4px; }
.syphilis-form .compact-radio-group :deep(.el-radio__label), .syphilis-form .compact-check-group :deep(.el-checkbox__label) { padding-left: 4px; line-height: 1; }
.syphilis-title-main { display: flex; align-items: center; gap: 12px; min-width: 0; }
.syphilis-monitor-title-line .syphilis-title-main h2 { margin: 0; line-height: 22px; }
.syphilis-monitor-title-line .section-title-note { line-height: 18px; }
.syphilis-review-table { width: 100%; max-width: 940px; font-size: 13px; }
.syphilis-review-table :deep(.el-table__header th) { padding: 6px 0; background: #f8fafc; color: #516176; font-weight: 600; }
.syphilis-review-table :deep(.el-table__cell) { padding: 5px 0; }
.syphilis-review-table :deep(.cell) { padding: 0 6px; line-height: 20px; }
.syphilis-review-table :deep(.el-input), .syphilis-review-table :deep(.el-date-editor.el-input) { width: 100% !important; max-width: none !important; }
.syphilis-review-table :deep(.el-input__wrapper) { width: 100%; box-sizing: border-box; }
</style>


















