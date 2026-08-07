<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('dashboard')
const detailVisible = ref(false)

const company = 'XX母婴服务中心'
const menus = [
  { key: 'dashboard', label: '首页驾驶舱' },
  { key: 'orders', label: '服务订单管理' },
  { key: 'process', label: '服务过程管理' },
  { key: 'exceptions', label: '异常管理' },
  { key: 'staff', label: '服务人员管理' },
  { key: 'customers', label: '客户管理' },
  { key: 'config', label: '服务配置' },
  { key: 'stats', label: '数据统计' },
]
const orders = [
  { no: 'JS20260701001', customer: '王女士', type: '月嫂服务', period: '2026-07-01 ~ 2026-09-30', staff: '张洪霞', status: '服务中' },
  { no: 'JS20260705002', customer: '陈女士', type: '育儿嫂', period: '2026-07-05 ~ 2026-08-31', staff: '刘春梅', status: '服务中' },
  { no: 'JS20260618003', customer: '赵女士', type: '月嫂服务', period: '2026-06-18 ~ 2026-07-18', staff: '周仁莲', status: '已完成' },
]
const serviceRows = [
  { staff: '张洪霞', customer: '王女士', start: '08:30', end: '未打卡', log: '已提交', exception: '正常' },
  { staff: '刘春梅', customer: '陈女士', start: '未打卡', end: '未打卡', log: '未提交', exception: '打卡异常' },
  { staff: '周仁莲', customer: '赵女士', start: '08:10', end: '18:02', log: '已提交', exception: '宝宝异常' },
]
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
const currentOrder = computed(() => orders[0])
const pageTitle = computed(() => menus.find((item) => item.key === activeMenu.value)?.label || '家政服务管理后台')

