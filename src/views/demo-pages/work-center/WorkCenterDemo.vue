<script setup>
import { computed, ref } from 'vue'

const roles = [
  {
    key: 'health',
    name: '卫生健康行政部门',
    unit: '市卫健委儿童青少年健康管理专班',
    focus: '监管筛查进度、异常闭环、质量预警与跨机构协同',
    indicators: [
      ['辖区任务', '18个'],
      ['学校覆盖', '92.7%'],
      ['异常闭环率', '81.6%'],
      ['待督办事项', '12项'],
    ],
    workItems: [
      ['任务监管', '2026春季五健筛查区域进度核验', '待研判', '今日 10:30'],
      ['质量预警', '3所学校视力数据缺项率超过阈值', '需督办', '今日 09:20'],
      ['复筛闭环', '高风险学生复筛完成率低于计划', '跟进中', '昨日 16:40'],
      ['协同处理', '教育局申请调整两所学校筛查排期', '待确认', '昨日 14:05'],
    ],
    collaboration: [
      ['教育管理部门', '同步学校排期与参检组织情况'],
      ['体检机构', '反馈质量整改与复筛安排'],
      ['学校', '确认异常学生家校通知进展'],
    ],
  },
  {
    key: 'education',
    name: '教育管理部门',
    unit: '区教育局体卫艺科',
    focus: '组织学校参检、协调排期、推动异常学生家校沟通',
    indicators: [
      ['纳入学校', '126所'],
      ['排期完成', '118所'],
      ['待组织参检', '8所'],
      ['家校通知待确认', '326人'],
    ],
    workItems: [
      ['学校组织', '核对本周入校筛查班级和场地', '待处理', '今日 11:00'],
      ['通知回执', '异常学生家长通知回执待学校补录', '处理中', '今日 09:45'],
      ['排期协调', '滨江育才小学申请调整筛查时间', '待确认', '昨日 17:10'],
      ['数据查看', '区域筛查完成情况周报待查看', '已推送', '昨日 15:00'],
    ],
    collaboration: [
      ['卫生健康行政部门', '接收区域任务与风险督办'],
      ['学校', '下发排期、通知与组织要求'],
      ['体检机构', '确认入校时间、人员与设备安排'],
    ],
  },
  {
    key: 'exam',
    name: '体检机构',
    unit: '五健筛查执行机构',
    focus: '承接筛查任务、执行体检、上传数据、处理质控反馈',
    indicators: [
      ['今日任务', '6场'],
      ['待上传数据', '428人'],
      ['质控待整改', '7项'],
      ['报告待生成', '125份'],
    ],
    workItems: [
      ['入校执行', '实验小学三年级五健筛查任务', '执行中', '今日 08:30'],
      ['数据上传', '口腔检查结果待批量上传', '待处理', '今日 12:00'],
      ['质量整改', '身高体重单位异常数据待修正', '需整改', '昨日 18:20'],
      ['复筛安排', '视力异常学生复筛名单待确认', '待确认', '昨日 15:35'],
    ],
    collaboration: [
      ['学校', '确认场地、班级动线与学生名单'],
      ['卫生健康行政部门', '接收质控规则与整改要求'],
      ['教育管理部门', '同步执行进度与排期冲突'],
    ],
  },
  {
    key: 'school',
    name: '学校',
    unit: '实验小学卫生室',
    focus: '维护学生名单、组织参检、接收报告、跟踪家长反馈',
    indicators: [
      ['本校应检', '860人'],
      ['已参检', '812人'],
      ['待补检', '48人'],
      ['异常待通知', '76人'],
    ],
    workItems: [
      ['名单核对', '五年级学生名单与学籍信息确认', '待处理', '今日 09:00'],
      ['现场组织', '下午筛查班级候检顺序安排', '进行中', '今日 13:30'],
      ['家长通知', '视力异常学生报告待发送家长', '待处理', '昨日 17:20'],
      ['补检跟踪', '请假学生补检名单待上报', '待确认', '昨日 16:10'],
    ],
    collaboration: [
      ['教育管理部门', '接收排期要求和组织通知'],
      ['体检机构', '确认学生名单、场地与补检安排'],
      ['家长', '推送报告、复筛与随访提醒'],
    ],
  },
]

const activeRole = ref('health')
const workspace = computed(() => roles.find((item) => item.key === activeRole.value) || roles[0])
</script>

