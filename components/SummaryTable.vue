<template>
  <div>
    <LineChart
      v-if="displaySummary==='chart'"
      :lineChartData="summaryData"
      :years="years"
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
import LineChart from '~/components/LineChart.vue'
export default {
  components: {
    LineChart
  },
  data() {
    return {
      years: []
    }
  },
  props: ['activityData', 'displaySummary'],
  computed: {
    summaryData() {
      const _years = new Set([])
      const _data = Object.values(this.activityData.reduce((summary, activity) => {
        return activity.transactionsTable.reduce((summaryT, transaction) => {
          const year = transaction.date.slice(0,4)
          _years.add(year)
          const target = summaryT[transaction.sector] ? summaryT[transaction.sector] : summaryT[transaction.sector] = {}
          const createSummaryEntry = (target, transaction) => {
            target.sector = transaction.sector
            target.total_value = parseFloat(transaction.value)
            target[`value_${year}`] = parseFloat(transaction.value)
            return target
          }
          const updateSummaryEntry = (target, transaction) => {
            target.total_value += parseFloat(transaction.value)
            target[`value_${year}`] ? target[`value_${year}`] += parseFloat(transaction.value) : target[`value_${year}`] = parseFloat(transaction.value)
            return target
          }
          target.total_value ? updateSummaryEntry(target, transaction) : createSummaryEntry(target, transaction)
          return summaryT
        }, summary)
      }, {})
      ).sort((a,b) => a.total_value > b.total_value ? 1 : -1
      ).reverse()
      this.years = Array.from(_years).sort().reverse()
      return _data
    },
    summaryFields() {
      const out = [
        {
          key: 'sector',
          sortable: true
        },
        {
          key: 'total_value',
          sortable: true,
          thClass: "text-right",
          tdClass: "text-right",
          formatter: 'valueFormatter'
        }
      ]
      this.years.forEach((i) =>
        {
          out.push({
          key: `value_${i}`,
          sortable: true,
          thClass: "text-right",
          tdClass: "text-right",
          formatter: 'valueFormatter'
        })
        }
      )

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