<script setup>
const realtimeRows = [
  { student: '顾禾雨', issue: '年龄与年级不匹配', project: '基础信息', time: '10:32', status: '待确认', type: '逻辑错误' },
  { student: '陈思然', issue: '身高超出同龄范围', project: '体格检查', time: '10:36', status: '待复核', type: '超范围数据' },
  { student: '周若溪', issue: '身份证号缺失', project: '学生建档', time: '10:41', status: '待补录', type: '缺失字段' },
  { student: '林一凡', issue: '裸眼视力异常需复测', project: '视力检查', time: '10:48', status: '已提醒', type: '异常指标' },
  { student: '王子涵', issue: '体重与BMI计算结果不一致', project: '体格检查', time: '10:53', status: '处理中', type: '逻辑错误' },
]

const reviewRows = [
  { batch: '2026春季五健筛查-西湖区', students: '28600', checked: '28600', abnormal: '326', status: '总检中' },
  { batch: '2026春季五健筛查-拱墅区', students: '22400', checked: '22180', abnormal: '418', status: '待复核' },
  { batch: '2026春季五健筛查-滨江区', students: '19800', checked: '19800', abnormal: '156', status: '已完成' },
  { batch: '2026春季五健筛查-上城区', students: '25300', checked: '24960', abnormal: '209', status: '总检中' },
]

const rules = [
  ['身高异常范围校验', '采集时阻断明显超范围数据', '启用'],
  ['身份证重复校验', '发现同一学生多档案或重复建档', '启用'],
  ['年龄年级校验', '校验出生日期、年龄与所在年级关系', '启用'],
  ['指标逻辑校验', '核对BMI、视力、口腔等指标逻辑一致性', '启用'],
  ['必填字段完整性校验', '检查学生身份、学校、班级、项目结果缺失', '启用'],
]

const analysisItems = [
  ['实时拦截', '采集现场即时提示并要求确认'],
  ['批次总检', '筛查完成后按批次统一审核'],
  ['责任定位', '定位到学校、机构、项目和采集人员'],
  ['结果回写', '处理完成后同步更新质量状态'],
]

const flow = ['发现', '审核', '处理', '完成']
</script>

