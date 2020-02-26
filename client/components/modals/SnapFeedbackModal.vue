<template>
  <t-modal
    v-model="show"
    :clickToClose="!form.busy"
    :escToClose="!form.busy"
    :hideCloseButton="form.busy"
    header="Send feedback"
    width="640"
    height="0"
    ref="modal"
  >
    <div v-if="snap" class="md:flex -m-4">
      <div class="hidden md:block md:w-2/5 bg-gray-100">
        <img :src="snap.media[0].variations['540w'].url" class="w-full h-auto">
      </div>
      <form method="post" class="w-full md:w-3/5 flex flex-col min-h-full p-4" @submit.prevent="save">
        <div class="flex-grow">
          <error-alert :form="form"/>
          <t-input-group class="text-center">
            <heart-rating :score.sync="form.score"/>
            <has-error :form="form" field="score"/>
          </t-input-group>
          <t-input-group>
            <label class="block text-gray-700 mb-2" for="snap-feedback-modal-details">Details (optional)</label>
            <t-textarea
              id="snap-feedback-modal-details"
              :class="{ 'border-danger': form.hasErrors('details') }"
              v-model="form.details"
              placeholder="You can also give advice to this artist, a message of support or whatever you want..."
              rows="4"
            />
            <has-error :form="form" field="details"/>
          </t-input-group>
        </div>
        <t-button
          :class="{ 'button-loading': form.busy }"
          class="flex-none block w-full"
          type="submit"
          variant="primary"
          size="lg"
        >
          Send
        </t-button>
      </form>
    </div>
  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'
import HeartRating from '@/components/HeartRating.vue'

export default {
  components: {
    HeartRating
  },

  data: function () {
    return {
      show: false,
      snap: null,
      form: new Form({
        score: null,
        details: null
      })
    }
  },

  mounted () {
    this.$bus.$on('openSnapFeedbackModal', async (options = {}) => {
      this.clearForm()

      if(options.snapId) {
        const response = await this.$axios.get(`snaps/${options.snapId}`)
        this.snap = response.data
      }

      this.show = true
    })
  },

  methods: {
    clearForm () {
      this.snap = null

      this.form.score = null
      this.form.details = null

      this.form.clearErrors()
    },

    async save () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        const response = await this.$axios.post(`snaps/${this.snap.id}/feedback`, this.form)

        // Show success message
        swal.fire({
          icon: 'success',
          title: 'Feedback sent successfully!',
          showConfirmButton: false,
          timer: 1500
        })

        // Emit a "sent" event.
        this.$emit('sent', {
          snapId: this.snap.id,
          response: response
        })

        // Hide this modal
        this.show = false
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
