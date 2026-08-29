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
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Title / Role</label>
            <input v-model="form.title" class="admin-input" required />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Bio (shown on home page)</label>
            <textarea v-model="form.bio" class="admin-input" rows="4" required></textarea>
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
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Language</label>
            <input v-model="form.language" class="admin-input" />
          </div>
        </div>
        <div class="col-12">
          <div class="admin-form-group">
            <label class="admin-label">Profile Image URL</label>
            <input v-model="form.profileImageUrl" class="admin-input" />
          </div>
        </div>
      </div>

      <h3 style="font-size:16px;font-weight:700;margin:20px 0 12px;color:#1a1a2e;">Social Links</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">LinkedIn URL</label>
            <input v-model="form.linkedinUrl" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">GitHub / Twitter URL</label>
            <input v-model="form.twitterUrl" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Facebook URL</label>
            <input v-model="form.facebookUrl" class="admin-input" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="admin-form-group">
            <label class="admin-label">Dribbble URL</label>
            <input v-model="form.dribbbleUrl" class="admin-input" />
          </div>
        </div>
      </div>

      <h3 style="font-size:16px;font-weight:700;margin:20px 0 12px;color:#1a1a2e;">Stats Boxes</h3>
      <div class="row">
        <div class="col-6 col-md-3">
          <div class="admin-form-group">
            <label class="admin-label">Years of Experience</label>
            <input v-model.number="form.stats.yearsExperience" type="number" class="admin-input" />
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="admin-form-group">
            <label class="admin-label">Completed Projects</label>
            <input v-model.number="form.stats.completedProjects" type="number" class="admin-input" />
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Personal Info – Admin' })

const { data, refresh } = await useFetch('/api/content/personal')
const saving = ref(false)
const saved = ref(false)

const form = ref<any>(null)

watchEffect(() => {
  const d = data.value as any
  if (d?.info) {
    form.value = {
      ...d.info,
      stats: { ...(d.stats || { yearsExperience: 2, completedProjects: 5, happyClients: 3, awardsWon: 3 }) },
    }
  }
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
</script>
