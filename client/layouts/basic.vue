<template>
  <div>
    <nuxt/>
    <login-modal v-if="!isAuthenticated" ref="loginModal"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginModal from '@/components/modals/LoginModal.vue'

export default {
  components: {
    LoginModal
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  }
}
</script>
