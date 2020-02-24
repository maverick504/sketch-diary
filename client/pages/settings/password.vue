<template>
  <form
    method="post"
    @submit.prevent="update">

    <error-alert :form="form"/>

    <t-input-group>
      <label class="block text-gray-700 mb-2" for="change-password-current-password">Current password</label>
      <t-input
        id="edit-profile-current-password"
        :class="{ 'border-danger': form.hasErrors('current_password') }"
        v-model="form.current_password"
        type="password"
        placeholder="Current password"
      />
      <has-error :form="form" field="current_password"/>
    </t-input-group>

    <t-input-group>
      <label class="block text-gray-700 mb-2" for="change-password-new-password">New password</label>
      <t-input
        id="edit-profile-new-password"
        :class="{ 'border-danger': form.hasErrors('new_password') }"
        v-model="form.new_password"
        type="password"
        placeholder="New password"
      />
      <has-error :form="form" field="new_password"/>
    </t-input-group>

    <t-input-group>
      <label class="block text-gray-700 mb-2" for="change-password-new-password-confirmation">New password confirmation</label>
      <t-input
        id="edit-profile-new-password-confirmation"
        :class="{ 'border-danger': form.hasErrors('new_password_confirmation') }"
        v-model="form.new_password_confirmation"
        type="password"
        placeholder="New password confirmation"
      />
      <has-error :form="form" field="new_password_confirmation"/>
    </t-input-group>

    <div class="mt-4">
      <t-button :class="{ 'button-loading': form.busy }" type="submit" variant="primary">
        Update
      </t-button>
    </div>

  </form>
</template>

<script>
import Form from '@/plugins/adonis-form'
import swal from 'sweetalert2'

export default {
  head () {
    return { title: 'Settings - Password' }
  },

  data: function () {
    return {
      form: new Form({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
    }
  },

  methods: {
    async update () {
      this.form.clearErrors()
      this.form.busy = true

      try {
        await this.$axios.patch('settings/password', {
          current_password: this.form.current_password,
          new_password: this.form.new_password,
          new_password_confirmation: this.form.new_password_confirmation
        })

        swal.fire({
          icon: 'success',
          title: 'Password updated!',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
