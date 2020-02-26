<template>
  <div class="flex flex-row items-center h-screen bg-gray-100 px-4 md:px-16 py-4 md:py-8">

    <div v-if="challenge.references.length > 0" class="flex-none hidden md:inline-block mr-4">
      <t-button variant="secondary" default-size-class="px-4 py-4" @click="previousReference()">
        <arrow-left-icon size="2x"/>
      </t-button>
    </div>

    <div class="flex-grow flex flex-col justify-center h-full">
      <div class="flex-none text-center mb-4">
        <h1 class="inline-block text-xl text-gray-900 hover:text-primary cursor-pointer" @click="pause()">
          {{ challenge.title }}
        </h1>
      </div>
      <div v-if="challenge.references.length > 0" class="zoomable-reference-image flex-grow h-full mx-auto mb-2">
        <img :src="currentReference.image_url" data-zoomable class="object-contain object-center">
      </div>
      <div v-if="challenge.references.length > 0" class="text-center mb-4">
        <a :href="currentReference.origin_url" target="_blank" class="text-gray-600 hover:text-primary">
          <external-link-icon size="1x" class="inline"/> {{ currentReference.site_name }}
        </a>
      </div>
      <div class="flex-none text-center">
        <stopwatch ref="stopwatch" :status="stopwatchStatus" class="mb-4"/>
        <div class="flex flex-row">
          <div class="flex-none block md:hidden">
            <t-button v-if="challenge.references.length > 0" type="button" variant="secondary" size="sm" class="mx-1" @click="previousReference()">
              <arrow-left-icon size="1x" class="inline"/>
            </t-button>
          </div>
          <div class="flex-grow text-center">
            <t-button :disabled="stopwatchStatus==='paused'" type="button" variant="success" size="sm" @click="completeChallenge()">
              <check-icon size="1x" class="inline"/><span class="hidden md:inline ml-1">Done</span>
            </t-button><!--
         --><t-button :disabled="stopwatchStatus==='paused'" type="button" variant="primary" class="mx-1" size="sm" @click="pause()">
              <pause-icon size="1x" class="inline"/><span class="hidden md:inline ml-1">{{ stopwatchStatus==='paused'?'Paused...':'Pause' }}</span>
            </t-button><!--
         --><t-button :disabled="stopwatchStatus==='paused'" type="button" variant="danger" size="sm" @click="cancelChallenge()">
              <x-icon size="1x" class="inline"/><span class="hidden md:inline ml-1">Cancel</span>
            </t-button>
          </div>
          <div class="flex-none block md:hidden">
            <t-button v-if="challenge.references.length > 0" type="button" variant="secondary" size="sm" class="mx-1" @click="nextReference()">
              <arrow-right-icon size="1x" class="inline"/>
            </t-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="challenge.references.length > 0" class="flex-none hidden md:inline-block ml-4">
      <t-button variant="secondary" default-size-class="px-4 py-4" @click="nextReference()">
        <arrow-right-icon size="2x"/>
      </t-button>
    </div>

    <t-modal
      v-model="showChallengeInformationModal"
      :hideCloseButton="true"
      :header="challenge.title"
      width="400"
      ref="modal"
      @closed="resume"
    >
      <div class="text-gray-600 mb-3">
        <div class="inline-block text-gray-600 mr-2"><bar-chart-icon size="1x" class="inline mr-1"/><span class="align-middle">{{ challenge.difficulty_level }} level</span></div><!--
     --><div class="inline-block text-gray-600"><clock-icon size="1x" class="inline mr-1"/><span class="align-middle">{{ challenge.estimated_time }} min.</span></div>
      </div>
      <div class="mb-3">
        <span v-for="skill in challenge.skillPoints" :style="{ color: skill.color }" class="mr-2">
          {{ `+${skill.pivot.points} ${skill.name}` }}
        </span>
      </div>
      <div class="text-left text-gray-900">
        {{ challenge.body }}
      </div>
      <template slot="footer">
        <p v-if="!challengeStarted" class="text-center mb-3">
          Prepare your pencil, sheets of paper or your drawing tablet...
        </p>
        <t-button
          v-if="challengeStarted"
          class="block w-full"
          type="button"
          variant="primary"
          size="lg"
          @click="resume()"
        >
          Resume
        </t-button>
        <t-button
          v-else
          class="block w-full"
          type="button"
          variant="primary"
          size="lg"
          @click="startChallenge()"
        >
          I'm ready!
        </t-button>
      </template>
    </t-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import swal from 'sweetalert2'
import mediumZoom from 'medium-zoom'
import Stopwatch from '@/components/Stopwatch.vue'
import { BarChartIcon, ClockIcon, ExternalLinkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, PlayIcon, PauseIcon, XIcon } from 'vue-feather-icons'

export default {
  components: {
    Stopwatch,
    BarChartIcon,
    ClockIcon,
    ExternalLinkIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    PlayIcon,
    PauseIcon,
    XIcon
  },

  props: {
    challenge: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      showChallengeInformationModal: true,
      challengeStarted: false,
      stopwatchStatus: 'stopped', // Possible statuses are: stopped, active and paused.
      currentReferenceIndex: 0
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated']),

    currentReference () {
      if(this.challenge.references.length === 0) {
        return
      }

      return this.challenge.references[this.currentReferenceIndex]
    }
  },

  mounted () {
    this.$nextTick(() => {
      mediumZoom('[data-zoomable]', {
        margin: 0,
        background: '#4444'
      })
    })
  },

  methods: {
    startChallenge () {
      this.challengeStarted = true
      this.stopwatchStatus = 'active'
      this.showChallengeInformationModal = false
    },

    async completeChallenge () {
      this.stopwatchStatus = 'stopped'

      const response = await this.$axios.post(`challenges/${this.challenge.id}/mark-as-complete`, {
        time_taken: this.$refs.stopwatch.secondsEllapsed
      })

      const userChallengeRelationship = response.data
      this.$emit('completed', userChallengeRelationship)
    },

    async cancelChallenge () {
      const result = await swal.fire({
        icon: 'warning',
        title: 'Abandon this challenge?',
        text: 'You will be redirected to the challenges page.',
        showCancelButton: true,
        confirmButtonText: 'Confirm'
      })

      if (result.value) {
        this.$router.push({ name: 'challenges.index' })
      }
    },

    pause () {
      this.stopwatchStatus = 'paused'
      this.showChallengeInformationModal = true
    },

    resume () {
      this.stopwatchStatus = 'active'
      this.showChallengeInformationModal = false
    },

    previousReference () {
      this.currentReferenceIndex--
      if(this.currentReferenceIndex < 0) {
        this.currentReferenceIndex = (this.challenge.references.length - 1)
      }
    },

    nextReference () {
      this.currentReferenceIndex++
      if(this.currentReferenceIndex > (this.challenge.references.length - 1)) {
        this.currentReferenceIndex = 0
      }
    }
  }
}
</script>
