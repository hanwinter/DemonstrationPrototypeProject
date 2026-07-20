<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowDownBold,
  ArrowLeft,
  ArrowUpBold,
  Bell,
  Calendar,
  Document,
  Download,
  FirstAidKit,
  House,
  Notebook,
  Phone,
  Reading,
  Switch,
  User,
} from '@element-plus/icons-vue'

const router = useRouter()
const lisReportImage = new URL('../../ProjectImage/lis化验单.png', import.meta.url).href
const pacsReportImage = new URL('../../ProjectImage/超声报告单.png', import.meta.url).href
const activeTab = ref('home')
const page = ref('home')
const isLoggedIn = ref(false)
const codeSent = ref(false)
const selectedStudentId = ref(1)
const showBindForm = ref(false)
const studentsBackTarget = ref('home')
const rescreenBackTarget = ref('home')
const questionnairesBackTarget = ref('questionnaires')
const reportsBackTarget = ref('reports')
const showChildSheet = ref(false)
const selectedArticleId = ref(1)
const questionnaireIndex = ref(0)
const submittedQuestionnaire = ref(false)
const selectedSlot = ref('')
const appointmentDone = ref(false)
const activeBannerIndex = ref(0)
const showAllAdvice = ref(false)
const showReportSheet = ref(false)
const showDownloadSheet = ref(false)
const downloadGenerating = ref(false)
const downloadStatus = ref('idle')
const downloadMessage = ref('')
const currentReportId = ref('report-2026-spring')
const onlyAbnormal = ref(false)
const expandedResultGroups = ref(['vision', 'weight', 'oral'])
const activeProjectPanel = ref('flow')
const activeSpecialProjectId = ref('vision')
const showProjectSheet = ref(false)
const activeFlowNode = ref(null)
const activeProjectSubPage = ref('profile')
const projectSubmitMessage = ref('')
const projectArchiveToast = ref('')
const activeProjectQuestionnaireGroup = ref('')
const projectQuestionnaireStatus = ref('editing')
const consentSigned = ref(false)
const consentConfirmed = ref(false)
const projectProfileStatus = ref('saved')
const projectSubPageReturnPanel = ref('flow')
const activeReportDoc = ref(null)
const lisArchiveExpanded = ref(false)
const pacsArchiveExpanded = ref(false)
const specialtyReportExpanded = ref([])
const rehabAppointments = reactive([
  { time: '04月16日 周二 16:30', item: '视觉训练｜李老师', status: '已预约', action: '变更预约' },
  { time: '04月19日 周五 16:30', item: '视觉训练｜李老师', status: '待确认', action: '确认预约' },
])
const reportZoom = ref(1)
const reportImageX = ref(0)
const reportImageY = ref(0)
const reportTouchState = reactive({ mode: '', startX: 0, startY: 0, imageX: 0, imageY: 0, distance: 0, scale: 1 })
let bannerTimer = null

const bannerImages = [
  '/images/banner/banner-1.png',
  '/images/banner/banner-2.png',
  '/images/banner/banner-3.png',
]

const loginForm = reactive({ phone: '13800001234', code: '' })
const bindForm = reactive({ name: '', code: '', cardNo: '', school: '第一实验小学', className: '', phone: '13800001234' })
const bindErrors = reactive({ name: '', identity: '' })
const pendingBindAction = ref('')
const pendingBindMode = ref('')
const pendingBindTarget = ref(null)
const pendingDeleteStudentId = ref(null)
const parentProfile = reactive({ name: '王女士', phone: '138****1234', relation: '母亲' })
const parentProfileSaved = ref(false)
const editingStudentId = ref(null)
const questionnaireAnswers = reactive({})
const baseSignupDone = ref(false)
const selectedPaidProjectIds = ref([])
const activePaidCategory = ref('all')
const paidProjectsExpanded = ref(true)
const paidOrderStatus = ref('none')
const showBaseSignupSuccess = ref(false)
const showPayConfirm = ref(false)
const showPaySuccess = ref(false)
const showRefundConfirm = ref(false)
const showRefundSuccess = ref(false)
const heightWeightResultVisible = ref(false)
const nutritionResultVisible = ref(false)

const students = reactive([
  { id: 1, name: '林一凡', gender: '男', age: 10, school: '北京市某某小学', className: '五年级2班', default: true },
  { id: 2, name: '林小雨', gender: '女', age: 7, school: '第一实验小学', className: '一年级 1 班', default: false },
])
const bindFormDirty = computed(() => [bindForm.name, bindForm.code, bindForm.cardNo, bindForm.school, bindForm.className, bindForm.phone].some((item) => String(item || '').trim()))
const pendingDeleteStudent = computed(() => students.find((item) => item.id === pendingDeleteStudentId.value) || null)

const reports = [
  { id: 1, batch: '2026 年春季五健筛查', date: '2026-04-12', result: '需关注', risk: '中风险', abnormal: 3, status: '已生成' },
  { id: 2, batch: '2025 年秋季五健筛查', date: '2025-10-18', result: '基本正常', risk: '低风险', abnormal: 1, status: '已生成' },
]

const riskLevelMeta = {
  high: { label: '高风险', order: 1 },
  medium: { label: '中风险', order: 2 },
  low: { label: '需关注', order: 3 },
  normal: { label: '正常', order: 4 },
}

const reportCatalog = [
  {
    reportId: 'report-2026-spring',
    name: '2026年春季学生健康筛查',
    date: '2026-05-20',
    institution: '北京市某某妇幼保健院',
    status: '当前报告',
    assessment: { text: '需关注', tone: 'medium', risk: '中风险', rescreen: '建议复筛' },
    healthItems: [
      { code: 'vision', shortName: '眼', navName: '视力', name: '视力健康', status: '高风险', summary: '左眼视力下降', abnormalValues: ['左眼视力下降'], result: '4.6', reference: '≥ 5.0', description: '左眼裸眼视力低于正常参考范围，建议结合医生意见进一步复查。', advice: '建议进一步复查，减少近距离用眼，保持良好用眼习惯。', tone: 'high', color: '#f25565', overlayClass: 'overlay-vision' },
      { code: 'weight', shortName: '体', navName: '体重', name: '体重健康', status: '中风险', summary: 'BMI 偏高', abnormalValues: ['BMI偏高', '腰围偏高', '体脂率偏高'], result: 'BMI：23.8；腰围：72cm；体脂率：偏高', reference: 'BMI：P85-P95；腰围：参考同年龄同性别标准；体脂率：参考同年龄同性别标准', description: 'BMI 处于偏高区间，同时腰围和体脂率提示体重管理需要关注。', advice: '控制含糖饮料和高热量零食，增加中等强度运动。', tone: 'medium', color: '#ff9442', overlayClass: 'overlay-weight' },
      { code: 'spine', shortName: '脊', navName: '脊柱', name: '脊柱健康', status: '正常', summary: '未见明显异常', abnormalValues: ['未见明显异常'], result: '未见明显异常', reference: '姿态对称', description: '本次脊柱筛查未见明显异常。', advice: '继续关注坐姿与书包重量，保持规律运动。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-spine' },
      { code: 'oral', shortName: '齿', navName: '口腔', name: '口腔健康', status: '需关注', summary: '龋齿', abnormalValues: ['龋齿'], result: '2颗', reference: '0颗', description: '本次口腔筛查发现龋齿，建议关注口腔清洁并进行口腔检查。', advice: '加强早晚刷牙和餐后漱口，建议到口腔科进一步检查。', tone: 'low', color: '#2d85f5', overlayClass: 'overlay-oral' },
      { code: 'mental', shortName: '心', navName: '心理', name: '心理健康', status: '待填写', summary: '心理量表未完成，暂不能形成综合判断', abnormalValues: ['心理量表未完成'], result: '暂无', reference: '完成量表后生成', description: '心理量表尚未完成，暂不能形成心理健康综合判断。', advice: '请完成心理健康量表，以便生成完整评估结果。', tone: 'pending', color: '#8e68ff', overlayClass: 'overlay-mental' },
    ],
    abnormalItems: [
      { id: 'vision-left', healthCode: 'vision', name: '左眼裸眼视力下降', specialty: '视力健康', result: '4.6', reference: '≥5.0', level: 'high' },
      { id: 'weight-bmi', healthCode: 'weight', name: 'BMI偏高', specialty: '体重健康', result: '23.8', reference: 'P85-P95', level: 'medium' },
      { id: 'oral-caries', healthCode: 'oral', name: '龋齿', specialty: '口腔健康', result: '2颗', reference: '0颗', level: 'low' },
    ],
    interpretation: {
      text: '本次筛查共发现3项需关注指标，主要涉及视力健康、体重健康和口腔健康。其中左眼裸眼视力下降风险较高，建议优先进行眼科复查；BMI处于偏高区间，建议调整饮食结构并增加日常运动；同时应关注龋齿问题，做好口腔清洁并进行口腔检查。其他筛查项目暂未发现明显异常。',
      actions: ['建议2周内进行眼科复查', '控制高糖、高热量食物摄入', '每日保证不少于2小时户外活动', '加强口腔清洁，建议进行口腔检查'],
    },
    examGroups: [],
  },
  {
    reportId: 'report-2025-autumn',
    name: '2025年秋季学生健康筛查',
    date: '2025-10-18',
    institution: '北京市某某妇幼保健院',
    status: '已完成',
    assessment: { text: '基本正常', tone: 'low', risk: '低风险', rescreen: '持续观察' },
    healthItems: [
      { code: 'vision', shortName: '眼', navName: '视力', name: '视力健康', status: '需关注', summary: '右眼视力边缘', abnormalValues: ['右眼裸眼视力边缘'], result: '4.9', reference: '≥ 5.0', description: '右眼裸眼视力略低于建议值，暂以观察和用眼习惯干预为主。', advice: '减少连续近距离用眼，保持户外活动，必要时复查视力。', tone: 'low', color: '#2d85f5', overlayClass: 'overlay-vision' },
      { code: 'weight', shortName: '体', navName: '体重', name: '体重健康', status: '正常', summary: '体重发育正常', abnormalValues: ['未见明显异常'], result: 'BMI：20.4', reference: 'P15-P85', description: '体重相关指标处于同龄参考范围。', advice: '继续保持均衡饮食和规律运动。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-weight' },
      { code: 'spine', shortName: '脊', navName: '脊柱', name: '脊柱健康', status: '正常', summary: '未见明显异常', abnormalValues: ['未见明显异常'], result: '未见明显异常', reference: '姿态对称', description: '脊柱筛查未见明显异常。', advice: '保持正确坐姿，避免长期单肩负重。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-spine' },
      { code: 'oral', shortName: '齿', navName: '口腔', name: '口腔健康', status: '正常', summary: '未见明显异常', abnormalValues: ['未见明显异常'], result: '0颗龋齿', reference: '0颗', description: '口腔筛查未见明显异常。', advice: '继续保持早晚刷牙和定期口腔检查。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-oral' },
      { code: 'mental', shortName: '心', navName: '心理', name: '心理健康', status: '正常', summary: '量表无异常', abnormalValues: ['未见明显异常'], result: '量表通过', reference: '通过', description: '心理量表结果暂未提示明显异常。', advice: '继续关注睡眠、情绪和亲子沟通。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-mental' },
    ],
    abnormalItems: [
      { id: 'vision-right-2025a', healthCode: 'vision', name: '右眼裸眼视力边缘', specialty: '视力健康', result: '4.9', reference: '≥5.0', level: 'low' },
    ],
    interpretation: { text: '本次筛查仅发现1项需关注指标，主要为右眼裸眼视力边缘。建议继续保持户外活动和良好用眼习惯，其他筛查项目暂未发现明显异常。', actions: ['连续近距离用眼后注意休息', '每日保持户外活动', '3个月内关注视力变化'] },
    examGroups: [],
  },
  {
    reportId: 'report-2025-spring',
    name: '2025年春季学生健康筛查',
    date: '2025-05-16',
    institution: '北京市某某妇幼保健院',
    status: '已完成',
    assessment: { text: '需关注', tone: 'medium', risk: '中风险', rescreen: '建议干预' },
    healthItems: [
      { code: 'vision', shortName: '眼', navName: '视力', name: '视力健康', status: '正常', summary: '视力正常', abnormalValues: ['未见明显异常'], result: '5.0', reference: '≥ 5.0', description: '本次视力筛查在参考范围内。', advice: '继续保持良好用眼习惯。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-vision' },
      { code: 'weight', shortName: '体', navName: '体重', name: '体重健康', status: '中风险', summary: 'BMI偏高', abnormalValues: ['BMI偏高'], result: '22.9', reference: 'P85-P95', description: 'BMI处于偏高区间，需要进行生活方式干预。', advice: '控制高糖饮料和油炸食物，增加规律运动。', tone: 'medium', color: '#ff9442', overlayClass: 'overlay-weight' },
      { code: 'spine', shortName: '脊', navName: '脊柱', name: '脊柱健康', status: '需关注', summary: '坐姿不良', abnormalValues: ['坐姿不良'], result: '轻度姿态不对称', reference: '姿态对称', description: '筛查提示轻度姿态不对称，建议关注坐姿和书包重量。', advice: '加强核心训练，避免单肩背包。', tone: 'low', color: '#2d85f5', overlayClass: 'overlay-spine' },
      { code: 'oral', shortName: '齿', navName: '口腔', name: '口腔健康', status: '正常', summary: '未见明显异常', abnormalValues: ['未见明显异常'], result: '0颗龋齿', reference: '0颗', description: '口腔筛查未见明显异常。', advice: '继续保持口腔清洁。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-oral' },
      { code: 'mental', shortName: '心', navName: '心理', name: '心理健康', status: '正常', summary: '量表无异常', abnormalValues: ['未见明显异常'], result: '量表通过', reference: '通过', description: '心理量表结果暂未提示明显异常。', advice: '保持规律作息。', tone: 'normal', color: '#14bc89', overlayClass: 'overlay-mental' },
    ],
    abnormalItems: [
      { id: 'weight-bmi-2025s', healthCode: 'weight', name: 'BMI偏高', specialty: '体重健康', result: '22.9', reference: 'P85-P95', level: 'medium' },
      { id: 'spine-posture-2025s', healthCode: 'spine', name: '坐姿不良', specialty: '脊柱健康', result: '轻度姿态不对称', reference: '姿态对称', level: 'low' },
    ],
    interpretation: { text: '本次筛查发现2项需关注指标，主要涉及体重健康和脊柱健康。建议优先调整饮食结构并增加运动，同时关注坐姿和书包负重。视力、口腔和心理筛查暂未发现明显异常。', actions: ['减少高糖、高热量食物摄入', '每周保持规律中等强度运动', '纠正坐姿并避免单肩负重'] },
    examGroups: [],
  },
]

const defaultExamGroups = [
  { code: 'vision', name: '视力健康', items: [
    { name: '右眼裸眼视力', result: '5.0', reference: '≥5.0', status: '正常', level: 'normal' },
    { name: '左眼裸眼视力', result: '4.6', reference: '≥5.0', status: '高风险', level: 'high' },
    { name: '右眼屈光筛查', result: '正常', reference: '正常', status: '正常', level: 'normal' },
    { name: '左眼屈光筛查', result: '临界', reference: '正常', status: '正常', level: 'normal' },
    { name: '色觉', result: '正常', reference: '正常', status: '正常', level: 'normal' },
    { name: '眼位', result: '正常', reference: '正常', status: '正常', level: 'normal' },
    { name: '眼表', result: '未见异常', reference: '未见异常', status: '正常', level: 'normal' },
    { name: '用眼习惯评估', result: '偏少户外', reference: '每日≥2小时', status: '正常', level: 'normal' },
  ] },
  { code: 'weight', name: '体重健康', items: [
    { name: '身高', result: '138cm', reference: '同龄参考范围', status: '正常', level: 'normal' },
    { name: '体重', result: '45.3kg', reference: '同龄参考范围', status: '正常', level: 'normal' },
    { name: 'BMI', result: '23.8', reference: 'P85-P95', status: '中风险', level: 'medium' },
    { name: '腰围', result: '72cm', reference: '同龄参考范围', status: '正常', level: 'normal' },
  ] },
  { code: 'mental', name: '心理健康', items: [
    { name: '情绪状态', result: '稳定', reference: '稳定', status: '正常', level: 'normal' },
    { name: '睡眠质量', result: '良好', reference: '良好', status: '正常', level: 'normal' },
    { name: '同伴交往', result: '正常', reference: '正常', status: '正常', level: 'normal' },
  ] },
  { code: 'spine', name: '脊柱健康', items: [
    { name: '脊柱外观', result: '未见异常', reference: '姿态对称', status: '正常', level: 'normal' },
    { name: '前屈试验', result: '阴性', reference: '阴性', status: '正常', level: 'normal' },
  ] },
  { code: 'oral', name: '口腔健康', items: [
    { name: '龋齿', result: '2颗', reference: '0颗', status: '需关注', level: 'low' },
    { name: '牙龈', result: '未见明显异常', reference: '正常', status: '正常', level: 'normal' },
    { name: '牙列', result: '整齐', reference: '整齐', status: '正常', level: 'normal' },
    { name: '口腔卫生', result: '一般', reference: '良好', status: '正常', level: 'normal' },
    { name: '窝沟封闭', result: '建议评估', reference: '按需评估', status: '正常', level: 'normal' },
  ] },
  { code: 'routine', name: '其他常规检查', items: [
    { name: '血压', result: '102/66mmHg', reference: '正常范围', status: '正常', level: 'normal' },
    { name: '心率', result: '82次/分', reference: '60-100次/分', status: '正常', level: 'normal' },
    { name: '肺活量', result: '正常', reference: '同龄参考范围', status: '正常', level: 'normal' },
    { name: '听力', result: '正常', reference: '正常', status: '正常', level: 'normal' },
    { name: '皮肤', result: '未见异常', reference: '未见异常', status: '正常', level: 'normal' },
    { name: '内科常规', result: '未见异常', reference: '未见异常', status: '正常', level: 'normal' },
  ] },
]

reportCatalog[0].examGroups = defaultExamGroups
reportCatalog[1].examGroups = defaultExamGroups.map((group) => group.code === 'vision'
  ? { ...group, items: group.items.map((item) => item.name === '右眼裸眼视力' ? { ...item, result: '4.9', status: '需关注', level: 'low' } : item.name === '左眼裸眼视力' ? { ...item, result: '5.0', status: '正常', level: 'normal' } : item) }
  : { ...group, items: group.items.map((item) => ({ ...item, level: 'normal', status: '正常' })) })
reportCatalog[2].examGroups = defaultExamGroups.map((group) => group.code === 'weight'
  ? { ...group, items: group.items.map((item) => item.name === 'BMI' ? { ...item, result: '22.9', status: '中风险', level: 'medium' } : item) }
  : group.code === 'spine'
    ? { ...group, items: group.items.map((item) => item.name === '脊柱外观' ? { ...item, result: '轻度姿态不对称', status: '需关注', level: 'low' } : item) }
    : { ...group, items: group.items.map((item) => ({ ...item, level: 'normal', status: '正常' })) })
const todos = [
  { label: '待查看报告', count: 1, target: 'reports' },
  { label: '待填写问卷', count: 2, target: 'questionnaires' },
  { label: '待确认复筛', count: 1, target: 'rescreen' },
  { label: '未读消息', count: 3, target: 'messages' },
]

const shortcuts = [
  { label: '体检报名', icon: Calendar, target: 'signup' },
  { label: '问卷量表', icon: Notebook, target: 'questionnaires' },
  { label: '体检报告', icon: Document, target: 'reports' },
  { label: '复筛通知', icon: FirstAidKit, target: 'rescreen' },
  { label: '就诊人管理', icon: User, target: 'students' },
  { label: '联系医院', icon: Phone, target: 'rescreen' },
]

const topics = [
  { title: '近视防控', text: '户外活动和用眼习惯', tone: 'vision' },
  { title: '体重管理', text: '饮食结构和运动计划', tone: 'weight' },
  { title: '脊柱健康', text: '坐姿、书包与日常观察', tone: 'spine' },
  { title: '口腔保健', text: '刷牙、窝沟封闭和复查', tone: 'oral' },
  { title: '心理健康', text: '情绪观察和亲子沟通', tone: 'mental' },
]

const examPlan = reactive({ name: '2026 年春季五健筛查', school: '北京市某某小学', date: '2026-04-12', place: '学校体育馆', deadline: '2026-04-10 18:00' })
const baseScreeningGroups = [{ type: '体格检查', items: '身高、体重、BMI、腰围、肺活量、足弓' }, { type: '视力筛查', items: '裸眼视力、矫正视力、屈光、色觉、眼位、眼压、眼轴长度、角膜曲率、视功能筛查、眼底照相' }, { type: '脊柱筛查', items: '脊柱侧弯、体态评估、肩背平衡、骨盆倾斜、下肢力线评估' }, { type: '口腔检查', items: '龋齿、牙列、牙龈、口腔卫生、咬合关系、窝沟情况' }, { type: '心理筛查', items: '心理行为问卷、情绪筛查、睡眠情况、注意力情况、学习适应情况' }]
const baseScreeningTagGroups = computed(() => baseScreeningGroups.map((group) => ({
  ...group,
  tags: String(group.items || '').split('、').filter(Boolean),
})))
const paidCategoryTabs = [{ key: 'all', label: '全部' }, { key: 'vision', label: '视力' }, { key: 'oral', label: '口腔' }, { key: 'bone', label: '骨骼' }, { key: 'nutrition', label: '营养' }, { key: 'mental', label: '心理' }, { key: 'service', label: '综合' }]
const paidProjectGroups = [
  { key: 'vision', name: '视力专项', projects: ['眼轴长度检查:30','电脑验光:20','角膜曲率检查:35','眼位检查:25','视功能检查:45'].map((v,i)=>{const [name,price]=v.split(':');return {id:'vision-'+i,name,price:+price}}) },
  { key: 'oral', name: '口腔专项', projects: ['龋齿风险评估:15','涂氟防龋:60','窝沟封闭评估:30','牙菌斑检测:20','口腔卫生指导:10'].map((v,i)=>{const [name,price]=v.split(':');return {id:'oral-'+i,name,price:+price}}) },
  { key: 'bone', name: '体态骨骼', projects: ['足弓精细评估:25','步态分析:40','脊柱精细评估:50','体态拍照评估:30','骨龄评估:80'].map((v,i)=>{const [name,price]=v.split(':');return {id:'bone-'+i,name,price:+price}}) },
  { key: 'nutrition', name: '营养体成分', projects: ['体成分分析:35','骨密度检测:50','维生素D风险评估:25','营养风险评估:30','生长发育评估:40'].map((v,i)=>{const [name,price]=v.split(':');return {id:'nutrition-'+i,name,price:+price}}) },
  { key: 'mental', name: '心理行为', projects: ['注意力测评:45','情绪筛查拓展:35','睡眠质量评估:30','学习适应量表:40','亲子关系量表:40'].map((v,i)=>{const [name,price]=v.split(':');return {id:'mental-'+i,name,price:+price}}) },
  { key: 'service', name: '综合服务', projects: ['专家报告解读:50','纸质报告打印:10','复查预约服务:20','健康档案导出:10','个性化干预建议:60'].map((v,i)=>{const [name,price]=v.split(':');return {id:'service-'+i,name,price:+price}}) },
]

const questionnaires = reactive([
  { name: '儿童青少年生活习惯问卷', type: '健康问卷', due: '2026-04-10', status: '未填写' },
  { name: '近视防控家长问卷', type: '家长问卷', due: '2026-04-10', status: '未填写' },
  { name: '心理健康筛查量表', type: '心理量表', due: '2026-04-11', status: '填写中' },
  { name: '睡眠质量评估量表', type: '健康问卷', due: '2026-04-09', status: '已提交' },
])

const questions = [
  { title: '孩子每天户外活动时间？', type: 'radio', options: ['少于 30 分钟', '30-60 分钟', '1-2 小时', '2 小时以上'] },
  { title: '孩子每天使用电子屏幕时间？', type: 'radio', options: ['少于 1 小时', '1-2 小时', '2-4 小时', '4 小时以上'] },
  { title: '孩子最近是否经常表示眼睛疲劳？', type: 'radio', options: ['从不', '偶尔', '经常'] },
  { title: '请补充孩子近期健康情况。', type: 'text', options: [] },
]

const articles = [
  { id: 1, title: '孩子视力下降后，家长应该怎么做', tag: '视力健康', views: 3280, recommend: true, read: false, cover: '/images/article/article-1.png' },
  { id: 2, title: '每天 2 小时户外活动为什么重要', tag: '视力健康', views: 2466, recommend: true, read: false, cover: '/images/article/article-2.png' },
  { id: 3, title: '儿童 BMI 偏高的饮食建议', tag: '体重管理', views: 1920, recommend: true, read: true, cover: '/images/article/article-3.png' },
  { id: 4, title: '如何发现孩子脊柱侧弯风险', tag: '脊柱健康', views: 1605, recommend: false, read: false, cover: '/images/article/article-1.png' },
  { id: 5, title: '青少年心理健康家长观察要点', tag: '心理健康', views: 2218, recommend: false, read: false, cover: '/images/article/article-2.png' },
]

const messages = [
  { title: '筛查报名通知', text: '2026 年春季五健筛查已开放报名', time: '今天 09:10', unread: true, target: 'signup' },
  { title: '问卷填写提醒', text: '生活习惯问卷和近视防控问卷待填写', time: '昨天 16:40', unread: true, target: 'questionnaires' },
  { title: '体检报告已生成', text: '林一凡的五健筛查报告可查看', time: '04-12 18:30', unread: false, target: 'reports' },
  { title: '复筛预约提醒', text: '视力健康建议预约复筛', time: '04-13 10:00', unread: true, target: 'rescreen' },
]

const familyServicePages = ['parentManual', 'onlineInteraction', 'followSurvey', 'familyTrainingRecord']
const parentManuals = [
  { title: '视力健康家庭指导手册', source: '儿童眼保健专科', date: '2026-04-02', status: '已阅读', open: true },
  { title: '近视防控行为建议', source: '儿童眼保健专科', date: '2026-04-05', status: '未阅读', open: false },
  { title: '复诊前注意事项', source: '儿童眼保健专科', date: '2026-04-10', status: '未阅读', open: false },
  { title: '家庭训练配合说明', source: '视觉训练师', date: '2026-04-12', status: '已阅读', open: false },
]
const followSurveyItems = [
  { title: '4月随访问卷', date: '2026-04-16', status: '待填写' },
  { title: '用眼习惯随访', date: '2026-04-10', status: '已提交' },
  { title: '训练依从性问卷', date: '2026-04-18', status: '待填写' },
]

const specialProjects = ref([
  {
    id: 'vision', type: '视力', name: '视力健康管理专案', specialty: '儿童眼保健专科', doctor: '王医生', status: '管理中', consent: true, progress: 68, startDate: '2026-03-28', stage: '管理', currentStep: 3,
    flow: [
      { title: '专科诊疗报告', desc: '儿童眼保健专科报告已生成', state: 'completed', action: 'report' },
      { title: '复诊计划', desc: '2026-04-18 09:30 待复诊', state: 'current', tip: '待复诊', action: 'followup' },
      { title: '家庭训练记录', desc: '本周视觉训练记录待提交', state: 'pending', tip: '待提交', action: 'familyTrainingRecord' },
      { title: '结案评估', desc: '完成阶段评估后结案', state: 'not_started' },
    ],
    report: {
      time: '2026-04-02', conclusion: '存在近视发展风险，建议进行用眼行为干预与定期复查', problems: ['裸眼视力下降', '远视储备不足', '眼轴增长偏快'], advice: '增加户外活动，控制近距离用眼，按计划复诊',
      lis: [
        { name: '维生素D检测', date: '2026-04-08', summary: '25-羟基维生素D偏低', image: lisReportImage },
        { name: '血常规', date: '2026-04-08', summary: '未见明显异常', image: lisReportImage },
        { name: '微量元素检测', date: '2026-04-09', summary: '锌偏低，建议结合医生指导', image: lisReportImage },
      ],
      pacs: [
        { name: '超声报告单', date: '2026-04-08', part: '腹部超声', summary: '未见明显异常', image: pacsReportImage },
        { name: '眼底照相报告', date: '2026-04-09', part: '眼底', summary: '未见明显器质性异常，建议随访观察', image: pacsReportImage },
      ],
      trends: [
        { name: '裸眼视力', value: '4.6 → 4.7', change: '较上次 +0.1', tone: 'good', plot: '10,30 60,30 110,18', points: [{ date: '03-28', x: 10, y: 30 }, { date: '04-18', x: 60, y: 30 }, { date: '05-16', x: 110, y: 18 }] },
        { name: '屈光度', value: '-1.25D → -1.10D', change: '较上次 -0.10D', tone: 'good', plot: '10,30 60,25 110,17', points: [{ date: '03-28', x: 10, y: 30 }, { date: '04-18', x: 60, y: 25 }, { date: '05-16', x: 110, y: 17 }] },
        { name: '眼轴长度', value: '24.05mm → 24.10mm', change: '较上次 +0.02mm', tone: 'stable', plot: '10,28 60,24 110,21', points: [{ date: '03-28', x: 10, y: 28 }, { date: '04-18', x: 60, y: 24 }, { date: '05-16', x: 110, y: 21 }] },
        { name: '远视储备', value: '+0.30D → +0.25D', change: '储备偏低', tone: 'warn', plot: '10,18 60,30 110,30', points: [{ date: '03-28', x: 10, y: 18 }, { date: '04-18', x: 60, y: 30 }, { date: '05-16', x: 110, y: 30 }] },
      ],
    },
    services: [
      { title: '家长手册', action: 'parentManual' },
      { title: '在线互动', action: 'onlineInteraction' },
      { title: '随访问卷', action: 'followSurvey' },
      { title: '家庭训练记录', action: 'familyTrainingRecord' },
    ],
  },
  {
    id: 'weight', type: '体重', name: '体重与营养管理专案', specialty: '儿童营养专科', doctor: '刘医生', status: '待签署', consent: false, progress: 12, startDate: '2026-04-08', stage: '授权', currentStep: 2,
    flow: [
      { title: '营养评估报告', desc: '签署后开放查看', state: 'not_started' },
      { title: '随访问卷', desc: '签署后开放填写', state: 'not_started' },
      { title: '家庭饮食记录', desc: '签署后开放提交', state: 'not_started' },
      { title: '结案评估', desc: '完成阶段管理后结案', state: 'not_started' },
    ],
    report: { time: '待开放', conclusion: '签署知情同意书后开放营养评估报告。', problems: ['BMI 偏高', '蔬果摄入不足'], advice: '签署后查看医生建议', lis: [], pacs: [], trends: [] },
    services: [],
  },
])

const currentProject = computed(() => specialProjects.value.find((item) => item.id === activeSpecialProjectId.value) || specialProjects.value[0])
const projectSubPageTitle = computed(() => ({ profile: '儿童建档', questionnaire: '首诊问卷', consent: '知情同意书', specialtyReport: '专科诊疗报告', followup: '复诊计划', parentManual: '家长手册', onlineInteraction: '在线互动', followSurvey: '随访问卷', familyTrainingRecord: '家庭训练记录' }[activeProjectSubPage.value] || '专案详情'))
const projectProfileStatusText = computed(() => ({ saved: '已保存未提交', editing: '编辑中', submitted: '已提交' }[projectProfileStatus.value] || '已保存未提交'))
const projectQuestionnaireStatusText = computed(() => ({ editing: '填写中', saved: '已保存未提交', submitted: '已提交' }[projectQuestionnaireStatus.value] || '填写中'))
const isProjectProfileEditing = computed(() => activeProjectSubPage.value === 'profile' && projectProfileStatus.value === 'editing')
const reportImageStyle = computed(() => ({ width: (reportZoom.value * 100) + '%', transform: 'translate3d(' + reportImageX.value + 'px, ' + reportImageY.value + 'px, 0)' }))
const currentStudent = computed(() => students.find((item) => item.id === selectedStudentId.value) || students[0])
const editingStudent = computed(() => students.find((item) => item.id === editingStudentId.value) || currentStudent.value)
const flatPaidProjects = computed(() => paidProjectGroups.flatMap((group) => group.projects.map((item) => ({ ...item, category: group.key, groupName: group.name }))))
const selectedPaidProjects = computed(() => flatPaidProjects.value.filter((item) => selectedPaidProjectIds.value.includes(item.id)))
const paidTotal = computed(() => selectedPaidProjects.value.reduce((sum, item) => sum + item.price, 0))
const visiblePaidProjectGroups = computed(() => activePaidCategory.value === 'all' ? paidProjectGroups : paidProjectGroups.filter((group) => group.key === activePaidCategory.value))
const canEditPaidProjects = computed(() => paidOrderStatus.value !== 'paid' && paidOrderStatus.value !== 'refunding')
const planStatusLabel = computed(() => !baseSignupDone.value ? '可报名' : paidOrderStatus.value === 'paid' ? '已报名｜自费已支付' : paidOrderStatus.value === 'refunded' ? '已报名｜自费已退款' : '已报名')
const orderStatusLabel = computed(() => ({ none: '未选择', pending: '待支付', paid: '已支付', refunding: '退款中', refunded: '已退款' }[paidOrderStatus.value] || '未选择'))
const bodyImage = computed(() => {
  const gender = currentStudent.value?.gender || currentStudent.value?.sex || currentStudent.value?.studentGender || ''
  return gender === '女' ? '/images/body/girl.png' : '/images/body/boy.png'
})
const selectedHealth = ref('vision')
const showHealthDetailSheet = ref(false)
const currentQuestion = computed(() => questions[questionnaireIndex.value])
const selectedArticle = computed(() => articles.find((item) => item.id === selectedArticleId.value) || articles[0])
const currentReport = computed(() => reportCatalog.find((item) => item.reportId === currentReportId.value) || reportCatalog[0])
const healthItems = computed(() => currentReport.value.healthItems)
const abnormalItems = computed(() => currentReport.value.abnormalItems)
const interpretation = computed(() => currentReport.value.interpretation)
const examGroups = computed(() => currentReport.value.examGroups)
const selectedHealthItem = computed(() => healthItems.value.find((item) => item.code === selectedHealth.value) || healthItems.value[0])
const activeHealth = computed(() => selectedHealthItem.value)
const abnormalHealthCodes = computed(() => healthItems.value.filter((item) => item.tone !== 'normal').map((item) => item.code))
const activeHealthCode = computed(() => selectedHealth.value)
const activeHealthAbnormalText = computed(() => formatAbnormalValues(activeHealth.value))
const activeHealthShortName = computed(() => activeHealth.value?.navName || activeHealth.value?.name?.replace('健康', '') || '')
const activeHealthCheckRows = computed(() => buildCheckRows(activeHealth.value))
const visibleOverlays = computed(() => healthItems.value)
const progress = computed(() => Math.round(((questionnaireIndex.value + 1) / questions.length) * 100))
const sortedAbnormalItems = computed(() => [...abnormalItems.value].sort((a, b) => riskLevelMeta[a.level].order - riskLevelMeta[b.level].order))
const abnormalSummaryText = computed(() => ['high', 'medium', 'low']
  .map((level) => riskLevelMeta[level].label + abnormalItems.value.filter((item) => item.level === level).length + '项')
  .join(' · '))
const visibleAdviceActions = computed(() => showAllAdvice.value ? interpretation.value.actions : interpretation.value.actions.slice(0, 3))
const visibleExamGroups = computed(() => {
  const groups = onlyAbnormal.value ? examGroups.value.filter((group) => getAbnormalCount(group) > 0) : examGroups.value
  return groups.map((group) => ({
    ...group,
    visibleItems: onlyAbnormal.value ? group.items.filter((item) => item.level !== 'normal') : group.items,
  }))
})
const hasVisibleExamGroups = computed(() => visibleExamGroups.value.length > 0)
const allVisibleResultGroupsExpanded = computed(() => hasVisibleExamGroups.value && visibleExamGroups.value.every((group) => expandedResultGroups.value.includes(group.code)))
const resultGroupToggleText = computed(() => allVisibleResultGroupsExpanded.value ? '全部收起' : '全部展开')
const reportFileBaseName = computed(() => `${currentStudent.value.name}_${currentReport.value.name}_${currentReport.value.date}`)
function formatAbnormalValues(item) {
  return item?.abnormalValues?.length ? item.abnormalValues.join('、') : item?.summary || '未见异常'
}
function getShortStatus(status) {
  const statusMap = { 高风险: '高', 中风险: '中', 低风险: '低', 正常: '正常', 待填写: '待填' }
  return statusMap[status] || status
}
function splitDetailLines(value) {
  return String(value || '暂无').split(/[；;]/).map((line) => line.trim()).filter(Boolean)
}
function getLineKey(line) {
  return line.includes('：') ? line.split('：')[0].trim() : line
}
function buildCheckRows(item) {
  const results = splitDetailLines(item?.result)
  const references = splitDetailLines(item?.reference)
  const referenceMap = new Map(references.map((line) => [getLineKey(line), line]))
  const usedKeys = new Set()
  const rows = results.map((result, index) => {
    const key = getLineKey(result)
    const reference = referenceMap.get(key) || references[index] || '暂无'
    usedKeys.add(key)
    return { key: key + '-' + index, result, reference }
  })
  references.forEach((reference, index) => {
    const key = getLineKey(reference)
    if (!usedKeys.has(key) && index >= results.length) rows.push({ key: key + '-' + index, result: '暂无', reference })
  })
  return rows
}
function getAbnormalCount(group) {
  return group.items.filter((item) => item.level !== 'normal').length
}
function getGroupSummary(group) {
  const count = getAbnormalCount(group)
  if (!count) return `全部正常 / 共${group.items.length}项`
  const lowCount = group.items.filter((item) => item.level === 'low').length
  return `${count}项${lowCount === count ? '需关注' : '异常'} / 共${group.items.length}项`
}
function openHealthDetail(code) {
  selectedHealth.value = code
  showHealthDetailSheet.value = true
}
function toggleResultGroup(code) {
  expandedResultGroups.value = expandedResultGroups.value.includes(code)
    ? expandedResultGroups.value.filter((item) => item !== code)
    : [...expandedResultGroups.value, code]
}
function toggleAllVisibleResultGroups() {
  if (!hasVisibleExamGroups.value) return
  const visibleCodes = visibleExamGroups.value.map((group) => group.code)
  if (allVisibleResultGroupsExpanded.value) {
    expandedResultGroups.value = expandedResultGroups.value.filter((code) => !visibleCodes.includes(code))
    return
  }
  expandedResultGroups.value = Array.from(new Set([...expandedResultGroups.value, ...visibleCodes]))
}
function getLatestReportId() {
  return reportCatalog[0]?.reportId || ''
}
function resetReportView() {
  const firstAbnormal = healthItems.value.find((item) => item.tone !== 'normal') || healthItems.value[0]
  selectedHealth.value = firstAbnormal?.code || 'vision'
  showAllAdvice.value = false
  onlyAbnormal.value = false
  expandedResultGroups.value = examGroups.value.filter((group) => getAbnormalCount(group) > 0).map((group) => group.code)
}
function scrollToReportContent() {
  requestAnimationFrame(() => {
    const container = document.querySelector('.phone-content')
    const target = document.querySelector('.body-health-card')
    if (!container || !target) return
    container.scrollTo({ top: Math.max(0, target.offsetTop - 8), behavior: 'smooth' })
  })
}
function selectReport(reportId) {
  if (currentReportId.value === reportId) {
    showReportSheet.value = false
    return
  }
  currentReportId.value = reportId
  showReportSheet.value = false
  showHealthDetailSheet.value = false
  resetReportView()
}
function openDownloadSheet() {
  downloadStatus.value = 'idle'
  downloadMessage.value = ''
  showDownloadSheet.value = true
}
function generateReportDownload(type) {
  if (downloadGenerating.value) return
  downloadGenerating.value = true
  downloadStatus.value = 'loading'
  downloadMessage.value = '报告正在生成'
  const ext = type === 'pdf' ? 'pdf' : 'png'
  const fileName = `${reportFileBaseName.value}.${ext}`
  window.setTimeout(() => {
    downloadGenerating.value = false
    downloadStatus.value = 'success'
    downloadMessage.value = `报告生成成功：${fileName}`
  }, 700)
}
function retryDownload() {
  downloadStatus.value = 'idle'
  downloadMessage.value = ''
}
function getOverlayClass(item) {
  if (item.code === activeHealthCode.value) return 'active'
  if (['高风险', '中风险', '低风险'].includes(item.status)) return 'visible'
  if (item.status === '待填写') return 'pending'
  return 'hidden'
}
function togglePaidProject(id) { if (!canEditPaidProjects.value) return; selectedPaidProjectIds.value = selectedPaidProjectIds.value.includes(id) ? selectedPaidProjectIds.value.filter((item) => item !== id) : [...selectedPaidProjectIds.value, id] }
function confirmBaseSignup() { baseSignupDone.value = true; showBaseSignupSuccess.value = true }
function openPayConfirm() { if (!baseSignupDone.value) { confirmBaseSignup(); return }; if (!selectedPaidProjectIds.value.length) return; paidOrderStatus.value = 'pending'; showPayConfirm.value = true }
function finishWechatPay() { paidOrderStatus.value = 'paid'; paidProjectsExpanded.value = false; showPayConfirm.value = false; showPaySuccess.value = true }
function requestRefund() { showRefundConfirm.value = true }
function confirmRefunding() { showRefundConfirm.value = false; paidOrderStatus.value = 'refunding' }
function finishRefund() { paidOrderStatus.value = 'refunded'; selectedPaidProjectIds.value = []; paidProjectsExpanded.value = true; showRefundSuccess.value = true }
function scrollToPaidProjects() { showBaseSignupSuccess.value = false; showRefundSuccess.value = false; requestAnimationFrame(() => { const container = document.querySelector('.phone-content'); const target = document.querySelector('.paid-project-section'); if (container && target) container.scrollTo({ top: Math.max(0, target.offsetTop - 8), behavior: 'smooth' }) }) }
function selectSpecialProject(id) {
  activeSpecialProjectId.value = id
  activeProjectPanel.value = 'flow'
  activeReportDoc.value = null
  activeFlowNode.value = null
  showProjectSheet.value = false
}
function resetReportViewer() {
  reportZoom.value = 1
  reportImageX.value = 0
  reportImageY.value = 0
  reportTouchState.mode = ''
}
function openReportDoc(item, type) {
  activeReportDoc.value = { ...item, type }
  resetReportViewer()
}
function viewSpecialtyReport() {
  activeProjectSubPage.value = 'specialtyReport'
  activeProjectPanel.value = 'flow'
  activeTab.value = 'project'
  page.value = 'projectSubPage'
  projectSubmitMessage.value = ''
  projectArchiveToast.value = ''
  specialtyReportExpanded.value = []
  lisArchiveExpanded.value = false
  pacsArchiveExpanded.value = false
}
function toggleSpecialtyReportGroup(key) {
  specialtyReportExpanded.value = specialtyReportExpanded.value.includes(key) ? specialtyReportExpanded.value.filter((item) => item !== key) : [...specialtyReportExpanded.value, key]
}
function previewSpecialtyAttachment() {
  projectArchiveToast.value = '附件预览暂未开放'
  window.setTimeout(() => { projectArchiveToast.value = '' }, 1600)
}
function showProjectToast(message) {
  projectArchiveToast.value = message
  window.setTimeout(() => { projectArchiveToast.value = '' }, 1600)
}
function previewArchiveDoc() {
  showProjectToast('查看检查单据')
}
function handleRehabAppointment(index) {
  const appointment = rehabAppointments[index]
  if (!appointment) return
  if (appointment.status === '待确认') {
    appointment.status = '已预约'
    appointment.action = '变更预约'
    showProjectToast('预约已确认')
    return
  }
  showProjectToast('变更预约功能待开放')
}
function requestRehabLeave() {
  showProjectToast('请假申请功能待开放')
}
function sendFamilyMessage() {
  showProjectToast('留言已发送')
}
function uploadFamilyImage() {
  showProjectToast('图片上传功能待开放')
}
function submitFollowSurvey() {
  showProjectToast('随访问卷已提交')
}
function submitFamilyTrainingRecord() {
  showProjectToast('训练记录已提交')
}
function closeReportDoc() {
  activeReportDoc.value = null
  resetReportViewer()
}
function touchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.hypot(dx, dy)
}
function onReportTouchStart(event) {
  if (event.touches.length === 2) {
    reportTouchState.mode = 'pinch'
    reportTouchState.distance = touchDistance(event.touches)
    reportTouchState.scale = reportZoom.value
    return
  }
  if (event.touches.length === 1 && reportZoom.value > 1) {
    reportTouchState.mode = 'drag'
    reportTouchState.startX = event.touches[0].clientX
    reportTouchState.startY = event.touches[0].clientY
    reportTouchState.imageX = reportImageX.value
    reportTouchState.imageY = reportImageY.value
  }
}
function onReportTouchMove(event) {
  if (reportTouchState.mode === 'pinch' && event.touches.length === 2) {
    const nextScale = reportTouchState.scale * (touchDistance(event.touches) / reportTouchState.distance)
    reportZoom.value = Math.min(3, Math.max(1, Number(nextScale.toFixed(2))))
    if (reportZoom.value === 1) {
      reportImageX.value = 0
      reportImageY.value = 0
    }
    return
  }
  if (reportTouchState.mode === 'drag' && event.touches.length === 1 && reportZoom.value > 1) {
    reportImageX.value = reportTouchState.imageX + event.touches[0].clientX - reportTouchState.startX
    reportImageY.value = reportTouchState.imageY + event.touches[0].clientY - reportTouchState.startY
  }
}
function onReportTouchEnd(event) {
  if (!event.touches.length) reportTouchState.mode = ''
}
function signCurrentProject() {
  consentSigned.value = true
  consentConfirmed.value = true
  specialProjects.value = specialProjects.value.map((project) => ({
    ...project,
    consent: true,
    status: project.status === '待签署' ? '管理中' : project.status,
    progress: Math.max(project.progress, 28),
    flow: project.flow.map((item) => {
      if (item.state === 'not_started' && ['营养评估报告', '随访问卷', '家庭饮食记录'].includes(item.title)) return { ...item, state: item.title === '营养评估报告' ? 'current' : 'pending', tip: item.title === '营养评估报告' ? '待生成' : '待处理', action: item.title === '营养评估报告' ? 'report' : item.title === '随访问卷' ? 'questionnaire' : 'familyTrainingRecord' }
      return item
    }),
  }))
}
function confirmProjectConsent() {
  if (consentSigned.value) {
    backToProjectFlow()
    return
  }
  if (!consentConfirmed.value) return
  signCurrentProject()
  projectSubmitMessage.value = '知情同意书已签署'
  backToProjectFlow()
}
function canOpenFlowNode(item) {
  return Boolean(item?.action && item.state !== 'not_started')
}
function openFlowNode(item) {
  if (!canOpenFlowNode(item)) return
  if (item.action === 'report') {
    viewSpecialtyReport()
    return
  }
  activeProjectSubPage.value = item.action === 'training' ? 'familyTrainingRecord' : item.action
  projectSubPageReturnPanel.value = 'flow'
  projectSubmitMessage.value = ''
  page.value = 'projectSubPage'
  activeTab.value = 'project'
}
function openProjectPrepPage(target) {
  activeProjectSubPage.value = target
  activeTab.value = 'project'
  page.value = 'projectSubPage'
  projectSubmitMessage.value = ''
  projectArchiveToast.value = ''
  if (target === 'consent') consentConfirmed.value = consentSigned.value
}
function openFamilyServicePage(target) {
  activeProjectSubPage.value = target
  projectSubPageReturnPanel.value = 'service'
  activeProjectPanel.value = 'service'
  activeTab.value = 'project'
  page.value = 'projectSubPage'
  projectSubmitMessage.value = ''
  projectArchiveToast.value = ''
}
function backToProjectFlow() {
  projectSubmitMessage.value = ''
  if (familyServicePages.includes(activeProjectSubPage.value)) {
    activeProjectPanel.value = projectSubPageReturnPanel.value
    setPrimaryPage('project')
    return
  }
  activeProjectPanel.value = 'flow'
  setPrimaryPage('project')
}
function closeFlowNode() {
  activeFlowNode.value = null
}
function flowActionLabel(item) {
  const map = { profile: '查看儿童档案', questionnaire: '查看问卷', consent: consentSigned.value ? '查看知情同意书' : '去签署知情同意书', followup: '查看复诊计划', training: '查看家庭训练记录', familyTrainingRecord: '查看家庭训练记录' }
  return map[item?.action] || '查看详情'
}
function editProjectProfile() {
  if (projectProfileStatus.value === 'submitted') return
  projectSubmitMessage.value = ''
  projectArchiveToast.value = ''
  projectProfileStatus.value = 'editing'
}
function cancelProjectProfileEdit() {
  projectSubmitMessage.value = ''
  projectProfileStatus.value = 'saved'
}
function saveProjectProfileDraft() {
  projectProfileStatus.value = 'saved'
  projectSubmitMessage.value = '建档信息已保存'
}
function submitProjectProfile() {
  projectProfileStatus.value = 'submitted'
  projectSubmitMessage.value = '建档信息已提交'
}
function requestProjectProfileChange() {
  projectSubmitMessage.value = '请联系机构申请修改'
}
function submitProjectSubPage() {
  if (activeProjectSubPage.value === 'profile') {
    if (projectProfileStatus.value === 'editing') saveProjectProfileDraft()
    else if (projectProfileStatus.value === 'saved') submitProjectProfile()
    else backToProjectFlow()
    return
  }
  projectSubmitMessage.value = ({ profile: '建档信息已保存', questionnaire: '首诊问卷已提交', followup: '复诊计划已确认' }[activeProjectSubPage.value] || '已提交')
}
function openBaselineQuestionnaire() {
  activeProjectSubPage.value = 'questionnaire'
  projectSubmitMessage.value = ''
  projectArchiveToast.value = ''
}
function showProjectArchiveToast() {
  projectArchiveToast.value = '专项档案将在筛查完成后生成'
  window.setTimeout(() => { projectArchiveToast.value = '' }, 1600)
}
function saveProjectQuestionnaireDraft() {
  projectQuestionnaireStatus.value = 'saved'
  projectSubmitMessage.value = '首诊问卷已保存'
}
function submitProjectQuestionnaire() {
  projectQuestionnaireStatus.value = 'submitted'
  projectSubmitMessage.value = '首诊问卷已提交'
}
function requestProjectQuestionnaireChange() {
  projectSubmitMessage.value = '请联系机构申请修改'
}
function selectProjectQuestionOption(event) {
  if (projectQuestionnaireStatus.value === 'submitted') return
  const target = event.target
  if (!(target instanceof HTMLElement) || target.tagName !== 'SPAN') return
  const optionGroup = target.closest('.sub-options, .sub-check-list')
  if (!optionGroup) return
  if (optionGroup.classList.contains('sub-options')) {
    optionGroup.querySelectorAll('span').forEach((item) => item.classList.remove('selected'))
    target.classList.add('selected')
    return
  }
  target.classList.toggle('selected')
}
function toggleProjectQuestionnaireGroup(group) {
  activeProjectQuestionnaireGroup.value = activeProjectQuestionnaireGroup.value === group ? '' : group
}
function confirmFlowNodeAction() {
  if (activeFlowNode.value?.action === 'consent' && !consentSigned.value) {
    signCurrentProject()
    closeFlowNode()
    return
  }
  closeFlowNode()
}
function questionnaireStatusClass(status) { if (status === '已提交') return 'done'; if (status === '填写中') return 'progressing'; if (status === '已过期') return 'expired'; return 'todo' }
function questionnaireActionLabel(status) { if (status === '已提交') return '查看结果'; if (status === '填写中') return '继续填写'; return '立即填写' }
function editStudent(id) { if (requestBindLeave('edit', id)) return; performEditStudent(id) }
function performEditStudent(id) { editingStudentId.value = id; page.value = 'studentEdit' }
function saveParentProfile() { parentProfileSaved.value = true }
function sendCode() {
  codeSent.value = true
  if (!loginForm.code) loginForm.code = '123456'
}
function login() {
  isLoggedIn.value = true
  go('home')
}
function logout() {
  isLoggedIn.value = false
  go('home')
}
function handleBack() {
  if (isLoggedIn.value) {
    logout()
    return
  }
  router.push('/')
}
function setPrimaryPage(target) {
  page.value = target
  if (['home', 'project', 'aiTest', 'mine'].includes(target)) activeTab.value = target
}
function requestBindLeave(mode, target = null) {
  if (page.value === 'students' && showBindForm.value && bindFormDirty.value) {
    pendingBindAction.value = 'leave'
    pendingBindMode.value = mode
    pendingBindTarget.value = target
    return true
  }
  if (page.value === 'students' && showBindForm.value) {
    showBindForm.value = false
    resetBindForm()
  }
  return false
}
function requestCancelBind() {
  if (bindFormDirty.value) {
    pendingBindAction.value = 'cancel'
    pendingBindMode.value = ''
    pendingBindTarget.value = null
    return
  }
  showBindForm.value = false
  resetBindForm()
}
function continueBindForm() {
  pendingBindAction.value = ''
  pendingBindMode.value = ''
  pendingBindTarget.value = null
}
function discardBindForm() {
  const mode = pendingBindMode.value
  const target = pendingBindTarget.value
  pendingBindAction.value = ''
  pendingBindMode.value = ''
  pendingBindTarget.value = null
  showBindForm.value = false
  resetBindForm()
  if (mode === 'go') performGo(target)
  else if (mode === 'tab') performTabTo(target)
  else if (mode === 'backStudents') setPrimaryPage(studentsBackTarget.value)
  else if (mode === 'edit') performEditStudent(target)
}
function openBindForm() {
  if (!showBindForm.value) resetBindForm()
  showBindForm.value = true
}
function openStudentsManager() {
  studentsBackTarget.value = page.value === 'mine' || activeTab.value === 'mine' ? 'mine' : 'home'
  pendingBindAction.value = ''
  pendingBindMode.value = ''
  pendingBindTarget.value = null
  showBindForm.value = false
  showChildSheet.value = false
  resetBindForm()
  page.value = 'students'
}
function performGo(target) {
  const sourcePage = page.value
  const sourceTab = activeTab.value
  if (target === 'students') {
    studentsBackTarget.value = sourcePage === 'mine' || sourceTab === 'mine' ? 'mine' : 'home'
    showBindForm.value = false
    resetBindForm()
  }
  if (target === 'rescreen') {
    rescreenBackTarget.value = sourcePage === 'reports' || sourceTab === 'reports' ? 'reports' : 'home'
  }
  if (target === 'questionnaires' && sourcePage !== 'questionnaireForm') {
    questionnairesBackTarget.value = sourcePage === 'home' ? 'home' : 'questionnaires'
  }
  if (target === 'reports') {
    reportsBackTarget.value = sourcePage === 'home' ? 'home' : 'reports'
  }
  if (target === 'heightWeightTest' || target === 'nutritionSurvey') {
    activeTab.value = 'aiTest'
    if (target === 'heightWeightTest') heightWeightResultVisible.value = false
    if (target === 'nutritionSurvey') nutritionResultVisible.value = false
  }
  page.value = target
  if (target === 'reports') {
    activeTab.value = reportsBackTarget.value === 'home' ? 'home' : 'reports'
    return
  }
  if (target === 'questionnaires') {
    activeTab.value = questionnairesBackTarget.value === 'home' ? 'home' : 'questionnaires'
    return
  }
  if (['home', 'project', 'aiTest', 'mine'].includes(target)) activeTab.value = target
}
function go(target) {
  if (requestBindLeave('go', target)) return
  performGo(target)
}
function backFromStudents() {
  if (requestBindLeave('backStudents')) return
  setPrimaryPage(studentsBackTarget.value)
}
function backFromRescreen() {
  setPrimaryPage(rescreenBackTarget.value)
}
function backFromReports() {
  setPrimaryPage(reportsBackTarget.value)
}
function backFromQuestionnaires() {
  setPrimaryPage(questionnairesBackTarget.value)
}
function backFromQuestionnaireForm() {
  setPrimaryPage(questionnairesBackTarget.value)
}
function backFromAiTestSubPage() {
  setPrimaryPage('aiTest')
}
function showHeightWeightResult() {
  heightWeightResultVisible.value = true
}
function showNutritionResult() {
  nutritionResultVisible.value = true
}
function performTabTo(target) {
  if (target === 'questionnaires') questionnairesBackTarget.value = 'questionnaires'
  if (target === 'reports') reportsBackTarget.value = 'reports'
  activeTab.value = target
  page.value = target
}
function tabTo(target) {
  if (requestBindLeave('tab', target)) return
  performTabTo(target)
}
function switchStudent(id) {
  selectedStudentId.value = id
  students.forEach((item) => { item.default = item.id === id })
  currentReportId.value = getLatestReportId()
  resetReportView()
  showChildSheet.value = false
}
function resetBindForm() {
  bindForm.name = ''
  bindForm.code = ''
  bindForm.cardNo = ''
  bindForm.school = '第一实验小学'
  bindForm.className = ''
  bindForm.phone = '13800001234'
  bindErrors.name = ''
  bindErrors.identity = ''
}
function confirmBind() {
  bindErrors.name = bindForm.name.trim() ? '' : '请填写学生姓名'
  bindErrors.identity = bindForm.code.trim() || bindForm.cardNo.trim() ? '' : '身份证号 / 学号和就诊卡号至少填写一项'
  if (bindErrors.name || bindErrors.identity) return
  students.push({ id: Date.now(), name: bindForm.name.trim(), gender: '男', age: 8, school: bindForm.school.trim() || '第一实验小学', className: bindForm.className.trim() || '二年级 3 班', default: students.length === 0 })
  if (students.length === 1) selectedStudentId.value = students[0].id
  showBindForm.value = false
  resetBindForm()
}
function requestDeleteStudent(id) { pendingDeleteStudentId.value = id }
function cancelDeleteStudent() { pendingDeleteStudentId.value = null }
function confirmDeleteStudent() {
  const targetIndex = students.findIndex((item) => item.id === pendingDeleteStudentId.value)
  if (targetIndex < 0) { pendingDeleteStudentId.value = null; return }
  const target = students[targetIndex]
  const wasSelected = selectedStudentId.value === target.id
  students.splice(targetIndex, 1)
  if (target.default && students.length) {
    students.forEach((item, index) => { item.default = index === 0 })
  }
  if (wasSelected || target.default) selectedStudentId.value = students[0]?.id || null
  pendingDeleteStudentId.value = null
}
function submitQuestionnaire() {
  submittedQuestionnaire.value = true
  questionnaires[0].status = '已提交'
}
function setBanner(index) {
  activeBannerIndex.value = index
}
function nextBanner() {
  activeBannerIndex.value = (activeBannerIndex.value + 1) % bannerImages.length
}
onMounted(() => {
  bannerTimer = window.setInterval(nextBanner, 3000)
})
onBeforeUnmount(() => {
  if (bannerTimer) window.clearInterval(bannerTimer)
})</script>

<template>
  <main class="parent-demo">
    <section :class="['phone-shell', { 'is-login-shell': !isLoggedIn }]">
      <header class="phone-top">
        <button class="back" type="button" @click="handleBack"><el-icon><ArrowLeft /></el-icon></button>
        <strong>儿童健康管理平台</strong>
        <button v-if="isLoggedIn && page !== 'home' && page !== 'reports' && page !== 'signup'" class="plain" type="button" @click="go('messages')"><el-icon><Bell /></el-icon></button><span v-else class="top-placeholder"></span>
      </header>

      <div :class="['phone-content', { 'login-content': !isLoggedIn, 'sheet-open': showHealthDetailSheet }]">
        <section v-if="!isLoggedIn" class="login-screen simple-login-screen">
          <section class="login-brand-panel">
            <h1>关注孩子成长健康</h1>
            <p>筛查报告、复筛提醒、健康建议一站查看</p>
            <i class="decor-dot dot-a"></i><i class="decor-dot dot-b"></i><i class="decor-cross">+</i><i class="decor-ring"></i>
          </section>
          <article class="login-card simple-login-card">
            <span class="login-card-kicker">儿童健康管理平台</span>
            <h2>家长登录</h2>
            <label class="field-only"><input v-model="loginForm.phone" inputmode="tel" maxlength="11" placeholder="请输入手机号" /></label>
            <label class="field-only"><span class="code-row"><input v-model="loginForm.code" inputmode="numeric" maxlength="6" placeholder="请输入验证码" /><button type="button" @click="sendCode">获取验证码</button></span></label>
            <button class="primary full login-button" type="button" @click="login">登录</button>
          </article>
        </section>

        <section v-else-if="page === 'home'" class="screen home-screen home-v2">
          <section class="home-banner home-banner-full banner-carousel">
            <img v-for="(item, index) in bannerImages" :key="item" :class="['banner-slide', { active: index === activeBannerIndex }]" :src="item" alt="儿童健康管理平台宣传图" />
            <div class="banner-dots carousel-dots">
              <button v-for="(item, index) in bannerImages" :key="item" :class="{ active: index === activeBannerIndex }" type="button" @click="setBanner(index)"></button>
            </div>
          </section>

          <section class="current-child-card">
            <div><strong>{{ currentStudent.name }}｜{{ currentStudent.className }}</strong><small>当前就诊人</small></div>
            <button type="button" @click="showChildSheet = true">切换</button>
          </section>

          <section class="core-actions">
            <button type="button" @click="go('signup')"><i class="core-action-icon"><img src="/images/icons/register.png" alt="" /></i><strong>体检报名</strong></button>
            <button type="button" @click="go('questionnaires')"><i class="core-action-icon"><img src="/images/icons/questionnaire.png" alt="" /></i><strong>问卷量表</strong></button>
            <button type="button" @click="go('reports')"><i class="core-action-icon"><img src="/images/icons/report.png" alt="" /></i><strong>体检报告</strong></button>
            <button type="button" @click="go('rescreen')"><i class="core-action-icon"><img src="/images/icons/rescreen.png" alt="" /></i><strong>复筛通知</strong></button>
          </section>

          <article class="home-student-summary home-checkup-card">
            <div class="checkup-title-row"><strong>{{ currentStudent.name }} 的体检报告</strong><button class="checkup-arrow" type="button" aria-label="查看体检报告" @click="go('reports')"><span>查看详情</span><i>›</i></button></div>
            <small class="checkup-date">2026年6月9日 体检</small>
            <p class="checkup-risk">存在 <b>3 项</b>需关注指标</p>
            <div class="summary-tags"><span class="high">视力异常</span><span class="medium">BMI 偏高</span><span class="low">脊柱轻度异常</span></div>
          </article>
          <div class="section-head"><div><h3>健康知识</h3></div></div>
          <div class="edu-tabs"><button class="active" type="button">全部</button><button v-for="item in topics" :key="item.title" type="button">{{ item.title }}</button></div>
          <div class="home-article-list">
            <button v-for="item in articles.slice(0, 3)" :key="item.id" class="home-article" type="button" @click="selectedArticleId = item.id; go('articleDetail')">
              <b class="article-thumb"><img :src="item.cover" :alt="item.title" /></b>
              <span><strong>{{ item.title }}</strong><small>{{ item.tag }} · {{ item.views }} 阅读 · {{ item.read ? '已读' : '未读' }}</small><em v-if="item.recommend">根据报告推荐</em></span>
            </button>
          </div>
        </section>

        <section v-else-if="page === 'project'" class="screen project-screen">
          <section class="project-prep-card" aria-label="通用准备事项"><button type="button" @click="openProjectPrepPage('profile')"><strong>儿童建档</strong><span class="prep-status submitted">已完成</span></button><button type="button" @click="openProjectPrepPage('questionnaire')"><strong>首诊问卷</strong><span class="prep-status submitted">已提交</span></button><button type="button" @click="openProjectPrepPage('consent')"><strong>知情同意书</strong><span :class="['prep-status', consentSigned ? 'submitted' : 'pending']">{{ consentSigned ? '已签署' : '待签署' }}</span></button></section>
          <article class="project-child-card">
            <strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong>
            <button class="project-sheet-entry" type="button" :disabled="!consentSigned" @click="showProjectSheet = true">已参与 {{ consentSigned ? specialProjects.length : 0 }} 个专案 <b v-if="consentSigned">›</b></button>
          </article>

          <article v-if="!consentSigned" class="project-empty-card">
            <strong>暂未参加专案</strong>
            <p>完成知情同意书签署后，可查看并参与健康管理专案</p>
          </article>

          <template v-else>
          <article class="project-status-card current-project-card">
            <div class="project-detail-main">
              <strong>{{ currentProject.name }}</strong>
              <p>{{ currentProject.specialty }}｜主治医生：{{ currentProject.doctor }}</p>
              <p>开始日期：{{ currentProject.startDate }}</p>

            </div>
</article>


          <div class="project-tabs">
            <button :class="{ active: activeProjectPanel === 'flow' }" type="button" @click="activeProjectPanel = 'flow'">专案进展</button>
            <button :class="{ active: activeProjectPanel === 'report' }" type="button" @click="activeProjectPanel = 'report'">康复</button>
            <button :class="{ active: activeProjectPanel === 'service' }" type="button" @click="activeProjectPanel = 'service'">家庭服务</button>
          </div>

          <template v-if="activeProjectPanel === 'flow'">
              <div class="project-report-group-title"><i></i><strong>关键指标趋势</strong></div>
              <section class="trend-grid project-trend-grid"><article v-for="item in currentProject.report.trends" :key="item.name" class="trend-card"><div class="trend-card-head"><strong>{{ item.name }}</strong></div><b>{{ item.value }}</b><small :class="['trend-change', item.tone]">{{ item.change }}</small><svg class="mini-trend-chart" viewBox="0 0 120 56" preserveAspectRatio="none"><line x1="8" y1="18" x2="112" y2="18" class="grid-line" /><line x1="8" y1="34" x2="112" y2="34" class="grid-line" /><polyline :points="item.plot" /><circle v-for="(point, index) in item.points" :key="point.date" :cx="point.x" :cy="point.y" :class="['trend-point', { latest: index === item.points.length - 1 }]" r="2.4" /><text v-for="point in item.points" :key="point.date + '-date'" :x="point.x" y="52">{{ point.date }}</text></svg></article></section>
            <div class="project-report-group-title"><i></i><strong>专案任务</strong></div>
            <section class="flow-timeline"><button v-for="item in currentProject.flow" :key="item.title" :class="['flow-row', item.state, { clickable: canOpenFlowNode(item) }]" type="button" :disabled="!canOpenFlowNode(item)" @click="openFlowNode(item)"><i></i><div><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div><span v-if="item.tip" class="flow-tip">{{ item.tip }}</span><b v-if="canOpenFlowNode(item)">›</b></button></section>
          </template>

          <template v-else-if="activeProjectPanel === 'report'">
            <article v-if="!consentSigned" class="locked-card"><strong>康复服务暂未开放</strong><p>签署知情同意书后，可查看康复计划、预约安排、请假申请和康复老师信息。</p><button type="button" @click="openProjectPrepPage('consent')">去签署</button></article>
            <template v-else>
              <p v-if="projectArchiveToast" class="project-submit-tip archive-toast">{{ projectArchiveToast }}</p>
              <section class="rehab-plan-card project-rehab-plan"><div class="rehab-card-head"><strong>康复计划</strong><span>执行中</span></div><div class="rehab-plan-main"><b>视觉功能训练</b><p>改善调节能力，建立稳定用眼习惯</p></div><div class="rehab-info-grid"><p><em>频次</em><b>每周 2 次</b></p><p><em>周期</em><b>4 周</b></p></div></section>
              <section class="rehab-panel"><div class="project-report-group-title"><i></i><strong>康复预约</strong></div><article v-for="(item, index) in rehabAppointments" :key="item.time" class="rehab-appointment-row"><div><strong>{{ item.time }}</strong><p>{{ item.item }}</p></div><span :class="{ pending: item.status === '待确认' }">{{ item.status }}</span><button type="button" @click="handleRehabAppointment(index)">{{ item.action }}</button></article></section>
              <section class="rehab-panel"><div class="rehab-panel-head"><div class="project-report-group-title"><i></i><strong>请假申请</strong></div><button type="button" @click="requestRehabLeave">发起请假</button></div><div class="rehab-leave-list"><p><span>04月12日 16:30</span><b>学校活动冲突</b><em>已同意</em></p><p><span>04月23日 16:30</span><b>家庭行程待确认</b><em class="pending">待确认</em></p></div></section>
              <section class="rehab-teacher-card"><div><strong>李老师</strong><p>视觉训练师</p></div><p><em>擅长</em><b>儿童视觉功能训练、用眼行为指导</b></p><p><em>联系电话</em><b>138****5678</b></p></section>
            </template>
          </template>

          <template v-else>
            <article v-if="!consentSigned" class="locked-card"><strong>家庭服务暂未开放</strong><p>签署知情同意书后，可查看家长手册、在线互动、随访问卷和家庭训练记录。</p><button type="button" @click="openProjectPrepPage('consent')">去签署</button></article>
            <template v-else><button v-for="item in currentProject.services" :key="item.title" class="family-service-entry" type="button" @click="openFamilyServicePage(item.action)"><span><strong>{{ item.title }}</strong></span><em>进入 &gt;</em></button></template>
          </template>
          </template>
        </section>
        <section v-else-if="page === 'projectSubPage'" class="screen project-subpage-screen">
          <div class="page-title project-subpage-title"><button type="button" @click="backToProjectFlow"><el-icon><ArrowLeft /></el-icon></button><h2>{{ projectSubPageTitle }}</h2><span class="top-placeholder"></span></div>
          <article class="project-sub-summary">
            <strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong>
            <div class="project-summary-line"><p>{{ currentProject.name }}</p><span v-if="activeProjectSubPage === 'profile'" :class="['profile-state-tag', projectProfileStatus]">{{ projectProfileStatusText }}</span><span v-else-if="activeProjectSubPage === 'questionnaire'" :class="['questionnaire-state-tag', projectQuestionnaireStatus]">{{ projectQuestionnaireStatusText }}</span></div>
          </article>

          <template v-if="activeProjectSubPage === 'profile'">
            <section class="sub-section" :class="{ 'is-editing': isProjectProfileEditing, 'is-readonly': !isProjectProfileEditing }"><h3>基础身份信息</h3><div class="sub-form-grid"><label class="required"><span class="field-label">儿童姓名</span><input :value="currentStudent.name" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">性别</span><input :value="currentStudent.gender" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">出生日期</span><input value="2016-04-18" :readonly="!isProjectProfileEditing" /></label><label>年龄<input :value="currentStudent.age + '岁'" readonly /></label><label class="required"><span class="field-label">身份证号</span><input value="110101201604180018" :readonly="!isProjectProfileEditing" /></label><label>档案编号<input value="FH-2026-0418-001" :readonly="!isProjectProfileEditing" /></label></div></section>
            <section class="sub-section" :class="{ 'is-editing': isProjectProfileEditing, 'is-readonly': !isProjectProfileEditing }"><h3>就读信息</h3><div class="sub-form-grid"><label class="required wide-field"><span class="field-label">就读机构</span><input value="北京市海淀区中关村第三小学万柳校区" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">年级</span><input value="四年级" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">班级</span><input :value="currentStudent.className" :readonly="!isProjectProfileEditing" /></label><label>学籍号<input value="XJ20260418001" :readonly="!isProjectProfileEditing" /></label></div></section>
            <section class="sub-section" :class="{ 'is-editing': isProjectProfileEditing, 'is-readonly': !isProjectProfileEditing }"><h3>监护人及联络信息</h3><div class="sub-form-grid guardian-grid"><label class="required"><span class="field-label">监护人</span><input :value="isProjectProfileEditing ? parentProfile.name : parentProfile.name + '｜' + parentProfile.relation" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">监护人电话</span><input :value="parentProfile.phone" :readonly="!isProjectProfileEditing" /></label><label v-if="isProjectProfileEditing" class="required"><span class="field-label">与儿童关系</span><input :value="parentProfile.relation" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">紧急联系人</span><input value="林先生" :readonly="!isProjectProfileEditing" /></label><label class="required emergency-phone"><span class="field-label">紧急联系电话</span><input value="139****5678" :readonly="!isProjectProfileEditing" /></label></div><label class="sub-text-field required"><span class="field-label">户籍地址</span><textarea :readonly="!isProjectProfileEditing">北京市海淀区某某街道 18 号</textarea></label><label class="sub-text-field required"><span class="field-label">现居住地址</span><textarea :readonly="!isProjectProfileEditing">北京市海淀区某某小区 3 号楼</textarea></label></section>
            <section class="sub-section" :class="{ 'is-editing': isProjectProfileEditing, 'is-readonly': !isProjectProfileEditing }"><h3>出生与成长基础信息</h3><div class="sub-form-grid"><label class="required"><span class="field-label">民族</span><input value="汉族" :readonly="!isProjectProfileEditing" /></label><label class="required"><span class="field-label">出生孕周</span><input value="39周" :readonly="!isProjectProfileEditing" /></label></div><div class="sub-field-title required">是否早产</div><div class="sub-options"><span class="selected">足月</span><span>早产</span></div><div class="sub-field-title required">分娩方式</div><div class="sub-options"><span class="selected">顺产</span><span>剖宫产</span></div></section>
            <section class="sub-section" :class="{ 'is-editing': isProjectProfileEditing, 'is-readonly': !isProjectProfileEditing }"><h3>既往健康与家族风险史</h3><div class="sub-field-title">既往病史</div><div class="sub-check-list health-history"><span>哮喘</span><span class="selected">过敏</span><span>矮小</span><span>肥胖</span><span class="selected">弱视</span><span>脊柱疾病</span><span>精神情绪相关病史</span><span class="none">无明显既往病史</span></div><div class="sub-field-title">家族高危史</div><div class="sub-check-list health-history"><span class="selected">父母近视</span><span>父母高度近视</span><span>家族肥胖</span><span>糖尿病</span><span>脊柱侧弯</span><span>心理疾病遗传史</span><span class="none">无明显家族高危史</span></div><label class="sub-text-field">手术史<textarea :readonly="!isProjectProfileEditing">无明确手术史</textarea></label><label class="sub-text-field">长期用药史<textarea :readonly="!isProjectProfileEditing">无长期用药</textarea></label><label class="sub-text-field">既往体检异常记录<textarea :readonly="!isProjectProfileEditing">曾提示远视储备不足，建议随访。</textarea></label><label class="sub-text-field">以往就诊 / 矫正记录<textarea :readonly="!isProjectProfileEditing">2025年曾进行眼科复查，未长期配镜。</textarea></label></section>

          </template>

          <template v-else-if="activeProjectSubPage === 'questionnaire'">
            <section class="sub-section questionnaire-progress"><div><strong>{{ projectQuestionnaireStatus === 'submitted' ? '已完成 18/18' : '问卷进度 3/18' }}</strong><i><span></span></i></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'vision' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('vision')"><span>用眼与视力行为</span><em>{{ activeProjectQuestionnaireGroup === 'vision' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'vision'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>每日近距离用眼时长</h4><div class="sub-options"><span>少于1小时</span><span class="selected">1-2小时</span><span>2-4小时</span><span>4小时以上</span></div></article><article class="question-block"><h4>每日电子产品使用时长</h4><div class="sub-options"><span>少于30分钟</span><span class="selected">30分钟-1小时</span><span>1-2小时</span><span>2小时以上</span></div></article><article class="question-block"><h4>是否经常眯眼看远处</h4><div class="sub-options"><span>从不</span><span class="selected">偶尔</span><span>经常</span></div></article><article class="question-block"><h4>是否频繁揉眼、眼干或眼疲劳</h4><div class="sub-options"><span>无</span><span class="selected">偶尔</span><span>经常</span></div></article><article class="question-block"><h4>是否已经佩戴眼镜</h4><div class="sub-options"><span class="selected">未佩戴</span><span>框架眼镜</span><span>角膜塑形镜</span></div></article><article class="question-block"><h4>初发近视时间</h4><div class="sub-options"><span class="selected">未近视</span><span>1年内</span><span>1-3年</span><span>3年以上</span></div></article></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'outdoor' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('outdoor')"><span>户外活动与运动</span><em>{{ activeProjectQuestionnaireGroup === 'outdoor' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'outdoor'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>每日户外活动时长</h4><div class="sub-options"><span>少于30分钟</span><span>30分钟-1小时</span><span class="selected">1-2小时</span><span>2小时以上</span></div></article><article class="question-block"><h4>每周运动频次</h4><div class="sub-options"><span>少于1次</span><span>1-2次</span><span class="selected">3-4次</span><span>5次及以上</span></div></article><article class="question-block"><h4>主要运动类型</h4><div class="sub-check-list"><span>跑跳类</span><span class="selected">球类</span><span>游泳</span><span>舞蹈体操</span><span>其他</span></div></article></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'diet' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('diet')"><span>饮食与睡眠</span><em>{{ activeProjectQuestionnaireGroup === 'diet' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'diet'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>三餐是否规律</h4><div class="sub-options"><span class="selected">规律</span><span>偶尔不规律</span><span>经常不规律</span></div></article><article class="question-block"><h4>甜食或含糖饮料摄入</h4><div class="sub-options"><span>很少</span><span class="selected">每周1-2次</span><span>每周3次以上</span><span>几乎每天</span></div></article><article class="question-block"><h4>每日睡眠时长</h4><div class="sub-options"><span>少于7小时</span><span>7-8小时</span><span class="selected">8-9小时</span><span>9小时以上</span></div></article><article class="question-block"><h4>作息是否规律</h4><div class="sub-options"><span class="selected">规律</span><span>偶尔晚睡</span><span>经常晚睡</span></div></article></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'oral' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('oral')"><span>口腔卫生习惯</span><em>{{ activeProjectQuestionnaireGroup === 'oral' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'oral'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>每日刷牙次数</h4><div class="sub-options"><span>0次</span><span>1次</span><span class="selected">2次</span><span>2次以上</span></div></article><article class="question-block"><h4>是否使用牙线</h4><div class="sub-options"><span class="selected">从不</span><span>偶尔</span><span>经常</span></div></article><article class="question-block"><h4>定期口腔检查频率</h4><div class="sub-options"><span>从不</span><span class="selected">每年1次</span><span>每半年1次</span><span>有问题才检查</span></div></article></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'spine' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('spine')"><span>体态与脊柱习惯</span><em>{{ activeProjectQuestionnaireGroup === 'spine' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'spine'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>日常坐姿情况</h4><div class="sub-options"><span>较好</span><span class="selected">偶尔歪斜</span><span>经常歪斜</span></div></article><article class="question-block"><h4>书包使用情况</h4><div class="sub-options"><span class="selected">双肩书包</span><span>单肩书包</span><span>经常单侧背包</span></div></article><article class="question-block"><h4>是否有高低肩、驼背、走路姿态异常等情况</h4><div class="sub-options"><span class="selected">无</span><span>不确定</span><span>有</span></div></article></div></section>
            <section class="sub-question-group" :class="[{ expanded: activeProjectQuestionnaireGroup === 'mental' }, { 'is-readonly': projectQuestionnaireStatus === 'submitted' }]"><button class="question-group-toggle" type="button" @click="toggleProjectQuestionnaireGroup('mental')"><span>心理与情绪线索</span><em>{{ activeProjectQuestionnaireGroup === 'mental' ? '收起' : '展开' }}</em></button><div v-if="activeProjectQuestionnaireGroup === 'mental'" class="question-group-body" @click="selectProjectQuestionOption($event)"><article class="question-block"><h4>最近是否明显情绪低落或烦躁</h4><div class="sub-options"><span class="selected">无</span><span>偶尔</span><span>经常</span></div></article><article class="question-block"><h4>睡眠质量是否较差</h4><div class="sub-options"><span class="selected">无</span><span>偶尔</span><span>经常</span></div></article><article class="question-block"><h4>是否存在明显厌学、焦虑或人际交往困难</h4><div class="sub-options"><span class="selected">无</span><span>不确定</span><span>有</span></div></article><article class="question-block"><h4>是否有注意力不集中或多动冲动表现</h4><div class="sub-options"><span class="selected">无</span><span>偶尔</span><span>经常</span></div></article></div></section>
          </template>

          <template v-else-if="activeProjectSubPage === 'specialtyReport'">
            <article class="specialty-summary-card"><div><strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong><span>三级 轻度近视</span></div><p><em>诊疗日期</em><b>2026-04-02</b></p><p><em>就诊类型</em><b>校园初筛复查</b></p><p><em>诊断结果</em><b>低度近视、视疲劳</b></p><p><em>建议复查</em><b>3个月后</b></p></article>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('core')"><span><i></i>核心检测数据</span><em>{{ specialtyReportExpanded.includes('core') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('core')" class="specialty-section-body"><div class="specialty-eye-table"><div class="head"><span>项目</span><span>右眼 OD</span><span>左眼 OS</span></div><p><span>裸眼视力</span><b>4.6</b><b>4.7</b></p><p><span>矫正视力</span><b>5.0</b><b>5.0</b></p><p><span>电脑验光</span><b>S -0.75D / C -0.50D / A 180°</b><b>S -1.00D / C -0.25D / A 175°</b></p><p><span>主觉验光</span><b>-0.75D / -0.50D / 180°</b><b>-1.00D / -0.25D / 175°</b></p><p><span>眼轴 AL</span><b>24.10mm</b><b>24.00mm</b></p><p><span>角膜曲率 K1/K2</span><b>42.50D / 43.25D</b><b>42.75D / 43.50D</b></p><p><span>眼压</span><b>15mmHg</b><b>16mmHg</b></p></div><div class="specialty-note-grid"><p><em>视力表类型</em><b>5 分记录法</b></p><p><em>瞳距 PD</em><b>58mm</b></p><p><em>前房深度</em><b>3.12mm</b></p><p><em>晶状体厚度</em><b>3.55mm</b></p><p><em>眼轴评估</em><b>较同龄参考值略偏长</b></p><p><em>远视储备</em><b>+0.25D｜储备不足</b></p><p><em>眼压评估</em><b>正常</b></p></div></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('diagnosis')"><span><i></i>诊断结论与风险分级</span><em>{{ specialtyReportExpanded.includes('diagnosis') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('diagnosis')" class="specialty-section-body"><div class="specialty-tags"><span>低度近视</span><span>复性散光</span><span>视疲劳</span><span>三级 轻度近视</span></div><p class="specialty-paragraph">林一凡目前双眼裸眼视力下降，屈光检查提示低度近视并伴轻度散光，眼轴长度较同龄儿童略偏长，远视储备不足。结合用眼习惯和家庭风险因素，建议纳入视力健康专案重点随访，持续观察近视进展速度。</p></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('intervention')"><span><i></i>个性化干预方案</span><em>{{ specialtyReportExpanded.includes('intervention') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('intervention')" class="specialty-section-body"><div class="specialty-plan-list"><p><em>光学矫正方案</em><b>建议验配框架眼镜，上课及看远时佩戴；暂不建议角膜塑形镜。</b></p><p><em>行为干预医嘱</em><b>每日户外活动不少于 2 小时；近距离用眼遵循 20-20-20 原则；控制手机和平板单次使用时长；保持良好读写光照和坐姿。</b></p><p><em>眼部功能训练</em><b>建议进行调节放松训练和远眺训练，每日 2-3 次。</b></p><p><em>药物干预</em><b>暂不使用低浓度阿托品，若 3 个月复查进展明显，再由医生评估。</b></p></div></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('followup')"><span><i></i>随访、复查与专案管理记录</span><em>{{ specialtyReportExpanded.includes('followup') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('followup')" class="specialty-section-body"><div class="specialty-note-grid"><p><em>建议复查周期</em><b>3 个月</b></p><p><em>下次复查必做项目</em><b>视力、验光、眼轴、眼压</b></p><p><em>转诊指征</em><b>若近视度数增长过快、出现斜视或眼底异常，应转诊上级眼科。</b></p><p><em>家长知情告知</em><b>近视不可逆，防控目标为延缓进展。</b></p><p><em>医师签名</em><b>王医生</b></p><p><em>报告出具日期</em><b>2026-04-02</b></p><p><em>五健专案联动标记</em><b>纳入重点管理</b></p></div></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('base')"><span><i></i>基础建档信息</span><em>{{ specialtyReportExpanded.includes('base') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('base')" class="specialty-section-body"><div class="specialty-note-grid"><p><em>儿童姓名</em><b>林一凡</b></p><p><em>性别</em><b>男</b></p><p><em>出生日期</em><b>2016-04-18</b></p><p><em>身份证号</em><b>110101201604180018</b></p><p><em>健康档案编号</em><b>FH-2026-0418-001</b></p><p><em>学籍 / 班级</em><b>XJ20260418001 / 五年级2班</b></p><p><em>监护人</em><b>王女士</b></p><p><em>联系电话</em><b>138****1234</b></p><p><em>居住地址</em><b>北京市海淀区某某小区3号楼</b></p><p><em>检查机构</em><b>儿童健康管理中心</b></p><p><em>接诊医师</em><b>王医生</b></p><p><em>检查设备编号</em><b>VIS-AXL-20260402</b></p><p><em>五健专案编号</em><b>VH-VISION-2026-0001</b></p><p><em>既往视力筛查历史</em><b>已调取</b></p></div></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('history')"><span><i></i>主诉、现病史、高危家族史</span><em>{{ specialtyReportExpanded.includes('history') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('history')" class="specialty-section-body"><div class="specialty-plan-list"><p><em>主诉</em><b>近 2 个月上课看黑板不清，偶有眯眼和视疲劳。</b></p><p><em>现病史</em><b>首次发现视力异常约 3 个月前；既往未配镜；无散瞳验光史；无眼外伤史。</b></p><p><em>高危家族史</em><b>父亲中度近视，母亲高度近视约 650 度；无斜视、先天性眼病和遗传性眼底病家族史。</b></p><p><em>用眼生活习惯</em><b>每日户外约 1 小时，电子产品使用约 1-2 小时，读写距离偏近，偶有夜间开灯不足，坐姿偶有歪斜。</b></p></div></div></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('exam')"><span><i></i>眼部常规专科查体</span><em>{{ specialtyReportExpanded.includes('exam') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('exam')" class="specialty-section-body"><div class="specialty-plan-list"><p><em>眼睑、结膜、角膜</em><b>未见明显充血、滤泡、倒睫或角膜损伤。</b></p><p><em>前房、瞳孔</em><b>前房深度正常，瞳孔对光反射灵敏。</b></p><p><em>晶状体</em><b>透明，未见先天混浊。</b></p><p><em>眼底初筛</em><b>视盘边界清，黄斑区未见明显异常。</b></p><p><em>眼位与眼球运动</em><b>遮盖试验未见显性斜视，眼球各方向运动未受限。</b></p><p><em>双眼视功能</em><b>立体视、同时视、融合功能初筛正常。</b></p></div></div></section>
            <section class="specialty-detail-section archive-collapsible specialty-archive-section"><div class="archive-head signup-section-title"><strong>LIS 化验单归档</strong><span>共 {{ currentProject.report.lis.length }} 份</span><button type="button" @click="lisArchiveExpanded = !lisArchiveExpanded">{{ lisArchiveExpanded ? '收起' : '展开' }}</button></div><template v-if="lisArchiveExpanded"><article v-for="item in currentProject.report.lis" :key="item.name" class="archive-card compact"><div class="archive-info"><div class="archive-title"><strong>{{ item.name }}</strong><button type="button" @click="previewArchiveDoc">查看</button></div><p>{{ item.date }}</p><small>结果摘要：{{ item.summary }}</small></div></article></template></section>
            <section class="specialty-detail-section archive-collapsible specialty-archive-section"><div class="archive-head signup-section-title"><strong>PACS 检查报告归档</strong><span>共 {{ currentProject.report.pacs.length }} 份</span><button type="button" @click="pacsArchiveExpanded = !pacsArchiveExpanded">{{ pacsArchiveExpanded ? '收起' : '展开' }}</button></div><template v-if="pacsArchiveExpanded"><article v-for="item in currentProject.report.pacs" :key="item.name" class="archive-card compact"><div class="archive-info"><div class="archive-title"><strong>{{ item.name }}</strong><button type="button" @click="previewArchiveDoc">查看</button></div><p>{{ item.date }}</p><small>检查部位：{{ item.part }}｜{{ item.summary }}</small></div></article></template></section>
            <section class="specialty-detail-section"><button class="specialty-section-toggle" type="button" @click="toggleSpecialtyReportGroup('attachments')"><span><i></i>附件</span><em>{{ specialtyReportExpanded.includes('attachments') ? '收起' : '展开' }}</em></button><div v-if="specialtyReportExpanded.includes('attachments')" class="specialty-section-body"><div class="specialty-attachment-list"><button type="button" @click="previewSpecialtyAttachment">验光单原始数据截图<span>预览</span></button><button type="button" @click="previewSpecialtyAttachment">眼轴生长对比曲线<span>预览</span></button><button type="button" @click="previewSpecialtyAttachment">视力健康宣教单二维码<span>预览</span></button></div></div></section>
          </template>
          <template v-else-if="activeProjectSubPage === 'consent'">
            <section class="sub-section consent-name"><strong>专案知情同意书</strong><span :class="['consent-state', consentSigned ? 'done' : 'pending']">{{ consentSigned ? '已签署' : '待签署' }}</span></section>
            <section v-if="consentSigned" class="sub-section signed-info"><p><em>签署时间</em><b>2026-04-02 10:18</b></p><p><em>签署人</em><b>{{ parentProfile.name }}</b></p></section>
            <section class="sub-section consent-content"><h3>服务内容</h3><p>本知情同意书适用于儿童健康管理相关专案服务，包括健康筛查、专科评估、问卷采集、随访管理、家庭干预、复诊提醒及报告展示等内容。</p><h3>数据使用说明</h3><p>筛查和随访数据仅用于本次健康管理、医生评估和家长端报告展示。</p><h3>家长确认事项</h3><p>家长确认已了解服务边界，并同意配合完成问卷、复诊和家庭训练/饮食记录等事项。</p><h3>风险与注意事项</h3><p>如儿童出现视力下降、体重异常、脊柱姿态异常、口腔问题或其他健康异常，应及时到医疗机构进一步检查。</p></section>
            <label v-if="!consentSigned" class="consent-check"><input v-model="consentConfirmed" type="checkbox" />我已阅读并理解以上内容</label>
          </template>

          <template v-else-if="activeProjectSubPage === 'followup'">
            <section class="sub-section followup-ticket followup-notice-time"><small>复诊时间</small><div><strong>2026-04-18 09:30</strong><span>待复诊</span></div></section>
            <section class="sub-section sub-info-list followup-info-list"><p><em>复诊地点：</em><b>眼保健专科门诊</b></p><p><em>复诊科室：</em><b>{{ currentProject.specialty }}</b></p><p><em>主治医生：</em><b>{{ currentProject.doctor }}</b></p><p><em>联系电话：</em><b>138****1234</b></p></section>
            <section class="sub-section followup-projects"><h3>复诊项目</h3><div class="sub-chip-list"><span>视力复查</span><span>屈光检查</span><span>眼轴复测</span><span>用眼行为评估</span></div></section>
            <section class="sub-section followup-notes"><h3>注意事项</h3><ol class="sub-note-list"><li>请携带既往检查报告。</li><li>如需散瞳检查，请按医生要求准备。</li><li>建议家长陪同到诊。</li></ol></section>
          </template>

          <template v-else-if="activeProjectSubPage === 'parentManual'">
            <section class="family-sub-list"><article v-for="item in parentManuals" :key="item.title" class="manual-row"><div><strong>{{ item.title }}</strong><p>{{ item.source }}｜{{ item.date }}</p></div><span :class="{ pending: item.status === '未阅读' }">{{ item.status }}</span><section v-if="item.open" class="manual-preview"><p>建议每日保证户外活动，近距离用眼 30 分钟后主动休息，保持读写距离和坐姿。复诊前请整理既往检查报告，并按通知时间到诊。</p></section></article></section>
          </template>
          <template v-else-if="activeProjectSubPage === 'onlineInteraction'">
            <section class="interaction-flow"><article class="parent"><strong>家长留言</strong><p>孩子最近晚饭后阅读时间较长，训练后说眼睛有点酸。</p><small>04月16日 20:10</small></article><article class="image-note"><span>训练记录照片 1 张</span></article><article class="doctor"><strong>医生回复</strong><p>建议训练后适当远眺 5 分钟，如持续眼酸可减少单次训练时长。</p><small>04月17日 09:30</small></article><article class="parent"><strong>家长回复</strong><p>收到，会按建议调整。</p><small>04月17日 10:05</small></article></section>
            <section class="interaction-input"><textarea placeholder="请输入留言"></textarea><div><button type="button" @click="uploadFamilyImage">上传图片</button><button type="button" @click="sendFamilyMessage">发送</button></div></section>
          </template>
          <template v-else-if="activeProjectSubPage === 'followSurvey'">
            <section class="follow-survey-list"><article v-for="item in followSurveyItems" :key="item.title"><div><strong>{{ item.title }}</strong><p>推送日期：{{ item.date }}</p></div><span :class="{ done: item.status === '已提交' }">{{ item.status }}</span></article></section>
            <section class="survey-question-card"><h3>4月随访问卷</h3><article><h4>最近一周每日户外活动是否达到 2 小时？</h4><div class="sub-options"><span>是</span><span>否</span><span class="selected">部分达到</span></div></article><article><h4>近距离用眼 30 分钟后是否能主动休息？</h4><div class="sub-options"><span>能</span><span class="selected">偶尔能</span><span>不能</span></div></article><article><h4>是否按要求完成家庭训练？</h4><div class="sub-options"><span>全部完成</span><span class="selected">部分完成</span><span>未完成</span></div></article><article><h4>是否出现眼酸、眼干或头痛？</h4><div class="sub-options"><span>无</span><span class="selected">偶尔</span><span>经常</span></div></article><textarea placeholder="备注说明"></textarea><button type="button" @click="submitFollowSurvey">提交随访问卷</button></section>
          </template>
          <template v-else-if="activeProjectSubPage === 'familyTrainingRecord'">
            <section class="today-training-card"><h3>今日训练记录</h3><div class="training-metrics"><p><em>户外活动</em><b>2 小时</b></p><p><em>远眺训练</em><b>3 次</b></p><p><em>眼保健操</em><b>1 次</b></p></div><div class="sub-options"><span class="selected">已完成</span><span>未完成</span></div><textarea placeholder="训练备注"></textarea><button class="upload-placeholder" type="button" @click="uploadFamilyImage">+ 上传图片</button><button class="primary full" type="button" @click="submitFamilyTrainingRecord">提交训练记录</button></section>
            <section class="history-training-list"><h3>历史训练记录</h3><p><span>04月16日</span><b>完成度：80%</b><em>已提交</em><small>完成户外活动，远眺训练少 1 次</small></p><p><span>04月17日</span><b>完成度：100%</b><em>已提交</em><small>全部完成</small></p><p><span>04月18日</span><b>完成度：--</b><em class="pending">未提交</em><small>暂无</small></p></section>
          </template>

          <p v-if="projectSubmitMessage" class="project-submit-tip">{{ projectSubmitMessage }}</p><p v-if="projectArchiveToast" class="project-submit-tip archive-toast">{{ projectArchiveToast }}</p>
          <div v-if="activeProjectSubPage === 'profile'" :class="['project-sub-bottom', 'profile-actions', projectProfileStatus]"><template v-if="projectProfileStatus === 'saved'"><button class="ghost" type="button" @click="editProjectProfile">编辑资料</button><button class="primary" type="button" @click="submitProjectProfile">提交建档信息</button></template><template v-else-if="projectProfileStatus === 'editing'"><button class="ghost" type="button" @click="cancelProjectProfileEdit">取消</button><button class="primary" type="button" @click="saveProjectProfileDraft">保存</button></template><template v-else><button class="ghost" type="button" @click="requestProjectProfileChange">申请修改</button><button class="primary" type="button" @click="backToProjectFlow">返回专案流程</button></template></div><div v-else-if="activeProjectSubPage === 'questionnaire'" :class="['project-sub-bottom', 'questionnaire-actions', projectQuestionnaireStatus]"><template v-if="projectQuestionnaireStatus === 'submitted'"><button class="ghost" type="button" @click="requestProjectQuestionnaireChange">申请修改</button><button class="primary" type="button" @click="backToProjectFlow">返回专案流程</button></template><template v-else><button class="ghost" type="button" @click="saveProjectQuestionnaireDraft">保存草稿</button><button class="primary" type="button" @click="submitProjectQuestionnaire">提交首诊问卷</button></template></div><div v-else-if="activeProjectSubPage === 'consent'" class="project-sub-bottom"><button class="primary full" type="button" :disabled="!consentSigned && !consentConfirmed" @click="confirmProjectConsent">{{ consentSigned ? '返回专案流程' : '确认签署' }}</button></div>
        </section>
        <section v-else-if="page === 'reports'" class="screen report-screen"><div v-if="reportsBackTarget === 'home'" class="page-title route-return-title"><button type="button" @click="backFromReports"><el-icon><ArrowLeft /></el-icon></button><h2>体检报告</h2></div>
          <article class="student-profile-card report-student-card">
            <div class="student-main-info"><div class="student-name-line"><h2>{{ currentStudent.name }}</h2><span>{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</span></div><p>{{ currentStudent.school }}｜{{ currentStudent.className }}</p></div>
            <div class="report-card-bottom"><div class="current-report-info"><span><em>体检日期：</em><b>{{ currentReport.date }}</b></span><span><em>筛查机构：</em><b>{{ currentReport.institution }}</b></span></div><div class="report-card-actions"><button class="switch-report-btn" type="button" @click="showReportSheet = true">切换报告 <b>›</b></button><button class="download-report-btn" type="button" @click="openDownloadSheet">下载报告 <b>↓</b></button></div></div>
          </article>
          <article class="assessment-card assessment-card-lite"><span :class="['pill', currentReport.assessment.tone, 'assessment-banner']">综合评估：{{ currentReport.assessment.text }}</span><div class="assessment-row"><div class="assessment-tags"><span class="risk-text">{{ currentReport.assessment.risk }}</span><span class="divider">｜</span><span class="rescreen-text">{{ currentReport.assessment.rescreen }}</span></div><button class="notice-link" type="button" @click="go('rescreen')">查看通知 &gt;</button></div></article>
          <section class="body-link-card body-health-card">
            <div class="body-health-header"><div class="section-title">五健健康画像</div><div class="abnormal-count">{{ abnormalItems.length }}项健康需关注</div></div>
            <div class="body-health-main">
              <div class="child-body body-map-container" aria-label="人体健康画像">
                <div class="body-map-bg"></div>
                <img class="body-image" :src="bodyImage" alt="人体健康画像" />
                <div v-for="item in visibleOverlays" :key="item.code" :class="['health-overlay', item.overlayClass, getOverlayClass(item)]"></div>
              </div>
              <div class="health-status-list" aria-label="五健状态">
                <button v-for="item in healthItems" :key="item.code" type="button" :class="['health-status-btn', item.tone, { active: selectedHealth === item.code }]" @click="selectedHealth = item.code">
                  <span class="health-name">{{ item.navName }}</span><span class="health-status">{{ item.status }}</span>
                </button>
              </div>
            </div>
            <div class="active-health-summary">
              <div class="summary-header"><div class="summary-heading"><span class="summary-title">{{ activeHealthShortName }}</span><span :class="['risk-tag', activeHealth.tone]">{{ activeHealth.status }}</span></div><button class="detail-link summary-detail-link" type="button" @click="showHealthDetailSheet = true">{{ activeHealth.code === 'mental' ? '去填写' : '查看详情' }} &gt;</button></div>
              <div class="summary-text">异常值：{{ activeHealthAbnormalText }}</div>
            </div>
          </section>
          <section class="report-section abnormal-summary-section">
            <div class="report-section-head"><h3>异常指标汇总</h3><span>共{{ abnormalItems.length }}项异常</span></div>
            <p class="risk-stat-text">{{ abnormalSummaryText }}</p>
            <div class="abnormal-summary-list">
              <button v-for="item in sortedAbnormalItems" :key="item.id" type="button" :class="['abnormal-summary-row', item.level]" @click="openHealthDetail(item.healthCode)">
                <i></i>
                <span class="summary-main"><strong>{{ item.name }}</strong><small>{{ item.specialty }}</small></span>
                <span class="summary-values"><b>{{ item.result }}</b><small>参考 {{ item.reference }}</small></span>
                <em>{{ riskLevelMeta[item.level].label }}</em>
                <span class="row-arrow">›</span>
              </button>
            </div>
          </section>

          <section class="report-section interpretation-section">
            <div class="report-section-head"><h3>整体解读与建议</h3></div>
            <p class="interpretation-text">{{ interpretation.text }}</p>
            <ol class="action-list">
              <li v-for="item in visibleAdviceActions" :key="item">{{ item }}</li>
            </ol>
            <button class="section-toggle" type="button" @click="showAllAdvice = !showAllAdvice">{{ showAllAdvice ? '收起' : '展开全部' }}</button>
          </section>

          <section class="report-section exam-results-section">
            <div class="exam-results-head"><h3>全部体检项目与结果</h3><div class="exam-result-controls"><button class="toggle-all-groups" type="button" :disabled="!hasVisibleExamGroups" @click="toggleAllVisibleResultGroups"><span class="toggle-icon-stack"><el-icon><component :is="allVisibleResultGroupsExpanded ? ArrowUpBold : ArrowDownBold" /></el-icon><el-icon><component :is="allVisibleResultGroupsExpanded ? ArrowUpBold : ArrowDownBold" /></el-icon></span>{{ resultGroupToggleText }}</button><label class="switch-row"><input v-model="onlyAbnormal" type="checkbox" />仅看异常</label></div></div>
            <div v-if="!hasVisibleExamGroups" class="result-empty">暂无异常项目</div>
            <div v-else class="result-group-list">
              <article v-for="group in visibleExamGroups" :key="group.code" class="result-group">
                <button class="result-group-head" type="button" @click="toggleResultGroup(group.code)">
                  <span><strong>{{ group.name }}</strong><small>{{ getGroupSummary(group) }}</small></span>
                  <b>{{ expandedResultGroups.includes(group.code) ? '−' : '+' }}</b>
                </button>
                <div v-if="expandedResultGroups.includes(group.code)" class="result-items">
                  <div v-for="row in group.visibleItems" :key="row.name" class="result-item">
                    <div class="result-line"><strong>{{ row.name }}</strong><span :class="['result-status', row.level]">{{ row.status }}</span></div>
                    <div class="result-meta"><b :class="row.level !== 'normal' ? row.level : ''">{{ row.result }}</b><small>参考范围：{{ row.reference }}</small></div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>

        <section v-else-if="page === 'aiTest'" class="screen ai-test-screen">
          <div class="page-title route-return-title"><h2>AI自测</h2></div>
          <article class="ai-student-card"><div><strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong><p>当前儿童</p></div></article>
          <button class="ai-test-entry" type="button" @click="go('heightWeightTest')"><span><strong>身高体重自测</strong></span><em>开始自测 &gt;</em></button>
          <button class="ai-test-entry" type="button" @click="go('nutritionSurvey')"><span><strong>营养调查</strong></span><em>开始自测 &gt;</em></button>
          <p class="ai-test-note">自测结果仅供家长参考，不能替代医生诊断。</p>
        </section>

        <section v-else-if="page === 'heightWeightTest'" class="screen ai-test-sub-screen">
          <div class="page-title project-subpage-title"><button type="button" @click="backFromAiTestSubPage"><el-icon><ArrowLeft /></el-icon></button><h2>身高体重自测</h2><span class="top-placeholder"></span></div>
          <article class="ai-student-card"><div><strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong></div><span>生长发育</span></article>
          <section class="ai-form-card"><h3>输入信息</h3><label>性别<div class="sub-options"><span class="selected">男</span><span>女</span></div></label><label>出生年月<input value="2016-04" /></label><div class="ai-input-grid"><label>身高<div class="unit-input"><input value="142" inputmode="decimal" /><b>cm</b></div></label><label>体重<div class="unit-input"><input value="39" inputmode="decimal" /><b>kg</b></div></label></div><button class="primary full" type="button" @click="showHeightWeightResult">生成评价结果</button></section>
          <section v-if="heightWeightResultVisible" class="ai-result-card"><div class="ai-result-head"><strong>评价结果</strong><span>正常</span></div><div class="ai-result-text"><p><b>BMI：</b>19.3</p><p><b>身高评价：</b>正常</p><p><b>体重评价：</b>正常</p><p><b>生长发育评价：</b>处于同年龄段正常范围</p><h3>建议</h3><p>继续保持规律饮食、充足睡眠和适量运动。</p></div></section>
          <p class="ai-test-note">自测结果仅供家长参考，如对儿童生长发育有疑问，请咨询专业医生。</p>
        </section>

        <section v-else-if="page === 'nutritionSurvey'" class="screen ai-test-sub-screen">
          <div class="page-title project-subpage-title"><button type="button" @click="backFromAiTestSubPage"><el-icon><ArrowLeft /></el-icon></button><h2>营养调查</h2><span class="top-placeholder"></span></div>
          <article class="ai-student-card"><div><strong>{{ currentStudent.name }}｜{{ currentStudent.gender }}｜{{ currentStudent.age }}岁</strong></div><span>营养风险</span></article>
          <section class="ai-info-card"><p>请根据儿童近一周饮食和生活情况填写，系统将生成营养风险评价。</p></section>
          <section class="nutrition-question-card"><h3>营养问卷</h3><article><h4>最近一周是否每天吃早餐？</h4><div class="sub-options"><span class="selected">每天</span><span>偶尔不吃</span><span>经常不吃</span></div></article><article><h4>每日是否摄入蔬菜和水果？</h4><div class="sub-options"><span>充足</span><span class="selected">一般</span><span>较少</span></div></article><article><h4>是否每天饮用奶类或摄入奶制品？</h4><div class="sub-options"><span>每天</span><span class="selected">偶尔</span><span>很少</span></div></article><article><h4>是否经常摄入甜食或含糖饮料？</h4><div class="sub-options"><span>很少</span><span class="selected">每周1-2次</span><span>每周3次以上</span><span>几乎每天</span></div></article><article><h4>肉、蛋、鱼等优质蛋白摄入情况？</h4><div class="sub-options"><span>充足</span><span class="selected">一般</span><span>较少</span></div></article><article><h4>是否存在明显挑食或偏食？</h4><div class="sub-options"><span>无</span><span class="selected">偶尔</span><span>明显</span></div></article><article><h4>运动和睡眠是否规律？</h4><div class="sub-options"><span>规律</span><span class="selected">一般</span><span>不规律</span></div></article><button class="primary full" type="button" @click="showNutritionResult">生成营养评价</button></section>
          <section v-if="nutritionResultVisible" class="ai-result-card nutrition-result-card"><div class="ai-result-head"><strong>营养评价结果</strong><span class="warning">中风险</span></div><div class="ai-result-text"><p><b>营养风险等级：</b>中风险</p><h3>主要问题</h3><p>蔬菜水果摄入不足；奶类摄入不足；含糖饮料摄入偏多。</p><h3>改善建议</h3><p>建议每日保证蔬菜水果摄入，补充奶类或奶制品，减少含糖饮料和高糖零食，保持规律早餐和充足睡眠。</p></div></section>
        </section>

        <section v-else-if="page === 'students'" class="screen students-screen"><div class="page-title"><button type="button" @click="backFromStudents"><el-icon><ArrowLeft /></el-icon></button><h2>就诊人管理</h2></div><article v-for="item in students" :key="item.id" class="student-card student-manage-card"><div class="student-manage-info"><div class="student-card-title"><strong>{{ item.name }}</strong><span v-if="item.default">默认学生</span></div><p>{{ item.age }} 岁</p><p>{{ item.school }}｜{{ item.className }}</p></div><div class="student-actions"><button v-if="!item.default" type="button" class="student-action-default" @click="switchStudent(item.id)">设为默认</button><span v-else class="student-action-default current">默认学生</span><button type="button" @click="editStudent(item.id)">编辑</button><button type="button" class="danger" @click="requestDeleteStudent(item.id)">删除</button></div></article><button :class="['primary full add-student-btn', { muted: showBindForm }]" type="button" @click="openBindForm">添加学生</button><article v-if="showBindForm" class="form-card bind-student-form"><header><div><strong>绑定学生信息</strong><p>请填写学生身份信息，确认后完成绑定</p></div><button type="button" @click="requestCancelBind">取消添加</button></header><label>学生姓名<input v-model="bindForm.name" /><small v-if="bindErrors.name" class="field-error">{{ bindErrors.name }}</small></label><label>身份证号 / 学号<input v-model="bindForm.code" /><small v-if="bindErrors.identity" class="field-error">{{ bindErrors.identity }}</small></label><label>就诊卡号<input v-model="bindForm.cardNo" /></label><label>所属学校<input v-model="bindForm.school" /></label><label>所属班级<input v-model="bindForm.className" /></label><label>家长手机号<input v-model="bindForm.phone" inputmode="tel" /></label><button class="primary full" type="button" @click="confirmBind">确认绑定学生</button></article></section>

        <section v-else-if="page === 'studentEdit'" class="screen student-edit-screen"><div class="page-title"><button type="button" @click.stop.prevent="openStudentsManager()"><el-icon><ArrowLeft /></el-icon></button><h2>编辑就诊人</h2></div><article class="form-card profile-form-card"><label>学生姓名<input v-model="editingStudent.name" /></label><label>学校<input v-model="editingStudent.school" /></label><label>班级<input v-model="editingStudent.className" /></label><label>年龄<input v-model="editingStudent.age" /></label><button class="primary full" type="button" @click.stop.prevent="openStudentsManager()">保存</button></article></section>

        <section v-else-if="page === 'signup'" class="screen signup-screen"><div class="page-title"><button type="button" @click="go('home')"><el-icon><ArrowLeft /></el-icon></button><h2>体检报名</h2></div><article class="signup-plan-card signup-notice-card"><div class="signup-card-head"><span class="pill normal">{{ planStatusLabel }}</span><strong>{{ examPlan.name }}</strong></div><div class="signup-info-grid"><span><em>学校：</em><b>{{ examPlan.school }}</b></span><span><em>体检日期：</em><b>{{ examPlan.date }}</b></span><span><em>体检地点：</em><b>{{ examPlan.place }}</b></span><span><em>报名截止：</em><b>{{ examPlan.deadline }}</b></span></div></article><article class="signup-section base-project-card notice-project-card"><div class="signup-section-title"><strong>本次筛查项目</strong></div><p>以下项目由学校统一安排，免费参加。</p><div class="notice-project-list"><section v-for="group in baseScreeningTagGroups" :key="group.type" :class="['notice-project-group', group.type.includes('体格') ? 'physical' : group.type.includes('视力') ? 'vision' : group.type.includes('脊柱') ? 'spine' : group.type.includes('口腔') ? 'oral' : 'mental']"><h3><i></i>{{ group.type }}</h3><div class="notice-project-tags"><span v-for="item in group.tags" :key="item">{{ item }}</span></div></section></div></article><article class="signup-section student-confirm-card"><div class="signup-section-title"><strong>学生信息确认</strong></div><div class="student-confirm-list"><p><em>学生姓名</em><b>{{ currentStudent.name }}</b></p><p><em>学校班级</em><b>{{ currentStudent.school }}｜{{ currentStudent.className }}</b></p><p><em>联系电话</em><b>13800001234</b></p></div><label class="student-remark-field">备注<textarea placeholder="可填写既往病史、特殊情况等"></textarea></label></article><article class="signup-section paid-project-section"><div class="signup-section-title"><strong>自费项目</strong><button type="button" @click="paidProjectsExpanded = !paidProjectsExpanded">{{ paidProjectsExpanded ? '收起' : '展开' }}</button></div><p class="paid-inline-tip">自费项目随本次体检一同安排，可在 {{ examPlan.deadline }} 前选择或调整。</p><p v-if="!paidProjectsExpanded" class="paid-collapsed-summary">{{ selectedPaidProjects.length ? '已选 ' + selectedPaidProjects.length + ' 项，合计 ￥' + paidTotal : '暂未选择自费项目' }}</p><template v-if="paidProjectsExpanded"><div class="paid-category-tabs"><button v-for="tab in paidCategoryTabs" :key="tab.key" type="button" :class="{ active: activePaidCategory === tab.key }" @click="activePaidCategory = tab.key">{{ tab.label }}</button></div><div class="paid-group-list"><section v-for="group in visiblePaidProjectGroups" :key="group.key" class="paid-group"><div class="paid-group-title"><strong>{{ group.name }}</strong><span>{{ group.projects.length }}项</span></div><button v-for="project in group.projects" :key="project.id" type="button" :class="['paid-project-row', { selected: selectedPaidProjectIds.includes(project.id), disabled: !canEditPaidProjects }]" @click="togglePaidProject(project.id)"><i>{{ selectedPaidProjectIds.includes(project.id) ? '✓' : '' }}</i><span>{{ project.name }}</span><b>￥{{ project.price }}</b></button></section></div></template></article><article v-if="selectedPaidProjects.length || paidOrderStatus !== 'none'" class="signup-section order-summary-card"><div class="signup-section-title"><strong>自费订单</strong><span>{{ orderStatusLabel }}</span></div><p>体检日期：{{ examPlan.date }}</p><div class="order-items"><span v-for="item in selectedPaidProjects" :key="item.id">{{ item.name }} ￥{{ item.price }}</span></div><strong>合计：￥{{ paidTotal }}</strong></article><div class="signup-bottom-bar"><div><span>已选 {{ selectedPaidProjects.length }} 项</span><strong>￥{{ paidTotal }}</strong></div><button v-if="!baseSignupDone" class="primary" type="button" @click="confirmBaseSignup">确认基础报名</button><button v-else-if="selectedPaidProjects.length && paidOrderStatus !== 'paid' && paidOrderStatus !== 'refunding'" class="primary" type="button" @click="openPayConfirm">提交自费订单并支付</button><button v-else-if="paidOrderStatus === 'paid'" class="ghost" type="button" @click="requestRefund">申请整单退款</button><button v-else-if="paidOrderStatus === 'refunding'" class="primary" type="button" @click="finishRefund">模拟退款成功</button><button v-else class="ghost" type="button" @click="scrollToPaidProjects">选择自费项目</button></div></section>

        <section v-else-if="page === 'questionnaires'" class="screen questionnaires-screen"><div class="page-title route-return-title"><button v-if="questionnairesBackTarget === 'home'" type="button" @click="backFromQuestionnaires"><el-icon><ArrowLeft /></el-icon></button><h2>问卷量表</h2></div><article v-for="item in questionnaires" :key="item.name" class="list-card questionnaire-card"><div class="questionnaire-card-main"><strong>{{ item.name }}</strong><p>截止日期：{{ item.due }}</p></div><div class="questionnaire-card-actions"><span :class="['questionnaire-status', questionnaireStatusClass(item.status)]">{{ item.status }}</span><button type="button" @click="go('questionnaireForm')">{{ questionnaireActionLabel(item.status) }}</button></div></article></section>

        <section v-else-if="page === 'questionnaireForm'" class="screen question-screen"><div class="page-title"><button type="button" @click="backFromQuestionnaireForm"><el-icon><ArrowLeft /></el-icon></button><h2>生活习惯问卷</h2></div><template v-if="!submittedQuestionnaire"><div class="progress"><span :style="{ width: progress + '%' }"></span></div><article class="question-card"><small>{{ questionnaireIndex + 1 }} / {{ questions.length }}</small><h2>{{ currentQuestion.title }}</h2><label v-for="option in currentQuestion.options" :key="option" :class="['option', { selected: questionnaireAnswers[questionnaireIndex] === option }]"><input v-model="questionnaireAnswers[questionnaireIndex]" type="radio" :name="'q-' + questionnaireIndex" :value="option" /><span>{{ option }}</span></label><textarea v-if="currentQuestion.type === 'text'" placeholder="请填写补充说明"></textarea></article><div class="fixed-actions"><button type="button" @click="questionnaireIndex = Math.max(0, questionnaireIndex - 1)">上一题</button><button class="primary" type="button" @click="questionnaireIndex === questions.length - 1 ? submitQuestionnaire() : questionnaireIndex++">{{ questionnaireIndex === questions.length - 1 ? '提交' : '下一题' }}</button></div></template><article v-else class="success-card"><strong>提交成功</strong><p>问卷已提交，医生将结合筛查结果综合评估。</p><button class="primary full" type="button" @click="go('home')">返回首页</button></article></section>

        <section v-else-if="page === 'rescreen'" class="screen rescreen-screen"><div class="page-title"><button type="button" @click="backFromRescreen"><el-icon><ArrowLeft /></el-icon></button><h2>复筛通知</h2></div><article class="rescreen-notice-card"><div class="rescreen-title-row"><span class="rescreen-status">待复筛</span><strong>复筛通知</strong></div><div class="rescreen-info-list"><p><b>学生姓名：</b>{{ currentStudent.name }}</p><p><b>通知来源：</b>第一实验小学 / 妇幼保健院</p><p><b>复筛项目：</b>视力、脊柱</p><p><b>复筛时间：</b>2026-04-18 09:00</p><p><b>复筛地点：</b>儿童保健科</p><p><b>联系电话：</b>010-66886688</p></div></article><article class="rescreen-detail-card"><strong>复筛详情</strong><p><b>异常原因：</b>左眼裸眼视力下降，筛查提示脊柱姿态需进一步复核。</p><p><b>注意事项：</b>请携带学生证件，提前 10 分钟到达；如近期已完成眼科或骨科检查，可携带相关资料。</p></article></section>

        <section v-else-if="page === 'articleDetail'" class="screen">
          <div class="page-title"><button type="button" @click="go('home')"><el-icon><ArrowLeft /></el-icon></button><h2>宣教详情</h2></div>
          <article class="article-detail"><span class="pill normal">{{ selectedArticle.tag }}</span><h1>{{ selectedArticle.title }}</h1><p>发布时间：2026-04-13 · {{ selectedArticle.views }} 阅读</p><p>家长可先观察孩子近期用眼、运动和睡眠情况。若筛查报告提示异常，应按建议完成复筛，不建议仅凭一次筛查结果自行判断病情。</p><p>本文适用于“视力异常”学生家长阅读。</p><button class="primary full" type="button">我已阅读</button></article>
        </section>

        <section v-else-if="page === 'messages'" class="screen">
          <div class="page-title"><button type="button" @click="go(activeTab)"><el-icon><ArrowLeft /></el-icon></button><h2>消息通知</h2></div>
          <button v-for="item in messages" :key="item.title" class="message-card" type="button" @click="go(item.target)"><span :class="{ unread: item.unread }"></span><strong>{{ item.title }}</strong><p>{{ item.text }}</p><small>{{ item.time }} · {{ currentStudent.name }}</small></button>
        </section>

        <section v-else-if="page === 'profile'" class="screen profile-screen"><div class="page-title"><button type="button" @click="go('mine')"><el-icon><ArrowLeft /></el-icon></button><h2>个人信息管理</h2></div><article class="form-card profile-form-card"><label>姓名<input v-model="parentProfile.name" /></label><label>手机号<input v-model="parentProfile.phone" /></label><label>与孩子关系<select v-model="parentProfile.relation"><option>母亲</option><option>父亲</option><option>祖父母</option><option>其他</option></select></label><label>当前绑定就诊人<input :value="currentStudent.name + '｜' + currentStudent.className" readonly /></label><button class="primary full" type="button" @click="saveParentProfile">保存</button><p v-if="parentProfileSaved" class="save-tip">保存成功</p></article></section>

        <section v-else-if="page === 'mine'" class="screen mine-screen"><article class="mine-card mine-profile-card"><strong>{{ parentProfile.name }}</strong><p>手机号：{{ parentProfile.phone }}</p><p>当前就诊人：{{ currentStudent.name }}｜{{ currentStudent.className }}</p></article><button class="mine-row" type="button" @click="go('profile')">个人信息管理</button><button class="mine-row" type="button" @click.stop.prevent="openStudentsManager()">就诊人管理</button><button class="mine-row" type="button" @click="go('messages')">消息通知</button><button class="logout" type="button" @click="logout">退出登录</button></section>
      </div>


      <section v-if="pendingBindAction" class="child-sheet-mask" @click.self="continueBindForm"><article class="child-sheet result-sheet bind-confirm-sheet"><header><strong>{{ pendingBindAction === 'cancel' ? '放弃本次绑定？' : '当前绑定信息尚未提交' }}</strong><button type="button" @click="continueBindForm">×</button></header><p>{{ pendingBindAction === 'cancel' ? '已填写的信息将不会保存。' : '离开后将清空已填写内容，是否继续？' }}</p><button class="ghost full" type="button" @click="continueBindForm">继续填写</button><button class="danger full" type="button" @click="discardBindForm">{{ pendingBindAction === 'cancel' ? '放弃' : '离开' }}</button></article></section>
      <section v-if="pendingDeleteStudent" class="child-sheet-mask" @click.self="cancelDeleteStudent"><article class="child-sheet result-sheet delete-student-sheet"><header><strong>确认删除该就诊人？</strong><button type="button" @click="cancelDeleteStudent">×</button></header><p>删除后将不再展示该学生的报告、问卷和复筛通知入口。</p><p v-if="pendingDeleteStudent.default" class="delete-warning">该学生为默认就诊人，删除后请重新设置默认就诊人。</p><button class="danger full" type="button" @click="confirmDeleteStudent">确认删除</button><button class="ghost full" type="button" @click="cancelDeleteStudent">取消</button></article></section>
      <section v-if="showBaseSignupSuccess" class="child-sheet-mask" @click.self="showBaseSignupSuccess = false"><article class="child-sheet result-sheet"><header><strong>基础报名成功</strong><button type="button" @click="showBaseSignupSuccess = false">×</button></header><p>已确认参加本次免费基础筛查，自费项目可在截止时间前继续选择。</p><button class="primary full" type="button" @click="scrollToPaidProjects">继续选择自费项目</button></article></section>
      <section v-if="showPayConfirm" class="child-sheet-mask" @click.self="showPayConfirm = false"><article class="child-sheet result-sheet"><header><strong>自费订单确认</strong><button type="button" @click="showPayConfirm = false">×</button></header><p>已选 {{ selectedPaidProjects.length }} 项，合计 ￥{{ paidTotal }}。</p><button class="primary full" type="button" @click="finishWechatPay">微信支付</button><button class="ghost full" type="button" @click="showPayConfirm = false">取消</button></article></section>
      <section v-if="showPaySuccess" class="child-sheet-mask" @click.self="showPaySuccess = false"><article class="child-sheet result-sheet"><header><strong>支付成功</strong><button type="button" @click="showPaySuccess = false">×</button></header><p>自费项目已支付，将随本次体检计划一同安排。</p><button class="primary full" type="button" @click="showPaySuccess = false">知道了</button></article></section>
      <section v-if="showRefundConfirm" class="child-sheet-mask" @click.self="showRefundConfirm = false"><article class="child-sheet result-sheet"><header><strong>申请整单退款</strong><button type="button" @click="showRefundConfirm = false">×</button></header><p>退款只影响自费订单，不影响基础筛查报名。</p><button class="primary full" type="button" @click="confirmRefunding">确认退款</button><button class="ghost full" type="button" @click="showRefundConfirm = false">取消</button></article></section>
      <section v-if="showRefundSuccess" class="child-sheet-mask" @click.self="showRefundSuccess = false"><article class="child-sheet result-sheet"><header><strong>退款成功</strong><button type="button" @click="showRefundSuccess = false">×</button></header><p>自费项目已恢复可选，可在截止时间前重新选择。</p><button class="primary full" type="button" @click="scrollToPaidProjects">重新选择</button></article></section>

      <section v-if="showHealthDetailSheet" class="health-sheet-mask" @click.self="showHealthDetailSheet = false" @wheel.prevent @touchmove.self.prevent>
        <article class="health-detail-sheet" role="dialog" aria-modal="true" aria-label="五健结果详情">
          <div class="sheet-top-fixed">
            <div class="sheet-health-tabs" aria-label="切换五健专项">
              <button v-for="item in healthItems" :key="item.code" type="button" :class="['sheet-health-tab', item.tone, { active: item.code === activeHealthCode }]" @click="selectedHealth = item.code">
                <span class="tab-name">{{ item.navName }}</span>
              </button>
            </div>
            <div class="sheet-header">
              <div class="sheet-title-row"><div class="sheet-title">{{ activeHealth.navName }}</div><span :class="['risk-tag', activeHealth.tone]">{{ activeHealth.status }}</span></div>
              <button class="sheet-close-light" type="button" aria-label="关闭详情" @click="showHealthDetailSheet = false">×</button>
            </div>
          </div>
          <div class="sheet-scroll-body">
            <section class="detail-block conclusion-block">
              <div class="block-title">当前结论</div>
              <div class="block-content strong-content">{{ activeHealth.description }}</div>
            </section>
            <section class="detail-block abnormal-block">
              <div class="block-title">异常指标</div>
              <div class="block-content strong-content">{{ activeHealthAbnormalText }}</div>
            </section>
            <section class="detail-block advice-block">
              <div class="block-title">健康建议</div>
              <div class="block-content advice-text">{{ activeHealth.advice }}</div>
            </section>
            <section class="detail-block compact-info-block">
              <div class="block-title">检查信息</div>
              <div class="check-table">
                <div class="check-table-head"><span>检查结果</span><span>参考范围</span></div>
                <div v-for="row in activeHealthCheckRows" :key="row.key" class="check-table-row"><span>{{ row.result }}</span><span>{{ row.reference }}</span></div>
              </div>
            </section>
          </div>
        </article>
      </section>
      <section v-if="showReportSheet" class="child-sheet-mask report-select-mask" @click.self="showReportSheet = false">
        <article class="child-sheet report-select-sheet">
          <header><strong>选择体检报告</strong><button type="button" @click="showReportSheet = false">×</button></header>
          <button v-for="item in reportCatalog" :key="item.reportId" type="button" :class="['report-option', { active: item.reportId === currentReportId }]" @click="selectReport(item.reportId)">
            <span><b>{{ item.name }}</b><small>{{ item.date }}｜{{ item.institution }}</small></span><em>{{ item.reportId === currentReportId ? '当前' : item.status }}</em>
          </button>
        </article>
      </section>
      <section v-if="showDownloadSheet" class="child-sheet-mask download-sheet-mask" @click.self="!downloadGenerating && (showDownloadSheet = false)">
        <article class="child-sheet download-sheet">
          <header><strong>下载体检报告</strong><button type="button" :disabled="downloadGenerating" @click="showDownloadSheet = false">×</button></header>
          <button class="download-option" type="button" :disabled="downloadGenerating" @click="generateReportDownload('pdf')"><el-icon><Document /></el-icon><span><b>下载PDF报告</b><small>{{ reportFileBaseName }}.pdf</small></span></button>
          <button class="download-option" type="button" :disabled="downloadGenerating" @click="generateReportDownload('image')"><el-icon><Download /></el-icon><span><b>保存报告图片</b><small>{{ reportFileBaseName }}.png</small></span></button>
          <p v-if="downloadMessage" :class="['download-message', downloadStatus]">{{ downloadMessage }}</p>
          <button v-if="downloadStatus === 'error'" class="retry-download" type="button" @click="retryDownload">重新生成</button>
          <button class="cancel-download" type="button" :disabled="downloadGenerating" @click="showDownloadSheet = false">取消</button>
        </article>
      </section>
            <section v-if="activeFlowNode" class="child-sheet-mask flow-node-mask" @click.self="closeFlowNode">
        <article class="child-sheet flow-node-sheet">
          <header><strong>{{ activeFlowNode.title }}</strong><button type="button" @click="closeFlowNode">×</button></header>
          <p>{{ activeFlowNode.desc }}</p>
          <button class="primary full" type="button" @click="confirmFlowNodeAction">{{ flowActionLabel(activeFlowNode) }}</button>
        </article>
      </section>
      <section v-if="showProjectSheet" class="child-sheet-mask project-sheet-mask" @click.self="showProjectSheet = false">
        <article class="child-sheet project-select-sheet">
          <header><strong>选择专案</strong><button type="button" @click="showProjectSheet = false">×</button></header>
          <div class="project-option-list">
            <button v-for="item in specialProjects" :key="item.id" :class="['project-option', { active: item.id === currentProject.id }]" type="button" @click="selectSpecialProject(item.id)">
              <i>{{ item.id === currentProject.id ? '✓' : '' }}</i>
              <span><b>{{ item.name }}</b><small>{{ item.type }}｜{{ item.status }}</small></span>
              <em>{{ item.status }}</em>
            </button>
          </div>
        </article>
      </section>
      <section v-if="showChildSheet" class="child-sheet-mask" @click.self="showChildSheet = false">
        <article class="child-sheet">
          <header><strong>选择就诊人</strong><button type="button" @click="showChildSheet = false">×</button></header>
          <button v-for="item in students" :key="item.id" type="button" class="child-option" @click="switchStudent(item.id)"><span><b>{{ item.name }}｜{{ item.className }}</b><small>{{ item.id === selectedStudentId ? '当前' : '点击切换' }}</small></span><em v-if="item.id === selectedStudentId">当前</em></button>
          <button class="add-child" type="button" @click.stop.prevent="openStudentsManager()">+ 添加就诊人</button>
        </article>
      </section>
      <section v-if="activeReportDoc" class="report-image-viewer" @click.self="closeReportDoc">
        <button class="viewer-close" type="button" aria-label="关闭图文报告" @click="closeReportDoc"><el-icon><ArrowLeft /></el-icon></button>
        <section class="viewer-image-stage" @touchstart="onReportTouchStart" @touchmove.prevent="onReportTouchMove" @touchend="onReportTouchEnd" @touchcancel="onReportTouchEnd">
          <img :src="activeReportDoc.image" :alt="activeReportDoc.name" :style="reportImageStyle" />
        </section>
      </section>
      <nav v-if="isLoggedIn && !activeReportDoc" class="bottom-tabs">
        <button v-for="item in [
          { k: 'home', t: '首页', i: House },
          { k: 'project', t: '专案', i: Document },
          { k: 'aiTest', t: 'AI自测', i: FirstAidKit },
          { k: 'mine', t: '我的', i: User },
        ]" :key="item.k" type="button" :class="{ active: activeTab === item.k }" @click="tabTo(item.k)"><el-icon><component :is="item.i" /></el-icon><span>{{ item.t }}</span></button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.parent-demo{min-height:100vh;padding:24px;background:#fff;font-family:"Microsoft YaHei",Arial,sans-serif;color:#20313b}.phone-shell{width:min(390px,100%);height:calc(100vh - 48px);min-height:720px;margin:auto;position:relative;overflow:hidden;border-radius:30px;background:#f3f8f6;box-shadow:0 24px 70px rgba(27,65,76,.24)}.phone-top{height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #e5efeb}.phone-top strong{font-size:17px}.phone-top button,.page-title button,.plain,.back{width:34px;height:34px;border:0;border-radius:50%;display:grid;place-items:center;background:#eef8f4;color:#14936f}.phone-content{height:calc(100% - 118px);overflow:auto;padding:14px 14px 26px}.login-content{height:calc(100% - 54px);padding:0 18px 24px;background:linear-gradient(180deg,#e4f8f1 0,#f3f8f6 42%,#f3f8f6 100%)}.screen{display:flex;flex-direction:column;gap:12px}.login-screen{min-height:100%;display:flex;flex-direction:column;justify-content:center;gap:18px}.login-hero span{color:#14936f;font-weight:700;font-size:13px}.login-hero h1{margin:10px 0 8px;font-size:30px}.login-hero p{margin:0;color:#5f7378;line-height:1.65}.login-card,.summary-card,.detail-card,.student-card,.form-card,.list-card,.report-card,.abnormal-card,.advice-card,.question-card,.success-card,.mine-card,.article-detail,.student-profile-card,.assessment-card,.body-link-card,.selected-health-card,.history-row{padding:15px;border-radius:16px;background:#fff;box-shadow:0 8px 24px rgba(40,80,75,.07)}.login-card{display:flex;flex-direction:column;gap:14px}.login-card label,.form-card label{display:flex;flex-direction:column;gap:7px;color:#52636a;font-size:13px}.code-row{display:grid;grid-template-columns:minmax(0,1fr) 102px;gap:8px}.code-row button{border:0;border-radius:12px;color:#128366;background:#e7f7f1;font-weight:700}.login-card small{color:#8a989d;text-align:center}.login-tips{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.login-tips span{height:34px;border-radius:999px;background:rgba(255,255,255,.72);display:grid;place-items:center;color:#4f696f;font-size:12px}h1,h2,h3,p{margin:0}h2{font-size:20px}h3{font-size:16px}.welcome{padding:18px;border-radius:18px;color:#fff;background:linear-gradient(135deg,#13a87d,#43c6b8);display:flex;justify-content:space-between;align-items:center}.welcome div{display:flex;flex-direction:column;gap:5px}.welcome span{font-size:13px;opacity:.9}.welcome strong{font-size:19px}.welcome button{height:34px;padding:0 10px;border:0;border-radius:18px;background:rgba(255,255,255,.22);color:#fff;display:flex;align-items:center;gap:4px}.section-head{display:flex;justify-content:space-between;align-items:flex-end}.section-head p,.list-card p,.detail-card p,.student-card p,.article-detail p,.student-profile-card p,.history-row span{color:#6d7b83;font-size:13px;line-height:1.6}.section-head button{border:0;background:transparent;color:#13936f}.todo-grid,.shortcut-grid,.slot-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.todo-grid button,.shortcut-grid button,.slot-grid button{border:0;border-radius:15px;background:#fff;min-height:68px;box-shadow:0 8px 18px rgba(40,80,75,.06)}.todo-grid strong{display:block;color:#13a87d;font-size:24px}.todo-grid span,.shortcut-grid span{color:#5d6c74}.home-article-list{display:flex;flex-direction:column;gap:10px}.home-article,.edu-card{width:100%;border:0;border-radius:16px;background:#fff;padding:10px;display:flex;gap:12px;text-align:left;box-shadow:0 8px 18px rgba(40,80,75,.06)}.home-article b,.edu-card b{width:78px;height:62px;border-radius:13px;flex:none}.cover-vision{background:linear-gradient(135deg,#ccefff,#e9f8ff)}.cover-weight{background:linear-gradient(135deg,#ffe5bd,#fff5df)}.cover-soft{background:linear-gradient(135deg,#d8f2e7,#eef8f4)}.home-article span{display:flex;flex-direction:column;gap:6px}.home-article small,.edu-card small,.message-card small{color:#819098}.home-article em{align-self:flex-start;padding:3px 7px;border-radius:999px;color:#128366;background:#e6f7f0;font-size:12px;font-style:normal}.topic-strip{display:flex;gap:10px;overflow:auto;padding-bottom:4px}.topic-card{min-width:132px;min-height:86px;border:0;border-radius:18px;padding:14px;text-align:left;color:#234;display:flex;flex-direction:column;justify-content:space-between}.topic-card span{font-size:12px;line-height:1.4;color:#587}.topic-card.vision{background:#e9f7ff}.topic-card.weight{background:#fff1dc}.topic-card.spine{background:#eaf2ff}.topic-card.oral{background:#e8f8ef}.topic-card.mental{background:#f2ecff}.shortcut-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.shortcut-grid button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}.shortcut-grid .el-icon{font-size:22px;color:#13a87d}.page-title{display:flex;align-items:center;gap:10px}.student-card,.list-card{display:flex;align-items:center;justify-content:space-between;gap:10px}.student-card div,.list-card div{min-width:0}.student-card button,.list-card button{border:0;border-radius:18px;padding:8px 11px;color:#159573;background:#e9f8f2;white-space:nowrap}.student-card button.active{color:#fff;background:#13a87d}.primary,.ghost,.logout{border:0;border-radius:14px;height:42px;padding:0 18px;font-weight:700}.primary{color:#fff;background:#13a87d}.ghost{color:#128366;background:#e7f7f1}.full{width:100%}.form-card{display:flex;flex-direction:column;gap:10px}input,textarea{width:100%;border:1px solid #e0ebe7;border-radius:12px;padding:11px;background:#f9fcfb;font:inherit}textarea{min-height:84px;resize:none}.pill{padding:4px 8px;border-radius:999px;font-size:12px}.normal{color:#0d8f68;background:#e5f8f0}.low{color:#2478c9;background:#e7f2ff}.medium{color:#c76d12;background:#fff2de}.high{color:#cf3f3f;background:#ffe8e8}.pending{color:#7c58bc;background:#f1eaff}.student-profile-card{display:grid;grid-template-columns:1fr auto;gap:10px}.student-profile-card h2{font-size:22px}.student-profile-card span{text-align:right;color:#5f7378;font-size:12px}.student-profile-card b{color:#14936f}.student-profile-card small{grid-column:1/-1;color:#7b8a91}.assessment-card{display:flex;flex-direction:column;gap:12px}.assessment-card div{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.assessment-card b,.assessment-card strong,.assessment-card em{min-height:44px;border-radius:12px;background:#f7faf9;display:grid;place-items:center;font-style:normal;color:#41545a;font-size:13px}.body-link-card{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center}.child-body{height:220px;position:relative}.body-head{width:68px;height:68px;left:41px;top:4px;position:absolute;border-radius:50%;background:#ffe3cf;border:2px solid #ffc9aa}.eye{width:7px;height:7px;border-radius:50%;background:#52636a;position:absolute;top:28px}.eye.left{left:22px}.eye.right{right:22px}.mouth{width:20px;height:8px;border-bottom:2px solid #d98676;border-radius:0 0 20px 20px;position:absolute;left:24px;top:42px}.body-neck{position:absolute;left:64px;top:68px;width:22px;height:16px;background:#ffe3cf}.body-torso{position:absolute;left:37px;top:82px;width:76px;height:92px;border-radius:34px 34px 24px 24px;background:#dff5ee;border:2px solid #a8e0cf}.spine-line{position:absolute;left:36px;top:12px;width:4px;height:68px;border-radius:4px;background:#9fc8df}.body-arms{position:absolute;left:18px;top:90px;width:114px;height:52px;border-radius:28px;border:14px solid #ffe3cf;border-top:0;background:transparent}.body-legs{position:absolute;left:45px;top:166px;width:60px;height:48px;border-left:20px solid #9edcca;border-right:20px solid #9edcca;border-radius:0 0 18px 18px}.body-point{position:absolute;width:30px;height:30px;border:3px solid #fff;border-radius:50%;box-shadow:0 4px 12px rgba(20,60,50,.18);color:#fff;font-size:12px;font-weight:700}.body-point.vision{left:60px;top:23px}.body-point.oral{left:60px;top:48px}.body-point.mental{left:94px;top:13px}.body-point.weight{left:60px;top:120px}.body-point.spine{left:92px;top:102px}.body-point.normal{background:#18a879}.body-point.low{background:#3b91dc}.body-point.medium{background:#e4932f}.body-point.high{background:#e55555}.body-point.pending{background:#8e68d8}.body-point.active{outline:3px solid rgba(19,168,125,.28);transform:scale(1.12)}.selected-health-card{box-shadow:none;background:#f8fcfa}.selected-health-card p,.selected-health-card small,.health-detail p,.health-detail small{color:#607178;line-height:1.55}.health-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.compact{grid-template-columns:1fr}.health-card{min-height:82px;padding:12px;border-radius:16px;background:#fff;display:flex;flex-direction:column;gap:5px;border:1px solid transparent}.health-card b{font-size:18px}.health-card span{font-size:13px;font-weight:700}.health-card small{color:#6d7b83}.health-card.high{border-color:#ffd0d0}.health-card.medium{border-color:#ffe0b4}.health-card.low{border-color:#b9ddff}.health-card.normal{border-color:#b9ead7}.health-card.pending{border-color:#dcc9ff}.health-card.active{box-shadow:0 0 0 2px rgba(19,168,125,.18);background:#fbfffd}.health-detail{display:flex;flex-direction:column;gap:8px}.health-detail strong{color:#304249;line-height:1.55}.abnormal-card{display:flex;flex-direction:column;gap:8px}.abnormal-card .pill{align-self:flex-start}.abnormal-card p,.abnormal-card small{color:#5f6f76;line-height:1.55}.advice-card p{line-height:1.7;color:#52636a}.history-row{display:flex;flex-direction:column;gap:4px}.progress{height:8px;border-radius:999px;background:#dceae5;overflow:hidden}.progress span{display:block;height:100%;background:#13a87d}.question-card{min-height:360px}.question-card h2{margin:12px 0 16px}.option{height:46px;margin-bottom:10px;padding:0 12px;display:flex;align-items:center;gap:8px;border:1px solid #e0ebe7;border-radius:14px;background:#f9fcfb}.fixed-actions{position:sticky;bottom:8px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.fixed-actions button{height:42px;border:0;border-radius:14px}.success-card{text-align:center;padding:36px 18px}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.steps span{padding:8px 4px;text-align:center;border-radius:12px;background:#edf2f0;color:#7b878d;font-size:12px}.steps .done{background:#dff7ee;color:#12906c}.slot-grid button{min-height:48px;color:#53666c}.slot-grid button.active{color:#fff;background:#13a87d}.article-detail h1{font-size:22px;line-height:1.35}.message-card,.mine-row{width:100%;border:0;border-radius:15px;background:#fff;text-align:left;box-shadow:0 8px 18px rgba(40,80,75,.06)}.message-card{position:relative;padding:14px 14px 14px 24px;display:flex;flex-direction:column;gap:5px}.message-card span{position:absolute;left:10px;top:20px;width:7px;height:7px;border-radius:50%;background:#cdd8d3}.message-card span.unread{background:#ef5959}.message-card p{margin:0;color:#687980}.mine-card{background:linear-gradient(135deg,#fff,#e9f9f4)}.mine-row{padding:14px}.logout{width:100%;color:#d64b4b;background:#fff0f0}.bottom-tabs{height:64px;padding:6px 8px;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:#fff;border-top:1px solid #e5efeb}.bottom-tabs button{border:0;border-radius:14px;background:transparent;color:#7b8a91;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.bottom-tabs button.active{color:#13a87d;background:#e9f8f2}.bottom-tabs .el-icon{font-size:20px}.top-placeholder{width:34px;height:34px}.login-content{padding:14px 20px 18px;background:linear-gradient(180deg,#dff6ef 0,#eef9f6 44%,#f7fbfa 100%)}.login-screen{min-height:100%;justify-content:flex-start;gap:14px}.login-visual{position:relative;margin-top:8px;padding:18px 16px 16px;border-radius:24px;background:linear-gradient(135deg,#d9f6ee 0,#e9f8ff 100%);overflow:hidden}.login-visual::before,.login-visual::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.55)}.login-visual::before{width:92px;height:92px;right:-26px;top:-28px}.login-visual::after{width:58px;height:58px;left:-20px;bottom:20px}.visual-illustration{height:132px;position:relative;z-index:1}.visual-card{position:absolute;left:8px;top:28px;width:118px;height:74px;padding:14px;border-radius:18px;background:rgba(255,255,255,.88);box-shadow:0 12px 28px rgba(45,105,96,.12);display:flex;flex-direction:column;gap:7px;color:#244349}.visual-card b{font-size:15px}.visual-card small{color:#6f858a}.visual-child{position:absolute;right:44px;top:18px;width:80px;height:104px;border-radius:36px 36px 28px 28px;background:#bce8dc;border:3px solid rgba(255,255,255,.9);box-shadow:0 14px 34px rgba(33,111,96,.18)}.visual-child::before{content:"";position:absolute;left:18px;top:-18px;width:42px;height:42px;border-radius:50%;background:#ffe1cb;border:3px solid rgba(255,255,255,.9)}.visual-child::after{content:"";position:absolute;left:35px;top:30px;width:10px;height:52px;border-radius:8px;background:#8dc9e3}.visual-child i{position:absolute;left:27px;top:-5px;width:25px;height:8px;border-radius:999px;background:#5f7680}.visual-badge{position:absolute;z-index:2;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;border:2px solid #fff;color:#fff;font-size:12px;font-weight:700;box-shadow:0 8px 18px rgba(45,105,96,.16)}.visual-badge.vision{right:16px;top:6px;background:#e55555}.visual-badge.oral{right:14px;top:48px;background:#18a879}.visual-badge.spine{right:106px;top:2px;background:#3b91dc}.visual-badge.mind{right:100px;bottom:14px;background:#8e68d8}.visual-badge.weight{left:102px;bottom:10px;background:#e4932f}.visual-copy{position:relative;z-index:1}.visual-copy h1{font-size:23px;line-height:1.25;color:#183e3f}.visual-copy p{margin-top:7px;color:#587277;font-size:13px;line-height:1.55}.parent-login-card{padding:20px;border-radius:22px;gap:13px;box-shadow:0 16px 36px rgba(45,105,96,.12)}.login-card-title h2{font-size:22px;color:#20313b}.login-card-title p{margin-top:5px;color:#71858a;font-size:13px}.input-shell{height:46px;display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid #dbeae6;border-radius:15px;background:#f9fcfb}.input-shell:focus-within{border-color:#13a87d;box-shadow:0 0 0 3px rgba(19,168,125,.1)}.input-shell .el-icon,.input-shell i{width:18px;color:#13a87d;font-style:normal;font-size:14px;text-align:center}.input-shell input{height:44px;padding:0;border:0;background:transparent}.input-shell input:focus{outline:0}.parent-login-card .code-row{grid-template-columns:minmax(0,1fr) 108px}.parent-login-card .code-row button{height:46px;border-radius:999px}.parent-login-card .code-row button:disabled{color:#8ba59e;background:#eef6f3}.login-button{height:48px;border-radius:16px;font-size:16px}.login-error{margin:-4px 0 0;color:#d64b4b;font-size:12px}.demo-code{margin-top:-4px}.login-agreement{color:#97a5a9;font-size:12px;text-align:center;line-height:1.5}.login-agreement span{color:#14936f}.login-provider{margin:0;text-align:center;color:#a0adb1;font-size:12px}.simple-login-screen{justify-content:flex-start;padding-top:76px}.simple-login-card{padding:24px 20px;border-radius:22px;gap:18px}.simple-login-card h2{font-size:24px}.simple-login-card input{height:46px}.simple-login-card .code-row{grid-template-columns:minmax(0,1fr) 104px}.simple-login-card .code-row button{height:46px;border:0;border-radius:14px;color:#128366;background:#e7f7f1;font-weight:700}.simple-login-card .login-button{height:48px;border-radius:16px;font-size:16px}@media(max-width:520px){.parent-demo{padding:0}.phone-shell{width:100%;height:100vh;min-height:100vh;border-radius:0}.phone-content{height:calc(100vh - 118px)}.login-content{height:calc(100vh - 54px)}.body-link-card{grid-template-columns:142px 1fr}}

:global(:root){--primary:#26BFC3;--primary-light:#46D2D2;--primary-dark:#12A8AD;--bg-page:#EAF8F5;--bg-page-light:#F8FEFC;--bg-card:#FFFFFF;--text-title:#20343A;--text-main:#60757C;--text-sub:#9AADB2;--border-light:#D8EEEA;--primary-soft:#E4F8F6;--primary-tint:#F0FCFA;--risk-normal:#18B884;--risk-normal-bg:#E8F8F1;--risk-low:#2F80ED;--risk-low-bg:#EAF3FF;--risk-mid:#F2994A;--risk-mid-bg:#FFF4E8;--risk-high:#EB5757;--risk-high-bg:#FFF0F0;--risk-pending:#8E6DEB;--risk-pending-bg:#F3EEFF}.parent-demo{color:var(--text-title);background:#fff}.phone-shell{background:linear-gradient(180deg,#E7F8F5 0%,#F8FEFC 100%);box-shadow:0 24px 70px rgba(38,191,195,.18)}.phone-top{background:rgba(255,255,255,.94);border-bottom:1px solid rgba(216,238,234,.85)}.phone-top strong{color:var(--text-title)}.phone-top button,.page-title button,.plain,.back{background:var(--primary-soft);color:var(--primary-dark)}.phone-content,.login-content{background:linear-gradient(180deg,#E7F8F5 0%,#F8FEFC 100%)}.login-card,.summary-card,.detail-card,.student-card,.form-card,.list-card,.report-card,.abnormal-card,.advice-card,.question-card,.success-card,.mine-card,.article-detail,.student-profile-card,.assessment-card,.body-link-card,.selected-health-card,.history-row,.home-article,.edu-card,.message-card,.mine-row{background:var(--bg-card);border:1px solid rgba(216,238,234,.65);box-shadow:0 10px 28px rgba(38,191,195,.08)}h1,h2,h3,.home-article strong,.student-card strong,.list-card strong,.history-row strong{color:var(--text-title)}p,small,.section-head p,.list-card p,.detail-card p,.student-card p,.article-detail p,.student-profile-card p,.history-row span,.home-article small,.edu-card small,.message-card small,.selected-health-card p,.selected-health-card small,.health-detail p,.health-detail small,.abnormal-card p,.abnormal-card small,.advice-card p{color:var(--text-main)}input,textarea{color:var(--text-title);background:#FAFEFD;border-color:var(--border-light)}input::placeholder,textarea::placeholder{color:var(--text-sub)}input:focus,textarea:focus{outline:0;border-color:var(--primary);box-shadow:0 0 0 3px rgba(38,191,195,.12)}.primary{color:#fff;background:linear-gradient(135deg,var(--primary-light) 0%,var(--primary-dark) 100%);box-shadow:0 10px 24px rgba(18,168,173,.22)}.ghost{color:var(--primary-dark);background:var(--primary-tint);border:1px solid var(--border-light)}.welcome,.student-profile-card,.mine-card{color:#fff;background:linear-gradient(135deg,var(--primary-light) 0%,var(--primary-dark) 100%)}.welcome strong,.student-profile-card h2,.student-profile-card p,.student-profile-card span,.student-profile-card small,.student-profile-card b,.mine-card strong,.mine-card p{color:#fff}.welcome button{background:rgba(255,255,255,.22);color:#fff}.todo-grid button,.shortcut-grid button,.slot-grid button{background:var(--bg-card);border:1px solid rgba(216,238,234,.65);box-shadow:0 10px 24px rgba(38,191,195,.07)}.todo-grid strong,.section-head button,.shortcut-grid .el-icon{color:var(--primary-dark)}.todo-grid span,.shortcut-grid span{color:var(--text-main)}.home-article em{color:var(--primary-dark);background:var(--primary-soft)}.topic-card.vision{background:var(--risk-low-bg)}.topic-card.weight{background:var(--risk-mid-bg)}.topic-card.spine{background:#EEF8FF}.topic-card.oral{background:var(--risk-normal-bg)}.topic-card.mental{background:var(--risk-pending-bg)}.topic-card{border:1px solid rgba(216,238,234,.65)}.topic-card strong{color:var(--text-title)}.topic-card span{color:var(--text-main)}.normal{color:var(--risk-normal);background:var(--risk-normal-bg)}.low{color:var(--risk-low);background:var(--risk-low-bg)}.medium{color:var(--risk-mid);background:var(--risk-mid-bg)}.high{color:var(--risk-high);background:var(--risk-high-bg)}.pending{color:var(--risk-pending);background:var(--risk-pending-bg)}.student-card button,.list-card button,.code-row button{color:var(--primary-dark);background:var(--primary-soft);border:1px solid var(--border-light)}.student-card button.active{color:#fff;background:linear-gradient(135deg,var(--primary-light),var(--primary-dark))}.assessment-card b,.assessment-card strong,.assessment-card em{background:var(--primary-tint);color:var(--text-main)}.body-link-card{background:var(--bg-card)}.child-body::before{content:"";position:absolute;left:12px;top:12px;width:126px;height:188px;border-radius:999px;background:linear-gradient(180deg,var(--primary-tint),var(--primary-soft));z-index:0}.body-head,.body-neck,.body-torso,.body-arms,.body-legs,.body-point{z-index:1}.body-torso{background:#B8EDEA;border-color:#A6E7E3}.spine-line{background:var(--primary)}.body-point.normal{background:var(--risk-normal)}.body-point.low{background:var(--risk-low)}.body-point.medium{background:var(--risk-mid)}.body-point.high{background:var(--risk-high)}.body-point.pending{background:var(--risk-pending)}.body-point.active{outline:3px solid rgba(38,191,195,.28)}.health-card{background:var(--bg-card);border-color:var(--border-light)}.health-card.active{background:var(--primary-tint);box-shadow:0 0 0 2px rgba(38,191,195,.2);border-color:var(--primary)}.health-detail strong,.advice-card b{color:var(--primary-dark)}.abnormal-card{position:relative;overflow:hidden}.abnormal-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--primary)}.abnormal-card:has(.high)::before{background:var(--risk-high)}.abnormal-card:has(.medium)::before{background:var(--risk-mid)}.abnormal-card:has(.low)::before{background:var(--risk-low)}.progress{background:var(--border-light)}.progress span{background:var(--primary)}.option{color:var(--text-main);background:#FAFEFD;border-color:var(--border-light)}.option:focus-within{color:var(--primary-dark);background:var(--primary-soft);border-color:var(--primary)}.steps span{background:#EEF5F4;color:var(--text-main)}.steps .done{background:var(--primary-soft);color:var(--primary-dark)}.slot-grid button{border:1px solid var(--border-light);color:var(--text-main)}.slot-grid button.active{color:var(--primary-dark);background:var(--primary-soft);border-color:var(--primary)}.logout{color:var(--risk-high);background:var(--risk-high-bg);box-shadow:none}.bottom-tabs{background:#fff;border-top:1px solid var(--border-light)}.bottom-tabs button{color:#8AA0A6}.bottom-tabs button.active{color:var(--primary-dark);background:var(--primary-soft)}.simple-login-card{box-shadow:0 16px 40px rgba(38,191,195,.14)}.simple-login-card h2{color:var(--text-title)}.simple-login-card .code-row button{color:var(--primary-dark);background:var(--primary-soft);border:1px solid var(--border-light)}.simple-login-card .login-button{background:linear-gradient(135deg,var(--primary-light) 0%,var(--primary-dark) 100%);box-shadow:0 10px 24px rgba(18,168,173,.22)}
 .phone-shell{box-shadow:none!important;border:1px solid var(--border-light)}

.phone-shell:has(.simple-login-screen) .phone-top{position:relative;z-index:3;background:transparent;border-bottom:0}.phone-shell:has(.simple-login-screen) .phone-top strong{color:#fff}.phone-shell:has(.simple-login-screen) .phone-top button,.phone-shell:has(.simple-login-screen) .top-placeholder{background:rgba(255,255,255,.22);color:#fff}.login-content{position:relative;overflow:hidden;background:#EAF8F5!important}.login-content::before{content:"";position:absolute;left:0;top:0;width:100%;height:46%;background:linear-gradient(180deg,#46D2D2 0%,#26BFC3 45%,#12A8AD 100%);border-bottom-left-radius:36px;border-bottom-right-radius:36px;z-index:0}.simple-login-screen{position:relative;z-index:1;min-height:100%;padding:18px 0 0!important;justify-content:flex-start!important;gap:0!important}.login-brand-panel{position:relative;height:205px;padding:22px 8px 0;color:#fff;overflow:hidden}.login-brand-panel span{display:block;color:rgba(255,255,255,.9);font-size:13px;font-weight:700}.login-brand-panel h1{margin-top:18px;color:#fff;font-size:28px;line-height:1.25;letter-spacing:0}.login-brand-panel p{width:230px;margin-top:10px;color:rgba(255,255,255,.86);font-size:14px;line-height:1.55}.decor-dot,.decor-cross,.decor-ring{position:absolute;display:block;pointer-events:none}.decor-dot{border-radius:50%;background:rgba(255,255,255,.18)}.dot-a{right:24px;top:24px;width:78px;height:78px}.dot-b{right:94px;bottom:34px;width:18px;height:18px;background:rgba(255,255,255,.28)}.decor-cross{right:44px;bottom:52px;color:rgba(255,255,255,.28);font-size:34px;font-style:normal;font-weight:300}.decor-ring{right:8px;bottom:4px;width:86px;height:86px;border:14px solid rgba(255,255,255,.13);border-radius:50%}.simple-login-card{position:relative;z-index:2;margin:-38px 4px 0!important;padding:24px 20px!important;background:#fff!important;border:1px solid rgba(216,238,234,.8)!important;border-radius:24px!important;box-shadow:0 18px 44px rgba(18,168,173,.20)!important}.simple-login-card h2{font-size:24px;color:#20343A}.simple-login-card input{background:#FAFEFD;border-color:#D8EEEA;color:#20343A}.simple-login-card input::placeholder{color:#9AADB2}.simple-login-card .code-row button{background:#E4F8F6!important;color:#12A8AD!important;border:1px solid #D8EEEA!important;border-radius:16px!important}.simple-login-card .login-button{background:linear-gradient(135deg,#46D2D2 0%,#12A8AD 100%)!important;color:#fff;box-shadow:0 10px 24px rgba(18,168,173,.22)!important}

.phone-shell:has(.simple-login-screen){position:relative;background:#EAF8F5!important}.phone-shell:has(.simple-login-screen)::before{content:"";position:absolute;left:0;top:0;width:100%;height:48%;background:linear-gradient(135deg,#46D2D2 0%,#12A8AD 100%);border-bottom-left-radius:36px;border-bottom-right-radius:36px;z-index:0}.phone-shell:has(.simple-login-screen) .phone-top{position:relative;z-index:3;background:transparent!important;border-bottom:none!important;box-shadow:none!important;backdrop-filter:none!important}.phone-shell:has(.simple-login-screen) .phone-top strong{color:#fff!important;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.12)}.phone-shell:has(.simple-login-screen) .back{background:rgba(255,255,255,.22)!important;color:#fff!important;border:1px solid rgba(255,255,255,.28)!important;backdrop-filter:blur(8px)}.phone-shell:has(.simple-login-screen) .top-placeholder{background:transparent!important;border:0!important;opacity:1}.phone-shell:has(.simple-login-screen) .login-content{position:relative;z-index:1;background:transparent!important}.phone-shell:has(.simple-login-screen) .login-content::before{display:none}.phone-shell:has(.simple-login-screen) .login-brand-panel{height:232px;padding:58px 8px 0}.phone-shell:has(.simple-login-screen) .login-brand-panel span,.phone-shell:has(.simple-login-screen) .login-brand-panel h1{color:#fff!important}.phone-shell:has(.simple-login-screen) .login-brand-panel p{color:rgba(255,255,255,.86)!important}.phone-shell:has(.simple-login-screen) .simple-login-card{margin:-42px 4px 0!important}
.phone-shell.is-login-shell{position:relative;background:#EAF8F5!important;box-shadow:none!important;border:1px solid var(--border-light)}.phone-shell.is-login-shell::before{content:"";position:absolute;left:0;top:0;width:100%;height:48%;background:linear-gradient(135deg,#46D2D2 0%,#12A8AD 100%);border-bottom-left-radius:36px;border-bottom-right-radius:36px;z-index:0}.phone-shell.is-login-shell .phone-top{position:relative;z-index:3;background:transparent!important;border-bottom:none!important;box-shadow:none!important;backdrop-filter:none!important}.phone-shell.is-login-shell .phone-top strong{color:#fff!important;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.12)}.phone-shell.is-login-shell .back{background:rgba(255,255,255,.22)!important;color:#fff!important;border:1px solid rgba(255,255,255,.28)!important;backdrop-filter:blur(8px)}.phone-shell.is-login-shell .top-placeholder{background:transparent!important;border:0!important;opacity:1}.phone-shell.is-login-shell .phone-content{position:relative;z-index:1}.phone-shell.is-login-shell .login-content{background:transparent!important}.phone-shell.is-login-shell .login-content::before{display:none!important}.phone-shell.is-login-shell .simple-login-screen{position:relative;z-index:1;min-height:100%;padding:18px 0 0!important;justify-content:flex-start!important;gap:0!important}.phone-shell.is-login-shell .login-brand-panel{height:232px;padding:58px 8px 0}.phone-shell.is-login-shell .login-brand-panel span,.phone-shell.is-login-shell .login-brand-panel h1{color:#fff!important}.phone-shell.is-login-shell .login-brand-panel p{color:rgba(255,255,255,.86)!important}.phone-shell.is-login-shell .simple-login-card{position:relative;z-index:2;margin:-42px 4px 0!important}
.phone-shell.is-login-shell .phone-top{justify-content:flex-start}.phone-shell.is-login-shell .phone-top strong,.phone-shell.is-login-shell .top-placeholder,.phone-shell.is-login-shell .plain{display:none!important}.phone-shell.is-login-shell .back{flex:none;background:rgba(255,255,255,.28)!important}
.phone-shell.is-login-shell .login-brand-panel span{display:inline-flex!important;align-items:center;gap:7px;width:auto;padding:5px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.12);color:rgba(255,255,255,.78)!important;font-size:14px;font-weight:600;line-height:1;backdrop-filter:blur(6px)}.phone-shell.is-login-shell .login-brand-panel span::before{content:"";width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.78);box-shadow:0 0 0 3px rgba(255,255,255,.12)}.phone-shell.is-login-shell .login-brand-panel h1{margin-top:24px!important;color:#fff!important;font-size:30px;line-height:1.22;font-weight:800}.phone-shell.is-login-shell .login-brand-panel p{margin-top:12px;color:rgba(255,255,255,.72)!important}
.phone-shell.is-login-shell .login-brand-panel h1{margin-top:10px!important;color:#fff!important;font-size:30px;line-height:1.22;font-weight:800}.phone-shell.is-login-shell .login-brand-panel p{margin-top:12px;color:rgba(255,255,255,.72)!important}.phone-shell.is-login-shell .login-card-kicker{display:block;color:#12A8AD;font-size:14px;font-weight:600;line-height:1.2}.phone-shell.is-login-shell .simple-login-card h2{margin-top:6px!important;color:#20343A!important;font-size:30px!important;line-height:1.12;font-weight:800}.phone-shell.is-login-shell .login-card-desc{margin:2px 0 4px;color:#60757C!important;font-size:13px;line-height:1.5}.phone-shell.is-login-shell .login-card-desc + label{margin-top:12px}
.phone-shell.is-login-shell .simple-login-card{gap:12px!important;padding-top:22px!important}.phone-shell.is-login-shell .login-card-kicker{margin-bottom:0}.phone-shell.is-login-shell .simple-login-card h2{margin-top:4px!important;margin-bottom:4px!important}.phone-shell.is-login-shell .simple-login-card h2 + label{margin-top:4px}.phone-shell.is-login-shell .simple-login-card label{gap:6px}.phone-shell.is-login-shell .simple-login-card .login-button{margin-top:2px}
.phone-shell.is-login-shell .login-card-kicker{text-align:center;width:100%;font-size:15px}.phone-shell.is-login-shell .simple-login-card .field-only{display:block;color:transparent;font-size:0;gap:0}.phone-shell.is-login-shell .simple-login-card .field-only input{font-size:14px}.phone-shell.is-login-shell .simple-login-card h2 + .field-only{margin-top:8px}.phone-shell.is-login-shell .simple-login-card .field-only + .field-only{margin-top:0}.phone-shell.is-login-shell .simple-login-card{gap:11px!important}
.phone-shell.is-login-shell .login-card-kicker{text-align:left!important;width:100%;font-size:14px;font-weight:600;color:#12A8AD}.phone-shell.is-login-shell .simple-login-card h2{margin-top:4px!important;margin-bottom:0!important;color:#20343A!important;font-size:22px!important;line-height:1.2;font-weight:700!important}.phone-shell.is-login-shell .login-card-desc{margin:0 0 8px!important;color:#60757C!important;font-size:13px;line-height:1.45}.phone-shell.is-login-shell .login-card-desc + .field-only{margin-top:4px}.phone-shell.is-login-shell .simple-login-card{gap:10px!important}
.phone-shell.is-login-shell .simple-login-card h2{color:#12A8AD!important;font-size:23px!important;font-weight:700!important;line-height:1.2}
.phone-shell.is-login-shell .simple-login-card h2 + .field-only{margin-top:8px!important}
.phone-shell{background:#FDFEFE!important;border:1px solid rgba(216,238,234,.55)!important;border-radius:34px!important;box-shadow:0 18px 50px rgba(32,52,58,.10),0 20px 60px rgba(18,168,173,.10)!important}.parent-demo{background:linear-gradient(180deg,#F7FEFC 0%,#EAF8F5 100%)!important}.phone-content::-webkit-scrollbar{width:4px}.phone-content::-webkit-scrollbar-track{background:transparent}.phone-content::-webkit-scrollbar-thumb{background:rgba(96,117,124,.22);border-radius:999px}.phone-content::-webkit-scrollbar-thumb:hover{background:rgba(96,117,124,.34)}.home-screen{gap:16px;padding-bottom:8px}.home-banner{min-height:132px;padding:18px 18px 16px;border-radius:22px;background:linear-gradient(135deg,#46D2D2 0%,#12A8AD 100%);position:relative;overflow:hidden;color:#fff}.home-banner span{display:inline-flex;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.18);font-size:12px}.home-banner h2{width:210px;margin:12px 0 7px;color:#fff;font-size:21px;line-height:1.24}.home-banner p{width:220px;color:rgba(255,255,255,.84);font-size:13px;line-height:1.5}.banner-art{position:absolute;right:14px;top:22px;width:94px;height:94px;border-radius:30px;background:rgba(255,255,255,.16);font-style:normal}.banner-art b{position:absolute;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.88);color:#12A8AD;font-size:13px}.banner-art b:nth-child(1){left:10px;top:12px}.banner-art b:nth-child(2){right:10px;top:28px}.banner-art b:nth-child(3){left:32px;bottom:10px}.banner-dots{position:absolute;left:18px;bottom:12px;display:flex;gap:5px}.banner-dots b{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.46)}.banner-dots b:first-child{width:16px;border-radius:999px;background:#fff}.home-student-summary{padding:14px 15px;border-radius:18px;background:#fff;border:1px solid rgba(216,238,234,.75);box-shadow:0 10px 28px rgba(38,191,195,.08)}.summary-top,.summary-result{display:flex;align-items:center;justify-content:space-between;gap:10px}.summary-top strong{font-size:17px;color:#20343A}.summary-top button,.summary-result button{border:0;border-radius:999px;padding:6px 10px;color:#12A8AD;background:#E4F8F6;display:flex;align-items:center;gap:4px}.home-student-summary p{margin-top:6px;color:#60757C;font-size:13px}.summary-result{margin-top:10px}.summary-result b{color:#12A8AD;font-size:15px}.summary-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.summary-tags span{padding:4px 8px;border-radius:999px;font-size:12px}.todo-panel{padding:13px 13px 12px;border-radius:18px;background:#fff;border:1px solid rgba(216,238,234,.7);box-shadow:0 10px 24px rgba(38,191,195,.06)}.compact-head{margin-bottom:8px}.todo-compact{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));min-height:58px}.todo-compact button{min-width:0;border:0;background:transparent;border-right:1px solid rgba(216,238,234,.75);display:grid;grid-template-rows:18px 20px 18px;place-items:center;color:#60757C}.todo-compact button:last-child{border-right:0}.todo-compact i{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#E4F8F6;color:#12A8AD;font-size:11px;font-style:normal}.todo-compact strong{color:#12A8AD;font-size:19px}.todo-compact span{font-size:11px;white-space:nowrap}.home-article-list{gap:12px}.home-article{padding:11px;border-radius:16px}.home-article b{width:72px!important;height:58px!important;border-radius:16px!important;display:grid;place-items:center}.home-article b i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.72);font-style:normal;color:#12A8AD;font-size:13px}.cover-spine{background:linear-gradient(135deg,#eaf2ff,#f6faff)}.home-article strong{color:#20343A;line-height:1.35}.home-article small{color:#60757C}.home-article em{background:#E4F8F6!important;color:#12A8AD!important}.topic-strip{gap:10px}.topic-card{min-width:112px!important;min-height:78px!important;border-radius:16px!important;padding:12px!important}.topic-card strong{font-size:14px}.topic-card span{font-size:12px}.home-screen .shortcut-grid button{min-height:58px}.phone-shell.is-login-shell{box-shadow:none!important;border:1px solid var(--border-light)!important}
.home-v2{gap:14px}.home-banner-full{min-height:164px;margin:0 -2px;padding:20px 18px 18px;border-radius:24px}.home-banner-full h2{width:220px;margin-top:13px;font-size:24px}.home-banner-full p{width:225px}.home-banner-full button{margin-top:12px;height:30px;padding:0 12px;border:0;border-radius:999px;background:rgba(255,255,255,.22);color:#fff;font-weight:700}.home-banner-full .banner-art{top:34px;right:16px}.core-actions{height:108px;padding:12px 8px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;border-radius:20px;background:#fff;border:1px solid rgba(216,238,234,.7);box-shadow:0 10px 28px rgba(38,191,195,.08)}.core-actions button{position:relative;min-width:0;border:0;background:transparent;display:flex;flex-direction:column;align-items:center;gap:4px;color:#60757C}.core-actions i{position:relative;width:34px;height:34px;border-radius:14px;display:grid;place-items:center;background:#E4F8F6;color:#12A8AD;font-style:normal}.core-actions .el-icon{font-size:19px}.core-actions em{position:absolute;right:-5px;top:-5px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#EB5757;color:#fff;font-size:10px;line-height:16px;font-style:normal}.core-actions strong{color:#20343A;font-size:13px;line-height:1.2;white-space:nowrap}.core-actions span{font-size:11px;line-height:1.2;color:#9AADB2;white-space:nowrap}.home-checkup-card{min-height:132px}.home-checkup-card>.summary-top{margin-bottom:8px}.home-checkup-card>.summary-top>span{color:#12A8AD;font-size:13px;font-weight:700}.home-checkup-card>strong{display:block;color:#20343A;font-size:17px}.home-v2 .section-head{margin-top:4px}.todo-panel,.todo-compact{display:none!important}
.phone-top .top-placeholder{background:transparent!important;border:0!important;box-shadow:none!important}.home-v2{gap:0!important}.home-banner-full{min-height:178px!important;margin:-14px -14px 0!important;padding:22px 24px 38px!important;border-radius:0 0 30px 30px!important;box-shadow:none}.home-banner-full::before{content:"";position:absolute;right:-36px;top:-32px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.15)}.home-banner-full::after{content:"";position:absolute;right:62px;bottom:-34px;width:92px;height:92px;border-radius:50%;background:rgba(255,255,255,.12)}.home-banner-full h2{font-size:25px!important}.home-banner-full p{color:rgba(255,255,255,.88)!important}.core-actions{position:relative;z-index:2;margin:-20px 6px 16px!important;height:104px!important;border-radius:22px!important;box-shadow:0 12px 32px rgba(18,168,173,.12)!important}.home-checkup-card{margin-top:0!important}.home-checkup-card p{margin-top:7px!important}.home-v2 .section-head{margin-top:20px!important}.edu-tabs{display:flex;gap:8px;overflow:auto;margin:-4px 0 12px;padding-bottom:2px}.edu-tabs button{height:30px;padding:0 12px;border:1px solid rgba(216,238,234,.8);border-radius:999px;background:#fff;color:#60757C;white-space:nowrap}.edu-tabs button.active{border-color:#E4F8F6;background:#E4F8F6;color:#12A8AD;font-weight:700}.home-v2 .topic-strip{display:none!important}.phone-content::-webkit-scrollbar-thumb{background:rgba(96,117,124,.18)!important}.phone-shell{border-color:rgba(216,238,234,.45)!important;box-shadow:0 20px 60px rgba(18,168,173,.10)!important}
.home-v2 .core-actions{height:92px!important;padding:13px 8px 11px!important}.home-v2 .core-actions button{justify-content:center;gap:7px}.home-v2 .core-actions span,.home-v2 .core-actions em{display:none!important}.home-v2 .core-actions strong{font-size:13px}
.current-child-card{position:relative;z-index:3;margin:-20px 18px 12px;padding:10px 12px 10px 14px;min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(255,255,255,.96);border:1px solid rgba(216,238,234,.72);border-radius:18px;box-shadow:0 10px 28px rgba(18,168,173,.10)}.current-child-card div{display:flex;flex-direction:column;gap:2px;min-width:0}.current-child-card span{color:#12A8AD;font-size:12px;font-weight:700}.current-child-card strong{color:#20343A;font-size:17px;line-height:1.2}.current-child-card small{color:#9AADB2;font-size:12px}.current-child-card button{flex:none;border:0;border-radius:999px;padding:7px 11px;background:#E4F8F6;color:#12A8AD;font-weight:700}.home-v2 .core-actions{margin:0 6px 16px!important}.home-checkup-card .summary-top{justify-content:flex-start}.child-sheet-mask{position:absolute;inset:0;z-index:20;display:flex;align-items:flex-end;background:rgba(32,52,58,.28)}.child-sheet{width:100%;padding:16px 16px 20px;border-radius:24px 24px 0 0;background:#fff;box-shadow:0 -14px 34px rgba(32,52,58,.16)}.child-sheet header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.child-sheet header strong{color:#20343A;font-size:18px}.child-sheet header button{width:30px;height:30px;border:0;border-radius:50%;background:#F0FCFA;color:#12A8AD;font-size:20px}.child-option{width:100%;min-height:58px;margin-top:8px;padding:10px 12px;border:1px solid rgba(216,238,234,.8);border-radius:16px;background:#FAFEFD;display:flex;align-items:center;justify-content:space-between;text-align:left}.child-option span{display:flex;flex-direction:column;gap:4px}.child-option b{color:#20343A}.child-option small{color:#9AADB2}.child-option em{padding:4px 8px;border-radius:999px;background:#E4F8F6;color:#12A8AD;font-style:normal;font-size:12px}.add-child{width:100%;height:42px;margin-top:12px;border:0;border-radius:16px;background:#E4F8F6;color:#12A8AD;font-weight:700}
.home-v2 .current-child-card{margin-left:8px!important;margin-right:8px!important}
.home-v2 .current-child-card div{gap:3px}
.home-v2 .current-child-card strong{font-size:17px;line-height:1.24}
.home-v2 .current-child-card button{padding:7px 14px}
.home-v2 .core-actions{margin-left:0!important;margin-right:0!important}
.home-v2 .home-checkup-card{margin-left:0!important;margin-right:0!important}
.home-v2 .section-head,.home-v2 .edu-tabs,.home-v2 .home-article-list{margin-left:0!important;margin-right:0!important}
.home-v2 .home-article{margin-left:0!important;margin-right:0!important}
.home-banner-full .banner-dots{bottom:30px!important;z-index:3}
.home-checkup-card .summary-top{justify-content:space-between!important;align-items:center}
.home-checkup-card .summary-top small{color:#60757C;font-size:12px;font-weight:600}
.home-checkup-card>strong{margin-top:8px}
.edu-tabs::-webkit-scrollbar{height:4px}
.edu-tabs::-webkit-scrollbar-track{background:transparent}
.edu-tabs::-webkit-scrollbar-thumb{background:rgba(96,117,124,.18);border-radius:999px}
.edu-tabs::-webkit-scrollbar-thumb:hover{background:rgba(96,117,124,.34)}
.home-v2 .section-head{margin-bottom:10px!important}
.home-v2 .edu-tabs{margin-top:0!important;margin-bottom:14px!important;padding-top:0!important}
.phone-content:has(.home-v2){padding-left:7px!important;padding-right:7px!important}
.phone-content:has(.home-v2) .home-banner-full{margin-left:-7px!important;margin-right:-7px!important}
/* 第五轮首页背景与间距优化 */
.phone-content:has(.home-v2){background:linear-gradient(180deg,#F8FEFC 0%,#FFFFFF 100%)!important}
.home-v2{background:linear-gradient(180deg,#F8FEFC 0%,#FFFFFF 100%)!important;gap:0!important}
.home-v2 .current-child-card{margin:-20px 0 10px!important;background:#fff!important;border:1px solid rgba(216,238,234,.55)!important;box-shadow:0 8px 24px rgba(18,168,173,.07)!important;border-radius:18px!important}
.home-v2 .core-actions{margin:0 0 12px!important;height:96px!important;padding:12px 8px 10px!important;background:#fff!important;border:1px solid rgba(216,238,234,.55)!important;box-shadow:0 8px 24px rgba(18,168,173,.07)!important;border-radius:20px!important}
.home-v2 .core-actions button{gap:5px!important}
.home-v2 .core-actions i{width:32px;height:32px;border-radius:13px}
.home-v2 .home-checkup-card{margin:0 0 16px!important;min-height:auto!important;padding:14px 15px!important;background:#fff!important;border:1px solid rgba(216,238,234,.55)!important;box-shadow:0 8px 24px rgba(18,168,173,.07)!important;border-radius:18px!important}
.home-v2 .home-checkup-card .summary-result{margin-top:9px!important}
.home-v2 .home-checkup-card .summary-tags{margin-top:9px!important}
.home-v2 .section-head{margin:0 0 8px!important;align-items:center!important}
.home-v2 .edu-tabs{height:34px;margin:0 0 10px!important;padding-bottom:4px!important}
.home-v2 .edu-tabs button{height:28px!important;padding:0 11px!important}
.home-v2 .home-article-list{gap:10px!important}
.home-v2 .home-article{padding:10px!important;background:#fff!important;border:1px solid rgba(216,238,234,.55)!important;box-shadow:0 8px 24px rgba(18,168,173,.07)!important;border-radius:16px!important}
/* 首页字号层级优化 */
.home-v2 .core-actions strong{font-size:13px!important;font-weight:500!important;color:#425c64!important;line-height:1.3!important}
.home-v2 .section-head h3{font-size:14px!important;font-weight:600!important;color:#1f3b43!important;line-height:1.25!important;padding-left:14px!important}
.home-v2 .section-head button{font-size:13px!important;font-weight:500!important;color:#00a9a5!important;line-height:1.25!important}
.home-v2 .home-article strong{font-size:15px!important;font-weight:600!important;color:#1f3b43!important;line-height:1.38!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.home-v2 .edu-tabs button{font-weight:500!important}
.home-v2 .edu-tabs button.active{font-weight:600!important}
/* 首页 banner 本地图片轮播 */
.home-v2 .banner-carousel{position:relative;height:180px!important;min-height:180px!important;margin:-14px -7px 0!important;padding:0!important;overflow:hidden;background:#EAF8F5!important;border-radius:0 0 24px 24px!important;box-shadow:none!important;color:inherit!important}
.home-v2 .banner-carousel::before,.home-v2 .banner-carousel::after{display:none!important}
.home-v2 .banner-carousel .banner-slide{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;opacity:0;transition:opacity .45s ease;z-index:1}
.home-v2 .banner-carousel .banner-slide.active{opacity:1;z-index:2}
.home-v2 .banner-carousel .carousel-dots{position:absolute;left:18px;bottom:16px;z-index:4;display:flex;align-items:center;gap:6px}
.home-v2 .banner-carousel .carousel-dots button{width:6px;height:6px;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.58);box-shadow:none;transition:width .2s ease,background .2s ease}
.home-v2 .banner-carousel .carousel-dots button.active{width:16px;height:4px;background:#fff}
.home-v2 .banner-carousel{border-bottom-left-radius:0!important;border-bottom-right-radius:0!important}
.home-v2 .current-child-card{margin-top:-15px!important}
.home-v2 .edu-tabs{scrollbar-width:none!important;-ms-overflow-style:none!important}
.home-v2 .edu-tabs::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
/* 首页健康宣教本地缩略图 */
.home-v2 .home-article{align-items:center!important;gap:12px!important;min-height:104px!important}
.home-v2 .home-article .article-thumb{width:108px!important;height:82px!important;flex:0 0 108px!important;border-radius:15px!important;overflow:hidden!important;background:#E4F8F6!important;display:block!important}
.home-v2 .home-article .article-thumb img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important}
.home-v2 .home-article span{min-width:0;gap:6px!important}
.home-v2 .home-article strong{font-size:15px!important;font-weight:600!important;color:#1f3b43!important;line-height:1.38!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
/* 首页快捷入口本地图标 */
.home-v2 .core-actions .core-action-icon{width:46px!important;height:46px!important;border-radius:0!important;background:transparent!important;display:grid!important;place-items:center!important;overflow:visible!important}
.home-v2 .core-actions .core-action-icon img{width:46px!important;height:46px!important;display:block!important;object-fit:contain!important}
.home-v2 .core-actions .core-action-icon,.home-v2 .core-actions .core-action-icon img{border-radius:8px!important;overflow:hidden!important}
.home-v2 .home-checkup-card .checkup-name-row{display:flex;align-items:center;gap:8px;margin-top:8px;min-width:0}
.home-v2 .home-checkup-card .checkup-name-row strong{color:#20343A;font-size:17px;line-height:1.25;white-space:nowrap}
.home-v2 .home-checkup-card .checkup-name-row b{color:#12A8AD;font-size:14px;line-height:1.25;font-weight:700}
.home-v2 .home-checkup-card .summary-result{justify-content:flex-end!important;margin-top:9px!important}
.home-v2 .core-actions{height:102px!important;padding-top:10px!important;padding-bottom:9px!important}
.home-v2 .core-actions button{gap:8px!important}
.home-v2 .core-actions .core-action-icon{width:60px!important;height:60px!important;border-radius:8px!important;background:transparent!important;display:grid!important;place-items:center!important;overflow:hidden!important}
.home-v2 .core-actions .core-action-icon img{width:52px!important;height:52px!important;display:block!important;object-fit:contain!important;border-radius:8px!important}
.home-v2 .home-checkup-card{position:relative!important;padding-right:48px!important}
.home-v2 .home-checkup-card .summary-top>span{font-size:15px!important;color:#20343A!important;font-weight:700!important}
.home-v2 .home-checkup-card .checkup-name-row{align-items:flex-start!important;gap:10px!important;margin-top:10px!important}
.home-v2 .home-checkup-card .checkup-name-row>span{display:flex;flex-direction:column;gap:4px;min-width:0}
.home-v2 .home-checkup-card .checkup-name-row small{color:#9AADB2;font-size:12px;line-height:1.2}
.home-v2 .home-checkup-card .checkup-name-row b{margin-top:1px;white-space:nowrap}
.home-v2 .home-checkup-card .checkup-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:30px;height:30px;border:0;border-radius:50%;background:#E4F8F6;color:#12A8AD;font-size:24px;line-height:30px;display:grid;place-items:center;padding:0;font-weight:700}
/* 最近体检报告卡片轻量化 */
.home-v2 .home-checkup-card{padding:13px 14px!important;position:relative!important}
.home-v2 .home-checkup-card .checkup-title-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.home-v2 .home-checkup-card .checkup-title-row strong{color:#20343A;font-size:16px;font-weight:700;line-height:1.25}
.home-v2 .home-checkup-card .checkup-date{display:block;margin-top:4px;color:#9AADB2;font-size:12px;line-height:1.25}
.home-v2 .home-checkup-card .checkup-risk{margin-top:8px;color:#60757C;font-size:14px;font-weight:600;line-height:1.35}
.home-v2 .home-checkup-card .checkup-risk b{color:#12A8AD;font-weight:800}
.home-v2 .home-checkup-card .checkup-arrow{position:static!important;transform:none!important;width:28px;height:28px;border:0;border-radius:50%;background:#E4F8F6;color:#12A8AD;font-size:22px;line-height:28px;display:grid;place-items:center;padding:0;font-weight:700;flex:none}
.home-v2 .home-checkup-card .summary-tags{margin-top:9px!important;gap:6px!important}
.home-v2 .home-checkup-card .summary-tags span{font-size:11px!important;padding:4px 7px!important}
.home-v2 .home-checkup-card .checkup-arrow{width:auto!important;height:24px!important;border-radius:0!important;background:transparent!important;color:#12A8AD!important;font-size:12px!important;line-height:1!important;display:inline-flex!important;align-items:center!important;gap:2px!important;font-weight:700!important}
.home-v2 .home-checkup-card .checkup-arrow span{font-size:12px;color:#12A8AD;line-height:1}
.home-v2 .home-checkup-card .checkup-arrow i{font-style:normal;font-size:18px;line-height:1;margin-top:-1px}
/* 报告页人体健康画像本地图片 */
.report-screen .body-link-card{grid-template-columns:176px 1fr!important;gap:12px!important;align-items:center!important}
.report-screen .body-map-container{width:176px!important;height:286px!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important;overflow:visible!important}
.report-screen .body-map-container::before{display:none!important}
.report-screen .body-image{width:168px!important;height:278px!important;display:block!important;object-fit:contain!important;position:relative!important;z-index:1!important;pointer-events:none!important}
.report-screen .body-head,.report-screen .body-neck,.report-screen .body-torso,.report-screen .body-arms,.report-screen .body-legs{display:none!important}
.report-screen .body-point{z-index:3!important;border:3px solid #fff!important;box-shadow:0 4px 12px rgba(20,60,50,.18)!important}
.report-screen .body-point.vision{left:74px!important;top:42px!important}
.report-screen .body-point.oral{left:74px!important;top:72px!important}
.report-screen .body-point.mental{left:110px!important;top:30px!important}
.report-screen .body-point.weight{left:74px!important;top:150px!important}
.report-screen .body-point.spine{left:112px!important;top:130px!important}
/* 报告页人体健康画像 CSS 半透明覆盖层 */
.report-screen .body-link-card{grid-template-columns:195px 1fr!important;gap:12px!important;align-items:center!important}
.report-screen .body-map-container{width:195px!important;height:320px!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important;overflow:visible!important}
.report-screen .body-map-container::before{display:none!important}
.report-screen .body-map-bg{position:absolute;left:50%;top:50%;width:92%;height:88%;transform:translate(-50%,-50%);border-radius:48%;background:rgba(216,248,244,.68);z-index:0;pointer-events:none}
.report-screen .body-image{position:relative!important;z-index:1!important;width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;pointer-events:none!important}
.report-screen .body-point{display:none!important}
.report-screen .health-overlay{position:absolute;z-index:2;pointer-events:none;opacity:.42;transition:all .2s ease}
.report-screen .health-overlay.active{opacity:1;transform:scale(1.04)}
.report-screen .overlay-mental{left:36%;top:5%;width:28%;height:18%;border-radius:50%;background:rgba(142,104,255,.22);border:1px solid rgba(142,104,255,.36);box-shadow:0 0 12px rgba(142,104,255,.18)}
.report-screen .overlay-vision{left:31%;top:18%;width:38%;height:10%;border-radius:999px;background:rgba(255,91,91,.22);border:1px solid rgba(255,91,91,.38);box-shadow:0 0 12px rgba(255,91,91,.16)}
.report-screen .overlay-oral{left:41%;top:28%;width:18%;height:8%;border-radius:999px;background:rgba(20,188,137,.22);border:1px solid rgba(20,188,137,.36);box-shadow:0 0 10px rgba(20,188,137,.16)}
.report-screen .overlay-weight{left:32%;top:47%;width:36%;height:24%;border-radius:45% 45% 38% 38%;background:rgba(255,151,65,.22);border:1px solid rgba(255,151,65,.38);box-shadow:0 0 14px rgba(255,151,65,.16)}
.report-screen .overlay-spine{left:47%;top:36%;width:6%;height:36%;border-radius:999px;background:rgba(45,133,245,.24);border:1px solid rgba(45,133,245,.42);box-shadow:0 0 12px rgba(45,133,245,.16)}
/* 报告页第一版：人体画像导航与五健结果概览 */
.report-screen .body-link-card{grid-template-columns:64px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;padding:14px 12px!important;overflow:hidden!important}
.report-screen .health-nav-list{display:flex;flex-direction:column;gap:8px;width:64px;align-self:center}
.report-screen .health-nav-list button{height:50px;width:64px;border:0;border-radius:14px;background:#F2F8F7;color:#6D7B83;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-weight:700;box-shadow:inset 0 0 0 1px rgba(216,238,234,.72)}
.report-screen .health-nav-list button b{font-size:20px;line-height:1;color:inherit}
.report-screen .health-nav-list button span{font-size:11px;line-height:1.1;color:inherit}
.report-screen .health-nav-list button.active{color:#fff;background:var(--item-color);box-shadow:0 8px 18px color-mix(in srgb,var(--item-color) 28%,transparent)}
.report-screen .body-map-container{width:min(220px,100%)!important;height:340px!important;margin:0 auto!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important;overflow:visible!important}
.report-screen .body-map-container::before{display:none!important}
.report-screen .body-map-bg{position:absolute;left:50%;top:50%;width:92%;height:88%;transform:translate(-50%,-50%);border-radius:48%;background:rgba(216,248,244,.72);z-index:0;pointer-events:none}
.report-screen .body-image{position:relative!important;z-index:1!important;width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;pointer-events:none!important;background:transparent!important}
.report-screen .body-point{display:none!important}
.report-screen .health-overlay{position:absolute;z-index:2;pointer-events:none;opacity:0;transition:all .2s ease}
.report-screen .health-overlay.visible{opacity:.38}
.report-screen .health-overlay.active{opacity:1;transform:scale(1.04)}
.report-screen .overlay-mental{left:36%;top:5%;width:28%;height:18%;border-radius:50%;background:rgba(142,104,255,.22);border:1px solid rgba(142,104,255,.36);box-shadow:0 0 12px rgba(142,104,255,.18)}
.report-screen .overlay-vision{left:31%;top:18%;width:38%;height:10%;border-radius:999px;background:rgba(255,91,91,.22);border:1px solid rgba(255,91,91,.38);box-shadow:0 0 12px rgba(255,91,91,.16)}
.report-screen .overlay-oral{left:41%;top:28%;width:18%;height:8%;border-radius:999px;background:rgba(20,188,137,.22);border:1px solid rgba(20,188,137,.36);box-shadow:0 0 10px rgba(20,188,137,.16)}
.report-screen .overlay-weight{left:32%;top:47%;width:36%;height:24%;border-radius:45% 45% 38% 38%;background:rgba(255,151,65,.22);border:1px solid rgba(255,151,65,.38);box-shadow:0 0 14px rgba(255,151,65,.16)}
.report-screen .overlay-spine{left:47%;top:36%;width:6%;height:36%;border-radius:999px;background:rgba(45,133,245,.24);border:1px solid rgba(45,133,245,.42);box-shadow:0 0 12px rgba(45,133,245,.16)}
.report-screen .health-overview-card{padding:13px 12px;border-radius:16px;background:#fff;border:1px solid rgba(216,238,234,.65);box-shadow:0 10px 28px rgba(38,191,195,.08);display:flex;flex-direction:column;gap:7px}
.report-screen .health-overview-card h3{font-size:16px;margin:0 0 2px;color:var(--text-title)}
.report-screen .health-overview-row{min-height:50px;width:100%;border:0;border-radius:13px;background:#FAFEFD;display:grid;grid-template-columns:30px minmax(70px,1fr) auto minmax(92px,1.1fr) 14px;align-items:center;gap:8px;text-align:left;color:var(--text-main);box-shadow:inset 0 0 0 1px rgba(216,238,234,.65)}
.report-screen .health-overview-row b{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:15px;background:var(--primary)}
.report-screen .health-overview-row strong{font-size:14px;color:var(--text-title);white-space:nowrap}
.report-screen .health-overview-row small{font-size:12px;color:var(--text-main);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.report-screen .health-overview-row i{font-style:normal;color:#9AADB2;font-size:18px}
.report-screen .health-overview-row.high b{background:var(--risk-high)}
.report-screen .health-overview-row.medium b{background:var(--risk-mid)}
.report-screen .health-overview-row.low b{background:var(--risk-low)}
.report-screen .health-overview-row.normal b{background:var(--risk-normal)}
.report-screen .health-overview-row.pending b{background:var(--risk-pending)}
.report-screen .health-overview-row.active{background:var(--primary-tint);box-shadow:inset 3px 0 0 var(--primary),inset 0 0 0 1px rgba(38,191,195,.28)}
.report-screen .health-detail{gap:8px}
.report-screen .health-detail .pill{align-self:flex-start}
.report-screen .health-detail p{font-size:13px;line-height:1.55}
@media(max-width:380px){.report-screen .body-link-card{grid-template-columns:60px minmax(0,1fr)!important}.report-screen .health-nav-list,.report-screen .health-nav-list button{width:60px}.report-screen .body-map-container{width:200px!important;height:320px!important}.report-screen .health-overview-row{grid-template-columns:28px minmax(64px,1fr) auto minmax(74px,1fr) 10px;gap:6px}.report-screen .health-overview-row strong{font-size:13px}.report-screen .health-overview-row small{font-size:11px}}
/* 报告页第二版：五健状态总览 + 当前项摘要 + 人体区域高亮 */
.report-screen .body-health-card{display:flex!important;flex-direction:column!important;gap:12px!important;padding:14px!important;border-radius:16px!important;background:#fff!important;border:1px solid rgba(216,238,234,.65)!important;box-shadow:0 10px 28px rgba(38,191,195,.08)!important;overflow:hidden!important}
.report-screen .body-health-card .section-title{font-size:16px;font-weight:800;color:var(--text-title);line-height:1.25}
.report-screen .body-health-main{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:10px;align-items:center}
.report-screen .body-health-card .body-map-container{width:min(214px,100%)!important;height:330px!important;margin:0 auto!important;position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important;overflow:visible!important}
.report-screen .body-health-card .body-map-container::before{display:none!important}
.report-screen .body-health-card .body-map-bg{position:absolute;left:50%;top:50%;width:92%;height:88%;transform:translate(-50%,-50%);border-radius:48%;background:rgba(216,248,244,.72);z-index:0;pointer-events:none}
.report-screen .body-health-card .body-image{position:relative!important;z-index:1!important;width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;pointer-events:none!important;background:transparent!important}
.report-screen .body-health-card .body-point{display:none!important}
.report-screen .body-health-card .health-overlay{position:absolute;z-index:2;pointer-events:none;opacity:0;transition:all .2s ease}
.report-screen .body-health-card .health-overlay.visible{opacity:.35}
.report-screen .body-health-card .health-overlay.active{opacity:1;transform:scale(1.04)}
.report-screen .body-health-card .health-overlay.pending{opacity:.22;border-style:dashed}
.report-screen .body-health-card .health-overlay.hidden{opacity:0}
.report-screen .health-status-list{display:flex;flex-direction:column;gap:7px;width:104px;align-self:center}
.report-screen .health-status-btn{height:46px;width:104px;border:0;border-radius:13px;background:#F7FBFA;display:grid;grid-template-columns:24px 1fr;grid-template-rows:1fr 1fr;column-gap:7px;align-items:center;text-align:left;color:var(--text-main);box-shadow:inset 0 0 0 1px rgba(216,238,234,.72);padding:6px 8px}
.report-screen .health-short-name{grid-row:1/3;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:14px;font-weight:800;background:var(--primary)}
.report-screen .health-name{font-size:12px;font-weight:800;color:var(--text-title);line-height:1.05}
.report-screen .health-status{font-size:11px;line-height:1.05;color:var(--text-main);white-space:nowrap}
.report-screen .health-status-btn.high .health-short-name{background:var(--risk-high)}
.report-screen .health-status-btn.medium .health-short-name{background:var(--risk-mid)}
.report-screen .health-status-btn.low .health-short-name{background:var(--risk-low)}
.report-screen .health-status-btn.normal .health-short-name{background:var(--risk-normal)}
.report-screen .health-status-btn.pending .health-short-name{background:var(--risk-pending)}
.report-screen .health-status-btn.high .health-status{color:var(--risk-high)}
.report-screen .health-status-btn.medium .health-status{color:var(--risk-mid)}
.report-screen .health-status-btn.low .health-status{color:var(--risk-low)}
.report-screen .health-status-btn.normal .health-status{color:var(--risk-normal)}
.report-screen .health-status-btn.pending .health-status{color:var(--risk-pending)}
.report-screen .health-status-btn.active{background:var(--primary-tint);box-shadow:inset 3px 0 0 var(--primary),inset 0 0 0 1px rgba(38,191,195,.32)}
.report-screen .active-health-summary{padding:10px 11px;border-radius:13px;background:linear-gradient(135deg,#F7FEFC,#F0FCFA);border:1px solid rgba(216,238,234,.74);display:grid;gap:6px}
.report-screen .summary-header{display:flex;align-items:center;justify-content:space-between;gap:8px}
.report-screen .summary-header>span:first-child{font-size:15px;font-weight:800;color:var(--text-title)}
.report-screen .risk-tag{padding:3px 8px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.report-screen .risk-tag.high{color:var(--risk-high);background:var(--risk-high-bg)}
.report-screen .risk-tag.medium{color:var(--risk-mid);background:var(--risk-mid-bg)}
.report-screen .risk-tag.low{color:var(--risk-low);background:var(--risk-low-bg)}
.report-screen .risk-tag.normal{color:var(--risk-normal);background:var(--risk-normal-bg)}
.report-screen .risk-tag.pending{color:var(--risk-pending);background:var(--risk-pending-bg)}
.report-screen .summary-text{color:var(--text-main);font-size:13px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.report-screen .detail-link{justify-self:start;border:0;background:transparent;color:var(--primary-dark);font-size:13px;font-weight:800;padding:0;line-height:1.3}
.report-screen .health-overview-card{display:none!important}
.report-screen .health-detail{gap:8px;scroll-margin-top:12px}
.report-screen .health-detail .pill{align-self:flex-start}
.report-screen .health-detail p{font-size:13px;line-height:1.55}
@media(max-width:380px){.report-screen .body-health-main{grid-template-columns:minmax(0,1fr) 98px;gap:8px}.report-screen .health-status-list,.report-screen .health-status-btn{width:98px}.report-screen .body-health-card .body-map-container{width:196px!important;height:312px!important}.report-screen .health-status-btn{height:44px;padding:6px}.report-screen .health-name{font-size:11px}.report-screen .health-status{font-size:10px}}
/* 报告页第四版：字段层级与摘要信息优化 */
.report-screen .student-profile-card{align-items:center!important}
.report-screen .student-profile-card small{display:none!important}
.report-screen .assessment-card-lite{gap:9px!important;padding:12px 14px!important}
.report-screen .assessment-card-lite .assessment-banner{align-self:flex-start}
.report-screen .assessment-card-lite .assessment-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
.report-screen .assessment-card-lite .assessment-tags{display:flex!important;align-items:center!important;gap:0!important;color:var(--text-main);font-size:14px;font-weight:700}
.report-screen .assessment-card-lite .risk-text{color:var(--risk-mid)}
.report-screen .assessment-card-lite .divider{color:var(--text-sub);padding:0 3px}
.report-screen .assessment-card-lite .rescreen-text{color:var(--text-title)}
.report-screen .assessment-card-lite .notice-link{border:0;background:transparent;color:var(--primary-dark);font-size:13px;font-weight:800;padding:0;white-space:nowrap}
.report-screen .body-health-header{display:flex;align-items:center;justify-content:space-between;gap:10px}
.report-screen .abnormal-count{padding:4px 8px;border-radius:999px;background:var(--risk-mid-bg);color:var(--risk-mid);font-size:12px;font-weight:800;white-space:nowrap}
.report-screen .health-status-btn{grid-template-columns:1fr auto!important;grid-template-rows:1fr!important;height:42px!important;padding:7px 9px!important;column-gap:8px!important}
.report-screen .health-short-name{display:none!important}
.report-screen .health-name{font-size:13px!important;line-height:1.1!important;white-space:nowrap}
.report-screen .health-status{font-size:11px!important;text-align:right!important}
.report-screen .health-status-btn.active{box-shadow:inset 3px 0 0 var(--primary),inset 0 0 0 1px rgba(38,191,195,.32)!important}
.report-screen .active-health-summary{width:calc(100% - 32px);max-width:280px;margin:0 auto;padding:10px 12px!important}
.report-screen .summary-title{font-size:15px;font-weight:800;color:var(--text-title)}
.report-screen .summary-text{-webkit-line-clamp:2!important;min-height:36px}
.report-screen .summary-detail-link{justify-self:start}
@media(max-width:380px){.report-screen .health-status-btn{height:40px!important;padding:6px 7px!important}.report-screen .health-status-list,.report-screen .health-status-btn{width:98px}.report-screen .active-health-summary{width:calc(100% - 20px)}}
/* 报告页局部间距优化 */
.phone-content:has(.report-screen){padding-left:7px!important;padding-right:7px!important}
.report-screen{gap:9px!important}
.report-screen > h3{margin-top:2px!important;font-size:15px!important}
.report-screen .student-profile-card,.report-screen .assessment-card,.report-screen .body-health-card,.report-screen .health-detail,.report-screen .abnormal-card,.report-screen .advice-card,.report-screen .history-row{margin-left:0!important;margin-right:0!important}
.report-screen .student-profile-card,.report-screen .assessment-card-lite{padding-top:12px!important;padding-bottom:12px!important}
.report-screen .student-profile-card{align-items:start!important}
.report-screen .student-profile-card>span{align-self:start!important;padding-top:5px!important;line-height:1.2!important}
.report-screen .student-profile-card>span b{display:block;margin-top:4px;line-height:1.2!important}
.report-screen .body-health-card{gap:10px!important;padding:13px 12px!important}
.report-screen .body-health-main{grid-template-columns:minmax(0,1fr) 104px!important;gap:18px!important}
.report-screen .health-status-list{justify-self:end!important}
.report-screen .body-health-card .body-map-container{width:min(206px,100%)!important;height:318px!important}
.report-screen .active-health-summary{width:calc(100% - 8px)!important;max-width:340px!important}
.report-screen .active-health-summary .summary-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
.report-screen .summary-heading{min-width:0;display:flex;align-items:center;gap:7px;white-space:nowrap}
.report-screen .summary-heading .risk-tag{flex:none}
.report-screen .summary-detail-link{flex:none;justify-self:auto!important;white-space:nowrap}
.report-screen .summary-text{min-height:32px!important}
@media(max-width:380px){.phone-content:has(.report-screen){padding-left:7px!important;padding-right:7px!important}.report-screen .body-health-main{grid-template-columns:minmax(0,1fr) 98px!important;gap:14px!important}.report-screen .body-health-card .body-map-container{width:190px!important;height:306px!important}.report-screen .active-health-summary{width:100%!important}}
/* 报告页第三版：健康详情 Bottom Sheet */
.health-sheet-mask{position:absolute;inset:0;z-index:40;background:rgba(18,37,43,.42);display:flex;align-items:flex-end;justify-content:center;touch-action:none}
.phone-content.sheet-open{overflow:hidden!important}
.health-detail-sheet{width:100%;max-height:78vh;border-radius:24px 24px 0 0;background:#F8FEFC;box-shadow:0 -16px 38px rgba(18,52,58,.2);display:flex;flex-direction:column;overflow:hidden;animation:healthSheetUp .18s ease-out}
.sheet-header{padding:16px 18px 12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;background:#fff;border-bottom:1px solid rgba(216,238,234,.78)}
.sheet-title{color:var(--text-title);font-size:18px;font-weight:800;line-height:1.25}
.sheet-subtitle{margin-top:4px;color:var(--text-sub);font-size:13px;line-height:1.2}
.sheet-close{width:38px;height:38px;border:0;border-radius:50%;background:var(--primary-soft);color:var(--primary-dark);font-size:24px;line-height:38px;display:grid;place-items:center;padding:0;flex:none}
.sheet-body{padding:15px 16px 20px;overflow:auto;display:flex;flex-direction:column;gap:15px;-webkit-overflow-scrolling:touch}
.risk-row{display:flex;align-items:center;justify-content:flex-start}
.detail-section{padding:13px 14px;border-radius:15px;background:#fff;border:1px solid rgba(216,238,234,.68);box-shadow:0 8px 20px rgba(38,191,195,.06)}
.detail-label{color:var(--text-sub);font-size:12px;font-weight:700;line-height:1.2;margin-bottom:7px}
.detail-value{color:var(--text-title);font-size:14px;line-height:1.65;font-weight:600}
.advice-section{background:linear-gradient(135deg,#F0FCFA,#E8F8F6);border-color:rgba(38,191,195,.2)}
.advice-section .detail-value{color:var(--primary-dark)}
@keyframes healthSheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
/* 报告页第五版：详情弹框紧凑结构 */
.health-detail-sheet{max-height:78vh!important;overflow:hidden!important}
.health-detail-sheet .sheet-header{padding:18px 18px 14px!important;align-items:flex-start!important;background:#fff!important}
.health-detail-sheet .sheet-title-row{min-width:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.health-detail-sheet .sheet-title{font-size:20px!important;font-weight:800!important;color:var(--text-title)!important;line-height:1.25!important}
.health-detail-sheet .sheet-subtitle,.health-detail-sheet .risk-row{display:none!important}
.health-detail-sheet .sheet-body{padding:14px 18px 20px!important;overflow:auto!important;display:block!important;-webkit-overflow-scrolling:touch}
.health-detail-sheet .detail-block{margin:0 0 16px}
.health-detail-sheet .detail-block:last-child{margin-bottom:0}
.health-detail-sheet .block-title{margin:0 0 8px;color:var(--text-sub);font-size:13px;font-weight:800;line-height:1.2}
.health-detail-sheet .block-content{color:var(--text-title);font-size:15px;font-weight:600;line-height:1.6}
.health-detail-sheet .advice-block{padding:13px 14px;border-radius:14px;background:rgba(223,250,247,.82);border:1px solid rgba(33,184,174,.16)}
.health-detail-sheet .advice-block .block-title{color:var(--primary-dark)}
.health-detail-sheet .advice-block .block-content{color:var(--primary-dark)}
.health-detail-sheet .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.health-detail-sheet .info-item{padding:11px 12px;border-radius:12px;background:#fff;border:1px solid rgba(210,230,230,.9)}
.health-detail-sheet .info-label{color:var(--text-sub);font-size:13px;font-weight:800;line-height:1.25}
.health-detail-sheet .info-item .info-label{margin-bottom:6px}
.health-detail-sheet .info-value{color:var(--text-title);font-size:14px;font-weight:700;line-height:1.5}
.health-detail-sheet .abnormal-line{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.75);border:1px solid rgba(210,230,230,.8);line-height:1.55}
.health-detail-sheet .abnormal-line .info-label{margin:0;display:inline;color:var(--text-sub)}
.health-detail-sheet .abnormal-line .info-value{display:inline}
@media(max-width:360px){.health-detail-sheet .info-grid{grid-template-columns:1fr}}
/* 详情弹框检查信息表格 */
.health-detail-sheet .compact-info-block{padding-top:0}
.health-detail-sheet .check-table{margin-bottom:12px;border-radius:12px;background:#fff;border:1px solid rgba(210,230,230,.85);overflow:hidden}
.health-detail-sheet .check-table-head,.health-detail-sheet .check-table-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:12px;padding:9px 12px}
.health-detail-sheet .check-table-head{background:rgba(240,252,250,.86);color:var(--text-sub);font-size:13px;font-weight:800;line-height:1.25}
.health-detail-sheet .check-table-row{border-top:1px solid rgba(216,238,234,.7);color:var(--text-title);font-size:14px;font-weight:700;line-height:1.45}
.health-detail-sheet .check-table-row span{min-width:0;word-break:break-word}
.health-detail-sheet .advice-block{padding:13px 0!important;border-left:0!important;border-right:0!important;border-radius:0!important;background:linear-gradient(90deg,rgba(223,250,247,.82),rgba(223,250,247,.38))!important}
.health-detail-sheet .advice-block .block-title,.health-detail-sheet .advice-block .block-content{padding-left:0!important;padding-right:0!important}
.health-detail-sheet .info-grid,.health-detail-sheet .info-item{display:none!important}
@media(max-width:360px){.health-detail-sheet .check-table-head,.health-detail-sheet .check-table-row{grid-template-columns:1fr;row-gap:5px}.health-detail-sheet .check-table-head span:nth-child(2){display:none}.health-detail-sheet .check-table-row span:nth-child(2)::before{content:'参考范围：';color:var(--text-sub);font-weight:800}}
/* 报告页弹框整体优化 */
.health-detail-sheet .sheet-header{padding:16px 18px 10px!important}
.health-detail-sheet .sheet-title{font-size:20px!important}
.health-detail-sheet .sheet-health-tabs{display:flex;gap:8px;overflow-x:auto;padding:0 18px 12px;scrollbar-width:none;background:#fff;border-bottom:1px solid rgba(216,238,234,.78)}
.health-detail-sheet .sheet-health-tabs::-webkit-scrollbar{display:none}
.health-detail-sheet .sheet-health-tab{flex:0 0 auto;height:34px;min-width:60px;padding:0 11px;border-radius:999px;border:1px solid rgba(200,225,225,.9);background:rgba(255,255,255,.86);color:var(--text-main);display:flex;align-items:center;justify-content:center;gap:4px;font-size:13px}
.health-detail-sheet .sheet-health-tab.active{border-color:var(--primary-dark);background:rgba(225,250,247,.96);color:var(--primary-dark);font-weight:800}
.health-detail-sheet .sheet-health-tab.high .tab-status{color:var(--risk-high)}
.health-detail-sheet .sheet-health-tab.medium .tab-status{color:var(--risk-mid)}
.health-detail-sheet .sheet-health-tab.low .tab-status{color:var(--risk-low)}
.health-detail-sheet .sheet-health-tab.normal .tab-status{color:var(--risk-normal)}
.health-detail-sheet .sheet-health-tab.pending .tab-status{color:var(--risk-pending)}
.health-detail-sheet .tab-name{font-weight:700;white-space:nowrap}
.health-detail-sheet .tab-status{font-size:12px;font-weight:800;white-space:nowrap}
.health-detail-sheet .abnormal-line{margin:12px 0 14px!important;padding:10px 12px!important;border-radius:12px!important;background:rgba(255,255,255,.78)!important;border:1px solid rgba(210,230,230,.8)!important;font-size:15px!important;line-height:1.5!important}
.health-detail-sheet .abnormal-label{color:var(--text-sub);font-weight:800}
.health-detail-sheet .abnormal-value{color:var(--text-title);font-weight:800}
.health-detail-sheet .advice-block{margin:0 0 16px!important;padding:14px 16px!important;border-radius:14px!important;background:rgba(225,250,247,.92)!important;border:1px solid rgba(25,190,180,.14)!important}
.health-detail-sheet .advice-block .block-title{color:var(--primary-dark)!important}
.health-detail-sheet .advice-block .block-content{color:var(--primary-dark)!important;font-weight:800!important;line-height:1.6!important}
.health-detail-sheet .compact-info-block{margin-bottom:0!important}
/* 报告页弹框固定高度与层级优化 */
.health-detail-sheet{height:76vh!important;min-height:72vh!important;max-height:80vh!important;display:flex!important;flex-direction:column!important;border-radius:28px 28px 0 0!important;background:#F5FBFA!important;overflow:hidden!important}
.health-detail-sheet .sheet-top-fixed{flex:0 0 auto;background:#fff;border-bottom:1px solid rgba(216,238,234,.78)}
.health-detail-sheet .sheet-top-fixed .sheet-health-tabs{order:0;padding:16px 18px 12px!important;border-bottom:0!important;background:#fff!important}
.health-detail-sheet .sheet-top-fixed .sheet-header{order:1;padding:0 18px 14px!important;align-items:center!important;border-bottom:0!important;background:#fff!important}
.health-detail-sheet .sheet-scroll-body{flex:1 1 auto;overflow-y:auto;padding:16px 18px 20px;-webkit-overflow-scrolling:touch}
.health-detail-sheet .sheet-body{display:contents!important}
.health-detail-sheet .detail-block{margin:0 0 18px!important;padding:0!important}
.health-detail-sheet .block-title{margin:0 0 8px!important;color:var(--text-sub)!important;font-size:14px!important;font-weight:800!important;line-height:1.2!important}
.health-detail-sheet .block-content{color:var(--text-title)!important;font-size:15px!important;font-weight:600!important;line-height:1.65!important}
.health-detail-sheet .abnormal-block .abnormal-line{margin:0!important;padding:12px 14px!important;border-radius:12px!important;background:rgba(255,255,255,.82)!important;border:1px solid rgba(210,230,230,.85)!important}
.health-detail-sheet .abnormal-block .abnormal-value{font-size:15px!important;color:var(--text-title)!important;font-weight:800!important;line-height:1.5!important}
.health-detail-sheet .advice-block{padding:14px 16px!important;border-radius:14px!important;background:rgba(225,250,247,.92)!important;border:1px solid rgba(25,190,180,.14)!important}
.health-detail-sheet .advice-block .block-title{color:var(--primary-dark)!important}
.health-detail-sheet .advice-block .block-content{color:var(--primary-dark)!important;font-weight:800!important}
.health-detail-sheet .compact-info-block{margin-bottom:0!important}
@media(max-width:360px){.health-detail-sheet .sheet-scroll-body{padding:14px 16px 18px}.health-detail-sheet .sheet-top-fixed .sheet-health-tabs{padding-left:16px!important;padding-right:16px!important}.health-detail-sheet .sheet-top-fixed .sheet-header{padding-left:16px!important;padding-right:16px!important}}
/* 健康建议标题对齐优化 */
.health-detail-sheet .advice-block{padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;margin:0 0 18px!important}
.health-detail-sheet .advice-block .block-title{color:var(--text-sub)!important;margin:0 0 8px!important;padding:0!important}
.health-detail-sheet .advice-content-card{padding:14px 16px;border-radius:14px;background:rgba(225,250,247,.92);border:1px solid rgba(25,190,180,.14)}
.health-detail-sheet .advice-content-card .block-content{color:var(--primary-dark)!important;font-weight:800!important;line-height:1.6!important;padding:0!important}
/* 报告页弹框优化2：导航与内容块轻量化 */
.health-detail-sheet .sheet-health-tab{min-width:64px!important;height:34px!important;padding:0 14px!important;font-size:14px!important;font-weight:700!important}
.health-detail-sheet .sheet-health-tab .tab-status{display:none!important}
.health-detail-sheet .sheet-close{display:none!important}
.health-detail-sheet .sheet-close-light{width:34px;height:34px;border:0;background:transparent;color:var(--primary-dark);font-size:28px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;flex:none}
.health-detail-sheet .sheet-close-light:active{opacity:.7}
.health-detail-sheet .detail-block{margin:0 0 18px!important;padding:0!important;background:transparent!important;border:0!important}
.health-detail-sheet .plain-content{padding:0!important;background:transparent!important;border:0!important;font-weight:700!important}
.health-detail-sheet .soft-content{padding:12px 14px!important;border-radius:12px!important;background:rgba(255,255,255,.72)!important;border:0!important;color:var(--text-title)!important;font-weight:700!important;line-height:1.55!important}
.health-detail-sheet .advice-content{padding:14px 16px!important;border-radius:14px!important;background:rgba(225,250,247,.92)!important;border:0!important;color:var(--primary-dark)!important;font-weight:800!important;line-height:1.6!important}
.health-detail-sheet .advice-block{padding:0!important;border:0!important;background:transparent!important;border-radius:0!important}
.health-detail-sheet .abnormal-block .abnormal-line{display:none!important}
.health-detail-sheet .advice-content-card{display:contents!important}
/* 弹框内容块宽度与内边距微调 */
.health-detail-sheet .soft-content{display:block!important;width:100%!important;box-sizing:border-box!important;padding:12px 18px!important}
.health-detail-sheet .advice-content{display:block!important;width:100%!important;box-sizing:border-box!important;padding:14px 18px!important}
/* 弹框内容块文字对齐与背景外扩 */
.health-detail-sheet .soft-content{width:calc(100% + 36px)!important;margin-left:-18px!important;padding-left:18px!important;padding-right:18px!important}
.health-detail-sheet .advice-content{width:calc(100% + 36px)!important;margin-left:-18px!important;padding-left:18px!important;padding-right:18px!important}
/* 弹框内容区统一栅格对齐 */
.health-detail-sheet .sheet-scroll-body{flex:1 1 auto!important;overflow-y:auto!important;padding:20px 24px 28px!important;box-sizing:border-box!important}
.health-detail-sheet .detail-block{width:100%!important;box-sizing:border-box!important;margin:0 0 20px!important;padding:0!important;background:transparent!important;border:0!important}
.health-detail-sheet .conclusion-block .block-content{width:100%!important;box-sizing:border-box!important;padding:0!important;background:transparent!important;border:0!important;color:var(--text-title)!important;font-size:15px!important;font-weight:700!important;line-height:1.65!important}
.health-detail-sheet .soft-content{display:block!important;width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;padding:12px 14px!important;border-radius:12px!important;background:rgba(255,255,255,.76)!important;border:0!important;color:var(--text-title)!important;font-size:15px!important;font-weight:700!important;line-height:1.55!important}
.health-detail-sheet .advice-content{display:block!important;width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important;padding:14px 16px!important;border-radius:14px!important;background:rgba(225,250,247,.92)!important;border:0!important;color:var(--primary-dark)!important;font-size:15px!important;font-weight:800!important;line-height:1.6!important}
.health-detail-sheet .check-table{width:100%!important;box-sizing:border-box!important;margin-left:0!important;margin-right:0!important}
@media(max-width:360px){.health-detail-sheet .sheet-scroll-body{padding:18px 20px 24px!important}}
/* 弹框纯文本内容展示 */
.health-detail-sheet .sheet-scroll-body{padding:20px 24px 28px!important;box-sizing:border-box!important}
.health-detail-sheet .detail-block{width:100%!important;box-sizing:border-box!important;margin:0 0 20px!important;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important}
.health-detail-sheet .block-title{margin:0 0 8px!important;font-size:14px!important;font-weight:800!important;color:var(--text-sub)!important;line-height:1.2!important}
.health-detail-sheet .block-content,.health-detail-sheet .strong-content,.health-detail-sheet .advice-text{display:block!important;width:100%!important;box-sizing:border-box!important;margin:0!important;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;font-size:15px!important;line-height:1.65!important;color:var(--text-title)!important}
.health-detail-sheet .strong-content{font-weight:700!important}
.health-detail-sheet .advice-text{color:var(--primary-dark)!important;font-weight:800!important}
.health-detail-sheet .soft-content,.health-detail-sheet .advice-content{margin:0!important;padding:0!important;width:100%!important;background:transparent!important;border:0!important;border-radius:0!important}
.health-detail-sheet .abnormal-line,.health-detail-sheet .advice-content-card{display:contents!important;background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;margin:0!important}
/* 弹框标题正文间距调整 */
.health-detail-sheet .block-title{margin-bottom:5px!important}
/* 弹框滚动条与报告页一致 */
.health-detail-sheet .sheet-scroll-body::-webkit-scrollbar{width:4px}
.health-detail-sheet .sheet-scroll-body::-webkit-scrollbar-track{background:transparent}
.health-detail-sheet .sheet-scroll-body::-webkit-scrollbar-thumb{background:rgba(96,117,124,.18);border-radius:999px}
.health-detail-sheet .sheet-scroll-body::-webkit-scrollbar-thumb:hover{background:rgba(96,117,124,.34)}
.health-detail-sheet .sheet-scroll-body{scrollbar-width:thin;scrollbar-color:rgba(96,117,124,.18) transparent}
/* 报告页头部信息卡优化 */
.report-screen .report-student-card{display:flex!important;flex-direction:column!important;gap:9px!important;padding:12px 13px 11px!important;background:linear-gradient(135deg,#DDF8F4 0%,#F3FCFA 58%,#FFFFFF 100%)!important;color:var(--text-title)!important;border:1px solid rgba(216,238,234,.68)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(38,191,195,.07)!important;overflow:hidden!important}
.report-screen .report-student-card h2{margin:0;color:var(--text-title)!important;font-size:21px!important;line-height:1.15!important;font-weight:800!important}
.report-screen .report-student-card p,.report-screen .report-student-card span{color:var(--text-main)!important}
.report-screen .student-main-info{display:flex!important;flex-direction:column!important;gap:3px!important;min-width:0!important}
.report-screen .student-name-line{display:flex;align-items:center;gap:9px;min-width:0}.report-screen .student-name-line span{font-size:13px!important;line-height:1.2!important;color:#60757C!important;font-weight:700!important;white-space:nowrap}.report-screen .student-main-info p{font-size:13px!important;line-height:1.35!important;color:#60757C!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.report-screen .report-card-bottom{display:grid;grid-template-columns:minmax(0,65%) minmax(92px,35%);gap:10px;align-items:center;padding-top:8px;border-top:1px solid rgba(216,238,234,.68)}
.report-screen .current-report-info{min-width:0;display:grid;gap:4px}.report-screen .current-report-info span{display:grid;grid-template-columns:68px minmax(0,1fr);align-items:start;font-size:12px!important;line-height:1.35!important;color:#60757C!important;white-space:normal;overflow-wrap:anywhere}.report-screen .current-report-info em{width:68px;font-style:normal;color:#60757C!important;white-space:nowrap;letter-spacing:0}.report-screen .current-report-info b{min-width:0;color:#60757C!important;font-weight:500!important;line-height:1.35!important;overflow-wrap:anywhere;text-align:left}.report-screen .current-report-info span:last-child b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.report-screen .report-card-actions{display:flex!important;flex-direction:column!important;align-items:flex-end!important;justify-content:center!important;gap:6px!important;min-width:0!important;padding:0!important;border:0!important}.report-screen .report-card-actions button{min-width:86px;height:36px;padding:0 9px;border-radius:10px;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:flex-end;gap:4px;background:rgba(255,255,255,.48);transition:background .16s,transform .16s}.report-screen .report-card-actions button:active{transform:scale(.98);background:rgba(255,255,255,.72)}.report-screen .report-card-actions b{font-size:15px;line-height:1;font-weight:900}.switch-report-btn{border:1px solid rgba(18,168,173,.18);color:var(--primary-dark)!important}.download-report-btn{border:1px solid rgba(96,117,124,.16);color:#60757C!important}
.report-select-sheet,.download-sheet{padding-bottom:calc(18px + env(safe-area-inset-bottom))!important}.report-option{width:100%;min-height:62px;margin-top:8px;padding:10px 12px;border:1px solid rgba(216,238,234,.82);border-radius:15px;background:#FAFEFD;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left}.report-option span{min-width:0;display:flex;flex-direction:column;gap:4px}.report-option b{color:var(--text-title);font-size:14px;line-height:1.3}.report-option small{color:var(--text-main);font-size:12px;line-height:1.35}.report-option em{flex:none;padding:4px 8px;border-radius:999px;background:#F3F6F7;color:#60757C;font-size:12px;font-style:normal;font-weight:800}.report-option.active{border-color:rgba(38,191,195,.42);background:var(--primary-tint);box-shadow:inset 3px 0 0 var(--primary)}.report-option.active em{background:var(--primary-soft);color:var(--primary-dark)}
.download-option{width:100%;min-height:56px;margin-top:8px;padding:10px 12px;border:1px solid rgba(216,238,234,.82);border-radius:15px;background:#FAFEFD;display:flex;align-items:center;gap:10px;text-align:left;color:var(--text-title)}.download-option:disabled{opacity:.62}.download-option .el-icon{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--primary-soft);color:var(--primary-dark);font-size:16px}.download-option span{min-width:0;display:flex;flex-direction:column;gap:3px}.download-option b{font-size:14px;color:var(--text-title)}.download-option small{font-size:11px;color:var(--text-sub);word-break:break-all}.download-message{margin:10px 2px 0!important;padding:9px 10px;border-radius:12px;font-size:13px!important;line-height:1.4!important}.download-message.loading{color:#C76D12;background:#FFF2DE}.download-message.success{color:var(--primary-dark);background:var(--primary-soft)}.download-message.error{color:var(--risk-high);background:var(--risk-high-bg)}.retry-download,.cancel-download{width:100%;height:40px;margin-top:9px;border-radius:13px;font-weight:800}.retry-download{border:0;background:var(--primary-soft);color:var(--primary-dark)}.cancel-download{border:0;background:#F3F6F7;color:#60757C}.cancel-download:disabled{opacity:.58}
/* 报告页详细结果优化 */
.report-screen{padding-bottom:18px!important}
.report-section{padding:14px 15px;border-radius:16px;background:#fff;border:1px solid rgba(216,238,234,.58);box-shadow:0 8px 22px rgba(18,168,173,.055)}
.report-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
.report-section-head h3{color:#20343A;font-size:16px;font-weight:800;line-height:1.2}
.report-section-head>span{flex:none;color:#12A8AD;font-size:12px;font-weight:800}
.risk-stat-text{margin:0 0 10px!important;color:#60757C;font-size:13px!important;line-height:1.4!important}
.abnormal-summary-list{display:flex;flex-direction:column;border-top:1px solid rgba(216,238,234,.72)}
.abnormal-summary-row{position:relative;width:100%;min-height:58px;padding:9px 0 9px 10px;border:0;border-bottom:1px solid rgba(216,238,234,.72);background:transparent;display:grid;grid-template-columns:4px minmax(0,1.15fr) minmax(72px,.85fr) auto 14px;align-items:center;gap:8px;text-align:left;color:#20343A}
.abnormal-summary-row:last-child{border-bottom:0}
.abnormal-summary-row i{width:4px;height:36px;border-radius:999px;background:#9AADB2}
.abnormal-summary-row.high i{background:#F25565}.abnormal-summary-row.medium i{background:#FF9442}.abnormal-summary-row.low i{background:#2D85F5}
.summary-main,.summary-values{min-width:0;display:flex;flex-direction:column;gap:3px}
.summary-main strong{font-size:14px;font-weight:800;line-height:1.25;color:#20343A}.summary-main small,.summary-values small{color:#7D8F95;font-size:11px;line-height:1.25}.summary-values b{font-size:13px;color:#20343A;line-height:1.25}
.abnormal-summary-row em{padding:3px 7px;border-radius:999px;font-size:11px;font-style:normal;font-weight:800;white-space:nowrap;background:#F3F6F7;color:#60757C}
.abnormal-summary-row.high em{color:#CF3F3F;background:#FFE8E8}.abnormal-summary-row.medium em{color:#C76D12;background:#FFF2DE}.abnormal-summary-row.low em{color:#2478C9;background:#E7F2FF}
.row-arrow{color:#9AADB2;font-size:18px;line-height:1}
.interpretation-text{color:#40545A!important;font-size:14px!important;line-height:1.7!important}
.action-list{margin:10px 0 0;padding-left:22px;display:grid;gap:7px;color:#20343A;font-size:14px;line-height:1.45;font-weight:700}
.action-list li::marker{color:#12A8AD;font-weight:800}
.section-toggle{align-self:flex-start;margin-top:10px;border:0;background:transparent;color:#12A8AD;font-size:13px;font-weight:800;padding:0}
.switch-row{flex:none;display:flex;align-items:center;gap:6px;color:#60757C;font-size:12px;font-weight:800;white-space:nowrap}
.switch-row input{appearance:none;width:32px;height:18px;padding:0;border:0;border-radius:999px;background:#DCEBE8;position:relative;transition:.16s}
.switch-row input::after{content:'';position:absolute;left:2px;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(32,52,58,.18);transition:.16s}
.switch-row input:checked{background:#12A8AD}.switch-row input:checked::after{transform:translateX(14px)}
.exam-results-head{display:flex;flex-direction:column;gap:6px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(216,238,234,.62)}
.exam-results-head h3{color:#20343A;font-size:16px;font-weight:800;line-height:1.2}
.exam-result-controls{height:38px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.toggle-all-groups{appearance:none;-webkit-appearance:none;box-sizing:border-box;height:34px;min-width:104px;padding:0 12px;border:1px solid rgba(38,191,195,.14);border-radius:17px;background:rgba(228,248,246,.78);box-shadow:none;color:var(--primary-dark);display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:14px;font-weight:500;line-height:1;white-space:nowrap;transition:background .16s,color .16s;border-image:none;outline:0}
.toggle-icon-stack{width:14px;height:16px;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0;color:currentColor;line-height:1;flex:none}
.toggle-icon-stack .el-icon{width:14px;height:7px;font-size:14px;line-height:7px;color:currentColor}.toggle-icon-stack .el-icon + .el-icon{margin-top:-2px}
.toggle-all-groups:hover:not(:disabled){background:rgba(216,246,243,.92)}
.toggle-all-groups:active:not(:disabled){background:rgba(202,241,237,.98)}
.toggle-all-groups:disabled{color:#A6B5B9;background:#F3F6F7;border-color:#EEF3F2;cursor:not-allowed}
.exam-result-controls .switch-row{margin-left:auto;align-self:center}
.result-empty{min-height:54px;border-radius:13px;background:#FAFEFD;border:1px dashed rgba(216,238,234,.92);display:grid;place-items:center;color:#9AADB2;font-size:13px;font-weight:700}.result-group-list{display:flex;flex-direction:column;gap:8px}
.result-group{border:1px solid rgba(216,238,234,.72);border-radius:14px;background:#FAFEFD;overflow:hidden}
.result-group-head{width:100%;min-height:52px;padding:10px 12px;border:0;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left}
.result-group-head span{min-width:0;display:flex;flex-direction:column;gap:3px}.result-group-head strong{color:#20343A;font-size:14px}.result-group-head small{color:#7D8F95;font-size:12px}.result-group-head b{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#E4F8F6;color:#12A8AD;font-size:16px;line-height:1}
.result-items{border-top:1px solid rgba(216,238,234,.72);background:#fff;animation:resultGroupOpen .16s ease-out}
.result-item{padding:9px 12px;border-bottom:1px solid rgba(216,238,234,.62)}.result-item:last-child{border-bottom:0}
.result-line{display:flex;align-items:center;justify-content:space-between;gap:10px}.result-line strong{min-width:0;color:#20343A;font-size:14px;line-height:1.35}.result-status{flex:none;padding:3px 7px;border-radius:999px;background:#F3F6F7;color:#60757C;font-size:11px;font-weight:800}.result-status.high{color:#CF3F3F;background:#FFE8E8}.result-status.medium{color:#C76D12;background:#FFF2DE}.result-status.low{color:#2478C9;background:#E7F2FF}
.result-meta{margin-top:5px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#60757C;font-size:12px;line-height:1.35}.result-meta b{color:#40545A;font-size:13px}.result-meta b.high{color:#CF3F3F}.result-meta b.medium{color:#C76D12}.result-meta b.low{color:#2478C9}.result-meta small{text-align:right;color:#7D8F95}
@keyframes resultGroupOpen{from{opacity:.45;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:360px){.abnormal-summary-row{grid-template-columns:4px minmax(0,1fr) auto 14px}.summary-values{grid-column:2/3}.abnormal-summary-row em{grid-column:3/4;grid-row:1/3}.row-arrow{grid-column:4/5;grid-row:1/3}.result-meta{align-items:flex-start;flex-direction:column;gap:3px}.result-meta small{text-align:left}}
/* 真机移动端：去掉电脑演示外壳，按竖屏 H5 全屏展示 */
@media (hover:none) and (pointer:coarse), (max-width:768px){
  .parent-demo{width:100vw!important;min-height:100dvh!important;height:100dvh!important;padding:0!important;margin:0!important;background:var(--bg-page)!important;overflow:hidden!important}
  .phone-shell{width:100vw!important;max-width:none!important;height:100dvh!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important;background:#F8FEFC!important}
  .phone-shell.is-login-shell{border:0!important;box-shadow:none!important}
  .phone-top{height:54px!important;flex:none!important;padding-top:env(safe-area-inset-top)!important;box-sizing:content-box!important}
  .phone-content{height:calc(100dvh - 118px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important;padding:14px 14px calc(26px + env(safe-area-inset-bottom))!important;overflow:auto!important}
  .login-content{height:calc(100dvh - 54px - env(safe-area-inset-top))!important;padding-bottom:calc(18px + env(safe-area-inset-bottom))!important;overflow:auto!important}
  .bottom-tabs{height:64px!important;padding-bottom:calc(6px + env(safe-area-inset-bottom))!important;box-sizing:content-box!important;flex:none!important}
  .health-sheet-mask,.child-sheet-mask{position:absolute!important;inset:0!important}
}
@media (hover:none) and (pointer:coarse) and (orientation:landscape){
  .parent-demo::before{content:'请将手机竖屏查看';position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#F8FEFC;color:#12A8AD;font-size:18px;font-weight:800;letter-spacing:0}
}

/* recovery: route, signup, questionnaire, mine and rescreen fixes */
.bottom-tabs{display:flex!important;align-items:center!important;justify-content:space-around!important;grid-template-columns:none!important}.bottom-tabs button{flex:1 1 25%!important;min-width:0!important}.phone-shell:has(.signup-screen) .bottom-tabs,.phone-shell:has(.rescreen-screen) .bottom-tabs,.phone-shell:has(.student-edit-screen) .bottom-tabs,.phone-shell:has(.profile-screen) .bottom-tabs{display:none!important}.phone-shell:has(.signup-screen) .phone-content,.phone-shell:has(.rescreen-screen) .phone-content,.phone-shell:has(.profile-screen) .phone-content,.phone-shell:has(.student-edit-screen) .phone-content{height:calc(100% - 54px)!important;padding-bottom:118px!important}.signup-screen{gap:12px!important;padding-bottom:118px!important}.signup-plan-card,.signup-section,.rescreen-notice-card,.rescreen-detail-card{padding:15px;border-radius:16px;background:#fff;border:1px solid rgba(216,238,234,.65);box-shadow:0 10px 28px rgba(38,191,195,.08)}.signup-card-head,.signup-section-title,.paid-group-title,.rescreen-title-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.signup-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px;color:#60757C;font-size:13px}.base-project-row{padding:10px 0;border-top:1px solid rgba(216,238,234,.7)}.base-project-row strong{display:block;margin-bottom:4px}.base-project-row span{color:#60757C;font-size:13px;line-height:1.55}.student-confirm-card{display:flex;flex-direction:column;gap:10px}.paid-deadline,.paid-collapsed-summary{margin-top:8px;color:#60757C;font-size:13px;line-height:1.55}.paid-category-tabs{display:flex;gap:8px;overflow:auto;margin:12px 0 10px;padding-bottom:2px}.paid-category-tabs button{height:30px;padding:0 12px;border:1px solid rgba(216,238,234,.8);border-radius:999px;background:#fff;color:#60757C;white-space:nowrap}.paid-category-tabs button.active{background:#E4F8F6;color:#12A8AD;border-color:#E4F8F6;font-weight:700}.paid-group{margin-top:10px}.paid-group-title span{color:#9AADB2;font-size:12px}.paid-project-row{width:100%;min-height:40px;margin-top:7px;padding:8px 10px;border:1px solid rgba(216,238,234,.8);border-radius:12px;background:#FAFEFD;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;text-align:left;color:#20343A}.paid-project-row i{font-style:normal;color:#12A8AD}.paid-project-row b{color:#12A8AD}.paid-project-row.selected{background:#E4F8F6;border-color:#12A8AD}.paid-project-row.disabled{opacity:.65}.order-items{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.order-items span{padding:4px 8px;border-radius:999px;background:#F0FCFA;color:#60757C;font-size:12px}.signup-bottom-bar{position:absolute;left:14px;right:14px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:10;min-height:64px;padding:10px 12px;border-radius:18px;background:rgba(255,255,255,.96);box-shadow:0 -8px 28px rgba(32,52,58,.12);display:flex;align-items:center;justify-content:space-between;gap:10px}.signup-bottom-bar div{display:flex;flex-direction:column;gap:3px}.signup-bottom-bar span{color:#60757C;font-size:12px}.signup-bottom-bar strong{font-size:20px;color:#12A8AD}.signup-bottom-bar button{height:42px;min-width:132px;border-radius:14px;border:0;padding:0 13px;font-weight:700}.result-sheet{display:flex;flex-direction:column;gap:12px}.questionnaire-card{min-height:64px;padding:12px 13px!important}.questionnaire-card-main{flex:1;min-width:0}.questionnaire-card-main p{margin-top:4px!important;color:#7C9298!important;font-size:12px!important;white-space:nowrap}.questionnaire-card-actions{display:flex;align-items:center;gap:8px;flex:none}.questionnaire-status{height:20px;padding:0 8px;border-radius:10px;font-size:11px;line-height:20px;white-space:nowrap}.questionnaire-status.todo{color:#7C58BC;background:#F1EAFF}.questionnaire-status.progressing{color:#C76D12;background:#FFF2DE}.questionnaire-status.done{color:#0D8F68;background:#E5F8F0}.questionnaire-status.expired{color:#7B878D;background:#EEF2F2}.questionnaire-card button{height:30px;padding:0 10px;font-size:12px}.question-screen .option{min-height:46px!important;height:auto!important;padding:0 14px!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important}.question-screen .option input{width:16px!important;flex:0 0 16px!important;margin:0!important}.question-screen .option span{flex:1!important;min-width:0!important;text-align:left!important;white-space:normal!important;word-break:normal!important}.question-screen .option.selected{background:#E4F8F6!important;border-color:#12A8AD!important;color:#20343A!important}.mine-profile-card{display:flex;flex-direction:column;gap:6px}.profile-form-card select{width:100%;height:44px;border:1px solid #D8EEEA;border-radius:12px;padding:0 11px;background:#FAFEFD;color:#20343A;font:inherit}.save-tip{color:#12A8AD;text-align:center}.student-manage-card{align-items:flex-start!important}.student-actions{display:flex;flex-direction:column;gap:7px;flex:none}.student-actions button{height:30px;padding:0 10px}.rescreen-status{height:24px;padding:0 9px;border-radius:999px;background:#FFF4E8;color:#F2994A;font-size:12px;line-height:24px}.rescreen-info-list{margin-top:12px;display:flex;flex-direction:column;gap:8px}.rescreen-info-list p,.rescreen-detail-card p{color:#60757C;font-size:13px;line-height:1.65}.rescreen-detail-card{display:flex;flex-direction:column;gap:10px}


/* signup visual recovery 2026-07-14 */
.phone-shell:has(.signup-screen){background:linear-gradient(180deg,#EAF8F5 0%,#F8FEFC 48%,#FFFFFF 100%)!important}
.phone-shell:has(.signup-screen) .phone-content{height:calc(100% - 54px)!important;padding:12px 12px 132px!important;background:linear-gradient(180deg,#EAF8F5 0%,#F8FEFC 42%,#FFFFFF 100%)!important;scroll-padding-bottom:132px!important}
.phone-shell:has(.signup-screen) .bottom-tabs{display:none!important}
.signup-screen{gap:12px!important;padding:0 0 132px!important;position:static!important;color:#20343A!important}
.signup-screen .page-title{position:sticky;top:-12px;z-index:9;margin:-12px -12px 0;padding:12px 12px 10px;background:rgba(248,254,252,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(216,238,234,.7)}
.signup-screen .page-title h2{font-size:19px!important;font-weight:800!important;color:#20343A!important;line-height:34px!important}
.signup-screen .page-title button{width:34px!important;height:34px!important;flex:none!important;background:#E4F8F6!important;color:#12A8AD!important;border:1px solid rgba(216,238,234,.9)!important;box-shadow:none!important}
.signup-plan-card{position:relative;overflow:hidden;padding:16px 15px!important;border:0!important;border-radius:20px!important;background:linear-gradient(135deg,#46D2D2 0%,#12A8AD 100%)!important;box-shadow:0 14px 32px rgba(18,168,173,.18)!important;color:#fff!important}
.signup-plan-card::after{content:"";position:absolute;right:-26px;top:-28px;width:116px;height:116px;border-radius:50%;background:rgba(255,255,255,.14)}
.signup-plan-card .signup-card-head{position:relative;z-index:1;align-items:flex-start!important;gap:10px!important}
.signup-plan-card .signup-card-head strong{max-width:220px;color:#fff!important;font-size:18px!important;font-weight:800!important;line-height:1.35!important}
.signup-plan-card .pill{height:24px;padding:0 9px!important;border-radius:999px!important;background:rgba(255,255,255,.22)!important;color:#fff!important;border:1px solid rgba(255,255,255,.28)!important;line-height:24px!important;font-size:12px!important;font-weight:700!important;white-space:nowrap!important}
.signup-info-grid{position:relative;z-index:1;margin-top:14px!important;grid-template-columns:1fr 1fr!important;gap:8px!important;color:rgba(255,255,255,.9)!important;font-size:12px!important;line-height:1.35!important}
.signup-info-grid span{min-height:30px;padding:7px 8px;border-radius:12px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.92)!important}
.signup-section{padding:14px!important;border:1px solid rgba(216,238,234,.72)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 9px 24px rgba(38,191,195,.075)!important}
.signup-section-title{min-height:26px;margin-bottom:8px!important;align-items:center!important}
.signup-section-title strong{color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.3!important}
.signup-section-title button{height:28px;padding:0 10px;border:1px solid rgba(216,238,234,.85);border-radius:999px;background:#F0FCFA;color:#12A8AD;font-size:12px;font-weight:700}
.signup-section>p{color:#60757C!important;font-size:13px!important;line-height:1.65!important;margin:0!important}
.base-project-list{margin-top:10px!important;border-top:1px solid rgba(216,238,234,.72)!important}
.base-project-row{padding:11px 0 10px!important;border-top:0!important;border-bottom:1px solid rgba(216,238,234,.62)!important}
.base-project-row:last-child{border-bottom:0!important;padding-bottom:2px!important}
.base-project-row strong{display:block!important;margin:0 0 5px!important;color:#20343A!important;font-size:14px!important;font-weight:700!important;line-height:1.3!important}
.base-project-row span{display:block!important;color:#60757C!important;font-size:13px!important;line-height:1.65!important;word-break:normal!important}
.student-confirm-card label{display:flex!important;flex-direction:column!important;gap:6px!important;color:#60757C!important;font-size:13px!important;font-weight:600!important}
.student-confirm-card input,.student-confirm-card textarea{width:100%!important;border:1px solid rgba(216,238,234,.95)!important;border-radius:13px!important;background:#FAFEFD!important;color:#20343A!important;font-size:14px!important;box-shadow:none!important}
.student-confirm-card input{height:42px!important;padding:0 11px!important}
.student-confirm-card textarea{min-height:76px!important;padding:10px 11px!important;line-height:1.55!important}
.paid-project-section{padding-bottom:16px!important}
.paid-deadline,.paid-collapsed-summary{margin-top:8px!important;padding:8px 10px;border-radius:12px;background:#F8FEFC;color:#60757C!important;font-size:12px!important;line-height:1.55!important;border:1px solid rgba(216,238,234,.62)}
.paid-category-tabs{display:flex!important;gap:8px!important;overflow-x:auto!important;margin:12px -2px 10px!important;padding:0 2px 4px!important;scrollbar-width:none!important}
.paid-category-tabs::-webkit-scrollbar{display:none!important}
.paid-category-tabs button{flex:0 0 auto;height:30px!important;padding:0 12px!important;border-radius:999px!important;border:1px solid rgba(216,238,234,.9)!important;background:#fff!important;color:#60757C!important;font-size:12px!important;font-weight:600!important;box-shadow:none!important}
.paid-category-tabs button.active{background:#E4F8F6!important;border-color:#12A8AD!important;color:#12A8AD!important;font-weight:800!important}
.paid-group{margin-top:12px!important;padding-top:2px!important}
.paid-group-title{height:28px!important;margin-bottom:6px!important;display:flex!important;align-items:center!important;justify-content:space-between!important}
.paid-group-title strong{font-size:14px!important;color:#20343A!important;font-weight:800!important}
.paid-group-title span{height:20px;padding:0 7px;border-radius:999px;background:#F0FCFA;color:#8AA0A6!important;font-size:11px!important;line-height:20px!important}
.paid-project-row{width:100%!important;min-height:44px!important;margin-top:7px!important;padding:9px 10px!important;border:1px solid rgba(216,238,234,.82)!important;border-radius:13px!important;background:#FAFEFD!important;display:grid!important;grid-template-columns:24px minmax(0,1fr) auto!important;align-items:center!important;gap:8px!important;text-align:left!important;box-shadow:none!important;transition:background .15s ease,border-color .15s ease!important}
.paid-project-row i{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;color:#12A8AD!important;font-style:normal!important;font-size:14px!important;font-weight:800!important;line-height:20px!important}
.paid-project-row span{min-width:0;color:#20343A!important;font-size:14px!important;font-weight:600!important;line-height:1.35!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.paid-project-row b{color:#12A8AD!important;font-size:14px!important;font-weight:800!important;white-space:nowrap!important}
.paid-project-row.selected{background:#E4F8F6!important;border-color:#12A8AD!important;box-shadow:0 0 0 2px rgba(18,168,173,.08)!important}
.paid-project-row.disabled{opacity:.62!important;cursor:not-allowed!important}
.order-summary-card{background:#F8FEFC!important}
.order-summary-card .signup-section-title span{height:22px;padding:0 8px;border-radius:999px;background:#E4F8F6;color:#12A8AD;font-size:12px;line-height:22px;font-weight:700}
.order-summary-card p{margin-top:6px!important;color:#60757C!important;font-size:13px!important;line-height:1.55!important}
.order-items{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin:10px 0!important}
.order-items span{padding:5px 8px!important;border-radius:999px!important;background:#fff!important;border:1px solid rgba(216,238,234,.7)!important;color:#60757C!important;font-size:12px!important;line-height:1.2!important}
.order-summary-card>strong{display:block;margin-top:4px;color:#12A8AD!important;font-size:16px!important;font-weight:800!important;text-align:right!important}
.signup-bottom-bar{position:absolute!important;left:10px!important;right:10px!important;bottom:calc(10px + env(safe-area-inset-bottom))!important;z-index:30!important;min-height:66px!important;padding:10px 12px!important;border-radius:20px!important;background:rgba(255,255,255,.97)!important;border:1px solid rgba(216,238,234,.92)!important;box-shadow:0 -10px 30px rgba(32,52,58,.14)!important;backdrop-filter:blur(14px)!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
.signup-bottom-bar div{min-width:76px;display:flex!important;flex-direction:column!important;gap:2px!important}
.signup-bottom-bar span{color:#8AA0A6!important;font-size:12px!important;line-height:1.2!important}
.signup-bottom-bar strong{color:#12A8AD!important;font-size:22px!important;font-weight:900!important;line-height:1.15!important}
.signup-bottom-bar button{flex:0 0 auto;max-width:190px;min-width:118px!important;height:44px!important;padding:0 13px!important;border-radius:15px!important;border:0!important;font-size:13px!important;font-weight:800!important;line-height:1.2!important;white-space:normal!important;box-shadow:0 10px 22px rgba(18,168,173,.18)!important}
.signup-bottom-bar .ghost{background:#F0FCFA!important;color:#12A8AD!important;border:1px solid rgba(216,238,234,.9)!important;box-shadow:none!important}
.phone-shell:has(.signup-screen) .child-sheet-mask{z-index:50!important}


/* signup paid project prompt refinement 2026-07-14 */
.phone-shell:has(.signup-screen) .paid-group-list{padding-bottom:18px!important}
.signup-screen .base-project-card{padding-bottom:12px!important}
.signup-screen .base-project-card .signup-section-title{margin-bottom:4px!important}
.signup-screen .base-project-card>p{margin-bottom:2px!important;color:#7C9298!important}
.base-project-row{display:block!important;background:transparent!important}
.base-project-row strong{letter-spacing:0!important}
.base-project-row span{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
.paid-project-section .signup-section-title{margin-bottom:6px!important}
.paid-project-section>p:first-of-type{color:#60757C!important}
.paid-collapsed-summary{display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:38px!important;font-weight:700!important;color:#12A8AD!important;background:#F0FCFA!important;border-color:#D8EEEA!important}
.paid-collapsed-summary::before{content:"订单摘要";color:#8AA0A6;font-size:12px;font-weight:600}
.paid-group-list{margin-bottom:8px!important}
.paid-project-row span::after{display:none!important;content:none!important}
.paid-project-row em,.paid-project-row small,.paid-project-row .tag,.paid-project-row .label{display:none!important}
.signup-bottom-bar{width:auto!important;max-width:none!important}
.phone-shell:has(.signup-screen) .signup-screen::after{content:"";display:block;height:18px;flex:0 0 18px}


/* route source return controls 2026-07-14 */
.route-return-title{margin-bottom:2px!important}.route-return-title h2{font-size:20px!important;font-weight:800!important;color:#20343A!important}.route-return-title button{width:34px!important;height:34px!important;flex:none!important}

/* signup notice project prompt 2026-07-14 */
.notice-project-card .signup-section-title strong{font-size:16px!important;color:#20343A!important}
.notice-project-list{display:flex!important;flex-direction:column!important;gap:14px!important;margin-top:12px!important}
.notice-project-group{padding:0!important;margin:0!important}
.notice-project-group h3{display:flex!important;align-items:center!important;gap:7px!important;margin:0 0 8px!important;font-size:14px!important;font-weight:800!important;color:#20343A!important;line-height:1.35!important;letter-spacing:0!important}
.notice-project-group h3 i{width:7px!important;height:7px!important;border-radius:50%!important;display:inline-block!important;flex:0 0 7px!important;background:#12A8AD!important}
.notice-project-group.vision h3 i{background:#2F80ED!important}
.notice-project-group.spine h3 i{background:#F2994A!important}
.notice-project-group.oral h3 i{background:#18B884!important}
.notice-project-group.mental h3 i{background:#8E6DEB!important}
.notice-project-tags{display:flex!important;flex-wrap:wrap!important;gap:7px!important}
.notice-project-tags span{min-height:25px!important;padding:5px 9px!important;border-radius:12px!important;background:#F0FCFA!important;border:1px solid rgba(216,238,234,.76)!important;color:#42636B!important;font-size:12px!important;line-height:15px!important;font-weight:600!important;white-space:nowrap!important}
.notice-project-group.vision .notice-project-tags span{background:#EAF3FF!important;color:#2F6FB7!important;border-color:#D7E8FF!important}
.notice-project-group.spine .notice-project-tags span{background:#FFF4E8!important;color:#A76118!important;border-color:#FFE2C2!important}
.notice-project-group.oral .notice-project-tags span{background:#E8F8F1!important;color:#147A5B!important;border-color:#CFEFE2!important}
.notice-project-group.mental .notice-project-tags span{background:#F3EEFF!important;color:#6C4FC4!important;border-color:#E2D7FF!important}
.phone-shell:has(.signup-screen) .phone-content{padding-bottom:30px!important;scroll-padding-bottom:30px!important}
.signup-screen{padding-bottom:30px!important}

/* signup top notice card prompt 2026-07-14 16:45 */
.signup-screen .page-title{position:relative!important;top:auto!important;z-index:auto!important;margin:0 0 2px!important;padding:0!important;background:transparent!important;backdrop-filter:none!important;border-bottom:0!important;gap:8px!important}
.signup-screen .page-title button{width:28px!important;height:28px!important;border-radius:0!important;background:transparent!important;border:0!important;color:#20343A!important;box-shadow:none!important;padding:0!important}
.signup-screen .page-title h2{font-size:20px!important;font-weight:800!important;line-height:28px!important;color:#20343A!important}
.signup-plan-card.signup-notice-card{display:flex!important;flex-direction:column!important;gap:9px!important;padding:13px 14px 12px!important;background:linear-gradient(135deg,#DDF8F4 0%,#F3FCFA 58%,#FFFFFF 100%)!important;color:#20343A!important;border:1px solid rgba(216,238,234,.68)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(38,191,195,.07)!important;overflow:hidden!important}
.signup-plan-card.signup-notice-card::after{display:none!important}
.signup-plan-card.signup-notice-card .signup-card-head{position:static!important;z-index:auto!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:6px!important}
.signup-plan-card.signup-notice-card .signup-card-head strong{max-width:none!important;color:#20343A!important;font-size:20px!important;font-weight:800!important;line-height:1.2!important}
.signup-plan-card.signup-notice-card .pill{height:22px!important;padding:0 8px!important;border-radius:999px!important;background:#E8F8F1!important;color:#18B884!important;border:0!important;line-height:22px!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}
.signup-student-info{display:flex!important;flex-direction:column!important;gap:3px!important;padding-top:2px!important}
.signup-student-name{display:flex!important;align-items:center!important;gap:9px!important;min-width:0!important}
.signup-student-name h3{margin:0!important;color:#20343A!important;font-size:18px!important;font-weight:800!important;line-height:1.18!important}
.signup-student-name span{color:#60757C!important;font-size:13px!important;font-weight:700!important;line-height:1.2!important;white-space:nowrap!important}
.signup-student-info p{color:#60757C!important;font-size:13px!important;line-height:1.35!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.signup-plan-card.signup-notice-card .signup-info-grid{display:grid!important;grid-template-columns:1fr!important;gap:4px!important;margin-top:2px!important;padding-top:8px!important;border-top:1px solid rgba(216,238,234,.68)!important;color:#60757C!important;font-size:12px!important;line-height:1.35!important}
.signup-plan-card.signup-notice-card .signup-info-grid span{display:grid!important;grid-template-columns:72px minmax(0,1fr)!important;align-items:start!important;min-height:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#60757C!important}
.signup-plan-card.signup-notice-card .signup-info-grid em{font-style:normal!important;color:#60757C!important;white-space:nowrap!important}
.signup-plan-card.signup-notice-card .signup-info-grid b{min-width:0!important;color:#60757C!important;font-weight:500!important;text-align:left!important;overflow-wrap:anywhere!important}

/* signup student confirm and paid selector refinement 2026-07-14 */
.student-confirm-card{gap:12px!important}
.student-confirm-list{display:flex!important;flex-direction:column!important;gap:7px!important;padding:2px 0 0!important}
.student-confirm-list p{display:grid!important;grid-template-columns:72px minmax(0,1fr)!important;align-items:center!important;gap:8px!important;min-height:30px!important;margin:0!important;color:#60757C!important;font-size:13px!important;line-height:1.35!important}
.student-confirm-list em{font-style:normal!important;color:#60757C!important;white-space:nowrap!important}
.student-confirm-list b{min-width:0!important;color:#20343A!important;font-size:14px!important;font-weight:700!important;text-align:left!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.student-confirm-card .student-remark-field{display:flex!important;flex-direction:column!important;gap:6px!important;color:#60757C!important;font-size:13px!important;font-weight:600!important}
.student-confirm-card .student-remark-field textarea{width:100%!important;border:1px solid rgba(216,238,234,.95)!important;border-radius:13px!important;background:#FAFEFD!important;color:#20343A!important;font-size:14px!important;box-shadow:none!important;min-height:76px!important;padding:10px 11px!important;line-height:1.55!important}
.paid-project-row{grid-template-columns:34px minmax(0,1fr) auto!important;min-height:48px!important;padding:9px 11px!important;gap:9px!important}
.paid-project-row i{width:28px!important;height:28px!important;border-radius:50%!important;border:2px solid rgba(18,168,173,.46)!important;background:#fff!important;display:grid!important;place-items:center!important;color:#12A8AD!important;font-size:16px!important;font-weight:900!important;line-height:1!important}
.paid-project-row.selected i{background:#12A8AD!important;border-color:#12A8AD!important;color:#fff!important}
.paid-project-row.selected{background:#E4F8F6!important;border-color:#12A8AD!important;box-shadow:0 0 0 2px rgba(18,168,173,.08)!important}

/* paid selector visual correction 2026-07-14 */
.paid-project-row i{box-sizing:border-box!important;color:transparent!important}
.paid-project-row.selected i{color:#fff!important}
.paid-project-row:not(.selected) i{font-size:0!important}
.paid-project-row:not(.selected) i::after{content:"";width:10px;height:10px;border-radius:50%;background:rgba(18,168,173,.22);display:block}

/* paid project compact checkbox prompt 2026-07-14 17:16 */
.paid-project-section{height:auto!important;min-height:0!important;padding-bottom:18px!important}
.paid-project-section .signup-section-title{margin-bottom:6px!important}
.paid-project-section>p{font-size:13px!important;line-height:1.5!important}
.paid-category-tabs{margin:10px -2px 9px!important;padding:0 2px 3px!important;gap:7px!important}
.paid-category-tabs button{height:28px!important;padding:0 11px!important;font-size:12px!important}
.paid-group-list{margin:0!important;padding-bottom:0!important}
.phone-shell:has(.signup-screen) .paid-group-list{padding-bottom:0!important}
.paid-group{margin-top:10px!important;padding-top:0!important}
.paid-group-title{height:26px!important;margin-bottom:10px!important}
.paid-group-title strong{font-size:15px!important;font-weight:800!important}
.paid-group-title span{height:19px!important;padding:0 7px!important;font-size:11px!important;line-height:19px!important}
.paid-project-row{min-height:50px!important;margin-top:7px!important;padding:8px 15px!important;display:grid!important;grid-template-columns:18px minmax(0,1fr) auto!important;gap:11px!important;align-items:center!important;border-radius:13px!important;background:#fff!important;border:1px solid rgba(216,238,234,.9)!important;box-shadow:none!important}
.paid-project-row i{box-sizing:border-box!important;width:18px!important;height:18px!important;border-radius:5px!important;border:1.5px solid #BFD8D4!important;background:#fff!important;display:grid!important;place-items:center!important;color:transparent!important;font-size:0!important;font-weight:900!important;line-height:1!important;font-style:normal!important}
.paid-project-row i::after{display:none!important;content:none!important}
.paid-project-row.selected{background:#F0FCFA!important;border-color:#12A8AD!important;box-shadow:none!important}
.paid-project-row.selected i{background:#12A8AD!important;border-color:#12A8AD!important;color:#fff!important;font-size:13px!important}
.paid-project-row span{font-size:15px!important;font-weight:700!important;color:#20343A!important;line-height:1.35!important}
.paid-project-row b{font-size:16px!important;font-weight:800!important;color:#12A8AD!important;text-align:right!important}
.paid-project-row.disabled{opacity:.62!important}

/* paid inline tip prompt 2026-07-14 18:06 */
.paid-project-section .paid-inline-tip{margin:6px 0 12px!important;padding:0!important;border:0!important;background:transparent!important;color:#60757C!important;font-size:13px!important;line-height:20px!important;font-weight:400!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
.paid-project-section .paid-deadline{display:none!important}
.paid-project-section .paid-collapsed-summary{margin-top:6px!important;padding:0!important;border:0!important;background:transparent!important;color:#60757C!important;font-size:13px!important;line-height:20px!important}

/* student management page refinement 2026-07-15 */
.phone-shell:has(.students-screen) .phone-content{padding-bottom:92px!important;scroll-padding-bottom:92px!important}
.students-screen{gap:10px!important;padding-bottom:18px!important}
.students-screen .page-title{margin-bottom:2px!important}
.student-manage-card{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;padding:12px 13px!important;border:1px solid rgba(216,238,234,.68)!important;border-radius:16px!important;background:#fff!important;box-shadow:0 8px 22px rgba(38,191,195,.07)!important}
.student-manage-info{min-width:0!important;display:flex!important;flex-direction:column!important;gap:4px!important}
.student-card-title{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important}
.student-card-title strong{min-width:0!important;color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.student-card-title span{flex:none;height:20px;padding:0 7px;border-radius:999px;background:#12A8AD;color:#fff;font-size:11px;font-weight:700;line-height:20px}
.student-manage-info p{margin:0!important;color:#60757C!important;font-size:12px!important;line-height:1.35!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.student-actions{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:6px!important;flex:none!important}
.student-actions button,.student-actions span{height:28px!important;min-width:66px!important;padding:0 9px!important;border-radius:999px!important;border:1px solid rgba(216,238,234,.86)!important;background:#F8FEFC!important;color:#12A8AD!important;font-size:12px!important;font-weight:700!important;line-height:28px!important;text-align:center!important;box-shadow:none!important;white-space:nowrap!important}
.student-actions .current{border-color:#12A8AD!important;background:#12A8AD!important;color:#fff!important}
.student-actions .danger{border-color:#F3D6D6!important;background:#FFF7F7!important;color:#CF5C5C!important}
.add-student-btn{height:38px!important;border-radius:14px!important;font-size:14px!important;box-shadow:0 8px 18px rgba(18,168,173,.14)!important}
.add-student-btn.muted{background:#E4F8F6!important;color:#12A8AD!important;box-shadow:none!important;border:1px solid rgba(216,238,234,.82)!important}
.bind-student-form{gap:10px!important;margin-top:2px!important;padding:14px!important;border:1px solid rgba(216,238,234,.72)!important;border-radius:16px!important;background:#fff!important;box-shadow:0 8px 22px rgba(38,191,195,.07)!important}
.bind-student-form header{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:10px!important;margin-bottom:2px!important}
.bind-student-form header div{min-width:0!important;display:flex!important;flex-direction:column!important;gap:4px!important}
.bind-student-form header strong{color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.25!important}
.bind-student-form header p{margin:0!important;color:#9AADB2!important;font-size:12px!important;line-height:1.4!important}
.bind-student-form header button{flex:none;border:0!important;background:transparent!important;color:#9AADB2!important;font-size:12px!important;font-weight:600!important;padding:2px 0!important;height:auto!important;box-shadow:none!important}
.bind-student-form label{gap:5px!important;color:#60757C!important;font-size:12px!important;font-weight:700!important}
.bind-student-form input{height:38px!important;padding:0 10px!important;border-radius:11px!important;border:1px solid rgba(216,238,234,.95)!important;background:#FAFEFD!important;color:#20343A!important;font-size:13px!important;box-shadow:none!important}
.bind-student-form input::placeholder{color:#A7B6BA!important}
.bind-student-form .field-error{margin-top:-2px;color:#CF5C5C!important;font-size:11px!important;line-height:1.25!important}
.bind-student-form .primary{height:40px!important;border-radius:13px!important;margin-top:2px!important}
.delete-student-sheet .danger,.bind-confirm-sheet .danger{height:42px;border:0;border-radius:14px;background:#D95757;color:#fff;font-weight:800}
.delete-student-sheet .delete-warning{padding:9px 10px;border-radius:12px;background:#FFF7F7;color:#CF5C5C!important;font-size:13px!important;line-height:1.45!important}
@media(max-width:360px){.student-manage-card{grid-template-columns:1fr!important}.student-actions{width:100%!important;flex-direction:row!important;justify-content:flex-end!important;flex-wrap:wrap!important}.student-actions button,.student-actions span{min-width:62px!important}}
/* bottom tab optimization 2026-07-15 */
.bottom-tabs{height:66px!important;padding:6px 8px calc(6px + env(safe-area-inset-bottom))!important;box-sizing:content-box!important;display:flex!important;align-items:center!important;justify-content:space-around!important;background:rgba(255,255,255,.98)!important;border-top:1px solid rgba(216,238,234,.9)!important}
.bottom-tabs button{position:relative!important;flex:1 1 25%!important;min-width:0!important;height:54px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#8FA5AD!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;box-shadow:none!important;font-size:11px!important;font-weight:600!important;line-height:1!important;overflow:visible!important}
.bottom-tabs button::before{content:"";position:absolute;left:50%;top:50%;width:68px;height:50px;border-radius:18px;background:transparent;transform:translate(-50%,-50%);z-index:0;pointer-events:none}
.bottom-tabs button.active{color:#13B8B2!important;background:transparent!important}
.bottom-tabs button.active::before{background:rgba(35,196,188,.12)!important}
.bottom-tabs .el-icon,.bottom-tabs span{position:relative;z-index:1;color:currentColor!important}
.bottom-tabs .el-icon{font-size:21px!important;line-height:1!important}
.bottom-tabs span{font-size:11px!important;line-height:1!important;white-space:nowrap!important}
.phone-content{height:calc(100% - 120px)!important;padding-bottom:calc(30px + env(safe-area-inset-bottom))!important}
@media (hover:none) and (pointer:coarse), (max-width:768px){.phone-content{height:calc(100dvh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))!important}.bottom-tabs{height:66px!important}}
@media(max-width:360px){.bottom-tabs button::before{width:64px!important;height:50px!important}}
.project-screen{gap:10px!important;padding-bottom:12px}.project-screen .project-child-card{padding:13px 14px;border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);display:flex;align-items:center;justify-content:space-between;gap:10px}.project-screen .project-child-card strong{font-size:17px;margin:0;color:#20343A}.project-screen .project-child-card em{font-size:13px;color:#12A8AD;background:transparent;padding:0;font-style:normal;white-space:nowrap}.project-switcher{margin:0 -14px;padding:0 14px 2px;display:flex;gap:9px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.project-switcher::-webkit-scrollbar{display:none}.project-switcher button{min-width:188px;padding:11px 12px;border:0;border-radius:12px;background:#fff;text-align:left;box-shadow:0 7px 18px rgba(28,91,92,.055)}.project-switcher button.active{background:#EFFBF8;box-shadow:inset 0 0 0 1px rgba(18,168,173,.28),0 8px 18px rgba(18,168,173,.08)}.project-switcher strong{display:block;color:#20343A;font-size:14px;line-height:1.35}.project-switcher small{display:block;margin-top:6px;color:#60757C;font-size:12px}.current-project-card{padding:14px;border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);display:flex;flex-direction:column;gap:11px}.project-detail-main>strong{display:block;color:#20343A;font-size:17px;line-height:1.35}.project-detail-main>p{margin:6px 0 0;color:#60757C;font-size:13px;line-height:1.5}.project-detail-main .consent-inline{display:inline-flex;margin-top:9px;padding:5px 8px;border-radius:8px;background:#FFF7E8;color:#A66A12;font-size:12px;font-weight:700}.project-screen .lifecycle-card{padding:10px 6px;background:#F6FBFA;border:0;border-radius:10px;box-shadow:none;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:2px}.life-step{min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;color:#9AA9AD;font-size:11px}.life-step i{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#EEF3F2;color:transparent;position:relative;font-size:0}.life-step.done i::after{content:'✓';color:#12A8AD;font-size:11px}.life-step.current i{background:#12A8AD}.life-step.current i::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff}.life-step.todo i::after{content:'';width:5px;height:5px;border-radius:50%;background:#B8C4C5}.life-step span{white-space:nowrap}.project-empty-card{padding:16px 15px;border:0;border-radius:8px;background:#F0FBF8;box-shadow:0 8px 22px rgba(28,91,92,.045);color:#20343A}.project-empty-card strong{display:block;font-size:16px;line-height:1.35}.project-empty-card p{margin:6px 0 0;color:#60757C;font-size:13px;line-height:1.55}.project-lock-tip,.locked-card{padding:15px;border:0;border-radius:8px;background:#FFFAF2;box-shadow:0 8px 22px rgba(28,91,92,.055)}.project-lock-tip strong,.locked-card strong{font-size:15px;color:#20343A}.project-lock-tip p,.locked-card p{margin:6px 0 10px;color:#60757C;font-size:13px;line-height:1.55}.project-lock-tip button,.locked-card button{border:0;border-radius:10px;background:#12A8AD;color:#fff;padding:8px 12px;font-weight:700}.project-tabs{height:38px;display:grid;grid-template-columns:repeat(3,1fr);align-items:end;border-bottom:1px solid rgba(216,238,234,.72)}.project-tabs button{height:38px;border:0;background:transparent;color:#60757C;font-size:14px;font-weight:700;position:relative}.project-tabs button.active{color:#12A8AD}.project-tabs button.active::after{content:'';position:absolute;left:28%;right:28%;bottom:-1px;height:2px;border-radius:999px;background:#12A8AD}.flow-timeline{padding:4px 0 2px;background:#fff;border-radius:8px;box-shadow:0 8px 22px rgba(28,91,92,.055)}.flow-timeline .flow-row{position:relative;margin:0;padding:13px 13px 13px 35px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;border:0;border-radius:0;box-shadow:none;background:transparent}.flow-timeline .flow-row+.flow-row{border-top:1px solid rgba(216,238,234,.58)}.flow-timeline .flow-row>i{position:absolute;left:15px;top:19px;width:8px;height:8px;border-radius:50%;background:#12A8AD;z-index:1}.flow-timeline .flow-row:not(:last-child)::after{content:'';position:absolute;left:18px;top:29px;bottom:-8px;width:1px;background:rgba(18,168,173,.18)}.flow-timeline .flow-row strong{font-size:15px;color:#20343A}.flow-timeline .flow-row p{margin-top:4px;color:#60757C}.flow-timeline .flow-row span{align-self:start;padding:0;background:transparent;color:#12A8AD;font-size:12px;font-weight:700}.project-report-card,.archive-section,.project-trend-grid .trend-card,.project-service-row,.project-message-card{border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.project-report-card{padding:14px}.problem-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.problem-tags span{padding:4px 8px;border-radius:999px;background:#FFF0E8;color:#C96D20;font-size:12px}.doctor-advice{margin-top:10px;padding:10px;border-radius:13px;background:#F3FAF8;color:#31565C;font-size:13px;line-height:1.55}.archive-section{padding:14px;display:flex;flex-direction:column;gap:0}.archive-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:2px}.archive-head strong{font-size:16px;color:#20343A}.archive-head span{color:#8A9CA1;font-size:12px}.archive-card.compact{min-height:88px;padding:11px 12px;background:#fff;border:0;border-radius:10px;box-shadow:none;border-top:1px solid rgba(216,238,234,.62)}.archive-section .archive-card.compact:first-of-type{border-top:0}.archive-title{display:flex;align-items:center;justify-content:space-between;gap:10px}.archive-title strong{min-width:0;color:#20343A;font-size:15px}.archive-title button{border:0;background:transparent;color:#12A8AD;font-size:12px;font-weight:800;padding:0;white-space:nowrap}.archive-card.compact p{margin:5px 0 0;color:#60757C;font-size:12px;line-height:1.4}.archive-card.compact small{display:block;margin-top:5px;color:#20343A;font-size:13px;line-height:1.45;font-weight:500}.project-trend-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.project-trend-grid .trend-card{padding:12px}.trend-card div{display:flex;justify-content:space-between;gap:8px}.trend-card span{color:#8A9CA1;font-size:12px}.trend-card b{display:block;margin-top:8px;color:#20343A}.trend-card svg{width:100%;height:44px;margin-top:6px}.trend-card polyline{fill:none;stroke:#12A8AD;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.project-service-row{padding:12px;display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center}.project-service-row>b{width:34px;height:34px;border-radius:13px;background:#E4F8F6;color:#12A8AD;display:grid;place-items:center}.project-service-row p{margin-top:5px;color:#60757C;font-size:13px;line-height:1.55}.project-service-row span{color:#12A8AD;font-size:13px;font-weight:700}.project-message-card{padding:15px}.project-message-card p{padding:9px 0;border-top:1px solid rgba(216,238,234,.72);color:#60757C;font-size:13px;line-height:1.55}.report-doc-overlay{position:absolute;inset:54px 0 0;z-index:30;background:#F8FEFC;overflow:auto;padding:14px}.report-doc-page{min-height:100%;padding:14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);color:#20343A}.doc-title{display:flex;align-items:center;gap:10px;margin-bottom:12px}.doc-title button{border:0;border-radius:8px;background:#EDF8F6;color:#12A8AD;padding:7px 9px;font-size:12px;font-weight:800}.doc-title strong{font-size:17px}.doc-title p{margin:3px 0 0;color:#60757C;font-size:12px}.report-doc-page img{width:100%;height:auto;border-radius:8px;background:#EEF3F2;display:block}
/* report document viewer optimization */
.report-doc-overlay{position:absolute!important;inset:54px 0 0!important;z-index:30!important;display:flex!important;flex-direction:column!important;background:#F8FEFC!important;padding:0!important;overflow:hidden!important;color:#20343A!important}.report-doc-top{height:52px!important;min-height:52px!important;padding:0 14px!important;display:grid!important;grid-template-columns:34px minmax(0,1fr) 34px!important;align-items:center!important;gap:10px!important;background:rgba(255,255,255,.96)!important;border-bottom:1px solid rgba(216,238,234,.78)!important;box-shadow:0 4px 14px rgba(32,52,58,.04)!important}.report-doc-top button{width:34px!important;height:34px!important;border:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:#E4F8F6!important;color:#12A8AD!important;padding:0!important}.report-doc-top h2{margin:0!important;text-align:center!important;color:#20343A!important;font-size:17px!important;font-weight:800!important;line-height:1.2!important}.report-doc-info{padding:12px 16px 10px!important;background:#fff!important;border-bottom:1px solid rgba(216,238,234,.68)!important}.report-doc-info strong{display:block!important;color:#20343A!important;font-size:16px!important;line-height:1.35!important}.report-doc-info p{margin:4px 0 0!important;color:#60757C!important;font-size:12px!important;line-height:1.4!important}.report-doc-tools{height:48px!important;padding:8px 14px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;background:#fff!important;border-bottom:1px solid rgba(216,238,234,.68)!important}.report-doc-tools button{height:32px!important;border:1px solid rgba(216,238,234,.9)!important;border-radius:999px!important;background:#F0FCFA!important;color:#12A8AD!important;font-size:13px!important;font-weight:800!important;box-shadow:none!important}.report-doc-tools button:disabled{opacity:.45!important;color:#8FA5AD!important;background:#F7FAFA!important}.report-doc-stage{flex:1!important;min-height:0!important;overflow:auto!important;padding:12px!important;background:#F1F5F5!important;text-align:center!important;overscroll-behavior:contain!important}.report-doc-stage img{display:block!important;min-width:100%!important;max-width:none!important;height:auto!important;margin:0 auto!important;border-radius:4px!important;background:#fff!important;box-shadow:0 8px 22px rgba(31,54,58,.12)!important;transform-origin:top center!important}.report-doc-stage::-webkit-scrollbar{width:5px;height:5px}.report-doc-stage::-webkit-scrollbar-track{background:transparent}.report-doc-stage::-webkit-scrollbar-thumb{background:rgba(96,117,124,.26);border-radius:999px}
/* report document viewer secondary-page style alignment */
.report-doc-overlay{inset:54px 0 0!important;background:linear-gradient(180deg,#E7F8F5 0%,#F8FEFC 100%)!important;padding:14px!important;gap:12px!important;overflow:hidden!important}.report-doc-top{height:auto!important;min-height:34px!important;padding:0!important;display:flex!important;grid-template-columns:none!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;background:transparent!important;border-bottom:0!important;box-shadow:none!important;flex:none!important}.report-doc-top button{width:28px!important;height:28px!important;border-radius:0!important;background:transparent!important;border:0!important;color:#20343A!important;box-shadow:none!important;padding:0!important;display:grid!important;place-items:center!important}.report-doc-top button .el-icon{font-size:18px!important;color:#20343A!important}.report-doc-top h2{margin:0!important;text-align:left!important;color:#20343A!important;font-size:20px!important;font-weight:800!important;line-height:28px!important}.report-doc-top .top-placeholder{display:none!important}.report-doc-info{padding:15px!important;background:#fff!important;border:1px solid rgba(216,238,234,.65)!important;border-radius:16px!important;box-shadow:0 10px 28px rgba(38,191,195,.08)!important;flex:none!important}.report-doc-info strong{font-size:16px!important;font-weight:800!important}.report-doc-info p{margin-top:6px!important;color:#60757C!important;font-size:13px!important}.report-doc-tools{height:auto!important;padding:12px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;background:#fff!important;border:1px solid rgba(216,238,234,.65)!important;border-radius:16px!important;box-shadow:0 10px 28px rgba(38,191,195,.08)!important;flex:none!important}.report-doc-tools button{height:32px!important;border:1px solid rgba(216,238,234,.9)!important;border-radius:999px!important;background:#F0FCFA!important;color:#12A8AD!important;font-size:13px!important;font-weight:700!important}.report-doc-stage{flex:1!important;min-height:0!important;padding:10px!important;background:#fff!important;border:1px solid rgba(216,238,234,.65)!important;border-radius:16px!important;box-shadow:0 10px 28px rgba(38,191,195,.08)!important;overflow:auto!important;text-align:center!important}.report-doc-stage img{border-radius:6px!important;box-shadow:0 6px 18px rgba(31,54,58,.10)!important}
/* fullscreen medical report image viewer */
.report-image-viewer{position:absolute!important;inset:0!important;z-index:80!important;background:#101214!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}.viewer-close{position:absolute!important;left:12px!important;top:12px!important;z-index:3!important;width:36px!important;height:36px!important;border:0!important;border-radius:50%!important;background:rgba(255,255,255,.12)!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important;backdrop-filter:blur(8px)!important}.viewer-close .el-icon{font-size:20px!important;color:#fff!important}.viewer-image-stage{position:absolute!important;inset:0!important;overflow:auto!important;display:block!important;padding:60px 10px 24px!important;text-align:center!important;touch-action:none!important;overscroll-behavior:contain!important}.viewer-image-stage img{display:block!important;min-width:100%!important;max-width:none!important;height:auto!important;margin:0 auto!important;border-radius:2px!important;background:#fff!important;box-shadow:0 12px 34px rgba(0,0,0,.36)!important;transform-origin:center top!important;will-change:transform,width!important;user-select:none!important;-webkit-user-drag:none!important}.viewer-image-stage::-webkit-scrollbar{width:4px;height:4px}.viewer-image-stage::-webkit-scrollbar-track{background:transparent}.viewer-image-stage::-webkit-scrollbar-thumb{background:rgba(255,255,255,.28);border-radius:999px}.report-image-viewer .report-doc-top,.report-image-viewer .report-doc-info,.report-image-viewer .report-doc-tools,.report-image-viewer .report-doc-stage{display:none!important}
/* project report archive collapsible groups */
.project-screen .archive-collapsible{padding:14px!important;gap:0!important}.project-screen .archive-collapsible .archive-head{min-height:30px!important;margin:0!important;padding:0 0 8px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;align-items:center!important;gap:8px!important;border-bottom:0!important}.project-screen .archive-collapsible .archive-head strong{min-width:0;color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.35!important}.project-screen .archive-collapsible .archive-head span{color:#9AADB2!important;font-size:12px!important;font-weight:500!important;white-space:nowrap!important}.project-screen .archive-collapsible .archive-head button{height:28px!important;padding:0 10px!important;border:1px solid rgba(216,238,234,.85)!important;border-radius:999px!important;background:#F0FCFA!important;color:#12A8AD!important;font-size:12px!important;font-weight:700!important;box-shadow:none!important;white-space:nowrap!important}.project-screen .archive-collapsible .archive-card.compact{border-top:1px solid rgba(216,238,234,.62)!important}.project-screen .archive-collapsible .archive-head + .archive-card.compact,.project-screen .archive-collapsible .archive-head + template + .archive-card.compact{border-top:0!important}.project-screen .project-report-card{display:none!important}
.project-screen .project-child-card{min-height:54px!important;padding:12px 14px!important}
.project-prep-card{height:68px!important;padding:8px!important;border:0!important;border-radius:8px!important;background:#fff!important;box-shadow:0 8px 22px rgba(28,91,92,.045)!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
.project-prep-card button{min-width:0!important;height:52px!important;padding:6px 4px!important;border:0!important;border-radius:8px!important;background:#FAFEFD!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;text-align:center!important;box-shadow:none!important}
.project-prep-card button:active{background:#F0FCFA!important}
.project-prep-card strong{max-width:100%!important;color:#20343A!important;font-size:13px!important;font-weight:800!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.prep-status{max-width:100%!important;height:18px!important;padding:0 6px!important;border-radius:999px!important;background:#FFF4E8!important;color:#F2994A!important;font-size:10px!important;font-weight:800!important;line-height:18px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.prep-status.submitted{background:#E8F8F1!important;color:#18B884!important}.prep-status.saved{background:#E4F8F6!important;color:#12A8AD!important}.prep-status.editing,.prep-status.pending{background:#FFF4E8!important;color:#F2994A!important}
@media(max-width:390px){.project-prep-card{height:66px!important;padding:7px!important;gap:5px!important}.project-prep-card button{height:52px!important;padding:6px 3px!important}.project-prep-card strong{font-size:12px!important}.prep-status{padding:0 5px!important;font-size:10px!important}}
.project-sheet-entry{flex:none;border:0!important;background:transparent!important;color:var(--primary-dark,#12A8AD)!important;padding:0!important;font-size:13px!important;font-weight:800!important;white-space:nowrap;display:inline-flex;align-items:center;gap:3px;box-shadow:none!important}
.project-sheet-entry b{font-size:18px;line-height:1;font-weight:800;color:inherit}.project-sheet-entry:disabled{color:#8A9CA1!important;cursor:default!important}
.project-screen .project-switcher{display:none!important}
.project-sheet-mask{z-index:62!important}
.project-select-sheet{max-height:46vh!important;padding:16px 16px 18px!important;border-radius:22px 22px 0 0!important;background:#fff!important;overflow:hidden!important}
.project-select-sheet header{margin-bottom:6px!important}
.project-select-sheet header strong{font-size:18px!important;color:var(--text-title,#20343A)!important}
.project-option-list{max-height:calc(46vh - 64px);overflow-y:auto;-webkit-overflow-scrolling:touch}
.project-option{width:100%;min-height:62px;padding:9px 0;border:0;border-top:1px solid rgba(216,238,234,.72);background:transparent;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:10px;text-align:left}
.project-option:first-child{border-top:0}
.project-option i{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:var(--primary-dark,#12A8AD);font-size:14px;font-style:normal;font-weight:900}
.project-option span{min-width:0;display:flex;flex-direction:column;gap:4px}
.project-option b{color:var(--text-title,#20343A);font-size:15px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.project-option small{color:var(--text-main,#60757C);font-size:12px;line-height:1.25}
.project-option em{padding:3px 8px;border-radius:999px;background:var(--primary-tint,#F0FCFA);color:var(--primary-dark,#12A8AD);font-size:12px;font-style:normal;font-weight:800;white-space:nowrap}
.project-option.active{background:linear-gradient(90deg,rgba(228,248,246,.86),rgba(255,255,255,0));color:var(--primary-dark,#12A8AD)}
.project-option.active b{color:var(--primary-dark,#12A8AD)}
/* project flow timeline optimization */
.project-screen .current-project-card{gap:0!important}
.project-screen .lifecycle-card{display:none!important}
.project-screen .flow-timeline{padding:0!important;background:#fff!important;border-radius:8px!important;box-shadow:0 8px 22px rgba(28,91,92,.055)!important;overflow:hidden!important}
.project-screen .flow-timeline .flow-row{width:100%!important;min-height:64px!important;margin:0!important;padding:12px 34px 12px 38px!important;border:0!important;border-top:1px solid rgba(216,238,234,.58)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto auto!important;align-items:center!important;gap:8px!important;text-align:left!important;color:inherit!important;font:inherit!important;appearance:none!important}
.project-screen .flow-timeline .flow-row:first-child{border-top:0!important}
.project-screen .flow-timeline .flow-row:disabled{opacity:1!important;cursor:default!important}
.project-screen .flow-timeline .flow-row>i{position:absolute!important;left:16px!important;top:22px!important;width:9px!important;height:9px!important;border-radius:50%!important;background:#B8C4C5!important;z-index:1!important;box-shadow:0 0 0 4px #fff!important}
.project-screen .flow-timeline .flow-row.completed>i{background:#12A8AD!important}
.project-screen .flow-timeline .flow-row.current>i{background:#fff!important;border:2px solid #12A8AD!important;box-shadow:0 0 0 4px rgba(18,168,173,.13)!important}
.project-screen .flow-timeline .flow-row.pending>i{background:#F2994A!important}
.project-screen .flow-timeline .flow-row.not_started>i{background:#C7D2D4!important}
.project-screen .flow-timeline .flow-row:not(:last-child)::after{content:''!important;position:absolute!important;left:20px!important;top:33px!important;bottom:-12px!important;width:1px!important;background:rgba(18,168,173,.16)!important}
.project-screen .flow-timeline .flow-row.not_started:not(:last-child)::after{background:rgba(184,196,197,.42)!important}
.project-screen .flow-timeline .flow-row strong{display:block!important;color:#20343A!important;font-size:15px!important;font-weight:800!important;line-height:1.35!important}
.project-screen .flow-timeline .flow-row p{margin:4px 0 0!important;color:#60757C!important;font-size:13px!important;line-height:1.45!important}
.project-screen .flow-timeline .flow-row.not_started strong,.project-screen .flow-timeline .flow-row.not_started p{color:#9AADB2!important}
.project-screen .flow-timeline .flow-tip{align-self:center!important;padding:0!important;background:transparent!important;color:#F2994A!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}
.project-screen .flow-timeline .flow-row>b{position:absolute!important;right:13px!important;top:50%!important;transform:translateY(-50%)!important;color:#12A8AD!important;font-size:18px!important;line-height:1!important;font-weight:800!important}
.project-screen .flow-timeline .flow-row.clickable:active{background:#F8FEFC!important}
.flow-node-mask{z-index:63!important}
.flow-node-sheet{display:flex!important;flex-direction:column!important;gap:12px!important;padding:16px 16px 18px!important}
.flow-node-sheet p{margin:0!important;color:#60757C!important;font-size:14px!important;line-height:1.6!important}
/* project secondary pages */
.project-subpage-screen{gap:10px!important;padding-bottom:86px!important;background:transparent!important}
.project-subpage-screen:has(.questionnaire-progress){gap:9px!important}
.project-subpage-title{height:34px!important;display:grid!important;grid-template-columns:34px minmax(0,1fr) 34px!important;align-items:center!important;gap:8px!important}
.project-subpage-title h2{margin:0!important;text-align:center!important;color:#20343A!important;font-size:18px!important;font-weight:800!important}
.project-sub-summary,.sub-section,.sub-task-list article{background:#fff!important;border:1px solid rgba(216,238,234,.72)!important;border-radius:8px!important;box-shadow:0 8px 22px rgba(28,91,92,.055)!important}
.project-sub-summary{padding:13px 14px!important;display:flex!important;flex-direction:column!important;gap:5px!important}
.project-sub-summary strong{color:#20343A!important;font-size:16px!important;line-height:1.35!important}
.project-sub-summary p{color:#60757C!important;font-size:13px!important;line-height:1.45!important}
.project-sub-summary small{color:#12A8AD!important;font-size:12px!important;font-weight:800!important}
.sub-section{padding:14px!important;display:flex!important;flex-direction:column!important;gap:10px!important}
.sub-section h3{margin:0!important;color:#20343A!important;font-size:15px!important;font-weight:800!important;line-height:1.35!important}
.sub-form-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
.sub-form-grid label{min-width:0!important;color:#8A9CA1!important;font-size:12px!important;display:flex!important;flex-direction:column!important;gap:5px!important}
.sub-form-grid input,.project-subpage-screen textarea{width:100%!important;min-width:0!important;border:1px solid rgba(216,238,234,.9)!important;border-radius:8px!important;background:#FAFEFD!important;color:#20343A!important;font-size:13px!important;box-shadow:none!important}
.sub-form-grid input{height:36px!important;padding:0 10px!important}
.project-subpage-screen textarea{min-height:74px!important;padding:10px!important;resize:none!important}
.sub-info-list{gap:0!important}
.sub-info-list p,.signed-info p{margin:0!important;padding:9px 0!important;border-top:1px solid rgba(216,238,234,.62)!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important;color:#60757C!important;font-size:13px!important;line-height:1.45!important}
.sub-info-list p:first-child,.signed-info p:first-child{border-top:0!important}
.sub-info-list em,.signed-info em{font-style:normal!important;color:#9AADB2!important;white-space:nowrap!important}
.sub-info-list b,.signed-info b{font-weight:700!important;color:#20343A!important;text-align:right!important}
.sub-chip-list,.sub-options,.sub-check-list{display:flex!important;flex-wrap:wrap!important;gap:8px!important}
.sub-chip-list span,.sub-options span,.sub-check-list span{min-height:28px!important;padding:6px 9px!important;border-radius:8px!important;background:#F0FCFA!important;color:#42636B!important;border:1px solid rgba(216,238,234,.82)!important;font-size:12px!important;font-weight:700!important;line-height:1.25!important}
.sub-options span,.sub-check-list span{border:0!important}
.sub-options span.selected{background:#E4F8F6!important;border-color:#12A8AD!important;color:#12A8AD!important}
.questionnaire-progress,.followup-ticket,.training-overview,.consent-name{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}
.questionnaire-progress strong,.followup-ticket strong,.training-overview strong,.consent-name strong{font-size:16px!important;color:#20343A!important;line-height:1.35!important}
.questionnaire-progress p{margin-top:4px!important;color:#60757C!important;font-size:13px!important;line-height:1.45!important}
.followup-ticket span,.training-overview span,.consent-state{flex:none!important;padding:4px 9px!important;border-radius:999px!important;background:#FFF4E8!important;color:#F2994A!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}
.questionnaire-progress>div{width:100%!important}
.consent-state.done{background:#E8F8F1!important;color:#18B884!important}
.consent-content{max-height:300px!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important}
.consent-content p{margin:0 0 4px!important;color:#60757C!important;font-size:13px!important;line-height:1.65!important}
.project-subpage-screen:has(.consent-name){gap:5px!important}
.project-subpage-screen:has(.consent-name) .project-sub-summary,.project-subpage-screen:has(.consent-name) .sub-section,.project-subpage-screen:has(.consent-name) .consent-check,.project-subpage-screen:has(.consent-name) .project-submit-tip{margin:0!important}
.project-subpage-screen:has(.consent-name) .project-sub-bottom .primary:disabled{background:#DDE8E6!important;color:#8FA5AD!important;box-shadow:none!important;cursor:not-allowed!important}
.project-subpage-screen:has(.consent-name) .phone-content{padding-bottom:118px!important}
.consent-content{scrollbar-width:thin!important;scrollbar-color:rgba(120,160,160,.35) transparent!important}
.consent-content::-webkit-scrollbar{width:4px!important}
.consent-content::-webkit-scrollbar-track{background:transparent!important}
.consent-content::-webkit-scrollbar-thumb{background:rgba(120,160,160,.28)!important;border-radius:999px!important}
.consent-content::-webkit-scrollbar-thumb:hover{background:rgba(120,160,160,.42)!important}
.consent-check{display:flex!important;align-items:center!important;gap:8px!important;padding:0 2px!important;color:#60757C!important;font-size:13px!important}
.consent-check input{width:16px!important;height:16px!important;padding:0!important;accent-color:#12A8AD!important}
.sub-note-list{margin:0!important;padding-left:18px!important;color:#60757C!important;font-size:13px!important;line-height:1.7!important}
.sub-task-list{display:flex!important;flex-direction:column!important;gap:9px!important}
.sub-task-list article{min-height:64px!important;padding:12px 13px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:4px 10px!important;align-items:center!important}
.sub-task-list b{color:#20343A!important;font-size:15px!important;line-height:1.35!important}
.sub-task-list p{grid-column:1/2!important;margin:0!important;color:#60757C!important;font-size:13px!important;line-height:1.45!important}
.sub-task-list em{grid-column:2/3!important;grid-row:1/3!important;font-style:normal!important;color:#F2994A!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}
.upload-placeholder{height:36px!important;border:1px dashed rgba(18,168,173,.45)!important;border-radius:8px!important;background:#F8FEFC!important;color:#12A8AD!important;font-weight:800!important}
.project-submit-tip{margin:0!important;padding:8px 10px!important;border-radius:8px!important;background:#E8F8F1!important;color:#18B884!important;font-size:13px!important;font-weight:800!important;text-align:center!important}
.project-sub-bottom{position:absolute!important;left:14px!important;right:14px!important;bottom:calc(10px + env(safe-area-inset-bottom))!important;z-index:12!important;padding:10px!important;border-radius:12px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 -8px 24px rgba(32,52,58,.12)!important}
.project-sub-bottom .primary{height:42px!important;border-radius:10px!important}
@media(max-width:360px){.sub-form-grid{grid-template-columns:1fr!important}.questionnaire-progress,.followup-ticket,.training-overview,.consent-name{align-items:flex-start!important;flex-direction:column!important}.project-sub-bottom{left:12px!important;right:12px!important}}
.phone-shell:has(.project-subpage-screen) .bottom-tabs{display:none!important}.phone-shell:has(.project-subpage-screen) .phone-content{height:calc(100% - 54px)!important;padding-bottom:112px!important}
/* profile and first-visit questionnaire boundary refinement */
.sub-text-field{display:flex!important;flex-direction:column!important;gap:6px!important;color:#8A9CA1!important;font-size:12px!important}
.sub-text-field textarea{min-height:48px!important;background:#FAFEFD!important}
.sub-muted{margin:0!important;color:#8A9CA1!important;font-size:12px!important;line-height:1.45!important}
.sub-field-title{margin-top:2px!important;color:#60757C!important;font-size:13px!important;font-weight:800!important;line-height:1.25!important}
.health-history span.none{background:#F7FAFA!important;color:#8A9CA1!important;border-style:dashed!important}
.health-history span.selected{background:#E4F8F6!important;border-color:#12A8AD!important;color:#12A8AD!important}
.sub-link-list{display:flex!important;flex-direction:column!important;gap:8px!important}
.sub-link-list button{width:100%!important;min-height:54px!important;padding:10px 12px!important;border:1px solid rgba(216,238,234,.82)!important;border-radius:8px!important;background:#fff!important;box-shadow:0 8px 22px rgba(28,91,92,.045)!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;text-align:left!important}
.sub-link-list span{min-width:0!important;display:flex!important;flex-direction:column!important;gap:4px!important}
.sub-link-list b{color:#20343A!important;font-size:14px!important;line-height:1.3!important}
.sub-link-list small{color:#8A9CA1!important;font-size:12px!important;line-height:1.35!important}
.sub-link-list em{font-style:normal!important;color:#12A8AD!important;font-size:18px!important;font-weight:800!important}
.archive-toast{background:#FFF4E8!important;color:#C76D12!important}
.questionnaire-progress i{grid-column:1/-1!important;width:100%!important;height:4px!important;margin-top:8px!important;border-radius:999px!important;background:#E8F3F1!important;display:block!important;overflow:hidden!important}
.questionnaire-progress i span{display:block!important;width:17%!important;height:100%!important;border-radius:999px!important;background:#12A8AD!important}
.sub-question-group{min-height:48px!important;padding:10px 14px!important;border:1px solid rgba(216,238,234,.72)!important;border-radius:8px!important;background:#fff!important;box-shadow:0 6px 16px rgba(28,91,92,.04)!important;display:flex!important;flex-direction:column!important;gap:0!important}
.question-group-toggle{width:100%!important;min-height:28px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;color:#20343A!important;text-align:left!important}
.question-group-toggle span{position:relative!important;min-width:0!important;display:inline-flex!important;align-items:center!important;gap:6px!important;color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.25!important}.question-group-toggle span::before{content:""!important;width:3px!important;height:15px!important;border-radius:999px!important;background:#12A8AD!important;flex:none!important}
.question-group-toggle em{font-style:normal!important;color:#12A8AD!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}
.question-group-body{margin-top:10px!important;display:flex!important;flex-direction:column!important;gap:0!important}
.sub-question-group.expanded .question-group-toggle{background:transparent!important}
.sub-question-group .question-block{padding:10px 0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;display:flex!important;flex-direction:column!important;gap:7px!important;border-top:1px solid #EEF5F4!important}
.sub-question-group .question-block h4{margin:0!important;color:#41565C!important;font-size:14px!important;font-weight:500!important;line-height:1.35!important}
.question-group-body .question-block:first-child{padding-top:0!important;border-top:0!important}
.sub-question-group .sub-options span,.sub-question-group .sub-check-list span{background:#fff!important}
.sub-question-group .sub-options span.selected,.sub-question-group .sub-check-list span.selected{background:#E4F8F6!important;border:0!important;color:#12A8AD!important}
@media(max-width:390px){.sub-options span,.sub-check-list span{max-width:100%!important;word-break:break-word!important}.sub-link-list button{min-height:52px!important}.sub-question-group{padding:10px 13px!important}.sub-question-group .question-block{padding:10px 0!important}}
.questionnaire-state-tag{flex:none!important;height:21px!important;padding:0 8px!important;border-radius:999px!important;display:inline-flex!important;align-items:center!important;line-height:21px!important;font-size:11px!important;font-weight:800!important;background:#FFF4E8!important;color:#F2994A!important;white-space:nowrap!important}
.questionnaire-state-tag.saved{background:#E4F8F6!important;color:#12A8AD!important}
.questionnaire-state-tag.submitted{background:#E8F8F1!important;color:#18B884!important}
.questionnaire-actions{display:grid!important;grid-template-columns:1fr 1.35fr!important;gap:10px!important}
.questionnaire-actions button{width:100%!important;height:42px!important;border-radius:10px!important;padding:0 8px!important;font-size:14px!important;white-space:nowrap!important}
.questionnaire-actions .ghost{background:#F0FCFA!important;color:#12A8AD!important;border:1px solid rgba(216,238,234,.9)!important;box-shadow:none!important}
.sub-question-group:not(.is-readonly) .sub-options span,.sub-question-group:not(.is-readonly) .sub-check-list span{cursor:pointer!important}
.sub-question-group.is-readonly .sub-options span,.sub-question-group.is-readonly .sub-check-list span{pointer-events:none!important;color:#A2B2B7!important;background:#F7FAFA!important}
.sub-question-group.is-readonly .sub-options span.selected,.sub-question-group.is-readonly .sub-check-list span.selected{color:#12A8AD!important;background:#E4F8F6!important}
@media(max-width:390px){.questionnaire-actions{gap:8px!important}.questionnaire-actions button{font-size:13px!important;padding:0 6px!important}}
/* project profile view/edit/submit states */
.project-sub-summary{position:relative!important}
.profile-state-tag{align-self:flex-start!important;margin-top:2px!important;padding:3px 8px!important;border-radius:999px!important;font-size:12px!important;font-weight:800!important;line-height:1.25!important;background:#E4F8F6!important;color:#12A8AD!important}
.profile-state-tag.editing{background:#FFF4E8!important;color:#F2994A!important}
.profile-state-tag.submitted{background:#E8F8F1!important;color:#18B884!important}
.project-subpage-screen .sub-section.is-readonly input,.project-subpage-screen .sub-section.is-readonly textarea{border-color:transparent!important;background:#F8FCFB!important;color:#20343A!important;box-shadow:none!important;cursor:default!important;pointer-events:none!important;font-weight:700!important}
.project-subpage-screen .sub-section.is-readonly label{color:#9AADB2!important}
.project-subpage-screen .sub-section.is-editing input,.project-subpage-screen .sub-section.is-editing textarea{border-color:rgba(18,168,173,.42)!important;background:#fff!important;color:#20343A!important;box-shadow:0 0 0 2px rgba(18,168,173,.06)!important;font-weight:600!important}
.project-subpage-screen .sub-section.is-editing .sub-options span,.project-subpage-screen .sub-section.is-editing .sub-check-list span{cursor:pointer!important}
.project-subpage-screen .sub-section.is-readonly .sub-options span,.project-subpage-screen .sub-section.is-readonly .sub-check-list span{pointer-events:none!important}
.profile-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
.profile-actions.submitted{grid-template-columns:1fr 1.4fr!important}
.profile-actions button{width:100%!important;height:42px!important;border-radius:10px!important;padding:0 8px!important;font-size:14px!important;white-space:nowrap!important}
.profile-actions .ghost{background:#F0FCFA!important;color:#12A8AD!important;border:1px solid rgba(216,238,234,.9)!important;box-shadow:none!important}
@media(max-width:390px){.profile-actions{gap:8px!important}.profile-actions button{font-size:13px!important;padding:0 6px!important}}
/* project profile required marker and long school field fix */
.project-subpage-screen .sub-section.is-editing label.required{display:flex!important;flex-direction:column!important;gap:5px!important;position:relative!important}
.project-subpage-screen .sub-section.is-editing label.required .field-label{display:inline-flex!important;align-items:center!important;align-self:flex-start!important;min-height:16px!important;line-height:16px!important;color:#8A9CA1!important}
.project-subpage-screen .sub-section.is-editing label.required .field-label::after,.project-subpage-screen .sub-section.is-editing .sub-field-title.required::after{content:'*'!important;color:#E86A6A!important;font-size:12px!important;font-weight:900!important;line-height:1!important;display:inline-flex!important;align-items:center!important;margin-left:3px!important;transform:translateY(-.5px)!important}
.project-subpage-screen .sub-section.is-readonly label.required .field-label::after{content:none!important}
.sub-form-grid .wide-field{grid-column:1/-1!important}
.project-subpage-screen .sub-section.is-readonly .wide-field input{height:auto!important;min-height:38px!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.45!important;padding-top:9px!important;padding-bottom:9px!important;word-break:break-word!important}
.project-subpage-screen .sub-section.is-editing .wide-field input{height:40px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.project-subpage-screen .sub-field-title.required{display:block!important;margin-top:4px!important}
.project-subpage-screen .sub-section.is-readonly .sub-field-title.required::after{content:none!important}
/* project profile layout refinement */
.project-sub-summary{padding:12px 14px!important;gap:4px!important}
.project-summary-line{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;min-width:0!important}
.project-summary-line p{min-width:0!important;margin:0!important;color:#60757C!important;font-size:13px!important;line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.project-summary-line .profile-state-tag,.project-summary-line .questionnaire-state-tag{flex:none!important;margin-top:0!important;height:21px!important;padding:0 8px!important;display:inline-flex!important;align-items:center!important;line-height:21px!important;font-size:11px!important}
.guardian-grid{align-items:start!important}
.guardian-grid label{min-width:0!important}
.guardian-grid .emergency-phone{grid-column:auto!important}
.sub-link-list.compact button{min-height:50px!important;box-shadow:none!important;background:#FAFEFD!important}
@media(max-width:390px){.guardian-grid{grid-template-columns:1fr 1fr!important;gap:9px!important}.guardian-grid input{font-size:12px!important}.project-summary-line{gap:8px!important}.project-summary-line .profile-state-tag,.project-summary-line .questionnaire-state-tag{padding:0 7px!important}.guardian-grid .emergency-phone{grid-column:1/-1!important}}
/* project report tab hierarchy */
.specialty-report-card{padding:14px;border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);display:flex;flex-direction:column;gap:10px}.specialty-report-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.specialty-report-head strong{color:#20343A;font-size:16px;font-weight:800}.specialty-report-head span{padding:3px 8px;border-radius:999px;background:#E8F8F1;color:#18B884;font-size:12px;font-weight:800}.specialty-report-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.specialty-report-meta p{min-width:0;padding:8px;border-radius:8px;background:#F7FBFA}.specialty-report-meta em{display:block;color:#8A9CA1;font-size:11px;font-style:normal}.specialty-report-meta b{display:block;margin-top:4px;color:#20343A;font-size:12px;line-height:1.25}.specialty-report-meta .risk{color:#C76D12}.specialty-report-link{align-self:flex-end;border:0;background:transparent;color:#12A8AD;font-size:12px;font-weight:800;padding:0}.project-report-group-title{height:22px;display:flex;align-items:center;gap:7px;margin:2px 2px -2px;color:#20343A}.project-report-group-title i,.specialty-section-toggle i{width:3px;height:14px;border-radius:999px;background:#12A8AD}.project-report-group-title strong{font-size:14px;font-weight:800;line-height:1}.project-screen .archive-collapsible .archive-card.compact{min-height:56px!important;padding:10px 0!important;border-radius:0!important}.project-screen .archive-collapsible .archive-title strong{font-size:14px!important}.project-screen .archive-collapsible .archive-card.compact p{margin-top:4px!important}.project-screen .archive-collapsible .archive-card.compact small{font-size:12px!important;color:#60757C!important;font-weight:500!important}
.project-rehab-plan,.rehab-panel,.rehab-teacher-card{border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.project-rehab-plan{padding:14px;display:flex;flex-direction:column;gap:11px}.rehab-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.rehab-card-head strong{color:#20343A;font-size:16px;font-weight:800}.rehab-card-head span,.rehab-appointment-row span,.rehab-leave-list em{padding:3px 8px;border-radius:999px;background:#E8F8F1;color:#18B884;font-size:12px;font-weight:800;font-style:normal;white-space:nowrap}.rehab-card-head span{background:#E8F8F6;color:#12A8AD}.rehab-plan-main{padding:10px;border-radius:8px;background:#F6FBFA}.rehab-plan-main b{display:block;color:#20343A;font-size:15px}.rehab-plan-main p{margin:5px 0 0;color:#60757C;font-size:13px;line-height:1.5}.rehab-info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rehab-info-grid p,.rehab-teacher-card>p{margin:0;padding:9px 10px;border-radius:8px;background:#F7FBFA}.rehab-info-grid em,.rehab-teacher-card em{display:block;color:#8A9CA1;font-size:12px;font-style:normal}.rehab-info-grid b,.rehab-teacher-card b{display:block;margin-top:4px;color:#20343A;font-size:13px;line-height:1.4}.rehab-panel{padding:12px 14px}.rehab-appointment-row{min-height:58px;padding:10px 0;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:8px;border-top:1px solid rgba(216,238,234,.62)}.rehab-appointment-row:first-of-type{border-top:0}.rehab-appointment-row strong{color:#20343A;font-size:14px}.rehab-appointment-row p{margin:4px 0 0;color:#60757C;font-size:12px;line-height:1.4}.rehab-appointment-row span.pending,.rehab-leave-list em.pending{background:#FFF4E8;color:#F2994A}.rehab-appointment-row button,.rehab-panel-head button{border:0;background:transparent;color:#12A8AD;font-size:12px;font-weight:800;padding:0;white-space:nowrap}.rehab-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.rehab-leave-list{margin-top:6px}.rehab-leave-list p{min-height:42px;margin:0;padding:10px 0;display:grid;grid-template-columns:92px minmax(0,1fr) auto;align-items:center;gap:8px;border-top:1px solid rgba(216,238,234,.62)}.rehab-leave-list p:first-child{border-top:0}.rehab-leave-list span{color:#8A9CA1;font-size:12px}.rehab-leave-list b{color:#20343A;font-size:13px;line-height:1.35}.rehab-teacher-card{padding:14px;display:flex;flex-direction:column;gap:8px}.rehab-teacher-card>div{display:flex;align-items:center;justify-content:space-between}.rehab-teacher-card strong{color:#20343A;font-size:16px}.rehab-teacher-card div p{margin:0;color:#12A8AD;font-size:13px;font-weight:800}.specialty-archive-section{padding:14px!important}.project-subpage-screen .specialty-archive-section .archive-head{min-height:30px;margin:0;padding:0 0 8px;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:8px}.project-subpage-screen .specialty-archive-section .archive-head button{height:28px;padding:0 10px;border:1px solid rgba(216,238,234,.85);border-radius:999px;background:#F0FCFA;color:#12A8AD;font-size:12px;font-weight:700}.project-subpage-screen .specialty-archive-section .archive-card.compact{min-height:56px;padding:10px 0;border-radius:0;border-top:1px solid rgba(216,238,234,.62);box-shadow:none}.project-subpage-screen .specialty-archive-section .archive-title strong{font-size:14px}.project-subpage-screen .specialty-archive-section .archive-card.compact small{font-size:12px;color:#60757C;font-weight:500}@media(max-width:360px){.rehab-appointment-row{grid-template-columns:minmax(0,1fr) auto}.rehab-appointment-row button{grid-column:2}.rehab-leave-list p{grid-template-columns:1fr auto}.rehab-leave-list span{grid-column:1 / -1}}
.family-service-entry{width:100%;min-height:58px;padding:14px;border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055);display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;text-align:left}.family-service-entry strong{display:block;color:#20343A;font-size:15px;line-height:1.35}.family-service-entry em{color:#12A8AD;font-size:13px;font-style:normal;font-weight:800;white-space:nowrap}.family-sub-list,.interaction-flow,.interaction-input,.follow-survey-list,.survey-question-card,.today-training-card,.history-training-list{border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.family-sub-list{padding:4px 14px}.manual-row{padding:11px 0;border-top:1px solid rgba(216,238,234,.62);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.manual-row:first-child{border-top:0}.manual-row strong,.follow-survey-list strong{color:#20343A;font-size:14px}.manual-row p,.follow-survey-list p{margin:4px 0 0;color:#60757C;font-size:12px}.manual-row span,.follow-survey-list span,.history-training-list em{align-self:start;padding:3px 8px;border-radius:999px;background:#E8F8F1;color:#18B884;font-size:12px;font-weight:800;font-style:normal;white-space:nowrap}.manual-row span.pending,.follow-survey-list span,.history-training-list em.pending{background:#FFF4E8;color:#F2994A}.follow-survey-list span.done{background:#E8F8F1;color:#18B884}.manual-preview{grid-column:1 / -1;margin-top:2px;padding:10px;border-radius:8px;background:#F7FBFA}.manual-preview p{margin:0;color:#31565C;font-size:13px;line-height:1.6}.interaction-flow{padding:12px;display:flex;flex-direction:column;gap:9px}.interaction-flow article{max-width:92%;padding:10px;border-radius:8px;background:#fff;border:1px solid rgba(216,238,234,.72)}.interaction-flow article.doctor{align-self:flex-start;background:#EFFFFB;border-color:#D8EEEA}.interaction-flow article.parent{align-self:flex-end}.interaction-flow strong{color:#20343A;font-size:13px}.interaction-flow p{margin:5px 0;color:#31565C;font-size:13px;line-height:1.5}.interaction-flow small{color:#8A9CA1;font-size:11px}.interaction-flow .image-note{align-self:flex-end;border-style:dashed;color:#12A8AD;font-size:13px;font-weight:800}.interaction-input{padding:12px}.interaction-input textarea,.survey-question-card textarea,.today-training-card textarea{width:100%;min-height:66px;border:1px solid rgba(216,238,234,.9);border-radius:8px;background:#FAFEFD;padding:10px;color:#20343A;font:inherit;resize:none}.interaction-input div{margin-top:8px;display:flex;justify-content:flex-end;gap:8px}.interaction-input button,.survey-question-card>button{height:34px;padding:0 12px;border:0;border-radius:8px;background:#E8F8F6;color:#12A8AD;font-size:13px;font-weight:800}.interaction-input button:last-child,.survey-question-card>button{background:#12A8AD;color:#fff}.follow-survey-list{padding:4px 14px}.follow-survey-list article{padding:11px 0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;border-top:1px solid rgba(216,238,234,.62)}.follow-survey-list article:first-child{border-top:0}.survey-question-card,.today-training-card,.history-training-list{padding:14px}.survey-question-card h3,.today-training-card h3,.history-training-list h3{margin:0 0 10px;color:#20343A;font-size:15px}.survey-question-card article{padding:10px 0;border-top:1px solid rgba(216,238,234,.62)}.survey-question-card article:first-of-type{border-top:0}.survey-question-card h4{margin:0 0 8px;color:#20343A;font-size:14px;line-height:1.45}.survey-question-card>button{width:100%;margin-top:10px}.training-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px}.training-metrics p{margin:0;padding:9px;border-radius:8px;background:#F7FBFA}.training-metrics em{display:block;color:#8A9CA1;font-size:12px;font-style:normal}.training-metrics b{display:block;margin-top:4px;color:#20343A;font-size:13px}.today-training-card .sub-options{margin-bottom:10px}.today-training-card .upload-placeholder{width:100%;height:42px;margin:8px 0;border:1px dashed rgba(18,168,173,.45);border-radius:8px;background:#FAFEFD;color:#12A8AD;font-weight:800}.history-training-list p{margin:0;padding:10px 0;display:grid;grid-template-columns:76px minmax(0,1fr) auto;gap:8px;border-top:1px solid rgba(216,238,234,.62)}.history-training-list p:first-of-type{border-top:0}.history-training-list span{color:#20343A;font-size:13px;font-weight:800}.history-training-list b{color:#60757C;font-size:13px}.history-training-list small{grid-column:2 / -1;color:#8A9CA1;font-size:12px;line-height:1.45}@media(max-width:360px){.family-service-entry{grid-template-columns:1fr}.family-service-entry em{justify-self:start}.training-metrics{grid-template-columns:1fr}.history-training-list p{grid-template-columns:1fr auto}.history-training-list small{grid-column:1 / -1}}
.ai-test-screen .route-return-title{justify-content:center}.ai-student-card,.ai-test-entry,.ai-form-card,.ai-result-card,.ai-info-card,.nutrition-question-card{border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.ai-student-card{padding:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}.ai-student-card strong{color:#20343A;font-size:16px}.ai-student-card p{margin-top:5px;color:#60757C;font-size:13px}.ai-student-card span,.ai-result-head span{padding:3px 8px;border-radius:999px;background:#E8F8F1;color:#18B884;font-size:12px;font-weight:800;white-space:nowrap}.ai-test-entry{width:100%;min-height:58px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;border:0;text-align:left}.ai-test-entry strong{display:block;color:#20343A;font-size:15px}.ai-test-entry p{margin-top:5px;color:#60757C;font-size:13px;line-height:1.45}.ai-test-entry em{color:#12A8AD;font-size:13px;font-style:normal;font-weight:800;white-space:nowrap}.ai-test-note{padding:0 4px;color:#8A9CA1;font-size:12px;line-height:1.55}.ai-form-card,.ai-result-card,.nutrition-question-card{padding:14px}.ai-form-card{display:flex;flex-direction:column;gap:12px}.ai-form-card h3,.nutrition-question-card h3{margin:0;color:#20343A;font-size:15px}.ai-form-card label{display:flex;flex-direction:column;gap:7px;color:#60757C;font-size:13px}.ai-input-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.unit-input{display:grid;grid-template-columns:minmax(0,1fr) 42px;align-items:center;border:1px solid rgba(216,238,234,.9);border-radius:8px;background:#FAFEFD;overflow:hidden}.unit-input input{border:0!important;background:transparent!important;box-shadow:none!important}.unit-input b{color:#12A8AD;font-size:13px;text-align:center}.ai-result-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.ai-result-head strong{color:#20343A;font-size:16px}.ai-result-head span.warning{background:#FFF4E8;color:#F2994A}.ai-result-text{display:flex;flex-direction:column;gap:7px;color:#60757C;font-size:13px;line-height:1.6}.ai-result-text p{margin:0;color:#60757C;background:transparent;padding:0;border-radius:0}.ai-result-text b{display:inline;color:#20343A;font-size:13px;line-height:1.6}.ai-result-text h3{margin:5px 0 0;color:#20343A;font-size:14px;line-height:1.4}.ai-info-card{padding:13px 14px}.ai-info-card p{color:#60757C;font-size:13px;line-height:1.55}.nutrition-question-card article{padding:10px 0;border-top:1px solid rgba(216,238,234,.62)}.nutrition-question-card article:first-of-type{border-top:0}.nutrition-question-card h4{margin:0 0 8px;color:#20343A;font-size:14px;line-height:1.45}.nutrition-question-card .primary{margin-top:10px}@media(max-width:360px){.ai-test-entry{grid-template-columns:1fr}.ai-test-entry em{justify-self:start}.ai-input-grid{grid-template-columns:1fr}}
.specialty-summary-card,.specialty-detail-section{padding:14px;border:0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(28,91,92,.055)}.specialty-summary-card{display:grid;grid-template-columns:1fr 1fr;gap:8px}.specialty-summary-card>div{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:10px}.specialty-summary-card strong{color:#20343A;font-size:16px}.specialty-summary-card span,.specialty-tags span{padding:4px 8px;border-radius:999px;background:#FFF4E8;color:#C76D12;font-size:12px;font-weight:800}.specialty-summary-card p,.specialty-note-grid p{min-width:0;padding:8px;border-radius:8px;background:#F7FBFA}.specialty-summary-card em,.specialty-note-grid em,.specialty-plan-list em{display:block;color:#8A9CA1;font-size:11px;font-style:normal;line-height:1.35}.specialty-summary-card b,.specialty-note-grid b,.specialty-plan-list b{display:block;margin-top:4px;color:#20343A;font-size:13px;line-height:1.45}.specialty-detail-section{padding:0;overflow:hidden}.specialty-section-toggle{width:100%;min-height:42px;padding:0 14px;border:0;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px}.specialty-section-toggle span{display:flex;align-items:center;gap:7px;color:#20343A;font-size:15px;font-weight:800}.specialty-section-toggle em{font-style:normal;color:#12A8AD;font-size:12px;font-weight:800}.specialty-section-body{padding:0 14px 14px;border-top:1px solid rgba(216,238,234,.62)}.specialty-eye-table{margin-top:12px;border:1px solid rgba(216,238,234,.72);border-radius:8px;overflow:hidden}.specialty-eye-table .head,.specialty-eye-table p{display:grid;grid-template-columns:72px minmax(0,1fr) minmax(0,1fr);gap:0}.specialty-eye-table .head{background:#F0FCFA;color:#60757C;font-size:12px;font-weight:800}.specialty-eye-table span,.specialty-eye-table b{padding:8px 7px;border-top:1px solid rgba(216,238,234,.62);font-size:12px;line-height:1.35;text-align:left}.specialty-eye-table .head span{border-top:0}.specialty-eye-table b{color:#20343A;font-weight:700}.specialty-note-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.specialty-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.specialty-paragraph{margin-top:10px;color:#20343A;font-size:13px;line-height:1.65}.specialty-plan-list{display:flex;flex-direction:column;gap:10px;margin-top:12px}.specialty-plan-list p{padding:10px;border-radius:8px;background:#F7FBFA}.specialty-attachment-list{display:flex;flex-direction:column;margin-top:12px}.specialty-attachment-list button{height:42px;border:0;border-top:1px solid rgba(216,238,234,.62);background:#fff;display:flex;align-items:center;justify-content:space-between;color:#20343A;font-size:13px;font-weight:700}.specialty-attachment-list button:first-child{border-top:0}.specialty-attachment-list span{color:#12A8AD;font-size:12px;font-weight:800}
@media(max-width:390px){.specialty-report-meta{grid-template-columns:1fr 1fr}.specialty-summary-card,.specialty-note-grid{grid-template-columns:1fr}.specialty-eye-table .head,.specialty-eye-table p{grid-template-columns:62px minmax(0,1fr) minmax(0,1fr)}.specialty-eye-table span,.specialty-eye-table b{padding:7px 5px;font-size:11px}}
/* specialty report detail polish */
.project-subpage-screen:has(.specialty-summary-card) .project-sub-summary{display:none!important}.project-subpage-screen:has(.specialty-summary-card){gap:10px!important}.project-subpage-screen:has(.specialty-summary-card) .project-subpage-title{margin-bottom:2px!important}.specialty-summary-card{position:relative!important;padding:14px!important;border-radius:8px!important;background:#fff!important;border:0!important;box-shadow:0 8px 22px rgba(28,91,92,.055)!important}.specialty-summary-card>div span{background:#FFF4E8!important;color:#C76D12!important}.specialty-detail-section{border-radius:8px!important;background:#fff!important;border:0!important;box-shadow:0 8px 22px rgba(28,91,92,.055)!important}.specialty-section-toggle{border-radius:8px!important}.specialty-section-body{background:#fff!important}.specialty-eye-table{background:#fff!important}.specialty-eye-table p{margin:0!important}.specialty-note-grid p,.specialty-plan-list p{margin:0!important}.project-subpage-screen:has(.specialty-summary-card) .project-submit-tip{margin:0!important}.specialty-attachment-list button{padding:0!important}.specialty-report-card{border-radius:8px!important}.specialty-report-link{height:24px!important;line-height:24px!important}.specialty-report-meta p{margin:0!important}
/* project mini trend charts */
.project-trend-grid .trend-card{min-height:128px!important;padding:11px 10px!important;overflow:hidden!important}.trend-card-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}.trend-card-head strong{min-width:0!important;color:#20343A!important;font-size:14px!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.project-trend-grid .trend-card>b{display:block!important;margin-top:7px!important;color:#20343A!important;font-size:14px!important;line-height:1.25!important;white-space:nowrap!important}.trend-change{display:block!important;margin-top:4px!important;font-size:11px!important;line-height:1.2!important;font-weight:700!important}.trend-change.good{color:#12A8AD!important}.trend-change.stable{color:#60757C!important}.trend-change.warn{color:#C76D12!important}.mini-trend-chart{width:100%!important;height:56px!important;margin-top:7px!important;display:block!important;overflow:visible!important}.mini-trend-chart .grid-line{stroke:#EEF5F4!important;stroke-width:1!important}.mini-trend-chart polyline{fill:none!important;stroke:#12A8AD!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}.mini-trend-chart .trend-point{fill:#fff!important;stroke:#8EDFD9!important;stroke-width:1.6!important}.mini-trend-chart .trend-point.latest{fill:#12A8AD!important;stroke:#12A8AD!important;stroke-width:1.8!important}.mini-trend-chart text{fill:#8A9CA1!important;font-size:8px!important;text-anchor:middle!important;dominant-baseline:middle!important}
@media(max-width:390px){.project-trend-grid .trend-card{padding:10px 9px!important}.project-trend-grid .trend-card>b{font-size:13px!important}.mini-trend-chart text{font-size:7.5px!important}}
/* followup notice page refinement */
.project-subpage-screen:has(.followup-notice-time) .project-sub-summary{padding:12px 14px!important}.followup-notice-time{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:8px!important;padding:14px!important;border-radius:8px!important;background:#fff!important;box-shadow:0 8px 22px rgba(28,91,92,.055)!important}.followup-notice-time small{color:#8A9CA1!important;font-size:13px!important;font-weight:700!important;line-height:1.2!important}.followup-notice-time div{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}.followup-notice-time strong{min-width:0!important;color:#20343A!important;font-size:16px!important;font-weight:800!important;line-height:1.35!important}.followup-notice-time span{flex:none!important;padding:4px 9px!important;border-radius:999px!important;background:#FFF4E8!important;color:#F2994A!important;font-size:12px!important;font-weight:800!important;white-space:nowrap!important}.followup-info-list{padding:0 14px!important;border-radius:8px!important;overflow:hidden!important}.followup-info-list p{min-height:42px!important;margin:0!important;padding:11px 0!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:4px!important;border-top:1px solid rgba(216,238,234,.62)!important;line-height:1.45!important}.followup-info-list p:first-child{border-top:0!important}.followup-info-list em{flex:none!important;color:#8A9CA1!important;font-size:13px!important;font-style:normal!important;white-space:nowrap!important}.followup-info-list b{min-width:0!important;color:#20343A!important;font-size:14px!important;font-weight:700!important;text-align:left!important;overflow-wrap:anywhere!important}.followup-projects .sub-chip-list{display:flex!important;gap:8px!important;flex-wrap:wrap!important}.followup-projects .sub-chip-list span{border:0!important;border-radius:8px!important;background:#E8F8F6!important;color:#12A8AD!important;padding:6px 9px!important;font-size:12px!important;font-weight:800!important;box-shadow:none!important}.followup-notes .sub-note-list{margin-bottom:0!important}.followup-notes .ghost,.followup-notes button{display:none!important}
@media(max-width:360px){.followup-notice-time div{align-items:flex-start!important;flex-direction:column!important}.followup-info-list p{align-items:flex-start!important}}
</style>




