<script setup>
defineProps({
  actions: {
    type: Array,
    default: () => [
      { key: 'import', label: '导入检验数据', icon: '⇧' },
      { key: 'export', label: '导出', icon: '⇩' },
    ],
  },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="legacy-toolbar">
    <button v-for="item in actions" :key="item.key" type="button" @click="emit('action', item.key)">
      <span v-if="item.icon" class="legacy-icon">{{ item.icon }}</span>{{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.legacy-toolbar{height:34px;padding:3px 8px;display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #d8d8d8}
button{height:27px;padding:0 10px;display:inline-flex;align-items:center;gap:5px;border:1px solid #bfc7d1;border-radius:2px;background:#fff;color:#333;font-size:12px;cursor:pointer}
button:hover{border-color:#8fa8c0;background:#f3f7fb}
.legacy-icon{font-size:14px;line-height:1;color:#4e6f8f}
</style>
