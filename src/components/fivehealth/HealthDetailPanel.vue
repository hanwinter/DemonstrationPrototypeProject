<script setup>
const props = defineProps({ item: { type: Object, required: true }, mode: { type: String, required: true }, meta: { type: Object, required: true } })
</script>

<template>
  <article class="panel detail-panel">
    <div class="panel-title"><h3>健康详情</h3><em :class="item.severity">{{ meta[item.severity][0] }}</em></div>
    <div class="detail-name"><span>{{ item.category }}</span><h2>{{ item.name }}</h2></div>
    <dl>
      <div><dt>检查结果</dt><dd>{{ item.resultLabel }}：{{ item.value }}</dd></div>
      <div><dt>参考范围</dt><dd>{{ item.reference }}</dd></div>
      <div><dt>风险等级</dt><dd>{{ meta[item.severity][0] }}</dd></div>
    </dl>
    <div class="advice"><h4>{{ mode==='doctor'?'干预建议':'给家长的建议' }}</h4><p>{{ mode==='doctor' ? item.advice : item.parentAdvice }}</p></div>
    <div class="referral"><span>建议就诊科室：</span><strong>{{ item.referral }}</strong></div>
  </article>
</template>

<style scoped>
.panel{background:#fff;border:1px solid var(--border-color)}.panel-title{height:44px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e7ebf0}.panel-title h3{margin:0;font-size:15px}.panel-title em{padding:4px 8px;font-size:12px;font-style:normal}.detail-name{padding:12px 14px 8px}.detail-name span{color:#447afc;font-size:12px}.detail-name h2{margin:5px 0 0;font-size:18px}dl{margin:0 14px;display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid #e4e9ef}dl div{padding:10px;border-left:1px solid #e4e9ef}dl div:first-child{border-left:0}dt{margin-bottom:6px;color:#8995a4;font-size:12px}dd{margin:0;color:#2f3b4d;font-size:14px;font-weight:600}.advice{margin:12px 14px;padding:12px;display:flex;gap:12px;background:#f5f8ff;border-left:3px solid #447afc}.advice h4{flex:none;margin:2px 0 0;font-size:14px}.advice p{flex:1;margin:0;color:#586779;line-height:1.7}.referral{margin:0 14px 14px;padding:10px 12px;display:flex;background:#f8fafc;border:1px solid #e4e9ef}.referral span{color:#7e8998}.referral strong{color:#447afc}.low{color:#a86d0f;background:#fff5dd}.moderate{color:#d85c22;background:#fff0e9}.high{color:#cf3535;background:#ffeded}
</style>
