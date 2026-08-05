<script setup>
import { computed, reactive, ref } from 'vue'
import { ArrowLeft, Delete, Download, EditPen, Plus, Printer, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const currentMother = reactive({ name: '王某某', age: '31岁', gestationalWeek: '35+2周', idCard: '110101199503081234', medicalNo: 'M20260805001' })
const activeTab = ref('basic')
const mode = ref('list')
const selectedId = ref(null)
const records = ref(createMockRecords())
const formModel = reactive(createEmptyReferral())
const readOnly = computed(() => mode.value === 'view')
const drawerVisible = computed({ get: () => mode.value !== 'list', set: (value) => { if (!value) mode.value = 'list' } })

const hospitalOptions = ['XX妇幼保健院', '北京市危重孕产妇救治中心', '朝阳区妇幼保健院', '通州区妇幼保健院', '北京大学人民医院', '首都医科大学附属北京妇产医院']
const regionOptions = [
  { value: '北京市', label: '北京市', children: [{ value: '北京市', label: '北京市', children: [{ value: '朝阳区', label: '朝阳区', children: [{ value: '妇幼街道', label: '妇幼街道' }, { value: '建国门街道', label: '建国门街道' }] }, { value: '通州区', label: '通州区', children: [{ value: '新华街道', label: '新华街道' }] }, { value: '密云区', label: '密云区', children: [{ value: '鼓楼街道', label: '鼓楼街道' }] }] }] },
]
const rescueInputFields = [
  { label: '晶体', key: 'crystal' },
  { label: '胶体', key: 'colloid' },
  { label: '血制品', key: 'bloodProduct' },
]
const rescueOutputFields = [
  { label: '总出量', key: 'total' },
  { label: '阴道出血量', key: 'vaginalBleeding' },
  { label: '尿量', key: 'urine' },
  { label: '盆腔引流量', key: 'pelvicDrainage' },
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
const specialChecks = ['心彩超', '腹部超声', 'MRI', '其他']
const drugTreatments = ['地塞米松', '硫酸镁', '口服降压药', '静脉降压药', '抗生素', '宫缩抑制剂', '血管活性药物', '其他']
const operationTreatments = ['宫腔球囊', '会阴III-IV度裂伤修合', '阴道壁血肿切开缝合', '子宫B-Lynch缝合', '子宫动脉上下行支结扎', '宫腔填纱', '子宫切除', '其他']
const prepOptions = ['交通工具', '监测设备', '护送人员', '吸氧设备', '抢救药物', '抢救设备']

function createEmptyReferral() {
  return {
    applicationNo: '', medicalNo: currentMother.medicalNo, motherName: currentMother.name, age: currentMother.age, gestationalWeek: currentMother.gestationalWeek, husbandName: '', province: '', city: '', district: '', street: '', accountRegion: [], addressRegion: [], detailAddress: '', address: '', mobile: '', homePhone: '', diagnosis: '', toHospital: '', fromHospital: '', applyDoctor: '', applyTime: '', status: '草稿',
    critical: { patientName: currentMother.name, age: currentMother.age, applyHospital: '', referralHospital: '', dateTime: '', reasonDiagnosis: '', rescueStart: '', rescueDuration: '', input: { crystal: '', colloid: '', bloodProduct: '' }, output: { total: '', vaginalBleeding: '', urine: '', pelvicDrainage: '', other: '' }, intubation: '否', vital: { consciousness: '', rr: '', hr: '', spo2: '', bp: '', shockIndex: '', temperature: '', other: '' }, bloodGas: { ph: '', po2: '', pco2: '', hco3: '', lactate: '', be: '' }, lab: { myocardialEnzyme: '', liverKidney: '', other: '' }, pregnancyComplications: [], specialChecks: [], delivery: { fetalDeliveryTime: '', deliveryMethod: '自然分娩', fetalWeight: '', apgar: '', placentaDeliveryTime: '', placentaComplete: '是', placentaDeliveryMethod: '', placentaCordAbnormal: '' }, drugTreatments: [], operationTreatments: [] },
    assessment: { beforeReason: '病情', beforeReasonOther: '', decisionMaker: '值班三线', decisionMakerOther: '', preparation: ['交通工具', '监测设备', '护送人员', '吸氧设备', '抢救药物'], before: { distance: '', vitalSigns: '', consciousness: '', peripheralVein: '', contactPhone: '', receptionLocation: '' }, duringTransport: '急救车', during: { consciousness: '', vitalSigns: '', bleeding: '', special: '', input: '', output: '', rescueProcess: '' }, after: { smooth: '是', trafficSmooth: '是', vehicleAvailable: '是', hospitalContactEasy: '是', locationClear: '是', staffCommunicationEasy: '是', specialProblem: '' }, specialRescueRecord: '', perinatalSpecial: '', referralTime: '', leaveTime: '', arriveTime: '', escortStaff: '', contact: '', medicalOffice: '', ward: '', attendingDoctor: '' },
  }
}
function createDemoReferral() {
  const data = createEmptyReferral()
  Object.assign(data, { applicationNo: 'ZZ20260805001', husbandName: '李某某', province: '北京市', city: '北京市', district: '朝阳区', street: '妇幼街道', accountRegion: ['北京市', '北京市', '朝阳区', '妇幼街道'], addressRegion: ['北京市', '北京市', '朝阳区', '妇幼街道'], detailAddress: '示范路 18 号', address: '北京市朝阳区示范路 18 号', mobile: '13800000000', homePhone: '010-88886666', diagnosis: '妊娠期高血压疾病', toHospital: '北京市危重孕产妇救治中心', fromHospital: 'XX妇幼保健院', applyDoctor: '张医生', applyTime: '2026-08-05 09:20', status: '草稿' })
  Object.assign(data.critical, { applyHospital: data.fromHospital, referralHospital: data.toHospital, dateTime: data.applyTime, reasonDiagnosis: data.diagnosis, rescueStart: '2026-08-05 08:40', rescueDuration: '40分钟', intubation: '否', pregnancyComplications: ['高血压危象'], specialChecks: ['心彩超'], drugTreatments: ['硫酸镁', '静脉降压药'], operationTreatments: [] })
  Object.assign(data.critical.input, { crystal: '500ml', colloid: '0ml', bloodProduct: '0ml' })
  Object.assign(data.critical.output, { total: '300ml', vaginalBleeding: '50ml', urine: '250ml' })
  Object.assign(data.critical.vital, { consciousness: '清醒', rr: '20次/分', hr: '96次/分', spo2: '98%', bp: '158/102mmHg', shockIndex: '0.8', temperature: '36.8℃' })
  Object.assign(data.critical.bloodGas, { ph: '7.39', po2: '92mmHg', pco2: '36mmHg', hco3: '22mmol/L', lactate: '1.6mmol/L', be: '-2' })
  Object.assign(data.critical.lab, { myocardialEnzyme: '未见明显异常', liverKidney: '肝肾功能待复查', other: '尿蛋白阳性' })
  Object.assign(data.assessment.before, { distance: '12公里', vitalSigns: '血压偏高，氧饱和度稳定', consciousness: '清醒', peripheralVein: '已建立静脉通道', contactPhone: '010-66668888', receptionLocation: '急诊产科抢救室' })
  Object.assign(data.assessment.during, { consciousness: '清醒', vitalSigns: '途中生命体征平稳', bleeding: '少量', special: '持续心电监护', input: '晶体液 300ml', output: '尿量 100ml', rescueProcess: '途中继续降压、吸氧及胎心监护。' })
  Object.assign(data.assessment, { referralTime: '2026-08-05 09:20', leaveTime: '2026-08-05 09:35', arriveTime: '2026-08-05 10:05', escortStaff: '刘医生、赵护士', contact: '13900001111', medicalOffice: '医务处王老师', ward: '产科二病区', attendingDoctor: '张医生' })
  return data
}
function createMockRecords() {
  const base = createDemoReferral()
  const rows = [
    { applicationNo: 'ZZ20260805001', motherName: '王某某', age: '31岁', gestationalWeek: '35+2周', diagnosis: '妊娠期高血压疾病', fromHospital: 'XX妇幼保健院', toHospital: '北京市危重孕产妇救治中心', applyTime: '2026-08-05 09:20', status: '草稿' },
    { applicationNo: 'ZZ20260805002', motherName: '李某某', age: '29岁', gestationalWeek: '33+6周', diagnosis: '前置胎盘伴出血', fromHospital: '朝阳区妇幼保健院', toHospital: '北京市危重孕产妇救治中心', applyTime: '2026-08-04 16:35', status: '已提交' },
    { applicationNo: 'ZZ20260805003', motherName: '赵某某', age: '34岁', gestationalWeek: '37+1周', diagnosis: '产后出血', fromHospital: '通州区妇幼保健院', toHospital: '北京大学人民医院', applyTime: '2026-08-03 21:10', status: '转诊中' },
    { applicationNo: 'ZZ20260805004', motherName: '陈某某', age: '27岁', gestationalWeek: '30+4周', diagnosis: '重度子痫前期', fromHospital: '密云区医院', toHospital: '首都医科大学附属北京妇产医院', applyTime: '2026-08-02 11:45', status: '已完成' },
    { applicationNo: 'ZZ20260805005', motherName: '刘某某', age: '32岁', gestationalWeek: '28+5周', diagnosis: '妊娠合并心功能不全', fromHospital: '顺义区妇幼保健院', toHospital: '北京市危重孕产妇救治中心', applyTime: '2026-08-01 14:25', status: '已取消' },
  ]
  return rows.map((row, index) => ({ ...clone(base), ...row, id: index + 1, critical: { ...clone(base.critical), patientName: row.motherName, age: row.age, applyHospital: row.fromHospital, referralHospital: row.toHospital, dateTime: row.applyTime, reasonDiagnosis: row.diagnosis } }))
}
function clone(data) { return JSON.parse(JSON.stringify(data)) }
function openRecord(row, nextMode) { selectedId.value = row.id; Object.assign(formModel, clone(row)); mode.value = nextMode; activeTab.value = 'basic' }
function showDetail(row) { openRecord(row, 'view') }
function editForm(row) { openRecord(row, 'edit') }
function createForm() { selectedId.value = null; Object.assign(formModel, createEmptyReferral(), { applicationNo: `ZZ${Date.now().toString().slice(-10)}`, applyTime: '2026-08-05 11:30', fromHospital: 'XX妇幼保健院', toHospital: '北京市危重孕产妇救治中心', diagnosis: '妊娠期高血压疾病' }); mode.value = 'create'; activeTab.value = 'basic' }
function saveDraft() { formModel.status = '草稿'; upsertRecord(); mode.value = 'list'; ElMessage.success('已保存草稿') }
function submitForm() { formModel.status = '已提交'; upsertRecord(); mode.value = 'list'; ElMessage.success('申请单已提交') }
function upsertRecord() { const data = clone(formModel); const index = records.value.findIndex((item) => item.id === selectedId.value); if (index >= 0) records.value[index] = data; else records.value.unshift({ ...data, id: Date.now() }) }
async function deleteForm(row) { await ElMessageBox.confirm(`确认删除申请编号 ${row.applicationNo} 吗？`, '删除确认', { type: 'warning' }); records.value = records.value.filter((item) => item.id !== row.id); ElMessage.success('已删除申请单') }
function printRecord(row) { ElMessage.success(`已触发打印：${row.applicationNo}`) }
function exportRecord(row) { ElMessage.success(`已触发导出：${row.applicationNo}`) }
function statusType(status) { return { 草稿: 'warning', 已提交: 'primary', 转诊中: 'primary', 已完成: 'success', 已取消: 'info' }[status] || 'info' }
</script>

<template>
  <div class="referral-page">
    <header class="system-header">
      <div class="brand"><img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" /></div>
      <DemoPageNavigation />
      <div class="header-meta">转会诊申请单管理 ｜ 操作员：产科医师</div>
    </header>
    <main class="page-main">
      <section class="page-heading">
        <div class="heading-left"><el-button text :icon="ArrowLeft" @click="router.push('/')">返回</el-button><span class="heading-divider"></span><el-breadcrumb separator="/"><el-breadcrumb-item>孕产保健系统</el-breadcrumb-item><el-breadcrumb-item>危重孕产妇转会诊申请单</el-breadcrumb-item></el-breadcrumb></div>
      </section>
      <section v-if="mode === 'list'" class="list-panel">
        <div class="list-title"><div><h1>危重孕产妇转会诊申请单</h1><p>管理与孕产妇关联的危重转会诊申请，支持进入完整北京市危重孕产妇转会诊申请单。</p></div><el-button type="primary" :icon="Plus" @click="createForm">新增申请</el-button></div>
        <el-table :data="records" border class="application-table">
          <el-table-column type="index" label="序号" width="64" align="center" />
          <el-table-column prop="applicationNo" label="申请编号" width="150" />
          <el-table-column prop="motherName" label="孕产妇姓名" width="120" />
          <el-table-column prop="age" label="年龄" width="86" />
          <el-table-column prop="gestationalWeek" label="孕周" width="100" />
          <el-table-column prop="diagnosis" label="诊断" min-width="170" show-overflow-tooltip />
          <el-table-column prop="fromHospital" label="转出医院" min-width="170" show-overflow-tooltip />
          <el-table-column prop="toHospital" label="转入医院" min-width="190" show-overflow-tooltip />
          <el-table-column prop="applyTime" label="申请时间" width="150" />
          <el-table-column label="状态" width="96" align="center"><template #default="{ row }"><el-tag :type="statusType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column>
          <el-table-column label="操作" width="250" fixed="right"><template #default="{ row }"><el-button link type="primary" :icon="View" @click="showDetail(row)">查看</el-button><el-button link type="primary" :icon="EditPen" @click="editForm(row)">编辑</el-button><el-button link type="primary" :icon="Printer" @click="printRecord(row)">打印</el-button><el-button link type="primary" :icon="Download" @click="exportRecord(row)">导出</el-button><el-button link type="danger" :icon="Delete" @click="deleteForm(row)">删除</el-button></template></el-table-column>
        </el-table>
      </section>
      <el-drawer v-model="drawerVisible" direction="rtl" size="92%" :with-header="false" class="referral-drawer" destroy-on-close>
        <section class="form-shell" :class="{ 'document-mode': readOnly }">
          <div class="drawer-head">
            <div class="drawer-context">孕产保健系统 / 危重孕产妇转会诊申请单</div>
            <div class="form-title"><div><h1><span v-if="mode === 'create'" class="title-action">新增</span><strong>危重孕产妇转会诊申请单</strong></h1></div><el-tag :type="statusType(formModel.status)" effect="plain">{{ formModel.status }}</el-tag></div>
            <div class="drawer-mother-line"><span>当前孕妇：</span><strong>{{ formModel.motherName }}</strong><i>|</i><span>年龄：{{ formModel.age }}</span><i>|</i><span>孕周：{{ formModel.gestationalWeek }}</span></div>
          </div>
        <el-tabs v-model="activeTab" class="paper-tabs">
          <el-tab-pane label="转会诊申请单" name="basic">
            <div class="paper-section basic-paper"><el-form class="inline-medical-form referral-basic-form" label-position="left" :disabled="readOnly" label-width="112px"><div class="form-row identity-row"><el-form-item label="编号" class="readonly-field w-code"><el-input v-model="formModel.applicationNo" disabled /></el-form-item><el-form-item label="病历号" class="readonly-field w-medical"><el-input v-model="formModel.medicalNo" disabled /></el-form-item><el-form-item label="孕产妇姓名" class="readonly-field w-name"><el-input v-model="formModel.motherName" disabled /></el-form-item><el-form-item label="丈夫姓名" class="w-name"><el-input v-model="formModel.husbandName" /></el-form-item></div><div class="form-row full-row"><el-form-item label="户口所在地" class="region-field"><el-cascader v-model="formModel.accountRegion" :options="regionOptions" clearable /></el-form-item></div><div class="form-row full-row"><el-form-item label="现住址" class="region-field address-field"><el-cascader v-model="formModel.addressRegion" :options="regionOptions" clearable /><el-input v-model="formModel.detailAddress" placeholder="详细地址" /></el-form-item></div><div class="form-row"><el-form-item label="移动电话" class="w-phone"><el-input v-model="formModel.mobile" /></el-form-item><el-form-item label="家庭/单位电话" class="w-phone"><el-input v-model="formModel.homePhone" /></el-form-item></div><div class="form-row full-row"><el-form-item label="诊断" class="long-field"><el-input v-model="formModel.diagnosis" type="textarea" :rows="2" /></el-form-item></div><div class="form-row full-row"><el-form-item label="转往医院" class="single-wide"><el-select v-model="formModel.toHospital" filterable><el-option v-for="item in hospitalOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item></div><div class="form-row full-row"><el-form-item label="申请单位" class="single-wide"><el-input v-model="formModel.fromHospital" /></el-form-item></div><div class="form-row full-row"><el-form-item label="申请医生" class="single-narrow"><el-input v-model="formModel.applyDoctor" /></el-form-item></div><div class="form-row full-row"><el-form-item label="申请时间" class="single-time"><el-input v-model="formModel.applyTime" placeholder="YYYY-MM-DD HH:mm" /></el-form-item></div></el-form></div>
          </el-tab-pane>
          <el-tab-pane label="危重孕产妇转会诊申请单" name="critical">
            <div class="paper-section critical-paper"><h2>一、患者基础信息</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="96px"><div class="form-row compact-row"><el-form-item label="姓名" class="w-name"><el-input v-model="formModel.critical.patientName" /></el-form-item><el-form-item label="年龄" class="w-age"><el-input v-model="formModel.critical.age" /></el-form-item><el-form-item label="申请医院" class="w-hospital"><el-input v-model="formModel.critical.applyHospital" /></el-form-item><el-form-item label="转入医院" class="w-hospital"><el-input v-model="formModel.critical.referralHospital" /></el-form-item><el-form-item label="日期时间" class="critical-datetime"><el-date-picker v-model="formModel.critical.dateTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item></div><div class="stacked-field"><span>转会诊原因及诊断：</span><el-input v-model="formModel.critical.reasonDiagnosis" type="textarea" :rows="3" /></div></el-form></div>
            <div class="paper-section critical-paper"><h2>二、抢救过程</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="96px"><div class="form-row compact-row"><el-form-item label="开始时间" class="critical-datetime"><el-date-picker v-model="formModel.critical.rescueStart" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item><el-form-item label="持续时间" class="w-time"><el-input v-model="formModel.critical.rescueDuration" /></el-form-item></div><div class="subline intake-line"><span>入了</span><el-form-item v-for="item in rescueInputFields" :key="item.key" :label="item.label" class="w-small"><el-input v-model="formModel.critical.input[item.key]" /></el-form-item></div><div class="subline"><span>出量</span><el-form-item v-for="item in rescueOutputFields" :key="item.key" :label="item.label" class="w-small unit-field"><el-input v-model="formModel.critical.output[item.key]"><template #append>ml</template></el-input></el-form-item></div></el-form></div>
            <div class="paper-section critical-paper"><h2>三、转诊生命体征情况（描述最低值）</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="110px"><div class="form-row compact-row"><el-form-item label="是否气管插管" class="w-radio"><el-radio-group v-model="formModel.critical.intubation"><el-radio label="是" /><el-radio label="否" /></el-radio-group></el-form-item><el-form-item v-for="item in vitalFields" :key="item.key" :label="item.label" class="w-small"><el-input v-model="formModel.critical.vital[item.key]" /></el-form-item></div><div class="form-row full-row"><el-form-item label="其他异常情况" class="critical-long"><el-input v-model="formModel.critical.vital.other" type="textarea" :rows="2" /></el-form-item></div></el-form></div>
            <div class="paper-section critical-paper"><h2>四、血气分析</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="72px"><div class="form-row"><el-form-item v-for="item in bloodGasFields" :key="item.key" :label="item.label" class="w-small"><el-input v-model="formModel.critical.bloodGas[item.key]" /></el-form-item></div></el-form></div>
            <div class="paper-section critical-paper"><h2>五、其他异常化验（心肌酶、肝肾功能等）（描述最低值）</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="0px"><div class="stacked-field compact-stack"><el-input v-model="formModel.critical.lab.other" type="textarea" :rows="2" /></div></el-form></div>
            <div class="paper-section critical-paper"><h2>六、妊娠期合并症及并发症</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="140px"><el-form-item label="特色情况"><el-checkbox-group v-model="formModel.critical.pregnancyComplications"><el-checkbox v-for="item in pregnancyComplications" :key="item" :label="item" /></el-checkbox-group></el-form-item><el-form-item label="特殊异常检查"><el-checkbox-group v-model="formModel.critical.specialChecks"><el-checkbox v-for="item in specialChecks" :key="item" :label="item" /></el-checkbox-group></el-form-item><el-form-item label="特殊治疗"><el-checkbox-group v-model="formModel.critical.drugTreatments"><el-checkbox v-for="item in drugTreatments" :key="item" :label="item" /></el-checkbox-group></el-form-item></el-form></div>
            <div class="paper-section critical-paper"><h2>七、分娩期并发症</h2><el-form class="inline-medical-form critical-form" label-position="left" :disabled="readOnly" label-width="120px"><div class="form-row compact-row"><el-form-item label="胎儿分娩时间" class="critical-datetime"><el-date-picker v-model="formModel.critical.delivery.fetalDeliveryTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item><el-form-item label="分娩方式" class="w-delivery"><el-radio-group v-model="formModel.critical.delivery.deliveryMethod"><el-radio-button label="自然分娩" /><el-radio-button label="产钳/胎吸" /><el-radio-button label="剖宫产" /></el-radio-group></el-form-item><el-form-item label="胎儿体重" class="w-small"><el-input v-model="formModel.critical.delivery.fetalWeight" /></el-form-item><el-form-item label="Apgar评分" class="w-small"><el-input v-model="formModel.critical.delivery.apgar" /></el-form-item></div><div class="form-row compact-row"><el-form-item label="胎盘娩出时间" class="critical-datetime"><el-date-picker v-model="formModel.critical.delivery.placentaDeliveryTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" /></el-form-item><el-form-item label="胎盘是否完整" class="w-radio"><el-radio-group v-model="formModel.critical.delivery.placentaComplete"><el-radio label="是" /><el-radio label="否" /></el-radio-group></el-form-item><el-form-item label="胎盘娩出方式" class="w-time"><el-input v-model="formModel.critical.delivery.placentaDeliveryMethod" /></el-form-item></div><div class="form-row full-row"><el-form-item label="胎盘/脐带异常情况" class="critical-long"><el-input v-model="formModel.critical.delivery.placentaCordAbnormal" type="textarea" :rows="2" /></el-form-item></div><el-form-item label="特殊治疗"><el-checkbox-group v-model="formModel.critical.operationTreatments"><el-checkbox v-for="item in operationTreatments" :key="item" :label="item" /></el-checkbox-group></el-form-item></el-form></div>
          </el-tab-pane>
          <el-tab-pane label="转诊评估表" name="assessment">
            <div class="paper-section"><h2>转诊前</h2><el-form class="paper-grid inline-medical-form" label-position="left" :disabled="readOnly" label-width="86px"><el-form-item label="转诊原因"><el-radio-group v-model="formModel.assessment.beforeReason"><el-radio-button label="病情" /><el-radio-button label="患者要求" /><el-radio-button label="其他" /></el-radio-group></el-form-item><el-form-item label="其他原因"><el-input v-model="formModel.assessment.beforeReasonOther" /></el-form-item><el-form-item label="转诊决策者"><el-radio-group v-model="formModel.assessment.decisionMaker"><el-radio-button label="科室行政主任" /><el-radio-button label="值班三线" /><el-radio-button label="二线/一线" /><el-radio-button label="其他" /></el-radio-group></el-form-item><el-form-item label="其他决策者"><el-input v-model="formModel.assessment.decisionMakerOther" /></el-form-item><el-form-item label="转诊前准备" class="full"><el-checkbox-group v-model="formModel.assessment.preparation"><el-checkbox v-for="item in prepOptions" :key="item" :label="item" /></el-checkbox-group></el-form-item><el-form-item label="转诊距离"><el-input v-model="formModel.assessment.before.distance" /></el-form-item><el-form-item label="生命体征"><el-input v-model="formModel.assessment.before.vitalSigns" /></el-form-item><el-form-item label="意识状态"><el-input v-model="formModel.assessment.before.consciousness" /></el-form-item><el-form-item label="外周静脉"><el-input v-model="formModel.assessment.before.peripheralVein" /></el-form-item><el-form-item label="接诊医院联系人电话"><el-input v-model="formModel.assessment.before.contactPhone" /></el-form-item><el-form-item label="接诊医院接诊位置"><el-input v-model="formModel.assessment.before.receptionLocation" /></el-form-item></el-form></div>
            <div class="paper-section"><h2>转诊中</h2><el-form class="paper-grid inline-medical-form" label-position="left" :disabled="readOnly" label-width="86px"><el-form-item label="交通工具"><el-radio-group v-model="formModel.assessment.duringTransport"><el-radio-button label="急救车" /><el-radio-button label="私家车" /></el-radio-group></el-form-item><el-form-item label="意识"><el-input v-model="formModel.assessment.during.consciousness" /></el-form-item><el-form-item label="生命体征"><el-input v-model="formModel.assessment.during.vitalSigns" /></el-form-item><el-form-item label="出血量"><el-input v-model="formModel.assessment.during.bleeding" /></el-form-item><el-form-item label="特殊情况"><el-input v-model="formModel.assessment.during.special" /></el-form-item><el-form-item label="入量"><el-input v-model="formModel.assessment.during.input" /></el-form-item><el-form-item label="出量"><el-input v-model="formModel.assessment.during.output" /></el-form-item><el-form-item label="抢救过程" class="full"><el-input v-model="formModel.assessment.during.rescueProcess" type="textarea" :rows="3" /></el-form-item></el-form></div>
            <div class="paper-section"><h2>转诊后</h2><el-form class="paper-grid inline-medical-form" label-position="left" :disabled="readOnly" label-width="86px"><el-form-item v-for="item in [{label:'转诊过程顺利',key:'smooth'},{label:'交通顺畅',key:'trafficSmooth'},{label:'交通工具易获得',key:'vehicleAvailable'},{label:'接诊医院便于联系',key:'hospitalContactEasy'},{label:'接诊位置明确',key:'locationClear'},{label:'医务人员易沟通',key:'staffCommunicationEasy'}]" :key="item.key" :label="item.label"><el-radio-group v-model="formModel.assessment.after[item.key]"><el-radio-button label="是" /><el-radio-button label="否" /></el-radio-group></el-form-item><el-form-item label="特殊问题" class="full"><el-input v-model="formModel.assessment.after.specialProblem" type="textarea" :rows="2" /></el-form-item><el-form-item label="抢救过程特殊情况记录" class="full"><el-input v-model="formModel.assessment.specialRescueRecord" type="textarea" :rows="2" /></el-form-item><el-form-item label="围产期特殊情况" class="full"><el-input v-model="formModel.assessment.perinatalSpecial" type="textarea" :rows="2" /></el-form-item><el-form-item label="转诊时间"><el-input v-model="formModel.assessment.referralTime" /></el-form-item><el-form-item label="离开时间"><el-input v-model="formModel.assessment.leaveTime" /></el-form-item><el-form-item label="到达转诊医院时间"><el-input v-model="formModel.assessment.arriveTime" /></el-form-item><el-form-item label="送诊医务人员"><el-input v-model="formModel.assessment.escortStaff" /></el-form-item><el-form-item label="联系方式"><el-input v-model="formModel.assessment.contact" /></el-form-item><el-form-item label="医务处"><el-input v-model="formModel.assessment.medicalOffice" /></el-form-item><el-form-item label="病房"><el-input v-model="formModel.assessment.ward" /></el-form-item><el-form-item label="主管医师"><el-input v-model="formModel.assessment.attendingDoctor" /></el-form-item></el-form></div>
          </el-tab-pane>
        </el-tabs>
          <div class="form-actions drawer-actions"><el-button v-if="readOnly" @click="mode = 'list'">返回列表</el-button><el-button v-if="!readOnly" @click="mode = 'list'">取消</el-button><el-button v-if="!readOnly" @click="saveDraft">保存草稿</el-button><el-button v-if="!readOnly" type="primary" @click="submitForm">提交</el-button></div>
        </section>
      </el-drawer>
    </main>
  </div>
</template>

<style scoped>
.referral-page { min-height: 100vh; color: #303846; background: #edf1f5; }
.page-main { max-width: 1480px; margin: 0 auto; padding: 12px 16px 22px; }
.page-heading, .list-panel, .form-shell { background: #fff; border: 1px solid #d8e0e8; }
.page-heading { height: 50px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; }
.heading-left { display: flex; align-items: center; gap: 10px; }
.heading-divider { width: 1px; height: 18px; background: #d7dee8; }
.page-code { color: #6c7a8d; font-size: 13px; }
.mother-strip { margin-top: 10px; min-height: 58px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.mother-strip div { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }
.mother-strip strong { color: #25364a; font-size: 18px; }
.mother-strip span { color: #657386; }
.empty-state { min-height: 360px; margin-top: 10px; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; }
.empty-state h1 { margin: 0; color: #25364a; font-size: 22px; }
.empty-state p { margin: 0; color: #748296; }
.list-panel { margin-top: 10px; padding: 18px; }
.form-shell { height: 100%; display: flex; flex-direction: column; background: #fff; }
.list-title { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid #e3e9ef; }
.list-title h1 { margin: 0; color: #25364a; font-size: 22px; }
.list-title p { margin: 8px 0 0; color: #6b798c; }
.application-table { margin-top: 14px; }
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
.paper-section { margin-bottom: 10px; padding: 12px; background: #fbfcfe; border: 1px solid #dfe6ed; }
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
.critical-form .form-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0 10px; margin-bottom: 8px; }
.critical-form .compact-row { gap: 0 4px; }
.critical-form .critical-datetime :deep(.el-input) { width: 170px; }
.critical-form .stacked-field { width: 760px; margin-bottom: 8px; }
.critical-form .stacked-field > span { display: block; margin-bottom: 6px; color: #4f5f72; font-size: 13px; text-align: left; }
.critical-form .stacked-field :deep(.el-textarea) { width: 720px; }
.critical-form .compact-stack { width: 720px; }
.critical-form .intake-line > span::after { content: '（晶体、胶体、血制品）：'; }
.critical-form .intake-line > span { width: 168px; }
.critical-form .unit-field :deep(.el-input-group) { width: 126px; }
.critical-form .unit-field :deep(.el-input) { width: 126px; }
.critical-form .unit-field :deep(.el-input-group__append) { padding: 0 8px; }
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
.referral-basic-form .region-field :deep(.el-form-item__content) { display: flex; align-items: center; gap: 6px; width: auto; flex: none; }
.referral-basic-form .region-field :deep(.el-cascader) { width: 520px !important; }
.referral-basic-form .region-field :deep(.el-cascader .el-input) { width: 100% !important; }
.referral-basic-form .address-field :deep(.el-input) { width: 340px !important; }
</style>


















