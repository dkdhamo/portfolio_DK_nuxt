<template>
  <header class="header" id="navbar-collapse-toggle">
    <!-- Desktop Navigation -->
    <nav aria-label="Main navigation" class="d-none d-lg-block">
      <ul class="icon-menu reveal">
        <li class="icon-box" :class="{ active: route.path === '/' }">
          <i class="fa fa-home" aria-hidden="true"></i>
          <NuxtLink to="/" :aria-current="route.path === '/' ? 'page' : undefined">
            <span class="nav-label">Home</span>
          </NuxtLink>
        </li>
        <li class="icon-box" :class="{ active: route.path === '/about' }">
          <i class="fa fa-user" aria-hidden="true"></i>
          <NuxtLink to="/about" :aria-current="route.path === '/about' ? 'page' : undefined">
            <span class="nav-label">About</span>
          </NuxtLink>
        </li>
        <li class="icon-box" :class="{ active: route.path === '/portfolio' }">
          <i class="fa fa-briefcase" aria-hidden="true"></i>
          <NuxtLink to="/portfolio" :aria-current="route.path === '/portfolio' ? 'page' : undefined">
            <span class="nav-label">Portfolio</span>
          </NuxtLink>
        </li>
        <li class="icon-box" :class="{ active: route.path === '/contact' }">
          <i class="fa fa-envelope-open" aria-hidden="true"></i>
          <NuxtLink to="/contact" :aria-current="route.path === '/contact' ? 'page' : undefined">
            <span class="nav-label">Contact</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Mobile Navigation -->
    <nav role="navigation" aria-label="Mobile navigation" class="d-block d-lg-none">
      <div id="menuToggle">
        <input ref="menuCheckbox" type="checkbox" aria-label="Toggle navigation menu" />
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <ul class="list-unstyled" id="menu">
          <li :class="{ active: route.path === '/' }">
            <NuxtLink to="/" :aria-current="route.path === '/' ? 'page' : undefined">
              <i class="fa fa-home" aria-hidden="true"></i><span>Home</span>
            </NuxtLink>
          </li>
          <li :class="{ active: route.path === '/about' }">
            <NuxtLink to="/about" :aria-current="route.path === '/about' ? 'page' : undefined">
              <i class="fa fa-user" aria-hidden="true"></i><span>About</span>
            </NuxtLink>
          </li>
          <li :class="{ active: route.path === '/portfolio' }">
            <NuxtLink to="/portfolio" :aria-current="route.path === '/portfolio' ? 'page' : undefined">
              <i class="fa fa-folder-open" aria-hidden="true"></i><span>Portfolio</span>
            </NuxtLink>
          </li>
          <li :class="{ active: route.path === '/contact' }">
            <NuxtLink to="/contact" :aria-current="route.path === '/contact' ? 'page' : undefined">
              <i class="fa fa-envelope-open" aria-hidden="true"></i><span>Contact</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const menuCheckbox = ref<HTMLInputElement | null>(null)

watch(() => route.path, () => {
  if (menuCheckbox.value) menuCheckbox.value.checked = false
})
</script>
