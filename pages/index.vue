<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        <b>Notice:</b> This site is based on <a href="https://fts.unocha.org/">UNOCHA FTS data</a>.
      </div>
      <template>
        <h3>Summary</h3>
        <ContributionsSummaryPane
          :planID="planID"
          :emergencyID="emergencyID"
          :contributions-summary="contributionsSummary"
          :urls="urls" />
        <b-table :items="contributions" :fields="fields"
          sort-by="date"
          :sort-desc="true"
          :busy="busy">
          <template v-slot:table-busy>
            <div class="text-center text-secondary">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(sourceObjects)="data">
            {{ data.item.source }}
          </template>
          <template v-slot:cell(destinationObjects)="data">
            <template v-if="data.item.destination in organisations">
              <nuxt-link
              :to="{name:'activities', query: { organisation: organisations[data.item.destination] }}"
              :title="`View activities reported by ${data.item.destination}`"
              v-b-tooltip.hover>
              {{ data.item.destination }}
              </nuxt-link>
            </template>
            <template v-else>
              {{ data.item.destination }}
            </template>
          </template>
          <template v-slot:cell(date)="data">
            {{ data.item.date.substr(0, 10) }}
          </template>
          <template v-slot:cell(details)="data">
            <small>
              <a
                :href="`https://fts.unocha.org/flows/${data.item.id}?destination=emergencies/${emergencyID}/flows/2020`"
                target="_blank">
                FTS
              </a>
            </small>
          </template>
        </b-table>
      </template>
    </div>
  </div>
</template>
<style>
</style>
<script>
import SummaryTable from '~/components/SummaryTable.vue'
import ActivityTable from '~/components/ActivityTable.vue'
import ContributionsSummaryPane from '~/components/ContributionsSummaryPane.vue'
import config from '../nuxt.config'
export default {
  components: {
    ActivityTable,
    SummaryTable,
    ContributionsSummaryPane
  },
  data() {
    return {
      title: config.head.title,
      description: config.description,
      contributions: [],
      organisations: {
        'United Nations Development Programme': 'XM-DAC-41114'
      },
      planID: 952,
      emergencyID: 911,
      busy: true,
      CORS_ANYWHERE: this.$store.state.CORSAnywhere
    }
  },
  computed: {
    urls() {
      if (this.$store.state.useCache) {
        return {
          EMERGENCY_URL: `https://test.brough.io/covid19/cache/data/fts-emergency-${this.emergencyID}.json`,
          PLAN_URL: `https://test.brough.io/covid19/cache/data/fts-plan-${this.planID}.json`,
          FLOW_URL: `https://test.brough.io/covid19/cache/data/fts-flow-plan-${this.planID}.json`
        }
      } else {
        return {
          EMERGENCY_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/fts/flow?emergencyId=${this.emergencyID}`,
          PLAN_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/plan/id/${this.planID}`,
          FLOW_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/fts/flow?planId=${this.planID}`
        }
      }
    },
    fields() {
      return [
      { key: "sourceObjects", "label": "Funder", sortable: true },
      { key: "destinationObjects", "label": "Implementer", sortable: true },
      { key: "status", "label": "Status", sortable: true },
      { key: "date", "label": "Date", sortable: true },
      { key: "amountUSD", "label": "Amount (USD)", sortable: true },
      { key: "details", "label": "Details" }
      ]
    },
    contributionsSummary() {
      return Object.values(this.contributions.map(item => {
        return {
          organisation: item.source,
          value: item.amountUSD
        }
      }).reduce((summary, item)=> {
        if (!(item.organisation in summary)) {
          summary[item.organisation] = {value: 0.0, organisation: item.organisation}
        }
        summary[item.organisation].value += item.value
        return summary
      }, {}))
      .sort((a,b) => a.value > b.value ? 1 : -1
      ).reverse().slice(0,10)
    },
    useCache() {
      return this.$store.state.useCache
    }
  },
  methods: {
    getOrganisationName(organisation) {
      return organisation.filter(item => {
        return item.type=="Organization"
      }).map(item=>{
        return item.name
      }).join()
    },
    async loadData() {
      await this.$axios.$get(`${this.urls.EMERGENCY_URL}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      }).then(response => {
        this.contributions = this.processContributions(response.data.flows)
        this.$nuxt.$loading.finish()
      })
      this.busy=false
    },
    processContributions(contributions) {
      return contributions.map(contribution => {
        contribution.source = this.getOrganisationName(contribution.sourceObjects)
        contribution.destination = this.getOrganisationName(contribution.destinationObjects)
        return contribution
      })
    },
    applyFilters() {
      if ((this.selectedCountry == null) && (this.selectedReportingOrg == null)) {
        this.activities = this.originalActivityData
      } else {
        this.activities = this.originalActivityData.filter(activity => {
          if (this.selectedReportingOrg && this.selectedCountry) {
            return (activity["reporting-org"]._attributes.ref == this.selectedReportingOrg) &&
            (activity["recipient-country"] ? activity["recipient-country"]._attributes.code == this.selectedCountry : false)
          } else if (this.selectedReportingOrg) {
            return activity["reporting-org"]._attributes.ref == this.selectedReportingOrg
          } else if (this.selectedCountry) {
            return activity["recipient-country"] ? activity["recipient-country"]._attributes.code == this.selectedCountry : false
          }
        })
      }
    }
  },
  watch: {
    useCache() {
      this.loadData()
    },
    selectedCountry() {
      this.applyFilters()
    },
    selectedReportingOrg() {
      this.applyFilters()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.loadData()
    })
  }
}
</script>

<style>
</style>
