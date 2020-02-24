<template>
  <div>
    <div class="bg-white text-gray-900">
      <app-navbar :dark="false"/>
      <div class="navbar-spacer"></div>
      <nuxt/>
      <div class="bottom-nav-spacer md:hidden"></div>
      <app-bottom-nav/>
      <div class="footer-spacer hidden md:block"></div>
      <app-footer/>
    </div>
    <login-modal v-if="!isAuthenticated" ref="loginModal"/>
    <feedback-modal v-if="isAuthenticated"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNavbar from '@/components/AppNavbar.vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import FeedbackModal from '@/components/modals/FeedbackModal.vue'

export default {
  components: {
    AppNavbar,
    AppBottomNav,
    AppFooter,
    LoginModal,
    FeedbackModal
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ])
  }
}
</script>
