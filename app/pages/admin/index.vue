<template>
  <div>
    <h1 class="admin-title">Dashboard</h1>
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
        <NuxtLink :to="card.link" class="admin-dash-card">
          <i :class="`fa ${card.icon} admin-dash-icon`"></i>
          <div>
            <div class="admin-dash-label">{{ card.label }}</div>
            <div class="admin-dash-count">{{ card.count }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="admin-card mt-4">
      <p class="mb-1" style="font-size:14px;color:#666;">
        Welcome back, <strong>{{ user?.name || user?.login }}</strong>! Your portfolio is live and the database is connected.
      </p>
      <p style="font-size:13px;color:#aaa;margin:0;">Use the sidebar to update any section of your portfolio seamlessly.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Admin Dashboard – DK Portfolio' })

const { user } = useUserSession()

const [{ data: skillsData }, { data: expData }, { data: projectsData }, { data: contactsData }] = await Promise.all([
  useFetch('/api/content/skills'),
  useFetch('/api/content/experience'),
  useFetch('/api/admin/projects'),
  useFetch('/api/admin/contacts'),
])

const cards = computed(() => [
  { label: 'Skills', count: (skillsData.value as any[])?.length ?? 0, icon: 'fa-pie-chart', link: '/admin/skills' },
  { label: 'Experience', count: (expData.value as any[])?.length ?? 0, icon: 'fa-briefcase', link: '/admin/experience' },
  { label: 'Projects', count: (projectsData.value as any[])?.length ?? 0, icon: 'fa-folder', link: '/admin/projects' },
  { label: 'Messages', count: (contactsData.value as any[])?.length ?? 0, icon: 'fa-envelope', link: '/admin/contacts' },
])
</script>

<style scoped>
.admin-dash-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  text-decoration: none;
  color: inherit;
  transition: 0.2s;
}
.admin-dash-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-1px); }
.admin-dash-icon { font-size: 28px; color: #1a1a2e; }
.admin-dash-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.admin-dash-count { font-size: 28px; font-weight: 700; color: #1a1a2e; }
</style>
