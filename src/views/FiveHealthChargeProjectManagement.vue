<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import '../components/fivehealth/health-archive-theme.css'

const router = useRouter()
const activeMenu = ref('charge')
const activeTab = ref('items')
const drawerVisible = ref(false)
const editingId = ref(null)
const mergeDetailVisible = ref(false)
const orderDetailVisible = ref(false)
const paymentDetailVisible = ref(false)
const currentOrderDetail = ref(null)
const currentPaymentDetail = ref(null)

const menus = [
  { key: 'charge', label: '收费项目管理' },
  { key: 'orders', label: '自费订单管理' },
  { key: 'payments', label: '支付管理' },
  { key: 'merge', label: '体检项目合并管理' },
]
const categories = ['生长发育', '检验检查', '影像检查', '口腔检查', '脊柱骨骼', '心理行为']
const query = reactive({ name: '', category: '全部', step: '全部', status: '全部' })
const orderQuery = reactive({ orderNo: '', studentName: '', school: '全部学校', batch: '2026年春季实验小学五健入校筛查', orderStatus: '全部', payStatus: '全部' })
const mergeQuery = reactive({ studentName: '', school: '全部学校', batch: '2026年春季实验小学五健入校筛查', mergeStatus: '全部', payStatus: '全部' })
const paymentQuery = reactive({ flowNo: '', orderNo: '', payStatus: '全部', refundStatus: '全部' })
const form = reactive({ name: '', category: '生长发育', description: '', price: 0, department: '', step: '体格测量', sampleType: '/', status: '启用' })
const baseChargeConfig = reactive({ mode: 'free', noInsuranceFee: 20 })
const parentSignupConfig = reactive({ enabled: true, startAt: '2026-04-01 08:00', endAt: '2026-04-10 18:00', link: 'https://demo.example.com/exam/register?planId=20260418' })
const signupQrVisible = ref(false)
const baseProjectPickerVisible = ref(false)
const chargeProjectPickerVisible = ref(false)
const baseProjectQuery = reactive({ name: '', category: '全部' })
const chargeProjectQuery = reactive({ name: '', category: '全部' })
const selectedBaseProjects = ref([])
const selectedChargeProjects = ref([])

