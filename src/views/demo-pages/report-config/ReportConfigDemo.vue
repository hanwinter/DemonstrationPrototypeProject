<script setup>
import { computed, reactive, ref, watch } from 'vue'

const reportTemplates = ['综合体检报告', '视力筛查报告', '口腔筛查报告', '心理筛查报告', '营养评估报告', '脊柱筛查报告']
const statusOptions = ['启用', '停用']
const activeTemplate = ref('综合体检报告')
const templateName = ref('综合体检报告')
const enabledStatus = ref('启用')
const activeCategory = ref('physical')
const availableKeyword = ref('')
const selectedAvailableIds = ref([])
const selectedChosenIds = ref([])
const resetVisible = ref(false)
const savedTip = ref(false)

const categories = [
  { key: 'physical', label: '体格检查' },
  { key: 'vision', label: '视力检查' },
  { key: 'oral', label: '口腔检查' },
  { key: 'surgery', label: '外科检查' },
  { key: 'mental', label: '心理检查' },
  { key: 'ent', label: '耳鼻喉' },
  { key: 'internal', label: '内科检查' },
  { key: 'lab', label: '检验检查' },
]

const categoryItems = {
  physical: [['height', '身高', 'TG01001'], ['weight', '体重', 'TG01002'], ['bmi', 'BMI', 'TG01003'], ['waist', '腰围', 'TG01004'], ['hip', '臀围', 'TG01005'], ['chest', '胸围', 'TG01006']],
  vision: [['leftNakedVision', '左眼裸眼视力', 'SL01001'], ['rightNakedVision', '右眼裸眼视力', 'SL01002'], ['leftCorrectedVision', '左眼矫正视力', 'SL01003'], ['rightCorrectedVision', '右眼矫正视力', 'SL01004'], ['leftSphere', '左眼球镜', 'SL01005'], ['rightSphere', '右眼球镜', 'SL01006'], ['leftCylinder', '左眼柱镜', 'SL01007'], ['rightCylinder', '右眼柱镜', 'SL01008'], ['glassesType', '戴镜类型', 'SL01009']],
  oral: [['toothChart', '牙位图', 'KQ01001'], ['toothCount', '牙齿数量', 'KQ01002'], ['decayedCount', '龋齿（坏牙）数', 'KQ01003'], ['missingCount', '缺失数量', 'KQ01004'], ['filledCount', '填充数量', 'KQ01005'], ['sixthToothCount', '六龄齿萌出数量', 'KQ01006'], ['sealantCount', '已行窝沟封闭数量', 'KQ01007'], ['oralHygiene', '口腔卫生', 'KQ01008'], ['primaryLoose', '乳牙活动', 'KQ02001'], ['primaryCaries', '乳牙龋', 'KQ02002'], ['primaryMissing', '乳牙失', 'KQ02003'], ['caries', '龋齿', 'KQ02004'], ['primaryFilling', '乳牙补', 'KQ02005'], ['primaryDmf', '乳龋患失补总牙数', 'KQ02006'], ['permanentActive', '恒龋活动', 'KQ02007'], ['permanentCaries', '恒牙龋', 'KQ02008'], ['permanentMissing', '恒牙失', 'KQ02009'], ['permanentFilling', '恒牙补', 'KQ02010'], ['permanentDmf', '恒龋患失补总牙数', 'KQ02011'], ['periodontal', '牙周', 'KQ02012'], ['dentitionIrregular', '牙列不齐', 'KQ02013'], ['other', '其他', 'KQ02014'], ['periodontalOther', '牙周其他', 'KQ02015'], ['tooth16Eruption', '16号牙位-萌出', 'KQ03001']],
  surgery: [['spineCheck', '脊柱检查', 'WK01001'], ['scoliosis', '脊柱侧弯', 'WK01002'], ['shoulderSymmetry', '肩部对称', 'WK01003'], ['pelvisSymmetry', '骨盆对称', 'WK01004'], ['lowerLimb', '下肢形态', 'WK01005']],
  mental: [['actualAge', '实足年龄', 'XL01001'], ['behavior', '行为表现', 'XL01002'], ['assessment', '评估结果', 'XL01003'], ['riskLevel', '心理风险等级', 'XL01004'], ['remark', '备注', 'XL01005']],
  ent: [['leftHearing', '左耳听力', 'EBH01001'], ['rightHearing', '右耳听力', 'EBH01002'], ['nasalCheck', '鼻腔检查', 'EBH01003'], ['throatCheck', '咽部检查', 'EBH01004']],
  internal: [['heartRate', '心率', 'NK01001'], ['bloodPressure', '血压', 'NK01002'], ['cardiopulmonary', '心肺听诊', 'NK01003'], ['abdomen', '腹部检查', 'NK01004']],
  lab: [['bloodRoutine', '血常规', 'JY01001'], ['urineRoutine', '尿常规', 'JY01002'], ['liverFunction', '肝功能', 'JY01003'], ['bloodGlucose', '血糖', 'JY01004']],
}

