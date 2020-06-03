<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        This is a prototype visualisation to track the COVID-19 response. Read more on the <nuxt-link :to="{name: 'about'}">about page</nuxt-link>.
      </div>
      <template v-if="isBusy">
        <div class="text-center text-secondary">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template
          v-if="!isBusy">
        <h2>Activities</h2>
        <hr />
        <IATISummaryPaneControls
          :display-summary.sync="displaySummary"
          :summary-label-field.sync="summaryLabelField"
          :selected-country.sync="selectedCountry"
          :countries="countries"
          :selected-reporting-org.sync="selectedReportingOrg"
          :selected-humanitarian-development.sync="selectedHumanitarianDevelopment"
          :reporting-orgs="reportingOrgs" />
        <hr />
        <IATISummaryPane
          v-if="activities"
          :activityData="activities"
          :displaySummary="displaySummary"
          :summaryLabelField="summaryLabelField"
          :codelists="codelists"
          :getCountryName="getCountryName" />
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
            <span v-for="countryRegion in data.item.countriesRegions" :key="`${data.index}-${countryRegion.code}`">
              {{ getCountryName(countryRegion) }}
            </span>
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
    totalRows() {
      return this.activities.length
    },
    isBusy() {
      return this.$store.state.originalActivityData.length == 0
    },
    urls() {
      return  {
        DATA_URL: "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/activities.json",
        COUNTRIES_CODELIST_URL: `https://codelists.codeforiati.org/api/json/en/Country.json`,
        REGIONS_CODELIST_URL: `https://codelists.codeforiati.org/api/json/en/Region.json`
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
          "label": "COVID-specific (USD)",
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
            if (!seenCountries.includes(null)) {
              seenCountries.push(null)
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
    originalActivityData() {
      return this.$store.state.originalActivityData
    },
    activities() {
      const _checkReportingOrg = (activity) => {
        if (this.selectedReportingOrg == null) { return true }
        return activity.reportingOrg.ref == this.selectedReportingOrg
      }
      const _checkCountry = (activity) => {
        if (this.selectedCountry == null) { return true }
        else if (this.selectedCountry == "") { return activity.countriesRegions.length == 0 }
        return activity.countriesRegions.map(cr=> { return cr.code}).includes(this.selectedCountry)
      }
      const _checkHumanitarianDevelopment = (activity) => {
        if (this.selectedHumanitarianDevelopment.length == 4) { return true }
        return this.selectedHumanitarianDevelopment.includes(activity.humanitarianDevelopment)
      }
      if ((this.selectedCountry == null) && (this.selectedReportingOrg == null) && (this.selectedHumanitarianDevelopment.length == 4)) {
        return this.originalActivityData
      } else {
        return this.originalActivityData.filter(activity => {
          return _checkReportingOrg(activity) && _checkCountry(activity) && _checkHumanitarianDevelopment(activity)
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
      return this.codelists.countries[recipient_country.code] ? this.codelists.countries[recipient_country.code] : `Unknown: ${recipient_country.code}`
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
        this.$store.commit('setCodelistsCountry', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, this.$store.state.codelists.countries))
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
