<template>
  <div>
    <b-alert show variant="warning">
      This is a prototype visualisation to track the Covid-19 response. The data on this page comes from
      <a href="https://iatistandard.org">IATI</a>. Read more on the
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <nuxt-link :to="{name: 'about'}" no-prefetch>about page</nuxt-link>.
    </b-alert>
    <h2>Activities</h2>
    <hr>
    <template v-if="isBusy">
      <div class="text-center text-secondary">
        <b-spinner class="align-middle" />
        <strong>Loading...</strong>
      </div>
    </template>
    <template
      v-if="!isBusy">
      <IATISummaryPaneControls
        :display-summary.sync="displaySummary"
        :summary-label-field.sync="summaryLabelField"
        :selected-country.sync="selectedCountry"
        :countries="countries"
        :selected-reporting-org.sync="selectedReportingOrg"
        :reporting-orgs="reportingOrgs"
        :sectors="sectors"
        :selected-sector.sync="selectedSector"
        :selected-humanitarian-development.sync="selectedHumanitarianDevelopment"
        :summary-type.sync="summaryType"
        :m49-codelists="m49Codelists"
        :activity-used-codelists="activityUsedCodelists"
        :selected-c-o-v-i-d-matches.sync="selectedCOVIDMatches" />
      <IATISummaryPane
        v-if="activities"
        :activity-data="activities"
        :activity-transactions-data="activityTransactions"
        :display-summary="displaySummary"
        :summary-label-field="summaryLabelField"
        :codelists="codelists"
        :get-country-name="getCountryName"
        :get-sector-name="getSectorName"
        :summary-type="summaryType" />
      <b-alert :show="displayDoubleCountingWarning" variant="warning" class="text-muted mb-3 mt-3">
        The above results may include double counting. <a v-b-modal.double-counting-modal href="#">Read more</a>.
      </b-alert>
      <b-modal id="double-counting-modal" title="Double counting" ok-only>
        <p>
          The visualisation may show double counting, if multiple organisations have published data
          about the same flows at multiple points in the chain.
        </p>
        <p>
          For example, DFID could publish a contribution to a project managed by the World Health
          Organisation. The WHO could in turn publish the project they are managing. At the moment,
          the DFID contribution and the WHO's spend on this project would be added together; in reality
          they should not be added together.
        </p>
        <p>
          We are developing methodologies to reduce the scope for this kind of double counting in
          the visualisation.
        </p>
      </b-modal>
      <hr>
      <b-row>
        <b-col sm="7" md="9">
          <h3>{{ activities.length }} Activities</h3>
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
            label="Activities per page"
            label-cols-sm="7"
            label-cols-md="7"
            label-cols-lg="4"
            label-cols-xl="3"
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
        v-if="activities"
        :items="activities"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        sortable
        responsive
      >
        <template #head()="data">
          {{ data.label }} <b-badge
            v-b-tooltip.hover
            variant="secondary"
            pill
            :title="tooltips[data.column]">
            ?
          </b-badge>
        </template>
        <template #cell(title)="data">
          <a
            :href="`http://d-portal.org/q.html?aid=${data.item.iatiIdentifier}`"
            target="_blank">{{ data.item.title }}</a>
        </template>
        <template #cell(reportingOrg)="data">
          {{ data.item.reportingOrg.text }}
        </template>
        <template #cell(implementingOrganisations)="data">
          <span v-for="(org, orgindex) in data.item.participatingOrganisation[4]" :key="`${data.index}-${org.text}-${orgindex}`">
            {{ org.text }}
          </span>
        </template>
        <template #cell(countriesRegions)="data">
          <template v-if="data.item.countriesRegions.length > 10">
            <span>Multiple countries</span>
          </template>
          <template v-else>
            <span v-for="countryRegion in data.item.countriesRegions" :key="`${data.index}-${countryRegion.code}`">
              {{ getCountryName(countryRegion) }}
            </span>
          </template>
        </template>
      </b-table>
      <b-row>
        <b-col sm="5" md="6" class="my-1">
          <b-form-group
            label="Activities per page"
            label-cols-sm="7"
            label-cols-md="7"
            label-cols-lg="4"
            label-cols-xl="3"
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
import csvtojson from 'csvtojson'
import config from '../nuxt.config'
import IATISummaryPane from '~/components/SummaryPanes/IATI.vue'
import IATISummaryPaneControls from '~/components/SummaryPanes/Controls/IATI.vue'
export default {
  components: {
    IATISummaryPaneControls,
    IATISummaryPane
  },
  data () {
    return {
      title: config.head.title,
      displaySummary: 'chart',
      summaryType: 'number_of_projects',
      summaryLabelField: 'organisation',
      summaryLabelFields: [
        { value: 'organisation', text: 'Reporting organisation' },
        { value: 'country', text: 'Country' }
      ],
      transactionType: '2',
      transactionTypes: {
        2: 'Commitments',
        3: 'Disbursements',
        4: 'Expenditure'
      },
      selectedCountry: [],
      selectedReportingOrg: [],
      selectedSector: [],
      selectedHumanitarianDevelopment: ['humanitarian', 'humanitarian / development', 'development', 'unspecified'],
      downloadURLs: [
        {
          format: 'Excel (activities)',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/xlsx/activities.xlsx'
        },
        {
          format: 'Excel (transactions)',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/traceability/transactions.xlsx'
        },
        {
          format: 'Excel (transactions - by country and sector)',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/traceability/transactions_sectors_countries_regions.xlsx'
        },
        {
          format: 'JSON',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/activities.json'
        },
        {
          format: 'XML',
          url: 'https://devinit.github.io/iati-covid19-first-prototype/xml/activities.xml'
        }
      ],
      currentPage: 1,
      perPage: 50,
      selectedCOVIDMatches: ['title', 'description', 'GLIDE', 'HRP', 'tag', 'transaction-description']
    }
  },
  computed: {
    displayDoubleCountingWarning () {
      if ((this.summaryLabelField !== 'organisation') && (this.selectedReportingOrg === null)) { return true }
      return false
    },
    totalRows () {
      return this.activities.length
    },
    isBusy () {
      return this.$store.state.originalActivityData.length === 0
    },
    urls () {
      return {
        DATA_URL: 'https://devinit.github.io/iati-covid19-first-prototype/activities.json',
        ACTIVITY_TRANSACTIONS_DATA_URL: 'https://devinit.github.io/iati-covid19-first-prototype/traceability/transactions_sector_country.json',
        COUNTRIES_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Country.json',
        REGIONS_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Region.json',
        SECTORS_CODELIST_URL: 'https://codelists.codeforiati.org/api/json/en/Sector.json',
        M49_CODELIST_URL: 'https://devinit.github.io/iati-covid19-first-prototype/m49_countries_simplified.json'
      }
    },
    fields () {
      return [
        {
          key: 'title',
          sortable: true
        },
        {
          key: 'reportingOrg',
          label: 'Reported by',
          sortable: true
        },
        {
          key: 'implementingOrganisations',
          label: 'Implemented by',
          sortable: true
        },
        {
          key: 'countriesRegions',
          label: 'Country/Region',
          sortable: true
        },
        {
          key: 'totalAmountUSD',
          label: 'Total Amount (USD)',
          sortable: true,
          formatter: 'numberFormatter'
        },
        {
          key: 'commitmentsCOVID',
          label: 'Covid-19-specific (USD)',
          sortable: true,
          formatter: 'numberFormatter'
        },
        {
          key: 'humanitarianDevelopment',
          label: 'Humanitarian?',
          sortable: true
        }]
    },
    codelists () {
      return this.$store.state.codelists
    },
    tooltips () {
      return this.$store.state.tooltips
    },
    activityUsedCodelists () {
      return this.$store.state.activityUsedCodelists
    },
    m49Codelists () {
      return this.$store.state.m49Codelists
    },
    countries () {
      return this.activityUsedCodelists.countriesRegions.reduce((summary, countryRegion) => {
        summary.push({ value: countryRegion, text: this.getCountryName({ code: countryRegion }) })
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    reportingOrgs () {
      return this.activityUsedCodelists.reportingOrgs.reduce((summary, reportingOrg) => {
        const reportingOrgName = this.activityUsedCodelists.reportingOrgNames[reportingOrg]
        summary.push({ value: reportingOrg, text: reportingOrgName })
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    sectors () {
      return this.activityUsedCodelists.sectors.reduce((summary, sector) => {
        summary.push({ value: sector, text: this.getSectorName({ code: sector }) })
        return summary
      }, []).sort((a, b) =>
        a.text < b.text ? -1 : 1
      )
    },
    originalActivityData () {
      return this.$store.state.originalActivityData
    },
    originalActivityTransactionData () {
      return this.$store.state.originalActivityTransactionData
    },
    activityTransactions () {
      const _checkReportingOrg = (activityTransaction) => {
        if (this.selectedReportingOrg.length === 0) { return true }
        return this.selectedReportingOrg.includes(activityTransaction.reporting_org_ref)
      }
      const _checkCountry = (activityTransaction) => {
        if (this.selectedCountry.length === 0) { return true }
        return this.selectedCountry.includes(activityTransaction.country_region)
      }
      const _checkSector = (activityTransaction) => {
        if (this.selectedSector.length === 0) { return true }
        return this.selectedSector.includes(activityTransaction.sector)
      }
      const _checkHumanitarianDevelopment = (activityTransaction) => {
        if (this.selectedHumanitarianDevelopment.length === 4) { return true }
        const _trans = {
          0: 'development',
          1: 'humanitarian',
          false: 'development',
          true: 'humanitarian',
          UNSPECIFIED: 'unspecified'
        }
        return this.selectedHumanitarianDevelopment.includes(_trans[activityTransaction.humanitarian])
      }
      const _checkCOVIDMatches = (activityTransaction) => {
        if (this.selectedCOVIDMatches.length === 6) { return true }
        const overlap = activityTransaction.covid_matches.filter((match) => { return this.selectedCOVIDMatches.includes(match) })
        return overlap.length > 0
      }
      if ((this.selectedCountry.length === 0) &&
        (this.selectedReportingOrg.length === 0) &&
        (this.selectedSector.length === 0) &&
        (this.selectedHumanitarianDevelopment.length === 4) &&
        (this.selectedCOVIDMatches.length === 6)) {
        return this.$store.state.originalActivityTransactionData
      }
      return this.$store.state.originalActivityTransactionData.filter((activityTransaction) => {
        return _checkReportingOrg(activityTransaction) && _checkCountry(activityTransaction) && _checkHumanitarianDevelopment(activityTransaction) && _checkSector(activityTransaction) && _checkCOVIDMatches(activityTransaction)
      })
    },
    activities () {
      const _checkReportingOrg = (activity) => {
        if (this.selectedReportingOrg.length === 0) { return true }
        return this.selectedReportingOrg.includes(activity.reportingOrg.ref)
      }
      const _checkCountry = (activity) => {
        if (this.selectedCountry.length === 0) { return true } else if (this.selectedCountry.includes('')) { if (activity.countriesRegions.length === 0) { return true } }
        const overlap = activity.countriesRegions.filter((cr) => { return this.selectedCountry.includes(cr.code) })
        return overlap.length > 0
      }
      const _checkSector = (activity) => {
        if (this.selectedSector.length === 0) { return true } else if (this.selectedSector.includes('')) { if (activity.sectors.length === 0) { return true } }
        const overlap = activity.sectors.filter((so) => { return this.selectedSector.includes(so.code) })
        return overlap.length > 0
      }
      const _checkHumanitarianDevelopment = (activity) => {
        if (this.selectedHumanitarianDevelopment.length === 4) { return true }
        return this.selectedHumanitarianDevelopment.includes(activity.humanitarianDevelopment)
      }
      const _checkCOVIDMatches = (activity) => {
        if (this.selectedCOVIDMatches.length === 6) { return true }
        const overlap = activity.COVIDMatches.filter((match) => { return this.selectedCOVIDMatches.includes(match) })
        return overlap.length > 0
      }
      if ((this.selectedCountry.length === 0) &&
        (this.selectedReportingOrg.length === 0) &&
        (this.selectedSector.length === 0) &&
        (this.selectedHumanitarianDevelopment.length === 4) &&
        (this.selectedCOVIDMatches.length === 6)) {
        return this.originalActivityData
      } else {
        return this.originalActivityData.filter((activity) => {
          return _checkReportingOrg(activity) && _checkCountry(activity) && _checkHumanitarianDevelopment(activity) && _checkSector(activity) && _checkCOVIDMatches(activity)
        })
      }
    },
    urlQuery () {
      const _query = {}
      if (this.selectedReportingOrg.length > 0) {
        _query.organisation = Object.values(this.selectedReportingOrg).join()
      }
      if (this.selectedCountry.length > 0) {
        _query.country = Object.values(this.selectedCountry).join()
      }
      if (this.selectedSector.length > 0) {
        _query.sector = Object.values(this.selectedSector).join()
      }
      if (this.selectedHumanitarianDevelopment.length !== 4) {
        _query.humanitarian = Object.values(this.selectedHumanitarianDevelopment).join()
      }
      if (this.displaySummary !== 'chart') {
        _query.display = this.displaySummary
      }
      if (this.summaryType !== 'number_of_projects') {
        _query.summary = this.summaryType
      }
      if (this.summaryLabelField !== 'organisation') {
        _query.breakdown = this.summaryLabelField
      }
      if (this.selectedCOVIDMatches.length !== 6) {
        _query.covid_matches = Object.values(this.selectedCOVIDMatches).join()
      }
      return _query
    }
  },
  watch: {
    selectedCountry (value) {
      if (value) {
        this.summaryLabelField = 'organisation'
      }
      this.updateRouter()
    },
    selectedReportingOrg (value) {
      if (value) {
        this.summaryLabelField = 'country'
      }
      this.updateRouter()
    },
    selectedSector (value) {
      this.updateRouter()
    },
    selectedHumanitarianDevelopment (value) {
      this.updateRouter()
    },
    displaySummary (value) {
      this.updateRouter()
    },
    displayType (value) {
      this.updateRouter()
    },
    summaryLabelField (value) {
      this.updateRouter()
    },
    summaryType (value) {
      if ((value !== 'number_of_projects') && (this.originalActivityTransactionData.length === 0)) {
        this.loadActivityTransactionData()
      }
      this.updateRouter()
    },
    selectedCOVIDMatches (value) {
      this.updateRouter()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if ('organisation' in this.$route.query) {
        this.selectedReportingOrg = this.$route.query.organisation.split(',')
      }
      if ('country' in this.$route.query) {
        this.selectedCountry = this.$route.query.country.split(',')
      }
      if ('sector' in this.$route.query) {
        this.selectedSector = this.$route.query.sector.split(',')
      }
      if ('summary' in this.$route.query) {
        this.summaryType = this.$route.query.summary
      }
      if ('breakdown' in this.$route.query) {
        this.summaryLabelField = this.$route.query.breakdown
      }
      if ('display' in this.$route.query) {
        this.displaySummary = this.$route.query.display
      }
      if ('humanitarian' in this.$route.query) {
        this.selectedHumanitarianDevelopment = this.$route.query.humanitarian.split(',')
      }
      if ('covid_matches' in this.$route.query) {
        this.selectedCOVIDMatches = this.$route.query.covid_matches.split(',')
      }
      if (Object.values(this.codelists.countries).length === 0) {
        this.$nuxt.$loading.start()
        this.setup()
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
    getCountryName (recipientCountry) {
      if (recipientCountry.code === '') { return 'Unspecified' }
      const _countryName = this.codelists.countries[recipientCountry.code]
      return _countryName || `Unknown: ${recipientCountry.code}`
    },
    getSectorName (sector) {
      const _sectorName = this.codelists.sectors[sector.code]
      return _sectorName ? `${sector.code}: ${_sectorName}` : `${sector.code}: Unknown`
    },
    async setup () {
      await axios.get(`${this.urls.COUNTRIES_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, {}))
      })
      await axios.get(`${this.urls.REGIONS_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, region) => {
          countries[region.code] = region.name
          return countries
        }, this.$store.state.codelists.countries))
      })
      await axios.get(`${this.urls.SECTORS_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setCodelistsSector', data.data.reduce((sectors, sector) => {
          sectors[sector.code] = sector.name
          return sectors
        }, {}))
      })
      await axios.get(`${this.urls.M49_CODELIST_URL}`).then((response) => {
        const data = response.data
        this.$store.commit('setM49Codelists', data)
      })
      this.loadData()
    },
    processActivityData (data) {
      return data.map((activity) => {
        activity.totalAmountUSD = activity.commitmentsUSD ? activity.commitmentsUSD : activity.budgetsUSD
        activity._cellVariants = { commitmentsCOVID: activity.COVIDComponent ? 'info' : null }
        return activity
      })
    },
    async loadData () {
      const _data = await axios.get(`${this.urls.DATA_URL}`)
      const activities = this.processActivityData(_data.data.activities)
      this.$store.commit('setOriginalActivityData', activities)
      this.$store.commit('setActivityUsedCodelists', _data.data.codelists)
      await axios.get('/tooltips.csv')
        .then((response) => {
          return csvtojson().fromString(response.data).then((jsonData) => {
            this.$store.commit('setTooltips', jsonData)
          })
        })
      this.$nuxt.$loading.finish()
    },
    async loadActivityTransactionData () {
      const data = await axios.get(`${this.urls.ACTIVITY_TRANSACTIONS_DATA_URL}`)
      this.$store.commit('setOriginalActivityTransactionData', data.data)
      this.$nuxt.$loading.finish()
    },
    updateRouter () {
      this.$router.push({ name: 'activities', query: this.urlQuery })
    }
  }
}
</script>
