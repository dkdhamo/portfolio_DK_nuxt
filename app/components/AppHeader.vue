<template>
  <header class="header" id="navbar-collapse-toggle">
    <!-- Desktop Navigation -->
    <ul class="icon-menu d-none d-lg-block revealator-slideup revealator-once revealator-delay1">
      <li class="icon-box" :class="{ active: route.path === '/' }">
        <i class="fa fa-home"></i>
        <NuxtLink to="/"><h2>Home</h2></NuxtLink>
      </li>
      <li class="icon-box" :class="{ active: route.path === '/about' }">
        <i class="fa fa-user"></i>
        <NuxtLink to="/about"><h2>About</h2></NuxtLink>
      </li>
      <li class="icon-box" :class="{ active: route.path === '/portfolio' }">
        <i class="fa fa-briefcase"></i>
        <NuxtLink to="/portfolio"><h2>Portfolio</h2></NuxtLink>
      </li>
      <li class="icon-box" :class="{ active: route.path === '/contact' }">
        <i class="fa fa-envelope-open"></i>
        <NuxtLink to="/contact"><h2>Contact</h2></NuxtLink>
      </li>
    </ul>

    <!-- Mobile Navigation -->
    <nav role="navigation" class="d-block d-lg-none">
      <div id="menuToggle">
        <input type="checkbox" />
        <span></span><span></span><span></span>
        <ul class="list-unstyled" id="menu">
          <li :class="{ active: route.path === '/' }">
            <NuxtLink to="/"><i class="fa fa-home"></i><span>Home</span></NuxtLink>
          </li>
          <li :class="{ active: route.path === '/about' }">
            <NuxtLink to="/about"><i class="fa fa-user"></i><span>About</span></NuxtLink>
          </li>
          <li :class="{ active: route.path === '/portfolio' }">
            <NuxtLink to="/portfolio"><i class="fa fa-folder-open"></i><span>Portfolio</span></NuxtLink>
          </li>
          <li :class="{ active: route.path === '/contact' }">
            <NuxtLink to="/contact"><i class="fa fa-envelope-open"></i><span>Contact</span></NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
