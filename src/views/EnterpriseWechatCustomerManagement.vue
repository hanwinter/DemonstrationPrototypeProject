<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, Link, Refresh, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DemoPageNavigation from '../components/DemoPageNavigation.vue'

const router = useRouter()
const systemLogoUrl = `${import.meta.env.BASE_URL}system-logo.png`
const activeTab = ref('links')
const bindVisible = ref(false)
const syncVisible = ref(false)
const syncing = ref(false)
const selectedPatient = ref(null)
const detailPatient = ref(null)

const patients = ref([
  { id: 'P20260731001', name: '张女士', phone: '138****8888', gestation: '孕28周', dueDate: '2026-10-21', risk: '高风险', tags: ['高龄孕妇', '妊娠糖尿病风险'], wechatStatus: '已绑定', wechatName: '张女士', externalUserId: 'wx_customer_10001', bindTime: '2026-07-31 10:00' },
  { id: 'P20260731002', name: '李女士', phone: '139****6666', gestation: '孕16周', dueDate: '2027-01-14', risk: '普通', tags: ['孕中期'], wechatStatus: '待绑定', wechatName: '-', externalUserId: '', bindTime: '' },
  { id: 'P20260731003', name: '王女士', phone: '137****1288', gestation: '孕31周', dueDate: '2026-09-30', risk: '中风险', tags: ['贫血风险', '孕晚期'], wechatStatus: '已绑定', wechatName: '王女士', externalUserId: 'wx_customer_10003', bindTime: '2026-07-29 14:20' },
  { id: 'P20260731004', name: '赵女士', phone: '136****5612', gestation: '孕12周', dueDate: '2027-02-11', risk: '普通', tags: ['早孕建档'], wechatStatus: '待绑定', wechatName: '-', externalUserId: '', bindTime: '' },
  { id: 'P20260731005', name: '陈女士', phone: '135****7390', gestation: '孕24周', dueDate: '2026-11-18', risk: '高风险', tags: ['妊娠高血压风险', '体重管理'], wechatStatus: '已绑定', wechatName: '陈女士', externalUserId: 'wx_customer_10005', bindTime: '2026-07-28 09:16' },
  { id: 'P20260731006', name: '刘女士', phone: '158****0291', gestation: '孕20周', dueDate: '2026-12-17', risk: '普通', tags: ['孕中期', '唐筛待复查'], wechatStatus: '待绑定', wechatName: '-', externalUserId: '', bindTime: '' },
  { id: 'P20260731007', name: '周女士', phone: '150****4508', gestation: '孕35周', dueDate: '2026-09-01', risk: '中风险', tags: ['孕晚期', '胎位随访'], wechatStatus: '已绑定', wechatName: '周女士', externalUserId: 'wx_customer_10007', bindTime: '2026-07-26 16:45' },
  { id: 'P20260731008', name: '吴女士', phone: '188****3320', gestation: '孕18周', dueDate: '2026-12-31', risk: '普通', tags: ['孕中期'], wechatStatus: '绑定异常', wechatName: '-', externalUserId: '', bindTime: '' },
  { id: 'P20260731009', name: '孙女士', phone: '177****9011', gestation: '孕26周', dueDate: '2026-11-04', risk: '高风险', tags: ['双胎妊娠', '营养随访'], wechatStatus: '已绑定', wechatName: '孙女士', externalUserId: 'wx_customer_10009', bindTime: '2026-07-30 11:22' },
  { id: 'P20260731010', name: '胡女士', phone: '186****7728', gestation: '孕22周', dueDate: '2026-12-02', risk: '普通', tags: ['四维超声预约'], wechatStatus: '待绑定', wechatName: '-', externalUserId: '', bindTime: '' },
])

const syncRecords = ref([
  { time: '2026-07-31 10:00', patient: '张女士', type: '标签同步', content: '新增：妊娠糖尿病风险', status: '成功' },
  { time: '2026-07-31 09:12', patient: '王女士', type: '孕周同步', content: '更新：孕31周', status: '成功' },
  { time: '2026-07-30 16:40', patient: '陈女士', type: '风险同步', content: '新增：妊娠高血压风险', status: '成功' },
  { time: '2026-07-30 15:08', patient: '周女士', type: '服务状态', content: '更新：胎位随访', status: '成功' },
])

const stats = computed(() => ({ total: 1280, bound: 856, pending: 424, today: 32 }))
const currentPatient = computed(() => detailPatient.value || patients.value.find((item) => item.wechatStatus === '已绑定') || patients.value[0])
const tagRecords = computed(() => [
  { time: '2026-07-31 10:00', source: '标签同步', original: '新增：妊娠糖尿病风险', wechat: '糖尿病风险', status: '成功' },
  { time: '2026-07-31 09:30', source: '标签同步', original: '高龄孕妇', wechat: '高龄孕妇', status: '成功' },
  { time: '2026-07-31 09:31', source: '孕周同步', original: currentPatient.value.gestation, wechat: '孕中期', status: '成功' },
])

