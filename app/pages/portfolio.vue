<template>
  <div>
    <section class="title-section text-left text-sm-center reveal">
      <h1>my <span>portfolio</span></h1>
      <span class="title-bg">Works</span>
    </section>

    <section class="main-content reveal">
      <div class="container">
        <div class="pf-filter-bar">
          <button
            v-for="cat in categories"
            :key="cat"
            class="pf-filter-btn"
            :class="{ active: activeFilter === cat }"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>
        <div class="grid-wrap">
          <TransitionGroup tag="ul" name="grid-item" class="grid list-unstyled row">
            <li
              v-for="(project, i) in filteredList"
              :key="project.id"
              class="col-12 col-sm-6 col-md-4"
              role="button"
              tabindex="0"
              :aria-label="`View ${project.title}`"
              @click="openSlideshow(i)"
              @keydown.enter.prevent="openSlideshow(i)"
              @keydown.space.prevent="openSlideshow(i)"
              @mouseenter="onHoverEnter($event, i)"
              @mouseleave="onHoverLeave($event, i)"
            >
              <figure>
                <NuxtImg
                  :src="project.thumbnailUrl"
                  :alt="project.title"
                  width="400"
                  height="300"
                  :loading="i < 3 ? 'eager' : 'lazy'"
                  :fetchpriority="i === 0 ? 'high' : 'auto'"
                  format="webp"
                  quality="80"
                />
                <div :ref="(el) => setOverlayRef(el, i)" class="hover-overlay" aria-hidden="true">
                  <span>{{ project.title }}</span>
                </div>
              </figure>
            </li>
          </TransitionGroup>
        </div>
      </div>
    </section>

    <!-- Teleported to body so position:fixed works regardless of parent transforms -->
    <Teleport to="body">
      <Transition name="pf-modal">
        <div
          v-if="slideshowOpen"
          class="pf-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pf-modal-title"
          @click.self="closeSlideshow"
        >

          <!-- Prev card (dimmed, partially visible) -->
          <Transition name="pf-slide">
            <div
              v-if="currentIndex > 0"
              :key="`prev-${currentIndex}`"
              class="pf-slide pf-slide--prev"
              @click="navigate('prev')"
            >
              <figure>
                <NuxtImg :src="filteredList[currentIndex - 1]?.thumbnailUrl" :alt="filteredList[currentIndex - 1]?.title" width="400" height="300" format="webp" quality="80" loading="lazy" />
              </figure>
            </div>
          </Transition>

          <!-- Current card -->
          <Transition name="pf-slide" mode="out-in">
            <div :key="currentIndex" class="pf-slide pf-slide--current">
              <figure>
                <figcaption>
                  <h3 id="pf-modal-title">{{ current?.title }}</h3>
                  <div class="row open-sans-font">
                    <div class="col-12 col-sm-6">
                      <i class="fa fa-file-text-o pr-2"></i>
                      <span class="ft-wt-600 uppercase">Project:</span> {{ current?.projectType }}
                    </div>
                    <div class="col-12 col-sm-6 mt-2">
                      <i class="fa fa-user-o pr-2"></i>
                      <span class="ft-wt-600 uppercase">Client:</span> {{ current?.client }}
                    </div>
                    <div class="col-12 mt-2">
                      <i class="fa fa-code pr-2"></i>
                      <span class="ft-wt-600 uppercase">Tools:</span> {{ current?.tools }}
                    </div>
                    <div v-if="current?.previewUrl" class="col-12 mt-2">
                      <i class="fa fa-external-link pr-2"></i>
                      <span class="ft-wt-600 uppercase">Preview:</span>
                      <a :href="current.previewUrl" target="_blank" rel="noopener">{{ current.previewUrl }}</a>
                    </div>
                  </div>
                </figcaption>

                <template v-if="currentImages.length > 1">
                  <div class="pf-carousel">
                    <NuxtImg :src="currentImages[carouselIdx]" :alt="current?.title" width="800" height="500" format="webp" quality="80" loading="lazy" />
                    <div class="pf-carousel__dots" role="tablist" aria-label="Project images">
                      <button
                        v-for="(_, idx) in currentImages"
                        :key="idx"
                        role="tab"
                        :aria-selected="carouselIdx === idx"
                        :aria-label="`Image ${idx + 1} of ${currentImages.length}`"
                        :class="{ active: carouselIdx === idx }"
                        @click.stop="carouselIdx = idx"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <NuxtImg :src="currentImages[0] || current?.thumbnailUrl" :alt="current?.title" width="800" height="500" format="webp" quality="80" loading="lazy" />
                </template>
              </figure>
            </div>
          </Transition>

          <!-- Next card (dimmed, partially visible) -->
          <Transition name="pf-slide">
            <div
              v-if="currentIndex < filteredList.length - 1"
              :key="`next-${currentIndex}`"
              class="pf-slide pf-slide--next"
              @click="navigate('next')"
            >
              <figure>
                <NuxtImg :src="filteredList[currentIndex + 1]?.thumbnailUrl" :alt="filteredList[currentIndex + 1]?.title" width="400" height="300" format="webp" quality="80" loading="lazy" />
              </figure>
            </div>
          </Transition>

          <!-- Navigation -->
          <button class="pf-nav pf-nav--prev" :disabled="currentIndex === 0" aria-label="Previous project" @click="navigate('prev')">&#10094;</button>
          <button ref="closeBtn" class="pf-nav pf-nav--close" aria-label="Close project details" @click="closeSlideshow">&#10005;</button>
          <button class="pf-nav pf-nav--next" :disabled="currentIndex === filteredList.length - 1" aria-label="Next project" @click="navigate('next')">&#10095;</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const BASE = 'https://dkthecoder.online'

