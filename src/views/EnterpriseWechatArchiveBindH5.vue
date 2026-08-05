<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref('form')
const form = ref({
  phone: '',
  code: '',
  idLast4: '',
})
const codeSent = ref(false)
const foundPatient = {
  id: 'P20260731001',
  name: '张女士',
  gestation: '28周',
  dueDate: '2026-09-20',
  risk: '高风险',
  externalUserId: 'wo_10001',
}

const bottomButtonText = computed(() => {
  if (step.value === 'found') return '确认绑定'
  if (step.value === 'success') return '进入孕产服务'
  return '查询孕产档案'
})

function sendCode() {
  codeSent.value = true
  form.value.code = '123456'
  ElMessage.success('验证码已发送，演示环境已自动填入')
}

function queryArchive() {
  if (form.value.phone === '00000000000') {
    step.value = 'notFound'
    return
  }
  if (form.value.phone === '19999999999') {
    step.value = 'bound'
    return
  }
  step.value = 'found'
}

function confirmBind() {
  step.value = 'success'
}

function primaryAction() {
  if (step.value === 'found') {
    confirmBind()
    return
  }
  if (step.value === 'success') {
    ElMessage.success('已进入孕产服务演示')
    return
  }
  queryArchive()
}

function resetForm() {
  step.value = 'form'
}
</script>

<template>
  <main class="bind-h5">
    <header class="h5-header">
      <button type="button" @click="router.back()"><el-icon><ArrowLeft /></el-icon></button>
      <h1>绑定孕产档案</h1>
      <span></span>
    </header>

    <section class="content">
      <article class="welcome-card">
        <span class="eyebrow">欢迎加入</span>
        <h2>XX医院孕产服务中心</h2>
        <p>为了提供孕周管理、产检提醒、检查报告查询和健康指导，请绑定您的孕产档案。</p>
        <div class="service-tags">
          <span>孕周管理</span>
          <span>产检提醒</span>
          <span>报告查询</span>
          <span>健康指导</span>
        </div>
      </article>

      <article v-if="step === 'form'" class="form-card">
        <h3>验证孕产信息</h3>
        <label>
          <span>手机号</span>
          <input v-model="form.phone" inputmode="tel" placeholder="请输入建档手机号" />
        </label>
        <label>
          <span>验证码</span>
          <div class="code-row">
            <input v-model="form.code" inputmode="numeric" placeholder="请输入验证码" />
            <button type="button" @click="sendCode">{{ codeSent ? '重新获取' : '获取验证码' }}</button>
          </div>
        </label>
        <label>
          <span>身份证后四位</span>
          <input v-model="form.idLast4" inputmode="numeric" maxlength="4" placeholder="请输入身份证后四位" />
        </label>
        <div class="mock-tips">
          <button type="button" @click="form.phone = '13888888888'; form.idLast4 = '1001'; form.code = '123456'">填入成功示例</button>
          <button type="button" @click="form.phone = '00000000000'; form.idLast4 = '0000'; form.code = '123456'">未找到档案</button>
          <button type="button" @click="form.phone = '19999999999'; form.idLast4 = '9999'; form.code = '123456'">已绑定其他微信</button>
        </div>
      </article>

      <article v-else-if="step === 'found'" class="result-card">
        <div class="status-mark soft"><el-icon><Check /></el-icon></div>
        <h3>已找到您的孕产档案</h3>
        <div class="patient-card">
          <div><span>姓名</span><strong>{{ foundPatient.name }}</strong></div>
          <div><span>孕周</span><strong>{{ foundPatient.gestation }}</strong></div>
          <div><span>预产期</span><strong>{{ foundPatient.dueDate }}</strong></div>
          <div><span>风险等级</span><strong class="risk">{{ foundPatient.risk }}</strong></div>
        </div>
      </article>

      <article v-else-if="step === 'success'" class="result-card success-card">
        <div class="status-mark"><el-icon><Check /></el-icon></div>
        <h3>绑定成功</h3>
        <p>您的孕产档案已关联企业微信，后续可接收产检提醒及健康服务。</p>
        <div class="patient-card">
          <div><span>患者ID</span><strong>{{ foundPatient.id }}</strong></div>
          <div><span>企业微信客户ID</span><strong>{{ foundPatient.externalUserId }}</strong></div>
        </div>
      </article>

      <article v-else-if="step === 'notFound'" class="result-card warn-card">
        <h3>未找到档案</h3>
        <p>未查询到您的孕产档案，请确认手机号是否为建档手机号。</p>
        <button type="button" class="ghost-action" @click="resetForm">重新填写</button>
      </article>

      <article v-else-if="step === 'bound'" class="result-card warn-card">
        <h3>已绑定其他微信</h3>
        <p>该孕产档案已绑定其他微信客户，如需更换请联系工作人员。</p>
        <button type="button" class="ghost-action" @click="resetForm">重新填写</button>
      </article>
    </section>

    <footer class="fixed-bottom" v-if="step !== 'notFound' && step !== 'bound'">
      <button type="button" @click="primaryAction">{{ bottomButtonText }}</button>
    </footer>
  </main>
