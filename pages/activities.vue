<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        <b>Notice:</b> This site is based on <a href="https://iatistandard.org">IATI data</a>.
      </div>
      <template v-if="activities == null">
        <div class="text-center text-secondary">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template
          v-if="activities != null">
        <h3>Summary</h3>
        <b-row>
          <b-col>
            <b-form inline>
              <b-form-group>
                <b-form-radio-group
                  id="displaySummaryControls"
                  v-model="displaySummary"
                  :options="[
                    {'value': 'chart', 'text': 'Chart'},{'value': 'table', 'text': 'Table'}
                  ]"
                  name="displaySummaryControls"
                  buttons
                  button-variant="outline-primary"
                ></b-form-radio-group>
                <b-form-radio-group
                  id="displaySummaryControls"
                  v-model="summaryLabelField"
                  :options="summaryLabelFields"
                  buttons
                  button-variant="outline-secondary"
                ></b-form-radio-group>
              </b-form-group>
            </b-form>
          </b-col>
          <b-col  class="ml-auto text-right">
            <b-form inline>
              <b-form-group class="ml-auto">
                <b-form-select
                v-model="selectedCountry"
                :options="countries"
                :state="selectedCountry ? true : null"
                style="max-width: 250px"></b-form-select>
                <b-form-select
                v-model="selectedReportingOrg"
                :options="reportingOrgs"
                :state="selectedReportingOrg ? true : null"
                style="max-width: 250px"></b-form-select>
              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
        <hr />

        <SummaryTable
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
        >
          <template v-slot:cell(title)="data">
            <a :href="`http://d-portal.org/q.html?aid=${data.item['iati-identifier']._text}`"
            target="_blank">{{ data.item.processed.title }}</a>
          </template>
          <template v-slot:cell(reported_by)="data">
            {{ data.item.processed.reporting_org }}
          </template>
          <template v-slot:cell(implemented_by)="data">
            {{ data.item.processed.implementing_orgs }}
          </template>
          <template v-slot:cell(recipient_country)="data">
            {{ data.item.processed.recipient_country }}
          </template>
          <template v-slot:cell(committed)="data">
            {{ data.item.processed.total_amounts }}
          </template>
        </b-table>
      </template>
    </div>
  </div>