function switchMenu(key) {
  activeMenu.value = key
  detailVisible.value = false
}
function openOrderDetail() {
  detailVisible.value = true
}
function statusClass(status) {
  if (['正常', '已提交', '已完成', '已处理', '启用', '服务中'].includes(status)) return 'ok'
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
          <section v-if="!detailVisible" class="panel"><div class="panel-head"><h2>服务订单列表</h2><button type="button">新增订单</button></div><table><thead><tr><th>订单编号</th><th>客户姓名</th><th>服务类型</th><th>服务周期</th><th>当前服务人员</th><th>订单状态</th><th>操作</th></tr></thead><tbody><tr v-for="row in orders" :key="row.no"><td>{{ row.no }}</td><td>{{ row.customer }}</td><td>{{ row.type }}</td><td>{{ row.period }}</td><td>{{ row.staff }}</td><td><em :class="statusClass(row.status)">{{ row.status }}</em></td><td><button class="link-btn" type="button" @click="openOrderDetail">详情</button></td></tr></tbody></table></section>
          <section v-else class="detail-grid">
            <article class="panel wide"><div class="panel-head"><h2>订单详情</h2><button type="button" @click="detailVisible = false">返回列表</button></div><div class="field-grid"><p><span>订单编号</span><strong>{{ currentOrder.no }}</strong></p><p><span>合同信息</span><strong>住家月嫂服务合同</strong></p><p><span>服务周期</span><strong>{{ currentOrder.period }}</strong></p><p><span>订单状态</span><strong>{{ currentOrder.status }}</strong></p></div></article>
            <article class="panel"><h2>客户信息</h2><p>王女士，13900001111，北京市朝阳区。</p></article>
            <article class="panel"><h2>宝宝信息</h2><p>宝宝出生13天，当前体温与喂养记录正常。</p></article>
            <article class="panel"><h2>当前服务人员</h2><p>张洪霞，母婴护理师，当前负责本订单。</p></article>
            <article class="panel"><h2>历史服务人员</h2><p>2026-07-01 至 2026-07-03：李秀兰。更换月嫂不影响订单历史记录。</p></article>
            <article class="panel"><h2>每日服务记录</h2><p>最近7天记录已归档，今日记录已提交。</p></article>
            <article class="panel"><h2>异常记录</h2><p>宝宝体温异常 1 条，已提醒运营跟进。</p></article>
            <article class="panel"><h2>评价记录</h2><p>客户阶段评价：服务细致，响应及时。</p></article>
          </section>
        </template>

        <template v-else-if="activeMenu === 'process'">
          <section class="panel"><div class="panel-head"><h2>今日服务监控</h2></div><table><thead><tr><th>月嫂</th><th>客户</th><th>开始时间</th><th>结束时间</th><th>日志状态</th><th>异常状态</th><th>操作</th></tr></thead><tbody><tr v-for="row in serviceRows" :key="row.staff"><td>{{ row.staff }}</td><td>{{ row.customer }}</td><td>{{ row.start }}</td><td>{{ row.end }}</td><td><em :class="statusClass(row.log)">{{ row.log }}</em></td><td><em :class="statusClass(row.exception)">{{ row.exception }}</em></td><td><button class="link-btn" type="button">查看日志</button><button class="link-btn" type="button">提醒填写</button><button class="link-btn" type="button">提醒打卡</button></td></tr></tbody></table></section>
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
:root{--nursing-primary:#F56B8A;--nursing-primary-light:#FFF1F5;--nursing-blue:#4DA8FF;--nursing-blue-light:#EEF7FF;--nursing-page:#F6F7F9;--nursing-card:#FFFFFF;--nursing-text:#1F2937;--nursing-muted:#6B7280;--nursing-weak:#BFC5CC;--nursing-border:#E5E7EB}.admin-shell{background:var(--nursing-page)!important;color:var(--nursing-text)!important}.topbar,.sidebar,.panel,.metric-grid article{background:var(--nursing-card)!important;border:0!important;box-shadow:0 8px 24px rgba(31,41,55,.07)!important}.topbar{border-bottom:1px solid var(--nursing-border)!important}.brand>span,.avatar{background:var(--nursing-primary)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.link-btn{color:var(--nursing-primary)!important}.sidebar button.active,.sidebar button:hover,.ok{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.tags span{background:var(--nursing-blue-light)!important;color:var(--nursing-blue)!important}.topbar button,.panel-head button{border-color:var(--nursing-border)!important;background:#fff!important;color:var(--nursing-text)!important}.topbar button:hover,.panel-head button:hover{border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}th{background:#F9FAFB!important;color:var(--nursing-text)!important}th,td{border-bottom-color:var(--nursing-border)!important}td{color:var(--nursing-text)!important}.field-grid p{background:#F9FAFB!important}.warn{background:#FFF1F5!important;color:#F56B8A!important}.info{background:#EEF7FF!important;color:#4DA8FF!important}:root{--nursing-primary:#FF6B9A;--nursing-primary-light:#FFF1F5;--nursing-page:#F5F7FA;--nursing-card:#FFFFFF;--nursing-text:#1F2937;--nursing-muted:#6B7280;--nursing-border:#E5E7EB;--nursing-subtle:#F8FAFC}.admin-shell{background:var(--nursing-page)!important;color:var(--nursing-text)!important}.topbar,.sidebar,.panel,.metric-grid article{background:var(--nursing-card)!important;border:0!important;border-radius:16px!important;box-shadow:0 2px 12px rgba(0,0,0,.04)!important}.topbar{border-radius:0!important}.brand>span,.avatar{background:var(--nursing-primary)!important}.side-title,.sidebar button.active,.sidebar button:hover,.metric-grid strong,.link-btn{color:var(--nursing-primary)!important}.sidebar button.active,.sidebar button:hover,.ok,.warn{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.tags span{background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}.info{background:#EEF7FF!important;color:#4DA8FF!important}.topbar button,.panel-head button{background:#fff!important;border:1px solid var(--nursing-border)!important;color:var(--nursing-text)!important;outline:none!important}.topbar button:hover,.panel-head button:hover{border-color:var(--nursing-primary)!important;background:var(--nursing-primary-light)!important;color:var(--nursing-primary)!important}th,.field-grid p{background:var(--nursing-subtle)!important;color:var(--nursing-text)!important}th,td{border-bottom-color:var(--nursing-border)!important}.brand small,.page-head span,.metric-grid span,.field-grid span{color:var(--nursing-muted)!important}</style>
