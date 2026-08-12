<script setup>
defineProps({
  pageSize: { type: Number, required: true },
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
})

const emit = defineEmits(['update:pageSize', 'first', 'prev', 'next', 'last', 'refresh'])
</script>

<template>
  <footer class="legacy-pagination">
    <div class="pager-left">
      <select :value="pageSize" @change="emit('update:pageSize', Number($event.target.value))">
        <option :value="20">20条/页</option>
        <option :value="30">30条/页</option>
        <option :value="50">50条/页</option>
      </select>
      <button type="button" @click="emit('first')">首页</button>
      <button type="button" @click="emit('prev')">&lt;</button>
      <span>第{{ page }}页</span>
      <span>共{{ totalPages }}页</span>
      <button type="button" @click="emit('next')">&gt;</button>
      <button type="button" @click="emit('last')">末页</button>
      <button type="button" @click="emit('refresh')">刷新</button>
    </div>
    <div>显示{{ start }}到{{ end }}，共{{ total }}条记录</div>
  </footer>
</template>

<style scoped>
.legacy-pagination{height:32px;padding:2px 8px;display:flex;align-items:center;justify-content:space-between;border:1px solid #d8d8d8;border-top:0;background:#fff;color:#333;font-size:12px}
.pager-left{display:flex;align-items:center;gap:5px}
select,button{height:26px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px}
select{width:86px;padding:0 4px}
button{padding:0 8px;cursor:pointer}
button:hover{border-color:#8fa8c0;background:#f3f7fb}
span{padding:0 4px;color:#333}
</style>
