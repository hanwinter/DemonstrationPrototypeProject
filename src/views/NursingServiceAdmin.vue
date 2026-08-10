<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('dashboard')
const detailVisible = ref(false)
const activeOrderIndex = ref(0)
const orderChangeDialogVisible = ref(false)
const orderChangeReason = ref('')
const archiveAuditFilter = ref('全部')
const activeArchiveAuditIndex = ref(0)
const rejectReasonDraft = ref('')

const company = 'XX母婴服务中心'
const menus = [
  { key: 'dashboard', label: '首页驾驶舱' },
  { key: 'orders', label: '服务订单管理' },
  { key: 'process', label: '服务过程管理' },
  { key: 'archiveAudit', label: '首日档案修改审核' },
  { key: 'exceptions', label: '异常管理' },
  { key: 'staff', label: '服务人员管理' },
  { key: 'customers', label: '客户管理' },
  { key: 'config', label: '服务配置' },
  { key: 'stats', label: '数据统计' },
]
const orders = [
  { no: 'JS20260701001', customer: '王女士', type: '月嫂服务', period: '2026-07-01 ~ 2026-09-30', staff: '张洪霞', status: '服务中', submitStatus: '已提交', version: 1, requestReason: '', requestTime: '', rejectReason: '', history: [{ version: 'V1', type: '初次提交', operator: '运营管理员', time: '2026-07-01 09:20', reason: '订单创建后提交生效', before: '草稿', after: '已提交' }] },
  { no: 'JS20260705002', customer: '陈女士', type: '育儿嫂', period: '2026-07-05 ~ 2026-08-31', staff: '刘春梅', status: '服务中', submitStatus: '草稿', version: 0, requestReason: '', requestTime: '', rejectReason: '', history: [] },
  { no: 'JS20260618003', customer: '赵女士', type: '月嫂服务', period: '2026-06-18 ~ 2026-07-18', staff: '周仁莲', status: '已完成', submitStatus: '修改申请中', version: 1, requestReason: '服务周期结束日期填写错误', requestTime: '2026-06-19 15:40', rejectReason: '', history: [{ version: 'V1', type: '初次提交', operator: '运营管理员', time: '2026-06-18 08:50', reason: '订单创建后提交生效', before: '草稿', after: '已提交' }, { version: 'V1', type: '申请修改', operator: '运营管理员', time: '2026-06-19 15:40', reason: '服务周期结束日期填写错误', before: '已提交', after: '修改申请中' }] },
]
const serviceRows = [
  { staff: '张洪霞', customer: '王女士', start: '08:30', end: '未打卡', log: '已提交', exception: '正常' },
  { staff: '刘春梅', customer: '陈女士', start: '未打卡', end: '未打卡', log: '未提交', exception: '打卡异常' },
  { staff: '周仁莲', customer: '赵女士', start: '08:10', end: '18:02', log: '已提交', exception: '宝宝异常' },
]
const archiveAuditRows = ref([
  { order: 'JS20260701001', staff: '张洪霞', customer: '王女士', archiveDate: '2026-07-01', version: 'V1', status: '待审核', applyTime: '2026-07-02 10:30', reason: '宝宝出生日期填写错误', rejectReason: '', history: [{ version: 'V1', type: '初次提交', operator: '张洪霞', time: '2026-07-01 09:18', reason: '首日服务档案初次提交' }, { version: 'V1', type: '申请修改', operator: '张洪霞', time: '2026-07-02 10:30', reason: '宝宝出生日期填写错误' }] },
  { order: 'JS20260705002', staff: '刘春梅', customer: '陈女士', archiveDate: '2026-07-05', version: 'V2', status: '已通过', applyTime: '2026-07-06 11:20', reason: '黄疸值录入错误', rejectReason: '', history: [{ version: 'V1', type: '初次提交', operator: '刘春梅', time: '2026-07-05 09:10', reason: '首日服务档案初次提交' }, { version: 'V2', type: '修改后提交', operator: '刘春梅', time: '2026-07-06 14:30', reason: '黄疸值录入错误' }] },
  { order: 'JS20260618003', staff: '周仁莲', customer: '赵女士', archiveDate: '2026-06-18', version: 'V1', status: '已拒绝', applyTime: '2026-06-19 15:40', reason: '想补充宝宝皮肤备注', rejectReason: '该项不影响归档数据，请在每日服务记录中补充说明', history: [{ version: 'V1', type: '初次提交', operator: '周仁莲', time: '2026-06-18 08:50', reason: '首日服务档案初次提交' }, { version: 'V1', type: '审核驳回', operator: '管理员', time: '2026-06-19 16:00', reason: '该项不影响归档数据，请在每日服务记录中补充说明' }] },
])
const exceptions = [
  { type: '宝宝异常', source: '每日服务记录', time: '2026-07-13 09:40', order: 'JS20260701001', status: '待处理' },
  { type: '打卡异常', source: '系统自动发现', time: '2026-07-13 10:00', order: 'JS20260705002', status: '跟进中' },
  { type: '日志异常', source: '服务过程监控', time: '2026-07-12 20:00', order: 'JS20260701001', status: '已处理' },
]
const staffRows = [
  { name: '张洪霞', photo: '张', phone: '13800008888', skills: '新生儿护理、月子餐', certificates: '母婴护理师', orders: '1个服务中', reviews: '4.9分' },
  { name: '刘春梅', photo: '刘', phone: '13600006666', skills: '早教陪伴、宝宝护理', certificates: '育婴师', orders: '1个服务中', reviews: '4.8分' },
]
const customerRows = [
  { name: '王女士', phone: '13900001111', address: '北京市朝阳区', family: '夫妻+宝宝', baby: '出生13天', orders: 'JS20260701001' },
  { name: '陈女士', phone: '13700002222', address: '北京市海淀区', family: '夫妻+宝宝', baby: '出生28天', orders: 'JS20260705002' },
]
const configRows = [
  { module: '服务类型管理', item: '月嫂服务', template: '每日记录模板A', status: '启用' },
  { module: '服务类型管理', item: '育儿嫂', template: '每日记录模板B', status: '启用' },
  { module: '异常规则配置', item: '宝宝体温异常', template: '自动提醒运营', status: '启用' },
]
const stats = [
  { label: '当前服务订单数量', value: '28' },
  { label: '今日服务人数', value: '26' },
  { label: '今日完成打卡数量', value: '23' },
  { label: '今日未打卡数量', value: '3' },
  { label: '今日未提交日志数量', value: '5' },
  { label: '异常提醒数量', value: '4' },
]
const chartStats = [
  { label: '服务订单统计', value: '本月新增 36 单' },
  { label: '月嫂服务量', value: '张洪霞 13 天' },
  { label: '异常统计', value: '本周 7 条' },
  { label: '客户满意度', value: '98%' },
  { label: '日志完成率', value: '91%' },
  { label: '打卡完成率', value: '88%' },
]
const currentOrder = computed(() => orders[activeOrderIndex.value] || orders[0])
const currentOrderEditable = computed(() => ['草稿', '修改通过'].includes(currentOrder.value?.submitStatus))
const pageTitle = computed(() => menus.find((item) => item.key === activeMenu.value)?.label || '家政服务管理后台')
const archiveAuditFilters = ['全部', '待审核', '已通过', '已拒绝']
const visibleArchiveAuditRows = computed(() => archiveAuditFilter.value === '全部' ? archiveAuditRows.value : archiveAuditRows.value.filter((item) => item.status === archiveAuditFilter.value))
const activeArchiveAudit = computed(() => archiveAuditRows.value[activeArchiveAuditIndex.value] || archiveAuditRows.value[0])