function riskType(risk) {
  if (risk === '高风险') return 'danger'
  if (risk === '中风险') return 'warning'
  return 'success'
}

function wechatStatusType(status) {
  if (status === '已绑定') return 'success'
  if (status === '绑定异常') return 'danger'
  return 'info'
}

function openBind(row) {
  selectedPatient.value = row
  bindVisible.value = true
}

function finishBind() {
  if (!selectedPatient.value) return
  const index = patients.value.findIndex((item) => item.id === selectedPatient.value.id)
  const suffix = String(index + 1).padStart(5, '0')
  patients.value[index] = { ...patients.value[index], wechatStatus: '已绑定', wechatName: patients.value[index].name, externalUserId: `wx_customer_${suffix}`, bindTime: '2026-07-31 10:00' }
  detailPatient.value = patients.value[index]
  bindVisible.value = false
  ElMessage.success('已生成绑定链接并模拟完成绑定')
}

function openDetail(row) {
  if (row.wechatStatus !== '已绑定') {
    openBind(row)
    return
  }
  detailPatient.value = row
  activeTab.value = 'detail'
}

function syncNow() {
  syncing.value = true
  setTimeout(() => {
    syncRecords.value.unshift({ time: '2026-07-31 10:00', patient: '张女士', type: '标签同步', content: '新增：妊娠糖尿病风险', status: '成功' })
    syncing.value = false
    ElMessage.success('同步完成')
  }, 800)
}
</script>