</template>

<style scoped>
.bind-h5{min-height:100vh;max-width:430px;margin:0 auto;padding-bottom:86px;color:#24354d;background:#eef7f5;font-family:"Microsoft YaHei",Arial,sans-serif}.h5-header{position:sticky;top:0;z-index:2;height:52px;padding:0 14px;display:grid;grid-template-columns:40px 1fr 40px;align-items:center;background:rgba(248,252,251,.96);backdrop-filter:blur(8px);border-bottom:1px solid #dce9e5}.h5-header button{width:36px;height:36px;border:0;border-radius:18px;background:#e8f2ef;color:#2d6f62}.h5-header h1{margin:0;text-align:center;font-size:17px}.content{padding:14px}.welcome-card,.form-card,.result-card{border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(34,91,78,.08)}.welcome-card{padding:22px 18px;margin-bottom:14px;background:linear-gradient(150deg,#ffffff,#eaf8f3)}.eyebrow{display:inline-flex;margin-bottom:8px;color:#2c8a73;font-size:13px}.welcome-card h2{margin:0 0 10px;font-size:22px;color:#173b35}.welcome-card p{margin:0;color:#60756f;line-height:1.7}.service-tags{margin-top:14px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.service-tags span{padding:8px 10px;border-radius:999px;background:#edf8f5;color:#2f7165;text-align:center;font-size:13px}.form-card{padding:18px}.form-card h3,.result-card h3{margin:0 0 16px;font-size:18px}.form-card label{display:block;margin-bottom:14px}.form-card label>span{display:block;margin-bottom:8px;color:#61726e;font-size:13px}.form-card input{width:100%;height:44px;padding:0 12px;border:1px solid #d8e5e1;border-radius:12px;background:#fbfefd;font-size:15px;outline:none}.form-card input:focus{border-color:#42a88f}.code-row{display:grid;grid-template-columns:1fr 104px;gap:8px}.code-row button,.mock-tips button{border:0;border-radius:12px;background:#e2f3ee;color:#237563;font-weight:600}.mock-tips{display:grid;grid-template-columns:1fr;gap:8px;margin-top:4px}.mock-tips button{height:36px}.result-card{padding:22px 18px;text-align:center}.status-mark{width:58px;height:58px;margin:0 auto 14px;display:grid;place-items:center;border-radius:50%;background:#25b785;color:#fff;font-size:28px}.status-mark.soft{background:#e7f7f1;color:#24a97b}.result-card p{margin:0 0 16px;color:#60756f;line-height:1.8}.patient-card{display:grid;gap:10px;text-align:left}.patient-card div{padding:12px;border-radius:12px;background:#f6faf9}.patient-card span{display:block;margin-bottom:5px;color:#71807c;font-size:13px}.patient-card strong{font-size:15px}.risk{color:#d95145}.warn-card{border:1px solid #f1c7c2}.ghost-action{width:100%;height:42px;border:1px solid #d7e4e0;border-radius:12px;background:#fff;color:#276b5f;font-weight:700}.fixed-bottom{position:fixed;left:50%;bottom:0;width:min(430px,100vw);transform:translateX(-50%);padding:12px 14px 18px;background:rgba(248,252,251,.96);border-top:1px solid #dce9e5}.fixed-bottom button{width:100%;height:48px;border:0;border-radius:14px;background:#23a77b;color:#fff;font-size:16px;font-weight:700;box-shadow:0 10px 20px rgba(35,167,123,.22)}@media(min-width:700px){body{background:#dfe9e6}.bind-h5{box-shadow:0 0 0 1px #d7e4e0,0 20px 60px rgba(33,63,56,.16)}}
</style>