const projects = ref([
  { id: 1, name: '身高测量', category: '生长发育', price: 5, department: '体检科', step: '体格测量', sampleType: '/', status: '启用', updatedAt: '2026-04-01 09:20', description: '用于记录身高发育情况。' },
  { id: 2, name: '体重测量', category: '生长发育', price: 5, department: '体检科', step: '体格测量', sampleType: '/', status: '启用', updatedAt: '2026-04-01 09:25', description: '用于记录体重发育情况。' },
  { id: 3, name: '血常规', category: '检验检查', price: 20, department: '检验科', step: '采血', sampleType: '静脉血', status: '启用', updatedAt: '2026-04-01 10:10', description: '用于基础血液指标筛查。' },
  { id: 4, name: '血脂检查', category: '检验检查', price: 30, department: '检验科', step: '采血', sampleType: '静脉血', status: '启用', updatedAt: '2026-04-02 09:30', description: '用于血脂水平筛查。' },
  { id: 5, name: '维生素D检测', category: '检验检查', price: 60, department: '检验科', step: '采血', sampleType: '静脉血', status: '启用', updatedAt: '2026-04-02 10:45', description: '用于营养相关风险评估。' },
  { id: 6, name: '骨龄检测', category: '影像检查', price: 80, department: '放射科', step: '影像检查', sampleType: '/', status: '启用', updatedAt: '2026-04-02 11:20', description: '用于辅助评估生长发育阶段。' },
  { id: 7, name: '口腔检查', category: '口腔检查', price: 10, department: '口腔科', step: '口腔检查', sampleType: '/', status: '启用', updatedAt: '2026-04-03 08:40', description: '用于口腔健康基础检查。' },
])
const batchRows = ref([
  { name: '身高测量', category: '生长发育', step: '体格测量', standardPrice: '¥5', batchPrice: '¥0', payer: '免费', visible: '展示', status: '启用' },
  { name: '体重测量', category: '生长发育', step: '体格测量', standardPrice: '¥5', batchPrice: '¥0', payer: '免费', visible: '展示', status: '启用' },
  { name: '血常规', category: '检验检查', step: '采血', standardPrice: '¥20', batchPrice: '¥10', payer: '学校统一结算', visible: '展示', status: '启用' },
  { name: '口腔检查', category: '口腔检查', step: '口腔检查', standardPrice: '¥10', batchPrice: '¥0', payer: '免费', visible: '展示', status: '启用' },
])
const addonRows = ref([
  { name: '血脂检查', category: '检验检查', step: '采血', standardPrice: '¥30', addonPrice: '¥30', visible: '展示', sort: 1, status: '启用' },
  { name: '维生素D检测', category: '检验检查', step: '采血', standardPrice: '¥60', addonPrice: '¥55', visible: '展示', sort: 2, status: '启用' },
  { name: '骨龄检测', category: '影像检查', step: '影像检查', standardPrice: '¥80', addonPrice: '¥80', visible: '展示', sort: 3, status: '启用' },
])
const baseProjectCandidates = [
  { name: '裸眼视力', category: '视力检查', step: '视力检查', resultType: '数值', status: '启用' },
  { name: '屈光检查', category: '视力检查', step: '视力检查', resultType: '数值', status: '启用' },
  { name: '身高测量', category: '生长发育', step: '体格测量', resultType: '数值', status: '启用' },
  { name: '体重测量', category: '生长发育', step: '体格测量', resultType: '数值', status: '启用' },
  { name: 'BMI', category: '生长发育', step: '体格测量', resultType: '数值', status: '启用' },
  { name: '血常规', category: '检验检查', step: '采血', resultType: 'LIS结果', status: '启用' },
  { name: '血糖', category: '检验检查', step: '采血', resultType: 'LIS结果', status: '启用' },
  { name: '口腔检查', category: '口腔检查', step: '口腔检查', resultType: '选项', status: '启用' },
  { name: '脊柱检查', category: '骨骼检查', step: '脊柱检查', resultType: '选项', status: '启用' },
  { name: '心理健康筛查', category: '心理检查', step: '问卷量表', resultType: '量表', status: '启用' },
]
const chargeProjectCandidates = [
  { name: '血脂检查', category: '检验检查', includedItems: '血脂四项', standardPrice: '¥30', step: '采血', status: '启用' },
  { name: '维生素D检测', category: '检验检查', includedItems: '25-羟维生素D', standardPrice: '¥60', step: '采血', status: '启用' },
  { name: '骨龄检测', category: '影像检查', includedItems: '骨龄检查', standardPrice: '¥80', step: '影像检查', status: '启用' },
  { name: '肝功能检查', category: '检验检查', includedItems: '肝功能', standardPrice: '¥35', step: '采血', status: '启用' },
  { name: '肾功能检查', category: '检验检查', includedItems: '肾功能', standardPrice: '¥30', step: '采血', status: '启用' },
  { name: '儿童代谢筛查套餐', category: '检验检查', includedItems: '血糖、血脂四项、肝功能、尿酸', standardPrice: '¥99', step: '采血', status: '启用' },
]
const orderRows = ref([
  { orderNo: 'ZF202604180001', studentName: '林一凡', school: '实验小学', className: '三年级2班', batch: '2026年春季实验小学五健入校筛查', items: '血脂检查、维生素D检测', amount: '¥85', payStatus: '已支付', payTime: '2026-04-12 09:22', orderStatus: '正常', createdAt: '2026-04-12 09:20' },
  { orderNo: 'ZF202604180002', studentName: '王子涵', school: '实验小学', className: '三年级1班', batch: '2026年春季实验小学五健入校筛查', items: '骨龄检测', amount: '¥80', payStatus: '待支付', payTime: '/', orderStatus: '待支付', createdAt: '2026-04-12 10:12' },
  { orderNo: 'ZF202604180003', studentName: '赵明轩', school: '实验小学', className: '四年级3班', batch: '2026年春季实验小学五健入校筛查', items: '血脂检查', amount: '¥30', payStatus: '已退款', payTime: '2026-04-13 15:32', orderStatus: '已关闭', createdAt: '2026-04-13 15:30' },
  { orderNo: 'ZF202604180004', studentName: '陈雨桐', school: '实验小学', className: '三年级4班', batch: '2026年春季实验小学五健入校筛查', items: '基础检查费（无医保）、骨龄检测', amount: '¥100', payStatus: '已支付', payTime: '2026-04-14 10:18', orderStatus: '正常', createdAt: '2026-04-14 10:15' },
])
const paymentRows = [
  { flowNo: 'PAY202604180001', orderNo: 'ZF202604180001', studentName: '林一凡', amount: '¥85', method: '微信支付', payTime: '2026-04-12 09:22', payStatus: '成功', refundStatus: '未退款' },
  { flowNo: 'PAY202604180002', orderNo: 'ZF202604180002', studentName: '王子涵', amount: '¥80', method: '微信支付', payTime: '/', payStatus: '处理中', refundStatus: '未退款' },
  { flowNo: 'PAY202604180003', orderNo: 'ZF202604180003', studentName: '赵明轩', amount: '¥30', method: '微信支付', payTime: '2026-04-13 15:32', payStatus: '成功', refundStatus: '已退款' },
  { flowNo: 'PAY202604180004', orderNo: 'ZF202604180004', studentName: '陈雨桐', amount: '¥100', method: '微信支付', payTime: '2026-04-14 10:18', payStatus: '成功', refundStatus: '未退款' },
]
const studentProfiles = {
  林一凡: { parentName: '林女士', phone: '13800010001' },
  王子涵: { parentName: '王女士', phone: '13800010002' },
  赵明轩: { parentName: '赵先生', phone: '13800010003' },
  陈雨桐: { parentName: '陈女士', phone: '13800010004' },
}
const addonProjectMap = {
  '基础检查费（无医保）': { category: '基础检查', price: '¥20' },
  血脂检查: { category: '检验检查', price: '¥30' },
  维生素D检测: { category: '检验检查', price: '¥55' },
  骨龄检测: { category: '影像检查', price: '¥80' },
}
const paymentExtraMap = {
  PAY202604180001: { thirdNo: 'WX202604120922310001', arrivedAt: '2026-04-12 09:23', refundAmount: '¥0', refundTime: '/', refundReason: '/', channelStatus: '已到账', reconcileStatus: '已对账' },
  PAY202604180002: { thirdNo: 'WX202604121012550002', arrivedAt: '/', refundAmount: '¥0', refundTime: '/', refundReason: '/', channelStatus: '支付确认中', reconcileStatus: '待对账' },
  PAY202604180003: { thirdNo: 'WX202604131532480003', arrivedAt: '2026-04-13 15:33', refundAmount: '¥30', refundTime: '2026-04-13 16:10', refundReason: '家长取消自费加项', channelStatus: '退款成功', reconcileStatus: '已对账' },
  PAY202604180004: { thirdNo: 'WX202604141018220004', arrivedAt: '2026-04-14 10:19', refundAmount: '¥0', refundTime: '/', refundReason: '/', channelStatus: '已到账', reconcileStatus: '已对账' },
}
const mergeRows = ref([
  { studentName: '林一凡', gender: '男', age: '9岁', school: '实验小学', className: '三年级2班', batch: '2026年春季实验小学五健入校筛查', batchCount: 4, addonCount: 2, finalCount: 6, mergeStatus: '已生成', payStatus: '已支付', mergeTime: '2026-04-12 09:30', batchItems: '身高测量、体重测量、血常规、口腔检查', addonItems: '血脂检查、维生素D检测' },
  { studentName: '王子涵', gender: '女', age: '8岁', school: '实验小学', className: '三年级1班', batch: '2026年春季实验小学五健入校筛查', batchCount: 4, addonCount: 0, finalCount: 4, mergeStatus: '待生成', payStatus: '待支付', mergeTime: '/', batchItems: '身高测量、体重测量、血常规、口腔检查', addonItems: '' },
  { studentName: '赵明轩', gender: '男', age: '10岁', school: '实验小学', className: '四年级3班', batch: '2026年春季实验小学五健入校筛查', batchCount: 4, addonCount: 1, finalCount: 5, mergeStatus: '已更新', payStatus: '已退款', mergeTime: '2026-04-13 16:00', batchItems: '身高测量、体重测量、血常规、口腔检查', addonItems: '血脂检查' },
])
const currentMergeDetail = ref(mergeRows.value[0])
const stats = [{ label: '今日加项支付金额', value: '¥12,580' }, { label: '今日加项订单数', value: '256' }, { label: '待退款订单', value: '3' }, { label: '已退款金额', value: '¥560' }]
const detailFreeItems = ['身高测量', '体重测量', '血常规', '口腔检查']
const detailPaidItems = ['血脂检查', '维生素D检测']
const finalItems = [...detailFreeItems, ...detailPaidItems]
const pageTitle = computed(() => ({ charge: '收费项目管理', orders: '自费订单管理', payments: '支付管理', merge: '体检项目合并管理' }[activeMenu.value]))
const filteredProjects = computed(() => projects.value.filter((item) => (!query.name || item.name.includes(query.name.trim())) && (query.category === '全部' || item.category === query.category) && (query.step === '全部' || item.step === query.step) && (query.status === '全部' || item.status === query.status)))
const filteredOrders = computed(() => orderRows.value.filter((item) => (!orderQuery.orderNo || item.orderNo.includes(orderQuery.orderNo.trim())) && (!orderQuery.studentName || item.studentName.includes(orderQuery.studentName.trim())) && (orderQuery.school === '全部学校' || item.school === orderQuery.school) && item.batch === orderQuery.batch && (orderQuery.payStatus === '全部' || item.payStatus === orderQuery.payStatus)))
const filteredPaymentRows = computed(() => paymentRows.filter((item) => (!paymentQuery.flowNo || item.flowNo.includes(paymentQuery.flowNo.trim())) && (!paymentQuery.orderNo || item.orderNo.includes(paymentQuery.orderNo.trim())) && (paymentQuery.payStatus === '全部' || item.payStatus === paymentQuery.payStatus) && (paymentQuery.refundStatus === '全部' || item.refundStatus === paymentQuery.refundStatus)))
const filteredMergeRows = computed(() => mergeRows.value.filter((item) => (!mergeQuery.studentName || item.studentName.includes(mergeQuery.studentName.trim())) && (mergeQuery.school === '全部学校' || item.school === mergeQuery.school) && item.batch === mergeQuery.batch && (mergeQuery.mergeStatus === '全部' || item.mergeStatus === mergeQuery.mergeStatus || (mergeQuery.mergeStatus === '已生成' && item.mergeStatus === '已生成'))))
const baseProjectCategories = computed(() => ['全部', ...new Set(baseProjectCandidates.map((item) => item.category))])
const chargeProjectCategories = computed(() => ['全部', ...new Set(chargeProjectCandidates.map((item) => item.category))])
const filteredBaseProjectCandidates = computed(() => baseProjectCandidates.filter((item) => (!baseProjectQuery.name || item.name.includes(baseProjectQuery.name.trim())) && (baseProjectQuery.category === '全部' || item.category === baseProjectQuery.category)))
const filteredChargeProjectCandidates = computed(() => chargeProjectCandidates.filter((item) => (!chargeProjectQuery.name || item.name.includes(chargeProjectQuery.name.trim())) && (chargeProjectQuery.category === '全部' || item.category === chargeProjectQuery.category)))

