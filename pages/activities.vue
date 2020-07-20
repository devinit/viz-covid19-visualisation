<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        This is a prototype visualisation to track the Covid-19 response. The data on this page comes from <a href="https://iatistandard.org">IATI</a>. Read more on the <nuxt-link :to="{name: 'about'}">about page</nuxt-link>.
      </div>
      <h2>Activities</h2>
      <hr />
      <template v-if="isBusy">
        <div class="text-center text-secondary">
          <b-spinner class="align-middle"></b-spinner>
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
          :summaryType.sync="summaryType" />
        <IATISummaryPane
          v-if="activities"
          :activityData="activities"
          :activityTransactionsData="activityTransactions"
          :displaySummary="displaySummary"
          :summaryLabelField="summaryLabelField"
          :codelists="codelists"
          :getCountryName="getCountryName"
          :getSectorName="getSectorName"
          :summaryType="summaryType" />
        <b-alert variant="warning" class="text-muted mb-3 mt-3" :show="displayDoubleCountingWarning">
          The above results may include double counting. <a href="#" v-b-modal.double-counting-modal>Read more</a>.
        </b-alert>
        <b-modal id="double-counting-modal" title="Double counting" ok-only>
          <p>The visualisation may show double counting, if multiple organisations have published data
          about the same flows at multiple points in the chain.</p>
          <p>For example, DFID could publish a contribution to a project managed by the World Health
          Organisation. The WHO could in turn publish the project they are managing. At the moment,
          the DFID contribution and the WHO's spend on this project would be added together; in reality
          they should not be added together.</p>
          <p>We are developing methodologies to reduce the scope for this kind of double counting in
          the visualisation.</p>
        </b-modal>
        <hr />
        <b-row>
          <b-col sm="7" md="9">
            <h3>{{ activities.length }} Activities</h3>
          </b-col>
          <b-col sm="5" md="3" class="text-sm-right">
            <b-dropdown text="Download" right variant="primary" style="width:100%" class="mb-2">
              <b-dropdown-item
                v-for="downloadURL in downloadURLs"
                v-bind:key="downloadURL.format"
                :href="downloadURL.url"
                target="_blank">{{ downloadURL.format }}</b-dropdown-item>
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
                v-model="perPage"
                id="perPageSelect"
                size="sm"
                :options="[100,500,1000]"
              ></b-form-select>
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
            ></b-pagination>
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
          <template v-slot:cell(title)="data">
            <a :href="`http://d-portal.org/q.html?aid=${data.item.iatiIdentifier}`"
            target="_blank">{{ data.item.title }}</a>
          </template>
          <template v-slot:cell(reportingOrg)="data">
            {{ data.item.reportingOrg.text }}
          </template>
          <template v-slot:cell(implementingOrganisations)="data">
            <span v-for="(org, orgindex) in (data.item.participatingOrganisation ? data.item.participatingOrganisation[4] : [])" :key="`${data.index}-${org.text}-${orgindex}`">
              {{ org.text }}
            </span>
          </template>
          <template v-slot:cell(countriesRegions)="data">
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
                v-model="perPage"
                id="perPageSelect"
                size="sm"
                :options="[100,500,1000]"
              ></b-form-select>
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
            ></b-pagination>
          </b-col>
        </b-row>
      </template>
    </div>
  </div>
