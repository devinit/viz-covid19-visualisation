<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <div class="alert alert-warning">
        This is a prototype visualisation to track the Covid-19 response. The data on this page comes from <a href="https://iatistandard.org">IATI</a>. Read more on the <nuxt-link :to="{name: 'about'}">about page</nuxt-link>.
      </div>
      <template v-if="isBusy">
        <div class="text-center text-secondary">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template
          v-if="!isBusy">
        <h2>Flows between organisations</h2>
        <b-form-group label="Organisation Type">
          <b-form-select :options="reportingOrgTypes" v-model="selectedReportingOrgType">
          </b-form-select>
        </b-form-group>
        <hr />
        <h3>Summary of disbursements and direct expenditure</h3>
        <b-alert show>
          Some organisations disburse on to other organisations, whereas others
          spend money directly. The below table shows the proportion of funds each
          organisation is disbursing to others versus spending directly.
        </b-alert>
        <b-table
          v-if="flowsSummary"
          :items="flowsSummary"
          :fields="fields"
          sortable
          responsive
          foot-clone
        >
          <template v-slot:cell(disbursements_pct)="data">
            <span v-b-tooltip :title="`USD ${numberFormatter(data.item.disbursements_USD)}`">
            {{ numberFormatter(data.item.disbursements_pct) }}
            </span>
          </template>
          <template v-slot:cell(expenditure_pct)="data">
            <span v-b-tooltip :title="`USD ${numberFormatter(data.item.expenditure_USD)}`">
            {{ numberFormatter(data.item.expenditure_pct) }}
            </span>
          </template>
          <!-- Default fall-back custom formatted footer cell -->
          <template v-slot:foot(reportingOrg)="data">
            Total
          </template>
          <template v-slot:foot(total_USD)="data">
            {{ numberFormatter(flowsTotalSpend) }}
          </template>
          <template v-slot:foot(disbursements_pct)="data">
            {{ numberFormatter(flowsAverageDisbursementsPCT) }}
          </template>
          <template v-slot:foot(expenditure_pct)="data">
            {{ numberFormatter(flowsAverageExpenditurePCT) }}
          </template>
          <template v-slot:foot()="data">
            {{ data.label }}
          </template>
        </b-table>
        <hr />
        <h3>Flows for each organisation</h3>
        <b-alert show>
          The below visualisation allows you to see the flows reported by each
          organisation. Select a reporting organisation from the drop down list below.
          You will then see all of the organisations that they disburse money to on the
          right hand side (generally, their implementing organisation). The greater the size
          of the implementing organisation, the more money is being disbursed to that organisation.
        </b-alert>
        <b-row>
          <b-col md="9">
            <b-form-group label="Publisher">
              <b-form-select
                :options="reportingOrgs"
                v-model="selectedOrganisation">
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-alert variant="secondary" show>
              <b-form-checkbox
                :options="[true,false]"
                v-model="showIncomingFunds"
                size="sm"
                switch
                title="Show or hide incoming funds to this organisation."
                v-b-tooltip>
                Show incoming funds
              </b-form-checkbox>
              <b-form-checkbox
                :options="[true,false]"
                v-model="showRelatedOrganisations"
                size="sm"
                switch
                title="Including data from partner organisations may lead to double-counting."
                v-b-tooltip>
                Include data from partner organisations
              </b-form-checkbox>
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col><b-badge variant="dark">Funded by</b-badge></b-col>
          <b-col class="text-right"><b-badge variant="dark">Implemented by</b-badge></b-col>
        </b-row>
        <SankeyChart :items="flowsOrganisationsChart"/>
        <p>Note: the chart above is generated from the organisation's own IATI
        data. However, some data processing was required to standardise the data.</p>
        <h4>Disbursements and Direct Expenditure</h4>
        <b-table
          :fields="fieldsOrganisations"
          :items="flowsOrganisationsTableDisbursementsExpenditure"
          sort-by="reporting_org_text"
          fixed
          show-empty>
          <template v-slot:empty="scope">
            <b-alert show class="text-muted text-center" variant="info">
              No disbursements or direct expenditure published so far for this organisation.
            </b-alert>
          </template>
        </b-table>
        <h4>Incoming funds</h4>
        <b-table
          :fields="fieldsOrganisations"
          :items="flowsOrganisationsTableIncomingFunds"
          sort-by="reporting_org_text"
          fixed
          show-empty>
          <template v-slot:empty="scope">
            <b-alert show class="text-muted text-center" variant="info">
              No incoming funds published so far for this organisation.
            </b-alert>
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
import config from '../nuxt.config'
import SankeyChart from '~/components/Sankey.vue'
export default {
  components: {
    SankeyChart
  },
  data() {
    return {
      title: config.head.title,
      description: config.description,
      transactionType: "2",
      transactionTypes: {
        "2": "Commitments",
        "3": "Disbursements",
        "4": "Expenditure"
      },
      downloadURLs: [],
      fieldsOrganisations: [
        {
          key: 'reporting_org_text',
          label: 'Reported by',
          sortable: true
        },
        {
          key: 'provider_text',
          label: 'Provider',
          sortable: true
        },
        {
          key: 'receiver_text',
          label: 'Receiver',
          sortable: true
        },
        {
          key: 'value_USD',
          label: 'Value (USD)',
          formatter: 'numberFormatter',
          class: 'number-value',
          sortable: true
        }],
      selectedOrganisation: 'US-GOV-1',
      selectedReportingOrgType: '10',
      showIncomingFunds: true,
      showRelatedOrganisations: true
    }
  },
  computed: {
    isBusy() {
      return this.$store.state.originalFlows.length == 0
    },
    urls() {
      return  {
        DATA_URL: "https://raw.githubusercontent.com/markbrough/covid19-data/gh-pages/traceability/traceability.json",
        ORGANISATION_TYPES: "https://codelists.codeforiati.org/api/json/en/OrganisationType.json"
      }
    },
    fields() {
      return [
        {
          "key": "reportingOrg",
          "label": "Reported by",
          "sortable": true
        },
        {
          "key": "total_USD",
          "label": "Total Spend USD",
          "sortable": true,
          formatter: "numberFormatter",
          class: 'number-value'
        },
        {
          "key": "disbursements_pct",
          "label": "Disbursements %",
          "sortable": true,
          formatter: "numberFormatter",
          class: 'number-value'
        },
        {
          "key": "expenditure_pct",
          "label": "Direct Expenditure %",
          "sortable": true,
          formatter: "numberFormatter",
          class: 'number-value'
        }]
    },
    codelists() {
      return this.$store.state.codelists
    },
    reportingOrgTypes() {
      var _dataROTypes = this.originalFlows.reduce((summary, flow) => {
        if (!summary.includes(flow.reporting_org_type)) {
          summary.push(flow.reporting_org_type)
        }
        return summary
      }, [])
      return this.codelists.organisationTypes.filter(item => {
        return _dataROTypes.includes(item.value)
      })
    },
    reportingOrgs() {
      var seenReportingOrgs = []
      return this.flows.reduce((summary, flow) => {
        if (!seenReportingOrgs.includes(flow.reporting_org_ref)) {
          summary.push({value: flow.reporting_org_ref, text: flow.reporting_org_text })
          seenReportingOrgs.push(flow.reporting_org_ref)
        }
        return summary
      }, []).sort((a,b) =>
          a.text < b.text ? -1 : 1
      )
    },
    originalFlows() {
      return this.$store.state.originalFlows
    },
    flows() {
      return this.originalFlows.filter(item => {
        return this.selectedReportingOrgType == item.reporting_org_type
      })
    },
    flowsSummary() {
      return Object.values(this.flows.reduce((summary, item) => {
        if (!(item.reporting_org_text in summary)) {
          summary[item.reporting_org_text] = {
            'reportingOrg': item.reporting_org_text,
            'total_USD': 0.0,
            'disbursements_USD': 0.0,
            'disbursements_pct': 0.0,
            'expenditure_USD': 0.0,
            'expenditure_pct': 0.0
          }
        }
        let target = summary[item.reporting_org_text]
        if (item.transaction_type_code=='3') {
          target.disbursements_USD += item.value_USD
          target.total_USD += item.value_USD
        } else if (item.transaction_type_code=='4') {
          target.expenditure_USD += item.value_USD
          target.total_USD += item.value_USD
        }
        target.disbursements_pct = (target.disbursements_USD / (target.disbursements_USD + target.expenditure_USD)) * 100.0
        target.expenditure_pct = (target.expenditure_USD / (target.disbursements_USD + target.expenditure_USD)) * 100.0
        return summary
      }, {}))
    },
    flowsOrganisationsTable() {
      return this.flowsOrganisations.filter(item => {
        return this.selectedOrganisation == item.reporting_org_ref
      })
    },
    flowsOrganisationsTableIncomingFunds() {
      return this.flowsOrganisationsTable.filter(item => {
        return (item.transaction_type_code == "1")
        })
    },
    flowsOrganisationsTableDisbursementsExpenditure() {

      var _transactions = this.flowsOrganisationsTable.filter(item => {
        return ['3', '4'].includes(item.transaction_type_code)
      })
      if (this.showRelatedOrganisations) {
        return _transactions.concat(this.originalFlows.filter(item => {
          return (this.selectedOrganisation == item.provider_ref) &&
          (this.selectedOrganisation != item.reporting_org_ref) &&
          (item.transaction_type_code == '1')
        }).map(item => {
          return {
            'reporting_org_text': item.reporting_org_text,
            'provider_text': item.provider_text,
            'provider_ref': item.provider_ref,
            'provider_type': item.provider_type,
            'transaction_type': 'Disbursement',
            'transaction_type_code': '4',
            'value_USD': item.value_USD,
            'receiver_text': item.receiver_text,
            'receiver_ref': item.receiver_ref,
            'receiver_type': item.receiver_type
          }
        }))
      }
      return _transactions
    },
    flowsOrganisationsChart() {
      if (!(this.showIncomingFunds)) {
        return this.flowsOrganisationsTableDisbursementsExpenditure
      }
      return this.flowsOrganisationsTableDisbursementsExpenditure.concat(this.flowsOrganisationsTableIncomingFunds)
    },
    flowsOrganisations() {
      let expenditure = Object.values(
          this.flows.filter(item => {
            return ['4'].includes(item.transaction_type_code)
          }).reduce((summary, item) => {
            if (!(item.reporting_org_text in summary)) {
              summary[item.reporting_org_text] = {
                reporting_org_text: item.reporting_org_text,
                reporting_org_ref: item.reporting_org_ref,
                reporting_org_type: item.reporting_org_type,
                provider_text: item.provider_text,
                transaction_type: "Expenditure",
                transaction_type_code: "4",
                value_USD: 0.0,
                receiver_text: "Direct Expenditure",
                receiver_ref: null,
                receiver_type: null
              }
            }
            summary[item.reporting_org_text].value_USD += item.value_USD
            return summary
          }, {})
        )
      let disbursements = this.flows.filter(item => {
        return ['1', '3'].includes(item.transaction_type_code)
      })
      return expenditure.concat(disbursements)
    },
    flowsTotalSpend() {
      return this.flowsSummary.reduce((summary, item) => {
        summary += item.total_USD
        return summary
      }, 0.0)
    },
    flowsAverageExpenditurePCT() {
      return this.flowsSummary.reduce((summary, item) => {
        if (!item.expenditure_pct) { return summary }
        summary += (item.expenditure_pct / this.flowsSummary.length)
        return summary
      }, 0.0)
    },
    flowsAverageDisbursementsPCT() {
      return this.flowsSummary.reduce((summary, item) => {
        if (!item.disbursements_pct) { return summary }
        summary += (item.disbursements_pct / this.flowsSummary.length)
        return summary
      }, 0.0)
    }
  },
  methods: {
    numberFormatter(value) {
      if (value == 0) { return "0" }
      return value ? value.toLocaleString(undefined, {
        maximumFractionDigits: 0
      }) : ""
    },
    processFlows(flows) {
      return flows
    },
    async loadData() {
      await axios.get(`${this.urls.ORGANISATION_TYPES}`).then(response => {
        var data = response.data.data.map(item => {
          return {
            'value': item.code,
            'text': item.name
          }
        })
        this.$store.commit('setCodelistsOrganisationType', data)
      })
      let _data = await axios.get(`${this.urls.DATA_URL}`).then(response => {
        var data = this.processFlows(response.data)
        this.$store.commit('setOriginalFlows', data)
      })
      this.$nuxt.$loading.finish()
    }
  },
  watch: {
    selectedReportingOrgType(value) {
      if (value) {
        this.selectedOrganisation = this.reportingOrgs[0].value
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (Object.values(this.flows).length == 0) {
        this.$nuxt.$loading.start()
        this.loadData()
      }
    })
  }
}
</script>

<style>
</style>
