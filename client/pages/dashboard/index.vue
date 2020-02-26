<template>
  <div>
    <div class="container lg:flex mx-auto my-6 md:my-8">
      <div class="w-full lg:w-2/6 mb-4">
        <div class="md:bg-white md:p-4 md:shadow-lg md:mx-2 mx-4">
          <div class="text-center mb-4">
            <avatar :user="loggedInUser" size="40" class="mx-auto mb-4"/>
            <div class="text-lg">
              {{ loggedInUser.username }}
            </div>
            <span class="text-gray-600 text-sm">
              {{ stats.counters.receivedSkillPoints }} total Skill Points (SP)
            </span>
          </div>
          <div class="text-center">
            <div class="text-primary text-xl mb-4">Skills</div>
            <template v-if="stats.counters.receivedSkillPoints > 0">
              <skill-points-distribution-chart :data="stats.userSkillPoints"/>
            </template>
            <template v-else>
              <div class="placeholder">
                You haven't received any Skill Points yet...
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-4/6 mb-4">
        <div class="md:mx-2 mx-4">
          <div class="text-primary text-center text-xl mb-4">My Snaps</div>
          <template v-if="!loadingSnaps && snaps.length === 0">
            <div class="placeholder">
              <div class="text-center">
                <p>You don't have any active snaps...</p>
                <router-link :to="{ name: 'challenges.index' }" class="button button-primary button-default-size mt-4">
                  Try completing a challenge
                </router-link>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-wrap -mx-2 -mb-4">
              <div v-for="snap in snaps" class="w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
                <snap-item :snap="snap"/>
              </div>
            </div>
            <div v-if="snapsPage < snapsLastPage" class="text-center mt-2">
              <t-button
                :class="{ 'button-loading': loadingSnaps }"
                type="button"
                variant="primary"
                class="mt-2"
                @click="loadMoreSnaps()"
              >
                Load more
              </t-button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <snap-details-modal @deleted="onSnapDeleted"/>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import SkillPointsDistributionChart from '@/pages/dashboard/components/SkillPointsDistributionChart.js'
import SnapItem from '@/components/SnapItem.vue'
import SnapDetailsModal from '@/components/modals/SnapDetailsModal.vue'

export default {
  middleware: 'auth',

  components: {
    Avatar,
    SkillPointsDistributionChart,
    SnapItem,
    SnapDetailsModal
  },

  data: function () {
    return {
      stats: null,
      snaps: [],
      loadingSnaps: false,
      snapsPage: 0,
      snapsLastPage: 2
    }
  },

  computed: {
    ...mapGetters([ 'loggedInUser' ])
  },

  async asyncData ({ $axios, params, error }) {
    try {
      const statsResponse = await $axios.get(`/user/stats`)

      return {
        stats: statsResponse.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status })
    }
  },

  mounted () {
    this.loadMoreSnaps()
  },

  methods: {
    async loadMoreSnaps () {
      if(this.snapsPage > this.snapsLastPage) {
        return
      }

      this.snapsPage++

      this.loadingSnaps = true

      const response = await this.$axios.get(`/user/snaps?page=${this.snapsPage}`)

      this.snaps = this.snaps.concat(response.data.data)
      this.snapsLastPage = response.data.lastPage

      this.loadingSnaps = false
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
    }
  }
}
</script>