<template>
  <div class="work-center-page">
    <div class="breadcrumb">单页面演示 &gt; 工作中心</div>
    <section class="work-header">
      <div>
        <h1>工作中心</h1>
      </div>
      <div class="role-switch">
        <button v-for="role in roles" :key="role.key" type="button" :class="{ active: activeRole === role.key }" @click="activeRole = role.key">
          {{ role.name }}
        </button>
      </div>
    </section>

    <section class="workspace-strip">
      <div>
        <span>当前角色</span>
        <strong>{{ workspace.name }}</strong>
      </div>
      <div>
        <span>工作单位</span>
        <strong>{{ workspace.unit }}</strong>
      </div>
      <div>
        <span>工作重点</span>
        <strong>{{ workspace.focus }}</strong>
      </div>
    </section>

    <section class="metrics-line">
      <div v-for="item in workspace.indicators" :key="item[0]">
        <span>{{ item[0] }}</span>
        <strong>{{ item[1] }}</strong>
      </div>
    </section>

    <section class="work-layout">
      <div class="work-panel main-panel">
        <div class="panel-title">
          <h2>待办工作</h2>
          <span>按角色显示当前最需要处理的业务事项</span>
        </div>
        <div class="task-list">
          <button v-for="item in workspace.workItems" :key="item[0] + item[1]" type="button" class="task-row">
            <span class="task-type">{{ item[0] }}</span>
            <strong>{{ item[1] }}</strong>
            <em>{{ item[2] }}</em>
            <small>{{ item[3] }}</small>
          </button>
        </div>
      </div>

      <div class="work-panel">
        <div class="panel-title">
          <h2>协同对象</h2>
        </div>
        <ul class="collab-list">
          <li v-for="item in workspace.collaboration" :key="item[0]">
            <strong>{{ item[0] }}</strong>
            <span>{{ item[1] }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="work-panel process-panel">
      <div class="panel-title">
        <h2>业务链路</h2>
      </div>
      <div class="process-flow">
        <span>任务下发</span>
        <i></i>
        <span>学校组织</span>
        <i></i>
        <span>入校筛查</span>
        <i></i>
        <span>数据质控</span>
        <i></i>
        <span>报告反馈</span>
        <i></i>
        <span>复筛随访</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}.work-center-page{height:100%;padding:12px;overflow:auto;color:#26384a;background:#f5f6f7;font-family:"Microsoft YaHei",Arial,sans-serif}.breadcrumb{height:28px;color:#6a7684;font-size:12px}.work-header{min-height:86px;padding:14px 16px;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;background:#fff;border:1px solid #d8e1ea}.work-header h1{margin:0;color:#20374d;font-size:22px}.work-header p{margin:8px 0 0;color:#657386;font-size:13px}.role-switch{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;max-width:560px}.role-switch button{height:30px;padding:0 12px;border:1px solid #c8d4df;border-radius:2px;background:#fff;color:#2f4052;font-size:12px;cursor:pointer}.role-switch button.active{border-color:#3d78bf;background:#eaf3ff;color:#1f5d9d;font-weight:700}.workspace-strip{margin-top:10px;padding:12px 16px;display:grid;grid-template-columns:180px 260px minmax(0,1fr);gap:16px;background:#fff;border:1px solid #d8e1ea}.workspace-strip div{min-width:0}.workspace-strip span,.metrics-line span{display:block;color:#6a7684;font-size:12px}.workspace-strip strong{display:block;margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#21364c;font-size:14px}.metrics-line{margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d8e1ea;background:#fff}.metrics-line div{min-height:68px;padding:12px 16px;border-right:1px solid #e3e8ef}.metrics-line div:last-child{border-right:none}.metrics-line strong{display:block;margin-top:8px;color:#173a5d;font-size:22px}.work-layout{margin-top:10px;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:10px}.work-panel{background:#fff;border:1px solid #d8e1ea}.panel-title{height:50px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #e3e8ef}.panel-title h2{margin:0;padding-left:9px;border-left:3px solid #3d78bf;color:#21364c;font-size:16px}.panel-title span{color:#7b8794;font-size:12px}.task-list{padding:6px 0}.task-row{width:100%;min-height:48px;padding:8px 14px;display:grid;grid-template-columns:88px minmax(0,1fr) 76px 92px;gap:10px;align-items:center;border:0;border-bottom:1px solid #eef2f6;background:#fff;text-align:left;cursor:pointer}.task-row:hover{background:#f7fbff}.task-row:last-child{border-bottom:none}.task-type{height:24px;line-height:22px;text-align:center;border:1px solid #cbd8e6;background:#f6f9fc;color:#315b82;font-size:12px}.task-row strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#22384e;font-size:13px}.task-row em{font-style:normal;color:#be5b00;font-size:12px}.task-row small{color:#788594;font-size:12px;text-align:right}.collab-list{margin:0;padding:10px 14px;list-style:none}.collab-list li{padding:10px 0;border-bottom:1px solid #eef2f6}.collab-list li:last-child{border-bottom:none}.collab-list strong{display:block;color:#21364c;font-size:13px}.collab-list span{display:block;margin-top:5px;color:#667486;font-size:12px;line-height:1.6}.process-panel{margin-top:10px}.process-flow{padding:18px 20px;display:flex;align-items:center;gap:10px;overflow:auto}.process-flow span{flex:0 0 auto;height:30px;line-height:28px;padding:0 14px;border:1px solid #cbd8e6;background:#f8fafc;color:#243b53;font-size:13px}.process-flow i{flex:0 0 28px;height:1px;background:#b8c8d8;position:relative}.process-flow i::after{content:"";position:absolute;right:0;top:-3px;width:7px;height:7px;border-top:1px solid #8da3b8;border-right:1px solid #8da3b8;transform:rotate(45deg)}@media (max-width:1000px){.workspace-strip,.metrics-line,.work-layout{grid-template-columns:1fr}.metrics-line div{border-right:none;border-bottom:1px solid #e3e8ef}.metrics-line div:last-child{border-bottom:none}.work-header{display:block}.role-switch{margin-top:12px;justify-content:flex-start}}
</style>
