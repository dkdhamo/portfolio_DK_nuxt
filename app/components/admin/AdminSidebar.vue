<template>
  <nav class="admin-sidebar">
    <div class="admin-sidebar-brand">
      <span>DK Admin</span>
    </div>
    <ul class="admin-nav list-unstyled">
      <li>
        <NuxtLink to="/admin" exact-active-class="active">
          <i class="fa fa-tachometer"></i> Dashboard
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/personal" active-class="active">
          <i class="fa fa-user"></i> Personal Info
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/skills" active-class="active">
          <i class="fa fa-pie-chart"></i> Skills
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/experience" active-class="active">
          <i class="fa fa-briefcase"></i> Experience
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/projects" active-class="active">
          <i class="fa fa-folder"></i> Projects
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/resume" active-class="active">
          <i class="fa fa-file-pdf-o"></i> Resume
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/admin/contacts" active-class="active">
          <i class="fa fa-envelope"></i> Messages
        </NuxtLink>
      </li>
    </ul>
    <div class="admin-sidebar-footer">
      <a :href="user?.avatar" class="admin-user-info" v-if="user">
        <img :src="user.avatar" :alt="user.name" class="admin-avatar" />
        <span>{{ user.name || user.login }}</span>
      </a>
      <a href="/auth/logout" class="admin-logout">
        <i class="fa fa-sign-out"></i> Logout
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user } = useUserSession()
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0; left: 0;
  width: 240px;
  height: 100vh;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 1000;
  overflow-y: auto;
}
.admin-sidebar-brand {
  padding: 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid #2a2a4a;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.admin-nav { flex: 1; padding: 12px 0; }
.admin-nav li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  color: #aaa;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}
.admin-nav li a:hover,
.admin-nav li a.active { color: #fff; background: rgba(255,255,255,0.07); }
.admin-nav li a .fa { width: 18px; text-align: center; }
.admin-sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid #2a2a4a;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.admin-user-info {
  display: flex; align-items: center; gap: 10px;
  color: #ccc; text-decoration: none; font-size: 13px;
}
.admin-avatar { width: 32px; height: 32px; border-radius: 50%; }
.admin-logout { color: #aaa; text-decoration: none; font-size: 13px; }
.admin-logout:hover { color: #fff; }
</style>
