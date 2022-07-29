<template>
  <div>
    <b-alert
      show
      variant="warning">
      This is a prototype visualisation to track the Covid-19 response. The data on this page comes from UNOCHA's
      <a href="https://fts.unocha.org/">FTS</a>. Read more on the
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <nuxt-link :to="{name: 'about'}" no-prefetch>about page</nuxt-link>.
    </b-alert>
    <h2>Contributions</h2>
    <hr>

    <!-- FIXME this is temporarily hidden via v-show='false' - consider removing or replacing in future -->
    <HRPSummaryPane v-show="false" :urls="urls" />

    <template v-if="busy">
      <div class="text-center text-secondary mb-4">
        <b-spinner class="align-middle" />
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
      <hr>
      <ContributionsSummaryPane
        :display-summary="displaySummary"
        :summary-label-field="summaryLabelField"
        :contributions="contributions" />
      <hr>
      <b-row>
        <b-col sm="7" md="9">
          <h3>{{ contributions.length }} Contributions</h3>
        </b-col>
        <b-col sm="5" md="3" class="text-sm-right">
          <b-dropdown text="Download" right variant="primary" style="width:100%" class="mb-2">
            <b-dropdown-item
              v-for="downloadURL in downloadURLs"
              :key="downloadURL.format"
              :href="downloadURL.url"
              target="_blank">
              {{ downloadURL.format }}
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Contributions per page"
            label-cols-sm="7"
            label-cols-md="7"
            label-cols-lg="5"
            label-cols-xl="4"
            label-align-sm="right"
            label-size="sm"
            label-for="perPageSelect">
            <b-form-select
              id="perPageSelect"
              v-model="perPage"
              :options="[50,100,500,1000]"
              size="sm"
            />
          </b-form-group>
        </b-col>
        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          />
        </b-col>
      </b-row>
      <b-table
        :items="contributions"
        :fields="fields"
        :sort-desc="true"
        :current-page="currentPage"
        :per-page="perPage"
        sort-by="date"
        responsive>
        <template #cell(source)="data">
          {{ data.item.source }}
        </template>
        <template #cell(destination)="data">
          <template v-if="data.item.destination in organisations">
            <nuxt-link
              v-b-tooltip.hover
              :to="{name:'activities', query: { organisation: organisations[data.item.destination] }}"
              :title="`View activities reported by ${data.item.destination}`">
              {{ data.item.destination }}
            </nuxt-link>
          </template>
          <template v-else>
            {{ data.item.destination }}
          </template>
        </template>
        <template #cell(date)="data">
          {{ data.item.date.substr(0, 10) }}
        </template>
        <template #cell(details)="data">
          <small>
            <a
              :href="`https://fts.unocha.org/flows/${data.item.id}?destination=emergencies/${emergencyID}/flows/2020`"
              target="_blank">
              FTS
            </a>
          </small>
        </template>
      </b-table>
      <b-row>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Contributions per page"
            label-cols-sm="7"
            label-cols-md="7"
            label-cols-lg="5"
            label-cols-xl="4"
            label-align-sm="right"
            label-size="sm"
            label-for="perPageSelect">
            <b-form-select
              id="perPageSelect"
              v-model="perPage"
              :options="[50,100,500,1000]"
              size="sm"
            />
          </b-form-group>
        </b-col>
        <b-col sm="7" md="6" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          />
        </b-col>
      </b-row>
    </template>
  </div>
