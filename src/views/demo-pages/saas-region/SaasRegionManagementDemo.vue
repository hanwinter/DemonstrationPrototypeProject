<script setup>
import { computed, reactive, ref } from 'vue'
import LegacyTable from '../../../components/demo-common/LegacyTable.vue'

const deployMode = ref('区域SaaS部署')
const activeLevel = ref('省级')
const viewMode = ref('overview')
const savedTip = ref(false)
const selectedOrgId = ref('zj')
const orgForm = reactive({ name: '', type: '医疗机构', area: '', parent: '', contact: '', phone: '', dataScope: '本机构', status: '启用' })

const metrics = [
  ['组织数量', '36个'],
  ['医疗机构', '128家'],
  ['管理用户', '562人'],
  ['区域数据空间', '12个'],
]
const levelTabs = ['省级', '市级', '区县', '医疗机构']
const orgs = [
  { id: 'zj', name: '浙江省卫生健康委员会', level: '省级', area: '浙江省', scope: '全省', children: 36, users: 18, status: '启用', parent: '--', contact: '王主任', phone: '0571-88000001' },
  { id: 'hz', name: '杭州市卫生健康委员会', level: '市级', area: '杭州市', scope: '本市及下属区县', children: 18, users: 32, status: '启用', parent: '浙江省卫生健康委员会', contact: '李主任', phone: '0571-88000002' },
  { id: 'nb', name: '宁波市卫生健康委员会', level: '市级', area: '宁波市', scope: '本市及下属区县', children: 12, users: 21, status: '启用', parent: '浙江省卫生健康委员会', contact: '周主任', phone: '0574-88000003' },
  { id: 'xh', name: '杭州市西湖区', level: '区县', area: '杭州市西湖区', scope: '本区域学校及医疗机构', children: 8, users: 26, status: '启用', parent: '杭州市卫生健康委员会', contact: '陈老师', phone: '0571-88000004' },
  { id: 'gs', name: '杭州市拱墅区', level: '区县', area: '杭州市拱墅区', scope: '本区域学校及医疗机构', children: 6, users: 20, status: '启用', parent: '杭州市卫生健康委员会', contact: '赵老师', phone: '0571-88000005' },
  { id: 'xhfy', name: '西湖区妇幼保健院', level: '医疗机构', area: '杭州市西湖区', scope: '本机构', children: 0, users: 26, status: '启用', parent: '杭州市西湖区', contact: '张医生', phone: '0571-88000006' },
  { id: 'hzyy', name: '杭州市第一人民医院', level: '医疗机构', area: '杭州市', scope: '本机构', children: 0, users: 34, status: '启用', parent: '杭州市卫生健康委员会', contact: '许医生', phone: '0571-88000007' },
  { id: 'gsyy', name: '拱墅区人民医院', level: '医疗机构', area: '杭州市拱墅区', scope: '本机构', children: 0, users: 18, status: '停用', parent: '杭州市拱墅区', contact: '刘医生', phone: '0571-88000008' },
  { id: 'hsfy', name: '海曙区妇幼保健院', level: '医疗机构', area: '宁波市海曙区', scope: '本机构', children: 0, users: 16, status: '启用', parent: '宁波市卫生健康委员会', contact: '马医生', phone: '0574-88000009' },
]
const roleModels = [
  ['省级管理员', ['区域配置', '机构管理', '数据监管', '统计分析']],
  ['市级管理员', ['本市机构管理', '区县协调', '统计分析']],
  ['区县管理员', ['学校管理', '医疗机构协同', '筛查监管']],
  ['医疗机构管理员', ['本机构筛查管理', '数据录入', '随访管理']],
  ['医护人员', ['学生筛查', '结果录入', '报告查看']],
]
const institutionColumns = [
  { key: 'index', label: '序号', width: 54 },
  { key: 'name', label: '机构名称', width: 170 },
  { key: 'level', label: '机构级别', width: 90 },
  { key: 'area', label: '所属区域', width: 130 },
  { key: 'contact', label: '机构管理员', width: 90 },
  { key: 'scope', label: '数据范围', width: 110 },
  { key: 'users', label: '用户数量', width: 80 },
  { key: 'status', label: '状态', width: 70 },
  { key: 'actions', label: '操作', width: 130, type: 'actions' },
]
const selectedOrg = computed(() => orgs.find((item) => item.id === selectedOrgId.value) || orgs[0])
const institutionRows = computed(() => orgs.filter((item) => item.level === '医疗机构').map((item, index) => ({ ...item, index: index + 1 })))

