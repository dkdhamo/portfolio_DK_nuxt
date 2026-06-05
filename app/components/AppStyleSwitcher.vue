<template>
  <div>
    <div id="switcher">
      <div class="content-switcher">
        <h4>STYLE SWITCHER</h4>
        <ul>
          <li v-for="skin in skins" :key="skin">
            <a href="#" :title="skin" class="color" @click.prevent="setSkin(skin)">
              <img :src="`/img/styleswitcher/${skin}.png`" :alt="skin" />
            </a>
          </li>
        </ul>
        <div id="hideSwitcher" @click="hideSwitcher">&times;</div>
      </div>
    </div>
    <div id="showSwitcher" class="styleSecondColor" @click="showSwitcher">
      <i class="fa fa-cog fa-spin"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
const skins = ['purple','red','blueviolet','blue','goldenrod','magenta','yellowgreen','orange','green','yellow']

function setSkin(skin: string) {
  if (process.client) {
    const links = document.querySelectorAll('link[rel="stylesheet"][href*="/css/skins/"]')
    links.forEach(l => l.remove())
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `/css/skins/${skin}.css`
    document.head.appendChild(link)
    localStorage.setItem('portfolio-skin', skin)
  }
}

function hideSwitcher() {
  document.getElementById('switcher')?.classList.remove('open')
}

function showSwitcher() {
  document.getElementById('switcher')?.classList.add('open')
}

onMounted(() => {
  const saved = localStorage.getItem('portfolio-skin') || 'orange'
  setSkin(saved)
})
</script>
