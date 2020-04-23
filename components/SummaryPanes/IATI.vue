<template>
  <div>
    <BarChart
      v-if="displaySummary==='chart'"
      :barChartData="summaryData"
      :labelField="summaryLabelField"
      valueLabel="Number of projects"
      valueField="number_of_projects"
      valuePrecision="0"
      />
    <b-table
      v-if="displaySummary==='table'"
      :items="summaryData"
      :fields="summaryFields"
      asort-by="total_value"
      asort-desc="true"
      small
      head-variant="dark"
      bordered>
    </b-table>
  </div>
</template>
<script>
import BarChart from '~/components/BarChart.vue'
export default {
  components: {
    BarChart
  },
  data() {
    return {
    }
  },
  props: ['activityData', 'displaySummary', 'summaryLabelField', 'codelists', 'getNarrative'],
  computed: {
    summaryData() {
      const _data = Object.values(this.activityData.reduce((summary, activity) => {
        const getOrg = (activity) => {
          if (!activity.reporting_org) { return "Unspecified" }
          return activity.reporting_org
        }
        const getCountry = (activity) => {
          if (!activity.recipient_country) { return "Unspecified" }
          return activity.recipient_country
        }
        if (this.summaryLabelField == "organisation") {
          var target = summary[getOrg(activity)] ?
            summary[getOrg(activity)] :
            summary[getOrg(activity)] = {
              'organisation': getOrg(activity)
            }
        } else if (this.summaryLabelField == "country") {
          var target = summary[getCountry(activity)] ?
            summary[getCountry(activity)] :
            summary[getCountry(activity)] = {
              'country': getCountry(activity)
            }
        }
        target.number_of_projects ? target.number_of_projects += 1 : target.number_of_projects = 1
        return summary
      }, {})
      ).sort((a,b) => a.number_of_projects > b.number_of_projects ? 1 : -1
      ).reverse()
      return _data
    },
    summaryFields() {
      const out = [
        {
          key: this.summaryLabelField,
          sortable: true
        },
        {
          key: 'number_of_projects',
          sortable: true,
          thClass: "text-right",
          tdClass: "text-right",
          formatter: 'valueFormatter'
        }
      ]

      return out
    }
  },
  methods: {
    valueFormatter(value) {
      return value ? Math.round(value) : 0
    }
  }
}
</script>