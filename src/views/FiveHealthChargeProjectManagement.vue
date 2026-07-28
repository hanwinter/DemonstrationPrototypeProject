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

const menus = [
  { key: 'charge', label: '收费项目管理' },
  { key: 'orders', label: '自费订单管理' },
  { key: 'payments', label: '支付管理' },
  { key: 'merge', label: '体检项目合并管理' },
]
const categories = ['视力', '口腔', '骨骼', '营养', '心理']
const freeProjects = ['视力筛查', '身高体重检测', '口腔检查', '脊柱检查']
const query = reactive({ name: '', category: '全部', status: '全部', mobileVisible: '全部' })
const orderQuery = reactive({ orderNo: '', studentName: '', school: '全部学校', batch: '2026年春季学生体检', payStatus: '全部' })
const mergeQuery = reactive({ studentName: '', school: '全部学校', batch: '2026年春季学生体检', mergeStatus: '全部' })
const paymentQuery = reactive({ flowNo: '', orderNo: '', payStatus: '全部', refundStatus: '全部' })
const form = reactive({ name: '', category: '视力', description: '', price: 0, mobileVisible: '展示', sort: 1, freeProject: '视力筛查', status: '启用' })

const projects = ref([
  { id: 1, name: '眼轴长度检查', category: '视力', price: 30, freeProject: '视力筛查', mobileVisible: '展示', sort: 1, status: '启用', updatedAt: '2026-07-18 09:20', description: '用于辅助评估儿童青少年近视发展风险。' },
  { id: 2, name: '角膜曲率检查', category: '视力', price: 35, freeProject: '视力筛查', mobileVisible: '展示', sort: 2, status: '启用', updatedAt: '2026-07-18 09:26', description: '用于评估角膜曲率及屈光相关情况。' },
  { id: 3, name: '窝沟封闭', category: '口腔', price: 120, freeProject: '口腔检查', mobileVisible: '展示', sort: 3, status: '启用', updatedAt: '2026-07-19 14:10', description: '用于儿童恒磨牙龋齿风险预防。' },
  { id: 4, name: '骨龄检测', category: '骨骼', price: 80, freeProject: '身高体重检测', mobileVisible: '不展示', sort: 4, status: '停用', updatedAt: '2026-07-20 10:45', description: '用于辅助评估儿童生长发育阶段。' },
  { id: 5, name: '营养风险评估', category: '营养', price: 45, freeProject: '身高体重检测', mobileVisible: '展示', sort: 5, status: '启用', updatedAt: '2026-07-21 16:30', description: '结合基础体检结果评估营养风险。' },
])
const batchRows = [{ name: '眼轴长度检查', price: '30元', mobileVisible: '是', status: '启用' }, { name: '角膜曲率检查', price: '35元', mobileVisible: '是', status: '启用' }]
const orderRows = ref([
  { orderNo: 'WX202607180001', studentName: '林一凡', school: '实验小学', batch: '2026年春季学生体检', items: '眼轴长度检查、角膜曲率检查', amount: '¥65', payStatus: '已支付', payTime: '2026-07-18 10:25', orderStatus: '正常' },
  { orderNo: 'WX202607180002', studentName: '周思琪', school: '中心小学', batch: '2026年春季学生体检', items: '窝沟封闭', amount: '¥120', payStatus: '待支付', payTime: '-', orderStatus: '待支付' },
  { orderNo: 'WX202607180003', studentName: '陈子墨', school: '实验小学', batch: '2026年春季学生体检', items: '骨龄检测', amount: '¥80', payStatus: '已退款', payTime: '2026-07-18 11:42', orderStatus: '已关闭' },
])
const paymentRows = [
  { flowNo: 'PAY202607180001', orderNo: 'WX202607180001', studentName: '林一凡', amount: '¥65', method: '微信支付', payTime: '2026-07-18 10:25', payStatus: '成功', refundStatus: '未退款' },
  { flowNo: 'PAY202607180002', orderNo: 'WX202607180002', studentName: '周思琪', amount: '¥120', method: '微信支付', payTime: '-', payStatus: '处理中', refundStatus: '未退款' },
  { flowNo: 'PAY202607180003', orderNo: 'WX202607180003', studentName: '陈子墨', amount: '¥80', method: '微信支付', payTime: '2026-07-18 11:42', payStatus: '成功', refundStatus: '已退款' },
  { flowNo: 'PAY202607180004', orderNo: 'WX202607180004', studentName: '王予安', amount: '¥35', method: '微信支付', payTime: '2026-07-18 12:05', payStatus: '失败', refundStatus: '未退款' },
]
const mergeRows = ref([
  { studentName: '林一凡', gender: '男', age: '9岁', school: '实验小学', className: '三年级 2 班', batch: '2026年春季学生体检', freeItems: '身高、体重、视力筛查', paidItems: '眼轴长度检查、角膜曲率检查', mergeStatus: '已合并', mergeTime: '2026-07-18 10:30' },
  { studentName: '周思琪', gender: '女', age: '8岁', school: '中心小学', className: '二年级 1 班', batch: '2026年春季学生体检', freeItems: '身高、体重、口腔检查', paidItems: '窝沟封闭', mergeStatus: '待合并', mergeTime: '-' },
  { studentName: '陈子墨', gender: '男', age: '10岁', school: '实验小学', className: '四年级 3 班', batch: '2026年春季学生体检', freeItems: '身高、体重、脊柱检查', paidItems: '骨龄检测', mergeStatus: '合并失败', mergeTime: '2026-07-18 11:50' },
])
const currentMergeDetail = ref(mergeRows.value[0])
const stats = [{ label: '今日支付金额', value: '¥12,580' }, { label: '今日订单数量', value: '256' }, { label: '待退款订单', value: '3' }, { label: '退款金额', value: '¥560' }]
const detailFreeItems = ['身高', '体重', '裸眼视力', '口腔检查']
const detailPaidItems = ['眼轴长度检查', '角膜曲率检查']
const finalItems = [...detailFreeItems, ...detailPaidItems]
const pageTitle = computed(() => ({ charge: '收费项目管理', orders: '自费订单管理', payments: '支付管理', merge: '体检项目合并管理' }[activeMenu.value]))
const filteredProjects = computed(() => projects.value.filter((item) => (!query.name || item.name.includes(query.name.trim())) && (query.category === '全部' || item.category === query.category) && (query.status === '全部' || item.status === query.status) && (query.mobileVisible === '全部' || item.mobileVisible === query.mobileVisible)))
const filteredOrders = computed(() => orderRows.value.filter((item) => (!orderQuery.orderNo || item.orderNo.includes(orderQuery.orderNo.trim())) && (!orderQuery.studentName || item.studentName.includes(orderQuery.studentName.trim())) && (orderQuery.school === '全部学校' || item.school === orderQuery.school) && item.batch === orderQuery.batch && (orderQuery.payStatus === '全部' || item.payStatus === orderQuery.payStatus)))
const filteredPaymentRows = computed(() => paymentRows.filter((item) => (!paymentQuery.flowNo || item.flowNo.includes(paymentQuery.flowNo.trim())) && (!paymentQuery.orderNo || item.orderNo.includes(paymentQuery.orderNo.trim())) && (paymentQuery.payStatus === '全部' || item.payStatus === paymentQuery.payStatus) && (paymentQuery.refundStatus === '全部' || item.refundStatus === paymentQuery.refundStatus)))
const filteredMergeRows = computed(() => mergeRows.value.filter((item) => (!mergeQuery.studentName || item.studentName.includes(mergeQuery.studentName.trim())) && (mergeQuery.school === '全部学校' || item.school === mergeQuery.school) && item.batch === mergeQuery.batch && (mergeQuery.mergeStatus === '全部' || item.mergeStatus === mergeQuery.mergeStatus || (mergeQuery.mergeStatus === '合并成功' && item.mergeStatus === '已合并'))))

