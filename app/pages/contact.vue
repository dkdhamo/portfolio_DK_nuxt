<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center reveal">
      <h1>get in <span>touch</span></h1>
    </section>

    <!-- Main Content -->
    <section class="main-content reveal">
      <div class="container">
        <div class="row">
          <!-- Left: Contact Info -->
          <div class="col-12 col-lg-4">
            <h2 class="text-uppercase custom-title mb-0 ft-wt-600 pb-3">Let's talk</h2>
            <p class="open-sans-font mb-4">
              I'm open to full-stack engineering roles and interesting build problems &mdash;
              APIs, front ends, or AI tooling. Send a note and I'll reply within a couple of days.
            </p>
            <div class="contactinfo open-sans-font">
              <ul class="list-unstyled">
                <li class="media">
                  <i class="fa fa-envelope-open align-self-start mr-3" aria-hidden="true"></i>
                  <span class="media-body">{{ info?.contactEmail || 'webtechians.dev@gmail.com' }}</span>
                </li>
                <li class="media mt-2">
                  <i class="fa fa-phone-square align-self-start mr-3" aria-hidden="true"></i>
                  <span class="media-body">{{ info?.phone }}</span>
                </li>
              </ul>
            </div>
            <ul class="social list-unstyled pt-1 mb-5">
              <li v-if="info?.linkedinUrl">
                <a :href="info.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn profile">
                  <i class="fa fa-linkedin" aria-hidden="true"></i>
                </a>
              </li>
              <li v-if="info?.githubUrl">
                <a :href="info.githubUrl" target="_blank" rel="noopener" aria-label="GitHub profile">
                  <i class="fa fa-github" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- Right: Contact Form -->
          <div class="col-12 col-lg-8">
            <form class="contactform" novalidate @submit.prevent="submitForm">
              <div class="row">
                <div class="col-12 col-sm-6">
                  <label for="contact-name" class="sr-only">Your Name</label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    type="text"
                    name="name"
                    :class="['form-control', { 'has-error': errors.name }]"
                    placeholder="YOUR NAME"
                    autocomplete="name"
                    :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                    :aria-invalid="errors.name ? 'true' : undefined"
                    @blur="validateField('name')"
                  />
                  <span v-if="errors.name" id="contact-name-error" class="field-error" role="alert">{{ errors.name }}</span>
                </div>
                <div class="col-12 col-sm-6 mt-3 mt-sm-0">
                  <label for="contact-email" class="sr-only">Your Email</label>
                  <input
                    id="contact-email"
                    v-model="form.email"
                    type="email"
                    name="email"
                    :class="['form-control', { 'has-error': errors.email }]"
                    placeholder="YOUR EMAIL"
                    autocomplete="email"
                    :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                    :aria-invalid="errors.email ? 'true' : undefined"
                    @blur="validateField('email')"
                  />
                  <span v-if="errors.email" id="contact-email-error" class="field-error" role="alert">{{ errors.email }}</span>
                </div>
                <div class="col-12 mt-3">
                  <label for="contact-subject" class="sr-only">Subject</label>
                  <input
                    id="contact-subject"
                    v-model="form.subject"
                    type="text"
                    name="subject"
                    class="form-control"
                    placeholder="YOUR SUBJECT"
                    autocomplete="off"
                  />
                </div>
                <div class="col-12 mt-3">
                  <label for="contact-message" class="sr-only">Your Message</label>
                  <textarea
                    id="contact-message"
                    v-model="form.message"
                    name="message"
                    :class="['form-control', { 'has-error': errors.message }]"
                    placeholder="YOUR MESSAGE"
                    rows="4"
                    :aria-describedby="errors.message ? 'contact-message-error' : undefined"
                    :aria-invalid="errors.message ? 'true' : undefined"
                    @blur="validateField('message')"
                  ></textarea>
                  <span v-if="errors.message" id="contact-message-error" class="field-error" role="alert">{{ errors.message }}</span>
                </div>
                <div class="col-12 mt-3">
                  <button type="submit" :disabled="sending || hasErrors" class="btn btn-contact">
                    {{ sending ? 'Sending...' : 'Send Message' }}
                  </button>
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
const BASE = SITE_URL

const { data } = await useFetch('/api/content/personal')
const info = computed(() => (data.value as any)?.info)

const seoTitle = 'Contact Dhamodhara Kannan (DK) — Hire a Full Stack Engineer'
const seoDescription = metaDescription(
  'Contact Dhamodhara Kannan (DK), a full-stack software engineer in Chennai, India, about engineering roles, contract work and collaboration. Replies within a couple of days.',
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ...socialMeta({
    title: seoTitle,
    description: seoDescription,
    url: `${BASE}/contact`,
    image: absoluteUrl('/img/blog/edited_pp.jpg'),
  }),
})

useHead({
  bodyAttrs: { class: 'contact' },
  link: [{ rel: 'canonical', href: `${BASE}/contact` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': `${BASE}/contact#contactpage`,
          url: `${BASE}/contact`,
          name: seoTitle,
          description: seoDescription,
          inLanguage: 'en',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#person` },
          mainEntity: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'Dhamodhara Kannan',
            alternateName: NAME_VARIANTS,
            email: info.value?.contactEmail || info.value?.email || undefined,
            telephone: info.value?.phone || undefined,
            url: SITE_URL,
          },
        }),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]),
      ),
    },
  ],
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const sending = ref(false)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(field: 'name' | 'email' | 'message') {
  if (field === 'name') {
    errors.name = form.name.trim().length < 2 ? 'Name must be at least 2 characters.' : ''
  } else if (field === 'email') {
    errors.email = !emailRe.test(form.email) ? 'Please enter a valid email address.' : ''
  } else if (field === 'message') {
    errors.message = form.message.trim().length < 10 ? 'Message must be at least 10 characters.' : ''
  }
}

function validateAll() {
  validateField('name')
  validateField('email')
  validateField('message')
}

const hasErrors = computed(() => !!(errors.name || errors.email || errors.message))

const { show: showToast } = useToast()

async function submitForm() {
  validateAll()
  if (hasErrors.value) return
  sending.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    showToast('Message sent successfully!', 'success')
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    errors.name = ''
    errors.email = ''
    errors.message = ''
  } catch {
    showToast('Something went wrong. Please try again.', 'error')
  } finally {
    sending.value = false
  }
}
</script>
