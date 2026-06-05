<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style>
body { background: #f5f5f5 !important; }
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { margin-left: 240px; flex: 1; padding: 32px; }
@media (max-width: 768px) {
  .admin-main { margin-left: 0; padding: 16px; }
}
.admin-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}
.admin-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #1a1a2e; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th, .admin-table td { padding: 10px 14px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
.admin-table th { background: #f8f8f8; font-weight: 600; color: #444; }
.admin-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
.admin-btn-primary { background: #1a1a2e; color: #fff; }
.admin-btn-primary:hover { background: #2a2a5e; }
.admin-btn-danger { background: #dc3545; color: #fff; }
.admin-btn-danger:hover { background: #c82333; }
.admin-btn-secondary { background: #eee; color: #333; }
.admin-btn-secondary:hover { background: #ddd; }
.admin-input { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; margin-bottom: 12px; }
.admin-input:focus { outline: none; border-color: #1a1a2e; }
.admin-label { font-size: 13px; font-weight: 600; color: #444; display: block; margin-bottom: 4px; }
.admin-form-group { margin-bottom: 16px; }
.admin-alert-success { background: #d4edda; color: #155724; padding: 10px 16px; border-radius: 6px; font-size: 14px; }
.admin-alert-error { background: #f8d7da; color: #721c24; padding: 10px 16px; border-radius: 6px; font-size: 14px; }
</style>
