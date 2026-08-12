<script setup>
import { computed, reactive, ref } from 'vue'
import LegacyFormSection from '../../../components/demo-common/LegacyFormSection.vue'

const emptyPlan = () => ({
  id: `plan-${Date.now()}`,
  name: '',
  business: '五健筛查',
  target: '五健体检阳性人群',
  status: '启用',
  triggerType: '立即执行',
  executeTime: '2026-05-14 16:12',
  triggerEvent: '总检完成',
  delayValue: 1,
  delayUnit: '天',
  channels: ['短信', '微信'],
  smsTemplate: '阳性随访提醒模板',
  smsContent: '${name}家长您好！五健异常指标跟踪随访：请留意孩子近期异常指标变化，按时带孩子复查。如有指标波动或疑问，可随时联系我们。联系电话：${phone}',
  wechatTemplate: '微信随访提醒模板',
  wechatContent: '{{name.DATA}}家长您好~\n请关注孩子近期健康变化。\n如有异常请及时复查。\n点击下方查看健康指导。',
  jumpPage: '健康指导详情',
  phoneVar: '{{phone.DATA}}',
  taskTotal: 0,
  running: 0,
  completed: 0,
  failed: 0,
  lastRun: '--',
})

const plans = ref([
  { ...emptyPlan(), id: 'p1', name: '推荐记录', triggerType: '立即执行', channels: ['短信', '微信'], taskTotal: 523, running: 12, completed: 486, failed: 5, lastRun: '2026-05-14 16:12' },
  { ...emptyPlan(), id: 'p2', name: '（通用）居家护理随访', triggerType: '指定时间', channels: ['短信', '微信'], taskTotal: 0 },
  { ...emptyPlan(), id: 'p3', name: '口腔异常跟踪随访', triggerType: '指定时间', channels: ['短信'], smsContent: '${name}家长您好！孩子本次筛查存在口腔异常指标，建议近期关注牙齿情况，并按建议时间复查。如有不适或疑问，请及时联系医护人员。联系电话：${phone}', taskTotal: 0 },
  { ...emptyPlan(), id: 'p4', name: '骨骼异常跟踪随访', triggerType: '业务事件触发', channels: ['短信'], taskTotal: 18, running: 2, completed: 15, failed: 1, lastRun: '2026-06-02 09:30' },
  { ...emptyPlan(), id: 'p5', name: '心理异常跟踪随访', triggerType: '业务事件触发', channels: ['短信', '微信'], smsContent: '${name}家长您好！请持续关注孩子近期情绪和行为变化，保持良好沟通。如出现明显异常，请及时与专业人员联系。联系电话：${phone}', taskTotal: 37, running: 3, completed: 34, failed: 0, lastRun: '2026-06-10 10:15' },
  { ...emptyPlan(), id: 'p6', name: '视力异常跟踪随访', triggerType: '指定时间', channels: ['微信'], smsContent: '${name}家长您好！孩子近期视力指标需要持续关注，请注意用眼时间和用眼姿势，并按时复查。如视力下降明显，请及时就诊。联系电话：${phone}', taskTotal: 81, running: 6, completed: 73, failed: 2, lastRun: '2026-06-18 14:00' },
  { ...emptyPlan(), id: 'p7', name: '体重异常跟踪随访', triggerType: '业务事件触发', channels: ['短信'], smsContent: '${name}家长您好！孩子目前体重指标需要持续关注，建议合理安排饮食和运动，并定期监测体重变化。联系电话：${phone}', taskTotal: 64, running: 5, completed: 58, failed: 1, lastRun: '2026-06-20 08:45' },
  { ...emptyPlan(), id: 'p8', name: '心理居家护理随访', triggerType: '指定时间', channels: ['短信', '微信'], taskTotal: 0 },
  { ...emptyPlan(), id: 'p9', name: '骨骼居家护理随访', triggerType: '指定时间', channels: ['短信'], taskTotal: 0 },
  { ...emptyPlan(), id: 'p10', name: '体重居家护理随访', triggerType: '指定时间', channels: ['短信', '微信'], taskTotal: 0 },
  { ...emptyPlan(), id: 'p11', name: '营养指导随访', triggerType: '业务事件触发', channels: ['微信'], status: '停用', taskTotal: 12, completed: 12, lastRun: '2026-05-30 15:20' },
  { ...emptyPlan(), id: 'p12', name: '复筛到期提醒', triggerType: '业务事件触发', channels: ['短信', '站内消息'], status: '启用', taskTotal: 146, running: 9, completed: 132, failed: 5, lastRun: '2026-06-28 11:00' },
])

