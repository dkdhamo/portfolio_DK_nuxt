<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center revealator-slideup revealator-once revealator-delay1">
      <h1>get in <span>touch</span></h1>
      <span class="title-bg">Contact</span>
    </section>

    <!-- Main Content -->
    <section class="main-content revealator-slideup revealator-once revealator-delay1">
      <div class="container">
        <div class="row">
          <!-- Left: Contact Info -->
          <div class="col-12 col-lg-4">
            <h3 class="text-uppercase custom-title mb-0 ft-wt-600 pb-3">Don't be shy !</h3>
            <p class="open-sans-font mb-4">
              Feel free to get in touch with me. I am always open to discussing new projects,
              creative ideas or opportunities to be part of your visions.
            </p>
            <div class="contactinfo open-sans-font">
              <ul class="list-unstyled">
                <li class="media">
                  <i class="fa fa-envelope-open align-self-start mr-3"></i>
                  <span class="media-body">{{ info?.contactEmail || 'webtechians.dev@gmail.com' }}</span>
                </li>
                <li class="media mt-2">
                  <i class="fa fa-phone-square align-self-start mr-3"></i>
                  <span class="media-body">{{ info?.phone }}</span>
                </li>
              </ul>
            </div>
            <ul class="social list-unstyled pt-1 mb-5">
              <li v-if="info?.facebookUrl">
                <a :href="info.facebookUrl" target="_blank" rel="noopener"><i class="fa fa-facebook"></i></a>
              </li>
              <li v-if="info?.twitterUrl">
                <a :href="info.twitterUrl" target="_blank" rel="noopener"><i class="fa fa-twitter"></i></a>
              </li>
              <li v-if="info?.linkedinUrl">
                <a :href="info.linkedinUrl" target="_blank" rel="noopener"><i class="fa fa-linkedin"></i></a>
              </li>
              <li v-if="info?.dribbbleUrl">
                <a :href="info.dribbbleUrl" target="_blank" rel="noopener"><i class="fa fa-dribbble"></i></a>
              </li>
            </ul>
          </div>

          <!-- Right: Contact Form -->
          <div class="col-12 col-lg-8">
            <form @submit.prevent="submitForm" class="contactform">
              <div class="row">
                <div class="col-12 col-sm-6">
                  <input
                    v-model="form.name"
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="YOUR NAME"
                    required
                  />
                </div>
                <div class="col-12 col-sm-6 mt-3 mt-sm-0">
                  <input
                    v-model="form.email"
                    type="email"
                    name="email"
                    class="form-control"
                    placeholder="YOUR EMAIL"
                    required
                  />
                </div>
                <div class="col-12 mt-3">
                  <input
                    v-model="form.subject"
                    type="text"
                    name="subject"
                    class="form-control"
                    placeholder="YOUR SUBJECT"
                  />
                </div>
                <div class="col-12 mt-3">
                  <textarea
                    v-model="form.message"
                    name="message"
                    class="form-control"
                    placeholder="YOUR MESSAGE"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div class="col-12 mt-3">
                  <button type="submit" :disabled="sending" class="btn btn-contact">
                    {{ sending ? 'Sending...' : 'Send Message' }}
                  </button>
                  <span
                    class="output_message ml-3"
                    :class="{ 'text-success': status === 'ok', 'text-danger': status === 'error' }"
                  >
                    {{ statusMessage }}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact – DK Personal Portfolio', bodyAttrs: { class: 'contact' } })

const { data } = await useFetch('/api/content/personal')
const info = computed(() => (data.value as any)?.info)

const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const status = ref<'idle' | 'ok' | 'error'>('idle')
const statusMessage = ref('')

async function submitForm() {
  sending.value = true
  status.value = 'idle'
  statusMessage.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    status.value = 'ok'
    statusMessage.value = 'Message Sent!'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch {
    status.value = 'error'
    statusMessage.value = 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>
