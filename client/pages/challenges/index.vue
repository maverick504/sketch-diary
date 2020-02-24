<template>
  <div class="container md:px-4 mx-auto md:my-8">
    <div class="block md:hidden">
      <div class="fixed w-full bg-white px-4 py-3 font-bold border-b z-10" style="top: 57px;">
        Explore Challenges
      </div>
      <div style="height: 50px;"></div>
    </div>
    <div class="hidden md:block">
      <h1 class="text-center text-3xl text-gray-900 mb-4">What skill would you like to improve today?</h1>
      <div class="text-center mb-4">
        <a
          :style="{
            background: selectedSkillId == null ? '#1a202c' : '#f7fafc',
            color: selectedSkillId == null ? '#ffffff' : '#1a202c'
          }"
          href="#"
          class="inline-block px-2 py-px mx-1"
          @click="setSelectedSkill(null)"
        >
          All
        </a><!--
     --><a
          v-for="skill in mainSkills"
          :style="{
            background: selectedSkillId == skill.id ? skill.color : '#f7fafc',
            color: selectedSkillId == skill.id ? '#ffffff' : skill.color
          }"
          href="#"
          class="inline-block px-2 py-px mx-1"
          @click="setSelectedSkill(skill.id)"
        >
          {{ skill.name }}
        </a>
      </div>
    </div>
    <div class="flex flex-wrap md:-mx-2 md:-mt-4">
      <div v-for="challenge in challenges" class="w-full md:w-1/2 lg:w-1/3 md:px-2 md:pt-4">
        <challenge-item :challenge="challenge"/>
      </div>
    </div>
  </div>
</template>

<script>
import ChallengeItem from '@/components/ChallengeItem.vue'

export default {
  components: {
    ChallengeItem
  },

  data: function () {
    return {
      mainSkills: [],
      selectedSkillId: null,
      challenges: [],
      loading: false,
      page: 1,
      lastPage: 2
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const response = await $axios.get(`/main-skills`)

      return {
        mainSkills: response.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  mounted () {
    document.addEventListener('scroll', this.onScroll)
    this.loadMore()
  },

  destroyed () {
    document.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll (event) {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 128)
      if (bottomOfWindow && (this.loading == false) && (this.page < this.lastPage)) {
        this.page++
        this.loadMore()
      }
    },

    clearResults () {
      this.challenges = []
      this.page = 1
      this.lastPage = 2
    },

    async loadMore () {
      if(this.page > this.lastPage) {
        return
      }

      this.loading = true

      let response

      if(this.selectedSkillId) {
        response = await this.$axios.get(`/challenges?skill_id=${this.selectedSkillId}&page=${this.page}`)
      } else {
        response = await this.$axios.get(`/challenges?page=${this.page}`)
      }

      this.challenges = this.challenges.concat(response.data.data)
      this.lastPage = response.data.lastPage

      this.loading = false
    },

    setSelectedSkill (skillId) {
      if(skillId !== this.selectedSkillId) {
        this.selectedSkillId = skillId
        this.clearResults()
        this.loadMore()
      }
    }
  },

  watch: {
    selectedSkillId (value) {
      this.setSelectedSkill(value)
    }
  }
}
</script>
