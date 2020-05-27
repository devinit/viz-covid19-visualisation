<template>
  <div>
    <template v-if="chartData.links.length>0">
      <div class='chart'>
        <chart-sankey :data='chartData' :config='chartConfig'></chart-sankey>
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
    overflow-y: scroll;
  }
</style>

<script>
  import { ChartSankey } from 'vue-d2b'

  export default {
    props: ['items'],
    data () {
      return {
        maximumVisibleItems: 10,
        chartConfig (config) {
          config
            .sankey()
            .sankey()
            .nodePadding(5)

          config
            .sankey()
            .nodeDraggableY(true)
        }
      }
    },

    components: {
      ChartSankey
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
        let items = this.items.sort((a,b) =>
          a.value_USD > b.value_USD ? -1 : 1
        ).slice(0, this.maximumVisibleItems)
        let nodes = items.reduce((summary, item) => {
          var provider, receiver
          if (['3', '4'].includes(item.transaction_type_code)) {
            var provider = trimName(item.provider_text) || trimName(item.reporting_org_text)
          } else {
            var provider = trimName(item.provider_text) || "UNKNOWN"
          }
          var receiver = trimName(item.receiver_text)
          if (!summary.includes(`${provider} »`)) {
            summary.push(`${provider} »`)
          }
          if (!summary.includes(`» ${receiver}`)) {
            summary.push(`» ${receiver}`)
          }
          return summary
        }, []).map(item => {
          return {name: item}
        })
        let links = items.map(item => {
          let provider = trimName(item.provider_text) || trimName(item.reporting_org_text)
          let receiver = trimName(item.receiver_text)
          return {
            source: `${provider} »`,
            target: `» ${receiver}`,
            value: Math.round(item.value_USD)
          }
        })
        let out = {
          nodes: nodes,
          links: links
        }
        console.log("out", out)
        return out
      }
    }
  }
</script>