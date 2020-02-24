<template>
  <div class="w-full h-auto">
    <a href="#" class="inline-block relative w-full h-auto bg-gray-200 shadow-lg" @click.prevent="$bus.$emit('openSnapDetailsModal', { snapId: snap.id })">
      <div v-if="!imageLoaded" class="w-full h-0" style="padding-top: 100%;"></div>
      <img v-show="imageLoaded" :src="snap.media[0].variations['320x320f'].url" class="block w-full h-auto" @load="imageLoaded = true">
    </a>
    <div class="text-sm">
      <span v-if="snap.userChallengePivot.status === 'snap-required'" class="block text-red">Snap required</span>
      <span v-if="snap.userChallengePivot.status === 'receiving-feedback'" class="block text-blue">Receiving feedback</span>
      <span v-if="snap.userChallengePivot.status === 'completed'" class="block text-green">Completed</span>
      <span class="block text-gray-600">{{ snap.created_at | moment('DD/MM/YY') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    snap: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    imageLoaded: false
  })
}
</script>
