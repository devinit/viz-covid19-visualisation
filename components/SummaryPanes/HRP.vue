<template>
  <div>
    <template v-if="HRPBusy">
      <div class="text-center text-secondary mb-4">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-else>
      <p class="text-muted">Funding against Humanitarian Response Plan <b>Coronavirus disease Outbreak - Covid-19</b></p>
      <b-progress show-progress :max="planRequirements" class="mb-2" height="2rem">
        <b-progress-bar variant="primary"
          :value="planFunded"
          :label="`${((planFunded / planRequirements) * 100).toFixed(1)}% funded`"
          striped></b-progress-bar>
      </b-progress>
      <p>USD {{ formatNumber(planFunded) }} out of USD {{ formatNumber(planRequirements) }} currently funded</p>
      <hr />
    </template>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  components: {
  },
  props: ['urls'],
  data() {
    return {
    }
  },
  computed: {
    HRPBusy() {
      return this.$store.state.planRequirements == 0
    },
    planRequirements() {
      return this.$store.state.planRequirements
    },
    planFunded() {
      return this.$store.state.planFunded
    },
    planUnfunded() {
      return this.planRequirements-this.planFunded
    },
    useCache() {
      return this.$store.state.useCache
    }
  },
  methods: {
    async loadRequirements() {
      return axios.get(`${this.urls.PLAN_URL}`).then(response => {
        this.$store.commit('setPlanRequirements', response.data.data.revisedRequirements)
        this.$store.commit('setPlanFunded', response.data.data.fundedRequirements)
      })
    },
    async loadData() {
      await Promise.all([this.loadRequirements()])
    },
    formatNumber(number) {
      if (number > 1000000000) {
        return (number/1000000000.0).toLocaleString(undefined, {maximumFractionDigits:2}) + "bn"
      }
      return Math.round(number/1000000.0) + "m"
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.planRequirements == 0) {
        this.loadData()
      }
    })
  },
  watch: {
    useCache() {
      this.loadData()
    }
  }
}
</script>