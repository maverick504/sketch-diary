<template>
  <t-modal
    v-model="show"
    header="Snap details"
    width="640"
    height="0"
    ref="modal"
    @closed="closed"
  >
    <template v-if="snap">
      <div class="md:flex -m-4">
        <div class="hidden md:block w-2/5 bg-gray-100">
          <img :src="snap.media[0].variations['540w'].url" class="w-full h-auto">
        </div>
        <div class="w-full md:w-3/5 flex flex-col min-h-full">
          <div class="flex-none flex">
            <a
              :class="{ 'text-primary border-primary': activeTab === 'stats' }"
              href="#"
              role="tab"
              class="w-1/2 px-4 py-3 text-center text-gray-600 border-b-2"
              @click="setActiveTab('stats')"
            >
              Stats
            </a>
            <a
              :class="{ 'text-primary border-primary': activeTab === 'feedback' }"
              href="#"
              role="tab"
              class="w-1/2 px-4 py-3 text-center text-gray-600 border-b-2"
              @click="setActiveTab('feedback')"
            >
              Feedback <span v-if="snap.feedback_messages_count > 0" class="bg-primary px-1 py-px text-white text-sm">{{ snap.feedback_messages_count }}</span>
            </a>
          </div>
          <div v-if="activeTab === 'stats'" class="flex-grow flex flex-col p-4">
            <div class="flex-grow">
              <div class="text-gray-900 mb-4">
                <span class="align-middle">Views</span>
                <span class="text-xl float-right">{{ snap.views_count }}</span>
              </div>
              <div class="text-gray-900 mb-4">
                <span class="align-middle">Feedback messages</span>
                <span class="text-xl float-right">{{ snap.feedback_messages_count }}</span>
              </div>
            </div>
            <t-button
              class="flex-none block w-full"
              type="button"
              variant="danger"
              @click="askDeleteSnap()"
            >
              Delete snap
            </t-button>
          </div>
          <div v-else-if="activeTab === 'feedback'" id="snap-details-modal-feedback-tab-content" class="overflow-y-auto" style="max-height: 320px;">
            <div v-if="!feedback.loading && feedback.data.length === 0" class="placeholder m-4">
              <p>No feedback for this snap yet...</p>
            </div>
            <div v-else>
              <div v-for="message in feedback.data" class="bg-white p-4 border-b">
                <div class="text-gray-600 mb-2">
                  <span class="text-gray-900 mr-2">{{ message.user.username }}</span>{{ message.created_at | moment('DD/MM/YY') }}
                </div>
                <div :class="{ [`heart-rating-${message.score}`]: true }" class="heart-rating text-gray-300">
                  <div v-for="i in 5" class="heart-rating-item inline-block px-px">
                    <heart-icon size="1x" class="filled"/>
                  </div>
                </div>
                <div v-if="message.details">
                  {{ message.details }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </t-modal>
</template>

<script>
import swal from 'sweetalert2'
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    HeartIcon
  },

  data: function () {
    return {
      show: false,
      activeTab: 'stats',
      snap: null,
      feedback: {
        data: [],
        loading: false,
        page: 1,
        lastPage: 2
      }
    }
  },

  mounted () {
    this.$bus.$on('openSnapDetailsModal', async (options = {}) => {
      this.activeTab = 'stats'

      this.snap = null
      this.feedback = {
        data: [],
        loading: false,
        page: 1,
        lastPage: 2
      }

      if(options.snapId) {
        const response = await this.$axios.get(`snaps/${options.snapId}`)
        this.snap = response.data
      }

      this.show = true
    })
  },

  methods: {
    setActiveTab(tab) {
      this.activeTab = tab

      if(this.activeTab === 'feedback' && this.feedback.data.length === 0) {
        this.loadMoreFeedback()

        setTimeout(() => {
          document.getElementById('snap-details-modal-feedback-tab-content').addEventListener('scroll', this.onScroll)
        }, 100)
      } else {
        var el = document.getElementById('snap-details-modal-feedback-tab-content')

        if (el) {
          el.removeEventListener('scroll', this.onScroll)
        }
      }
    },

    closed () {
      var el = document.getElementById('snap-details-modal-feedback-tab-content')

      if (el) {
        el.removeEventListener('scroll', this.onScroll)
      }
    },

    onScroll (event) {
      if(this.feedback.page > this.feedback.lastPage) {
        return
      }

      const content = document.getElementById('snap-details-modal-feedback-tab-content')
      const bottomOfWindow = content.scrollTop + content.clientHeight >= content.scrollHeight
      if (bottomOfWindow && !this.feedback.loading && (this.feedback.page !== this.feedback.lastPage)) {
        this.feedback.page++
        this.loadMoreFeedback()
      }
    },

    async loadMoreFeedback () {
      if(this.feedback.page > this.feedback.lastPage) {
        return
      }

      this.feedback.loading = true

      const response = await this.$axios.get(`/snaps/${this.snap.id}/feedback?page=${this.feedback.page}`)

      this.feedback.data = this.feedback.data.concat(response.data.data)
      this.feedback.lastPage = response.data.lastPage

      this.feedback.loading = false
    },

    async askDeleteSnap () {
      const result = await swal.fire({
        icon: 'warning',
        title: "Are you sure?",
        text: "You won't receive any Skill Point!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.value) {
        // Delete the snap.
        await this.$axios.delete(`snaps/${this.snap.id}`)

        // Show success message.
        swal.fire({
          icon: 'success',
          title: 'Snap deleted successfully!',
          showConfirmButton: false,
          timer: 1500
        })

        // Emit "deleted" event.
        this.$emit('deleted', {
          snapId: this.snap.id
        })

        // Close this modal.
        this.show = false
      }
    }
  }
}
</script>
