<template>
  <div class="row">
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Title</label>
        <input :value="modelValue.title" @input="emit('update:modelValue', { ...modelValue, title: ($event.target as HTMLInputElement).value })" class="admin-input" placeholder="Project title" />
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Type</label>
        <select :value="modelValue.projectType" @change="emit('update:modelValue', { ...modelValue, projectType: ($event.target as HTMLSelectElement).value })" class="admin-input">
          <option>Website</option>
          <option>E-commerce</option>
          <option>AI / NLP</option>
          <option>Mobile App</option>
          <option>Other</option>
        </select>
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Order</label>
        <input type="number" :value="modelValue.sortOrder" @input="emit('update:modelValue', { ...modelValue, sortOrder: parseInt(($event.target as HTMLInputElement).value) })" class="admin-input" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Client</label>
        <input :value="modelValue.client" @input="emit('update:modelValue', { ...modelValue, client: ($event.target as HTMLInputElement).value })" class="admin-input" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Tools / Technologies</label>
        <input :value="modelValue.tools" @input="emit('update:modelValue', { ...modelValue, tools: ($event.target as HTMLInputElement).value })" class="admin-input" />
      </div>
    </div>
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Preview URL</label>
        <input :value="modelValue.previewUrl" @input="emit('update:modelValue', { ...modelValue, previewUrl: ($event.target as HTMLInputElement).value })" class="admin-input" placeholder="https://..." />
      </div>
    </div>
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Thumbnail Image URL</label>
        <input :value="modelValue.thumbnailUrl" @input="emit('update:modelValue', { ...modelValue, thumbnailUrl: ($event.target as HTMLInputElement).value })" class="admin-input" placeholder="https://... or /img/..." />
      </div>
    </div>
    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">Slideshow Images (one URL per line)</label>
        <textarea :value="modelValue.imagesRaw" @input="emit('update:modelValue', { ...modelValue, imagesRaw: ($event.target as HTMLTextAreaElement).value })" class="admin-input" rows="3" placeholder="https://url1.jpg&#10;https://url2.jpg"></textarea>
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Active</label>
        <select :value="modelValue.active" @change="emit('update:modelValue', { ...modelValue, active: ($event.target as HTMLSelectElement).value === 'true' })" class="admin-input">
          <option value="true">Visible</option>
          <option value="false">Hidden</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: any }>()
const emit = defineEmits(['update:modelValue'])
</script>
