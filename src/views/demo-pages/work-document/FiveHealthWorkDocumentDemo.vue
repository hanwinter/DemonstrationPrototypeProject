<script setup>
import { computed, reactive, ref } from 'vue'

const templates = [
  { key: 'annual', name: '区域年度总结', desc: '面向卫健和教育协同会议的年度工作材料' },
  { key: 'quarter', name: '季度工作汇报', desc: '按季度汇总筛查进度、问题和干预情况' },
  { key: 'school', name: '学校筛查情况报告', desc: '面向单校反馈的筛查执行和异常分析材料' },
  { key: 'special', name: '专项健康分析报告', desc: '围绕视力、龋齿、体重等专项指标生成分析' },
]

const config = reactive({
  template: 'annual',
  region: '浙江省杭州市西湖区',
  range: '2026-01-01 至 2026-08-31',
  batch: '2026春季五健筛查',
  scope: '全区中小学校',
})

const generatedAt = ref('2026-08-13 10:20')
const selectedTemplate = computed(() => templates.find((item) => item.key === config.template) || templates[0])

const sections = [
  { title: '第一部分：工作开展情况', summary: '本周期完成区域五健筛查组织、入校执行、数据上传和报告反馈等工作，覆盖356所学校。' },
  { title: '第二部分：学生参与情况', summary: '应筛学生128560人，已完成119820人，整体完成率93.2%，小学阶段完成率相对较高。' },
  { title: '第三部分：健康问题分析', summary: '主要异常集中在视力异常、龋齿、超重肥胖和脊柱体态问题，其中视力异常占比18.5%。' },
  { title: '第四部分：异常干预情况', summary: '已形成复筛名单8200人，完成复筛6500人，重点异常学生已纳入随访和家校通知。' },
  { title: '第五部分：下一步工作建议', summary: '建议继续推进学校健康教育、异常学生复筛闭环、数据质量整改和区域专项干预。' },
]

const versions = [
  { version: 'V1.3', time: '2026-08-13 10:20', creator: '系统自动生成' },
  { version: 'V1.2', time: '2026-08-12 17:40', creator: '区卫健管理员' },
  { version: 'V1.1', time: '2026-08-10 09:15', creator: '系统自动生成' },
]

function generateDocument() {
  generatedAt.value = '2026-08-13 10:45'
}
</script>