<template>
  <div class="quality-review-page">
    <div class="breadcrumb">单页面演示 &gt; 实时防错预警与事后总检</div>
    <section class="page-head">
      <div>
        <h1>实时防错预警与事后总检</h1>
        <p>五健筛查质量控制中心</p>
      </div>
      <div class="head-status">
        <span>当前批次</span>
        <strong>2026春季五健筛查</strong>
      </div>
    </section>

    <section class="summary-line">
      <div><span>实时预警</span><strong>42条</strong></div>
      <div><span>待确认问题</span><strong>18条</strong></div>
      <div><span>总检批次</span><strong>12个</strong></div>
      <div><span>闭环完成率</span><strong>86.4%</strong></div>
    </section>

    <section class="content-grid">
      <article class="panel realtime-panel">
        <header><h2>实时异常监控</h2><span>采集过程中实时发现并提示</span></header>
        <table>
          <thead><tr><th>学生</th><th>问题</th><th>检测项目</th><th>发现时间</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="row in realtimeRows" :key="row.student + row.time">
              <td>{{ row.student }}</td>
              <td><b>{{ row.issue }}</b><em>{{ row.type }}</em></td>
              <td>{{ row.project }}</td>
              <td>{{ row.time }}</td>
              <td><span class="state">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="panel rules-panel">
        <header><h2>质量规则</h2><span>当前启用规则</span></header>
        <ul>
          <li v-for="item in rules" :key="item[0]">
            <strong>{{ item[0] }}</strong>
            <span>{{ item[1] }}</span>
            <em>{{ item[2] }}</em>
          </li>
        </ul>
      </article>
    </section>

    <section class="panel review-panel">
      <header><h2>总检任务</h2><span>筛查完成后按批次集中审核</span></header>
      <table>
        <thead><tr><th>批次</th><th>学生数量</th><th>检查数量</th><th>异常数量</th><th>审核状态</th></tr></thead>
        <tbody>
          <tr v-for="row in reviewRows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.students }}</td>
            <td>{{ row.checked }}</td>
            <td>{{ row.abnormal }}</td>
            <td><span class="state">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="bottom-grid">
      <article class="panel">
        <header><h2>问题分析</h2><span>形成可处理的问题归因</span></header>
        <div class="analysis-list">
          <div v-for="item in analysisItems" :key="item[0]">
            <strong>{{ item[0] }}</strong>
            <span>{{ item[1] }}</span>
          </div>
        </div>
      </article>
      <article class="panel">
        <header><h2>处理闭环</h2><span>问题从发现到完成的处理流程</span></header>
        <div class="flow-line">
          <template v-for="(item, index) in flow" :key="item">
            <span>{{ item }}</span>
            <i v-if="index < flow.length - 1"></i>
          </template>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}.quality-review-page{height:100%;padding:12px;overflow:auto;color:#26384a;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:28px;color:#6a7684;font-size:12px}.page-head{min-height:76px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #d8e1ea}.page-head h1{margin:0;color:#20374d;font-size:22px}.page-head p{margin:8px 0 0;color:#657386;font-size:13px}.head-status{min-width:220px;padding-left:18px;border-left:1px solid #e1e7ee}.head-status span,.summary-line span{display:block;color:#6a7684;font-size:12px}.head-status strong{display:block;margin-top:7px;color:#1f3b57;font-size:15px}.summary-line{margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #d8e1ea}.summary-line div{min-height:66px;padding:12px 16px;border-right:1px solid #e4e9ef}.summary-line div:last-child{border-right:none}.summary-line strong{display:block;margin-top:8px;color:#173a5d;font-size:22px}.content-grid{margin-top:10px;display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:10px}.panel{background:#fff;border:1px solid #d8e1ea}.panel header{height:48px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #e3e8ef}.panel h2{margin:0;padding-left:9px;border-left:3px solid #3d78bf;color:#21364c;font-size:16px}.panel header span{color:#7b8794;font-size:12px}table{width:100%;border-collapse:collapse;font-size:12px}th{height:34px;padding:0 10px;text-align:left;color:#526477;background:#f6f8fa;border-bottom:1px solid #e1e7ee;font-weight:600}td{height:42px;padding:7px 10px;border-bottom:1px solid #edf1f5;color:#30465a}td b{display:block;color:#21364c;font-weight:600}td em{display:block;margin-top:3px;color:#718092;font-style:normal}.state{display:inline-block;height:22px;line-height:20px;padding:0 8px;border:1px solid #cbd8e6;background:#f7fafc;color:#315b82}.rules-panel ul{margin:0;padding:8px 14px;list-style:none}.rules-panel li{padding:10px 0;display:grid;grid-template-columns:minmax(0,1fr) 42px;gap:6px 10px;border-bottom:1px solid #eef2f6}.rules-panel li:last-child{border-bottom:none}.rules-panel strong{color:#20374d;font-size:13px}.rules-panel li span{grid-column:1 / 2;color:#667486;font-size:12px;line-height:1.5}.rules-panel em{grid-row:1 / 3;grid-column:2 / 3;align-self:center;text-align:center;color:#287044;font-style:normal}.review-panel,.bottom-grid{margin-top:10px}.bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.analysis-list{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-top:0}.analysis-list div{min-height:72px;padding:14px 16px;border-right:1px solid #edf1f5;border-bottom:1px solid #edf1f5}.analysis-list div:nth-child(2n){border-right:none}.analysis-list strong{display:block;color:#21364c;font-size:14px}.analysis-list span{display:block;margin-top:8px;color:#667486;font-size:12px}.flow-line{min-height:144px;padding:28px 24px;display:flex;align-items:center;justify-content:center;gap:12px;overflow:auto}.flow-line span{flex:0 0 auto;width:78px;height:34px;line-height:32px;text-align:center;border:1px solid #cbd8e6;background:#f8fafc;color:#243b53;font-size:13px}.flow-line i{flex:0 0 40px;height:1px;background:#b8c8d8;position:relative}.flow-line i::after{content:"";position:absolute;right:0;top:-3px;width:7px;height:7px;border-top:1px solid #8da3b8;border-right:1px solid #8da3b8;transform:rotate(45deg)}@media (max-width:1100px){.summary-line,.content-grid,.bottom-grid{grid-template-columns:1fr}.summary-line div{border-right:none;border-bottom:1px solid #e4e9ef}.summary-line div:last-child{border-bottom:none}.page-head{display:block}.head-status{margin-top:12px;padding-left:0;border-left:none}}
</style>
