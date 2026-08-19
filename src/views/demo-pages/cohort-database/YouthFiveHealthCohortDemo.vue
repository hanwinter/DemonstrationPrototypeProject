<script setup>
import { computed, ref } from 'vue'

const catalog = [
  { group: '视力健康', queues: [{ name: '近视高风险队列', count: 1260 }, { name: '视力下降队列', count: 850 }, { name: '高度近视重点队列', count: 120 }] },
  { group: '口腔健康', queues: [{ name: '龋齿干预队列', count: 680 }, { name: '口腔卫生关注队列', count: 420 }] },
  { group: '体重健康', queues: [{ name: '超重队列', count: 560 }, { name: '肥胖队列', count: 310 }, { name: '重度肥胖重点队列', count: 86 }] },
  { group: '脊柱健康', queues: [{ name: '脊柱侧弯风险队列', count: 218 }, { name: '体态异常关注队列', count: 392 }] },
  { group: '心理健康', queues: [{ name: '心理关注队列', count: 286 }, { name: '高风险心理队列', count: 58 }, { name: '持续干预队列', count: 132 }] },
]
const activeQueue = ref('近视高风险队列')
const selectedStudent = ref('顾禾雨')
const activeMeta = computed(() => catalog.flatMap((item) => item.queues.map((queue) => ({ ...queue, group: item.group }))).find((item) => item.name === activeQueue.value) || { group: '视力健康', name: '近视高风险队列', count: 1260 })

const metrics = [
  ['队列人数', '1260人'],
  ['新增', '85人'],
  ['退出', '32人'],
  ['持续管理', '1143人'],
  ['高风险', '126人'],
]
const risks = [
  ['一般风险', 38],
  ['中风险', 31],
  ['高风险', 21],
  ['重点风险', 10],
]
const progress = [
  ['待复筛', '326人'],
  ['复筛中', '185人'],
  ['随访中', '520人'],
  ['干预中', '210人'],
  ['已改善', '168人'],
]
const effects = [
  ['改善人数', '168'],
  ['稳定人数', '642'],
  ['风险升级人数', '46'],
  ['退出队列人数', '32'],
]
const distribution = [
  ['西湖区', 326],
  ['拱墅区', 285],
  ['滨江区', 214],
  ['上城区', 188],
]
const members = [
  { name: '顾禾雨', gender: '女', age: '13岁', school: '宁安路第一中学', risk: '高风险', join: '2026-04-10', exam: '2026-06-18', stage: '随访中', follow: '2026-06-20' },
  { name: '陈思然', gender: '女', age: '12岁', school: '文澜实验学校', risk: '中风险', join: '2026-04-12', exam: '2026-06-16', stage: '复筛中', follow: '2026-06-18' },
  { name: '周若溪', gender: '女', age: '14岁', school: '翠苑第二中学', risk: '重点风险', join: '2026-04-15', exam: '2026-06-21', stage: '干预中', follow: '2026-06-24' },
  { name: '林一凡', gender: '男', age: '13岁', school: '实验中学', risk: '高风险', join: '2026-04-18', exam: '2026-06-19', stage: '随访中', follow: '2026-06-23' },
]
const records = [
  ['2026-04-10', '筛查发现视力异常，加入近视高风险队列'],
  ['2026-04-18', '完成复筛，风险等级：高风险'],
  ['2026-05-02', '人工随访，家长已知晓并确认复查计划'],
  ['2026-06-18', '复查，裸眼视力指标有所改善'],
]
const trend = [820, 920, 1030, 1110, 1190, 1260]
const dialogVisible = ref(false)
</script>

