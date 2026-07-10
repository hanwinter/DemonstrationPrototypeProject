<script setup>
defineProps({ student: { type: Object, required: true } })
defineEmits(['back'])
</script>

<template>
  <section class="student-info-bar fh-card">
    <div class="student-main">
      <button class="back" @click="$emit('back')"><span>‹</span>返回</button>
      <span class="divider"></span>
      <div class="identity-title"><strong>{{ student.name }}</strong><small>{{ student.gender }} | {{ student.age }}岁{{ student.ageMonths }}个月</small></div>
    </div>
    <div class="student-fields">
      <span><em>学校</em><b>{{ student.school }}</b></span>
      <span><em>班级</em><b>{{ student.grade }}{{ student.className }}</b></span>
      <span><em>学号</em><b>{{ student.studentNo }}</b></span>
      <span><em>家长</em><b>{{ student.fatherName }} / {{ student.motherName }}</b></span>
    </div>
  </section>
</template>

<style scoped>
.student-info-bar{min-height:66px;padding:10px 16px;display:flex;align-items:center;gap:18px;background:linear-gradient(90deg,#FFFFFF 0%,#F8FBFF 100%)}.student-main{flex:none;display:flex;align-items:center;gap:10px;min-width:255px;color:var(--fh-text-primary)}.identity-title{display:flex;flex-direction:column;gap:4px}.identity-title strong{color:var(--fh-text-primary);font-size:16px;font-weight:700}.identity-title small{color:var(--fh-text-secondary);font-size:13px}.back{height:30px;padding:0 10px;display:flex;align-items:center;justify-content:center;gap:4px;color:var(--fh-primary);font-size:14px;border:0;border-radius:6px;background:var(--fh-primary-light);cursor:pointer}.back span{font-size:16px;line-height:1}.back:hover{color:#fff;background:var(--fh-primary-hover)}.divider{width:1px;height:28px;background:var(--fh-border-light)}.student-fields{min-width:0;flex:1;display:grid;grid-template-columns:repeat(4,minmax(140px,1fr));gap:6px 14px}.student-fields span{min-width:0;display:flex;flex-direction:column;gap:4px;white-space:nowrap}.student-fields em{color:var(--fh-text-secondary);font-size:13px;font-style:normal;font-weight:400}.student-fields b{min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--fh-text-primary);font-size:14px;font-weight:500}
@media (max-width:1200px){.student-info-bar{align-items:flex-start;flex-direction:column}.student-fields{width:100%;grid-template-columns:repeat(2,minmax(150px,1fr))}}
</style>