function switchMenu(key) {
  activeMenu.value = key
  detailVisible.value = false
}
function openOrderDetail(index = 0) {
  activeOrderIndex.value = index
  detailVisible.value = true
  orderChangeDialogVisible.value = false
  orderChangeReason.value = ''
}
function submitOrder() {
  const order = currentOrder.value
  const nextVersion = order.version + 1
  order.version = nextVersion
  order.submitStatus = '已提交'
  order.rejectReason = ''
  order.history.push({ version: `V${nextVersion}`, type: nextVersion === 1 ? '初次提交' : '修改后提交', operator: '运营管理员', time: '2026-07-01 10:00', reason: order.requestReason || '订单创建后提交生效', before: nextVersion === 1 ? '草稿' : '修改通过', after: '已提交' })
}
function openOrderChangeDialog() {
  orderChangeReason.value = currentOrder.value?.requestReason || ''
  orderChangeDialogVisible.value = true
}
function submitOrderChangeRequest() {
  if (!orderChangeReason.value.trim()) return
  const order = currentOrder.value
  order.submitStatus = '修改申请中'
  order.requestReason = orderChangeReason.value.trim()
  order.requestTime = '2026-07-01 10:30'
  order.rejectReason = ''
  order.history.push({ version: `V${order.version}`, type: '申请修改', operator: '运营管理员', time: order.requestTime, reason: order.requestReason, before: '已提交', after: '修改申请中' })
  orderChangeDialogVisible.value = false
}
function approveOrderChange() {
  const order = currentOrder.value
  order.submitStatus = '修改通过'
  order.history.push({ version: `V${order.version + 1}`, type: '审核通过', operator: '审核主管', time: '2026-07-01 11:00', reason: order.requestReason, before: '修改申请中', after: '修改通过' })
}
function rejectOrderChange() {
  const order = currentOrder.value
  order.submitStatus = '修改驳回'
  order.rejectReason = '订单核心信息需合同附件同步确认后再修改'
  order.history.push({ version: `V${order.version}`, type: '审核驳回', operator: '审核主管', time: '2026-07-01 11:00', reason: order.rejectReason, before: '修改申请中', after: '修改驳回' })
}
function openArchiveAudit(index) {
  const row = visibleArchiveAuditRows.value[index]
  activeArchiveAuditIndex.value = archiveAuditRows.value.indexOf(row)
  rejectReasonDraft.value = row.rejectReason || ''
}
function approveArchiveAudit() {
  const row = activeArchiveAudit.value
  row.status = '已通过'
  row.rejectReason = ''
  row.history.push({ version: row.version, type: '审核通过', operator: '管理员', time: '2026-07-02 11:10', reason: row.reason })
}
function rejectArchiveAudit() {
  if (!rejectReasonDraft.value.trim()) return
  const row = activeArchiveAudit.value
  row.status = '已拒绝'
  row.rejectReason = rejectReasonDraft.value.trim()
  row.history.push({ version: row.version, type: '审核驳回', operator: '管理员', time: '2026-07-02 11:10', reason: row.rejectReason })
}
function statusClass(status) {
  if (['正常', '已提交', '已完成', '已处理', '启用', '服务中', '已通过', '修改通过'].includes(status)) return 'ok'
  if (status.includes('未') || status.includes('待') || status.includes('异常')) return 'warn'
  return 'info'
}
</script>

