<template>
  <section
    class="container-fluid main-container container-home p-0 revealator-slideup revealator-once revealator-delay1"
  >
    <div class="color-block d-none d-lg-block"></div>
    <div class="row home-details-container align-items-center">
      <div class="col-lg-4 bg position-fixed d-none d-lg-block"></div>
      <div class="col-12 col-lg-8 offset-lg-4 home-details text-left text-sm-center text-lg-left">
        <div>
          <img
            :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'"
            class="img-fluid main-img-mobile d-sm-block d-lg-none"
            alt="profile picture"
          />
          <h6 class="text-uppercase open-sans-font mb-0 d-block d-sm-none d-lg-block">hi there !</h6>
          <h1 class="text-uppercase poppins-font">
            <span>I'm</span> {{ info?.firstName ? info.firstName.split(' ')[0] : 'DK' }}
          </h1>
          <p class="open-sans-font">{{ info?.bio || "I'm a full-stack developer focused on crafting clean & user‑friendly experiences." }}</p>
          <NuxtLink to="/about" class="btn btn-about">more about me</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({ title: 'DK – Personal Portfolio', bodyAttrs: { class: 'home' } })

const { data } = await useFetch('/api/content/personal')
const info = computed(() => (data.value as any)?.info)

onMounted(() => {
  let el = document.getElementById('particle-canvas')
  if (!el) {
    el = document.createElement('div')
    el.id = 'particle-canvas'
    el.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;'
    document.body.prepend(el)
  }

  // Wait for jQuery + ParticleNetwork to be loaded by the layout scripts
  const init = () => {
    if (typeof (window as any).ParticleNetwork !== 'undefined') {
      new (window as any).ParticleNetwork(el, { particleColor: '#000', interactive: true, speed: 'medium', density: 'high' })
    } else {
      setTimeout(init, 200)
    }
  }
  init()
})
</script>
