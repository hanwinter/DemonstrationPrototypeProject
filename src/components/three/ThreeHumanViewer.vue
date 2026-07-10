<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  abnormalities: { type: Array, default: () => [] },
  modelUrl: { type: String, default: '/models/human.glb' },
})
const emit = defineEmits(['select'])
const container = ref(null)
const loading = ref(true)
const error = ref('')
let THREE, renderer, scene, camera, controls, raycaster, pointer, model, frameId, resizeObserver
const originalMaterials = new Map()
const organNames = new Set(['eye_left', 'eye_right', 'spine', 'mouth', 'body'])
const severityColors = { low: 0xffd666, moderate: 0xff7a45, high: 0xff4d4f }
let selectedOrgan = ''

const findOrgan = object => {
  let current = object
  while (current && current !== model) {
    if (organNames.has(current.name)) return current.name
    current = current.parent
  }
  return ''
}

const applyHighlights = () => {
  if (!model || !THREE) return
  const abnormalMap = new Map(props.abnormalities.map(item => [item.organ, item]))
  model.traverse(object => {
    if (!object.isMesh) return
    const organ = findOrgan(object) || (organNames.has(object.name) ? object.name : '')
    if (!originalMaterials.has(object)) originalMaterials.set(object, object.material)
    if (!organ) return
    const base = originalMaterials.get(object)
    object.material = Array.isArray(base) ? base.map(material => material.clone()) : base.clone()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    const abnormal = abnormalMap.get(organ)
    materials.forEach(material => {
      if (!('emissive' in material)) return
      material.emissive = new THREE.Color(abnormal ? severityColors[abnormal.severity] : 0x000000)
      material.emissiveIntensity = abnormal ? (organ === selectedOrgan ? 1.35 : 0.72) : 0
      material.needsUpdate = true
    })
  })
}

const onPointerDown = event => {
  if (!renderer || !camera || !model) return
  const rect = renderer.domElement.getBoundingClientRect()
  pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hit = raycaster.intersectObject(model, true).find(item => findOrgan(item.object))
  if (!hit) return
  const organ = findOrgan(hit.object)
  const abnormal = props.abnormalities.find(item => item.organ === organ)
  selectedOrgan = organ
  applyHighlights()
  console.log('[ThreeHumanViewer]', organ, abnormal?.name || '')
  emit('select', { organ, name: abnormal?.name || '' })
}

const resize = () => {
  if (!container.value || !renderer || !camera) return
  const { clientWidth: width, clientHeight: height } = container.value
  if (!width || !height) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

const dispose = () => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  renderer?.domElement.removeEventListener('pointerdown', onPointerDown)
  controls?.dispose()
  model?.traverse(object => {
    object.geometry?.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.filter(Boolean).forEach(material => material.dispose())
  })
  originalMaterials.clear()
  renderer?.dispose()
  renderer?.forceContextLoss()
  renderer?.domElement.remove()
  renderer = scene = camera = controls = raycaster = pointer = model = null
}

const init = async () => {
  loading.value = true
  error.value = ''
  try {
    await nextTick()
    if (!container.value) return
    THREE = await import('three')
    const [{ OrbitControls }, { GLTFLoader }] = await Promise.all([
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
    ])
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf7faff)
    camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100)
    camera.position.set(0, 1.2, 3.2)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.value.appendChild(renderer.domElement)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)
    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aabc0, 2.2))
    const light = new THREE.DirectionalLight(0xffffff, 2.5)
    light.position.set(3, 5, 4)
    scene.add(light)
    const gltf = await new GLTFLoader().loadAsync(props.modelUrl)
    model = gltf.scene
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = 2.45 / Math.max(size.y, 0.01)
    model.scale.setScalar(scale)
    model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
    scene.add(model)
    controls.target.set(0, 1.2, 0)
    applyHighlights()
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container.value)
    resize()
    const animate = () => { frameId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
    animate()
  } catch (cause) {
    console.error('[ThreeHumanViewer] 模型初始化失败', cause)
    error.value = cause?.message?.includes('404') ? '未找到人体模型，请将 human.glb 放入 public/models/' : '3D人体模型加载失败'
    dispose()
  } finally {
    loading.value = false
  }
}

watch(() => props.abnormalities, applyHighlights, { deep: true })
init()
onBeforeUnmount(dispose)
</script>

<template>
  <div ref="container" class="three-human-viewer">
    <div v-if="loading" class="viewer-state"><span class="spinner"></span>正在加载3D人体模型…</div>
    <div v-else-if="error" class="viewer-state error"><strong>3D视图暂不可用</strong><span>{{ error }}</span></div>
    <div v-else class="viewer-tip">拖拽旋转 · 滚轮缩放 · 点击器官</div>
  </div>
</template>

<style scoped>
.three-human-viewer{position:relative;width:100%;height:430px;overflow:hidden;background:#f7faff}.three-human-viewer :deep(canvas){display:block;width:100%;height:100%;cursor:grab}.three-human-viewer :deep(canvas:active){cursor:grabbing}.viewer-state{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:10px;color:#7b8795;background:#f7faff}.viewer-state.error{flex-direction:column}.viewer-state.error strong{color:#566579}.spinner{width:18px;height:18px;border:2px solid #d7e2f0;border-top-color:#447afc;border-radius:50%;animation:spin .8s linear infinite}.viewer-tip{position:absolute;right:12px;bottom:12px;z-index:2;padding:6px 10px;color:#68778a;font-size:12px;border:1px solid #dfe7f0;border-radius:4px;background:#ffffffdf;pointer-events:none}@keyframes spin{to{transform:rotate(360deg)}}
</style>