<template>
  <main class="admin-shell">
    <header class="topbar">
      <div class="brand"><span>家政</span><div><strong>家政服务管理后台</strong><small>{{ company }}</small></div></div>
      <button type="button" @click="router.push('/')">返回入口</button>
    </header>
    <section class="layout">
      <aside class="sidebar">
        <div class="side-title">母婴陪护</div>
        <button v-for="item in menus" :key="item.key" :class="{ active: activeMenu === item.key }" type="button" @click="switchMenu(item.key)">{{ item.label }}</button>
      </aside>
      <section class="main-area">
        <div class="page-head"><h1>{{ pageTitle }}</h1><span>运营演示数据 · 2026-07-13</span></div>

        <template v-if="activeMenu === 'dashboard'">
          <section class="metric-grid"><article v-for="item in stats" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></article></section>
          <section class="panel"><div class="panel-head"><h2>今日服务状态列表</h2></div><table><thead><tr><th>月嫂</th><th>客户</th><th>打卡</th><th>日志</th><th>状态</th></tr></thead><tbody><tr v-for="row in serviceRows" :key="row.staff"><td>{{ row.staff }}</td><td>{{ row.customer }}</td><td>{{ row.start === '未打卡' ? '未打卡' : '已打卡' }}</td><td>{{ row.log }}</td><td><em :class="statusClass(row.exception)">{{ row.exception }}</em></td></tr></tbody></table></section>
        </template>

        <template v-else-if="activeMenu === 'orders'">
          <section v-if="!detailVisible" class="panel"><div class="panel-head"><h2>服务订单列表</h2><button type="button">新增订单</button></div><table><thead><tr><th>订单编号</th><th>客户姓名</th><th>服务类型</th><th>服务周期</th><th>当前服务人员</th><th>订单状态</th><th>提交状态</th><th>版本</th><th>操作</th></tr></thead><tbody><tr v-for="(row,index) in orders" :key="row.no"><td>{{ row.no }}</td><td>{{ row.customer }}</td><td>{{ row.type }}</td><td>{{ row.period }}</td><td>{{ row.staff }}</td><td><em :class="statusClass(row.status)">{{ row.status }}</em></td><td><em :class="statusClass(row.submitStatus)">{{ row.submitStatus }}</em></td><td>V{{ row.version || 0 }}</td><td><button class="link-btn" type="button" @click="openOrderDetail(index)">详情</button></td></tr></tbody></table></section>
          <section v-else class="detail-grid">
            <article class="panel wide"><div class="panel-head"><h2>订单详情</h2><button type="button" @click="detailVisible = false">返回列表</button></div><div class="field-grid"><p><span>订单编号</span><strong>{{ currentOrder.no }}</strong></p><p><span>合同信息</span><strong>住家月嫂服务合同</strong></p><p><span>服务周期</span><strong>{{ currentOrder.period }}</strong></p><p><span>订单状态</span><strong>{{ currentOrder.status }}</strong></p></div></article>
            <article class="panel wide"><div class="panel-head"><h2>提交与修改闭环</h2><em :class="statusClass(currentOrder.submitStatus)">{{ currentOrder.submitStatus }}</em></div><div class="field-grid"><p><span>当前版本</span><strong>V{{ currentOrder.version || 0 }}</strong></p><p><span>编辑权限</span><strong>{{ currentOrderEditable ? '允许编辑' : '已锁定' }}</strong></p><p><span>申请时间</span><strong>{{ currentOrder.requestTime || '暂无' }}</strong></p><p><span>修改原因</span><strong>{{ currentOrder.requestReason || '暂无' }}</strong></p><p v-if="currentOrder.rejectReason" class="wide"><span>拒绝原因</span><strong>{{ currentOrder.rejectReason }}</strong></p></div><div class="order-flow-actions"><template v-if="currentOrder.submitStatus === '草稿'"><button class="primary-admin-btn" type="button" @click="submitOrder">提交订单</button></template><template v-else-if="currentOrder.submitStatus === '已提交' || currentOrder.submitStatus === '修改驳回'"><button class="danger-admin-btn" type="button" @click="openOrderChangeDialog">申请修改</button></template><template v-else-if="currentOrder.submitStatus === '修改申请中'"><button class="primary-admin-btn" type="button" @click="approveOrderChange">审核通过</button><button class="danger-admin-btn" type="button" @click="rejectOrderChange">审核拒绝</button></template><template v-else-if="currentOrder.submitStatus === '修改通过'"><button class="primary-admin-btn" type="button" @click="submitOrder">修改后重新提交</button></template></div><p class="lock-tip">正式提交的订单不可直接修改；审核通过后才开放编辑，重新提交后再次锁定。</p></article>
            <article class="panel"><h2>客户信息</h2><p>王女士，13900001111，北京市朝阳区。</p></article>
            <article class="panel"><h2>宝宝信息</h2><p>宝宝出生13天，当前体温与喂养记录正常。</p></article>
            <article class="panel"><h2>当前服务人员</h2><p>张洪霞，母婴护理师，当前负责本订单。</p></article>
            <article class="panel"><h2>历史服务人员</h2><p>2026-07-01 至 2026-07-03：李秀兰。更换月嫂不影响订单历史记录。</p></article>
            <article class="panel"><h2>每日服务记录</h2><p>最近7天记录已归档，今日记录已提交。</p></article>
            <article class="panel"><h2>异常记录</h2><p>宝宝体温异常 1 条，已提醒运营跟进。</p></article>
            <article class="panel"><h2>评价记录</h2><p>客户阶段评价：服务细致，响应及时。</p></article>
            <article class="panel wide"><h2>订单修改历史</h2><table><thead><tr><th>版本号</th><th>节点</th><th>操作人</th><th>时间</th><th>修改原因</th><th>状态流转</th></tr></thead><tbody><tr v-for="item in currentOrder.history" :key="item.type + item.time"><td>{{ item.version }}</td><td>{{ item.type }}</td><td>{{ item.operator }}</td><td>{{ item.time }}</td><td>{{ item.reason }}</td><td>{{ item.before }} → {{ item.after }}</td></tr><tr v-if="!currentOrder.history.length"><td colspan="6">暂无提交记录</td></tr></tbody></table></article>
            <section v-if="orderChangeDialogVisible" class="admin-dialog-mask" @click.self="orderChangeDialogVisible = false"><article class="admin-dialog"><header><h2>订单申请修改</h2><button type="button" @click="orderChangeDialogVisible = false">×</button></header><label>修改原因<textarea v-model="orderChangeReason" rows="4" placeholder="例如：服务周期填写错误、服务人员选择错误"></textarea></label><footer><button type="button" @click="orderChangeDialogVisible = false">取消</button><button type="button" :disabled="!orderChangeReason.trim()" @click="submitOrderChangeRequest">提交申请</button></footer></article></section>
          </section>
        </template>

        <template v-else-if="activeMenu === 'process'">
          <section class="panel"><div class="panel-head"><h2>今日服务监控</h2></div><table><thead><tr><th>月嫂</th><th>客户</th><th>开始时间</th><th>结束时间</th><th>日志状态</th><th>异常状态</th><th>操作</th></tr></thead><tbody><tr v-for="row in serviceRows" :key="row.staff"><td>{{ row.staff }}</td><td>{{ row.customer }}</td><td>{{ row.start }}</td><td>{{ row.end }}</td><td><em :class="statusClass(row.log)">{{ row.log }}</em></td><td><em :class="statusClass(row.exception)">{{ row.exception }}</em></td><td><button class="link-btn" type="button">查看日志</button><button class="link-btn" type="button">提醒填写</button><button class="link-btn" type="button">提醒打卡</button></td></tr></tbody></table></section>
        </template>

        <template v-else-if="activeMenu === 'archiveAudit'">
          <section class="panel"><div class="panel-head"><h2>修改申请列表</h2><div class="tags filter-tags"><button v-for="item in archiveAuditFilters" :key="item" :class="{ active: archiveAuditFilter === item }" type="button" @click="archiveAuditFilter = item">{{ item }}</button></div></div><table><thead><tr><th>订单编号</th><th>客户</th><th>月嫂</th><th>档案日期</th><th>版本</th><th>申请时间</th><th>修改申请状态</th><th>操作</th></tr></thead><tbody><tr v-for="(row,index) in visibleArchiveAuditRows" :key="row.order + row.applyTime"><td>{{ row.order }}</td><td>{{ row.customer }}</td><td>{{ row.staff }}</td><td>{{ row.archiveDate }}</td><td>{{ row.version }}</td><td>{{ row.applyTime }}</td><td><em :class="statusClass(row.status)">{{ row.status }}</em></td><td><button class="link-btn" type="button" @click="openArchiveAudit(index)">查看档案详情</button></td></tr></tbody></table></section>
          <section v-if="activeArchiveAudit" class="detail-grid">
            <article class="panel wide"><div class="panel-head"><h2>修改申请记录</h2><em :class="statusClass(activeArchiveAudit.status)">{{ activeArchiveAudit.status }}</em></div><div class="field-grid"><p><span>申请人</span><strong>{{ activeArchiveAudit.staff }}</strong></p><p><span>申请时间</span><strong>{{ activeArchiveAudit.applyTime }}</strong></p><p><span>审核状态</span><strong>{{ activeArchiveAudit.status }}</strong></p><p><span>档案版本</span><strong>{{ activeArchiveAudit.version }}</strong></p><p class="wide"><span>修改原因</span><strong>{{ activeArchiveAudit.reason }}</strong></p><p v-if="activeArchiveAudit.rejectReason" class="wide"><span>拒绝原因</span><strong>{{ activeArchiveAudit.rejectReason }}</strong></p></div></article>
            <article class="panel"><h2>档案概要</h2><p>首日服务档案已提交后锁定，管理端不可直接修改。审核通过后仅月嫂端重新开放编辑。</p><div class="field-grid compact-fields"><p><span>客户</span><strong>{{ activeArchiveAudit.customer }}</strong></p><p><span>订单编号</span><strong>{{ activeArchiveAudit.order }}</strong></p><p><span>档案日期</span><strong>{{ activeArchiveAudit.archiveDate }}</strong></p><p><span>当前月嫂</span><strong>{{ activeArchiveAudit.staff }}</strong></p></div></article>
            <article class="panel"><h2>审核操作</h2><template v-if="activeArchiveAudit.status === '待审核'"><button class="primary-admin-btn" type="button" @click="approveArchiveAudit">通过</button><label class="reject-field">拒绝原因<textarea v-model="rejectReasonDraft" rows="3" placeholder="拒绝时必须填写原因"></textarea></label><button class="danger-admin-btn" type="button" :disabled="!rejectReasonDraft.trim()" @click="rejectArchiveAudit">拒绝</button></template><p v-else>该申请已完成审核，当前结果会保留在修改历史中。</p></article>
            <article class="panel wide"><h2>修改历史记录</h2><table><thead><tr><th>版本号</th><th>节点</th><th>操作人</th><th>时间</th><th>原因/说明</th></tr></thead><tbody><tr v-for="item in activeArchiveAudit.history" :key="item.type + item.time"><td>{{ item.version }}</td><td>{{ item.type }}</td><td>{{ item.operator }}</td><td>{{ item.time }}</td><td>{{ item.reason }}</td></tr></tbody></table></article>
          </section>
        </template>

        <template v-else-if="activeMenu === 'exceptions'">
          <section class="panel"><div class="panel-head"><h2>异常列表</h2><div class="tags"><span>宝宝异常</span><span>妈妈异常</span><span>服务异常</span><span>打卡异常</span><span>日志异常</span></div></div><table><thead><tr><th>异常类型</th><th>来源</th><th>发生时间</th><th>关联订单</th><th>处理状态</th></tr></thead><tbody><tr v-for="row in exceptions" :key="row.time"><td>{{ row.type }}</td><td>{{ row.source }}</td><td>{{ row.time }}</td><td>{{ row.order }}</td><td><em :class="statusClass(row.status)">{{ row.status }}</em></td></tr></tbody></table></section>
        </template>

        <template v-else-if="activeMenu === 'staff'">
          <section class="panel"><div class="panel-head"><h2>月嫂档案</h2></div><table><thead><tr><th>照片</th><th>姓名</th><th>联系电话</th><th>技能</th><th>证书</th><th>服务订单</th><th>评价</th></tr></thead><tbody><tr v-for="row in staffRows" :key="row.name"><td><span class="avatar">{{ row.photo }}</span></td><td>{{ row.name }}</td><td>{{ row.phone }}</td><td>{{ row.skills }}</td><td>{{ row.certificates }}</td><td>{{ row.orders }}</td><td>{{ row.reviews }}</td></tr></tbody></table></section>
        </template>

        <template v-else-if="activeMenu === 'customers'">
          <section class="panel"><div class="panel-head"><h2>客户列表</h2></div><table><thead><tr><th>姓名</th><th>联系电话</th><th>地址</th><th>家庭成员</th><th>宝宝信息</th><th>服务订单</th></tr></thead><tbody><tr v-for="row in customerRows" :key="row.name"><td>{{ row.name }}</td><td>{{ row.phone }}</td><td>{{ row.address }}</td><td>{{ row.family }}</td><td>{{ row.baby }}</td><td>{{ row.orders }}</td></tr></tbody></table></section>
        </template>

        <template v-else-if="activeMenu === 'config'">
          <section class="panel"><div class="panel-head"><h2>服务配置</h2></div><table><thead><tr><th>配置模块</th><th>配置项</th><th>关联模板/规则</th><th>状态</th></tr></thead><tbody><tr v-for="row in configRows" :key="row.module + row.item"><td>{{ row.module }}</td><td>{{ row.item }}</td><td>{{ row.template }}</td><td><em :class="statusClass(row.status)">{{ row.status }}</em></td></tr></tbody></table></section>
        </template>

        <template v-else>
          <section class="metric-grid stat-list"><article v-for="item in chartStats" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></article></section>
        </template>
      </section>
    </section>
  </main>