<template>
  <div class="cohort-page">
    <div class="breadcrumb">单页面演示 &gt; 青少年五健队列数据库</div>
    <section class="page-head">
      <div><h1>青少年五健队列数据库</h1></div>
      <div class="daily-tip"><span>今日新增入队：18人</span><span>风险升级：6人</span><span>完成退出：4人</span></div>
    </section>

    <section class="cohort-layout">
      <aside class="queue-nav">
        <header>队列目录</header>
        <section v-for="group in catalog" :key="group.group">
          <h2>{{ group.group }}</h2>
          <button v-for="queue in group.queues" :key="queue.name" type="button" :class="{ active: activeQueue === queue.name }" @click="activeQueue = queue.name">
            <span>{{ queue.name }}</span><em>{{ queue.count }}人</em>
          </button>
        </section>
      </aside>

      <main class="cohort-main">
        <section class="panel queue-summary">
          <header><h2>{{ activeMeta.name }}</h2><button type="button" @click="dialogVisible = true">配置规则</button></header>
          <div class="metric-strip"><div v-for="item in metrics" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></div></div>
          <div class="rule-box">
            <p><span>所属专项：</span>{{ activeMeta.group }}</p>
            <p><span>风险等级：</span>高风险</p>
          </div>
        </section>

        <section class="top-grid">
          <article class="panel"><header><h2>风险分布</h2></header><div class="bar-list"><p v-for="item in risks" :key="item[0]"><span>{{ item[0] }}</span><i><b :style="{ width: item[1] + '%' }"></b></i><em>{{ item[1] }}%</em></p></div></article>
          <article class="panel"><header><h2>管理进展</h2></header><div class="mini-grid"><div v-for="item in progress" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></div></div></article>
          <article class="panel"><header><h2>队列干预效果</h2></header><div class="mini-grid two"><div v-for="item in effects" :key="item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></div></div><div class="trend"><i v-for="(item,index) in trend" :key="index" :style="{ height: item / 14 + 'px' }"></i></div></article>
        </section>

        <section class="panel members-panel">
          <header>
            <h2>队列成员</h2>
            <div class="filters"><select><option>区域</option></select><select><option>学校</option></select><select><option>年级</option></select><select><option>风险等级</option></select><select><option>管理状态</option></select></div>
          </header>
          <table>
            <thead><tr><th>姓名</th><th>性别</th><th>年龄</th><th>学校</th><th>当前风险</th><th>入队时间</th><th>最近筛查</th><th>当前管理阶段</th><th>最近随访</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="row in members" :key="row.name">
                <td>{{ row.name }}</td><td>{{ row.gender }}</td><td>{{ row.age }}</td><td>{{ row.school }}</td><td>{{ row.risk }}</td><td>{{ row.join }}</td><td>{{ row.exam }}</td><td>{{ row.stage }}</td><td>{{ row.follow }}</td>
                <td><button type="button">查看档案</button><button type="button" @click="selectedStudent = row.name">管理记录</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="bottom-grid">
          <article class="panel"><header><h2>管理记录：{{ selectedStudent }}</h2></header><div class="timeline"><p v-for="item in records" :key="item[0]"><strong>{{ item[0] }}</strong><span>{{ item[1] }}</span></p></div></article>
          <article class="panel"><header><h2>队列分布</h2></header><div class="bar-list area"><p v-for="item in distribution" :key="item[0]"><span>{{ item[0] }}</span><i><b :style="{ width: item[1] / 4 + '%' }"></b></i><em>{{ item[1] }}人</em></p></div></article>
        </section>
      </main>
    </section>

    <div v-if="dialogVisible" class="dialog-mask">
      <section class="rule-dialog">
        <header><h2>配置规则</h2><button type="button" @click="dialogVisible = false">×</button></header>
        <div><label>专项<input value="视力健康" /></label><label>风险等级<input value="高风险" /></label><label>入队条件<textarea value="裸眼视力异常；远视储备不足；屈光状态达到风险阈值"></textarea></label></div>
        <footer><button type="button" @click="dialogVisible = false">取消</button><button type="button" class="primary" @click="dialogVisible = false">保存</button></footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}.cohort-page{height:100%;padding:12px;overflow:auto;color:#26384a;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:28px;color:#6a7684;font-size:12px}.page-head{min-height:70px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #d8e1ea}.page-head h1{margin:0;color:#20374d;font-size:22px}.page-head span{display:block;margin-top:6px;color:#657386;font-size:12px}.daily-tip{display:flex;gap:10px}.daily-tip span{height:28px;line-height:26px;padding:0 10px;border:1px solid #cbd8e6;background:#f7fafc;color:#315b82}.cohort-layout{margin-top:10px;display:grid;grid-template-columns:220px minmax(0,1fr);gap:10px}.queue-nav,.panel{background:#fff;border:1px solid #d8e1ea}.queue-nav{align-self:start}.queue-nav header{height:44px;padding:0 12px;line-height:44px;border-bottom:1px solid #e3e8ef;color:#21364c;font-weight:700}.queue-nav section{padding:8px;border-bottom:1px solid #edf1f5}.queue-nav h2{margin:0 0 6px;color:#526477;font-size:13px}.queue-nav button{width:100%;min-height:30px;padding:0 6px;display:flex;justify-content:space-between;align-items:center;border:1px solid transparent;background:#fff;color:#30465a;font-size:12px;cursor:pointer}.queue-nav button.active,.queue-nav button:hover{border-color:#c7d8e9;background:#f7fbff;color:#1f5d9d}.queue-nav em{font-style:normal;color:#7b8794}.cohort-main{min-width:0}.panel{margin-bottom:10px}.panel header{height:46px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3e8ef}.panel h2{margin:0;padding-left:9px;border-left:3px solid #3d78bf;color:#21364c;font-size:16px}.panel header button,.members-panel button,.rule-dialog button{height:26px;padding:0 8px;border:1px solid #bdc8d4;background:#fff;color:#30465a;cursor:pointer}.metric-strip{display:grid;grid-template-columns:repeat(5,1fr);border-bottom:1px solid #edf1f5}.metric-strip div{padding:10px 14px;border-right:1px solid #edf1f5}.metric-strip div:last-child{border-right:none}.metric-strip span,.mini-grid span{display:block;color:#6a7684;font-size:12px}.metric-strip strong,.mini-grid strong{display:block;margin-top:6px;color:#173a5d;font-size:19px}.rule-box{padding:10px 14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;color:#34495e;font-size:13px}.rule-box p{margin:0}.rule-box span{color:#6a7684}.top-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.bar-list{padding:12px 14px}.bar-list p{margin:0 0 10px;display:grid;grid-template-columns:76px 1fr 48px;gap:10px;align-items:center;color:#44566c;font-size:12px}.bar-list i{height:8px;background:#eef3f7}.bar-list b{display:block;height:100%;background:#7ea4c8}.bar-list em{font-style:normal;text-align:right}.mini-grid{padding:12px 14px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.mini-grid.two{grid-template-columns:repeat(2,1fr);padding-bottom:8px}.trend{height:66px;padding:0 14px 12px;display:flex;align-items:flex-end;gap:8px}.trend i{flex:1;background:#9fb7cf}.members-panel header{height:auto;min-height:50px;gap:12px}.filters{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.filters select{height:26px;border:1px solid #cfd8e3;background:#fff;font-size:12px}table{width:100%;border-collapse:collapse;font-size:12px}th{height:34px;padding:0 8px;text-align:left;color:#526477;background:#f6f8fa;border-bottom:1px solid #e1e7ee}td{height:40px;padding:7px 8px;border-bottom:1px solid #edf1f5;color:#30465a}td button{margin-right:6px;border:0;background:transparent;color:#2f75bd}.bottom-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:10px}.timeline{padding:10px 14px}.timeline p{margin:0;padding:0 0 12px 94px;position:relative;border-left:1px solid #d8e1ea;color:#34495e}.timeline strong{position:absolute;left:12px;color:#21364c}.timeline span{display:block}.area p{grid-template-columns:64px 1fr 54px}.dialog-mask{position:fixed;inset:0;display:grid;place-items:center;background:rgba(20,34,48,.28);z-index:20}.rule-dialog{width:440px;background:#fff;border:1px solid #bfcbd8}.rule-dialog header{height:46px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e3e8ef}.rule-dialog h2{margin:0;font-size:16px}.rule-dialog header button{border:0;font-size:20px}.rule-dialog div{padding:14px;display:grid;gap:10px}.rule-dialog label{display:grid;gap:6px;color:#44566c;font-size:13px}.rule-dialog input,.rule-dialog textarea{width:100%;border:1px solid #cfd8e3;padding:6px}.rule-dialog textarea{min-height:80px}.rule-dialog footer{height:46px;padding:0 14px;display:flex;align-items:center;justify-content:flex-end;gap:8px;border-top:1px solid #e3e8ef}.rule-dialog .primary{border-color:#2f75bd;background:#3d78bf;color:#fff}@media(max-width:1100px){.cohort-layout,.top-grid,.bottom-grid{grid-template-columns:1fr}.page-head{display:block}.daily-tip{margin-top:10px;flex-wrap:wrap}.metric-strip{grid-template-columns:1fr 1fr}.rule-box{grid-template-columns:1fr}}
</style>