function switchMenu(key) { activeMenu.value = key; drawerVisible.value = false; mergeDetailVisible.value = false; orderDetailVisible.value = false; paymentDetailVisible.value = false; baseProjectPickerVisible.value = false; chargeProjectPickerVisible.value = false }
function resetForm(item) { form.name = item?.name || ''; form.category = item?.category || '生长发育'; form.description = item?.description || ''; form.price = item?.price || 0; form.department = item?.department || ''; form.step = item?.step || '体格测量'; form.sampleType = item?.sampleType || '/'; form.status = item?.status || '启用' }
function openCreate() { editingId.value = null; resetForm(); drawerVisible.value = true }
function editProject(row) { editingId.value = row.id; resetForm(row); drawerVisible.value = true }
function cancelForm() { drawerVisible.value = false }
function saveProject() {
  if (!form.name.trim()) { ElMessage.warning('请输入项目名称'); return }
  const payload = { name: form.name.trim(), category: form.category, price: Number(form.price || 0), department: form.department.trim(), step: form.step, sampleType: form.sampleType || '/', status: form.status, updatedAt: '2026-07-29 15:30', description: form.description.trim() }
  if (editingId.value) { Object.assign(projects.value.find((item) => item.id === editingId.value), payload); ElMessage.success('收费项目已更新') } else { projects.value.unshift({ id: Date.now(), ...payload }); ElMessage.success('收费项目已新增') }
  drawerVisible.value = false
}
function toggleStatus(row) { row.status = row.status === '启用' ? '停用' : '启用'; row.updatedAt = '2026-07-28 15:30'; ElMessage.success(`已${row.status}`) }
function showList() { activeTab.value = 'items'; drawerVisible.value = false; baseProjectPickerVisible.value = false; chargeProjectPickerVisible.value = false }
function statusType(status) { return ['启用', '已支付', '成功', '正常', '已生成', '已更新', '已生成体检执行订单'].includes(status) ? 'success' : status.includes('待') || status.includes('处理中') ? 'warning' : status.includes('失败') ? 'danger' : 'info' }
function resetProjectQuery() { query.name = ''; query.category = '全部'; query.step = '全部'; query.status = '全部' }
function resetOrderQuery() { orderQuery.orderNo = ''; orderQuery.studentName = ''; orderQuery.school = '全部学校'; orderQuery.batch = '2026年春季实验小学五健入校筛查'; orderQuery.orderStatus = '全部'; orderQuery.payStatus = '全部' }
function resetPaymentQuery() { paymentQuery.flowNo = ''; paymentQuery.orderNo = ''; paymentQuery.payStatus = '全部'; paymentQuery.refundStatus = '全部' }
function resetMergeQuery() { mergeQuery.studentName = ''; mergeQuery.school = '全部学校'; mergeQuery.batch = '2026年春季实验小学五健入校筛查'; mergeQuery.mergeStatus = '全部'; mergeQuery.payStatus = '全部' }
function showBatchConfig() { activeTab.value = 'batch' }
function openBaseProjectPicker() { baseProjectPickerVisible.value = true; selectedBaseProjects.value = [] }
function openChargeProjectPicker() { chargeProjectPickerVisible.value = true; selectedChargeProjects.value = [] }
function isBaseProjectAdded(row) { return batchRows.value.some((item) => item.name === row.name) }
function isChargeProjectAdded(row) { return addonRows.value.some((item) => item.name === row.name) }
function canSelectBaseProject(row) { return !isBaseProjectAdded(row) }
function canSelectChargeProject(row) { return !isChargeProjectAdded(row) }
function handleBaseSelectionChange(rows) { selectedBaseProjects.value = rows }
function handleChargeSelectionChange(rows) { selectedChargeProjects.value = rows }
function confirmAddBaseProjects() {
  const rows = selectedBaseProjects.value.filter((item) => !isBaseProjectAdded(item))
  if (!rows.length) { ElMessage.warning('请选择可添加的基础体检项目'); return }
  rows.forEach((item) => batchRows.value.push({ name: item.name, category: item.category, step: item.step, visible: '展示', status: '启用' }))
  baseProjectPickerVisible.value = false
  ElMessage.success('基础体检项目已添加')
}
function confirmAddChargeProjects() {
  const rows = selectedChargeProjects.value.filter((item) => !isChargeProjectAdded(item))
  if (!rows.length) { ElMessage.warning('请选择可添加的收费项目'); return }
  const maxSort = addonRows.value.reduce((max, item) => Math.max(max, Number(item.sort || 0)), 0)
  rows.forEach((item, index) => addonRows.value.push({ name: item.name, category: item.category, step: item.step, standardPrice: item.standardPrice, addonPrice: item.standardPrice, visible: '展示', sort: maxSort + index + 1, status: '启用' }))
  chargeProjectPickerVisible.value = false
  ElMessage.success('推荐自费项目已添加')
}
function normalizeSignupTime(changedField) {
  if (!parentSignupConfig.startAt || !parentSignupConfig.endAt || parentSignupConfig.startAt <= parentSignupConfig.endAt) return
  if (changedField === 'start') parentSignupConfig.endAt = parentSignupConfig.startAt
  else parentSignupConfig.startAt = parentSignupConfig.endAt
  ElMessage.warning('报名开始时间不能晚于报名截止时间')
}
async function copySignupLink() {
  if (!parentSignupConfig.enabled) return
  try { await navigator.clipboard?.writeText(parentSignupConfig.link) } catch (error) { /* Mock page: toast is enough for the demo. */ }
  ElMessage.success('报名链接已复制')
}
function openSignupQr() {
  if (!parentSignupConfig.enabled) return
  signupQrVisible.value = true
}
function downloadSignupQr() { ElMessage.success('二维码已下载') }
function splitItems(text) { return text ? text.split('、').filter(Boolean) : [] }
function orderItemDetails(row) {
  return splitItems(row.items).map((name) => {
    const item = addonProjectMap[name] || { category: '自费项目', price: row.amount }
    return { name, category: item.category, unitPrice: item.price, quantity: 1, subtotal: item.price }
  })
}
function operationTimeline(row, payment) {
  const timeline = [{ action: '创建自费订单', operator: '家长端', time: row.createdAt, result: '订单已生成' }]
  if (payment?.payStatus === '成功') timeline.push({ action: '支付成功', operator: payment.method, time: payment.payTime, result: `实付 ${payment.amount}` })
  else timeline.push({ action: '等待支付确认', operator: payment?.method || '微信支付', time: row.createdAt, result: '支付处理中' })
  if (payment?.refundStatus === '已退款') timeline.push({ action: '退款完成', operator: '收费管理员', time: paymentExtraMap[payment.flowNo]?.refundTime || '/', result: paymentExtraMap[payment.flowNo]?.refundReason || '整单退款' })
  return timeline
}
function paymentStatusClass(status) {
  return {
    成功: 'paid',
    处理中: 'pending',
    失败: 'failed',
  }[status] || 'neutral'
}
function refundStatusClass(status) {
  return {
    未退款: 'neutral',
    退款中: 'refunding',
    已退款: 'refunded',
  }[status] || 'neutral'
}
function paymentTimeline(row, order) {
  const timeline = [{ action: '创建支付流水', time: order?.createdAt || row.payTime, result: `关联订单 ${row.orderNo}` }]
  if (row.payStatus === '成功') timeline.push({ action: '支付成功', time: row.payTime, result: `实付 ${row.amount}` })
  else if (row.payStatus === '处理中') timeline.push({ action: '等待支付确认', time: order?.createdAt || '/', result: '支付处理中' })
  else timeline.push({ action: '支付失败', time: row.payTime || '/', result: '支付未完成' })
  if (row.refundStatus === '已退款') timeline.push({ action: '退款完成', time: paymentExtraMap[row.flowNo]?.refundTime || '/', result: paymentExtraMap[row.flowNo]?.refundReason || '整单退款' })
  return timeline
}
function buildOrderDetail(row) {
  const payment = paymentRows.find((item) => item.orderNo === row.orderNo)
  const profile = studentProfiles[row.studentName] || { parentName: '/', phone: '/' }
  return { ...row, ...profile, payment, itemDetails: orderItemDetails(row), operations: operationTimeline(row, payment) }
}
function buildPaymentDetail(row) {
  const order = orderRows.value.find((item) => item.orderNo === row.orderNo)
  const profile = studentProfiles[row.studentName] || { parentName: '/', phone: '/' }
  const extra = paymentExtraMap[row.flowNo] || {}
  return { ...row, ...profile, order, extra, itemDetails: order ? orderItemDetails(order) : [], operations: paymentTimeline(row, order) }
}
function orderFeeStatusClass(status) {
  return {
    待支付: 'pending',
    已支付: 'paid',
    退款中: 'refunding',
    已退款: 'refunded',
    部分退款: 'partial-refund',
    已关闭: 'closed',
    支付失败: 'failed',
  }[status] || 'neutral'
}
function orderPaidAmountText(row) {
  if (!row) return '/'
  if (['已支付', '退款中', '已退款', '部分退款'].includes(row.payStatus)) return row.payment?.amount || row.amount
  return '/'
}
function openOrderDetail(row) { currentOrderDetail.value = buildOrderDetail(row); orderDetailVisible.value = true }
function openPaymentDetail(row) { currentPaymentDetail.value = buildPaymentDetail(row); paymentDetailVisible.value = true }
function openMergeDetail(row) { currentMergeDetail.value = row; mergeDetailVisible.value = true }
function closeMergeDetail() { mergeDetailVisible.value = false }
</script>

