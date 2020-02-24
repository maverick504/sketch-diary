<template>
  <t-modal
    v-model="show"
    :hideCloseButton="true"
    header="Log in"
    width="340"
    ref="modal"
  >

    <form method="post" @submit.prevent="login">

      <error-alert :form="form"/>

      <t-input-group>
        <label class="block text-gray-700 mb-2" for="login-modal-email">Email</label>
        <t-input
          id="login-modal-email"
          :class="{ 'border-danger': form.hasErrors('email') }"
          v-model="form.email"
          placeholder="Email"
        />
        <has-error :form="form" field="email"/>
      </t-input-group>

      <t-input-group>
        <label class="block text-gray-700 mb-2" for="login-modal-password">Password</label>
        <t-input
          id="login-modal-password"
          :class="{ 'border-danger': form.hasErrors('password') }"
          v-model="form.password"
          type="password"
          placeholder="Password"
        />
        <has-error :form="form" field="password"/>
      </t-input-group>

    </form>

    <template slot="footer">
      <t-button
        :class="{ 'button-loading': form.busy }"
        class="block w-full mb-3"
        type="button"
        variant="primary"
        size="lg"
        @click="login()"
      >
        Login
      </t-button>
      <div class="text-center">
        Don't have an account? <nuxt-link :to="{ name: 'auth.register' }" class="text-primary">Register</nuxt-link>
      </div>
    </template>

  </t-modal>
</template>

<script>
import Form from '@/plugins/adonis-form'

export default {
  data () {
    return {
      show: false,
      form: new Form({
        email: null,
        password: null
      })
    }
  },

  mounted () {
    this.$bus.$on('openLoginModal', () => {
      this.form.clearErrors()
      this.show = true
    })
  },

  beforeDestroy () {
    this.$bus.$off('openLoginModal')
  },

  methods: {
    async login() {
      this.form.busy = true

      try {
        await this.$auth.loginWith('local', {
          data: this.form
        })
      } catch (e) {
        this.form.handleErrorResponse(e.response)
      }

      this.form.busy = false
    },

    beforeClose () {
      if(!this.form.busy) return

      const scrollTopBefore = this.$refs.modal.$el.scrollTop

      this.$nextTick(() => {
        this.show = true

        this.$nextTick(() => {
          this.$refs.modal.$el.scrollTo(0, scrollTopBefore)
        })
      })
    }
  }
}
</script>
