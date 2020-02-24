import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  computed: {
    labels () {
      let labels = []

      for(let i in this.data) {
        const skill = this.data[i]

        labels.push(skill.skill_short_name)
      }

      return labels
    },

    datasets () {
      let datasets = [ { data: [], backgroundColor: [] } ]

      for(let i in this.data) {
        const skill = this.data[i]

        datasets[0].data.push(skill.received_skill_points || 0)
        datasets[0].backgroundColor.push(skill.skill_color)
      }

      console.log(datasets)
      return datasets
    }
  },

  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    })
  }
}
