<template>
  <div class="row">
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Title</label>
        <input :value="modelValue.title" @input="set('title', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="Project title" />
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Type</label>
        <select :value="modelValue.projectType" @change="set('projectType', ($event.target as HTMLSelectElement).value)" class="admin-input">
          <option>Developer Tooling</option>
          <option>AI / ML</option>
          <option>Platform</option>
          <option>Web App</option>
          <option>Website</option>
          <option>E-commerce</option>
          <option>Other</option>
        </select>
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Order</label>
        <input type="number" :value="modelValue.sortOrder" @input="set('sortOrder', parseInt(($event.target as HTMLInputElement).value) || 0)" class="admin-input" />
      </div>
    </div>

    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Slug <span class="admin-hint">URL: /portfolio/&lt;slug&gt; — leave blank to derive from the title</span></label>
        <input :value="modelValue.slug" @input="set('slug', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="azure-devops-mcp-server" />
      </div>
    </div>
    <div class="col-md-4">
      <div class="admin-form-group">
        <label class="admin-label">Context / Client</label>
        <input :value="modelValue.client" @input="set('client', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="TransPerfect — internal tooling" />
      </div>
    </div>
    <div class="col-md-2">
      <div class="admin-form-group">
        <label class="admin-label">Year</label>
        <input :value="modelValue.year" @input="set('year', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="2025" />
      </div>
    </div>

    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">Stack</label>
        <input :value="modelValue.tools" @input="set('tools', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="TypeScript, Node.js, Azure DevOps REST API" />
      </div>
    </div>

    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">Summary <span class="admin-hint">one line, shown on the work index card</span></label>
        <input :value="modelValue.summary" @input="set('summary', ($event.target as HTMLInputElement).value)" class="admin-input" />
      </div>
    </div>

    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">The problem</label>
        <textarea :value="modelValue.problem" @input="set('problem', ($event.target as HTMLTextAreaElement).value)" class="admin-input" rows="3" placeholder="What was broken, slow, or missing before this existed?"></textarea>
      </div>
    </div>
    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">What I built</label>
        <textarea :value="modelValue.approach" @input="set('approach', ($event.target as HTMLTextAreaElement).value)" class="admin-input" rows="4" placeholder="The design decisions and what you actually shipped."></textarea>
      </div>
    </div>
    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">Outcome <span class="admin-hint">lead with a number where you have one</span></label>
        <textarea :value="modelValue.outcome" @input="set('outcome', ($event.target as HTMLTextAreaElement).value)" class="admin-input" rows="2"></textarea>
      </div>
    </div>

    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Live URL <span class="admin-hint">a real site, not an image file</span></label>
        <input :value="modelValue.previewUrl" @input="set('previewUrl', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="https://..." />
      </div>
    </div>
    <div class="col-md-6">
      <div class="admin-form-group">
        <label class="admin-label">Repository URL</label>
        <input :value="modelValue.repoUrl" @input="set('repoUrl', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="https://github.com/..." />
      </div>
    </div>

    <div class="col-md-9">
      <div class="admin-form-group">
        <label class="admin-label">Thumbnail Image URL</label>
        <input :value="modelValue.thumbnailUrl" @input="set('thumbnailUrl', ($event.target as HTMLInputElement).value)" class="admin-input" placeholder="/img/... or https://..." />
      </div>
    </div>
    <div class="col-md-3">
      <div class="admin-form-group">
        <label class="admin-label">Visibility</label>
        <select :value="String(modelValue.active)" @change="set('active', ($event.target as HTMLSelectElement).value === 'true')" class="admin-input">
          <option value="true">Visible</option>
          <option value="false">Hidden</option>
        </select>
      </div>
    </div>

    <div class="col-12">
      <div class="admin-form-group">
        <label class="admin-label">Gallery Images <span class="admin-hint">one URL per line, shown on the case study page</span></label>
        <textarea :value="modelValue.imagesRaw" @input="set('imagesRaw', ($event.target as HTMLTextAreaElement).value)" class="admin-input" rows="3" placeholder="/img/projects/one.png&#10;/img/projects/two.png"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: any }>()
const emit = defineEmits(['update:modelValue'])

function set(key: string, value: unknown) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
