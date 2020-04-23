<template>
  <div>
    <h3>Summary</h3>
    <p class="text-muted">Funding against  <b>Coronavirus disease Outbreak - COVID -19</b></p>
    <BarChart
      v-if="displaySummary==='chart'"
      :barChartData="contributionsSummary"
      :labelField="summaryLabelField"
      valueLabel="Funding (USDm)"
      valueField="value"
      valuePrecision="2">
    </BarChart>
    <b-table
      v-if="displaySummary==='table'"
      :items="contributionsSummary"
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
  props: ['displaySummary', 'summaryLabelField', 'contributions'],
  data() {
    return {
    }
  },
  computed: {
    contributionsBusy() {
      return this.$store.state.contributions.length == 0
    },
    contributionsSummary() {
      return Object.values(this.contributions.reduce((summary, item)=> {
        if (this.summaryLabelField == "fundingOrganisation") {
          var target = summary[item.source] ?
            summary[item.source] :
            summary[item.source] = {
             'fundingOrganisation': item.source
            }
        } else if (this.summaryLabelField == "implementingOrganisation") {
          var target = summary[item.destination] ?
            summary[item.destination] :
            summary[item.destination] = {
             'implementingOrganisation': item.destination
            }
        }
        target.value ? target.value += (item.amountUSD/1000000.0) : target.value = (item.amountUSD/1000000.0)

        return summary
      }, {}))
      .sort((a,b) => a.value > b.value ? 1 : -1
      ).reverse()
    },
    summaryFields() {
      const out = [
        {
          key: this.summaryLabelField,
          sortable: true
        },
        {
          key: 'value',
          label: 'Value (USDm)',
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
      return value ? value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }) : 0
    }
  }
}
</script>