<template>
  <div>
    <h1 class="admin-title">Personal Info</h1>
    <form @submit.prevent="save" class="admin-card" v-if="form">
      <div class="row">
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">First Name</label>
            <input v-model="form.firstName" class="admin-input" required />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Last Name</label>
            <input v-model="form.lastName" class="admin-input" required />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Title / Role <span class="admin-hint">comma-separated values cycle in the home page typewriter</span></label>
            <input v-model="form.title" class="admin-input" required />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Current Role <span class="admin-hint">small line above the bio on /about</span></label>
            <input v-model="form.currentRole" class="admin-input" placeholder="Software Engineer at TransPerfect, Chennai" />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Bio <span class="admin-hint">first sentence is used as the home page tagline</span></label>
            <textarea v-model="form.bio" class="admin-input" rows="4" required></textarea>
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Focus <span class="admin-hint">what kind of work you take on, one sentence</span></label>
            <textarea v-model="form.focus" class="admin-input" rows="2"></textarea>
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">City</label>
            <input v-model="form.city" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Phone</label>
            <input v-model="form.phone" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Email (shown on about page)</label>
            <input v-model="form.email" type="email" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Contact Email (shown on contact page)</label>
            <input v-model="form.contactEmail" type="email" class="admin-input" />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Profile Image URL</label>
            <input v-model="form.profileImageUrl" class="admin-input" />
          </div>
        </div>
      </div>

      <h3 class="admin-section-title">Links</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">LinkedIn URL</label>
            <input v-model="form.linkedinUrl" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">GitHub URL</label>
            <input v-model="form.githubUrl" class="admin-input" />
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3 mt-2">
        <button type="submit" :disabled="saving" class="admin-btn admin-btn-primary">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <span v-if="saved" class="admin-alert-success" style="display:inline-block;">Saved!</span>
      </div>
    </form>

    <!-- Impact highlights -->
    <div class="admin-card">
      <h3 class="admin-section-title" style="margin-top:0;">Selected Impact <span class="admin-hint">shown beside your bio on /about</span></h3>

      <div class="row">
        <div class="col-md-4">
          <label class="admin-label">Value</label>
          <input v-model="newHighlight.value" class="admin-input" placeholder="40% → 85%" />
        </div>
        <div class="col-md-5">
          <label class="admin-label">Label</label>
          <input v-model="newHighlight.label" class="admin-input" placeholder="Test coverage raised on a high-traffic product" />
        </div>
        <div class="col-md-1">
          <label class="admin-label">Order</label>
          <input v-model.number="newHighlight.sortOrder" type="number" class="admin-input" />
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button @click="addHighlight" :disabled="addingHighlight" class="admin-btn admin-btn-primary w-100" style="margin-bottom:12px;">
            {{ addingHighlight ? '...' : 'Add' }}
          </button>
        </div>
      </div>

      <table class="admin-table">
        <thead>
          <tr><th>Value</th><th>Label</th><th>Order</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="h in highlightList" :key="h.id">
            <td>
              <input v-if="editingHighlight === h.id" v-model="highlightForm.value" class="admin-input" style="margin:0;" />
              <span v-else>{{ h.value }}</span>
            </td>
            <td>
              <input v-if="editingHighlight === h.id" v-model="highlightForm.label" class="admin-input" style="margin:0;" />
              <span v-else>{{ h.label }}</span>
            </td>
            <td>
              <input v-if="editingHighlight === h.id" v-model.number="highlightForm.sortOrder" type="number" class="admin-input" style="margin:0;width:70px;" />
              <span v-else>{{ h.sortOrder }}</span>
            </td>
            <td>
              <template v-if="editingHighlight === h.id">
                <button @click="saveHighlight(h.id)" class="admin-btn admin-btn-primary" style="margin-right:6px;">Save</button>
                <button @click="editingHighlight = null" class="admin-btn admin-btn-secondary">Cancel</button>
              </template>
              <template v-else>
                <button @click="startEditHighlight(h)" class="admin-btn admin-btn-secondary" style="margin-right:6px;">Edit</button>
                <button @click="deleteHighlight(h.id)" class="admin-btn admin-btn-danger">Delete</button>
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
useHead({ title: 'Personal Info – Admin' })

const { data, refresh } = await useFetch('/api/content/personal')
const saving = ref(false)
const saved = ref(false)

const form = ref<any>(null)
const highlightList = computed(() => (data.value as any)?.highlights || [])

watchEffect(() => {
  const d = data.value as any
  if (d?.info) form.value = { ...d.info }
})

async function save() {
  saving.value = true
  saved.value = false
  try {
    await $fetch('/api/content/personal', { method: 'PUT', body: form.value })
    saved.value = true
    refresh()
    setTimeout(() => { saved.value = false }, 3000)
  } finally {
    saving.value = false
  }
}

// ── Impact highlights ────────────────────────────────────────
function nextSortOrder() {
  return highlightList.value.reduce((max: number, h: any) => Math.max(max, h.sortOrder ?? 0), 0) + 1
}

const newHighlight = reactive({ value: '', label: '', sortOrder: nextSortOrder() })
const addingHighlight = ref(false)
const editingHighlight = ref<number | null>(null)
const highlightForm = reactive({ value: '', label: '', sortOrder: 0 })

watch(highlightList, () => { newHighlight.sortOrder = nextSortOrder() })

async function addHighlight() {
  if (!newHighlight.value || !newHighlight.label) return
  addingHighlight.value = true
  try {
    await $fetch('/api/content/highlights', { method: 'POST', body: { ...newHighlight } })
    newHighlight.value = ''
    newHighlight.label = ''
    refresh()
  } finally {
    addingHighlight.value = false
  }
}

function startEditHighlight(h: any) {
  editingHighlight.value = h.id
  highlightForm.value = h.value
  highlightForm.label = h.label
  highlightForm.sortOrder = h.sortOrder
}

async function saveHighlight(id: number) {
  await $fetch(`/api/content/highlights/${id}`, { method: 'PUT', body: { ...highlightForm } })
  editingHighlight.value = null
  refresh()
}

async function deleteHighlight(id: number) {
  if (!confirm('Delete this highlight?')) return
  await $fetch(`/api/content/highlights/${id}`, { method: 'DELETE' })
  refresh()
}
</script>