</template>

<style scoped>
*{box-sizing:border-box}.admin-shell{min-height:100vh;color:#263445;background:#edf1f5;font-family:"Microsoft YaHei",Arial,sans-serif}.topbar{height:68px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #dfe6ee}.brand{display:flex;align-items:center;gap:12px}.brand>span{width:42px;height:42px;display:grid;place-items:center;color:#fff;font-weight:700;border-radius:10px;background:#12a8ad}.brand strong{display:block;font-size:18px}.brand small{display:block;margin-top:3px;color:#738094}.topbar button,.panel-head button{height:32px;padding:0 14px;border:1px solid #cfd8e3;border-radius:7px;background:#fff;color:#344054;cursor:pointer}.layout{max-width:1440px;margin:0 auto;padding:16px 24px 32px;display:grid;grid-template-columns:220px minmax(0,1fr);gap:18px}.sidebar{height:calc(100vh - 100px);min-height:580px;position:sticky;top:84px;padding:14px 10px;border:1px solid #dfe6ee;border-radius:10px;background:#fff}.side-title{padding:0 12px 12px;color:#0f7f83;font-weight:700;border-bottom:1px solid #edf1f5}.sidebar button{width:100%;height:38px;margin-top:5px;padding:0 12px;text-align:left;border:0;border-radius:8px;background:transparent;color:#526173;cursor:pointer}.sidebar button.active,.sidebar button:hover{color:#0f7f83;background:#e8f7f8;font-weight:700}.main-area{min-width:0}.page-head{height:42px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}.page-head h1{margin:0;font-size:21px}.page-head span{color:#7b8796;font-size:13px}.metric-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:14px}.metric-grid article,.panel{border:1px solid #dfe6ee;border-radius:10px;background:#fff}.metric-grid article{padding:15px}.metric-grid span{display:block;color:#6b7788;font-size:13px}.metric-grid strong{display:block;margin-top:8px;color:#0f7f83;font-size:24px}.panel{padding:16px;margin-bottom:14px}.panel h2{margin:0 0 12px;font-size:17px}.panel-head{min-height:34px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px}.panel-head h2{margin:0}.tags{display:flex;flex-wrap:wrap;gap:8px}.tags span{height:26px;padding:0 10px;display:inline-flex;align-items:center;border-radius:14px;background:#edf8f8;color:#0f7f83;font-size:12px}table{width:100%;border-collapse:collapse;table-layout:auto}th,td{height:46px;padding:9px 10px;text-align:left;border-bottom:1px solid #edf1f5;font-size:13px;vertical-align:middle}th{color:#344054;background:#f8fafc;font-weight:700}td{color:#344054}.link-btn{margin-right:8px;padding:0;border:0;background:transparent;color:#2474d6;cursor:pointer}em{display:inline-flex;align-items:center;height:24px;padding:0 8px;border-radius:12px;font-style:normal;font-size:12px}.ok{color:#0f7f4f;background:#e8f7ef}.warn{color:#b45309;background:#fff4dc}.info{color:#475467;background:#eef2f6}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.detail-grid .panel{margin:0}.wide{grid-column:1/-1}.field-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.field-grid p{margin:0;padding:12px;border-radius:8px;background:#f8fafc}.field-grid span{display:block;color:#7b8796;font-size:12px}.field-grid strong{display:block;margin-top:6px}.avatar{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:#12a8ad;color:#fff;font-weight:700}.stat-list{grid-template-columns:repeat(3,minmax(0,1fr))}:root{--nursing-primary:#E8A86A;--nursing-primary-deep:#C98343;--nursing-primary-light:#FFF7EE;--nursing-text:#1F2937;--nursing-muted:#6B7280}.admin-shell{color:var(--nursing-text)!important;background:#F7F8FA!important}.brand>span,.avatar{background:var(--nursing-primary)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.tags span{color:var(--nursing-primary-deep)!important}.sidebar button.active,.sidebar button:hover,.tags span{background:var(--nursing-primary-light)!important}.tags span{border-color:transparent}.topbar button:hover,.panel-head button:hover{color:var(--nursing-primary-deep)!important;border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important}.ok{color:var(--nursing-primary-deep)!important;background:var(--nursing-primary-light)!important}.link-btn{color:#C98343!important}th{background:#FFF7EE!important;color:var(--nursing-text)!important}:root{--nursing-primary:#D79A5B;--nursing-primary-deep:#B9783B;--nursing-primary-light:#FDF6EE;--nursing-page:#F8F6F3;--nursing-card:#FFFFFF;--nursing-text:#1F2937;--nursing-muted:#6B7280;--nursing-border:#E8E1D8}.admin-shell{background:var(--nursing-page)!important;color:var(--nursing-text)!important}.topbar,.sidebar,.panel,.metric-grid article{background:var(--nursing-card)!important;border-color:var(--nursing-border)!important;box-shadow:0 6px 18px rgba(89,65,42,.05)}.brand>span,.avatar{background:var(--nursing-primary)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.tags span,.link-btn{color:var(--nursing-primary-deep)!important}.sidebar button.active,.sidebar button:hover,.tags span,.ok{background:var(--nursing-primary-light)!important;color:var(--nursing-primary-deep)!important}.topbar button,.panel-head button{border-color:var(--nursing-border)!important}.topbar button:hover,.panel-head button:hover{border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important;color:var(--nursing-primary-deep)!important}th{background:#FDF6EE!important;color:var(--nursing-text)!important}th,td{border-bottom-color:var(--nursing-border)!important}td{color:var(--nursing-text)!important}.field-grid p{background:#FDF6EE!important}.warn{background:#FFF4E5!important;color:#9A5E1F!important}.info{background:#F4F1ED!important;color:#6B7280!important}@media(max-width:1100px){.layout{grid-template-columns:1fr}.sidebar{height:auto;min-height:0;position:static}.sidebar button{display:inline-flex;width:auto;margin-right:6px}.metric-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.field-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.layout{padding:12px}.page-head{height:auto;align-items:flex-start;flex-direction:column}.metric-grid,.detail-grid,.stat-list{grid-template-columns:1fr}table{min-width:760px}.panel{overflow:auto}}
:root{--nursing-primary:#F56B8A;--nursing-primary-light:#FFF1F5;--nursing-blue:#4DA8FF;--nursing-blue-light:#EEF7FF;--nursing-page:#F6F7F9;--nursing-card:#FFFFFF;--nursing-text:#1F2937;--nursing-muted:#6B7280;--nursing-weak:#BFC5CC;--nursing-border:#E5E7EB}.admin-shell{background:var(--nursing-page)!important;color:var(--nursing-text)!important}.topbar,.sidebar,.panel,.metric-grid article{background:var(--nursing-card)!important;border:0!important;box-shadow:0 8px 24px rgba(31,41,55,.07)!important}.topbar{border-bottom:1px solid var(--nursing-border)!important}.brand>span,.avatar{background:var(--nursing-primary)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.link-btn{color:var(--nursing-primary)!important}.sidebar button.active,.sidebar button:hover,.ok{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.tags span{background:var(--nursing-blue-light)!important;color:var(--nursing-blue)!important}.topbar button,.panel-head button{border-color:var(--nursing-border)!important;background:#fff!important;color:var(--nursing-text)!important}.topbar button:hover,.panel-head button:hover{border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}th{background:#F9FAFB!important;color:var(--nursing-text)!important}th,td{border-bottom-color:var(--nursing-border)!important}td{color:var(--nursing-text)!important}.field-grid p{background:#F9FAFB!important}.warn{background:#FFF1F5!important;color:#F56B8A!important}.info{background:#EEF7FF!important;color:#4DA8FF!important}:root{--nursing-primary:#FF6B9A;--nursing-primary-light:#FFF1F5;--nursing-page:#F5F7FA;--nursing-card:#FFFFFF;--nursing-text:#1F2937;--nursing-muted:#6B7280;--nursing-border:#E5E7EB;--nursing-subtle:#F8FAFC}.admin-shell{background:var(--nursing-page)!important;color:var(--nursing-text)!important}.topbar,.sidebar,.panel,.metric-grid article{background:var(--nursing-card)!important;border:0!important;border-radius:16px!important;box-shadow:0 2px 12px rgba(0,0,0,.04)!important}.topbar{border-radius:0!important}.brand>span,.avatar{background:var(--nursing-primary)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.link-btn{color:var(--nursing-primary)!important}.sidebar button.active,.sidebar button:hover,.ok,.warn{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.tags span{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.info{background:#EEF7FF!important;color:#4DA8FF!important}.topbar button,.panel-head button{background:#fff!important;border:1px solid var(--nursing-border)!important;color:var(--nursing-text)!important;outline:none!important}.topbar button:hover,.panel-head button:hover{border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}th,.field-grid p{background:var(--nursing-subtle)!important;color:var(--nursing-text)!important}th,td{border-bottom-color:var(--nursing-border)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}.filter-tags button{height:28px;padding:0 12px;border:0;border-radius:14px;background:#F8FAFC;color:#6B7280;cursor:pointer}.filter-tags button.active{background:#FFF1F5;color:#FF6B9A;font-weight:700}.compact-fields{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:12px}.primary-admin-btn,.danger-admin-btn{height:36px;padding:0 16px;border-radius:8px;cursor:pointer}.primary-admin-btn{border:1px solid #FF6B9A;background:#FF6B9A;color:#fff}.danger-admin-btn{border:1px solid #FF6B9A;background:#fff;color:#FF6B9A}.danger-admin-btn:disabled{border-color:#E5E7EB;color:#BFC5CC;cursor:not-allowed}.reject-field{display:block;margin:14px 0 10px;color:#374151;font-size:13px}.reject-field textarea{width:100%;margin-top:8px;padding:10px;border:1px solid #E5E7EB;border-radius:8px;resize:none;font-family:inherit;outline:none}
.order-flow-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.lock-tip{margin:10px 0 0;color:#6B7280;font-size:13px}.admin-dialog-mask{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(31,41,55,.35)}.admin-dialog{width:min(460px,calc(100vw - 32px));padding:18px;border-radius:14px;background:#fff;box-shadow:0 18px 48px rgba(31,41,55,.18)}.admin-dialog header,.admin-dialog footer{display:flex;align-items:center;justify-content:space-between;gap:10px}.admin-dialog h2{margin:0;font-size:18px}.admin-dialog header button{width:32px;height:32px;border:0;border-radius:16px;background:#F3F4F6;color:#6B7280;font-size:20px}.admin-dialog label{display:block;margin:16px 0;color:#374151;font-size:14px}.admin-dialog textarea{width:100%;margin-top:8px;padding:10px;border:1px solid #E5E7EB;border-radius:8px;resize:none;font-family:inherit;outline:none}.admin-dialog footer button{height:36px;padding:0 16px;border:1px solid #FF6B9A;border-radius:8px;background:#fff;color:#FF6B9A}.admin-dialog footer button:last-child{background:#FF6B9A;color:#fff}.admin-dialog footer button:disabled{border-color:#E5E7EB;background:#fff;color:#BFC5CC;cursor:not-allowed}
</style>
