<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="toast.type"
          @click="remove(toast.id)"
        >
          <span class="toast-icon">
            <i v-if="toast.type === 'success'" class="fa fa-check-circle" />
            <i v-else-if="toast.type === 'error'" class="fa fa-times-circle" />
            <i v-else class="fa fa-info-circle" />
          </span>
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()
</script>
