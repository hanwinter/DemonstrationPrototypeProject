<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const issueId = route.params.id || 'QC20260812001'
const baseInfo = [
  ['问题编号', issueId],
  ['问题类型', '漏筛'],
  ['发现时间', '2026-08-10'],
  ['来源', '2026春季五健筛查'],
]
const objectInfo = [
  ['区域', '杭州市西湖区'],
  ['机构', '西湖区妇幼保健院'],
  ['学校', '宁安路小学'],
  ['涉及学生', '12人'],
]
const timeline = [
  ['08-10', '系统发现问题', '系统按应筛名单与实际筛查记录比对，发现12名学生未完成筛查。'],
  ['08-11', '已通知学校核查', '责任任务派发至宁安路小学，要求核对学生在校与请假情况。'],
  ['08-12', '等待补录', '学校提交初步名单，医疗机构等待补筛记录补录后复核关闭。'],
]
</script>

<template>
  <div class="detail-page">
    <div class="breadcrumb">单页面演示 &gt; 质量控制与预警管理 &gt; 问题详情</div>
    <section class="title-bar">
      <div><h2>问题详情</h2><span>儿童青少年五健筛查质量问题整改跟踪</span></div>
      <button type="button" @click="router.push('/demo-pages/quality-control')">返回列表</button>
    </section>
    <section class="detail-grid">
      <div class="panel">
        <header>基础信息</header>
        <p v-for="item in baseInfo" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></p>
      </div>
      <div class="panel">
        <header>问题对象</header>
        <p v-for="item in objectInfo" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></p>
      </div>
      <div class="panel handling">
        <header>处理记录</header>
        <article v-for="item in timeline" :key="item[0]">
          <time>{{ item[0] }}</time>
          <div><strong>{{ item[1] }}</strong><span>{{ item[2] }}</span></div>
        </article>
      </div>
      <div class="panel action-panel">
        <header>整改处理</header>
        <label>处理状态<select><option>等待补录</option><option>整改中</option><option>复核通过</option></select></label>
        <label>整改说明<textarea value="已通知学校核查漏筛名单，等待补筛记录回传。"></textarea></label>
        <div><button class="primary-btn" type="button">保存处理</button><button type="button">复核关闭</button></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-page{height:100%;display:flex;flex-direction:column;overflow:hidden;color:#333;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:32px;padding:0 10px;display:flex;align-items:center;border:1px solid #d8d8d8;background:#fff;font-size:13px}.title-bar{height:58px;margin-top:8px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;border:1px solid #d8d8d8;background:#fff}.title-bar h2{margin:0 0 5px;font-size:16px;color:#244b70}.title-bar span{color:#666;font-size:12px}button{height:27px;padding:0 10px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}.primary-btn{border-color:#9fb7cf;background:#dceafa;color:#244b70}.detail-grid{min-height:0;flex:1;margin-top:8px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:170px minmax(0,1fr);gap:8px}.panel{border:1px solid #d8d8d8;background:#fff;overflow:auto}.panel header{height:32px;padding:0 10px;display:flex;align-items:center;border-bottom:1px solid #d8d8d8;background:#f1f1f1;font-size:12px;font-weight:600}.panel p{height:32px;margin:0;padding:0 12px;display:grid;grid-template-columns:110px 1fr;align-items:center;border-bottom:1px solid #edf0f2;font-size:12px}.panel p span{color:#666}.panel p strong{font-weight:500}.handling article{display:grid;grid-template-columns:76px minmax(0,1fr);gap:10px;padding:12px;border-bottom:1px solid #edf0f2;font-size:12px}.handling time{height:26px;display:grid;place-items:center;border:1px solid #cfd6df;background:#f7f9fb;color:#244b70}.handling strong,.handling span{display:block;line-height:1.7}.handling span{color:#555}.action-panel{padding-bottom:12px}.action-panel label{margin:12px;display:flex;flex-direction:column;gap:6px;font-size:12px}.action-panel select,.action-panel textarea{border:1px solid #bfc7d1;border-radius:2px;background:#fff;font-size:12px}.action-panel select{height:28px;width:160px}.action-panel textarea{height:92px;padding:8px;resize:none}.action-panel div{padding:0 12px;display:flex;gap:8px}
</style>
