<template>
  <div>
    <h1 class="admin-title">Portfolio Projects</h1>

    <!-- Add Project -->
    <div class="admin-card">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">Add Project</h3>
      <ProjectForm v-model="newProject" />
      <button @click="addProject" :disabled="adding" class="admin-btn admin-btn-primary mt-2">
        {{ adding ? 'Adding...' : 'Add Project' }}
      </button>
    </div>

    <!-- Projects List -->
    <div class="admin-card" v-for="project in projectList" :key="project.id">
      <template v-if="editing === project.id">
        <ProjectForm v-model="editForm" />
        <div class="mt-2">
          <button @click="saveEdit(project.id)" class="admin-btn admin-btn-primary" style="margin-right:8px;">Save</button>
          <button @click="editing = null" class="admin-btn admin-btn-secondary">Cancel</button>
        </div>
      </template>
      <template v-else>
        <div class="project-row">
          <img :src="project.thumbnailUrl" class="project-thumb" :alt="project.title" />
          <div class="project-info">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-meta">{{ project.projectType }} · {{ project.client }}</div>
            <div class="project-tools" style="font-size:12px;color:#888;">{{ project.tools }}</div>
          </div>
          <div class="project-actions">
            <button @click="startEdit(project)" class="admin-btn admin-btn-secondary" style="margin-right:6px;">Edit</button>
            <button @click="deleteProject(project.id)" class="admin-btn admin-btn-danger">Delete</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<!-- Shared form component inline -->
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Projects – Admin' })

const { data, refresh } = await useFetch('/api/projects')
const projectList = computed(() => (data.value as any[]) || [])

const emptyProject = () => ({
  title: '', projectType: 'Website', client: '', tools: '',
  previewUrl: '', thumbnailUrl: '', imagesRaw: '', sortOrder: 0, active: true,
})

const newProject = reactive(emptyProject())
const adding = ref(false)
const editing = ref<number | null>(null)
const editForm = reactive(emptyProject())

function toBody(form: any) {
  return {
    ...form,
    images: form.imagesRaw ? form.imagesRaw.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
  }
}

async function addProject() {
  if (!newProject.title) return
  adding.value = true
  try {
    await $fetch('/api/projects', { method: 'POST', body: toBody(newProject) })
    Object.assign(newProject, emptyProject())
    refresh()
  } finally {
    adding.value = false
  }
}

function startEdit(p: any) {
  editing.value = p.id
  const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
  Object.assign(editForm, {
    title: p.title, projectType: p.projectType, client: p.client, tools: p.tools,
    previewUrl: p.previewUrl, thumbnailUrl: p.thumbnailUrl,
    imagesRaw: imgs.join('\n'), sortOrder: p.sortOrder, active: p.active,
  })
}

async function saveEdit(id: number) {
  await $fetch(`/api/projects/${id}`, { method: 'PUT', body: toBody(editForm) })
  editing.value = null
  refresh()
}

async function deleteProject(id: number) {
  if (!confirm('Delete this project?')) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<style scoped>
.project-row { display: flex; align-items: center; gap: 16px; }
.project-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; background: #eee; }
.project-info { flex: 1; }
.project-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
.project-meta { font-size: 13px; color: #666; margin-top: 2px; }
</style>
