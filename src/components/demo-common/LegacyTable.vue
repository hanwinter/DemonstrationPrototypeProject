<script setup>
import { computed } from 'vue'

const defaultColumns = [
  { key: 'index', label: '序号', width: 54, fixed: true },
  { key: 'batch', label: '体检批次', width: 178, fixed: true },
  { key: 'school', label: '学校名称', width: 104, fixed: true },
  { key: 'grade', label: '年级', width: 76 },
  { key: 'className', label: '班级', width: 62 },
  { key: 'name', label: '学生姓名', width: 88, fixed: true },
  { key: 'gender', label: '性别', width: 58 },
  { key: 'checkDate', label: '检查日期', width: 96 },
  { key: 'examStatus', label: '体检状态', width: 84 },
  { key: 'finalStatus', label: '总检状态', width: 84 },
  { key: 'allergyHistory', label: '过敏史', width: 105 },
  { key: 'medicalHistory', label: '既往史', width: 110 },
  { key: 'fatherHeight', label: '父亲身高(cm)', width: 104 },
  { key: 'motherHeight', label: '母亲身高(cm)', width: 104 },
  { key: 'height', label: '身高(cm)', width: 82 },
  { key: 'weight', label: '体重(kg)', width: 82 },
  { key: 'bmi', label: 'BMI', width: 70 },
  { key: 'waist', label: '腰围(cm)', width: 82 },
  { key: 'leftVision', label: '左眼裸眼视力', width: 104 },
  { key: 'rightVision', label: '右眼裸眼视力', width: 104 },
  { key: 'leftSphere', label: '左眼球镜', width: 86 },
  { key: 'rightSphere', label: '右眼球镜', width: 86 },
  { key: 'leftCylinder', label: '左眼柱镜', width: 86 },
  { key: 'rightCylinder', label: '右眼柱镜', width: 86 },
]

const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
})

const effectiveColumns = computed(() => props.columns.length ? props.columns : defaultColumns)

const leftOffsets = computed(() => {
  let left = 0
  const offsets = {}
  effectiveColumns.value.forEach((col) => {
    if (col.fixed) {
      offsets[col.key] = left
      left += col.width
    }
  })
  return offsets
})
</script>

<template>
  <div class="legacy-table-wrap">
    <table class="legacy-table">
      <thead>
        <tr>
          <th v-for="col in effectiveColumns" :key="col.key" :class="{ fixed: col.fixed }" :style="{ width: `${col.width}px`, minWidth: `${col.width}px`, left: col.fixed ? `${leftOffsets[col.key] || 0}px` : undefined }">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]">
          <td v-for="col in effectiveColumns" :key="col.key" :class="{ fixed: col.fixed, action: col.type === 'actions' }" :style="{ width: `${col.width}px`, minWidth: `${col.width}px`, left: col.fixed ? `${leftOffsets[col.key] || 0}px` : undefined }">
            <slot :name="col.key" :row="row" :value="row[col.key]">{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.legacy-table-wrap{height:calc(100vh - 248px);min-height:420px;overflow:auto;border-left:1px solid #d8d8d8;border-right:1px solid #d8d8d8;background:#fff;scrollbar-width:thin;scrollbar-color:#b8c2cc #f3f4f6}
.legacy-table{border-collapse:separate;border-spacing:0;table-layout:fixed;min-width:2200px;width:max-content;color:#333;font:12px "Microsoft YaHei",Arial,sans-serif}
th,td{height:28px;padding:0 7px;border-right:1px solid #d8d8d8;border-bottom:1px solid #d8d8d8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;background:#fff}
th{position:sticky;top:0;z-index:4;height:30px;background:#eee;color:#333;font-weight:600}
td.fixed,th.fixed{position:sticky;z-index:3}
th.fixed{z-index:5}
th:first-child,td:first-child{text-align:center}
td.fixed,th.fixed{box-shadow:1px 0 0 #d8d8d8;background:#fff}
th.fixed{background:#eee}
td.action{text-align:left}
tbody tr:nth-child(even) td{background:#fafafa}
tbody tr:nth-child(even) td.fixed{background:#fafafa}
tbody tr:hover td,tbody tr:hover td.fixed{background:#eef5fc}
</style>