function selectOrg(id) {
  selectedOrgId.value = id
  viewMode.value = 'overview'
}
function startAdd() {
  Object.assign(orgForm, { name: '', type: '医疗机构', area: '', parent: selectedOrg.value.name, contact: '', phone: '', dataScope: '本机构', status: '启用' })
  viewMode.value = 'form'
}
function editOrg(org = selectedOrg.value) {
  Object.assign(orgForm, { name: org.name, type: org.level === '医疗机构' ? '医疗机构' : `${org.level}管理机构`, area: org.area, parent: org.parent, contact: org.contact, phone: org.phone, dataScope: org.scope, status: org.status })
  selectedOrgId.value = org.id
  viewMode.value = 'form'
}
function saveConfig() {
  if (viewMode === 'form') viewMode.value = 'overview'
  savedTip.value = true
  window.setTimeout(() => { savedTip.value = false }, 1600)
}
function toggleOrg(org) {
  org.status = org.status === '启用' ? '停用' : '启用'
}
</script>

<template>
  <div class="saas-page">
    <div class="breadcrumb">单页面演示 &gt; SaaS部署与区域协同管理</div>
    <section class="deploy-bar">
      <div class="deploy-mode"><strong>部署模式：</strong><label><input v-model="deployMode" type="radio" value="独立部署" />独立部署</label><label><input v-model="deployMode" type="radio" value="区域SaaS部署" />区域SaaS部署</label><span>当前运行模式：{{ deployMode }}</span></div>
      <p>{{ deployMode === '区域SaaS部署' ? '支持省、市、区县、医疗机构多级组织统一管理。' : '系统独立运行，适用于单机构建设模式。' }}</p>
    </section>
    <section class="metric-row"><article v-for="item in metrics" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></article></section>
    <section class="main-grid">
      <div class="org-panel">
        <header><strong>区域层级视图</strong><button type="button" @click="startAdd">新增组织</button></header>
        <div class="level-tabs"><button v-for="item in levelTabs" :key="item" :class="{ active: activeLevel === item }" type="button" @click="activeLevel = item">{{ item }}</button></div>
        <div class="org-tree">
          <button :class="{ active: selectedOrgId === 'zj' }" @click="selectOrg('zj')">浙江省</button>
          <button class="l1" :class="{ active: selectedOrgId === 'hz' }" @click="selectOrg('hz')">杭州市</button>
          <button class="l2" :class="{ active: selectedOrgId === 'xh' }" @click="selectOrg('xh')">西湖区</button>
          <button class="l3" :class="{ active: selectedOrgId === 'xhfy' }" @click="selectOrg('xhfy')">西湖区妇幼保健院</button>
          <button class="l3" :class="{ active: selectedOrgId === 'hzyy' }" @click="selectOrg('hzyy')">杭州市第一人民医院</button>
          <button class="l2" :class="{ active: selectedOrgId === 'gs' }" @click="selectOrg('gs')">拱墅区</button>
          <button class="l3" :class="{ active: selectedOrgId === 'gsyy' }" @click="selectOrg('gsyy')">拱墅区人民医院</button>
          <button class="l1" :class="{ active: selectedOrgId === 'nb' }" @click="selectOrg('nb')">宁波市</button>
          <button class="l2">海曙区</button>
          <button class="l3" :class="{ active: selectedOrgId === 'hsfy' }" @click="selectOrg('hsfy')">海曙区妇幼保健院</button>
        </div>
      </div>
      <div class="detail-panel">
        <template v-if="viewMode === 'overview'">
          <header><strong>组织详情</strong><button type="button" @click="editOrg()">修改组织信息</button></header>
          <div class="info-grid">
            <span>机构名称：<b>{{ selectedOrg.name }}</b></span><span>机构级别：{{ selectedOrg.level }}</span><span>所属区域：{{ selectedOrg.area }}</span><span>数据范围：{{ selectedOrg.scope }}</span><span>下级机构：{{ selectedOrg.children }}</span><span>管理用户：{{ selectedOrg.users }}</span><span>状态：<em :class="{ off: selectedOrg.status === '停用' }">{{ selectedOrg.status }}</em></span>
          </div>
          <section class="sub-grid">
            <div><h3>分级授权管理</h3><article v-for="role in roleModels" :key="role[0]"><strong>{{ role[0] }}</strong><p><span v-for="p in role[1]" :key="p">✓ {{ p }}</span></p></article></div>
            <div><h3>数据隔离策略</h3><p>✓ 按组织机构隔离</p><p>✓ 按区域隔离</p><p>✓ 按权限范围隔离</p><dl><dt>当前机构：</dt><dd>{{ selectedOrg.name }}</dd><dt>可访问数据：</dt><dd>{{ selectedOrg.scope }}数据</dd><dt>禁止访问：</dt><dd>其他区县机构数据</dd></dl></div>
          </section>
        </template>
        <template v-else>
          <header><strong>组织配置页</strong><div><button class="primary-btn" type="button" @click="saveConfig">保存配置</button><button type="button" @click="viewMode = 'overview'">返回</button></div></header>
          <div class="form-grid">
            <label><span>机构名称</span><input v-model="orgForm.name" /></label>
            <label><span>机构类型</span><select v-model="orgForm.type"><option>省级管理机构</option><option>市级管理机构</option><option>区县管理机构</option><option>医疗机构</option><option>学校</option></select></label>
            <label><span>行政区域</span><input v-model="orgForm.area" /></label>
            <label><span>上级机构</span><input v-model="orgForm.parent" /></label>
            <label><span>联系人</span><input v-model="orgForm.contact" /></label>
            <label><span>联系电话</span><input v-model="orgForm.phone" /></label>
            <label class="wide"><span>管理范围</span><div><label><input v-model="orgForm.dataScope" type="radio" value="本机构" />本机构</label><label><input v-model="orgForm.dataScope" type="radio" value="下属机构" />下属机构</label><label><input v-model="orgForm.dataScope" type="radio" value="全区域" />全区域</label></div></label>
            <label><span>状态</span><select v-model="orgForm.status"><option>启用</option><option>停用</option></select></label>
          </div>
        </template>
      </div>
    </section>
    <section class="institution-list">
      <header>医疗机构列表</header>
      <LegacyTable :rows="institutionRows" :columns="institutionColumns">
        <template #status="{ value }"><em :class="{ off: value === '停用' }">{{ value }}</em></template>
        <template #actions="{ row }"><button class="link-btn" type="button" @click="selectOrg(row.id)">详情</button><button class="link-btn" type="button" @click="editOrg(row)">编辑</button><button class="link-btn danger" type="button" @click="toggleOrg(row)">{{ row.status === '启用' ? '停用' : '启用' }}</button></template>
      </LegacyTable>
    </section>
    <div v-if="savedTip" class="save-tip">保存成功</div>
  </div>
