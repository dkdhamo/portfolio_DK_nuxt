<template>
  <div>
    <h1 class="admin-title">Experience & Education</h1>

    <!-- Add Entry -->
    <div class="admin-card">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">Add Entry</h3>
      <div class="row">
        <div class="col-md-4">
          <label class="admin-label">Year / Period</label>
          <input v-model="newExp.year" class="admin-input" placeholder="e.g. May 2025 – Present" />
        </div>
        <div class="col-md-4">
          <label class="admin-label">Title / Role</label>
          <input v-model="newExp.title" class="admin-input" placeholder="e.g. Software Engineer" />
        </div>
        <div class="col-md-4">
          <label class="admin-label">Company / Institution</label>
          <input v-model="newExp.company" class="admin-input" placeholder="e.g. TransPerfect, Chennai" />
        </div>
        <div class="col-md-8">
          <label class="admin-label">Description</label>
          <textarea v-model="newExp.description" class="admin-input" rows="2"></textarea>
        </div>
        <div class="col-md-2">
          <label class="admin-label">Type</label>
          <select v-model="newExp.type" class="admin-input">
            <option value="work">Work</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="admin-label">Order</label>
          <input v-model.number="newExp.sortOrder" type="number" class="admin-input" />
        </div>
        <div class="col-12">
          <button @click="addExp" :disabled="adding" class="admin-btn admin-btn-primary">
            {{ adding ? 'Adding...' : 'Add Entry' }}
          </button>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="admin-card">
      <div v-for="exp in expList" :key="exp.id" class="exp-item">
        <template v-if="editing === exp.id">
          <div class="row">
            <div class="col-md-4">
              <label class="admin-label">Year</label>
              <input v-model="editForm.year" class="admin-input" />
            </div>
            <div class="col-md-4">
              <label class="admin-label">Title</label>
              <input v-model="editForm.title" class="admin-input" />
            </div>
            <div class="col-md-4">
              <label class="admin-label">Company</label>
              <input v-model="editForm.company" class="admin-input" />
            </div>
            <div class="col-md-8">
              <label class="admin-label">Description</label>
              <textarea v-model="editForm.description" class="admin-input" rows="2"></textarea>
            </div>
            <div class="col-md-2">
              <label class="admin-label">Type</label>
              <select v-model="editForm.type" class="admin-input">
                <option value="work">Work</option>
                <option value="education">Education</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="admin-label">Order</label>
              <input v-model.number="editForm.sortOrder" type="number" class="admin-input" />
            </div>
            <div class="col-12">
              <button @click="saveEdit(exp.id)" class="admin-btn admin-btn-primary" style="margin-right:8px;">Save</button>
              <button @click="editing = null" class="admin-btn admin-btn-secondary">Cancel</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="exp-row">
            <div class="exp-info">
              <i :class="`fa ${exp.type === 'education' ? 'fa-graduation-cap' : 'fa-briefcase'} exp-icon`"></i>
              <div>
                <div class="exp-year">{{ exp.year }}</div>
                <div class="exp-title">{{ exp.title }}</div>
                <div class="exp-company">{{ exp.company }}</div>
              </div>
            </div>
            <div class="exp-actions">
              <button @click="startEdit(exp)" class="admin-btn admin-btn-secondary" style="margin-right:6px;">Edit</button>
              <button @click="deleteExp(exp.id)" class="admin-btn admin-btn-danger">Delete</button>
            </div>
          </div>
        </template>
        <hr style="margin:16px 0;" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Experience – Admin' })

const { data, refresh } = await useFetch('/api/content/experience')
const expList = computed(() => (data.value as any[]) || [])

function nextSortOrder() {
  return expList.value.reduce((max, e) => Math.max(max, e.sortOrder ?? 0), 0) + 1
}

const newExp = reactive({ year: '', title: '', company: '', description: '', type: 'work', sortOrder: nextSortOrder() })
const adding = ref(false)
const editing = ref<number | null>(null)
const editForm = reactive({ year: '', title: '', company: '', description: '', type: 'work', sortOrder: 0 })

watch(expList, () => { newExp.sortOrder = nextSortOrder() })

async function addExp() {
  if (!newExp.year || !newExp.title) return
  adding.value = true
  try {
    await $fetch('/api/content/experience', { method: 'POST', body: { ...newExp } })
    Object.assign(newExp, { year: '', title: '', company: '', description: '', type: newExp.type, sortOrder: nextSortOrder() })
    refresh()
  } finally {
    adding.value = false
  }
}

function startEdit(exp: any) {
  editing.value = exp.id
  Object.assign(editForm, { year: exp.year, title: exp.title, company: exp.company, description: exp.description, type: exp.type, sortOrder: exp.sortOrder })
}

async function saveEdit(id: number) {
  await $fetch(`/api/content/experience/${id}`, { method: 'PUT', body: { ...editForm } })
  editing.value = null
  refresh()
}

async function deleteExp(id: number) {
  if (!confirm('Delete this entry?')) return
  await $fetch(`/api/content/experience/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<style scoped>
.exp-item { margin-bottom: 4px; }
.exp-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.exp-info { display: flex; align-items: flex-start; gap: 14px; min-width: 0; }
.exp-icon { font-size: 20px; color: #1a1a2e; margin-top: 2px; flex-shrink: 0; }
.exp-year { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.exp-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
.exp-company { font-size: 13px; color: #666; }
.exp-actions { flex-shrink: 0; }

@media (max-width: 480px) {
  /* Title + Edit/Delete were squeezing into two tight columns on phones —
     stack them instead of fighting for width. */
  .exp-row { flex-direction: column; align-items: flex-start; }
  .exp-actions { align-self: flex-start; }
}
</style>