const query = reactive({ name: '', status: '' })
const appliedQuery = ref({ name: '', status: '' })
const activeId = ref('p1')
const editing = ref(false)
const adding = ref(false)
const deleteVisible = ref(false)
const savedTip = ref(false)
const form = reactive({ ...plans.value[0] })

const visiblePlans = computed(() => plans.value.filter((item) => (!appliedQuery.value.name || item.name.includes(appliedQuery.value.name)) && (!appliedQuery.value.status || item.status === appliedQuery.value.status)))
const activePlan = computed(() => plans.value.find((item) => item.id === activeId.value))
const isReadonly = computed(() => !editing.value && !adding.value)
const previewText = computed(() => form.smsContent.replaceAll('${name}', '顾禾雨').replaceAll('${phone}', '0571-88000000').replaceAll('${disease}', '视力异常'))

function loadPlan(plan) {
  activeId.value = plan.id
  Object.assign(form, plan)
  editing.value = false
  adding.value = false
}

function search() {
  appliedQuery.value = { ...query }
  if (!visiblePlans.value.find((item) => item.id === activeId.value) && visiblePlans.value[0]) loadPlan(visiblePlans.value[0])
}

function resetSearch() {
  Object.assign(query, { name: '', status: '' })
  search()
}

function startAdd() {
  adding.value = true
  editing.value = true
  activeId.value = ''
  Object.assign(form, emptyPlan(), { name: '新增随访方案' })
}

function savePlan() {
  if (adding.value) {
    plans.value.unshift({ ...form, id: `plan-${Date.now()}` })
    activeId.value = plans.value[0].id
  } else if (activePlan.value) Object.assign(activePlan.value, form)
  adding.value = false
  editing.value = false
  savedTip.value = true
  window.setTimeout(() => { savedTip.value = false }, 1600)
}

function cancelEdit() {
  if (activePlan.value) loadPlan(activePlan.value)
  else loadPlan(plans.value[0])
}

function toggleStatus() {
  form.status = form.status === '启用' ? '停用' : '启用'
  if (activePlan.value) activePlan.value.status = form.status
}

function confirmDelete() {
  if (form.taskTotal > 0) return
  plans.value = plans.value.filter((item) => item.id !== form.id)
  deleteVisible.value = false
  loadPlan(plans.value[0])
}

function insertVar(variable) {
  form.smsContent += variable
}
</script>

