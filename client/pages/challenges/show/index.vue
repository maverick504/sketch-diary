<template>
  <div>
    <div class="flex flex-col h-screen">

      <template v-if="challengeCompleted">
        <app-navbar :dark="false"/>
        <div class="flex-none navbar-spacer"></div>
      </template>

      <challenge-completed v-if="challengeCompleted" :challenge="challenge" @reset="onResetProgress"/>
      <challenge-uncompleted v-else :challenge="challenge" @completed="onChallengeCompleted"/>

      <template v-if="challengeCompleted">
        <div class="flex-none bottom-nav-spacer md:hidden"></div>
        <app-bottom-nav/>
        <div class="flex-none footer-spacer hidden md:block"></div>
        <app-footer/>
      </template>

    </div>

    <create-snap-modal/>
    <feedback-modal/>

  </div>
</template>

<script type="text/javascript">
import swal from 'sweetalert2'
import AppNavbar from '@/components/AppNavbar.vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import ChallengeCompleted from '@/pages/challenges/show/components/ChallengeCompleted.vue'
import ChallengeUncompleted from '@/pages/challenges/show/components/ChallengeUncompleted.vue'
import CreateSnapModal from '@/components/modals/CreateSnapModal.vue'
import FeedbackModal from '@/components/modals/FeedbackModal.vue'

export default {
  middleware: 'auth',

  layout: 'basic',

  components: {
    AppNavbar,
    AppBottomNav,
    AppFooter,
    ChallengeCompleted,
    ChallengeUncompleted,
    CreateSnapModal,
    FeedbackModal
  },

  data: function () {
    return {
      challenge: null,
      challengeCompleted: false
    }
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const challengeResponse = await $axios.get(`/challenges/${params.id}?with=skillPoints,references`)
      const challenge = challengeResponse.data

      return {
        challenge: challenge,
        challengeCompleted: challenge.userRelationship ? 1 : 0
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  methods: {
    onChallengeCompleted (event) {
      const userChallengeRelationship = event

      this.challenge.userRelationship = userChallengeRelationship
      this.challengeCompleted = true
    },

    async onResetProgress () {
      const result = await swal.fire({
        icon: 'warning',
        title: 'Reset progress?',
        text: 'You will go back to the previous step of this challenge.',
        showCancelButton: true,
        confirmButtonText: 'Confirm'
      })

      if (result.value) {
        await this.$axios.delete(`user-challenges/${this.challenge.userRelationship.id}`)

        this.challengeCompleted = false
      }
    }
  }
}
</script>
