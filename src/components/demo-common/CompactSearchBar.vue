<script setup>
defineProps({
  model: { type: Object, required: true },
  options: { type: Object, required: true },
  type: { type: String, default: 'physical' },
})

const emit = defineEmits(['search', 'reset'])
</script>

<template>
  <section class="compact-search">
    <template v-if="type === 'patient'">
      <div class="search-row patient-row">
        <label><span>姓名</span><input v-model="model.name" type="text" /></label>
        <label><span>证件号</span><input v-model="model.certNo" class="wide-input" type="text" /></label>
        <label><span>联系电话</span><input v-model="model.phone" type="text" /></label>
        <label><span>建档方式</span><select v-model="model.archiveMethod"><option value="">请选择</option><option v-for="item in options.archiveMethods" :key="item">{{ item }}</option></select></label>
        <label class="date-range"><span>建档时间</span><input v-model="model.startTime" type="date" /><b>至</b><input v-model="model.endTime" type="date" /></label>
        <button class="btn primary" type="button" @click="emit('search')">查询</button>
        <button class="btn" type="button" @click="emit('reset')">重置</button>
      </div>
    </template>
    <template v-else-if="type === 'exam-records'">
      <div class="search-row">
        <label><span>患者姓名</span><input v-model="model.patientName" type="text" /></label>
        <label><span>证件号</span><input v-model="model.certNo" class="wide-input" type="text" /></label>
        <label><span>联系电话</span><input v-model="model.phone" type="text" /></label>
        <label><span>筛查类型</span><select v-model="model.screenType"><option value="">请选择</option><option v-for="item in options.screenTypes" :key="item">{{ item }}</option></select></label>
      </div>
      <div class="search-row">
        <label><span>状态</span><select v-model="model.status"><option value="">请选择</option><option v-for="item in options.statuses" :key="item">{{ item }}</option></select></label>
        <label class="date-range"><span>就诊日期</span><input v-model="model.startDate" type="date" /><b>至</b><input v-model="model.endDate" type="date" /></label>
        <button class="btn primary" type="button" @click="emit('search')">查询</button>
        <button class="btn" type="button" @click="emit('reset')">重置</button>
      </div>
    </template>
    <template v-else>
    <div class="search-row">
      <label><span>学年</span><select v-model="model.schoolYear"><option value="">请选择</option><option v-for="item in options.schoolYears" :key="item">{{ item }}</option></select></label>
      <label><span>体检批次</span><select v-model="model.batch"><option value="">请选择</option><option v-for="item in options.batches" :key="item">{{ item }}</option></select></label>
      <label><span>学校</span><select v-model="model.school"><option value="">请选择</option><option v-for="item in options.schools" :key="item">{{ item }}</option></select></label>
      <label><span>年级</span><select v-model="model.grade"><option value="">请选择</option><option v-for="item in options.grades" :key="item">{{ item }}</option></select></label>
      <label><span>班级</span><select v-model="model.className"><option value="">请选择</option><option v-for="item in options.classes" :key="item">{{ item }}</option></select></label>
    </div>
    <div class="search-row">
      <label><span>姓名</span><input v-model="model.name" type="text" /></label>
      <label><span>身份证号</span><input v-model="model.idCard" type="text" /></label>
      <label class="date-range"><span>检查日期</span><input v-model="model.startDate" type="date" /><b>至</b><input v-model="model.endDate" type="date" /></label>
      <label><span>总检状态</span><select v-model="model.finalStatus"><option value="">请选择</option><option v-for="item in options.finalStatuses" :key="item">{{ item }}</option></select></label>
      <label><span>体检状态</span><select v-model="model.examStatus"><option value="">请选择</option><option v-for="item in options.examStatuses" :key="item">{{ item }}</option></select></label>
      <button class="btn primary" type="button" @click="emit('search')">查询</button>
      <button class="btn" type="button" @click="emit('reset')">重置</button>
    </div>
    </template>
  </section>
</template>

<style scoped>
.compact-search{padding:9px 10px;background:#f7f9fb;border:1px solid #d8d8d8;border-bottom:0;font-size:12px}
.search-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;white-space:nowrap}
.patient-row{flex-wrap:wrap;margin-bottom:0}
.search-row:last-child{margin-bottom:0}
label{display:flex;align-items:center;gap:5px;color:#333}
label span{min-width:48px;text-align:right;color:#333}
input,select{height:28px;width:132px;padding:0 7px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font:12px "Microsoft YaHei",Arial,sans-serif}
.wide-input{width:178px}
.date-range input{width:124px}
.date-range b{color:#666;font-weight:400}
.btn{height:28px;padding:0 13px;border:1px solid #b8c2cc;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}
.btn.primary{border-color:#9fb7cf;background:#dceafa;color:#244b70}
.btn:hover{border-color:#7f9ab5;background:#edf4fb}
</style>
