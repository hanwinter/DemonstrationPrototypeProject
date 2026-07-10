<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '选择模板' },
  templates: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'update:templates', 'use'])
const selectedId = ref(null)
const editorVisible = ref(false)
const editingId = ref(null)
const editor = reactive({ name: '', content: '' })

const selectedTemplate = computed(() => props.templates.find((item) => item.id === selectedId.value) || null)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) selectedId.value = props.templates[0]?.id || null
  },
)

function close() {
  emit('update:modelValue', false)
}

function useTemplate() {
  if (!selectedTemplate.value) return
  emit('use', selectedTemplate.value)
  close()
}

function openEditor(template = null) {
  editingId.value = template?.id || null
  editor.name = template?.name || ''
  editor.content = template?.content || ''
  editorVisible.value = true
}

function saveTemplate() {
  const name = editor.name.trim()
  const content = editor.content.trim()
  if (!name || !content) {
    ElMessage.warning('请填写模板名称和模板内容')
    return
  }

  let nextTemplates
  if (editingId.value) {
    nextTemplates = props.templates.map((item) =>
      item.id === editingId.value ? { ...item, name, content } : item,
    )
  } else {
    const created = { id: Date.now(), name, content }
    nextTemplates = [...props.templates, created]
    selectedId.value = created.id
  }
  emit('update:templates', nextTemplates)
  editorVisible.value = false
  ElMessage.success(editingId.value ? '模板已更新' : '模板已新增')
}

async function deleteTemplate() {
  if (!selectedTemplate.value) return
  try {
    await ElMessageBox.confirm(`确定删除模板“${selectedTemplate.value.name}”吗？`, '删除模板', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    const nextTemplates = props.templates.filter((item) => item.id !== selectedId.value)
    emit('update:templates', nextTemplates)
    selectedId.value = nextTemplates[0]?.id || null
    ElMessage.success('模板已删除')
  } catch {
    // User cancelled.
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="820px"
    append-to-body
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="template-toolbar">
      <el-button size="small" @click="openEditor()">新增模板</el-button>
    </div>

    <div class="template-picker">
      <div class="template-list">
        <button
          v-for="item in templates"
          :key="item.id"
          type="button"
          :class="['template-item', { active: item.id === selectedId }]"
          @click="selectedId = item.id"
        >
          {{ item.name }}
        </button>
        <el-empty v-if="!templates.length" description="暂无模板" :image-size="64" />
      </div>

      <div class="template-preview">
        <template v-if="selectedTemplate">
          <div class="template-preview-heading">
            <strong>{{ selectedTemplate.name }}</strong>
            <div class="maintenance-actions">
              <el-button link type="primary" @click="openEditor(selectedTemplate)">编辑</el-button>
              <el-button link type="danger" @click="deleteTemplate">删除</el-button>
            </div>
          </div>
          <p>{{ selectedTemplate.content }}</p>
        </template>
        <el-empty v-else description="请选择模板" :image-size="72" />
      </div>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!selectedTemplate" @click="useTemplate">使用此模板</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editorVisible"
    :title="editingId ? '编辑模板' : '新增模板'"
    width="560px"
    append-to-body
  >
    <el-form label-width="84px">
      <el-form-item label="模板名称" required>
        <el-input v-model="editor.name" maxlength="40" />
      </el-form-item>
      <el-form-item label="模板内容" required>
        <el-input v-model="editor.content" type="textarea" :rows="8" maxlength="2000" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editorVisible = false">取消</el-button>
      <el-button type="primary" @click="saveTemplate">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.template-toolbar,
.template-preview-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.template-toolbar {
  margin-bottom: 12px;
  justify-content: flex-end;
  color: #667487;
}

.template-picker {
  min-height: 360px;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  border: 1px solid #dce5ee;
}

.template-list {
  padding: 8px;
  border-right: 1px solid #dce5ee;
  background: #f7f9fc;
}

.template-item {
  width: 100%;
  min-height: 40px;
  margin-bottom: 4px;
  padding: 8px 12px;
  color: #34465a;
  text-align: left;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

.template-item:hover {
  background: #edf3f9;
}

.template-item.active {
  color: #1769aa;
  border-color: #9fc4e5;
  background: #eaf4fc;
}

.template-preview {
  min-width: 0;
  padding: 18px;
}

.template-preview-heading {
  min-height: 32px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e3e9f0;
}

.maintenance-actions {
  display: flex;
  gap: 4px;
}

.template-preview p {
  margin: 16px 0 0;
  color: #334155;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>