</template>
<style>
#displaySummaryControls label, #transactionTypeControls label {
  cursor: pointer;
}
</style>
<script>
import xmlJs from 'xml-js'
import SummaryTable from '~/components/SummaryTable.vue'
import ActivityTable from '~/components/ActivityTable.vue'
import config from '../nuxt.config'
export default {
  components: {
    ActivityTable,
    SummaryTable
  },
  data() {
    return {
      title: config.head.title,
      description: config.description,
      activities: null,
      originalActivityData: null,
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
      codelists: {
        countries: {}
      },
      CORS_ANYWHERE: this.$store.state.CORSAnywhere
    }
  },
  computed: {
    urls() {
      if (this.$store.state.useCache) {
        return {
          COUNTRIES_CODELIST_URL: `/cache/codelists/Country.json`,
          V2_DATASTORE_API_URL: '/cache/data/datastore.xml',
          DPORTAL_URL_1: `/cache/data/dportal-1.xml`,
          DPORTAL_URL_2: `/cache/data/dportal-2.xml`
        }
      } else {
        return {
          COUNTRIES_CODELIST_URL: `${this.CORS_ANYWHERE}https://codelists.codeforiati.org/api/json/en/Country.json`,
          V2_DATASTORE_API_URL: 'https://iati.cloud/search/activity?q=(title_narrative:%22COVID%22%20OR%20description_narrative:%22COVID%22%20OR%20humanitarian_scope_code:%22EP-2020-000012-001%22%20OR%20humanitarian_scope_code:%22HCOVD20%22%20OR%20tag_code:%22EP-2020-000012-001%22)&wt=xslt&tr=activity-xml.xsl&rows=500000',
          DPORTAL_URL_1: `${this.CORS_ANYWHERE}http://www.d-portal.org/q.xml?from=act&limit=-1distincton=aid&%2Fhumanitarian-scope@code=EP-2020-000012-001&view=active`,
          DPORTAL_URL_2: `${this.CORS_ANYWHERE}http://www.d-portal.org/q.xml?from=act&limit=-1distincton=aid&text_search=COVID&view=active`
        }
      }
    },
    fields() {
      return ["title", "reported_by", "implemented_by", "recipient_country", "committed"].map(field => {
        return {
          "key": field,
          "sortable": true
        }
      })
    },
    countries() {
      var seenCountries = []
      return this.originalActivityData.reduce((summary, activity) => {
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
      }, [{value: null, text: "All countries"}]).sort((a,b) =>
          a.value < b.value ? -1 : 1
      )
    },
    reportingOrgs() {
      var seenReportingOrgs = []
      return this.originalActivityData.reduce((summary, activity) => {
        if (activity["reporting-org"] && !seenReportingOrgs.includes(activity["reporting-org"]._attributes.ref)) {
          summary.push({value: activity["reporting-org"]._attributes.ref, text: this.getNarrative(activity["reporting-org"]) })
          seenReportingOrgs.push(activity["reporting-org"]._attributes.ref)
        }
        return summary
      }, [{value: null, text: "All reporting organisations"}]).sort((a,b) =>
          a.value < b.value ? -1 : 1
      )

    },
    useCache() {
      return this.$store.state.useCache
    }
  },
  methods: {
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
      return recipient_country.narrative ? this.getNarrative(recipient_country) : this.codelists.countries[recipient_country._attributes.code]
    },
    getTotalAmounts(activity) {
      if (!activity.transaction) {
        return 0.00
      }
      if (activity.transaction.value) { activity.transaction = [activity.transaction] }
      const transactions = activity.transaction.filter(
        transaction => (
          transaction["transaction-type"]["_attributes"]["code"] === this.transactionType
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
            'X-Requested-With': 'XMLHttpRequest',
          }
        }).then(data => {
          this.codelists.countries = data.data.reduce((countries, country) => {
            countries[country.code] = country.name
            return countries
          }, {})
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
                title: getOrBlank(this.getNarrative(activity["title"])),
                reporting_org: getOrBlank(this.getNarrative(activity["reporting-org"])),
                reporting_org_ref: activity["reporting-org"] ? activity["reporting-org"]._attributes.ref : "",
                recipient_country: getOrBlank(this.getCountryName(activity["recipient-country"])),
                recipient_country_code: activity["recipient-country"] ? activity["recipient-country"]._attributes.code : "",
                implementing_orgs: getOrBlank(this.getImplementingOrgs(activity["participating-org"])),
                total_amounts: getOrBlank(this.getTotalAmounts(activity))
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

      let _data = await Promise.all([
        this.$axios.$get(`${this.urls.DPORTAL_URL_1}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          }
        }),
        this.$axios.$get(`${this.urls.DPORTAL_URL_2}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          }
        })
        ])

      var data = appendActivities(_data)
      this.originalActivityData = data
      this.activities = this.originalActivityData
      this.applyFilters()
      this.$nuxt.$loading.finish()
    },
    applyFilters() {
      if (this.originalActivityData == null) { return }
      if ((this.selectedCountry == null) && (this.selectedReportingOrg == null)) {
        this.activities = this.originalActivityData
      } else {
        this.activities = this.originalActivityData.filter(activity => {
          if ((this.selectedReportingOrg != null) && (this.selectedCountry != null)) {
            return (activity.processed.reporting_org_ref == this.selectedReportingOrg) &&
            (activity.processed.recipient_country_code == this.selectedCountry)
          } else if (this.selectedReportingOrg != null) {
            return activity.processed.reporting_org_ref == this.selectedReportingOrg
          } else if (this.selectedCountry != null) {
            return activity.processed.recipient_country_code == this.selectedCountry
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
      if ("organisation" in this.$route.query) {
        this.selectedReportingOrg = this.$route.query.organisation
      }
      this.setup()
    })
  }
}
</script>

<style>
</style>
