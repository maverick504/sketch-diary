<template>
  <div class="hidden md:block fixed bottom-0 w-full bg-gray-900 text-white">
    <div class="container flex flex-row mx-auto">
      <div class="flex-grow px-4 py-2">
        <span class="inline-block text-white mr-4">
          © SketchDiary 2020
        </span><a v-if="isAuthenticated" href="#" class="inline-block text-white hover:text-primary mr-4" @click.prevent="$bus.$emit('openFeedbackModal')">
          Send feedback
        </a><a class="inline-block text-white hover:text-primary mr-4" href="https://ko-fi.com/maverick504" target=”_blank”>
          Ko-fi
        </a>
      </div>
      <div class="flex-none px-4 py-2">
        <a href="https://www.facebook.com/SketchDiary-102282671332295/" target=”_blank” class="inline-block text-white hover:text-primary ml-4">
          <facebook-icon size="1x" class="inline-block"/>
        </a><a href="https://twitter.com/sketchdiary_app" target=”_blank” class="inline-block text-white hover:text-primary ml-4">
          <twitter-icon size="1x" class="inline-block"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FacebookIcon, TwitterIcon } from 'vue-feather-icons'

export default {
  components: {
    FacebookIcon,
    TwitterIcon
  },

  computed: {
    ...mapGetters([ 'isAuthenticated' ]),
  }
}
</script>
