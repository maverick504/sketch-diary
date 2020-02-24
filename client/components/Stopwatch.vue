<template>
  <div class="text-2xl">{{ minutes }}:{{ seconds }}</div>
</template>

<script>
export default {
  name: 'Stopwatch',

  props: {
    status: String // Possible statuses are: stopped, active and paused.
  },

  data: function () {
    return {
      interval: null,
      secondsEllapsed: 0
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
    document.title = 'SketchDiary'
  },

  computed: {
    minutes: function() {
      var min = Math.floor((this.secondsEllapsed / 60) % 60)
      return min >= 10 ? min : '0' + min
    },

    seconds: function() {
      var sec = this.secondsEllapsed % 60
      return sec >= 10 ? sec : '0' + sec
    }
  },

  watch: {
    status (newStatus, previousStatus) {
      if (newStatus == 'active' && previousStatus !== 'active') {
        if(previousStatus == 'stopped') {
          this.secondsEllapsed = 0
        }
        this.start()
      } else if (newStatus !== 'active' && previousStatus == 'active') {
        this.stop()
      }
    }
  },

  methods: {
    start () {
      this.interval = setInterval(this.handleTick, 1000)
    },

    stop () {
      clearInterval(this.interval)
      document.title = 'SketchDiary'
    },

    handleTick: function() {
      if (this.status == 'active') {
        this.secondsEllapsed += 1
        document.title = `${this.minutes}:${this.seconds} | SketchDiary`
      }
    }
  }
}
</script>
