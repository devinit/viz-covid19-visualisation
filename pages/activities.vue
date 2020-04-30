<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        This is a prototype visualisation to track the COVID-19 response. Read more on the <nuxt-link :to="{name: 'index'}">about page</nuxt-link>.
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
        <h3>{{ activities.length }} Activities</h3>
        <b-table
          v-if="activities"
          :items="activities"
          :fields="fields"
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
            <span v-for="org in (data.item.participatingOrganisation ? data.item.participatingOrganisation[4] : [])" :key="org.text">
              {{ org.text }}
            </span>
          </template>
          <template v-slot:cell(countriesRegions)="data">
            <span v-for="countryRegion in data.item.countriesRegions" :key="countryRegion.code">
              {{ getCountryName(countryRegion) }}
            </span>
          </template>
        </b-table>
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
      selectedReportingOrg: null
    }
  },
  computed: {
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
        }]
    },
    codelists() {
      return this.$store.state.codelists
    },
    countries() {
      var seenCountries = []
      return [{value: null, text: "All countries"}].concat(
        this.originalActivityData.reduce((summary, activity) => {
          if (activity.countriesRegions) {
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
      if (this.originalActivityData == []) { [] }
      if ((this.selectedCountry == null) && (this.selectedReportingOrg == null)) {
        return this.originalActivityData.map(activity=> {
          return activity
        })
      } else {
        return this.originalActivityData.filter(activity => {
          if ((this.selectedReportingOrg != null) && (this.selectedCountry != null)) {
            return (activity.reportingOrg.ref == this.selectedReportingOrg) &&
            (activity.countriesRegions.map(cr=> { return cr.code}).includes(this.selectedCountry))
          } else if (this.selectedReportingOrg != null) {
            return activity.reportingOrg.ref == this.selectedReportingOrg
          } else if (this.selectedCountry != null) {
            return activity.countriesRegions.map(cr=> { return cr.code}).includes(this.selectedCountry)
          }
        }).map(activity=> {
          return activity
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
      return this.codelists.countries[recipient_country.code] ? this.codelists.countries[recipient_country.code] : "Unknown"
    },
    async setup() {
     await axios.get(`${this.urls.COUNTRIES_CODELIST_URL}`).then(response => {
        var data = response.data
        this.$store.commit('setCodelists', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, {}))
      })
     await axios.get(`${this.urls.REGIONS_CODELIST_URL}`).then(response => {
        var data = response.data
        this.$store.commit('setCodelists', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, this.$store.state.codelists.countries))
      })
    this.loadData()
    },
    processActivityData(data) {
      return data.map(activity=> {
        activity.totalAmountUSD = activity.commitmentsUSD ? activity.commitmentsUSD : activity.budgetsUSD
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
