<template>
  <div :class="{ 'bg-white text-gray-900': dark !== true, 'bg-gray-900 text-white border-black': dark === true }" class="fixed bottom-0 flex flex-row items-center md:hidden w-full px-4 border-t">
    <router-link :to="{ name: 'snaps.index' }" exact-active-class="text-primary" class="w-1/3 p-4 text-center">
      <compass-icon size="1.75x" class="inline-block"/>
    </router-link>
    <router-link :to="{ name: 'challenges.index' }" exact-active-class="text-primary" class="w-1/3 p-4 text-center">
      <pen-tool-icon size="1.75x" class="inline-block"/>
    </router-link>
    <router-link :to="{ name: 'dashboard.index' }" exact-active-class="text-primary" class="w-1/3 p-4 text-center">
      <bar-chart-2-icon size="1.75x" class="inline-block"/>
    </router-link>
  </div>
</template>

<script>
import { CompassIcon, PenToolIcon, BarChart2Icon } from 'vue-feather-icons'

export default {
  components: {
    CompassIcon,
    PenToolIcon,
    BarChart2Icon
  },

  props: {
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
