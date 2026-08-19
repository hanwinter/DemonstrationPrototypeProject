<script setup>
import { computed, reactive, ref } from 'vue'

const students = ['顾禾雨', '陈思然', '周若溪']
const templates = ['综合体检报告', '视力专项报告', '口腔专项报告', '脊柱专项报告', '心理健康报告']
const batches = ['2026春季五健筛查', '2025秋季五健筛查']
const form = reactive({ student: '顾禾雨', batch: '2026春季五健筛查', template: '综合体检报告' })
const studentInfo = { name: '顾禾雨', gender: '女', age: '13岁6个月', school: '宁安路第一中学', className: '七年级3班', examDate: '2026-07-13' }
const editMode = ref(false)
const regenVisible = ref(false)
const regenBasis = ref(['当前筛查结果', '疾病知识库', '健康建议库'])
const reportStyle = ref('标准版')

const evidenceGroups = [
  { title: '视力', result: '异常', rows: [['左眼裸眼视力', '4.3'], ['右眼裸眼视力', '3.7'], ['左眼球镜', '-0.50D'], ['右眼球镜', '-0.75D']] },
  { title: '体重', result: '正常', rows: [['身高', '150cm'], ['体重', '44kg'], ['BMI', '19.56']] },
  { title: '口腔', result: '异常', rows: [['龋齿', '2颗'], ['口腔卫生', '一般']] },
  { title: '脊柱', result: '需关注', rows: [['脊柱侧弯筛查', '可疑'], ['肩部对称', '轻度异常']] },
  { title: '心理', result: '需关注', rows: [['心理风险等级', '关注']] },
]
const abnormalIssues = [
  ['视力下降', '异常'],
  ['龋齿', '异常'],
  ['脊柱侧弯风险', '关注'],
  ['心理健康风险', '关注'],
]
const knowledgeItems = [
  ['视力下降', '儿童青少年近视风险管理'],
  ['龋齿', '儿童龋病健康管理'],
  ['脊柱侧弯风险', '青少年脊柱健康管理'],
]

const report = reactive({
  summary: '本次筛查显示，顾禾雨整体生长发育情况基本正常，体重及BMI处于正常范围。\n\n视力筛查结果提示双眼裸眼视力下降，其中右眼下降较为明显，建议近期进一步进行规范视力检查。\n\n口腔检查发现龋齿2颗，应加强日常口腔清洁，并及时进行口腔科评估。\n\n脊柱筛查发现轻度异常表现，建议关注日常坐姿及脊柱形态变化，必要时进行进一步专科检查。',
  problems: '1. 视力健康\n双眼裸眼视力均低于正常参考水平，右眼下降更加明显。建议减少持续近距离用眼时间，并按计划完成复查。\n\n2. 口腔健康\n本次检查发现2颗龋齿，建议加强早晚刷牙和含糖食品管理，并前往口腔科进一步处理。',
  advice: '日常生活：保持规律作息，减少长时间静坐和连续使用电子屏幕。\n\n用眼管理：增加户外活动时间，控制近距离用眼时长，注意读写姿势和照明环境。\n\n口腔护理：坚持早晚刷牙，减少含糖食品摄入，必要时进行口腔专科处理。\n\n运动与体态：保持适量运动，关注坐姿、站姿和肩背对称情况。\n\n心理健康：持续观察情绪、睡眠和人际交往变化，必要时由学校和家长共同支持。',
  recheck: '视力：建议1个月内完成视力复查\n口腔：建议近期口腔科检查\n脊柱：建议3个月后复评\n心理：建议持续观察情绪和行为变化',
  evaluation: '本次五健筛查发现视力、口腔及脊柱方面存在需要持续关注的问题。建议家长结合本报告健康指导及时开展日常干预，并按建议完成后续复查。',
})
const editDraft = reactive({ summary: '', problems: '', advice: '', recheck: '', evaluation: '' })
const templateHint = computed(() => form.template === '综合体检报告' ? '综合筛查结果语义化总结' : `${form.template}语义化总结`)

function startEdit() {
  Object.assign(editDraft, report)
  editMode.value = true
}
function saveEdit() {
  Object.assign(report, editDraft)
  editMode.value = false
}
function cancelEdit() {
  editMode.value = false
}
function regenerate() {
  report.summary = `已按${reportStyle.value}重新生成：本次${form.batch}显示，${form.student}存在视力、口腔及脊柱方面需要关注的问题，体重与BMI处于正常范围。建议结合疾病知识库和健康建议库进行分层干预。`
  regenVisible.value = false
}
</script>

