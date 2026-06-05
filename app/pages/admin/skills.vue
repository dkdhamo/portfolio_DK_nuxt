<template>
  <div>
    <h1 class="admin-title">Skills</h1>

    <!-- Add Skill -->
    <div class="admin-card">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:16px;">Add New Skill</h3>
      <div class="row">
        <div class="col-md-5">
          <label class="admin-label">Skill Name</label>
          <input v-model="newSkill.name" class="admin-input" placeholder="e.g. React.js / TypeScript" />
        </div>
        <div class="col-md-3">
          <label class="admin-label">Percentage (0–100)</label>
          <input v-model.number="newSkill.percentage" type="number" min="0" max="100" class="admin-input" />
        </div>
        <div class="col-md-2">
          <label class="admin-label">Order</label>
          <input v-model.number="newSkill.sortOrder" type="number" class="admin-input" />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button @click="addSkill" :disabled="adding" class="admin-btn admin-btn-primary w-100" style="margin-bottom:12px;">
            {{ adding ? '...' : 'Add' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Skills List -->
    <div class="admin-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>%</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in skillsList" :key="skill.id">
            <td>
              <input v-if="editing === skill.id" v-model="editForm.name" class="admin-input" style="margin:0;" />
              <span v-else>{{ skill.name }}</span>
            </td>
            <td>
              <input v-if="editing === skill.id" v-model.number="editForm.percentage" type="number" min="0" max="100" class="admin-input" style="margin:0;width:80px;" />
              <span v-else>{{ skill.percentage }}%</span>
            </td>
            <td>
              <input v-if="editing === skill.id" v-model.number="editForm.sortOrder" type="number" class="admin-input" style="margin:0;width:70px;" />
              <span v-else>{{ skill.sortOrder }}</span>
            </td>
            <td>
              <template v-if="editing === skill.id">
                <button @click="saveEdit(skill.id)" class="admin-btn admin-btn-primary" style="margin-right:6px;">Save</button>
                <button @click="editing = null" class="admin-btn admin-btn-secondary">Cancel</button>
              </template>
              <template v-else>
                <button @click="startEdit(skill)" class="admin-btn admin-btn-secondary" style="margin-right:6px;">Edit</button>
                <button @click="deleteSkill(skill.id)" class="admin-btn admin-btn-danger">Delete</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Skills – Admin' })

const { data, refresh } = await useFetch('/api/content/skills')
const skillsList = computed(() => (data.value as any[]) || [])

const newSkill = reactive({ name: '', percentage: 80, sortOrder: 0 })
const adding = ref(false)
const editing = ref<number | null>(null)
const editForm = reactive({ name: '', percentage: 0, sortOrder: 0 })

async function addSkill() {
  if (!newSkill.name) return
  adding.value = true
  try {
    await $fetch('/api/content/skills', { method: 'POST', body: { ...newSkill } })
    newSkill.name = ''
    newSkill.percentage = 80
    refresh()
  } finally {
    adding.value = false
  }
}

function startEdit(skill: any) {
  editing.value = skill.id
  editForm.name = skill.name
  editForm.percentage = skill.percentage
  editForm.sortOrder = skill.sortOrder
}

async function saveEdit(id: number) {
  await $fetch(`/api/content/skills/${id}`, { method: 'PUT', body: { ...editForm } })
  editing.value = null
  refresh()
}

async function deleteSkill(id: number) {
  if (!confirm('Delete this skill?')) return
  await $fetch(`/api/content/skills/${id}`, { method: 'DELETE' })
  refresh()
}
</script>