</template>
<style>
</style>
<script>
import axios from 'axios'
import IATISummaryPane from '~/components/SummaryPanes/IATI.vue'
import IATISummaryPaneControls from '~/components/SummaryPanes/Controls/IATI.vue'
import ActivityTable from '~/components/ActivityTable.vue'
import config from '../nuxt.config'
export default {
  components: {
    IATISummaryPaneControls,
    IATISummaryPane,
    ActivityTable
  },
  data() {
    return {
      title: config.head.title,
      description: config.description,
      displaySummary: 'chart',
      summaryType: "number_of_projects",
      summaryLabelField: 'organisation',
      summaryLabelFields: [
        {'value': 'organisation', 'text': 'Reporting organisation'},
        {'value': 'country', 'text': 'Country'}
      ],
      transactionType: "2",
      transactionTypes: {
        "2": "Commitments",
        "3": "Disbursements",
        "4": "Expenditure"
      },
      selectedCountry: null,
      selectedReportingOrg: null,
      selectedSector: null,
      selectedHumanitarianDevelopment: ['humanitarian', 'humanitarian / development', 'development', 'unspecified'],
      downloadURLs: [
        {
          "format": "Excel",
          "url": "https://github.com/markbrough/covid19-data/blob/gh-pages/xlsx/activities.xlsx?raw=true"
        },
        {
          "format": "JSON",
          "url": "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/activities.json"
        },
        {
          "format": "XML",
          "url": "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/xml/activities.xml"
        }
      ],
      currentPage: 1,
      perPage: 100
    }
  },
  computed: {
    displayDoubleCountingWarning() {
      if ((this.summaryLabelField != "organisation") && (this.selectedReportingOrg == null)) { return true }
      return false
    },
    totalRows() {
      return this.activities.length
    },
    isBusy() {
      return this.$store.state.originalActivityData.length == 0
    },
    urls() {
      return  {
        DATA_URL: "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/activities.json",
        ACTIVITY_TRANSACTIONS_DATA_URL: "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/traceability/transactions_sector_country.json",
        COUNTRIES_CODELIST_URL: `https://codelists.codeforiati.org/api/json/en/Country.json`,
        REGIONS_CODELIST_URL: `https://codelists.codeforiati.org/api/json/en/Region.json`,
        SECTORS_CODELIST_URL: `https://codelists.codeforiati.org/api/json/en/Sector.json`
      }
    },
    fields() {
      return [
        {
          "key": "title",
          "sortable": true
        },
        {
          "key": "reportingOrg",
          "label": "Reported by",
          "sortable": true
        },
        {
          "key": "implementingOrganisations",
          "label": "Implemented by",
          "sortable": true
        },
        {
          "key": "countriesRegions",
          "label": "Country/Region",
          "sortable": true
        },
        {
          "key": "totalAmountUSD",
          "label": "Total Amount (USD)",
          "sortable": true,
          formatter: "numberFormatter"
        },
        {
          "key": "commitmentsCOVID",
          "label": "Covid-19-specific (USD)",
          "sortable": true,
          formatter: "numberFormatter"
        },
        {
          "key": "humanitarianDevelopment",
          "label": "Humanitarian?",
          "sortable": true
        }]
    },
    codelists() {
      return this.$store.state.codelists
    },
    countries() {
      var seenCountries = []
      return [{value: null, text: "All countries"}].concat(
        this.originalActivityData.reduce((summary, activity) => {
          if (activity.countriesRegions.length>0) {
            activity.countriesRegions.forEach(countryRegion=> {
              if (!seenCountries.includes(countryRegion.code)) {
                summary.push({value: countryRegion.code, text: this.getCountryName(countryRegion)})
                seenCountries.push(countryRegion.code)
              }
            })
          } else {
            if (!seenCountries.includes('')) {
              seenCountries.push('')
              summary.push({'value': '', 'text': 'Unspecified'})
            }
          }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    reportingOrgs() {
      var seenReportingOrgs = []
      return [{value: null, text: "All reporting organisations"}].concat(
        this.originalActivityData.reduce((summary, activity) => {
        if (!seenReportingOrgs.includes(activity.reportingOrg.ref)) {
          summary.push({value: activity.reportingOrg.ref, text: activity.reportingOrg.text })
          seenReportingOrgs.push(activity.reportingOrg.ref)
        }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    sectors() {
      var seenSectors = []
      return [{value: null, text: "All sectors"}].concat(
        this.originalActivityData.reduce((summary, activity) => {
          if (activity.sectors.length>0) {
            activity.sectors.forEach(sector=> {
              if (!seenSectors.includes(sector.code)) {
                summary.push({value: sector.code, text: this.getSectorName(sector)})
                seenSectors.push(sector.code)
              }
            })
          } else {
            if (!seenSectors.includes(null)) {
              seenSectors.push(null)
              summary.push({'value': '', 'text': 'Unspecified'})
            }
          }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    originalActivityData() {
      return this.$store.state.originalActivityData
    },
    originalActivityTransactionData() {
      return this.$store.state.originalActivityTransactionData
    },
    activityTransactions() {
      const _checkReportingOrg = (activityTransaction) => {
        if (this.selectedReportingOrg == null) { return true }
        return activityTransaction.reporting_org_ref == this.selectedReportingOrg
      }
      const _checkCountry = (activityTransaction) => {
        if (this.selectedCountry == null) { return true }
        return activityTransaction.country_region == this.selectedCountry
      }
      const _checkSector = (activityTransaction) => {
        if (this.selectedSector == null) { return true }
        return activityTransaction.sector == this.selectedSector
      }
      const _checkHumanitarianDevelopment = (activityTransaction) => {
        if (this.selectedHumanitarianDevelopment.length == 4) { return true }
        const _trans = {
          "0": "development",
          "1": "humanitarian",
          "false": "development",
          "true": "humanitarian",
          "UNSPECIFIED": "unspecified"
        }
        return this.selectedHumanitarianDevelopment.includes(_trans[activityTransaction.humanitarian])
      }
      return this.$store.state.originalActivityTransactionData.filter(activityTransaction => {
        return _checkReportingOrg(activityTransaction) && _checkCountry(activityTransaction) && _checkHumanitarianDevelopment(activityTransaction) && _checkSector(activityTransaction)
      })
    },
    activities() {
      console.log("selected sector is", this.selectedSector)
      const _checkReportingOrg = (activity) => {
        if (this.selectedReportingOrg == null) { return true }
        return activity.reportingOrg.ref == this.selectedReportingOrg
      }
      const _checkCountry = (activity) => {
        if (this.selectedCountry == null) { return true }
        else if (this.selectedCountry == "") { return activity.countriesRegions.length == 0 }
        return activity.countriesRegions.map(cr=> { return cr.code}).includes(this.selectedCountry)
      }
      const _checkSector = (activity) => {
        if (this.selectedSector == null) { return true }
        else if (this.selectedSector == "") { return activity.sectors.length == 0 }
        return activity.sectors.map(cr=> { return cr.code}).includes(this.selectedSector)
      }
      const _checkHumanitarianDevelopment = (activity) => {
        if (this.selectedHumanitarianDevelopment.length == 4) { return true }
        return this.selectedHumanitarianDevelopment.includes(activity.humanitarianDevelopment)
      }
      if ((this.selectedCountry == null) &&
        (this.selectedReportingOrg == null) &&
        (this.selectedSector == null) &&
        (this.selectedHumanitarianDevelopment.length == 4)) {
        return this.originalActivityData
      } else {
        return this.originalActivityData.filter(activity => {
          return _checkReportingOrg(activity) && _checkCountry(activity) && _checkHumanitarianDevelopment(activity) && _checkSector(activity)
        })
      }
    }
  },
  methods: {
    numberFormatter(value) {
      return value ? value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      }) : ""
    },
    getCountryName(recipient_country) {
      if (recipient_country.code == '') { return 'Unspecified' }
      return this.codelists.countries[recipient_country.code] ? this.codelists.countries[recipient_country.code] : `Unknown: ${recipient_country.code}`
    },
    getSectorName(sector) {
      return this.codelists.sectors[sector.code] ? `${sector.code}: ${this.codelists.sectors[sector.code]}` : `${sector.code}: Unknown`
    },
    async setup() {
     await axios.get(`${this.urls.COUNTRIES_CODELIST_URL}`).then(response => {
        var data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, {}))
      })
     await axios.get(`${this.urls.REGIONS_CODELIST_URL}`).then(response => {
        var data = response.data
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, region) => {
          countries[region.code] = region.name
          return countries
        }, this.$store.state.codelists.countries))
      })
     await axios.get(`${this.urls.SECTORS_CODELIST_URL}`).then(response => {
        var data = response.data
        this.$store.commit('setCodelistsSector', data.data.reduce((sectors, sector) => {
          sectors[sector.code] = sector.name
          return sectors
        }, {}))
      })
    this.loadData()
    },
    processActivityData(data) {
      return data.map(activity=> {
        activity.totalAmountUSD = activity.commitmentsUSD ? activity.commitmentsUSD : activity.budgetsUSD
        activity._cellVariants = { 'commitmentsCOVID': activity.COVIDComponent ? 'info' : null }
        return activity
      })
    },
    async loadData() {
      let _data = await axios.get(`${this.urls.DATA_URL}`)
      let data = this.processActivityData(_data.data)
      this.$store.commit('setOriginalActivityData', data)
      this.$nuxt.$loading.finish()
    },
    async loadActivityTransactionData() {
      let data = await axios.get(`${this.urls.ACTIVITY_TRANSACTIONS_DATA_URL}`)
      this.$store.commit('setOriginalActivityTransactionData', data.data)
      this.$nuxt.$loading.finish()
    }
  },
  watch: {
    selectedCountry(value) {
      if (value) {
        this.summaryLabelField = 'organisation'
      }
    },
    selectedReportingOrg(value) {
      if (value) {
        this.summaryLabelField = 'country'
      }
    },
    summaryType(value) {
      if ((value != 'number_of_projects') && (this.originalActivityTransactionData.length == 0)) {
        this.loadActivityTransactionData()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if ("organisation" in this.$route.query) {
        this.selectedReportingOrg = this.$route.query.organisation
      }
      if (Object.values(this.codelists.countries).length == 0) {
        this.$nuxt.$loading.start()
        this.setup()
      }
    })
  }
}
</script>

<style>
</style>
