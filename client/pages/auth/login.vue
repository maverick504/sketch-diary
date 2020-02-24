<template>
  <div>
    <h1 class="text-2xl text-center mb-4">Log in</h1>
    <form
      method="post"
      @submit.prevent="login">

      <error-alert :form="form"/>

      <t-input-group>
        <label
          class="block text-gray-700 mb-2"
          for="email">Email</label>
        <t-input
          id="email"
          :class="{ 'border-danger': form.hasErrors('email') }"
          v-model="form.email"
          placeholder="Email"
        />
        <has-error
          :form="form"
          field="email"/>
      </t-input-group>

      <t-input-group>
        <label
          class="block text-gray-700 mb-2"
          for="password">Password</label>
        <t-input
          id="password"
          :class="{ 'border-danger': form.hasErrors('password') }"
          v-model="form.password"
          type="password"
          placeholder="Password"
        />
        <has-error
          :form="form"
          field="password"/>
        <a
          :href="`${baseUrl}/forgot-password`"
          class="inline-block mt-2 text-primary">
          Forgot password?
        </a>
      </t-input-group>

      <t-input-group>
        <t-button
          :class="{ 'button-loading': form.busy }"
          class="block w-full"
          type="submit"
          variant="primary">
          Login
        </t-button>
      </t-input-group>

      <div class="text-center">
        Don't have an account? <nuxt-link
          :to="{ name: 'auth.register' }"
          class="text-primary">Register</nuxt-link>
      </div>

    </form>
  </div>
</template>

<script>
import Form from '@/plugins/adonis-form'

export default {
  middleware: 'guest',

  layout: 'auth',

  data () {
    return {
      baseUrl: process.env.baseUrl,
      form: new Form({
        email: null,
        password: null
      })
    }
  },

  methods: {
    async login() {
      this.form.busy = true

      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
