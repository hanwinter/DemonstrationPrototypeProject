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
let bannerTimer = null

const bannerImages = [
  '/images/banner/banner-1.png',
  '/images/banner/banner-2.png',
  '/images/banner/banner-3.png',
]

const loginForm = reactive({ phone: '13800001234', code: '' })
const bindForm = reactive({ name: '', code: '', school: '第一实验小学', className: '', phone: '13800001234' })
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

const students = reactive([
  { id: 1, name: '林一凡', gender: '男', age: 10, school: '北京市某某小学', className: '五年级2班', default: true },
  { id: 2, name: '林小雨', gender: '女', age: 7, school: '第一实验小学', className: '一年级 1 班', default: false },
])

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

const examPlan = reactive({ name: '2026 年春季五健筛查', school: '第一实验小学', date: '2026-04-12', place: '学校体育馆', deadline: '2026-04-10 18:00' })
const baseScreeningGroups = [{ type: '体格检查', items: '身高、体重、BMI、腰围、肺活量、足弓' }, { type: '视力筛查', items: '裸眼视力、矫正视力、屈光、色觉、眼位、眼压、眼轴长度、角膜曲率、视功能筛查、眼底照相' }, { type: '脊柱筛查', items: '脊柱侧弯、体态评估、肩背平衡、骨盆倾斜、下肢力线评估' }, { type: '口腔检查', items: '龋齿、牙列、牙龈、口腔卫生、咬合关系、窝沟情况' }, { type: '心理筛查', items: '心理行为问卷、情绪筛查、睡眠情况、注意力情况、学习适应情况' }]
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
}function getLatestReportId() {
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
}function getOverlayClass(item) {
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
function questionnaireStatusClass(status) { if (status === '已提交') return 'done'; if (status === '填写中') return 'progressing'; if (status === '已过期') return 'expired'; return 'todo' }
function questionnaireActionLabel(status) { if (status === '已提交') return '查看结果'; if (status === '填写中') return '继续填写'; return '立即填写' }
function editStudent(id) { editingStudentId.value = id; page.value = 'studentEdit' }
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
function go(target) {
  if (target === 'students') {
    studentsBackTarget.value = page.value === 'mine' || activeTab.value === 'mine' ? 'mine' : 'home'
  }
  if (target === 'rescreen') {
    rescreenBackTarget.value = page.value === 'reports' || activeTab.value === 'reports' ? 'reports' : 'home'
  }
  if (target === 'questionnaires' && page.value !== 'questionnaireForm') {
    questionnairesBackTarget.value = page.value === 'home' ? 'home' : 'questionnaires'
  }
  if (target === 'reports') {
    reportsBackTarget.value = page.value === 'home' ? 'home' : 'reports'
  }
  page.value = target
  if (['home', 'reports', 'questionnaires', 'mine'].includes(target)) activeTab.value = target
}
function backFromStudents() {
  go(studentsBackTarget.value)
}
function backFromRescreen() {
  go(rescreenBackTarget.value)
}
function backFromQuestionnaireForm() {
  go(questionnairesBackTarget.value)
}
function tabTo(target) {
  if (target === 'questionnaires') questionnairesBackTarget.value = 'questionnaires'
  if (target === 'reports') reportsBackTarget.value = 'reports'
  activeTab.value = target
  page.value = target
}
function switchStudent(id) {
  selectedStudentId.value = id
  students.forEach((item) => { item.default = item.id === id })
  currentReportId.value = getLatestReportId()
  resetReportView()
  showChildSheet.value = false
}
function confirmBind() {
  if (!bindForm.name) bindForm.name = '林子墨'
  students.push({ id: Date.now(), name: bindForm.name, gender: '男', age: 8, school: bindForm.school, className: bindForm.className || '二年级 3 班', default: false })
  showBindForm.value = false
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
        <button v-if="isLoggedIn && page !== 'home' && page !== 'reports'" class="plain" type="button" @click="go('messages')"><el-icon><Bell /></el-icon></button><span v-else class="top-placeholder"></span>
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
          <div class="section-head"><div><h3>健康知识</h3></div><button type="button" @click="selectedArticleId = articles[0].id; go('articleDetail')">更多</button></div>
          <div class="edu-tabs"><button class="active" type="button">全部</button><button v-for="item in topics" :key="item.title" type="button">{{ item.title }}</button></div>
          <div class="home-article-list">
            <button v-for="item in articles.slice(0, 3)" :key="item.id" class="home-article" type="button" @click="selectedArticleId = item.id; go('articleDetail')">
              <b class="article-thumb"><img :src="item.cover" :alt="item.title" /></b>
              <span><strong>{{ item.title }}</strong><small>{{ item.tag }} · {{ item.views }} 阅读 · {{ item.read ? '已读' : '未读' }}</small><em v-if="item.recommend">根据报告推荐</em></span>
            </button>
          </div>
        </section>

        <section v-else-if="page === 'reports'" class="screen report-screen">
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

        <section v-else-if="page === 'students'" class="screen students-screen"><div class="page-title"><button type="button" @click="backFromStudents"><el-icon><ArrowLeft /></el-icon></button><h2>就诊人管理</h2></div><article v-for="item in students" :key="item.id" class="student-card student-manage-card"><div><strong>{{ item.name }}</strong><span>{{ item.gender }} · {{ item.age }} 岁</span><p>{{ item.school }}｜{{ item.className }}</p></div><div class="student-actions"><button type="button" :class="{ active: item.default }" @click="switchStudent(item.id)">{{ item.default ? '默认学生' : '设为默认' }}</button><button type="button" @click="editStudent(item.id)">编辑</button></div></article><button class="primary full" type="button" @click="showBindForm = true">添加学生</button><article v-if="showBindForm" class="form-card"><input v-model="bindForm.name" placeholder="学生姓名" /><input v-model="bindForm.code" placeholder="身份证号 / 学号" /><input v-model="bindForm.school" placeholder="所属学校" /><input v-model="bindForm.className" placeholder="所属班级" /><input v-model="bindForm.phone" placeholder="家长手机号" /><input placeholder="绑定码" /><button class="primary full" type="button" @click="confirmBind">确认绑定</button></article></section>

        <section v-else-if="page === 'studentEdit'" class="screen student-edit-screen"><div class="page-title"><button type="button" @click="go('students')"><el-icon><ArrowLeft /></el-icon></button><h2>编辑就诊人</h2></div><article class="form-card profile-form-card"><label>学生姓名<input v-model="editingStudent.name" /></label><label>学校<input v-model="editingStudent.school" /></label><label>班级<input v-model="editingStudent.className" /></label><label>年龄<input v-model="editingStudent.age" /></label><button class="primary full" type="button" @click="go('students')">保存</button></article></section>

        <section v-else-if="page === 'signup'" class="screen signup-screen"><div class="page-title"><button type="button" @click="go('home')"><el-icon><ArrowLeft /></el-icon></button><h2>体检报名</h2></div><article class="signup-plan-card"><div class="signup-card-head"><span class="pill normal">{{ planStatusLabel }}</span><strong>{{ examPlan.name }}</strong></div><div class="signup-info-grid"><span>学校：{{ examPlan.school }}</span><span>时间：{{ examPlan.date }}</span><span>地点：{{ examPlan.place }}</span><span>截止：{{ examPlan.deadline }}</span></div></article><article class="signup-section base-project-card"><div class="signup-section-title"><strong>基础筛查项目</strong></div><p>以下项目由学校统一安排，免费参加。</p><div class="base-project-list"><div v-for="group in baseScreeningGroups" :key="group.type" class="base-project-row"><strong>{{ group.type }}</strong><span>{{ group.items }}</span></div></div></article><article class="signup-section student-confirm-card"><div class="signup-section-title"><strong>学生信息确认</strong></div><label>学生姓名<input :value="currentStudent.name" readonly /></label><label>学校班级<input :value="currentStudent.school + ' ' + currentStudent.className" readonly /></label><label>联系电话<input value="13800001234" /></label><label>备注<textarea placeholder="可填写既往病史、特殊情况等"></textarea></label></article><article class="signup-section paid-project-section"><div class="signup-section-title"><strong>自费项目</strong><button type="button" @click="paidProjectsExpanded = !paidProjectsExpanded">{{ paidProjectsExpanded ? '收起' : '展开' }}</button></div><p>自费项目关联本次体检计划，支付成功后随本次体检一同安排。</p><p v-if="paidProjectsExpanded" class="paid-deadline">可在 {{ examPlan.deadline }} 前选择或调整，超过后不支持新增或重选。</p><p v-else class="paid-collapsed-summary">{{ selectedPaidProjects.length ? '已选 ' + selectedPaidProjects.length + ' 项，合计 ￥' + paidTotal : '暂未选择自费项目' }}</p><template v-if="paidProjectsExpanded"><div class="paid-category-tabs"><button v-for="tab in paidCategoryTabs" :key="tab.key" type="button" :class="{ active: activePaidCategory === tab.key }" @click="activePaidCategory = tab.key">{{ tab.label }}</button></div><div class="paid-group-list"><section v-for="group in visiblePaidProjectGroups" :key="group.key" class="paid-group"><div class="paid-group-title"><strong>{{ group.name }}</strong><span>{{ group.projects.length }}项</span></div><button v-for="project in group.projects" :key="project.id" type="button" :class="['paid-project-row', { selected: selectedPaidProjectIds.includes(project.id), disabled: !canEditPaidProjects }]" @click="togglePaidProject(project.id)"><i>{{ selectedPaidProjectIds.includes(project.id) ? '✓' : '○' }}</i><span>{{ project.name }}</span><b>￥{{ project.price }}</b></button></section></div></template></article><article v-if="selectedPaidProjects.length || paidOrderStatus !== 'none'" class="signup-section order-summary-card"><div class="signup-section-title"><strong>自费订单</strong><span>{{ orderStatusLabel }}</span></div><p>关联体检计划：{{ examPlan.name }}</p><p>预计检查时间：{{ examPlan.date }}</p><div class="order-items"><span v-for="item in selectedPaidProjects" :key="item.id">{{ item.name }} ￥{{ item.price }}</span></div><strong>合计：￥{{ paidTotal }}</strong></article><div class="signup-bottom-bar"><div><span>已选 {{ selectedPaidProjects.length }} 项</span><strong>￥{{ paidTotal }}</strong></div><button v-if="!baseSignupDone" class="primary" type="button" @click="confirmBaseSignup">确认基础报名</button><button v-else-if="selectedPaidProjects.length && paidOrderStatus !== 'paid' && paidOrderStatus !== 'refunding'" class="primary" type="button" @click="openPayConfirm">提交自费订单并支付</button><button v-else-if="paidOrderStatus === 'paid'" class="ghost" type="button" @click="requestRefund">申请整单退款</button><button v-else-if="paidOrderStatus === 'refunding'" class="primary" type="button" @click="finishRefund">模拟退款成功</button><button v-else class="ghost" type="button" @click="scrollToPaidProjects">选择自费项目</button></div></section>

        <section v-else-if="page === 'questionnaires'" class="screen questionnaires-screen"><h2>问卷量表</h2><article v-for="item in questionnaires" :key="item.name" class="list-card questionnaire-card"><div class="questionnaire-card-main"><strong>{{ item.name }}</strong><p>截止日期：{{ item.due }}</p></div><div class="questionnaire-card-actions"><span :class="['questionnaire-status', questionnaireStatusClass(item.status)]">{{ item.status }}</span><button type="button" @click="go('questionnaireForm')">{{ questionnaireActionLabel(item.status) }}</button></div></article></section>

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

        <section v-else-if="page === 'mine'" class="screen mine-screen"><article class="mine-card mine-profile-card"><strong>{{ parentProfile.name }}</strong><p>手机号：{{ parentProfile.phone }}</p><p>当前就诊人：{{ currentStudent.name }}｜{{ currentStudent.className }}</p></article><button class="mine-row" type="button" @click="go('profile')">个人信息管理</button><button class="mine-row" type="button" @click="go('students')">就诊人管理</button><button class="mine-row" type="button" @click="go('messages')">消息通知</button><button class="logout" type="button" @click="logout">退出登录</button></section>
      </div>


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
      </section>      <section v-if="showChildSheet" class="child-sheet-mask" @click.self="showChildSheet = false">
        <article class="child-sheet">
          <header><strong>选择就诊人</strong><button type="button" @click="showChildSheet = false">×</button></header>
          <button v-for="item in students" :key="item.id" type="button" class="child-option" @click="switchStudent(item.id)"><span><b>{{ item.name }}｜{{ item.className }}</b><small>{{ item.id === selectedStudentId ? '当前' : '点击切换' }}</small></span><em v-if="item.id === selectedStudentId">当前</em></button>
          <button class="add-child" type="button" @click="showChildSheet = false; go('students')">+ 添加就诊人</button>
        </article>
      </section>
      <nav v-if="isLoggedIn" class="bottom-tabs">
        <button v-for="item in [
          { k: 'home', t: '首页', i: House },
          { k: 'questionnaires', t: '问卷', i: Notebook },
          { k: 'reports', t: '报告', i: Document },
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

</style>