<template>
  <main class="charge-shell five-health-theme">
    <header class="system-header charge-header">
      <div class="brand"><span class="brand-mark">五健</span><span class="brand-title">后台管理演示</span></div>
      <button class="back-btn" type="button" @click="router.push('/')">返回入口</button>
    </header>
    <section class="admin-layout">
      <aside class="side-nav fh-card">
        <div class="side-title">五健系统</div>
        <button v-for="item in menus" :key="item.key" :class="{ active: activeMenu === item.key }" type="button" @click="switchMenu(item.key)">{{ item.label }}</button>
      </aside>
      <section class="content-area">
        <div class="page-bar"><h1>{{ pageTitle }}</h1><button v-if="activeMenu === 'charge' && activeTab === 'items'" class="primary-btn" type="button" @click="openCreate">+ 新增体检项目</button></div>

        <section v-if="activeMenu === 'charge'" class="workbench fh-card">
          <div class="tabs"><button :class="{ active: activeTab === 'items' }" type="button" @click="showList">体检项目库</button><button :class="{ active: activeTab === 'batch' }" type="button" @click="showBatchConfig">体检计划配置</button></div>
          <div v-if="activeTab === 'items'" class="list-view">
            <div class="query-bar compact-query"><label><span>项目名称</span><el-input v-model="query.name" class="query-name" placeholder="请输入项目名称" clearable /></label><label><span>项目分类</span><el-select v-model="query.category" class="query-select"><el-option label="全部" value="全部" /><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></label><label><span>执行环节</span><el-select v-model="query.step" class="query-select"><el-option label="全部" value="全部" /><el-option label="体格测量" value="体格测量" /><el-option label="采血" value="采血" /><el-option label="影像检查" value="影像检查" /><el-option label="口腔检查" value="口腔检查" /></el-select></label><label><span>状态</span><el-select v-model="query.status" class="query-select"><el-option label="全部" value="全部" /><el-option label="启用" value="启用" /><el-option label="停用" value="停用" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetProjectQuery">重置</button></div></div>
            <el-table :data="filteredProjects" class="charge-table" border><el-table-column type="index" label="序号" width="72" align="center" /><el-table-column prop="name" label="项目名称" min-width="150" /><el-table-column prop="category" label="项目分类" width="110" /><el-table-column label="标准价格" width="110"><template #default="{ row }">¥{{ row.price }}</template></el-table-column><el-table-column prop="department" label="执行科室" width="110" /><el-table-column prop="step" label="执行环节" width="110" /><el-table-column prop="sampleType" label="样本类型" width="100" /><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="updatedAt" label="更新时间" width="150" /><el-table-column label="操作" width="150" fixed="right"><template #default="{ row }"><div class="table-actions"><button type="button" @click="editProject(row)">编辑</button><button type="button" @click="toggleStatus(row)">{{ row.status === '启用' ? '停用' : '启用' }}</button></div></template></el-table-column></el-table>
          </div>
          <div v-if="activeTab === 'batch'" class="batch-view">
            <div class="batch-head"><h2>体检计划配置</h2><el-select model-value="2026年春季实验小学五健入校筛查" class="batch-select"><el-option label="2026年春季实验小学五健入校筛查" value="2026年春季实验小学五健入校筛查" /></el-select></div>
            <p class="page-note">学校：实验小学　体检日期：2026-04-18　批次状态：配置中</p>
            <div class="config-block signup-config-block">
              <div class="section-head"><div><h2>家长报名设置</h2></div></div>
              <div class="signup-config-form">
                <label><span>家长报名：</span><el-switch v-model="parentSignupConfig.enabled" active-text="开启" inactive-text="关闭" /></label>
                <label class="signup-time-row"><span>报名时间：</span><el-date-picker v-model="parentSignupConfig.startAt" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled="!parentSignupConfig.enabled" placeholder="开始时间" @change="normalizeSignupTime('start')" /><em>至</em><el-date-picker v-model="parentSignupConfig.endAt" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" :disabled="!parentSignupConfig.enabled" placeholder="截止时间" @change="normalizeSignupTime('end')" /></label>
                <label class="signup-entry-row"><span>报名入口：</span><button class="plain-btn" type="button" :disabled="!parentSignupConfig.enabled" @click="copySignupLink">复制链接</button><button class="plain-btn" type="button" :disabled="!parentSignupConfig.enabled" @click="openSignupQr">查看二维码</button><em>{{ parentSignupConfig.enabled ? '已生成' : '已关闭' }}</em></label>
              </div>
            </div>
            <div class="config-block"><div class="section-head"><div><h2>基础体检项目</h2></div><button class="primary-btn" type="button" @click="openBaseProjectPicker">+ 添加批次内项目</button></div><div class="base-charge-config"><span>基础项目收费方式：</span><el-radio-group v-model="baseChargeConfig.mode"><el-radio label="free">免费</el-radio><el-radio label="insurance">医保免费、无医保收费</el-radio></el-radio-group><label v-if="baseChargeConfig.mode === 'insurance'" class="base-charge-amount"><span>无医保收费金额：</span><el-input-number v-model="baseChargeConfig.noInsuranceFee" :min="0" :precision="2" :step="1" controls-position="right" /><em>元/人</em></label></div><el-table :data="batchRows" class="charge-table" border><el-table-column prop="name" label="项目名称" min-width="150" /><el-table-column prop="status" label="状态" width="90" /></el-table></div>
            <div class="config-block"><div class="section-head"><div><h2>推荐自费项目</h2></div><button class="primary-btn" type="button" @click="openChargeProjectPicker">+ 添加自费项目</button></div><el-table :data="addonRows" class="charge-table" border><el-table-column prop="name" label="项目名称" min-width="150" /><el-table-column prop="standardPrice" label="标准价格" width="100" /><el-table-column label="本次价格" width="120"><template #default="{ row }"><el-input v-model="row.addonPrice" class="table-price-input" /></template></el-table-column><el-table-column prop="sort" label="排序" width="80" /><el-table-column prop="status" label="状态" width="90" /></el-table></div>
          </div>
        </section>

        <section v-if="activeMenu === 'orders'" class="workbench fh-card"><div class="query-bar compact-query"><label><span>订单编号</span><el-input v-model="orderQuery.orderNo" class="query-name" placeholder="请输入订单编号" clearable /></label><label><span>学生姓名</span><el-input v-model="orderQuery.studentName" class="query-name" placeholder="请输入学生姓名" clearable /></label><label><span>学校</span><el-select v-model="orderQuery.school" class="query-select"><el-option label="全部学校" value="全部学校" /><el-option label="实验小学" value="实验小学" /><el-option label="中心小学" value="中心小学" /></el-select></label><label><span>体检批次</span><el-select v-model="orderQuery.batch" class="batch-select"><el-option label="2026年春季学生体检" value="2026年春季学生体检" /></el-select></label><label><span>支付状态</span><el-select v-model="orderQuery.payStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="待支付" value="待支付" /><el-option label="已支付" value="已支付" /><el-option label="已退款" value="已退款" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetOrderQuery">重置</button></div></div><el-table :data="filteredOrders" class="charge-table" border><el-table-column prop="orderNo" label="订单编号" min-width="150" /><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="school" label="学校" width="110" /><el-table-column prop="batch" label="体检批次" min-width="160" /><el-table-column prop="items" label="选购项目" min-width="220" /><el-table-column prop="amount" label="订单金额" width="100" /><el-table-column label="支付状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.payStatus)">{{ row.payStatus }}</el-tag></template></el-table-column><el-table-column prop="payTime" label="支付时间" width="150" /><el-table-column prop="orderStatus" label="订单状态" width="100" /><el-table-column label="操作" width="100" fixed="right"><template #default="{ row }"><div class="table-actions"><button type="button" @click="openOrderDetail(row)">查看详情</button></div></template></el-table-column></el-table></section>

        <section v-if="activeMenu === 'payments'" class="workbench fh-card"><div class="stat-grid"><article v-for="item in stats" :key="item.label" class="stat-card"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></article></div><div class="query-bar compact-query payment-query"><label><span>流水号</span><el-input v-model="paymentQuery.flowNo" class="query-name" placeholder="请输入流水号" clearable /></label><label><span>订单编号</span><el-input v-model="paymentQuery.orderNo" class="query-name" placeholder="请输入订单编号" clearable /></label><label><span>支付状态</span><el-select v-model="paymentQuery.payStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="成功" value="成功" /><el-option label="失败" value="失败" /><el-option label="处理中" value="处理中" /></el-select></label><label><span>退款状态</span><el-select v-model="paymentQuery.refundStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="未退款" value="未退款" /><el-option label="退款中" value="退款中" /><el-option label="已退款" value="已退款" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetPaymentQuery">重置</button></div></div><el-table :data="filteredPaymentRows" class="charge-table" border><el-table-column prop="flowNo" label="支付流水号" min-width="160" /><el-table-column prop="orderNo" label="订单编号" min-width="150" /><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="amount" label="支付金额" width="100" /><el-table-column prop="method" label="支付方式" width="110" /><el-table-column prop="payTime" label="支付时间" width="150" /><el-table-column label="支付状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.payStatus)">{{ row.payStatus }}</el-tag></template></el-table-column><el-table-column prop="refundStatus" label="退款状态" width="110" /><el-table-column label="操作" width="100" fixed="right"><template #default="{ row }"><div class="table-actions"><button type="button" @click="openPaymentDetail(row)">查看详情</button></div></template></el-table-column></el-table></section>

        <section v-if="activeMenu === 'merge'" class="workbench fh-card"><div class="query-bar compact-query"><label><span>学生姓名</span><el-input v-model="mergeQuery.studentName" class="query-name" placeholder="请输入学生姓名" clearable /></label><label><span>学校</span><el-select v-model="mergeQuery.school" class="query-select"><el-option label="全部学校" value="全部学校" /><el-option label="实验小学" value="实验小学" /><el-option label="中心小学" value="中心小学" /></el-select></label><label><span>体检批次</span><el-select v-model="mergeQuery.batch" class="batch-select"><el-option label="2026年春季学生体检" value="2026年春季学生体检" /></el-select></label><label><span>合并状态</span><el-select v-model="mergeQuery.mergeStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="待生成" value="待生成" /><el-option label="已生成" value="已生成" /><el-option label="生成失败" value="生成失败" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetMergeQuery">重置</button></div></div><el-table :data="filteredMergeRows" class="charge-table" border><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="school" label="学校" width="110" /><el-table-column prop="batch" label="体检批次" min-width="160" /><el-table-column prop="batchCount" label="批次内项目数" width="120" /><el-table-column prop="addonCount" label="已支付加项数" width="120" /><el-table-column prop="finalCount" label="最终执行项目数" width="130" /><el-table-column label="合并状态" width="110"><template #default="{ row }"><el-tag :type="statusType(row.mergeStatus)">{{ row.mergeStatus }}</el-tag></template></el-table-column><el-table-column prop="mergeTime" label="生成时间" width="150" /><el-table-column label="操作" width="100" fixed="right"><template #default="{ row }"><div class="table-actions"><button type="button" @click="openMergeDetail(row)">查看详情</button></div></template></el-table-column></el-table></section>
      </section>
    </section>

    <el-dialog v-model="baseProjectPickerVisible" title="添加基础体检项目" width="760px" class="charge-detail-dialog picker-dialog" :close-on-click-modal="true" destroy-on-close>
      <div class="query-bar compact-query dialog-query"><label><span>项目名称</span><el-input v-model="baseProjectQuery.name" class="query-name" placeholder="请输入项目名称" clearable /></label><label><span>项目分类</span><el-select v-model="baseProjectQuery.category" class="query-select"><el-option v-for="item in baseProjectCategories" :key="item" :label="item" :value="item" /></el-select></label></div>
      <el-table :data="filteredBaseProjectCandidates" class="charge-table" border @selection-change="handleBaseSelectionChange"><el-table-column type="selection" width="54" :selectable="canSelectBaseProject" /><el-table-column prop="name" label="项目名称" min-width="170" /><el-table-column prop="resultType" label="结果类型" width="120" /><el-table-column label="状态" width="110"><template #default="{ row }"><el-tag :type="isBaseProjectAdded(row) ? 'info' : statusType(row.status)">{{ isBaseProjectAdded(row) ? '已添加' : row.status }}</el-tag></template></el-table-column></el-table>
      <template #footer><div class="picker-footer"><button class="plain-btn" type="button" @click="baseProjectPickerVisible = false">取消</button><button class="primary-btn" type="button" @click="confirmAddBaseProjects">确认添加</button></div></template>
    </el-dialog>

    <el-dialog v-model="chargeProjectPickerVisible" title="添加推荐自费项目" width="760px" class="charge-detail-dialog picker-dialog" :close-on-click-modal="true" destroy-on-close>
      <div class="query-bar compact-query dialog-query"><label><span>收费项目名称</span><el-input v-model="chargeProjectQuery.name" class="query-name" placeholder="请输入收费项目名称" clearable /></label><label><span>项目分类</span><el-select v-model="chargeProjectQuery.category" class="query-select"><el-option v-for="item in chargeProjectCategories" :key="item" :label="item" :value="item" /></el-select></label></div>
      <el-table :data="filteredChargeProjectCandidates" class="charge-table" border @selection-change="handleChargeSelectionChange"><el-table-column type="selection" width="54" :selectable="canSelectChargeProject" /><el-table-column prop="name" label="收费项目名称" min-width="170" /><el-table-column prop="includedItems" label="包含体检项目" min-width="220" /><el-table-column prop="standardPrice" label="标准价格" width="110" /><el-table-column label="状态" width="110"><template #default="{ row }"><el-tag :type="isChargeProjectAdded(row) ? 'info' : statusType(row.status)">{{ isChargeProjectAdded(row) ? '已添加' : row.status }}</el-tag></template></el-table-column></el-table>
      <template #footer><div class="picker-footer"><button class="plain-btn" type="button" @click="chargeProjectPickerVisible = false">取消</button><button class="primary-btn" type="button" @click="confirmAddChargeProjects">确认添加</button></div></template>
    </el-dialog>

    <el-dialog v-model="signupQrVisible" title="家长报名二维码" width="420px" class="charge-detail-dialog signup-qr-dialog" :close-on-click-modal="true">
      <div class="signup-qr-body">
        <div class="mock-qr" aria-label="家长报名二维码"></div>
        <p><span>体检计划名称</span><strong>2026年春季实验小学五健入校筛查</strong></p>
        <p><span>学校名称</span><strong>实验小学</strong></p>
        <p><span>报名截止时间</span><strong>{{ parentSignupConfig.endAt }}</strong></p>
      </div>
      <template #footer><div class="picker-footer"><button class="plain-btn" type="button" @click="downloadSignupQr">下载二维码</button><button class="primary-btn" type="button" @click="signupQrVisible = false">关闭</button></div></template>
    </el-dialog>

    <el-dialog v-model="orderDetailVisible" title="自费订单详情" width="760px" class="charge-detail-dialog order-detail-dialog" :close-on-click-modal="true">
      <div v-if="currentOrderDetail" class="charge-detail-body">
        <section class="order-summary-section">
          <div class="order-summary-top">
            <div class="student-summary">
              <div class="student-identity-line"><strong>{{ currentOrderDetail.studentName }}</strong><span>{{ currentOrderDetail.className }} · {{ currentOrderDetail.school }}</span></div>
              <p>家长：{{ currentOrderDetail.parentName }}<i>{{ currentOrderDetail.phone }}</i></p>
            </div>
          </div>
          <div class="summary-description-grid">
            <p><span>订单编号</span><strong class="business-value">{{ currentOrderDetail.orderNo }}</strong></p>
            <p><span>下单时间</span><strong>{{ currentOrderDetail.createdAt }}</strong></p>
            <p><span>支付方式</span><strong>{{ currentOrderDetail.payment?.method || '/' }}</strong></p>
            <p><span>支付时间</span><strong>{{ currentOrderDetail.payTime }}</strong></p>
            <p><span>支付流水号</span><strong>{{ currentOrderDetail.payment?.flowNo || '/' }}</strong></p>
            <p><span>订单状态</span><strong class="business-value">{{ currentOrderDetail.orderStatus }}</strong></p>
            <p><span>订单金额</span><strong class="business-value">{{ currentOrderDetail.amount }}</strong></p>
            <p><span>支付状态</span><strong class="detail-status-pill" :class="orderFeeStatusClass(currentOrderDetail.payStatus)">{{ currentOrderDetail.payStatus }}</strong></p>
            <p><span>实付金额</span><strong>{{ orderPaidAmountText(currentOrderDetail) }}</strong></p>
          </div>
        </section>
        <section class="dialog-section">
          <h3>自费项目明细</h3>
          <table class="detail-table">
            <colgroup><col /><col /><col class="price-col" /><col class="qty-col" /><col class="price-col" /></colgroup>
            <thead><tr><th>项目名称</th><th>项目分类</th><th>单价</th><th>数量</th><th>小计</th></tr></thead>
            <tbody><tr v-for="item in currentOrderDetail.itemDetails" :key="item.name"><td>{{ item.name }}</td><td>{{ item.category }}</td><td>{{ item.unitPrice }}</td><td>{{ item.quantity }}</td><td>{{ item.subtotal }}</td></tr></tbody>
          </table>
        </section>
        <section class="dialog-section">
          <h3>操作记录</h3>
          <div class="timeline-list">
            <p v-for="item in currentOrderDetail.operations" :key="item.action + item.time"><strong>{{ item.action }}</strong><span>{{ item.time }} · {{ item.result }}</span></p>
          </div>
        </section>
      </div>
    </el-dialog>

    <el-dialog v-model="paymentDetailVisible" title="支付流水详情" width="760px" class="charge-detail-dialog order-detail-dialog payment-detail-dialog" :close-on-click-modal="true">
      <div v-if="currentPaymentDetail" class="charge-detail-body">
        <section class="order-summary-section">
          <div class="order-summary-top">
            <div class="student-summary">
              <div class="student-identity-line"><strong>{{ currentPaymentDetail.studentName }}</strong><span>{{ currentPaymentDetail.order?.className || '/' }} · {{ currentPaymentDetail.order?.school || '/' }}</span></div>
              <p>家长：{{ currentPaymentDetail.parentName }}<i>{{ currentPaymentDetail.phone }}</i></p>
            </div>
          </div>
          <div class="summary-description-grid">
            <p><span>支付流水号</span><strong class="business-value">{{ currentPaymentDetail.flowNo }}</strong></p>
            <p><span>订单编号</span><strong class="business-value">{{ currentPaymentDetail.orderNo }}</strong></p>
            <p><span>支付方式</span><strong>{{ currentPaymentDetail.method }}</strong></p>
            <p><span>支付状态</span><strong class="detail-status-pill" :class="paymentStatusClass(currentPaymentDetail.payStatus)">{{ currentPaymentDetail.payStatus }}</strong></p>
            <p><span>支付时间</span><strong>{{ currentPaymentDetail.payTime }}</strong></p>
            <p><span>到账时间</span><strong>{{ currentPaymentDetail.extra.arrivedAt }}</strong></p>
            <p><span>第三方交易号</span><strong>{{ currentPaymentDetail.extra.thirdNo }}</strong></p>
          </div>
        </section>
        <section class="dialog-section">
          <h3>金额信息</h3>
          <div class="summary-description-grid section-description-grid">
            <p><span>订单金额</span><strong class="business-value">{{ currentPaymentDetail.order?.amount || currentPaymentDetail.amount }}</strong></p>
            <p><span>实付金额</span><strong class="business-value">{{ currentPaymentDetail.amount }}</strong></p>
            <p><span>退款金额</span><strong>{{ currentPaymentDetail.extra.refundAmount }}</strong></p>
          </div>
        </section>
        <section class="dialog-section">
          <h3>退款信息</h3>
          <div class="summary-description-grid section-description-grid">
            <p><span>退款状态</span><strong class="detail-status-pill" :class="refundStatusClass(currentPaymentDetail.refundStatus)">{{ currentPaymentDetail.refundStatus }}</strong></p>
            <p><span>退款时间</span><strong>{{ currentPaymentDetail.extra.refundTime }}</strong></p>
            <p><span>退款原因</span><strong>{{ currentPaymentDetail.extra.refundReason }}</strong></p>
            <p><span>渠道状态</span><strong>{{ currentPaymentDetail.extra.channelStatus }}</strong></p>
            <p><span>对账状态</span><strong>{{ currentPaymentDetail.extra.reconcileStatus }}</strong></p>
          </div>
        </section>
        <section class="dialog-section">
          <h3>关联项目明细</h3>
          <table class="detail-table">
            <colgroup><col /><col /><col class="price-col" /><col class="qty-col" /><col class="price-col" /></colgroup>
            <thead><tr><th>项目名称</th><th>项目分类</th><th>单价</th><th>数量</th><th>小计</th></tr></thead>
            <tbody><tr v-for="item in currentPaymentDetail.itemDetails" :key="item.name"><td>{{ item.name }}</td><td>{{ item.category }}</td><td>{{ item.unitPrice }}</td><td>{{ item.quantity }}</td><td>{{ item.subtotal }}</td></tr></tbody>
          </table>
        </section>
        <section class="dialog-section">
          <h3>操作记录</h3>
          <div class="timeline-list">
            <p v-for="item in currentPaymentDetail.operations" :key="item.action + item.time"><strong>{{ item.action }}</strong><span>{{ item.time }} · {{ item.result }}</span></p>
          </div>
        </section>
      </div>
      <template #footer><button class="plain-btn" type="button" @click="paymentDetailVisible = false">关闭</button></template>
    </el-dialog>

    <el-dialog v-model="mergeDetailVisible" title="体检执行订单详情" width="600px" class="merge-dialog">
      <section class="dialog-section">
        <h3>学生信息</h3>
        <div class="field-list">
          <p><span>姓名：</span><strong>{{ currentMergeDetail.studentName }}</strong></p>
          <p><span>性别：</span><strong>{{ currentMergeDetail.gender }}</strong></p>
          <p><span>年龄：</span><strong>{{ currentMergeDetail.age }}</strong></p>
          <p><span>学校：</span><strong>{{ currentMergeDetail.school }}</strong></p>
          <p><span>班级：</span><strong>{{ currentMergeDetail.className }}</strong></p>
        </div>
      </section>
      <section class="dialog-section">
        <h3>批次内项目</h3>
        <div class="dialog-columns">
          <div><h4>批次内项目</h4><ul><li v-for="item in detailFreeItems" :key="item">✓ {{ item }}</li></ul></div>
          <div><h4>家长选购项目</h4><ul><li v-for="item in detailPaidItems" :key="item">✓ {{ item }}</li></ul></div>
        </div>
      </section>
      <section class="dialog-section final-section">
        <h3>最终体检执行项目</h3>
        <div class="final-tags"><span v-for="item in finalItems" :key="item">{{ item }}</span></div>
        <p class="status-row"><span>状态：</span><strong>已生成体检执行订单</strong></p>
      </section>
      <template #footer><button class="plain-btn" type="button" @click="closeMergeDetail">关闭</button></template>
    </el-dialog>
    <el-drawer v-model="drawerVisible" :title="editingId ? '编辑收费项目' : '新增收费项目'" size="460px" class="charge-drawer" direction="rtl">
      <el-form label-position="top" class="drawer-form"><section><h3>基础信息</h3><el-form-item label="项目名称" required><el-input v-model="form.name" placeholder="请输入项目名称" /></el-form-item><el-form-item label="项目分类"><el-select v-model="form.category"><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></el-form-item><el-form-item label="项目说明"><el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入项目说明" /></el-form-item></section><section><h3>收费配置</h3><el-form-item label="标准价格"><div class="price-input"><el-input-number v-model="form.price" :min="0" :precision="0" /><span>元</span></div></el-form-item></section><section><h3>执行配置</h3><el-form-item label="执行科室"><el-input v-model="form.department" /></el-form-item><el-form-item label="执行环节"><el-select v-model="form.step"><el-option label="体格测量" value="体格测量" /><el-option label="采血" value="采血" /><el-option label="采尿" value="采尿" /><el-option label="影像检查" value="影像检查" /><el-option label="口腔检查" value="口腔检查" /><el-option label="问卷测评" value="问卷测评" /><el-option label="医生检查" value="医生检查" /></el-select></el-form-item><el-form-item label="样本类型"><el-input v-model="form.sampleType" /></el-form-item><el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="启用" /><el-radio label="停用" /></el-radio-group></el-form-item></section></el-form><template #footer><div class="drawer-footer"><button class="plain-btn" type="button" @click="cancelForm">取消</button><button class="primary-btn" type="button" @click="saveProject">保存</button></div></template>
    </el-drawer>
  </main>
