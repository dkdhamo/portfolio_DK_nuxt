<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">DK Portfolio</h1>
      <p class="login-sub">Admin Panel</p>
      <a href="/auth/github" class="login-btn">
        <i class="fa fa-github"></i>
        Sign in with GitHub
      </a>
      <p v-if="route.query.error" class="login-error">Access denied. Only the portfolio owner can log in.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Admin Login – DK Portfolio' })

const route = useRoute()
const { loggedIn } = useUserSession()

if (loggedIn.value) {
  await navigateTo('/admin')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  text-align: center;
  width: 100%;
  max-width: 380px;
}
.login-title { font-size: 28px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
.login-sub { color: #888; font-size: 14px; margin-bottom: 32px; }
.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #1a1a2e;
  color: #fff;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s;
}
.login-btn:hover { background: #2a2a5e; color: #fff; }
.login-error { color: #dc3545; font-size: 13px; margin-top: 16px; }
</style>
