<template>
  <div class="bg-gray-900 text-white">
    <app-navbar :dark="true" class="hidden md:block"/>
    <div class="navbar-spacer hidden md:block"></div>
    <div class="flex flex-row">
      <div id="snaps-list-wrapper" class="hidden lg:block flex-none bg-gray-800 overflow-y-auto dark-scrollbar z-30" style="width: 320px; min-height: calc(100vh - 56px); max-height: calc(100vh - 56px);">
        <div class="px-2 py-3 text-xl">
          Snaps
        </div>
        <div
          v-for="(snap, index) in snaps" :key="snap.id"
          :class="{ [ snap.id === selectedSnap.id ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700' ]: true, 'opacity-75': snap.logged_in_user_gived_feedback }"
          class="flex flex-row items-center w-full"
          @click="selectedSnapIndex = index"
        >
          <div class="flex-none pl-2 pr-1 py-4">
            <avatar :user="snap.user" size="12"/>
          </div>
          <div class="flex-grow px-1 py-2 truncate">
            <div class="flex flex-row text-sm truncate">
              <span class="flex-initial font-bold truncate" :title="snap.user.username">
                {{ snap.user.username }}
              </span>
              <follow-button
                v-if="!isAuthenticated || loggedInUser.id !== snap.user.id"
                :username="snap.user.username"
                :logged-in-user-is-follower.sync="snap.user.logged_in_user_is_follower"
                class="flex-none ml-1"
                @followed="onUserFollowed"
                @unfollowed="onUserUnfollowed"
              />
            </div>
            <div class="text-sm truncate">{{ snap.userChallengePivot.challenge.title }}</div>
          </div>
          <div class="flex-none w-10 text-right pr-2 py-2">
            {{ snap.userChallengePivot.created_at | moment('from', 'now', true) }}
          </div>
        </div>
      </div>
      <div
        class="snap-bg flex-grow flex flex-col justify-center w-screen bg-gray-900 md:px-16"
        :style="{ background: (selectedSnap && selectedSnapImageLoaded) ? `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('${selectedSnap.media[0].variations['540w'].url}')` : '#4a5568' }"
      >
        <template v-if="selectedSnap">
          <router-link :to="{ name: 'dashboard.index' }" class="flex-none flex md:hidden flex-row justify-center bg-red py-3 text-white uppercase z-10">
            Exit
          </router-link>
          <div class="flex-grow text-center overflow-hidden md:mt-4">
            <div v-show="!selectedSnapImageLoaded" class="flex justify-center items-center h-full">
              <div class="text-center text-white">
                <div class="spinner spinner-lg" role="status"></div>
                <span class="block text-lg mt-3">Loading...</span>
              </div>
            </div>
            <div v-show="selectedSnapImageLoaded" class="flex flex-col md:inline-block relative h-full">
              <div class="snap-header flex-none md:absolute md:top-0 flex flex-row w-full text-white text-sm text-left items-center px-2 mb-4 md:mb-0">
                <div class="flex-none px-1 py-2">
                  <avatar :user="selectedSnap.user" size="10"/>
                </div>
                <div class="flex-grow px-1 py-2 truncate">
                  <div class="flex flex-row text-sm truncate">
                    <span class="flex-initial font-bold truncate" :title="selectedSnap.user.username">
                      {{ selectedSnap.user.username }}
                    </span>
                    <follow-button
                      v-if="!isAuthenticated || loggedInUser.id !== selectedSnap.user.id"
                      :username="selectedSnap.user.username"
                      :logged-in-user-is-follower.sync="selectedSnap.user.logged_in_user_is_follower"
                      class="flex-none ml-1"
                      @followed="onUserFollowed"
                      @unfollowed="onUserUnfollowed"
                    />
                  </div>
                  <div class="text-sm truncate">{{ selectedSnap.userChallengePivot.challenge.title }}</div>
                </div>
                <div class="flex-none px-2 py-2">
                  {{ selectedSnap.userChallengePivot.created_at | moment('from', 'now', true) }}
                </div>
              </div>
              <img :src="selectedSnap.media[0].variations['540w'].url" class="flex-grow object-contain object-center inline-block w-auto h-full mx-auto" @load="onSelectedSnapImageLoaded">
            </div>
          </div>
          <div class="flex-none flex flex-row p-4 sm:mx-auto z-10">
            <t-button :disabled="selectedSnapIndex === 0" size="sm" class="flex-none mr-2" @click="previousSnap()">
              <arrow-left-icon size="1.4x"/>
            </t-button>
            <div v-if="isAuthenticated && selectedSnap.user.id === loggedInUser.id" class="flex-grow flex flex-row justify-center">
              <t-button size="sm" class="w-full sm:w-auto uppercase" @click="$bus.$emit('openSnapDetailsModal', { snapId: selectedSnap.id })">
                <info-icon size="1.4x" class="inline"/><span class="align-middle ml-1">Details</span>
              </t-button>
            </div>
            <div v-else class="flex-grow flex flex-row justify-center">
              <t-button :disabled="selectedSnap.logged_in_user_gived_feedback" size="sm" class="w-full sm:w-auto uppercase" @click="onSnapFeedbackButtonClicked">
                <heart-icon size="1.4x" class="inline mr-1"/><span class="align-middle">{{ selectedSnap.logged_in_user_gived_feedback ? 'Thank you!' : 'Give feedback' }}</span>
              </t-button>
            </div>
            <t-button :disabled="selectedSnapIndex >= (snaps.length - 1)" size="sm" class="flex-none ml-2" @click="nextSnap()">
              <arrow-right-icon size="1.4x"/>
            </t-button>
          </div>
        </template>
        <template v-else-if="!loading">
          <div class="text-center z-10">
            <p class="mb-3">There are no snaps to show :(</p>
            <router-link :to="{ name: 'dashboard.index' }" class="button button-danger button-default-size">
              Exit
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <snap-details-modal v-if="isAuthenticated" @deleted="onSnapDeleted"/>
    <snap-feedback-modal @sent="onSnapFeedbackSent"/>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import AppNavbar from '@/components/AppNavbar.vue'
import Avatar from '@/components/Avatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import SnapDetailsModal from '@/components/modals/SnapDetailsModal.vue'
import SnapFeedbackModal from '@/components/modals/SnapFeedbackModal.vue'
import { ArrowLeftIcon, ArrowRightIcon, InfoIcon, XIcon, HeartIcon } from 'vue-feather-icons'

export default {
  layout: 'basic',

  components: {
    AppNavbar,
    Avatar,
    FollowButton,
    SnapDetailsModal,
    SnapFeedbackModal,
    ArrowLeftIcon,
    ArrowRightIcon,
    InfoIcon,
    XIcon,
    HeartIcon
  },

  data: function () {
    return {
      snaps: [],
      loading: false,
      page: 1,
      lastPage: 2,
      selectedSnapIndex: null,
      selectedSnapImageLoaded: false,
      showScoreModal: false
    }
  },

  computed: {
    ...mapGetters([ 'isAuthenticated', 'loggedInUser' ]),

    selectedSnap () {
      return this.snaps[this.selectedSnapIndex]
    }
  },

  mounted () {
    document.getElementById('snaps-list-wrapper').addEventListener('scroll', this.onScroll)
    this.loadMore()
  },

  destroyed () {
    document.getElementById('snaps-list-wrapper').removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll (event) {
      const content = document.getElementById('snaps-list-wrapper')
      const bottomOfWindow = content.scrollTop + content.clientHeight >= content.scrollHeight
      if (bottomOfWindow && (this.loading == false) && (this.page < this.lastPage)) {
        this.page++
        this.loadMore()
      }
    },

    async loadMore () {
      if(this.page > this.lastPage) {
        return
      }

      this.loading = true

      const response = await this.$axios.get(`${this.$route.meta.snapsEndpoint}?page=${this.page}`)

      this.snaps = this.snaps.concat(response.data.data)
      this.lastPage = response.data.lastPage

      if(!this.selectedSnapIndex) {
        if (this.snaps.length > 0) {
          this.selectedSnapIndex = 0
        } else {
          this.selectedSnapIndex = null
        }
      }

      this.loading = false
    },

    onSelectedSnapImageLoaded (event) {
      this.selectedSnapImageLoaded = true
    },

    previousSnap () {
      if(this.selectedSnapIndex > 0) {
        this.selectedSnapIndex--
      }
    },

    nextSnap () {
      if(this.selectedSnapIndex < (this.snaps.length - 1)) {
        this.selectedSnapIndex++
      }
    },

    onUserFollowed (event) {
      const username = event.username

      for(const i in this.snaps) {
        if(this.snaps[i].user.username === username) {
          this.snaps[i].user.logged_in_user_is_follower = true
        }
      }
    },

    onUserUnfollowed (event) {
      const username = event.username

      for(const i in this.snaps) {
        if(this.snaps[i].user.username === username) {
          this.snaps[i].user.logged_in_user_is_follower = false
        }
      }
    },

    onSnapFeedbackButtonClicked (event) {
      if(this.isAuthenticated) {
        this.$bus.$emit('openSnapFeedbackModal', { snapId: this.selectedSnap.id })
      } else {
        this.$bus.$emit('openLoginModal')
      }
    },

    onSnapFeedbackSent (event) {
      const snapId = event.snapId
      let snapIndex

      for(const i in this.snaps) {
        if(this.snaps[i].id === snapId) {
          snapIndex = i
        }
      }

      this.snaps[snapIndex].logged_in_user_gived_feedback = true
    },

    onSnapDeleted (event) {
      const snapId = event.snapId
      let snapIndex

      for(const i in this.snaps) {
        if(this.snaps[i].id === snapId) {
          snapIndex = i
        }
      }

      this.snaps.splice(snapIndex, 1)

      if(this.selectedSnapIndex >= this.snaps.length) {
        this.previousSnap()
      } else {
        this.nextSnap()
      }
    }
  },

  watch: {
    async selectedSnapIndex () {
      this.selectedSnapImageLoaded = false
      await this.$axios.post(`snaps/${this.snaps[this.selectedSnapIndex].id}/views`)
    }
  }
}
</script>