</template>

<style scoped>
.saas-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.deploy-bar{height:70px;padding:8px 10px;border:1px solid #d8d8d8;border-top:0;background:#f7f9fb;font-size:12px}.deploy-mode{display:flex;align-items:center;gap:18px}.deploy-mode label{display:flex;align-items:center;gap:4px}.deploy-mode span{margin-left:auto;color:#244b70}.deploy-bar p{margin:8px 0 0;color:#666}.metric-row{height:72px;margin-top:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.metric-row article{padding:10px;border:1px solid #d8d8d8;background:#fff}.metric-row span{display:block;color:#666;font-size:12px}.metric-row strong{display:block;margin-top:6px;font-size:20px;color:#244b70}.main-grid{min-height:0;flex:1;margin-top:8px;display:grid;grid-template-columns:330px minmax(0,1fr);gap:8px}.org-panel,.detail-panel,.institution-list{min-height:0;border:1px solid #d8d8d8;background:#fff}.org-panel,.detail-panel{display:flex;flex-direction:column;overflow:hidden}.org-panel header,.detail-panel header,.institution-list header{height:34px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.level-tabs{height:34px;padding:4px 6px;display:flex;gap:4px;border-bottom:1px solid #d8d8d8}.level-tabs button.active{background:#dceafa;color:#244b70}.org-tree{padding:8px;overflow:auto;font-size:12px}.org-tree button{width:100%;height:28px;margin-bottom:3px;text-align:left;border:0;background:transparent}.org-tree button.active{background:#eef5fc;box-shadow:inset 2px 0 0 #5f8db8}.org-tree .l1{padding-left:24px}.org-tree .l2{padding-left:48px}.org-tree .l3{padding-left:72px}.info-grid{padding:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px 14px;border-bottom:1px solid #d8d8d8;font-size:12px}.info-grid b{font-weight:600}.sub-grid{min-height:0;flex:1;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;overflow:auto}.sub-grid>div{border:1px solid #d8d8d8;background:#fafafa}.sub-grid h3{height:30px;margin:0;padding:0 8px;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;font-size:12px}.sub-grid article{padding:8px;border-bottom:1px solid #e6e8eb;font-size:12px}.sub-grid p{margin:6px 8px;color:#555;font-size:12px}.sub-grid span{display:inline-block;margin:3px 10px 3px 0}.sub-grid dl{display:grid;grid-template-columns:80px 1fr;gap:6px 4px;margin:8px;font-size:12px}.form-grid{padding:12px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px 18px;font-size:12px}.form-grid label{display:grid;grid-template-columns:80px minmax(0,1fr);align-items:center;gap:6px}.form-grid span{text-align:right}.form-grid input,.form-grid select{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;font-size:12px}.form-grid .wide{grid-column:1/-1}.form-grid .wide div{display:flex;gap:18px}.form-grid .wide label{display:flex;gap:4px}.institution-list{height:190px;margin-top:8px;display:flex;flex-direction:column}.institution-list :deep(.legacy-table-wrap){height:155px;min-height:0}.institution-list :deep(.legacy-table){min-width:930px}.link-btn{padding:0 5px;border:0;background:transparent;color:#2d6fba}.link-btn.danger{color:#b3261e}em{height:20px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #b8d8c4;border-radius:2px;background:#eef8f1;color:#34724a;font-size:12px;font-style:normal}em.off{border-color:#d8d8d8;background:#f1f1f1;color:#777}.save-tip{position:fixed;top:82px;left:50%;z-index:80;transform:translateX(-50%);height:30px;padding:0 18px;display:flex;align-items:center;border:1px solid #9fb7cf;background:#eef6ff;color:#244b70;font-size:12px}
</style>
