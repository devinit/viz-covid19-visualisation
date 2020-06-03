<template>
  <div>
    <template v-if="chartData.links.length>0">
      <div class='chart'>
        <client-only>
          <sankey-chart :chart-data="chartData"></sankey-chart>
        </client-only>
      </div>
    </template>
    <template v-else>
      <b-alert show class="text-muted text-center" variant="warning">
        No expenditure data available for this organisation.
      </b-alert>
    </template>
    <p class="text-muted mb-3 mt-3" v-if="items.length > maximumVisibleItems">
      Showing the top {{ maximumVisibleItems }} entries. View all entries in the table below.
    </p>
  </div>
</template>

<style scoped>
  .chart{
    width: 100%;
    height: 500px;
  }
</style>

<script>
import SankeyChart from '~/components/Charts/sankey-chart.vue'

  export default {
    props: ['items'],
    data () {
      return {
        maximumVisibleItems: 10
      }
    },

    components: {
      SankeyChart
    },
    computed: {
      chartData() {
        const trimName = (value) => {
          if (typeof value === "undefined") { return value }
          const redaction_strings = ['USAID redacted this field in accordance with the Principled Exceptions outlined in the Office of Management and Budget Bulletin 12-01.',
            'USAID redacted this field in accordance with the exceptions outlined in the Foreign Aid Transparency and Accountability Act of 2016.',
            'USAID redacted this field in accordance with the exceptions outlined in the Foreign Aid Transparency and Accountability Act of 2016.']
          if (redaction_strings.includes(value)) { return "Redacted" }
          if (value.length > 50) {
            return value.substr(0, 50) + "..."
          }
          return value
        }
        const getProvider = (item, transaction_type_code) => {
          if (['3', '4'].includes(transaction_type_code)) {
            return `${trimName(item.provider_text) || trimName(item.reporting_org_text) || "UNKNOWN"} »`
          } else if (['1'].includes(transaction_type_code)) {
            return `${trimName(item.provider_text)}`
          }
        }
        const getReceiver = (item, transaction_type_code) => {
          if (['3', '4'].includes(transaction_type_code)) {
            return `» ${trimName(item.receiver_text)}`
          } else if (['1'].includes(transaction_type_code)) {
            return `${trimName(item.receiver_text)} »`
          }
        }
        let items = this.items.sort((a,b) =>
          a.value_USD > b.value_USD ? -1 : 1
        ).slice(0, this.maximumVisibleItems)
        let nodes = items.reduce((summary, item) => {
          var provider, receiver

          var provider = getProvider(item, item.transaction_type_code)
          var receiver = getReceiver(item, item.transaction_type_code)
          if (!summary.includes(provider)) {
            summary.push(provider)
          }
          if (!summary.includes(receiver)) {
            summary.push(receiver)
          }
          return summary
        }, []).map(item => {
          return {name: item}
        })
        let links = items.map(item => {
          let provider = getProvider(item, item.transaction_type_code)
          let receiver = getReceiver(item, item.transaction_type_code)
          return {
            source: provider,
            target: receiver,
            value: Math.round(item.value_USD)
          }
        })
        let out = {
          nodes: nodes,
          links: links
        }
        return out
      }
    }
  }
</script>