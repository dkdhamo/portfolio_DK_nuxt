<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center revealator-slideup revealator-once revealator-delay1">
      <h1>my <span>portfolio</span></h1>
      <span class="title-bg">Works</span>
    </section>

    <!-- Portfolio Grid -->
    <section class="main-content revealator-slideup revealator-once revealator-delay1">
      <div class="container">
        <div id="grid-gallery" class="grid-gallery">
          <div class="grid-wrap">
            <ul class="row grid">
              <li v-for="(project, i) in projectList" :key="project.id" class="col-12 col-sm-6 col-md-4">
                <figure>
                  <img :src="project.thumbnailUrl" :alt="project.title" />
                  <div>
                    <span>{{ project.title }}</span>
                  </div>
                </figure>
              </li>
            </ul>
          </div>

          <!-- Slideshow -->
          <div class="slideshow">
            <ul>
              <li v-for="project in projectList" :key="`slide-${project.id}`">
                <figure>
                  <figcaption>
                    <h3>{{ project.title }}</h3>
                    <div class="row open-sans-font">
                      <div class="col-12 col-sm-6">
                        <i class="fa fa-file-text-o pr-2"></i>
                        <span class="ft-wt-600 uppercase">Project:</span> {{ project.projectType }}
                      </div>
                      <div class="col-12 col-sm-6 mt-2">
                        <i class="fa fa-user-o pr-2"></i>
                        <span class="ft-wt-600 uppercase">Client:</span> {{ project.client }}
                      </div>
                      <div class="col-12 mt-2">
                        <i class="fa fa-code pr-2"></i>
                        <span class="ft-wt-600 uppercase">Tools:</span> {{ project.tools }}
                      </div>
                      <div v-if="project.previewUrl" class="col-12 mt-2">
                        <i class="fa fa-external-link pr-2"></i>
                        <span class="ft-wt-600 uppercase">Preview:</span>
                        <a :href="project.previewUrl" target="_blank" rel="noopener">{{ project.previewUrl }}</a>
                      </div>
                    </div>
                  </figcaption>

                  <!-- Images carousel or single image -->
                  <template v-if="parseImages(project.images).length > 1">
                    <div :id="`carousel-${project.id}`" class="carousel slide" data-ride="carousel">
                      <ol class="carousel-indicators">
                        <li
                          v-for="(img, idx) in parseImages(project.images)"
                          :key="idx"
                          :data-target="`#carousel-${project.id}`"
                          :data-slide-to="idx"
                          :class="{ active: idx === 0 }"
                        ></li>
                      </ol>
                      <div class="carousel-inner">
                        <div
                          v-for="(img, idx) in parseImages(project.images)"
                          :key="idx"
                          class="carousel-item"
                          :class="{ active: idx === 0 }"
                        >
                          <img :src="img" :alt="project.title" />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <img :src="parseImages(project.images)[0] || project.thumbnailUrl" :alt="project.title" />
                  </template>
                </figure>
              </li>
            </ul>

            <nav>
              <span class="nav-prev"></span>
              <span class="nav-next"></span>
              <span class="nav-close"></span>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Portfolio – DK Personal Portfolio', bodyAttrs: { class: 'portfolio' } })

const { data } = await useFetch('/api/projects')
const projectList = computed(() => (data.value as any[]) || [])

function parseImages(raw: string): string[] {
  try { return JSON.parse(raw) } catch { return [] }
}
</script>