<template>
  <div class="followup-page">
    <div class="page-head">
      <div class="breadcrumb">单页面演示 &gt; 随访方案</div>
      <button class="primary-btn" type="button" @click="startAdd">新增方案</button>
    </div>
    <section class="master-detail">
      <aside class="plan-list">
        <div class="side-search">
          <label><span>方案名称</span><input v-model="query.name" /></label>
          <label><span>状态</span><select v-model="query.status"><option value="">全部</option><option>启用</option><option>停用</option></select></label>
          <div><button class="primary-btn" type="button" @click="search">查询</button><button type="button" @click="resetSearch">重置</button></div>
        </div>
        <div class="plans-scroll">
          <button v-for="plan in visiblePlans" :key="plan.id" class="plan-item" :class="{ active: activeId === plan.id }" type="button" @click="loadPlan(plan)">
            <strong>{{ plan.name }}<em :class="{ off: plan.status === '停用' }">{{ plan.status }}</em></strong>
            <span>{{ plan.target }}</span>
            <span>{{ plan.triggerType }} · {{ plan.channels.join('/') }}</span>
            <span>任务 {{ plan.taskTotal }}</span>
          </button>
        </div>
      </aside>
      <section class="detail-area">
        <div class="detail-toolbar">
          <strong>{{ adding ? '新增随访方案' : form.name }}</strong>
          <div v-if="!editing && !adding"><button type="button" @click="editing = true">编辑</button><button type="button" @click="toggleStatus">{{ form.status === '启用' ? '停用方案' : '启用方案' }}</button><button class="danger-btn" type="button" @click="deleteVisible = true">删除</button></div>
          <div v-else><button class="primary-btn" type="button" @click="savePlan">保存</button><button type="button" @click="cancelEdit">取消</button></div>
        </div>
        <div class="detail-scroll">
          <LegacyFormSection title="基础信息">
            <div class="form-grid">
              <label><span>方案名称</span><input v-model="form.name" :readonly="isReadonly" /></label>
              <label><span>所属业务</span><select v-model="form.business" :disabled="isReadonly"><option>五健筛查</option></select></label>
              <label><span>随访对象</span><select v-model="form.target" :disabled="isReadonly"><option>五健体检阳性人群</option></select></label>
              <label><span>启用状态</span><div class="radio-line"><label><input v-model="form.status" type="radio" value="启用" :disabled="isReadonly" />启用</label><label><input v-model="form.status" type="radio" value="停用" :disabled="isReadonly" />停用</label></div></label>
            </div>
          </LegacyFormSection>
          <LegacyFormSection title="执行规则">
            <div class="rule-box">
              <label><input v-model="form.triggerType" type="radio" value="立即执行" :disabled="isReadonly" />立即执行</label>
              <label><input v-model="form.triggerType" type="radio" value="指定时间" :disabled="isReadonly" />指定时间</label>
              <label><input v-model="form.triggerType" type="radio" value="业务事件触发" :disabled="isReadonly" />业务事件触发</label>
            </div>
            <div v-if="form.triggerType === '指定时间'" class="form-grid compact"><label><span>执行时间</span><input v-model="form.executeTime" :readonly="isReadonly" /></label></div>
            <div v-if="form.triggerType === '业务事件触发'" class="form-grid compact"><label><span>触发事件</span><select v-model="form.triggerEvent" :disabled="isReadonly"><option>总检完成</option><option>阳性结果生成</option><option>复筛完成</option><option>随访到期</option><option>报告生成</option></select></label><label><span>延迟时间</span><input v-model="form.delayValue" :readonly="isReadonly" /><select v-model="form.delayUnit" :disabled="isReadonly"><option>天</option><option>小时</option></select></label></div>
          </LegacyFormSection>
          <LegacyFormSection title="随访渠道">
            <div class="channel-line"><label v-for="item in ['短信','微信','站内消息']" :key="item"><input v-model="form.channels" type="checkbox" :value="item" :disabled="isReadonly" />{{ item }}</label></div>
          </LegacyFormSection>
          <LegacyFormSection title="消息内容">
            <div class="message-layout">
              <div>
                <section v-if="form.channels.includes('短信')" class="message-block">
                  <h4>短信内容</h4>
                  <label>模板名称：<select v-model="form.smsTemplate" :disabled="isReadonly"><option>阳性随访提醒模板</option><option>复查提醒模板</option></select></label>
                  <textarea v-model="form.smsContent" :readonly="isReadonly" />
                  <p>可用变量：<button type="button" @click="insertVar('${name}')">${name}</button><button type="button" @click="insertVar('${phone}')">${phone}</button><button type="button" @click="insertVar('${disease}')">${disease}</button></p>
                </section>
                <section v-if="form.channels.includes('微信')" class="message-block">
                  <h4>微信内容</h4>
                  <label>模板名称：<select v-model="form.wechatTemplate" :disabled="isReadonly"><option>微信随访提醒模板</option><option>健康指导通知模板</option></select></label>
                  <textarea v-model="form.wechatContent" :readonly="isReadonly" />
                  <label>跳转页面：<select v-model="form.jumpPage" :disabled="isReadonly"><option>健康指导详情</option><option>复查预约页</option></select></label>
                  <label>联系电话变量：<input v-model="form.phoneVar" :readonly="isReadonly" /></label>
                </section>
              </div>
              <div class="preview-box"><strong>短信预览</strong><p>{{ previewText }}</p></div>
            </div>
          </LegacyFormSection>
          <LegacyFormSection title="执行情况">
            <div class="run-info"><span>已生成任务：{{ form.taskTotal }}</span><span>执行中：{{ form.running }}</span><span>已完成：{{ form.completed }}</span><span>发送失败：{{ form.failed }}</span><span>最近执行：{{ form.lastRun }}</span></div>
          </LegacyFormSection>
        </div>
      </section>
    </section>
    <div v-if="savedTip" class="save-tip">保存成功</div>
    <div v-if="deleteVisible" class="modal-mask">
      <section class="legacy-modal">
        <header>删除确认</header>
        <p>确定删除随访方案“{{ form.name }}”吗？</p>
        <p v-if="form.taskTotal > 0" class="delete-tip">该方案已产生随访任务，不允许直接删除，可将方案停用。</p>
        <footer><button class="danger-btn" :disabled="form.taskTotal > 0" type="button" @click="confirmDelete">确定</button><button type="button" @click="deleteVisible = false">取消</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.followup-page{height:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.page-head{height:32px;padding-right:8px;display:flex;align-items:center;justify-content:space-between;border:1px solid #d8d8d8;background:#fff}.breadcrumb{padding:0 10px;font-size:13px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.danger-btn{border-color:#d7a19d;color:#a91e18;background:#fff}.master-detail{min-height:0;flex:1;display:grid;grid-template-columns:300px minmax(0,1fr);gap:10px;padding-top:8px}.plan-list,.detail-area{min-height:0;border:1px solid #d8d8d8;background:#fff}.plan-list{display:flex;flex-direction:column}.side-search{padding:8px;border-bottom:1px solid #d8d8d8;background:#f7f9fb}.side-search label{height:30px;display:flex;align-items:center;gap:6px;font-size:12px}.side-search span{width:56px;text-align:right}.side-search input,.side-search select,.form-grid input,.form-grid select,.message-block select,.message-block input{height:28px;min-width:0;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px}.side-search input,.side-search select{flex:1}.side-search div{display:flex;justify-content:flex-end;gap:6px;margin-top:5px}.plans-scroll,.detail-scroll{min-height:0;flex:1;overflow:auto;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.plan-item{height:82px;width:100%;padding:8px 9px 7px 11px;display:flex;flex-direction:column;align-items:stretch;gap:3px;text-align:left;border:0;border-bottom:1px solid #e6e8eb;border-radius:0;background:#fff}.plan-item.active{background:#eef5fc;box-shadow:inset 2px 0 0 #5f8db8}.plan-item strong{display:flex;align-items:center;justify-content:space-between;font-size:13px}.plan-item span{color:#666;font-size:12px}.plan-item em{height:20px;padding:0 6px;display:inline-flex;align-items:center;border:1px solid #c8d2dc;border-radius:2px;background:#eef3f8;color:#455a6e;font-size:12px;font-style:normal}.plan-item em.off{background:#f1f1f1;color:#777}.detail-area{display:flex;flex-direction:column}.detail-toolbar{height:38px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f7f9fb}.detail-toolbar strong{font-size:13px}.detail-toolbar div{display:flex;gap:6px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 16px}.form-grid.compact{margin-top:8px}.form-grid label{display:grid;grid-template-columns:78px minmax(0,1fr);align-items:center;gap:6px;font-size:12px}.form-grid label>span{text-align:right}.radio-line,.rule-box,.channel-line{display:flex;align-items:center;gap:18px;font-size:12px}.radio-line label,.rule-box label,.channel-line label{display:flex;align-items:center;gap:4px}.message-layout{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:12px}.message-block{margin-bottom:10px}.message-block h4{height:24px;margin:0;font-size:12px}.message-block label{height:30px;display:flex;align-items:center;gap:6px;font-size:12px}.message-block textarea{width:100%;height:82px;padding:7px;border:1px solid #bfc7d1;border-radius:2px;color:#333;font:12px "Microsoft YaHei",Arial,sans-serif;resize:none}.message-block p{margin:5px 0 0;color:#666;font-size:12px}.message-block p button{height:22px;margin-left:5px;padding:0 6px}.preview-box{min-height:180px;padding:9px;border:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.preview-box strong{display:block;margin-bottom:8px}.preview-box p{margin:0;line-height:1.7;white-space:pre-wrap}.run-info{display:flex;flex-wrap:wrap;gap:10px 24px;font-size:12px}.save-tip{position:fixed;top:82px;left:50%;z-index:80;transform:translateX(-50%);height:30px;padding:0 18px;display:flex;align-items:center;border:1px solid #9fb7cf;background:#eef6ff;color:#244b70;font-size:12px}.modal-mask{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(0,0,0,.25)}.legacy-modal{width:380px;border:1px solid #9facba;background:#fff;color:#333;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.16)}.legacy-modal header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.legacy-modal p{margin:14px 18px;line-height:1.7}.delete-tip{padding:7px 9px;border:1px solid #f0c7c3;background:#fff7f6;color:#b3261e}.legacy-modal footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #d8d8d8;background:#f7f9fb}
</style>