function makeDefaultConfig(template) {
  const selectedCount = {
    physical: template === '视力筛查报告' ? 1 : 4,
    vision: template === '口腔筛查报告' ? 1 : 6,
    oral: template === '口腔筛查报告' ? 12 : 8,
    surgery: template === '脊柱筛查报告' ? 4 : 3,
    mental: template === '心理筛查报告' ? 4 : 3,
    ent: 2,
    internal: 3,
    lab: template === '综合体检报告' ? 3 : 1,
  }
  return Object.fromEntries(categories.map(({ key }) => [key, categoryItems[key].slice(0, selectedCount[key]).map(([id]) => id)]))
}

const templateConfigs = reactive(Object.fromEntries(reportTemplates.map((name) => [name, makeDefaultConfig(name)])))

const allItems = computed(() => categoryItems[activeCategory.value].map(([id, name, code]) => ({ id, name, code })))
const chosenIds = computed(() => templateConfigs[activeTemplate.value][activeCategory.value])
const chosenItems = computed(() => chosenIds.value.map((id) => allItems.value.find((item) => item.id === id)).filter(Boolean))
const availableItems = computed(() => {
  const word = availableKeyword.value.trim().toLowerCase()
  return allItems.value
    .filter((item) => !chosenIds.value.includes(item.id))
    .filter((item) => !word || item.name.toLowerCase().includes(word) || item.code.toLowerCase().includes(word))
})
const summaryText = computed(() => categories.map((item) => `${item.label}${templateConfigs[activeTemplate.value][item.key].length}项`).join('｜'))

watch(activeTemplate, (value) => {
  templateName.value = value
  selectedAvailableIds.value = []
  selectedChosenIds.value = []
  availableKeyword.value = ''
})

watch(activeCategory, () => {
  selectedAvailableIds.value = []
  selectedChosenIds.value = []
  availableKeyword.value = ''
})

function addSelected() {
  const target = chosenIds.value
  selectedAvailableIds.value.forEach((id) => {
    if (!target.includes(id)) target.push(id)
  })
  selectedAvailableIds.value = []
}

function addAll() {
  availableItems.value.forEach((item) => {
    if (!chosenIds.value.includes(item.id)) chosenIds.value.push(item.id)
  })
  selectedAvailableIds.value = []
}

function removeSelected() {
  templateConfigs[activeTemplate.value][activeCategory.value] = chosenIds.value.filter((id) => !selectedChosenIds.value.includes(id))
  selectedChosenIds.value = []
}

function removeAll() {
  templateConfigs[activeTemplate.value][activeCategory.value] = []
  selectedChosenIds.value = []
}

function moveChosen(id, direction) {
  const list = chosenIds.value
  const index = list.indexOf(id)
  const nextIndex = index + direction
  if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return
  const temp = list[index]
  list[index] = list[nextIndex]
  list[nextIndex] = temp
}