function switchMenu(key) { activeMenu.value = key; drawerVisible.value = false; mergeDetailVisible.value = false }
function resetForm(item) { form.name = item?.name || ''; form.category = item?.category || '视力'; form.description = item?.description || ''; form.price = item?.price || 0; form.mobileVisible = item?.mobileVisible || '展示'; form.sort = item?.sort || projects.value.length + 1; form.freeProject = item?.freeProject || '视力筛查'; form.status = item?.status || '启用' }
function openCreate() { editingId.value = null; resetForm(); drawerVisible.value = true }
function editProject(row) { editingId.value = row.id; resetForm(row); drawerVisible.value = true }
function cancelForm() { drawerVisible.value = false }
function saveProject() {
  if (!form.name.trim()) { ElMessage.warning('请输入项目名称'); return }
  const payload = { name: form.name.trim(), category: form.category, price: Number(form.price || 0), freeProject: form.freeProject, mobileVisible: form.mobileVisible, sort: Number(form.sort || 1), status: form.status, updatedAt: '2026-07-28 15:30', description: form.description.trim() }
  if (editingId.value) { Object.assign(projects.value.find((item) => item.id === editingId.value), payload); ElMessage.success('收费项目已更新') } else { projects.value.unshift({ id: Date.now(), ...payload }); ElMessage.success('收费项目已新增') }
  drawerVisible.value = false
}
function toggleStatus(row) { row.status = row.status === '启用' ? '停用' : '启用'; row.updatedAt = '2026-07-28 15:30'; ElMessage.success(`已${row.status}`) }
function showList() { activeTab.value = 'items'; drawerVisible.value = false }
function statusType(status) { return ['启用', '已支付', '成功', '正常', '已合并', '合并成功', '已生成体检任务'].includes(status) ? 'success' : status.includes('待') || status.includes('处理中') ? 'warning' : status.includes('失败') ? 'danger' : 'info' }
function resetProjectQuery() { query.name = ''; query.category = '全部'; query.status = '全部'; query.mobileVisible = '全部' }
function resetOrderQuery() { orderQuery.orderNo = ''; orderQuery.studentName = ''; orderQuery.school = '全部学校'; orderQuery.batch = '2026年春季学生体检'; orderQuery.payStatus = '全部' }
function resetPaymentQuery() { paymentQuery.flowNo = ''; paymentQuery.orderNo = ''; paymentQuery.payStatus = '全部'; paymentQuery.refundStatus = '全部' }
function resetMergeQuery() { mergeQuery.studentName = ''; mergeQuery.school = '全部学校'; mergeQuery.batch = '2026年春季学生体检'; mergeQuery.mergeStatus = '全部' }
function viewDetail() { ElMessage.info('当前为演示数据详情') }
function openMergeDetail(row) { currentMergeDetail.value = row; mergeDetailVisible.value = true }
function closeMergeDetail() { mergeDetailVisible.value = false }
</script>

