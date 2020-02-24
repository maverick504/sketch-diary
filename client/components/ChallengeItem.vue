<template>
  <router-link
    :to="{ name: 'challenges.show', params: { id: challenge.id } }"
    :class="{ 'opacity-50': challenge.completion_status && challenge.completion_status !== 'snap-required' }"
    class="block md:h-full px-4 py-2 md:p-8 bg-white border-b md:border-0 md:shadow-lg"
  >
    <div class="mb-2">
      <h2 class="inline font-semibold text-gray-900 text-lg" style="vertical-align: middle;">
        {{ challenge.title }}
      </h2>
    </div>
    <div class="text-gray-600">
      <span class="text-gray-600 mr-2"><bar-chart-icon size="1x" class="inline mr-1"/>{{ challenge.difficulty_level }} level</span><!--
   --><span class="text-gray-600"><clock-icon size="1x" class="inline mr-1"/>{{ challenge.estimated_time }} min.</span>
    </div>
  </router-link>
</template>

<script>
import { BarChartIcon, ClockIcon } from 'vue-feather-icons'

export default {
  components: {
    BarChartIcon,
    ClockIcon
  },

  props: {
    challenge: {
      type: Object,
      required: true
    }
  }
}
</script>
