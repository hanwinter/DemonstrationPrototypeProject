<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LegacyFormSection from '../../../components/demo-common/LegacyFormSection.vue'
import LegacyInfoBar from '../../../components/demo-common/LegacyInfoBar.vue'
import { examRecords, recordStatuses, reportStatuses, screenTypes } from './mock'

const route = useRoute()
const router = useRouter()
const record = computed(() => examRecords.find((item) => item.id === route.params.id) || examRecords[0])
const activeTab = ref('result')
const configVisible = ref(false)
const savedTip = ref(false)
const visionOptions = ['5.0（1.0）', '4.9（0.8）', '4.8（0.6）', '4.7（0.5）', '4.3（0.2）', '3.7（0.05）']
const form = reactive({
  screenType: '院内初筛',
  visitDate: '2026-07-13',
  status: '已结论',
  reportStatus: '已生成',
  registerRemark: '本次筛查资料完整，体检结果已进入复核流程。',
  waist: '--',
  hip: '--',
  chest: '--',
  height: '150',
  weight: '44',
  leftNakedVision: '4.3（0.2）',
  rightNakedVision: '3.7（0.05）',
  leftCorrectedVision: '5.0（1.0）',
  rightCorrectedVision: '5.0（1.0）',
  glassesType: '框架眼镜',
  visionRemark: '建议复查屈光状态，注意用眼卫生。',
  toothCount: '12',
  decayedCount: '2',
  missingCount: '--',
  filledCount: '--',
  sixthToothCount: '--',
  sealantCount: '--',
  oralHygiene: '一般',
  mentalAge: '13岁7月',
  behavior: '正常',
  mentalResult: '正常',
  mentalRemark: '沟通配合度较好，未见明显异常。',
  doctorSign: '王医生',
})

const bmi = computed(() => {
  const height = Number(form.height) / 100
  const weight = Number(form.weight)
  return height && weight ? (weight / (height * height)).toFixed(2) : '--'
})
const infoItems = computed(() => [
  { label: '患者姓名', value: record.value.patientName },
  { label: '证件号', value: record.value.certNo },
  { label: '联系电话', value: record.value.phone },
  { label: '筛查类型', value: record.value.screenType },
  { label: '就诊日期', value: record.value.visitDate },
])
const configItems = ['围度', '身高体重/BMI', '视力检查', '口腔检查', '心理检查', '裸眼视力', '口腔卫生', '医师签名']

function save() {
  savedTip.value = true
  window.setTimeout(() => { savedTip.value = false }, 1600)
}
</script>