<template>
  <main class="charge-shell five-health-theme">
    <header class="system-header charge-header">
      <div class="brand"><span class="brand-mark">五健</span><div><strong>五健系统</strong><small>后台管理演示</small></div></div>
      <button class="back-btn" type="button" @click="router.push('/')">返回入口</button>
    </header>
    <section class="admin-layout">
      <aside class="side-nav fh-card">
        <div class="side-title">五健系统</div>
        <button v-for="item in menus" :key="item.key" :class="{ active: activeMenu === item.key }" type="button" @click="switchMenu(item.key)">{{ item.label }}</button>
      </aside>
      <section class="content-area">
        <div class="page-bar"><h1>{{ pageTitle }}</h1><button v-if="activeMenu === 'charge' && activeTab === 'items'" class="primary-btn" type="button" @click="openCreate">+ 新增收费项目</button></div>

        <section v-if="activeMenu === 'charge'" class="workbench fh-card">
          <div class="tabs"><button :class="{ active: activeTab === 'items' }" type="button" @click="showList">收费项目列表</button><button :class="{ active: activeTab === 'batch' }" type="button" @click="activeTab = 'batch'">体检批次配置</button></div>
          <div v-if="activeTab === 'items'" class="list-view">
            <div class="query-bar compact-query"><label><span>项目名称</span><el-input v-model="query.name" class="query-name" placeholder="请输入项目名称" clearable /></label><label><span>项目分类</span><el-select v-model="query.category" class="query-select"><el-option label="全部" value="全部" /><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></label><label><span>状态</span><el-select v-model="query.status" class="query-select"><el-option label="全部" value="全部" /><el-option label="启用" value="启用" /><el-option label="停用" value="停用" /></el-select></label><label><span>移动端</span><el-select v-model="query.mobileVisible" class="query-select"><el-option label="全部" value="全部" /><el-option label="展示" value="展示" /><el-option label="不展示" value="不展示" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetProjectQuery">重置</button></div></div>
            <el-table :data="filteredProjects" class="charge-table" border><el-table-column type="index" label="序号" width="72" align="center" /><el-table-column prop="name" label="项目名称" min-width="150" /><el-table-column prop="category" label="项目分类" width="110" /><el-table-column label="收费价格" width="110"><template #default="{ row }">¥{{ row.price }}</template></el-table-column><el-table-column prop="freeProject" label="关联免费项目" min-width="140" /><el-table-column prop="mobileVisible" label="移动端展示" width="120" /><el-table-column prop="sort" label="排序" width="80" align="center" /><el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="updatedAt" label="更新时间" width="150" /><el-table-column label="操作" width="150" fixed="right"><template #default="{ row }"><div class="table-actions"><button type="button" @click="editProject(row)">编辑</button><button type="button" @click="toggleStatus(row)">{{ row.status === '启用' ? '停用' : '启用' }}</button></div></template></el-table-column></el-table>
          </div>
          <div v-if="activeTab === 'batch'" class="batch-view"><div class="batch-head"><h2>体检批次收费项目配置</h2><el-select model-value="2026年春季学生体检" class="batch-select"><el-option label="2026年春季学生体检" value="2026年春季学生体检" /></el-select></div><el-table :data="batchRows" class="charge-table" border><el-table-column prop="name" label="项目名称" min-width="160" /><el-table-column prop="price" label="价格" width="120" /><el-table-column prop="mobileVisible" label="移动端展示" width="140" /><el-table-column label="状态" width="120"><template #default="{ row }"><el-tag type="success">{{ row.status }}</el-tag></template></el-table-column></el-table></div>
        </section>

        <section v-if="activeMenu === 'orders'" class="workbench fh-card"><div class="query-bar compact-query"><label><span>订单编号</span><el-input v-model="orderQuery.orderNo" class="query-name" placeholder="请输入订单编号" clearable /></label><label><span>学生姓名</span><el-input v-model="orderQuery.studentName" class="query-name" placeholder="请输入学生姓名" clearable /></label><label><span>学校</span><el-select v-model="orderQuery.school" class="query-select"><el-option label="全部学校" value="全部学校" /><el-option label="实验小学" value="实验小学" /><el-option label="中心小学" value="中心小学" /></el-select></label><label><span>体检批次</span><el-select v-model="orderQuery.batch" class="batch-select"><el-option label="2026年春季学生体检" value="2026年春季学生体检" /></el-select></label><label><span>支付状态</span><el-select v-model="orderQuery.payStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="待支付" value="待支付" /><el-option label="已支付" value="已支付" /><el-option label="已退款" value="已退款" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetOrderQuery">重置</button></div></div><el-table :data="filteredOrders" class="charge-table" border><el-table-column prop="orderNo" label="订单编号" min-width="150" /><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="school" label="学校" width="110" /><el-table-column prop="batch" label="体检批次" min-width="160" /><el-table-column prop="items" label="购买项目" min-width="220" /><el-table-column prop="amount" label="订单金额" width="100" /><el-table-column label="支付状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.payStatus)">{{ row.payStatus }}</el-tag></template></el-table-column><el-table-column prop="payTime" label="支付时间" width="150" /><el-table-column prop="orderStatus" label="订单状态" width="100" /><el-table-column label="操作" width="100"><template #default><div class="table-actions"><button type="button" @click="viewDetail">查看详情</button></div></template></el-table-column></el-table></section>

        <section v-if="activeMenu === 'payments'" class="workbench fh-card"><div class="stat-grid"><article v-for="item in stats" :key="item.label" class="stat-card"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></article></div><div class="query-bar compact-query payment-query"><label><span>流水号</span><el-input v-model="paymentQuery.flowNo" class="query-name" placeholder="请输入流水号" clearable /></label><label><span>订单编号</span><el-input v-model="paymentQuery.orderNo" class="query-name" placeholder="请输入订单编号" clearable /></label><label><span>支付状态</span><el-select v-model="paymentQuery.payStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="成功" value="成功" /><el-option label="失败" value="失败" /><el-option label="处理中" value="处理中" /></el-select></label><label><span>退款状态</span><el-select v-model="paymentQuery.refundStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="未退款" value="未退款" /><el-option label="退款中" value="退款中" /><el-option label="已退款" value="已退款" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetPaymentQuery">重置</button></div></div><el-table :data="filteredPaymentRows" class="charge-table" border><el-table-column prop="flowNo" label="支付流水号" min-width="160" /><el-table-column prop="orderNo" label="订单编号" min-width="150" /><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="amount" label="支付金额" width="100" /><el-table-column prop="method" label="支付方式" width="110" /><el-table-column prop="payTime" label="支付时间" width="150" /><el-table-column label="支付状态" width="100"><template #default="{ row }"><el-tag :type="statusType(row.payStatus)">{{ row.payStatus }}</el-tag></template></el-table-column><el-table-column prop="refundStatus" label="退款状态" width="110" /><el-table-column label="操作" width="100"><template #default><div class="table-actions"><button type="button" @click="viewDetail">查看详情</button></div></template></el-table-column></el-table></section>

        <section v-if="activeMenu === 'merge'" class="workbench fh-card"><div class="query-bar compact-query"><label><span>学生姓名</span><el-input v-model="mergeQuery.studentName" class="query-name" placeholder="请输入学生姓名" clearable /></label><label><span>学校</span><el-select v-model="mergeQuery.school" class="query-select"><el-option label="全部学校" value="全部学校" /><el-option label="实验小学" value="实验小学" /><el-option label="中心小学" value="中心小学" /></el-select></label><label><span>体检批次</span><el-select v-model="mergeQuery.batch" class="batch-select"><el-option label="2026年春季学生体检" value="2026年春季学生体检" /></el-select></label><label><span>合并状态</span><el-select v-model="mergeQuery.mergeStatus" class="query-select"><el-option label="全部" value="全部" /><el-option label="待合并" value="待合并" /><el-option label="合并成功" value="合并成功" /><el-option label="合并失败" value="合并失败" /></el-select></label><div class="query-actions"><button class="primary-btn" type="button">查询</button><button class="plain-btn" type="button" @click="resetMergeQuery">重置</button></div></div><el-table :data="filteredMergeRows" class="charge-table" border><el-table-column prop="studentName" label="学生姓名" width="100" /><el-table-column prop="school" label="学校" width="110" /><el-table-column prop="batch" label="体检批次" min-width="160" /><el-table-column prop="freeItems" label="免费体检项目" min-width="180" /><el-table-column prop="paidItems" label="自费项目" min-width="180" /><el-table-column label="合并状态" width="110"><template #default="{ row }"><el-tag :type="statusType(row.mergeStatus)">{{ row.mergeStatus }}</el-tag></template></el-table-column><el-table-column prop="mergeTime" label="合并时间" width="150" /><el-table-column label="操作" width="100"><template #default="{ row }"><div class="table-actions"><button type="button" @click="openMergeDetail(row)">查看详情</button></div></template></el-table-column></el-table></section>
      </section>
    </section>

    <el-dialog v-model="mergeDetailVisible" title="体检项目合并详情" width="600px" class="merge-dialog">
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
        <h3>本次体检项目</h3>
        <div class="dialog-columns">
          <div><h4>免费体检项目</h4><ul><li v-for="item in detailFreeItems" :key="item">✓ {{ item }}</li></ul></div>
          <div><h4>家长购买项目</h4><ul><li v-for="item in detailPaidItems" :key="item">✓ {{ item }}</li></ul></div>
        </div>
      </section>
      <section class="dialog-section final-section">
        <h3>最终生成体检项目</h3>
        <div class="final-tags"><span v-for="item in finalItems" :key="item">{{ item }}</span></div>
        <p class="status-row"><span>状态：</span><strong>已生成体检任务</strong></p>
      </section>
      <template #footer><button class="plain-btn" type="button" @click="closeMergeDetail">关闭</button></template>
    </el-dialog>
    <el-drawer v-model="drawerVisible" :title="editingId ? '编辑收费项目' : '新增收费项目'" size="460px" class="charge-drawer" direction="rtl">
      <el-form label-position="top" class="drawer-form"><section><h3>基础信息</h3><el-form-item label="项目名称" required><el-input v-model="form.name" placeholder="请输入项目名称" /></el-form-item><el-form-item label="项目分类"><el-select v-model="form.category"><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></el-form-item><el-form-item label="项目说明"><el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入项目说明" /></el-form-item></section><section><h3>收费配置</h3><el-form-item label="收费价格"><div class="price-input"><el-input-number v-model="form.price" :min="0" :precision="0" /><span>元</span></div></el-form-item></section><section><h3>移动端配置</h3><el-form-item label="是否展示到移动端"><el-radio-group v-model="form.mobileVisible"><el-radio label="展示" /><el-radio label="不展示" /></el-radio-group></el-form-item><el-form-item label="排序号"><el-input-number v-model="form.sort" :min="1" :precision="0" /></el-form-item></section><section><h3>项目关联</h3><el-form-item label="关联免费体检项目"><el-select v-model="form.freeProject"><el-option v-for="item in freeProjects" :key="item" :label="item" :value="item" /></el-select></el-form-item></section></el-form><template #footer><div class="drawer-footer"><button class="plain-btn" type="button" @click="cancelForm">取消</button><button class="primary-btn" type="button" @click="saveProject">保存</button></div></template>
    </el-drawer>
  </main>
