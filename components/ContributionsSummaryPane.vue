<template>
  <div>
    <template v-if="isBusy">
      <div class="text-center text-secondary">
        <b-spinner class="align-middle"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </template>
    <template v-else>
      <p class="text-muted">Funding against Humanitarian Response Plan <b>Coronavirus disease Outbreak - COVID -19</b></p>
      <b-progress show-progress :max="planRequirements" class="mb-3">
        <b-progress-bar variant="primary" :value="planFunded" :label="`${((planFunded / planRequirements) * 100).toFixed(1)}% funded`"></b-progress-bar>
        <b-progress-bar variant="warning" :value="planUnfunded" :label="`${(((planUnfunded) / planRequirements) * 100).toFixed(1)}% unfunded`"></b-progress-bar>
      </b-progress>
      <p>USD {{ formatNumber(planFunded) }} out of USD {{ formatNumber(planRequirements) }} currently funded</p>
      <hr />
      <h3>Contributions</h3>
      <p class="text-muted">Funding against Emergency <b>Coronavirus disease Outbreak - COVID -19</b></p>
      <BarChart
        :barChartData="contributionsSummary"
        labelField="organisation"
        valueLabel="Funding (USDm)"
        valueField="value">
      </BarChart>
    </template>
  </div>
</template>
<script>

import BarChart from '~/components/BarChart.vue'
export default {
  components: {
    BarChart
  },
  props: ['contributionsSummary', 'emergencyID', 'planID', 'urls'],
  data() {
    return {
      planRequirements: 0,
      planFunded: 0,
      isBusy: true
    }
  },
  computed: {
    planUnfunded() {
      return this.planRequirements-this.planFunded
    },
    useCache() {
      return this.$store.state.useCache
    }
  },
  methods: {
    formatNumber(number) {
      if (number > 1000000000) {
        return (number/1000000000.0).toLocaleString(undefined, {maximumFractionDigits:2}) + "bn"
      }
      return Math.round(number/1000000.0) + "m"
    },
    async loadRequirements() {
      return this.$axios.$get(`${this.urls.PLAN_URL}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then(response => {
        this.planRequirements = response.data.revisedRequirements
      })
    },
    async loadFunded() {
      return this.$axios.$get(`${this.urls.FLOW_URL}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then(response => {
        this.planFunded = response.data.incoming.fundingTotal
      })
    },
    async loadData() {
      await Promise.all([this.loadRequirements(), this.loadFunded()])
      this.isBusy = false
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$nuxt.$loading)
      this.$nuxt.$loading.start()
      this.loadData()
    })
  },
  watch: {
    useCache() {
      this.loadData()
    }
  }
}
</script>