<template>
  <div class="work-document-page">
    <div class="breadcrumb">单页面演示 &gt; 五健工作情况文档</div>
    <section class="page-head">
      <div>
        <h1>五健工作情况文档</h1>
      </div>
      <button type="button" @click="generateDocument">生成文档</button>
    </section>

    <section class="top-layout">
      <article class="panel template-panel">
        <header><h2>模板选择</h2></header>
        <div class="template-list">
          <button v-for="item in templates" :key="item.key" type="button" :class="{ active: config.template === item.key }" @click="config.template = item.key">
            <strong>{{ item.name }}</strong>
            <span>{{ item.desc }}</span>
          </button>
        </div>
      </article>

      <article class="panel config-panel">
        <header><h2>生成配置</h2></header>
        <div class="config-grid">
          <label><span>区域</span><input v-model="config.region" /></label>
          <label><span>时间范围</span><input v-model="config.range" /></label>
          <label><span>筛查批次</span><select v-model="config.batch"><option>2026春季五健筛查</option><option>2025秋季五健筛查</option></select></label>
          <label><span>统计范围</span><select v-model="config.scope"><option>全区中小学校</option><option>小学</option><option>初中</option><option>高中</option></select></label>
        </div>
        <div class="generate-status">
          <span>当前模板：{{ selectedTemplate.name }}</span>
          <strong>最近生成：{{ generatedAt }}</strong>
        </div>
      </article>
    </section>

    <section class="middle-layout">
      <article class="panel content-panel">
        <header><h2>生成内容</h2></header>
        <div class="section-list">
          <div v-for="item in sections" :key="item.title">
            <strong>{{ item.title }}</strong>
            <span>{{ item.summary }}</span>
          </div>
        </div>
      </article>

      <article class="panel version-panel">
        <header><h2>版本管理</h2></header>
        <table>
          <thead><tr><th>版本号</th><th>生成时间</th><th>创建人</th></tr></thead>
          <tbody><tr v-for="item in versions" :key="item.version"><td>{{ item.version }}</td><td>{{ item.time }}</td><td>{{ item.creator }}</td></tr></tbody>
        </table>
      </article>
    </section>

    <section class="panel preview-panel">
      <header><h2>文档预览</h2><span>文本阅读方式</span></header>
      <article class="document-preview">
        <h2>{{ config.region }}{{ selectedTemplate.name }}</h2>
        <p class="doc-meta">统计周期：{{ config.range }}　筛查批次：{{ config.batch }}　统计范围：{{ config.scope }}</p>
        <section v-for="item in sections" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
        </section>
      </article>
    </section>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}.work-document-page{height:100%;padding:12px;overflow:auto;color:#26384a;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:28px;color:#6a7684;font-size:12px}.page-head{min-height:76px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #d8e1ea}.page-head h1{margin:0;color:#20374d;font-size:22px}.page-head p{margin:8px 0 0;color:#657386;font-size:13px}.page-head button{height:32px;padding:0 16px;border:1px solid #2f75bd;background:#3d78bf;color:#fff;cursor:pointer}.top-layout,.middle-layout{margin-top:10px;display:grid;grid-template-columns:380px minmax(0,1fr);gap:10px}.middle-layout{grid-template-columns:minmax(0,1fr) 430px}.panel{background:#fff;border:1px solid #d8e1ea}.panel header{height:48px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3e8ef}.panel h2{margin:0;padding-left:9px;border-left:3px solid #3d78bf;color:#21364c;font-size:16px}.panel header span{color:#7b8794;font-size:12px}.template-list{padding:8px}.template-list button{width:100%;min-height:58px;padding:10px 12px;text-align:left;border:1px solid transparent;border-bottom-color:#edf1f5;background:#fff;cursor:pointer}.template-list button:hover,.template-list button.active{border-color:#c7d8e9;background:#f7fbff}.template-list strong{display:block;color:#21364c;font-size:14px}.template-list span{display:block;margin-top:6px;color:#667486;font-size:12px;line-height:1.5}.config-grid{padding:14px;display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:12px 18px}.config-grid label{display:grid;grid-template-columns:74px 1fr;gap:8px;align-items:center}.config-grid span{color:#44566c;font-size:13px;text-align:right}.config-grid input,.config-grid select{width:100%;height:30px;padding:0 8px;border:1px solid #cfd8e3;background:#fff;color:#26384a}.generate-status{height:44px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #edf1f5;color:#667486;font-size:12px}.generate-status strong{color:#21364c;font-weight:600}.section-list{padding:8px 14px}.section-list div{padding:12px 0;border-bottom:1px solid #edf1f5}.section-list div:last-child{border-bottom:none}.section-list strong{display:block;color:#21364c;font-size:14px}.section-list span{display:block;margin-top:7px;color:#667486;font-size:12px;line-height:1.7}table{width:100%;border-collapse:collapse;font-size:12px}th{height:34px;padding:0 10px;text-align:left;color:#526477;background:#f6f8fa;border-bottom:1px solid #e1e7ee;font-weight:600}td{height:40px;padding:7px 10px;border-bottom:1px solid #edf1f5;color:#30465a}.preview-panel{margin-top:10px}.document-preview{max-width:980px;padding:18px 22px 22px}.document-preview h2{margin:0;color:#20374d;font-size:20px;text-align:center}.doc-meta{margin:12px 0 18px;padding-bottom:12px;border-bottom:1px solid #e3e8ef;color:#667486;font-size:13px;text-align:center}.document-preview section{margin-top:14px}.document-preview h3{margin:0 0 8px;color:#21364c;font-size:15px}.document-preview p{margin:0;color:#46586a;font-size:13px;line-height:1.9}@media(max-width:1100px){.top-layout,.middle-layout,.config-grid{grid-template-columns:1fr}.page-head{display:block}.page-head button{margin-top:12px}}
</style>