</template>

<style scoped>
.charge-shell{min-height:100vh;background:var(--fh-bg-page);color:var(--fh-text-primary);font-family:"Microsoft YaHei",Arial,sans-serif}.charge-header{height:68px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid var(--fh-border-light)}.brand{height:40px;display:inline-flex;align-items:center;gap:8px}.brand-mark{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 40px;color:#fff;font-weight:700;border-radius:10px;background:linear-gradient(135deg,#34c759,#5b8ff9)}.brand-title{display:inline-flex;align-items:center;height:40px;color:var(--fh-text-secondary);font-size:12px;line-height:40px;white-space:nowrap}.admin-layout{max-width:1440px;margin:0 auto;padding:16px 28px 32px;display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px}.side-nav{height:calc(100vh - 100px);min-height:560px;padding:16px 12px;position:sticky;top:84px}.side-title{padding:0 12px 12px;color:#137a5a;font-weight:700;border-bottom:1px solid var(--fh-border-light)}.side-nav button{width:100%;height:38px;margin-top:4px;padding:0 12px 0 22px;text-align:left;border:0;border-radius:8px;color:#475467;background:transparent;cursor:pointer}.side-nav button.active{color:#137a5a;background:#e9f8f2;font-weight:700}.side-nav button:hover{background:#f5fbf8}.content-area{min-width:0}.page-bar{height:40px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}.page-bar h1{margin:0;font-size:20px}.back-btn,.plain-btn,.primary-btn{height:32px;padding:0 14px;border-radius:7px;border:1px solid transparent;cursor:pointer;font-size:14px;white-space:nowrap}.back-btn,.plain-btn{color:#344054;background:#fff;border-color:#d0d5dd}.primary-btn{color:#fff;background:#2fbf8f;border-color:#2fbf8f}.primary-btn:hover{background:#25aa7e}.workbench{padding:0 18px 20px}.tabs{height:48px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--fh-border-light)}.tabs button{height:32px;padding:0 16px;border:0;border-radius:7px;color:#475467;background:transparent;cursor:pointer}.tabs button.active{color:#137a5a;background:#e9f8f2;font-weight:700}.query-bar{padding:12px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.query-actions{width:100%;height:40px;display:flex;align-items:center;justify-content:flex-end;gap:10px}.query-actions .plain-btn,.query-actions .primary-btn{width:72px;padding:0 12px}.compact-query label{display:flex;align-items:center;gap:8px}.compact-query label span{width:70px;color:#475467;font-size:13px;text-align:right}.query-name{width:180px}.query-select{width:160px}.batch-select{width:180px}.charge-table{width:100%}.table-actions{display:flex;gap:8px}.table-actions button{padding:0;border:0;color:#2f72d9;background:transparent;cursor:pointer}.table-actions button:hover{color:#137a5a}.batch-view{padding-top:12px}.batch-head{height:44px;display:flex;align-items:center;justify-content:space-between;gap:20px}.batch-head h2{margin:0;font-size:16px}.stat-grid{padding:14px 0 8px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.stat-card{padding:16px;border:1px solid var(--fh-border-light);border-radius:8px;background:#fbfffd}.stat-card span{display:block;color:var(--fh-text-secondary);font-size:13px}.stat-card strong{display:block;margin-top:8px;font-size:22px;color:#137a5a}.dialog-section{padding:14px 0;border-top:1px solid var(--fh-border-light)}.dialog-section:first-child{border-top:0;padding-top:0}.dialog-section h3{margin:0 0 10px;font-size:15px;font-weight:600;color:#344054}.field-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 32px}.field-list p{margin:0;display:flex;align-items:center;line-height:1.7;color:#344054}.field-list span{flex:0 0 auto;color:#64748b}.field-list strong{margin-left:2px;font-weight:600;color:#1f2937}.dialog-columns{display:grid;grid-template-columns:1fr 1fr;gap:28px}.dialog-columns h4{margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937}.dialog-columns ul{margin:0;padding:0;list-style:none}.dialog-columns li{line-height:2;color:#344054}.dialog-columns li::first-letter{color:#22a06b}.final-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.final-tags span{display:inline-flex;align-items:center;max-width:100%;height:28px;padding:0 10px;color:#334155;white-space:nowrap;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc}.status-row{margin:0;color:#64748b;line-height:1.8}.status-row span{color:#64748b}.status-row strong{margin-left:4px;color:#137a5a;font-weight:600}.charge-detail-body{max-height:68vh;overflow:auto;padding-right:4px}.charge-detail-body .field-list{grid-template-columns:repeat(2,minmax(220px,1fr));gap:6px 24px}.charge-detail-body .field-list p{display:grid;grid-template-columns:88px minmax(0,1fr);gap:6px;align-items:baseline;line-height:1.65}.charge-detail-body .field-list span{width:auto;text-align:right}.detail-status-text{font-weight:600;color:#1f2937}.charge-detail-dialog :deep(.el-dialog){max-width:calc(100vw - 32px);border-radius:8px;box-shadow:0 18px 48px rgba(15,23,42,.18)}.charge-detail-dialog :deep(.el-dialog__header){margin-right:0;padding:18px 20px 12px;border-bottom:1px solid var(--fh-border-light)}.charge-detail-dialog :deep(.el-dialog__title){font-size:18px;font-weight:700;color:#1f2937}.charge-detail-dialog :deep(.el-dialog__body){padding:0 20px}.charge-detail-dialog :deep(.el-dialog__footer){padding:12px 20px 18px;border-top:1px solid var(--fh-border-light)}.money-text{color:#137a5a!important}.detail-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px;color:#344054;border-top:1px solid #e8eef5;border-bottom:1px solid #e8eef5}.detail-table .price-col{width:70px}.detail-table .qty-col{width:50px}.detail-table th,.detail-table td{height:34px;padding:0 10px;border:0;border-top:1px solid #edf2f7;text-align:left;vertical-align:middle}.detail-table th{height:32px;background:#fafbfc;color:#475467;font-weight:600}.detail-table td:nth-child(3),.detail-table td:nth-child(5),.detail-table th:nth-child(3),.detail-table th:nth-child(5){text-align:right}.detail-table td:nth-child(4),.detail-table th:nth-child(4){text-align:center}.timeline-list{display:flex;flex-direction:column;border-top:1px solid #e8eef5}.timeline-list p{margin:0;min-height:36px;padding:7px 0;display:grid;grid-template-columns:142px 108px minmax(0,1fr);gap:12px;align-items:center;border-top:1px solid #edf2f7;color:#344054}.timeline-list p:first-child{border-top:0}.timeline-list span{color:#64748b}.timeline-list strong{font-weight:600;color:#1f2937}.timeline-list em{font-style:normal;color:#475467}.drawer-form section{padding:2px 0 14px;border-bottom:1px solid var(--fh-border-light)}.drawer-form h3{margin:14px 0 12px;font-size:15px;color:#137a5a}.price-input{display:flex;align-items:center;gap:10px}.drawer-footer{display:flex;justify-content:flex-end;gap:10px}:deep(.el-table th.el-table__cell){background:#f8fafc;color:#344054;font-weight:700}:deep(.el-table .cell){line-height:1.5}:deep(.el-form-item){margin-bottom:14px}:deep(.drawer-form .el-input),:deep(.drawer-form .el-select){width:100%}@media(max-width:1100px){.admin-layout{grid-template-columns:1fr}.side-nav{height:auto;min-height:0;position:static}.side-nav button{display:inline-flex;width:auto;margin-right:8px}.stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:900px){.admin-layout{padding:16px}.page-bar{height:auto;align-items:stretch;flex-direction:column;gap:10px}.query-name,.query-select,.batch-select{width:100%}.compact-query label{width:100%}.compact-query label span{text-align:left}.query-actions{justify-content:flex-start}.dialog-columns,.field-list,.stat-grid{grid-template-columns:1fr}.charge-detail-body .field-list{grid-template-columns:1fr}.timeline-list p{grid-template-columns:1fr;gap:4px}.detail-table{min-width:520px}.charge-detail-body{overflow:auto}}
.order-detail-dialog :deep(.el-dialog__header){padding:24px 24px 16px;border-bottom:0}.order-detail-dialog :deep(.el-dialog__title){font-size:22px;font-weight:500;color:#111827}.order-detail-dialog :deep(.el-dialog__headerbtn){top:18px;right:18px}.order-detail-dialog :deep(.el-dialog__body){padding:0 24px}.order-detail-dialog .charge-detail-body{max-height:calc(68vh + 42px);padding:0 2px 24px 0}.order-summary-section{padding:2px 0 18px;border-bottom:1px solid #e5e7eb}.order-summary-top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}.student-summary{min-width:0}.student-summary>strong{display:block;color:#111827;font-size:18px;font-weight:600;line-height:1.35}.student-summary>span{display:block;margin-top:4px;color:#64748b;font-size:14px;font-weight:400;line-height:1.45}.student-summary p{margin:8px 0 0;color:#334155;font-size:14px;line-height:1.5}.student-summary i{margin-left:24px;color:#334155;font-style:normal}.order-summary-amount{display:flex;align-items:baseline;gap:14px;flex:0 0 auto;padding-top:2px}.order-summary-amount>strong{color:#137a5a;font-size:22px;font-weight:600;line-height:1}.summary-description-grid{margin-top:18px;display:grid;grid-template-columns:repeat(2,minmax(0,278px));gap:8px 30px}.summary-description-grid p{margin:0;display:grid;grid-template-columns:70px minmax(0,1fr);gap:12px;align-items:baseline;min-height:22px;line-height:1.45}.summary-description-grid span{color:#64748b;font-size:14px;font-weight:400;white-space:nowrap}.summary-description-grid strong{min-width:0;color:#1f2937;font-size:14px;font-weight:400;overflow-wrap:anywhere}.summary-description-grid .business-value{font-weight:500}.order-detail-dialog .dialog-section{padding:18px 0;border-top:0;border-bottom:1px solid #e5e7eb}.order-detail-dialog .dialog-section:last-child{padding-bottom:0;border-bottom:0}.order-detail-dialog .dialog-section h3{margin:0 0 12px;color:#475569;font-size:16px;font-weight:500;line-height:1.35}.detail-status-pill{width:max-content;min-height:22px;padding:2px 8px;border-radius:5px;background:#e9f8f2;color:#137a5a;font-size:13px;font-weight:500;line-height:18px}.order-detail-dialog .detail-table{border:0;border-collapse:collapse;table-layout:fixed;font-size:14px;color:#344054}.order-detail-dialog .detail-table th{height:34px;background:#fcfcfd;color:#475569;font-weight:500}.order-detail-dialog .detail-table td{height:47px;color:#1f2937;font-weight:400}.order-detail-dialog .detail-table .price-col{width:70px}.order-detail-dialog .detail-table .qty-col{width:50px}.order-detail-dialog .detail-table th,.order-detail-dialog .detail-table td{padding:0 10px;border:0;border-top:1px solid #e5e7eb}.order-detail-dialog .detail-table thead th{border-top:0}.order-detail-dialog .detail-table td:nth-child(3),.order-detail-dialog .detail-table td:nth-child(5),.order-detail-dialog .detail-table th:nth-child(3),.order-detail-dialog .detail-table th:nth-child(5){text-align:right}.order-detail-dialog .detail-table td:nth-child(4),.order-detail-dialog .detail-table th:nth-child(4){text-align:center}.order-detail-dialog .timeline-list{border-top:1px solid #e5e7eb}.order-detail-dialog .timeline-list p{min-height:38px;padding:7px 0;grid-template-columns:150px 116px minmax(0,1fr);border-top:1px solid #e5e7eb}.order-detail-dialog .timeline-list p:first-child{border-top:0}.order-detail-dialog .timeline-list span{color:#94a3b8;font-weight:400}.order-detail-dialog .timeline-list strong{font-weight:500;color:#1f2937}.order-detail-dialog .timeline-list em{color:#64748b}@media(max-width:900px){.order-summary-top{display:block}.order-summary-amount{margin-top:14px}.summary-description-grid{grid-template-columns:1fr}.order-detail-dialog .timeline-list p{grid-template-columns:1fr;gap:4px}.order-detail-dialog .detail-table{min-width:520px}}
.order-detail-dialog .detail-table th{background:transparent;color:#64748b;font-size:14px;font-weight:400}.order-detail-dialog .detail-table td{height:48px;color:#1f2937;font-size:15px;font-weight:400}.order-detail-dialog .detail-table th,.order-detail-dialog .detail-table td{border-top:1px solid #e5e7eb}.order-detail-dialog .detail-table thead th{border-top:0}.order-detail-dialog .dialog-section h3{margin-bottom:12px;color:#475569;font-size:16px;font-weight:500}.order-detail-dialog .timeline-list{position:relative;border-top:0;padding:2px 0 0 0}.order-detail-dialog .timeline-list p{position:relative;min-height:0;margin:0;padding:0 0 18px 20px;display:block;border-top:0;color:#1f2937}.order-detail-dialog .timeline-list p::before{content:"";position:absolute;left:2px;top:8px;width:6px;height:6px;border-radius:50%;background:#8ab7a5}.order-detail-dialog .timeline-list p::after{content:"";position:absolute;left:5px;top:18px;bottom:4px;width:1px;background:#e5e7eb}.order-detail-dialog .timeline-list p:last-child{padding-bottom:0}.order-detail-dialog .timeline-list p:last-child::after{display:none}.order-detail-dialog .timeline-list strong{display:block;color:#1f2937;font-size:15px;font-weight:500;line-height:1.45}.order-detail-dialog .timeline-list span{display:block;margin-top:4px;color:#94a3b8;font-size:13px;font-weight:400;line-height:1.45}@media(max-width:900px){.order-detail-dialog .timeline-list p{display:block;padding-left:20px}.order-detail-dialog .detail-table{min-width:520px}}
.order-detail-dialog .order-summary-top{align-items:flex-start}.student-identity-line{display:flex;align-items:baseline;gap:14px;min-width:0}.student-identity-line>strong{color:#1f2937;font-size:18px;font-weight:600;line-height:1.35;white-space:nowrap}.student-identity-line>span{min-width:0;color:#64748b;font-size:14px;font-weight:400;line-height:1.45;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.student-summary>strong,.student-summary>span{display:initial}.student-summary p{margin:8px 0 0;color:#475569;font-size:14px;font-weight:400;line-height:1.5}.student-summary i{margin-left:24px;color:#475569;font-style:normal}.order-summary-amount{min-width:172px;display:block;text-align:right;padding-top:0}.order-summary-amount .fee-label{display:block;color:#64748b;font-size:13px;font-weight:400;line-height:1.3}.order-summary-amount .fee-main{margin-top:5px;display:flex;align-items:center;justify-content:flex-end;gap:12px}.order-summary-amount .fee-main>strong{color:#1f2937;font-size:23px;font-weight:600;line-height:1}.order-summary-amount p{margin:7px 0 0;color:#64748b;font-size:13px;font-weight:400;line-height:1.4}.detail-status-pill{display:inline-flex;align-items:center;justify-content:center;min-width:54px;height:22px;padding:0 8px;border-radius:5px;font-size:13px;font-weight:500;line-height:22px;white-space:nowrap}.detail-status-pill.pending{background:#fff4e6;color:#b45309}.detail-status-pill.paid{background:#e9f8f2;color:#137a5a}.detail-status-pill.refunding,.detail-status-pill.partial-refund{background:#eaf3ff;color:#2563eb}.detail-status-pill.refunded{background:#eef6f6;color:#3f6671}.detail-status-pill.closed,.detail-status-pill.neutral{background:#f1f5f9;color:#475569}.detail-status-pill.failed{background:#feecec;color:#b42318}@media(max-width:900px){.student-identity-line{flex-wrap:wrap;gap:4px 12px}.order-summary-amount{text-align:left;margin-top:14px}.order-summary-amount .fee-main{justify-content:flex-start}}
.order-summary-amount{display:flex;flex-direction:column;align-items:flex-end;text-align:right}.order-summary-amount .fee-label{line-height:20px}.order-summary-amount .fee-amount{display:block;margin-top:2px;color:#1f2937;font-size:26px;font-weight:600;line-height:34px}.order-summary-amount .fee-result{margin-top:5px;display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}.order-summary-amount .fee-result p{margin:0;color:#64748b;font-size:13px;font-weight:400;line-height:20px;white-space:nowrap}.order-summary-amount .detail-status-pill{min-width:0;height:20px;padding:0 7px;font-size:12px;font-weight:400;line-height:20px}.order-summary-amount .fee-main{display:none}@media(max-width:900px){.order-summary-amount{align-items:flex-start;text-align:left}.order-summary-amount .fee-result{justify-content:flex-start;flex-wrap:wrap}}
.order-detail-dialog .order-summary-top{display:block}.summary-description-grid p{grid-template-columns:96px minmax(0,1fr);align-items:center}.summary-description-grid .detail-status-pill{width:max-content;min-width:54px}.section-description-grid{margin-top:0}
.base-charge-config{margin:4px 0 12px;min-height:32px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;color:#344054;font-size:14px}.base-charge-config>span{color:#475467}.base-charge-amount{display:inline-flex;align-items:center;gap:8px}.base-charge-amount span{color:#475467}.base-charge-amount em{font-style:normal;color:#64748b}:deep(.base-charge-amount .el-input-number){width:128px}
.plain-btn:disabled,.primary-btn:disabled{cursor:not-allowed;opacity:.48}.signup-config-block{padding-bottom:2px}.signup-config-form{margin:4px 0 14px;display:flex;align-items:center;gap:18px 24px;flex-wrap:wrap;color:#344054;font-size:14px}.signup-config-form label{min-height:32px;display:flex;align-items:center;gap:8px}.signup-config-form label>span{color:#475467;white-space:nowrap}.signup-config-form em{font-style:normal;color:#98a2b3;white-space:nowrap}.signup-time-row{flex:1 1 520px}.signup-entry-row{flex:1 1 320px}.signup-entry-row .plain-btn{height:30px}:deep(.signup-time-row .el-date-editor.el-input){width:172px}:deep(.signup-config-form .el-switch__label){color:#64748b}.signup-qr-body{padding:6px 0 4px}.signup-qr-body p{margin:10px 0 0;display:grid;grid-template-columns:92px minmax(0,1fr);gap:12px;align-items:baseline;color:#344054;line-height:1.55}.signup-qr-body span{color:#64748b;text-align:right}.signup-qr-body strong{font-weight:500;color:#1f2937;overflow-wrap:anywhere}.mock-qr{width:164px;height:164px;margin:0 auto 16px;border:8px solid #fff;box-shadow:0 0 0 1px #d0d5dd;background-color:#fff;background-image:linear-gradient(90deg,#111827 10px,transparent 10px),linear-gradient(#111827 10px,transparent 10px),linear-gradient(90deg,transparent 18px,#111827 18px,#111827 28px,transparent 28px,transparent 45px,#111827 45px,#111827 53px,transparent 53px),linear-gradient(transparent 18px,#111827 18px,#111827 28px,transparent 28px,transparent 45px,#111827 45px,#111827 53px,transparent 53px);background-size:34px 34px,34px 34px,58px 58px,58px 58px;background-position:0 0,0 0,16px 20px,12px 14px}
.dialog-query{padding:0 0 12px}.picker-footer{display:flex;align-items:center;justify-content:flex-end;gap:10px}.table-price-input{width:92px}:deep(.table-price-input .el-input__wrapper){box-shadow:0 0 0 1px #d0d5dd inset}
@media(max-width:900px){.signup-config-form{display:block}.signup-config-form label{margin-top:10px;align-items:flex-start;flex-wrap:wrap}.signup-config-form label>span{width:70px;text-align:left}:deep(.signup-time-row .el-date-editor.el-input){width:100%}.signup-time-row em{width:100%;padding-left:78px}.signup-qr-body p{grid-template-columns:1fr}.signup-qr-body span{text-align:left}}
</style>


















