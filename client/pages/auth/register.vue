<template>
  <div>
    <h1 class="text-2xl text-center mb-4">Create an account</h1>
    <form
      method="post"
      @submit.prevent="register">

      <error-alert :form="form"/>

      <t-input-group>
        <label
          class="block text-gray-700 mb-2"
          for="username">Username</label>
        <t-input
          id="username"
          :class="{ 'border-danger': form.hasErrors('username') }"
          v-model="form.username"
          placeholder="Username"
        />
        <has-error
          :form="form"
          field="username"/>
      </t-input-group>

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
      </t-input-group>

      <t-input-group>
        <t-button
          :class="{ 'button-loading': form.busy }"
          class="block w-full"
          type="submit"
          variant="primary">
          Register
        </t-button>
      </t-input-group>

      <div class="text-center">
        Already got an account? <nuxt-link
          :to="{ name: 'auth.login' }"
          class="text-primary">Login</nuxt-link>
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
      form: new Form({
        username: '',
        email: '',
        password: '',
      })
    }
  },

  methods: {
    async register() {
      this.form.busy = true

      try {
        await this.$axios.post('register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })

        await this.$auth.loginWith('local', {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })

        this.$router.push('/')
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    }
  }
}
</script>
