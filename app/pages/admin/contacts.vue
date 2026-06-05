<template>
  <div>
    <h1 class="admin-title">Messages <span v-if="unreadCount" class="unread-badge">{{ unreadCount }} new</span></h1>
    <div class="admin-card">
      <div v-if="!contacts.length" style="color:#888;font-size:14px;">No messages yet.</div>
      <div
        v-for="msg in contacts"
        :key="msg.id"
        class="message-item"
        :class="{ unread: !msg.isRead }"
      >
        <div class="message-header">
          <div class="message-from">
            <strong>{{ msg.name }}</strong>
            <span class="message-email">{{ msg.email }}</span>
          </div>
          <div class="message-meta">
            <span class="message-date">{{ formatDate(msg.createdAt) }}</span>
            <button v-if="!msg.isRead" @click="markRead(msg.id)" class="admin-btn admin-btn-secondary" style="font-size:11px;padding:4px 10px;">Mark read</button>
          </div>
        </div>
        <div class="message-subject">{{ msg.subject }}</div>
        <div class="message-body">{{ msg.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Messages – Admin' })

const { data, refresh } = await useFetch('/api/admin/contacts')
const contacts = computed(() => (data.value as any[]) || [])
const unreadCount = computed(() => contacts.value.filter(m => !m.isRead).length)

async function markRead(id: number) {
  await $fetch(`/api/admin/contacts/${id}`, { method: 'PUT' })
  refresh()
}

function formatDate(ts: number | string) {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.unread-badge { background: #dc3545; color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 12px; margin-left: 10px; vertical-align: middle; }
.message-item { padding: 16px 0; border-bottom: 1px solid #eee; }
.message-item:last-child { border-bottom: none; }
.message-item.unread { background: #fafafa; border-left: 3px solid #1a1a2e; padding-left: 12px; margin-left: -12px; }
.message-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
.message-from { display: flex; flex-direction: column; gap: 2px; }
.message-from strong { font-size: 14px; color: #1a1a2e; }
.message-email { font-size: 12px; color: #888; }
.message-meta { display: flex; align-items: center; gap: 10px; }
.message-date { font-size: 12px; color: #aaa; }
.message-subject { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 4px; }
.message-body { font-size: 13px; color: #666; white-space: pre-wrap; }
</style>
