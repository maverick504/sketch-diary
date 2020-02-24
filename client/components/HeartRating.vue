<template>
  <div :class="{ [`heart-rating-${highlightedScore}`]: true }" class="heart-rating inline-block text-gray-300" @mouseleave="setHoveredScore(null)">
    <div v-for="i in 5" class="heart-rating-item inline-block px-1 cursor-pointer" @mouseover="setHoveredScore(i)" @click="setScore(i)">
      <heart-icon size="2x" class="filled"/>
    </div>
  </div>
</template>

<script>
import { HeartIcon } from 'vue-feather-icons'

export default {
  components: {
    HeartIcon
  },

  props: {
    score: Number,
  },

  data: function () {
    return {
      hoveredScore: null
    }
  },

  computed: {
    highlightedScore () {
      if(this.hoveredScore || this.score) {
        return this.hoveredScore ? this.hoveredScore : this.score
      } else {
        return 0
      }
    }
  },

  methods: {
    setHoveredScore (value) {
      this.hoveredScore = value
    },

    setScore (newScore) {
      this.$emit('update:score', newScore)
    }
  }
}
</script>

<style media="screen">

.heart-rating.heart-rating-1 .heart-rating-item:nth-child(1) {
  @apply text-red;
}

.heart-rating.heart-rating-1 .heart-rating-item:nth-child(1) {
  @apply text-red;
}

.heart-rating.heart-rating-2 .heart-rating-item:nth-child(1),
.heart-rating.heart-rating-2 .heart-rating-item:nth-child(2) {
  @apply text-red;
}

.heart-rating.heart-rating-3 .heart-rating-item:nth-child(1),
.heart-rating.heart-rating-3 .heart-rating-item:nth-child(2),
.heart-rating.heart-rating-3 .heart-rating-item:nth-child(3) {
  @apply text-red;
}

</style>
