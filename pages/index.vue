<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        This is a prototype visualisation to track the COVID-19 response. Read more on the <nuxt-link :to="{name: 'index'}">about page</nuxt-link>.
      </div>
      <h2>Contributions</h2>
      <hr />

      <HRPSummaryPane :urls="urls" />

      <template v-if="busy">
        <div class="text-center text-secondary mb-4">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-else>
        <ContributionsSummaryPaneControls
          :display-summary.sync="displaySummary"
          :summary-label-field.sync="summaryLabelField"
          :funding-organisation.sync="fundingOrganisation"
          :funding-organisations="fundingOrganisations"
          :implementing-organisation.sync="implementingOrganisation"
          :implementing-organisations="implementingOrganisations" />
        <hr />
        <ContributionsSummaryPane
          :display-summary="displaySummary"
          :summary-label-field="summaryLabelField"
          :contributions="contributions" />
          <hr />
        <h3>{{ contributions.length }} Contributions</h3>
        <b-table :items="contributions" :fields="fields"
          sort-by="date"
          :sort-desc="true"
          responsive>
          <template v-slot:cell(source)="data">
            {{ data.item.source }}
          </template>
          <template v-slot:cell(destination)="data">
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
import ActivityTable from '~/components/ActivityTable.vue'
import ContributionsSummaryPane from '~/components/SummaryPanes/Contributions.vue'
import HRPSummaryPane from '~/components/SummaryPanes/HRP.vue'
import ContributionsSummaryPaneControls from '~/components/SummaryPanes/Controls/Contributions.vue'
import config from '../nuxt.config'
export default {
  components: {
    ActivityTable,
    ContributionsSummaryPane,
    ContributionsSummaryPaneControls,
    HRPSummaryPane
  },
  data() {
    return {
      title: config.head.title,
      description: config.description,
      organisations: {
        'United Nations Development Programme': 'XM-DAC-41114',
        'United Nations High Commissioner for Refugees': 'XM-DAC-41121'
      },
      planID: 952,
      emergencyID: 911,
      CORS_ANYWHERE: this.$store.state.CORSAnywhere,
      displaySummary: 'chart',
      summaryLabelField: "fundingOrganisation",
      fundingOrganisation: null,
      implementingOrganisation: null
    }
  },
  computed: {
    busy() {
      return this.$store.state.contributions.length == 0
    },
    fundingOrganisations() {
      var seenOrganisations = []
      return [{value: null, text: "All funders"}].concat(
        this.originalContributions.reduce((summary, contribution) => {
        if (!seenOrganisations.includes(contribution.source)) {
          summary.push({value: contribution.source, text: contribution.source })
          seenOrganisations.push(contribution.source)
        }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    implementingOrganisations() {
      var seenOrganisations = []
      return [{value: null, text: "All implementers"}].concat(
        this.originalContributions.reduce((summary, contribution) => {
        if (!seenOrganisations.includes(contribution.destination)) {
          summary.push({value: contribution.destination, text: contribution.destination })
          seenOrganisations.push(contribution.destination)
        }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    urls() {
      if (this.$store.state.useCache) {
        return {
          EMERGENCY_URL: `https://test.brough.io/covid19/cache/data/fts-emergency-${this.emergencyID}.json`,
          PLAN_URL: `https://test.brough.io/covid19/cache/data/fts-plan-${this.planID}.json`,
          FLOW_URL: `https://test.brough.io/covid19/cache/data/fts-flow-plan-${this.planID}.json`
        }
      } else {
        return {
          EMERGENCY_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/fts/flow?emergencyId=${this.emergencyID}&limit=1000`,
          PLAN_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/plan/id/${this.planID}`,
          FLOW_URL: `${this.CORS_ANYWHERE}https://api.hpc.tools/v1/public/fts/flow?planId=${this.planID}&limit=1000`
        }
      }
    },
    fields() {
      return [
      { key: "id", "label": "ID", sortable: true },
      { key: "source", "label": "Funder", sortable: true },
      { key: "destination", "label": "Implementer", sortable: true },
      { key: "status", "label": "Status", sortable: true },
      { key: "date", "label": "Date", sortable: true },
      { key: "amountUSD", "label": "Amount (USD)", sortable: true, formatter: "numberFormatter"
      },
      { key: "details", "label": "Details" }
      ]
    },
    originalContributions() {
      return this.$store.state.contributions
    },
    contributions() {
      if (this.originalContributions == []) { [] }
      if ((this.fundingOrganisation == null) && (this.implementingOrganisation == null)) {
        return this.originalContributions
      } else {
        return this.originalContributions.filter(contribution => {
          if ((this.fundingOrganisation != null) && (this.implementingOrganisation != null)) {
            return (contribution.source == this.fundingOrganisation) &&
            (contribution.destination == this.implementingOrganisation)
          } else if (this.fundingOrganisation != null) {
            return contribution.source == this.fundingOrganisation
          } else if (this.implementingOrganisation != null) {
            return contribution.destination == this.implementingOrganisation
          }
        })
      }
    },
    useCache() {
      return this.$store.state.useCache
    }
  },
  methods: {
    numberFormatter(value) {
      return value ? value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }) : ""
    },
    getOrganisationName(organisation) {
      var organisations = organisation.filter(item => {
        return item.type=="Organization"
      }).map(item=>{
        return item.name
      })
      return organisations ? organisations.join() : ""
    },
    async loadData() {
      await this.$axios.$get(`${this.urls.EMERGENCY_URL}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      }).then(response => {
        this.$store.commit('setContributions', this.processContributions(response.data.flows))
      })
    },
    processContributions(contributions) {
      return contributions.filter(contribution=> {
          return ((contribution.boundary == "incoming") && (contribution.onBoundary == "single"))
        }).map(contribution => {
        contribution.source = this.getOrganisationName(contribution.sourceObjects)
        contribution.destination = this.getOrganisationName(contribution.destinationObjects)
        return contribution
      })
    }
  },
  watch: {
    useCache() {
      this.loadData()
    },
    fundingOrganisation(value) {
      if (value) {
        this.summaryLabelField = 'implementingOrganisation'
      } else {
        this.summaryLabelField = 'fundingOrganisation'
      }
    },
    implementingOrganisation(value) {
      if (value) {
        this.summaryLabelField = 'fundingOrganisation'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.contributions.length) { return }
      this.loadData()
    })
  }
}
</script>

<style>
</style>