</template>

<style scoped>
.charge-shell{min-height:100vh;background:var(--fh-bg-page);color:var(--fh-text-primary);font-family:"Microsoft YaHei",Arial,sans-serif}.charge-header{height:68px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid var(--fh-border-light)}.brand{display:flex;align-items:center;gap:8px}.brand-mark{width:40px;height:40px;display:grid;place-items:center;color:#fff;font-weight:700;border-radius:10px;background:linear-gradient(135deg,#34c759,#5b8ff9)}.brand strong{display:block;font-size:14px;line-height:20px}.brand small{display:block;color:var(--fh-text-secondary);font-size:12px;line-height:18px}.admin-layout{max-width:1440px;margin:0 auto;padding:16px 28px 32px;display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px}.side-nav{height:calc(100vh - 100px);min-height:560px;padding:16px 12px;position:sticky;top:84px}.side-title{padding:0 12px 12px;color:#137a5a;font-weight:700;border-bottom:1px solid var(--fh-border-light)}.side-nav button{width:100%;height:38px;margin-top:4px;padding:0 12px 0 22px;text-align:left;border:0;border-radius:8px;color:#475467;background:transparent;cursor:pointer}.side-nav button.active{color:#137a5a;background:#e9f8f2;font-weight:700}.side-nav button:hover{background:#f5fbf8}.content-area{min-width:0}.page-bar{height:40px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}.page-bar h1{margin:0;font-size:20px}.back-btn,.plain-btn,.primary-btn{height:32px;padding:0 14px;border-radius:7px;border:1px solid transparent;cursor:pointer;font-size:14px;white-space:nowrap}.back-btn,.plain-btn{color:#344054;background:#fff;border-color:#d0d5dd}.primary-btn{color:#fff;background:#2fbf8f;border-color:#2fbf8f}.primary-btn:hover{background:#25aa7e}.workbench{padding:0 18px 20px}.tabs{height:48px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--fh-border-light)}.tabs button{height:32px;padding:0 16px;border:0;border-radius:7px;color:#475467;background:transparent;cursor:pointer}.tabs button.active{color:#137a5a;background:#e9f8f2;font-weight:700}.query-bar{padding:12px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.query-actions{width:100%;height:40px;display:flex;align-items:center;justify-content:flex-end;gap:10px}.query-actions .plain-btn,.query-actions .primary-btn{width:72px;padding:0 12px}.compact-query label{display:flex;align-items:center;gap:8px}.compact-query label span{width:70px;color:#475467;font-size:13px;text-align:right}.query-name{width:180px}.query-select{width:160px}.batch-select{width:180px}.charge-table{width:100%}.table-actions{display:flex;gap:8px}.table-actions button{padding:0;border:0;color:#2f72d9;background:transparent;cursor:pointer}.table-actions button:hover{color:#137a5a}.batch-view{padding-top:12px}.batch-head{height:44px;display:flex;align-items:center;justify-content:space-between;gap:20px}.batch-head h2{margin:0;font-size:16px}.stat-grid{padding:14px 0 8px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.stat-card{padding:16px;border:1px solid var(--fh-border-light);border-radius:8px;background:#fbfffd}.stat-card span{display:block;color:var(--fh-text-secondary);font-size:13px}.stat-card strong{display:block;margin-top:8px;font-size:22px;color:#137a5a}.dialog-section{padding:16px 0;border-top:1px solid var(--fh-border-light)}.dialog-section:first-child{border-top:0;padding-top:0}.dialog-section h3{margin:0 0 14px;font-size:16px;font-weight:600;color:#1f2937}.field-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 32px}.field-list p{margin:0;display:flex;align-items:center;line-height:1.7;color:#344054}.field-list span{flex:0 0 auto;color:#64748b}.field-list strong{margin-left:2px;font-weight:600;color:#1f2937}.dialog-columns{display:grid;grid-template-columns:1fr 1fr;gap:28px}.dialog-columns h4{margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937}.dialog-columns ul{margin:0;padding:0;list-style:none}.dialog-columns li{line-height:2;color:#344054}.dialog-columns li::first-letter{color:#22a06b}.final-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.final-tags span{display:inline-flex;align-items:center;max-width:100%;height:28px;padding:0 10px;color:#334155;white-space:nowrap;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc}.status-row{margin:0;color:#64748b;line-height:1.8}.status-row span{color:#64748b}.status-row strong{margin-left:4px;color:#137a5a;font-weight:600}.drawer-form section{padding:2px 0 14px;border-bottom:1px solid var(--fh-border-light)}.drawer-form h3{margin:14px 0 12px;font-size:15px;color:#137a5a}.price-input{display:flex;align-items:center;gap:10px}.drawer-footer{display:flex;justify-content:flex-end;gap:10px}:deep(.el-table th.el-table__cell){background:#f8fafc;color:#344054;font-weight:700}:deep(.el-table .cell){line-height:1.5}:deep(.el-form-item){margin-bottom:14px}:deep(.drawer-form .el-input),:deep(.drawer-form .el-select){width:100%}@media(max-width:1100px){.admin-layout{grid-template-columns:1fr}.side-nav{height:auto;min-height:0;position:static}.side-nav button{display:inline-flex;width:auto;margin-right:8px}.stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:900px){.admin-layout{padding:16px}.page-bar{height:auto;align-items:stretch;flex-direction:column;gap:10px}.query-name,.query-select,.batch-select{width:100%}.compact-query label{width:100%}.compact-query label span{text-align:left}.query-actions{justify-content:flex-start}.dialog-columns,.field-list,.stat-grid{grid-template-columns:1fr}}
</style>








