<template>
  <button
    :class="{ [`${baseClass}`]: true }"
    @click="toggleFollow()">
    {{ loggedInUserIsFollower ? 'Following' : 'Follow' }}
  </button>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    username: { type: String, required: true },
    loggedInUserIsFollower: { type: Boolean, default: false, required: false },
    baseClass: { type: String, default: 'text-primary', required: false}
  },

  data: function () {
    return {
      busy: false
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ]),
  },

  methods: {
    async toggleFollow () {
      if(!this.isAuthenticated) {
        this.$bus.$emit('showLoginModal')
        return
      }

      if(this.busy) {
        return
      }

      if (!this.loggedInUserIsFollower) {
        await this.follow()
      } else {
        await this.unfollow()
      }
    },

    async follow () {
      this.busy = true

      await this.$axios.post(`/users/${this.username}/follow`)
      this.$emit('followed', { username: this.username })

      this.busy = false
    },

    async unfollow () {
      this.busy = true

      await this.$axios.post(`/users/${this.username}/unfollow`)
      this.$emit('unfollowed', { username: this.username })

      this.busy = false
    }
  }
}
</script>
