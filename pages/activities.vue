<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        <b>Notice:</b> This site is based on <a href="https://iatistandard.org">IATI data</a>.
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
          :getNarrative="getNarrative" />

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
            <a :href="`http://d-portal.org/q.html?aid=${data.item.iati_identifier}`"
            target="_blank">{{ data.item.title }}</a>
          </template>
        </b-table>
      </template>
    </div>
  </div>
</template>
<style>
</style>
<script>
import xmlJs from 'xml-js'
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
      if (this.$store.state.useCache) {
        var urls = {
          COUNTRIES_CODELIST_URL: `https://test.brough.io/covid19/cache/codelists/Country.json`,
          V2_DATASTORE_API_URL: 'https://test.brough.io/covid19/cache/data/datastore.xml',
          DPORTAL_URL_1: `https://test.brough.io/covid19/cache/data/dportal-1.xml`,
          DPORTAL_URL_2: `https://test.brough.io/covid19/cache/data/dportal-2.xml`
        }
        if (this.IATISource == 'dportal') {
          urls.IATI_DATA_URLS = [urls.DPORTAL_URL_1, urls.DPORTAL_URL_2]
        } else {
          urls.IATI_DATA_URLS = [urls.V2_DATASTORE_API_URL]
        }
        return urls
      } else {
        var urls = {
          COUNTRIES_CODELIST_URL: `http://brough.io/covid19/cache/codelists/Country.json`,
          V2_DATASTORE_API_URL: 'https://iati.cloud/search/activity?q=(title_narrative:%22COVID%22%20OR%20description_narrative:%22COVID%22%20OR%20humanitarian_scope_code:%22EP-2020-000012-001%22%20OR%20humanitarian_scope_code:%22HCOVD20%22%20OR%20tag_code:%22EP-2020-000012-001%22)&wt=xslt&tr=activity-xml.xsl&rows=500000',
          DPORTAL_URL_1: `https://d-portal.org/q.xml?from=act&limit=-1distincton=aid&%2Fhumanitarian-scope@code=EP-2020-000012-001`,
          DPORTAL_URL_2: `https://d-portal.org/q.xml?from=act&limit=-1distincton=aid&text_search=COVID`
        }
        if (this.IATISource == 'dportal') {
          urls.IATI_DATA_URLS = [urls.DPORTAL_URL_1, urls.DPORTAL_URL_2]
        } else {
          urls.IATI_DATA_URLS = [urls.V2_DATASTORE_API_URL]
        }
        return urls
      }
    },
    fields() {
      return [
        {
          "key": "title",
          "sortable": true
        },
        {
          "key": "reporting_org",
          "label": "Reported by",
          "sortable": true
        },
        {
          "key": "implementing_orgs",
          "label": "Implemented by",
          "sortable": true
        },
        {
          "key": "recipient_country",
          "sortable": true
        },
        {
          "key": "committed",
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
        if (activity["recipient-country"] && !seenCountries.includes(activity["recipient-country"]._attributes.code)) {
          summary.push({value: activity["recipient-country"]._attributes.code, text: this.getCountryName(activity["recipient-country"])})
          seenCountries.push(activity["recipient-country"]._attributes.code)
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
        if (activity["reporting-org"] && !seenReportingOrgs.includes(activity["reporting-org"]._attributes.ref)) {
          summary.push({value: activity["reporting-org"]._attributes.ref, text: this.getNarrative(activity["reporting-org"]) })
          seenReportingOrgs.push(activity["reporting-org"]._attributes.ref)
        }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      ))
    },
    useCache() {
      return this.$store.state.useCache
    },
    IATISource() {
      return this.$store.state.IATISource
    },
    originalActivityData() {
      return this.$store.state.originalActivityData
    },
    activities() {
      if (this.originalActivityData == []) { [] }
      if ((this.selectedCountry == null) && (this.selectedReportingOrg == null)) {
        return this.originalActivityData.map(activity=> {
          return activity.processed
        })
      } else {
        return this.originalActivityData.filter(activity => {
          if ((this.selectedReportingOrg != null) && (this.selectedCountry != null)) {
            return (activity.processed.reporting_org_ref == this.selectedReportingOrg) &&
            (activity.processed.recipient_country_code == this.selectedCountry)
          } else if (this.selectedReportingOrg != null) {
            return activity.processed.reporting_org_ref == this.selectedReportingOrg
          } else if (this.selectedCountry != null) {
            return activity.processed.recipient_country_code == this.selectedCountry
          }
        }).map(activity=> {
          return activity.processed
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
    getImplementingOrgs(participatingOrgs) {
      if (participatingOrgs == undefined) { return "" }
      var participatingOrgs = this.getArray(participatingOrgs)
      const filterParticipating = (role) => {
        return participatingOrgs.filter(org => {
          return org._attributes.role==role
        }).map(org=> {
          return this.getNarrative(org)
        }).join(", ")
      }
      return filterParticipating("4") || filterParticipating("2")
    },
    getArray(objectOrArray) {
      if (objectOrArray == undefined) { return [] }
      else if (Array.isArray(objectOrArray)) { return objectOrArray }
      return [objectOrArray]
    },
    getNarrative(element) {
      var narratives = this.getArray(element.narrative)
      if (narratives.length == 1) { return narratives[0]._text }
      var oneNarrative = narratives.filter(narrative => {
        return !(narrative._attributes && narrative._attributes["xml:lang"] != "en")
      })
      return oneNarrative.length>0 ? oneNarrative[0]._text : narratives[0]._text
    },
    getCountryName(recipient_country) {
      if (recipient_country == undefined) { return undefined }
      return this.codelists.countries[recipient_country._attributes.code] ? this.codelists.countries[recipient_country._attributes.code] : recipient_country.narrative ? this.getNarrative(recipient_country) : ''
    },
    getTotalAmounts(activity, transactionType) {
      if (!activity.transaction) {
        return 0.00
      }
      if (activity.transaction.value) { activity.transaction = [activity.transaction] }
      const transactions = activity.transaction.filter(
        transaction => (
          transaction["transaction-type"]["_attributes"]["code"] === transactionType
        ) && (
          parseInt(transaction["transaction-date"]["_attributes"]["iso-date"].slice(0,4)) >= 2009
        )
      )
      const total = transactions.reduce(
        (total, currentValue) => total + parseFloat(currentValue["value"]._text), 0
        )
      return total
    },
    async setup() {
     await this.$axios.$get(`${this.urls.COUNTRIES_CODELIST_URL}`, {
        headers: {
        }
      }).then(data => {
        this.$store.commit('setCodelists', data.data.reduce((countries, country) => {
          countries[country.code] = country.name
          return countries
        }, {}))
      })
    this.loadData()
    },
    async loadData() {
      const anyRA = (activity, raType) => {
        if ((activity["related-activity"]._attributes) && (activity["related-activity"]._attributes.type==raType)) { return false }
        else if ((activity["related-activity"].length>1) && (activity["related-activity"].map(ra => {
          return ra._attributes.type
        }).includes(raType))) {
          return false
        }
        return true
      }
      const filterHierarchies = (activity) => {
        var filterableROs = ["XM-DAC-41114"]
        if (!filterableROs.includes(activity["reporting-org"]._attributes.ref)) { return true }

        if ((activity["reporting-org"]._attributes.ref == "XM-DAC-41114") &&
            (activity["related-activity"]) && !anyRA(activity, "2")) { return false }
        return true
      }
      const getOrBlank = (value) => {
        if (value == undefined) { return "" }
        return value
      }
      const processActivityData = (data) => {
        return xmlJs.xml2js(data, {compact: true})['iati-activities']['iati-activity'].filter(activity => {
            return filterHierarchies(activity)
          }).map(
            activity => {
              activity.transaction = this.getArray(activity.transaction)
              activity["participating-org"] = this.getArray(activity["participating-org"])
              activity.processed = {
                iati_identifier: activity['iati-identifier']._text,
                title: getOrBlank(this.getNarrative(activity["title"])),
                reporting_org: getOrBlank(this.getNarrative(activity["reporting-org"])),
                reporting_org_ref: activity["reporting-org"] ? activity["reporting-org"]._attributes.ref : "",
                recipient_country: getOrBlank(this.getCountryName(activity["recipient-country"])),
                recipient_country_code: activity["recipient-country"] ? activity["recipient-country"]._attributes.code : "",
                implementing_orgs: getOrBlank(this.getImplementingOrgs(activity["participating-org"])),
                total_amounts: getOrBlank(this.getTotalAmounts(activity, "2")),
                committed: getOrBlank(this.getTotalAmounts(activity, "2"))
              }
              return activity
            }
          ).sort(
            (a,b) => a["iati-identifier"]._text > b["iati-identifier"]._text ? 1 : -1
          )
      }
      const appendActivities = (sources) => {
        return Object.values(sources.reduce((activities, source) => {
          Object.assign(activities, processActivityData(source).reduce((sourceActivities, activity) => {
            activities[activity["iati-identifier"]._text] = activity
            return activities
          }), {})
          return activities
        }, {}))
      }

      let _data = await Promise.all(
        this.urls.IATI_DATA_URLS.map(url=> {
          return this.$axios.$get(`${url}`, {
            headers: {
            }
          })
        })
      )

      var data = appendActivities(_data)
      this.$store.commit('setOriginalActivityData', data)
      this.$nuxt.$loading.finish()
    }
  },
  watch: {
    useCache() {
      this.$store.commit('setOriginalActivityData', [])
      this.loadData()
    },
    IATISource() {
      this.$store.commit('setOriginalActivityData', [])
      this.loadData()
    },
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