function removeOne(id) {
  templateConfigs[activeTemplate.value][activeCategory.value] = chosenIds.value.filter((item) => item !== id)
}

function saveConfig() {
  savedTip.value = true
  window.setTimeout(() => { savedTip.value = false }, 1600)
}

function confirmReset() {
  templateConfigs[activeTemplate.value] = makeDefaultConfig(activeTemplate.value)
  templateName.value = activeTemplate.value
  enabledStatus.value = '启用'
  selectedAvailableIds.value = []
  selectedChosenIds.value = []
  resetVisible.value = false
}
</script>

<template>
  <div class="report-config-page">
    <div class="breadcrumb">单页面演示 &gt; 报告配置</div>
    <section class="template-head">
      <label><span>报告模板</span><select v-model="activeTemplate"><option v-for="item in reportTemplates" :key="item">{{ item }}</option></select></label>
      <label><span>模板名称</span><input v-model="templateName" /></label>
      <label><span>启用状态</span><select v-model="enabledStatus"><option v-for="item in statusOptions" :key="item">{{ item }}</option></select></label>
      <div class="template-actions"><button type="button" @click="resetVisible = true">恢复默认</button><button class="primary-btn" type="button" @click="saveConfig">保存</button></div>
    </section>
    <section class="category-tabs">
      <button v-for="item in categories" :key="item.key" :class="{ active: activeCategory === item.key }" type="button" @click="activeCategory = item.key">{{ item.label }}</button>
    </section>
    <section class="transfer-area">
      <div class="transfer-panel">
        <header><strong>可选项目</strong><span>共 {{ availableItems.length }} 项</span></header>
        <div class="panel-search"><label>项目名称/编码：<input v-model="availableKeyword" /></label><button type="button">查询</button></div>
        <div class="item-list">
          <label v-for="item in availableItems" :key="item.id" class="item-row available-row">
            <input v-model="selectedAvailableIds" type="checkbox" :value="item.id" />
            <span>{{ item.name }}</span><em>{{ item.code }}</em>
          </label>
          <div v-if="!availableItems.length" class="empty-text">暂无可选项目</div>
        </div>
      </div>
      <div class="transfer-actions">
        <button type="button" title="添加选中" @click="addSelected">&gt;</button>
        <button type="button" title="全部添加" @click="addAll">&gt;&gt;</button>
        <button type="button" title="移除选中" @click="removeSelected">&lt;</button>
        <button type="button" title="全部移除" @click="removeAll">&lt;&lt;</button>
      </div>
      <div class="transfer-panel">
        <header><strong>已选报告项目</strong><span>共 {{ chosenItems.length }} 项</span></header>
        <div class="chosen-tip">右侧顺序即报告展示顺序</div>
        <div class="item-list">
          <div v-for="(item, index) in chosenItems" :key="item.id" class="item-row chosen-row" :class="{ selected: selectedChosenIds.includes(item.id) }" @click="selectedChosenIds = selectedChosenIds.includes(item.id) ? selectedChosenIds.filter((id) => id !== item.id) : [...selectedChosenIds, item.id]">
            <input v-model="selectedChosenIds" type="checkbox" :value="item.id" />
            <b>{{ index + 1 }}</b>
            <span class="chosen-name">{{ item.name }}</span><em>{{ item.code }}</em>
            <div class="row-actions">
              <button type="button" :disabled="index === 0" @click.stop="moveChosen(item.id, -1)">上移</button>
              <button type="button" :disabled="index === chosenItems.length - 1" @click.stop="moveChosen(item.id, 1)">下移</button>
              <button type="button" @click.stop="removeOne(item.id)">移除</button>
            </div>
          </div>
          <div v-if="!chosenItems.length" class="empty-text">暂无已选项目</div>
        </div>
      </div>
    </section>
    <footer class="config-summary">当前报告已配置：{{ summaryText }}</footer>
    <div v-if="savedTip" class="save-tip">保存成功</div>
    <div v-if="resetVisible" class="modal-mask">
      <section class="legacy-modal">
        <header>重置确认</header>
        <p>确定恢复当前报告配置的默认设置吗？</p>
        <footer><button class="primary-btn" type="button" @click="confirmReset">确定</button><button type="button" @click="resetVisible = false">取消</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.report-config-page{height:100%;min-width:0;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.template-head{height:46px;padding:8px 10px;display:flex;align-items:center;gap:14px;border:1px solid #d8d8d8;border-top:0;background:#f7f9fb}.template-head label{display:flex;align-items:center;gap:5px;font-size:12px}.template-head label span{min-width:54px;text-align:right}.template-head input,.template-head select,.panel-search input{height:28px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px}.template-head select{width:150px}.template-head input{width:180px}.template-actions{margin-left:auto;display:flex;gap:6px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}button:disabled{color:#aaa;background:#f1f1f1;cursor:not-allowed}.category-tabs{height:36px;margin-top:8px;padding:5px 6px 0;display:flex;gap:4px;border:1px solid #d8d8d8;background:#fff}.category-tabs button{height:30px;border-bottom:0;border-radius:2px 2px 0 0;background:#f7f9fb}.category-tabs button.active{background:#dceafa;color:#1f4d75;border-color:#b8cce0;font-weight:600}.transfer-area{min-height:0;flex:1;padding:8px 0;display:grid;grid-template-columns:minmax(0,42%) 64px minmax(0,42%);justify-content:space-between;gap:12px}.transfer-panel{min-height:0;display:flex;flex-direction:column;border:1px solid #d8d8d8;background:#fff}.transfer-panel header{height:32px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px}.transfer-panel header span{color:#666}.panel-search{height:38px;padding:5px 8px;display:flex;align-items:center;gap:6px;border-bottom:1px solid #d8d8d8;background:#f7f9fb;font-size:12px}.panel-search input{width:170px}.chosen-tip{height:38px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;background:#f7f9fb;color:#666;font-size:12px}.item-list{min-height:0;flex:1;overflow:auto;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}.item-row{height:30px;padding:0 8px;display:grid;align-items:center;gap:6px;border-bottom:1px solid #e6e8eb;font-size:12px}.available-row{grid-template-columns:20px minmax(120px,1fr) 76px}.item-row:hover,.chosen-row.selected{background:#eef5fc}.item-row input{width:14px;height:14px;accent-color:#6f9fbd}.item-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item-row em{color:#999;font-size:11px;font-style:normal;text-align:right}.chosen-row{grid-template-columns:20px 28px minmax(120px,1fr) 76px 104px;cursor:pointer}.chosen-row b{font-weight:400;color:#555}.chosen-name{font-weight:400;color:#333}.row-actions{display:flex;justify-content:flex-end;gap:6px}.row-actions button{height:22px;padding:0;border:0;background:transparent;color:#2d6fba}.row-actions button:last-child{color:#b3261e}.row-actions button:disabled{color:#aaa}.transfer-actions{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}.transfer-actions button{width:30px;height:28px;padding:0}.empty-text{height:120px;display:grid;place-items:center;color:#777;font-size:12px}.config-summary{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#f1f3f5;color:#555;font-size:12px}.save-tip{position:fixed;top:82px;left:50%;z-index:80;transform:translateX(-50%);height:30px;padding:0 18px;display:flex;align-items:center;border:1px solid #9fb7cf;background:#eef6ff;color:#244b70;font-size:12px}.modal-mask{position:fixed;inset:0;z-index:70;display:grid;place-items:center;background:rgba(0,0,0,.25)}.legacy-modal{width:360px;border:1px solid #9facba;background:#fff;color:#333;font-size:12px;box-shadow:0 4px 14px rgba(0,0,0,.16)}.legacy-modal header{height:34px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #cfd6df;background:#eef3f8;font-weight:600}.legacy-modal p{margin:16px 18px;line-height:1.7}.legacy-modal footer{height:42px;padding:0 12px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #d8d8d8;background:#f7f9fb}
</style>