useSeoMeta({
  title: 'Portfolio – DK Personal Portfolio',
  description: 'Browse projects by DK — web apps, mobile apps, AI tools, and more.',
  ogTitle: 'Portfolio – DK Personal Portfolio',
  ogDescription: 'Browse projects by DK — web apps, mobile apps, AI tools, and more.',
  ogUrl: `${BASE}/portfolio`,
  ogImage: `${BASE}/img/blog/edited_pp.jpg`,
  twitterCard: 'summary_large_image',
  twitterImage: `${BASE}/img/blog/edited_pp.jpg`,
})
useHead({
  bodyAttrs: { class: 'portfolio' },
  link: [{ rel: 'canonical', href: `${BASE}/portfolio` }],
})

const { data } = await useFetch('/api/projects')
const projectList = computed(() => (data.value as any[]) || [])

// ── Category filter ───────────────────────────────────────────
const activeFilter = ref('All')
const categories = computed(() => {
  const types = projectList.value.map((p: any) => p.projectType).filter(Boolean)
  return ['All', ...Array.from(new Set<string>(types))]
})
const filteredList = computed(() =>
  activeFilter.value === 'All'
    ? projectList.value
    : projectList.value.filter((p: any) => p.projectType === activeFilter.value)
)

// ── Slideshow ────────────────────────────────────────────────
const slideshowOpen = ref(false)
const currentIndex = ref(0)
const carouselIdx = ref(0)
const closeBtn = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const current = computed(() => filteredList.value[currentIndex.value])
const currentImages = computed((): string[] => {
  try { return JSON.parse(current.value?.images ?? '[]') } catch { return [] }
})

function openSlideshow(index: number) {
  lastFocused = document.activeElement as HTMLElement
  currentIndex.value = index
  carouselIdx.value = 0
  slideshowOpen.value = true
  document.getElementById('navbar-collapse-toggle')?.classList.add('hide-header')
  document.body.style.overflow = 'hidden'
  nextTick(() => closeBtn.value?.focus())
}

function closeSlideshow() {
  slideshowOpen.value = false
  document.getElementById('navbar-collapse-toggle')?.classList.remove('hide-header')
  document.body.style.overflow = ''
  nextTick(() => lastFocused?.focus())
}

function navigate(dir: 'prev' | 'next') {
  const next = dir === 'next' ? currentIndex.value + 1 : currentIndex.value - 1
  if (next < 0 || next >= filteredList.value.length) return
  currentIndex.value = next
  carouselIdx.value = 0
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})

function onKeyDown(e: KeyboardEvent) {
  if (!slideshowOpen.value) return
  if (e.key === 'Escape') closeSlideshow()
  if (e.key === 'ArrowLeft') navigate('prev')
  if (e.key === 'ArrowRight') navigate('next')
}

// ── Direction-aware hover ────────────────────────────────────
const overlayRefs: HTMLElement[] = []
function setOverlayRef(el: any, i: number) {
  if (el) overlayRefs[i] = el as HTMLElement
}

const dirTranslate: Record<string, string> = {
  top: 'translateY(-101%)',
  right: 'translateX(101%)',
  bottom: 'translateY(101%)',
  left: 'translateX(-101%)',
}

function getHoverDir(figure: HTMLElement, e: MouseEvent): string {
  const { width, height, top, left } = figure.getBoundingClientRect()
  const nx = (e.clientX - left - width / 2) / (width / 2)
  const ny = (e.clientY - top - height / 2) / (height / 2)
  const angle = Math.atan2(ny, nx) * 180 / Math.PI
  if (angle > -135 && angle <= -45) return 'top'
  if (angle > -45 && angle <= 45) return 'right'
  if (angle > 45 && angle <= 135) return 'bottom'
  return 'left'
}

function onHoverEnter(e: MouseEvent, i: number) {
  const overlay = overlayRefs[i]
  if (!overlay) return
  const dir = getHoverDir(e.currentTarget as HTMLElement, e)
  overlay.style.transition = 'none'
  overlay.style.transform = dirTranslate[dir]!
  overlay.getBoundingClientRect()
  overlay.style.transition = 'transform 0.3s ease'
  overlay.style.transform = 'translate(0,0)'
}

function onHoverLeave(e: MouseEvent, i: number) {
  const overlay = overlayRefs[i]
  if (!overlay) return
  const dir = getHoverDir(e.currentTarget as HTMLElement, e)
  overlay.style.transition = 'transform 0.3s ease'
  overlay.style.transform = dirTranslate[dir]!
}
</script>
