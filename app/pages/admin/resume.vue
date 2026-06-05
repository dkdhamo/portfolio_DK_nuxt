<template>
  <div>
    <h1 class="admin-title">Resume / CV</h1>
    <div class="admin-card">
      <p style="font-size:14px;color:#666;margin-bottom:20px;">
        The resume PDF is already bundled in the app at <code>/assets/resume/DK_resume_new_temp.pdf</code>.
        You can change the download link below to point to a Google Drive, Dropbox, or any other URL — or keep the default bundled file.
      </p>
      <div class="admin-form-group">
        <label class="admin-label">CV / Resume URL</label>
        <input v-model="cvUrl" class="admin-input" placeholder="/assets/resume/DK_resume_new_temp.pdf" />
        <p style="font-size:12px;color:#aaa;margin-top:4px;">
          Use <code>/assets/resume/DK_resume_new_temp.pdf</code> for the bundled file, or paste any external URL.
        </p>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button @click="save" :disabled="saving" class="admin-btn admin-btn-primary">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <a :href="cvUrl" target="_blank" class="admin-btn admin-btn-secondary">Preview Current CV</a>
        <span v-if="saved" class="admin-alert-success" style="display:inline-block;">Saved!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Resume – Admin' })

const { data, refresh } = await useFetch('/api/content/personal')
const cvUrl = ref('')
const saving = ref(false)
const saved = ref(false)

watchEffect(() => {
  const d = data.value as any
  if (d?.info?.cvUrl) cvUrl.value = d.info.cvUrl
})

async function save() {
  saving.value = true
  saved.value = false
  const d = data.value as any
  try {
    await $fetch('/api/content/personal', { method: 'PUT', body: { ...d.info, cvUrl: cvUrl.value, stats: d.stats } })
    saved.value = true
    refresh()
    setTimeout(() => { saved.value = false }, 3000)
  } finally {
    saving.value = false
  }
}
</script>
