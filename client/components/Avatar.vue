<template>
  <figure :class="{ [`w-${size}`]: true, [`h-${size}`]: true }" class="bg-gray-200">
    <img :src="imageUrl" :alt="`Avatar of ${user.username}`" class="w-full h-full">
  </figure>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
    size: { type: String, default: '10' }
  },

  computed: {
    imageUrl () {
      if(this.user.avatar) {
        if(parseInt(this.size) >= 16) {
          return this.user.avatar['large'].url
        }

        return this.user.avatar['small'].url
      }

      return '/placeholders/avatar_placeholder.png'
    }
  }
}
</script>
