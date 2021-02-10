<template>
  <div>
    <BarChart
      v-if="displaySummary==='chart'"
      :barChartData="summaryData"
      :labelField="summaryLabelField"
      :valueLabel="valueLabel"
      :valueField="valueField"
      value-precision="0"
    />
    <b-table
      v-if="displaySummary==='table'"
      :items="summaryData"
      :fields="summaryFields"
      asort-by="total_value"
      asort-desc="true"
      small
      head-variant="dark"
      bordered />
  </div>
</template>
<script>
import BarChart from '~/components/BarChart.vue'
export default {
  components: {
    BarChart
  },
  props: ['activityData', 'displaySummary', 'summaryLabelField',
    'codelists', 'getCountryName', 'getSectorName', 'summaryType',
    'activityTransactionsData'],
  data () {
    return {
    }
  },
  computed: {
    valueField () {
      return this.summaryType
    },
    valueLabel () {
      const _options = {
        'number_of_projects': 'Number of projects',
        'commitments': 'Commitments (USD)',
        'disbursements': 'Disbursements (USD)'
      }
      return _options[this.summaryType]
    },
    summaryData () {
      return this.summaryType === 'number_of_projects' ? this.summaryActivityData : this.summaryActivityTransactionsData
    },
    summaryActivityData () {
      return Object.values(this.activityData.reduce((summary, activity) => {
        const getOrg = (activity) => {
          return activity.reportingOrg.text
        }
        const getCountry = (countryRegion) => {
          // if (countriesRegions.length==0) { return "Unspecified" }
          return this.getCountryName(countryRegion)
        }
        const getSector = (sector) => {
          // if (sectors.length==0) { return "Unspecified" }
          return this.getSectorName(sector)
        }
        if (this.summaryLabelField === 'organisation') {
          const target = summary[getOrg(activity)]
            ? summary[getOrg(activity)]
            : summary[getOrg(activity)] = {
              'organisation': getOrg(activity)
            }
          target[this.valueField] ? target[this.valueField] += 1 : target[this.valueField] = 1
        } else if (this.summaryLabelField === 'country') {
          const countryRegions = activity.countriesRegions.length > 0 ? activity.countriesRegions : [{ 'code': '' }]
          countryRegions.forEach((countryRegion) => {
            const target = summary[getCountry(countryRegion)]
              ? summary[getCountry(countryRegion)]
              : summary[getCountry(countryRegion)] = {
                'country': getCountry(countryRegion)
              }
            target[this.valueField] ? target[this.valueField] += 1 : target[this.valueField] = 1
          })
        } else if (this.summaryLabelField === 'sector') {
          const sectors = activity.sectors.length > 0 ? activity.sectors : [{ 'code': '' }]
          sectors.forEach((sector) => {
            const target = summary[getSector(sector)]
              ? summary[getSector(sector)]
              : summary[getSector(sector)] = {
                'sector': getSector(sector)
              }
            target[this.valueField] ? target[this.valueField] += 1 : target[this.valueField] = 1
          })
        }
        return summary
      }, {})
      ).sort((a, b) => a[this.valueField] > b[this.valueField] ? 1 : -1
      ).reverse()
    },
    summaryActivityTransactionsData () {
      const getOrg = (activityTransaction) => {
        return activityTransaction.reporting_org_text
      }
      const getCountry = (activityTransaction) => {
        if (activityTransaction.country_region === '') { return 'Unspecified' }
        return this.getCountryName({ code: activityTransaction.country_region })
      }
      const getSector = (activityTransaction) => {
        if (activityTransaction.sector === '') { return 'Unspecified' }
        return this.getSectorName({ code: activityTransaction.sector })
      }
      return Object.values(this.activityTransactionsData.reduce((summary, activityTransaction) => {
        if (this.summaryLabelField === 'organisation') {
          var target = summary[getOrg(activityTransaction)]
            ? summary[getOrg(activityTransaction)]
            : summary[getOrg(activityTransaction)] = {
              'organisation': getOrg(activityTransaction),
              'commitments': 0,
              'disbursements': 0
            }
        } else if (this.summaryLabelField === 'country') {
          var target = summary[getCountry(activityTransaction)]
            ? summary[getCountry(activityTransaction)]
            : summary[getCountry(activityTransaction)] = {
              'country': getCountry(activityTransaction),
              'commitments': 0,
              'disbursements': 0
            }
        } else if (this.summaryLabelField === 'sector') {
          var target = summary[getSector(activityTransaction)]
            ? summary[getSector(activityTransaction)]
            : summary[getSector(activityTransaction)] = {
              'sector': getSector(activityTransaction),
              'commitments': 0,
              'disbursements': 0
            }
        }
        if (activityTransaction.transaction_type_code === '2') {
          target.commitments += activityTransaction.value_USD_proportionate
        } else if (activityTransaction.transaction_type_code === '3') {
          target.disbursements += activityTransaction.value_USD_proportionate
        }
        return summary
      }, {})
      ).sort((a, b) => a[this.valueField] > b[this.valueField] ? 1 : -1
      ).reverse()
    },
    summaryFields () {
      const out = [
        {
          key: this.summaryLabelField,
          sortable: true
        },
        {
          key: this.valueField,
          sortable: true,
          thClass: 'text-right',
          tdClass: 'text-right',
          formatter: 'valueFormatter'
        }
      ]

      return out
    }
  },
  methods: {
    valueFormatter (value) {
      return value ? Math.round(value) : 0
    }
  }
}
</script>