<template>
  <div class="exam-detail-page">
    <div class="detail-head">
      <div class="breadcrumb">单页面演示 &gt; 体检记录 &gt; 体检记录详情</div>
      <div class="head-actions">
        <button class="primary-btn" type="button" @click="save">保存</button>
        <button type="button" @click="router.push('/demo-pages/exam-records')">返回</button>
      </div>
    </div>
    <LegacyInfoBar :items="infoItems" />
    <div class="tabs">
      <button :class="{ active: activeTab === 'register' }" type="button" @click="activeTab = 'register'">筛查登记</button>
      <button :class="{ active: activeTab === 'result' }" type="button" @click="activeTab = 'result'">体检结果</button>
    </div>
    <section class="detail-body">
      <div v-if="activeTab === 'register'" class="form-panel">
        <LegacyFormSection title="筛查登记">
          <div class="legacy-form-grid">
            <label><span class="required">筛查类型</span><select v-model="form.screenType"><option v-for="item in screenTypes" :key="item">{{ item }}</option></select></label>
            <label><span class="required">就诊日期</span><input v-model="form.visitDate" type="date" /></label>
            <label><span class="required">登记状态</span><select v-model="form.status"><option v-for="item in recordStatuses" :key="item">{{ item }}</option></select></label>
            <label><span>报告状态</span><select v-model="form.reportStatus"><option v-for="item in reportStatuses" :key="item">{{ item }}</option></select></label>
            <label class="wide"><span>备注</span><textarea v-model="form.registerRemark" /></label>
          </div>
        </LegacyFormSection>
      </div>
      <div v-else class="form-panel">
        <div class="result-toolbar"><button type="button" @click="configVisible = true">字段配置</button></div>
        <LegacyFormSection title="围度">
          <div class="legacy-form-grid three">
            <label><span>腰围</span><input v-model="form.waist" /><b>cm</b></label>
            <label><span>臀围</span><input v-model="form.hip" /><b>cm</b></label>
            <label><span>胸围</span><input v-model="form.chest" /><b>cm</b></label>
          </div>
        </LegacyFormSection>
        <LegacyFormSection title="身高体重/BMI">
          <div class="legacy-form-grid three">
            <label><span>身高</span><input v-model="form.height" /><b>cm</b></label>
            <label><span>体重</span><input v-model="form.weight" /><b>kg</b></label>
            <label><span>BMI</span><input :value="bmi" readonly /><b>kg/m²</b></label>
          </div>
        </LegacyFormSection>
        <LegacyFormSection title="视力检查">
          <div class="legacy-form-grid vision">
            <label><span>裸眼视力（左眼）</span><select v-model="form.leftNakedVision"><option v-for="item in visionOptions" :key="item">{{ item }}</option></select></label>
            <label><span>裸眼视力（右眼）</span><select v-model="form.rightNakedVision"><option v-for="item in visionOptions" :key="item">{{ item }}</option></select></label>
            <label><span>矫正视力（左眼）</span><select v-model="form.leftCorrectedVision"><option v-for="item in visionOptions" :key="item">{{ item }}</option></select></label>
            <label><span>矫正视力（右眼）</span><select v-model="form.rightCorrectedVision"><option v-for="item in visionOptions" :key="item">{{ item }}</option></select></label>
            <label><span>戴镜类型</span><select v-model="form.glassesType"><option>框架眼镜</option><option>隐形眼镜</option><option>未戴镜</option></select></label>
            <label class="wide"><span>视力特殊情况备注</span><input v-model="form.visionRemark" /></label>
          </div>
        </LegacyFormSection>
        <LegacyFormSection title="口腔检查">
          <div class="legacy-form-grid oral">
            <label><span>牙齿数量</span><input v-model="form.toothCount" /></label>
            <label><span>龋齿（坏牙）数</span><input v-model="form.decayedCount" /></label>
            <label><span>缺失数量</span><input v-model="form.missingCount" /></label>
            <label><span>填充数量</span><input v-model="form.filledCount" /></label>
            <label><span>六龄齿萌出数量</span><input v-model="form.sixthToothCount" /></label>
            <label><span>已行窝沟封闭数量</span><input v-model="form.sealantCount" /></label>
            <label><span>口腔卫生</span><select v-model="form.oralHygiene"><option>良好</option><option>一般</option><option>较差</option></select></label>
          </div>
        </LegacyFormSection>
        <LegacyFormSection title="心理检查">
          <div class="legacy-form-grid mental">
            <label><span>实足年龄</span><input v-model="form.mentalAge" /></label>
            <label><span>行为表现</span><select v-model="form.behavior"><option>正常</option><option>需关注</option><option>异常</option></select></label>
            <label><span>评估结果</span><select v-model="form.mentalResult"><option>正常</option><option>轻度异常</option><option>中度异常</option><option>重度异常</option></select></label>
            <label class="wide"><span>备注描述</span><input v-model="form.mentalRemark" /></label>
            <label class="wide"><span>医师签名</span><input v-model="form.doctorSign" /></label>
          </div>
        </LegacyFormSection>
      </div>
    </section>
    <div v-if="savedTip" class="save-tip">保存成功</div>
    <div v-if="configVisible" class="modal-mask">
      <section class="legacy-modal config-modal">
        <header>字段配置</header>
        <div class="config-list"><label v-for="item in configItems" :key="item"><input type="checkbox" checked />{{ item }}</label></div>
        <footer><button class="primary-btn" type="button" @click="configVisible = false">确定</button><button type="button" @click="configVisible = false">关闭</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.exam-detail-page{height:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.detail-head{height:32px;display:flex;align-items:center;justify-content:space-between;border:1px solid #d8d8d8;border-bottom:0;background:#fff}.breadcrumb{padding:0 10px;color:#333;font-size:13px}.head-actions{padding-right:8px;display:flex;gap:6px}button{height:27px;padding:0 12px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.tabs{height:34px;display:flex;align-items:end;border-left:1px solid #d8d8d8;border-right:1px solid #d8d8d8;border-bottom:1px solid #d8d8d8;background:#fff}.tabs button{height:32px;border:0;border-right:1px solid #d8d8d8;border-radius:0;background:#f7f9fb}.tabs button.active{background:#fff;color:#1f4d75;border-bottom:2px solid #5f8db8;font-weight:600}.detail-body{min-height:0;flex:1;overflow:auto;padding-top:10px}.form-panel{min-width:960px}.result-toolbar{height:32px;margin-bottom:8px;display:flex;align-items:center;justify-content:flex-end}.legacy-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 16px}.legacy-form-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.legacy-form-grid.vision{grid-template-columns:repeat(4,minmax(0,1fr))}.legacy-form-grid.oral{grid-template-columns:repeat(4,minmax(0,1fr))}.legacy-form-grid.mental{grid-template-columns:repeat(3,minmax(0,1fr))}.legacy-form-grid label{display:grid;grid-template-columns:112px minmax(0,1fr) auto;align-items:center;gap:6px}.legacy-form-grid label.wide{grid-column:span 2}.legacy-form-grid.vision label.wide{grid-column:span 3}.legacy-form-grid.mental label.wide{grid-column:span 3}.legacy-form-grid span{text-align:right}.legacy-form-grid input,.legacy-form-grid select,.legacy-form-grid textarea{height:28px;min-width:0;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font:12px "Microsoft YaHei",Arial,sans-serif}.legacy-form-grid textarea{height:58px;padding-top:5px;resize:none}.legacy-form-grid b{font-weight:400;color:#666}.required::before{content:"*";color:#c62828;margin-right:2px}.save-tip{position:fixed;top:82px;left:50%;z-index:80;transform:translateX(-50%);height:30px;padding:0 18px;display:flex;align-items:center;border:1px solid #9fb7cf;background:#eef6ff;color:#244b70;font-size:12px}.modal-mask{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(0,0,0,.25)}.legacy-modal{border:1px solid #9facba;background:#fff;color:#333;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.16)}.legacy-modal header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.config-modal{width:360px}.config-list{padding:14px 18px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.config-list label{display:flex;align-items:center;gap:6px}.legacy-modal footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #d8d8d8;background:#f7f9fb}
</style>