</template>
<style>
</style>
<script>
import axios from 'axios'
import config from '../nuxt.config'
import ContributionsSummaryPane from '~/components/SummaryPanes/Contributions.vue'
import HRPSummaryPane from '~/components/SummaryPanes/HRP.vue'
import ContributionsSummaryPaneControls from '~/components/SummaryPanes/Controls/Contributions.vue'
export default {
  components: {
    ContributionsSummaryPane,
    ContributionsSummaryPaneControls,
    HRPSummaryPane
  },
  data () {
    return {
      title: config.head.title,
      organisations: {
        'United Nations Development Programme': 'XM-DAC-41114',
        'United Nations High Commissioner for Refugees': 'XM-DAC-41121',
        "United Nations Children's Fund": 'XM-DAC-41122',
        'Danish Refugee Council': 'DK-CVR-20699310',
        'World Health Organization': 'XM-DAC-928',
        'World Food Programme': 'XM-DAC-41140'
      },
      planID: 952,
      emergencyID: 911,
      displaySummary: 'chart',
      summaryLabelField: 'fundingOrganisation',
      fundingOrganisation: null,
      implementingOrganisation: null,
      downloadURLs: [
        {
          format: 'Excel',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/xlsx/contributions.xlsx?raw=true'
        },
        {
          format: 'JSON',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/fts-emergency-911.json'
        }
      ],
      currentPage: 1,
      perPage: 50
    }
  },
  computed: {
    busy () {
      return this.$store.state.contributions.length === 0
    },
    fundingOrganisations () {
      const seenOrganisations = []
      return [{ value: null, text: 'All funders' }].concat(
        this.originalContributions.reduce((summary, contribution) => {
          if (!seenOrganisations.includes(contribution.source)) {
            summary.push({ value: contribution.source, text: contribution.source })
            seenOrganisations.push(contribution.source)
          }
          return summary
        }, []).sort((a, b) =>
          a.text < b.text ? -1 : 1
        ))
    },
    implementingOrganisations () {
      const seenOrganisations = []
      return [{ value: null, text: 'All implementers' }].concat(
        this.originalContributions.reduce((summary, contribution) => {
          if (!seenOrganisations.includes(contribution.destination)) {
            summary.push({ value: contribution.destination, text: contribution.destination })
            seenOrganisations.push(contribution.destination)
          }
          return summary
        }, []).sort((a, b) =>
          a.text < b.text ? -1 : 1
        ))
    },
    urls () {
      return {
        EMERGENCY_URL: `https://devinit.github.io/iati-covid19-first-prototype/fts-emergency-${this.emergencyID}.json`,
        PLAN_URL: `https://devinit.github.io/iati-covid19-first-prototype/fts-plan-${this.planID}.json`,
        FLOW_URL: `https://devinit.github.io/iati-covid19-first-prototype/fts-flow-plan-${this.planID}.json`
      }
    },
    fields () {
      return [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'source', label: 'Funder', sortable: true },
        { key: 'destination', label: 'Implementer', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'amountUSD', label: 'Amount (USD)', sortable: true, formatter: 'numberFormatter' },
        { key: 'details', label: 'Details' }
      ]
    },
    originalContributions () {
      return this.$store.state.contributions
    },
    totalRows () {
      return this.contributions.length
    },
    contributions () {
      if (this.originalContributions === []) { return [] }
      if ((this.fundingOrganisation === null) && (this.implementingOrganisation === null)) {
        return this.originalContributions
      } else {
        return this.originalContributions.filter((contribution) => {
          if ((this.fundingOrganisation !== null) && (this.implementingOrganisation !== null)) {
            return (contribution.source === this.fundingOrganisation) &&
            (contribution.destination === this.implementingOrganisation)
          } else if (this.fundingOrganisation !== null) {
            return contribution.source === this.fundingOrganisation
          } else if (this.implementingOrganisation !== null) {
            return contribution.destination === this.implementingOrganisation
          }
          return true
        })
      }
    },
    urlQuery () {
      const _query = {}
      if (this.displaySummary !== 'chart') {
        _query.display = this.displaySummary
      }
      if (this.summaryLabelField !== 'fundingOrganisation') {
        _query.summary = this.summaryLabelField
      }
      if (this.fundingOrganisation) {
        _query.funder = this.fundingOrganisation
      }
      if (this.implementingOrganisation) {
        _query.implementer = this.implementingOrganisation
      }
      return _query
    }
  },
  watch: {
    fundingOrganisation (value) {
      if (value) {
        this.summaryLabelField = 'implementingOrganisation'
      } else {
        this.summaryLabelField = 'fundingOrganisation'
      }
      this.updateRouter()
    },
    implementingOrganisation (value) {
      if (value) {
        this.summaryLabelField = 'fundingOrganisation'
      }
      this.updateRouter()
    },
    displaySummary (value) {
      this.updateRouter()
    },
    summaryLabelField (value) {
      this.updateRouter()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.contributions.length) { return }
      this.loadData()
      if ('funder' in this.$route.query) {
        this.fundingOrganisation = this.$route.query.funder
      }
      if ('implementer' in this.$route.query) {
        this.implementingOrganisation = this.$route.query.implementer
      }
      if ('display' in this.$route.query) {
        this.displaySummary = this.$route.query.display
      }
      if ('summary' in this.$route.query) {
        this.summaryLabelField = this.$route.query.summary
      }
    })
  },
  methods: {
    numberFormatter (value) {
      return value
        ? value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
        : ''
    },
    getOrganisationName (organisation) {
      const organisations = organisation.filter((item) => {
        return item.type === 'Organization'
      }).map((item) => {
        return item.name
      })
      return organisations ? organisations.join() : ''
    },
    async loadData () {
      this.$nuxt.$loading.start()
      await axios.get(`${this.urls.EMERGENCY_URL}`).then((response) => {
        this.$store.commit('setContributions', this.processContributions(response.data.data.flows))
      })
      this.$nuxt.$loading.finish()
    },
    processContributions (contributions) {
      return contributions.filter((contribution) => {
        return ((contribution.boundary === 'incoming') && (contribution.onBoundary === 'single'))
      }).map((contribution) => {
        contribution.source = this.getOrganisationName(contribution.sourceObjects)
        contribution.destination = this.getOrganisationName(contribution.destinationObjects)
        return contribution
      })
    },
    updateRouter () {
      this.$router.push({ name: 'index', query: this.urlQuery })
    }
  }
}
</script>

<style>
</style>