<template>
  <div class="wechat-page app-shell">
    <header class="system-header">
      <div class="brand"><img class="system-logo" :src="systemLogoUrl" alt="孕产妇保健管理系统" /></div>
      <DemoPageNavigation />
      <div class="header-meta">操作员：张医生</div>
    </header>

    <main class="page">
      <section class="page-heading">
        <div class="heading-left">
          <el-button text :icon="ArrowLeft" @click="router.push('/')">返回入口</el-button>
          <span class="heading-divider"></span>
          <el-breadcrumb separator="/"><el-breadcrumb-item>孕产保健系统</el-breadcrumb-item><el-breadcrumb-item>患者企微关联管理</el-breadcrumb-item></el-breadcrumb>
        </div>
        <el-button type="primary" :icon="Refresh" @click="syncVisible = true">查看同步记录</el-button>
      </section>

      <section class="module-title">
        <h1>患者企微关联管理</h1>
        <p>管理孕产患者与企业微信客户绑定关系，实现患者标签及孕产信息同步。</p>
      </section>

      <section class="stats-grid">
        <article><span>患者总数</span><strong>{{ stats.total }}</strong></article>
        <article><span>已绑定企微客户</span><strong>{{ stats.bound }}</strong></article>
        <article><span>待绑定患者</span><strong>{{ stats.pending }}</strong></article>
        <article><span>今日同步</span><strong>{{ stats.today }}</strong></article>
      </section>

      <el-tabs v-model="activeTab" class="work-tabs">
        <el-tab-pane label="患者关联管理" name="links">
          <section class="panel">
            <div class="panel-title"><div><h2>患者企微关联管理</h2><p>该页面属于孕产保健管理系统后台，主体对象为孕产患者。</p></div></div>
            <el-table :data="patients" border stripe height="560">
              <el-table-column prop="name" label="患者姓名" width="110"><template #default="{ row }"><el-button link type="primary" @click="openDetail(row)">{{ row.name }}</el-button></template></el-table-column>
              <el-table-column prop="phone" label="手机号" width="125" />
              <el-table-column prop="gestation" label="孕周" width="95" />
              <el-table-column label="风险等级" width="100"><template #default="{ row }"><el-tag :type="riskType(row.risk)" effect="light">{{ row.risk }}</el-tag></template></el-table-column>
              <el-table-column label="孕产标签" min-width="210"><template #default="{ row }"><el-tag v-for="tag in row.tags" :key="tag" class="tag-item">{{ tag }}</el-tag></template></el-table-column>
              <el-table-column label="企微绑定状态" width="120"><template #default="{ row }"><el-tag :type="wechatStatusType(row.wechatStatus)">{{ row.wechatStatus }}</el-tag></template></el-table-column>
              <el-table-column label="企业微信客户" min-width="150"><template #default="{ row }">{{ row.wechatStatus === '已绑定' ? `企微客户：${row.wechatName}` : '-' }}</template></el-table-column>
              <el-table-column label="操作" width="150" fixed="right"><template #default="{ row }"><el-button v-if="row.wechatStatus !== '已绑定'" type="primary" link @click="openBind(row)">绑定企业微信</el-button><el-button v-else type="primary" link @click="openDetail(row)">查看</el-button></template></el-table-column>
            </el-table>
          </section>
        </el-tab-pane>

        <el-tab-pane label="企业微信绑定入口" name="entry">
          <section class="entry-layout">
            <article class="panel entry-card">
              <div class="panel-title"><div><h2>企业微信绑定入口</h2><p>统一企业微信二维码 + 后置档案绑定方案</p></div><div class="entry-actions"><el-tag type="success">启用</el-tag><el-button type="primary" link @click="router.push('/enterprise-wechat/archive-bind-h5')">立即绑定</el-button></div></div>
              <div class="entry-qr"><div class="qr-grid"></div><span>模拟企业微信客户联系二维码</span></div>
              <div class="entry-meta">
                <div><span>名称</span><strong>孕产服务中心客户入口</strong></div>
                <div><span>绑定员工</span><strong>产科医生团队</strong></div>
                <div><span>状态</span><strong>启用</strong></div>
              </div>
            </article>
            <article class="panel">
              <div class="panel-title"><div><h2>绑定流程</h2><p>患者扫码添加服务人员后，通过 H5 页面完成孕产档案绑定。</p></div><el-icon><Link /></el-icon></div>
              <div class="flow-row"><span>统一二维码</span><i></i><span>添加孕产服务人员</span><i></i><span>H5 档案绑定</span><i></i><span>同步运营数据</span></div>
            </article>
          </section>
        </el-tab-pane>

        <el-tab-pane label="患者企微关联详情" name="detail">
          <section class="detail-layout">
            <article class="panel info-card">
              <div class="card-head"><el-avatar :size="58" :icon="UserFilled" /><div><h2>{{ currentPatient.name }}</h2><p>{{ currentPatient.id }} · {{ currentPatient.phone }}</p></div><el-tag :type="riskType(currentPatient.risk)">{{ currentPatient.risk }}</el-tag></div>
              <div class="section-title">孕产系统患者信息</div>
              <div class="info-grid patient-info">
                <div><span>患者ID</span><strong>{{ currentPatient.id }}</strong></div>
                <div><span>姓名</span><strong>{{ currentPatient.name }}</strong></div>
                <div><span>手机号</span><strong>{{ currentPatient.phone }}</strong></div>
                <div><span>孕周</span><strong>{{ currentPatient.gestation }}</strong></div>
                <div><span>预产期</span><strong>{{ currentPatient.dueDate }}</strong></div>
                <div><span>风险等级</span><strong>{{ currentPatient.risk }}</strong></div>
                <div class="wide"><span>孕产标签</span><el-tag v-for="tag in currentPatient.tags" :key="tag" class="tag-item">{{ tag }}</el-tag></div>
              </div>
              <div class="section-title">企业微信客户信息</div>
              <div class="info-grid">
                <div><span>企业微信客户ID</span><strong>{{ currentPatient.externalUserId }}</strong></div>
                <div><span>客户名称</span><strong>{{ currentPatient.wechatName }}</strong></div>
                <div><span>所属员工</span><strong>产科医生团队</strong></div>
                <div><span>绑定时间</span><strong>{{ currentPatient.bindTime || '2026-07-31 10:00' }}</strong></div>
                <div><span>绑定方式</span><strong>手机号绑定</strong></div>
              </div>
            </article>
            <article class="panel">
              <div class="panel-title"><div><h2>患者标签同步记录</h2><p>孕产患者运营数据同步到企业微信客户标签。</p></div><el-button type="primary" link @click="syncVisible = true">查看同步记录</el-button></div>
              <el-table :data="tagRecords" border>
                <el-table-column prop="time" label="同步时间" width="160" />
                <el-table-column prop="source" label="同步类型" />
                <el-table-column prop="original" label="同步内容" />
                <el-table-column prop="wechat" label="企业微信标签" />
                <el-table-column label="状态"><template #default="{ row }"><el-tag type="success">{{ row.status }}</el-tag></template></el-table-column>
              </el-table>
            </article>
          </section>
        </el-tab-pane>
      </el-tabs>
    </main>

    <el-dialog v-model="bindVisible" title="绑定企业微信客户" width="460px">
      <div v-if="selectedPatient" class="bind-dialog">
        <div class="bind-info"><div><span>姓名：</span><strong>{{ selectedPatient.name }}</strong></div><div><span>患者ID：</span><strong>{{ selectedPatient.id }}</strong></div></div>
        <div class="bind-mode"><span>绑定方式：</span><strong>统一企业微信入口绑定</strong></div>
        <p>请患者扫描医院提供的企业微信二维码，添加孕产服务人员后，通过 H5 页面完成孕产档案绑定。</p>
      </div>
      <template #footer><el-button @click="bindVisible = false">取消</el-button><el-button type="primary" @click="finishBind">生成绑定链接</el-button></template>
    </el-dialog>

    <el-dialog v-model="syncVisible" title="患者标签同步记录" width="760px">
      <el-table :data="syncRecords" border stripe>
        <el-table-column prop="time" label="同步时间" width="170" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="type" label="同步类型" width="120" />
        <el-table-column prop="content" label="同步内容" />
        <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag type="success">{{ row.status }}</el-tag></template></el-table-column>
      </el-table>
      <template #footer><el-button @click="syncVisible = false">关闭</el-button><el-button type="primary" :loading="syncing" @click="syncNow">{{ syncing ? '正在同步...' : '立即同步' }}</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.wechat-page{min-height:100vh;background:#f3f6fb;color:#25324b;font-family:"Microsoft YaHei",Arial,sans-serif}.system-header{height:64px;padding:0 24px;display:flex;align-items:center;background:#1f5d9d}.brand{display:flex;align-items:center;min-width:260px}.system-logo{height:34px}.header-meta{margin-left:auto;color:#fff;font-size:13px}.page{max-width:1280px;margin:0 auto;padding:18px 24px 30px}.page-heading{height:54px;display:flex;align-items:center;justify-content:space-between}.heading-left{display:flex;align-items:center;gap:12px}.heading-divider{width:1px;height:18px;background:#d8dee8}.module-title{margin:4px 0 14px}.module-title h1{margin:0;color:#1f2f46;font-size:24px}.module-title p{margin:8px 0 0;color:#66758b}.work-tabs :deep(.el-tabs__header){margin-bottom:14px}.panel{padding:18px;border:1px solid #e1e7f0;border-radius:8px;background:#fff;box-shadow:0 8px 22px rgba(42,71,106,.06)}.panel-title{margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:14px}.panel-title h2,.info-card h2{margin:0;color:#1f2f46;font-size:18px}.panel-title p,.card-head p{margin:5px 0 0;color:#778397;font-size:13px}.tag-item{margin:2px 5px 2px 0}.stats-grid{margin-bottom:14px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.stats-grid article{padding:18px;border:1px solid #e1e7f0;border-radius:8px;background:#fff}.stats-grid span,.info-grid span,.entry-meta span{display:block;margin-bottom:8px;color:#78869a;font-size:13px}.stats-grid strong{font-size:28px;color:#1d4f91}.detail-layout,.entry-layout{display:grid;gap:14px}.card-head{display:flex;align-items:center;gap:14px}.card-head .el-tag{margin-left:auto}.section-title{margin:18px 0 10px;color:#24344d;font-weight:700}.info-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.info-grid .wide{grid-column:span 2}.info-grid div{padding:14px;border:1px solid #e8edf4;border-radius:8px;background:#fbfcfe}.info-grid strong,.entry-meta strong{color:#26364f}.entry-actions{display:flex;align-items:center;gap:10px}.entry-card{text-align:center}.entry-qr{width:210px;height:210px;margin:0 auto 14px;padding:14px;display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px dashed #91b4dc;border-radius:8px;background:#f8fbff}.qr-grid{width:132px;height:132px;margin-bottom:10px;background:linear-gradient(90deg,#17233c 10px,transparent 10px) 0 0/22px 22px,linear-gradient(#17233c 10px,transparent 10px) 0 0/22px 22px,#fff}.entry-qr span{font-size:12px;color:#53657c}.entry-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;text-align:left}.entry-meta div{padding:12px;border:1px solid #e8edf4;border-radius:8px;background:#fbfcfe}.flow-row{display:flex;align-items:center;gap:12px}.flow-row span{padding:12px 16px;border:1px solid #dce7f5;border-radius:8px;background:#f7fbff}.flow-row i{width:28px;height:1px;background:#9bb7d8}.bind-dialog{text-align:center}.bind-info{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px;text-align:left}.bind-info div{padding:12px;border-radius:8px;background:#f6f8fb}.bind-mode{margin:0 0 14px;padding:12px;border-radius:8px;background:#eef6ff;text-align:left}.bind-dialog p{margin:0;color:#53657c;line-height:1.8}@media(max-width:900px){.system-header{padding:0 14px}.brand{min-width:180px}.header-meta,.demo-navigation{display:none}.page{padding:12px}.page-heading{height:auto;align-items:flex-start;gap:12px;flex-direction:column}.stats-grid,.info-grid,.entry-meta{grid-template-columns:1fr}.info-grid .wide{grid-column:auto}.flow-row{align-items:stretch;flex-direction:column}.flow-row i{display:none}.panel{padding:14px}}
</style>


