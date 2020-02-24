<template>
  <t-modal
    v-model="show"
    :clickToClose="!form.busy"
    :escToClose="!form.busy"
    :hideCloseButton="!form.busy"
    header="Help us with your feedback!"
    width="400"
    height="0"
    ref="modal"
  >
    <form method="post" @submit.prevent="send">
      <error-alert :form="form"/>
      <div class="bg-gray-100 border-l-4 border-gray-300 text-gray-600 p-4 mb-4">
        <p>We do not reply to feedback submited through this form. If you have any problem, send us a DM on <a href="https://twitter.com/sketchdiary_app" target="_blank" class="text-primary">Twitter</a>.</p>
      </div>
      <t-input-group>
        <label class="block text-gray-700 mb-2" for="feedback-modal-type">Type</label>
        <t-select
          id="feedback-modal-type"
          :class="{ 'border-danger': form.hasErrors('type') }"
          v-model="form.type"
          :options="feedbackTypeOptions"
        />
        <has-error :form="form" field="type"/>
      </t-input-group>
      <t-input-group>
        <label class="block text-gray-700 mb-2" for="snap-feedback-modal-details">Details</label>
        <t-textarea
          id="snap-feedback-modal-details"
          :class="{ 'border-danger': form.hasErrors('details') }"
          v-model="form.details"
          rows="4"
        />
        <has-error :form="form" field="details"/>
      </t-input-group>
    </form>
    <template slot="footer">
      <t-button
        :class="{ 'button-loading': form.busy }"
        class="block w-full"
        type="button"
        variant="primary"
        size="lg"
        @click="send()"
      >
        Send
      </t-button>
    </template>
  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'

export default {
  data () {
    return {
      show: false,
      feedbackTypeOptions: [
        { value: 'challenge-suggestion', text: 'Challenge suggestion' },
        { value: 'other-suggestion', text: 'Other suggestion' },
        { value: 'bug-report', text: 'Bug report' },
        { value: 'feature-request', text: 'Feature request' },
        { value: 'other', text: 'Other' }
      ],
      form: new Form({
        type: null,
        details: '',
        origin_url: null
      })
    }
  },

  mounted () {
    this.$bus.$on('openFeedbackModal', () => {
      this.form.clearErrors()
      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('openFeedbackModal')
  },

  methods: {
    async send() {
      this.form.busy = true

      try {
        // Submit the feedback
        const response = await this.$axios.post('feedback', {
          type: this.form.type,
          details: this.form.details,
          origin_url: window.location.href
        })

        // Show success message
        swal.fire({
          icon: 'success',
          title: 'Thank you!',
          showConfirmButton: false,
          timer: 1500
        })

        // Hide this modal
        this.$nextTick(() => {
          this.$refs.modal.hide()
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
