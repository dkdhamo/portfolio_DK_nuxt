<template>
  <div>
    <!-- Page Title -->
    <section class="title-section text-left text-sm-center revealator-slideup revealator-once revealator-delay1">
      <h1>ABOUT <span>ME</span></h1>
      <span class="title-bg">Resume</span>
    </section>

    <!-- Main Content -->
    <section class="main-content revealator-slideup revealator-once revealator-delay1">
      <div class="container">
        <div class="row">
          <!-- Personal Info -->
          <div class="col-12 col-lg-5 col-xl-6">
            <div class="row">
              <div class="col-12">
                <h3 class="text-uppercase custom-title mb-0 ft-wt-600">personal infos</h3>
              </div>
              <div class="col-12 d-block d-sm-none">
                <img :src="info?.profileImageUrl || '/img/blog/edited_pp.jpg'" class="img-fluid main-img-mobile" alt="profile" />
              </div>
              <div class="col-6">
                <ul class="about-list list-unstyled open-sans-font">
                  <li><span class="title">first name :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.firstName }}</span></li>
                  <li><span class="title">last name :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.lastName }}</span></li>
                  <li><span class="title">Age :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.age }} Years</span></li>
                  <li><span class="title">Nationality :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.nationality }}</span></li>
                  <li><span class="title">Freelance :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.freelanceAvailable ? 'Available' : 'Not Available' }}</span></li>
                </ul>
              </div>
              <div class="col-6">
                <ul class="about-list list-unstyled open-sans-font">
                  <li><span class="title">City :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.city }}</span></li>
                  <li><span class="title">Phone :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.phone }}</span></li>
                  <li><span class="title">Email :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.email }}</span></li>
                  <li><span class="title">Language :</span> <span class="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">{{ info?.language }}</span></li>
                </ul>
              </div>
              <div class="col-12 mt-3">
                <a :href="info?.cvUrl || '/assets/resume/DK_resume_new_temp.pdf'" target="_blank" class="btn btn-download">Download CV</a>
              </div>
            </div>
          </div>

          <!-- Stats Boxes -->
          <div class="col-12 col-lg-7 col-xl-6 mt-5 mt-lg-0">
            <div class="row">
              <div class="col-6">
                <div class="box-stats with-margin">
                  <h3 class="poppins-font position-relative">{{ statsData?.yearsExperience }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase">years of <span class="d-block">experience</span></p>
                </div>
              </div>
              <div class="col-6">
                <div class="box-stats with-margin">
                  <h3 class="poppins-font position-relative">{{ statsData?.completedProjects }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase">completed <span class="d-block">projects</span></p>
                </div>
              </div>
              <div class="col-6">
                <div class="box-stats">
                  <h3 class="poppins-font position-relative">{{ statsData?.happyClients }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase">happy <span class="d-block">clients</span></p>
                </div>
              </div>
              <div class="col-6">
                <div class="box-stats">
                  <h3 class="poppins-font position-relative">{{ statsData?.awardsWon }}</h3>
                  <p class="open-sans-font m-0 position-relative text-uppercase">awards <span class="d-block">won</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="separator" />

        <!-- Skills -->
        <div class="row">
          <div class="col-12">
            <h3 class="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-left text-sm-center custom-title ft-wt-600">My Skills</h3>
          </div>
          <div v-for="skill in skillsList" :key="skill.id" class="col-6 col-md-3 mb-3 mb-sm-5">
            <div :class="`c100 p${skill.percentage}`">
              <span>{{ skill.percentage }}%</span>
              <div class="slice">
                <div class="bar"></div>
                <div class="fill"></div>
              </div>
            </div>
            <h6 class="text-uppercase open-sans-font text-center mt-2 mt-sm-4">{{ skill.name }}</h6>
          </div>
        </div>

        <hr class="separator mt-1" />

        <!-- Experience & Education -->
        <div class="row">
          <div class="col-12">
            <h3 class="text-uppercase pb-5 mb-0 text-left text-sm-center custom-title ft-wt-600">
              Experience <span>&</span> Education
            </h3>
          </div>
          <div class="col-lg-6 m-15px-tb" style="margin-left: auto; margin-right: auto;">
            <div class="resume-box">
              <ul>
                <li v-for="exp in experienceList" :key="exp.id">
                  <div class="icon">
                    <i :class="exp.type === 'education' ? 'fa fa-graduation-cap' : 'fa fa-briefcase'"></i>
                  </div>
                  <span class="time open-sans-font text-uppercase">{{ exp.year }}</span>
                  <h5 class="poppins-font text-uppercase">{{ exp.title }}</h5>
                  <p class="open-sans-font">{{ exp.company }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'About – DK Personal Portfolio', bodyAttrs: { class: 'about' } })

const [personalData, skillsFetch, experienceFetch] = await Promise.all([
  useFetch('/api/content/personal'),
  useFetch('/api/content/skills'),
  useFetch('/api/content/experience'),
])

const info = computed(() => (personalData.data.value as any)?.info)
const statsData = computed(() => (personalData.data.value as any)?.stats)
const skillsList = computed(() => (skillsFetch.data.value as any[]) || [])
const experienceList = computed(() => (experienceFetch.data.value as any[]) || [])
</script>