<template>
  <div class="semantic-report-page">
    <div class="breadcrumb">单页面演示 &gt; 语义化体检总结报告</div>
    <section class="page-head">
      <div><h1>语义化体检总结报告</h1><span>{{ templateHint }}</span></div>
      <div class="toolbar"><button type="button" @click="regenVisible = true">重新生成</button><button type="button" class="primary" @click="editMode ? saveEdit() : startEdit()">{{ editMode ? '保存' : '编辑报告' }}</button><button v-if="editMode" type="button" @click="cancelEdit">取消</button></div>
    </section>

    <section class="config-strip">
      <label>学生<select v-model="form.student"><option v-for="item in students" :key="item">{{ item }}</option></select></label>
      <label>筛查批次<select v-model="form.batch"><option v-for="item in batches" :key="item">{{ item }}</option></select></label>
      <label>报告模板<select v-model="form.template"><option v-for="item in templates" :key="item">{{ item }}</option></select></label>
    </section>

    <section class="student-strip">
      <strong>{{ studentInfo.name }}</strong><span>{{ studentInfo.gender }}</span><span>{{ studentInfo.age }}</span><i></i><span>{{ studentInfo.school }} · {{ studentInfo.className }}</span><i></i><span>检查日期：{{ studentInfo.examDate }}</span>
    </section>

    <section class="main-layout">
      <aside class="left-panel">
        <section class="panel">
          <header><h2>筛查结果依据</h2></header>
          <div class="evidence-group" v-for="group in evidenceGroups" :key="group.title">
            <div class="group-title"><strong>{{ group.title }}</strong><em :class="{ normal: group.result === '正常' }">{{ group.result }}</em></div>
            <p v-for="row in group.rows" :key="row[0]"><span>{{ row[0] }}：</span><b>{{ row[1] }}</b></p>
          </div>
        </section>
        <section class="panel">
          <header><h2>异常问题</h2></header>
          <div class="issue-list"><p v-for="item in abnormalIssues" :key="item[0]"><span>{{ item[0] }}</span><em>{{ item[1] }}</em></p></div>
        </section>
        <section class="panel">
          <header><h2>知识库匹配</h2></header>
          <div class="knowledge-list"><p v-for="item in knowledgeItems" :key="item[0]"><strong>{{ item[0] }}</strong><span>匹配知识：{{ item[1] }}</span><button type="button">查看</button></p></div>
        </section>
      </aside>

      <article class="report-panel">
        <header><h2>语义化总结报告</h2><span>{{ form.template }}</span></header>
        <div v-if="!editMode" class="report-doc">
          <section><h3>健康总结</h3><p>{{ report.summary }}</p></section>
          <section><h3>重点健康问题</h3><p>{{ report.problems }}</p></section>
          <section><h3>健康建议</h3><p>{{ report.advice }}</p></section>
          <section><h3>复查建议</h3><p>{{ report.recheck }}</p></section>
          <section><h3>综合评价</h3><p>{{ report.evaluation }}</p></section>
        </div>
        <div v-else class="edit-doc">
          <label>健康总结<textarea v-model="editDraft.summary"></textarea></label>
          <label>重点健康问题<textarea v-model="editDraft.problems"></textarea></label>
          <label>健康建议<textarea v-model="editDraft.advice"></textarea></label>
          <label>复查建议<textarea v-model="editDraft.recheck"></textarea></label>
          <label>综合评价<textarea v-model="editDraft.evaluation"></textarea></label>
        </div>
      </article>
    </section>

    <div v-if="regenVisible" class="dialog-mask">
      <section class="regen-dialog">
        <header><h2>重新生成报告</h2><button type="button" @click="regenVisible = false">×</button></header>
        <div class="dialog-body">
          <strong>生成依据：</strong>
          <label v-for="item in ['当前筛查结果','疾病知识库','健康建议库']" :key="item"><input v-model="regenBasis" type="checkbox" :value="item" />{{ item }}</label>
          <strong>报告风格：</strong>
          <label v-for="item in ['简洁版','标准版','详细版']" :key="item"><input v-model="reportStyle" type="radio" :value="item" />{{ item }}</label>
        </div>
        <footer><button type="button" @click="regenVisible = false">取消</button><button type="button" class="primary" @click="regenerate">确认生成</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}.semantic-report-page{height:100%;padding:12px;overflow:auto;color:#26384a;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:28px;color:#6a7684;font-size:12px}.page-head{min-height:68px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #d8e1ea}.page-head h1{margin:0;color:#20374d;font-size:22px}.page-head span{display:block;margin-top:6px;color:#657386;font-size:12px}.toolbar{display:flex;gap:8px}.toolbar button,.regen-dialog button{height:30px;padding:0 12px;border:1px solid #bdc8d4;background:#fff;color:#30465a;cursor:pointer}.toolbar .primary,.regen-dialog .primary{border-color:#2f75bd;background:#3d78bf;color:#fff}.config-strip{padding:10px 14px;display:flex;flex-wrap:wrap;gap:14px;background:#fff;border:1px solid #d8e1ea;border-top:0}.config-strip label{display:flex;align-items:center;gap:8px;color:#44566c;font-size:13px}.config-strip select{width:180px;height:30px;border:1px solid #cfd8e3;background:#fff}.student-strip{margin-top:10px;min-height:42px;padding:0 14px;display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #d8e1ea;font-size:13px}.student-strip strong{font-size:16px;color:#1f344d}.student-strip i{width:1px;height:16px;background:#d5dde7}.main-layout{margin-top:10px;display:grid;grid-template-columns:380px minmax(0,1fr);gap:4px}.left-panel{display:grid;gap:10px;align-content:start}.panel,.report-panel{background:#fff;border:1px solid #d8e1ea}.panel header,.report-panel header{height:44px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3e8ef}.panel h2,.report-panel h2{margin:0;padding-left:9px;border-left:3px solid #3d78bf;color:#21364c;font-size:16px}.report-panel header span{color:#7b8794;font-size:12px}.evidence-group{padding:10px 14px;border-bottom:1px solid #edf1f5}.evidence-group:last-child{border-bottom:none}.group-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}.group-title strong{font-size:14px}.group-title em,.issue-list em{height:22px;line-height:20px;padding:0 8px;border:1px solid #dfc2a0;background:#fff8ef;color:#a85e00;font-style:normal;font-size:12px}.group-title em.normal{border-color:#b9d6c3;background:#f2fbf5;color:#287044}.evidence-group p,.issue-list p,.knowledge-list p{margin:0;padding:5px 0;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#506274;font-size:12px}.evidence-group b{color:#21364c}.issue-list,.knowledge-list{padding:8px 14px}.knowledge-list p{display:grid;grid-template-columns:92px minmax(0,1fr) 38px;border-bottom:1px solid #edf1f5}.knowledge-list p:last-child{border-bottom:none}.knowledge-list strong{color:#21364c}.knowledge-list button{border:0;background:transparent;color:#2f75bd;cursor:pointer}.report-doc{padding:18px 24px 28px}.report-doc section{padding-bottom:18px;margin-bottom:18px;border-bottom:1px solid #edf1f5}.report-doc section:last-child{border-bottom:none;margin-bottom:0}.report-doc h3{margin:0 0 10px;color:#20374d;font-size:16px}.report-doc p{margin:0;white-space:pre-line;color:#34495e;font-size:14px;line-height:1.75}.edit-doc{padding:14px 18px;display:grid;gap:12px}.edit-doc label{display:grid;gap:7px;color:#21364c;font-size:13px;font-weight:600}.edit-doc textarea{width:100%;min-height:110px;padding:8px 10px;border:1px solid #cfd8e3;resize:vertical;color:#34495e;font-size:13px;line-height:1.6}.dialog-mask{position:fixed;inset:0;display:grid;place-items:center;background:rgba(20,34,48,.28);z-index:20}.regen-dialog{width:420px;background:#fff;border:1px solid #bfcbd8;box-shadow:0 8px 24px rgba(0,0,0,.14)}.regen-dialog header{height:46px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3e8ef}.regen-dialog h2{margin:0;color:#20374d;font-size:16px}.regen-dialog header button{border:0;font-size:20px}.dialog-body{padding:16px;display:grid;gap:10px;color:#34495e;font-size:13px}.dialog-body label{display:flex;align-items:center;gap:8px}.regen-dialog footer{height:48px;padding:0 14px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #e3e8ef}@media(max-width:1100px){.main-layout{grid-template-columns:1fr}.page-head{display:block}.toolbar{margin-top:12px}.config-strip{display:grid}}
</style>
