<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <h1>
        Publish What You Fund IATI Data Visualisation
      </h1>
      <div class="alert alert-warning">
        <b>Disclaimer:</b> This site is unofficial, based on <a href="http://publishwhatyoufund.org">Publish What You Fund</a>'s <a href="http://iatiregistry.org/publisher/pwyf">IATI data</a>.
      </div>
      <p class="lead">The idea for this site was sparked by some debates about the appropriate granularity of open data and the limits of transparency. It can hopefully be seen as a contribution to those debates. The data published by Publish What You Fund about its own finances is possibly the most detailed and granular data released by any organisation. Presented here unchanged from the organisation's own IATI publication, it contains personnel costs aggregated by month, but otherwise every line item from the financial system is published. Revenue data is also published. The detailed expense classification (e.g. classification by salaries vs flights or hotel costs) is quite unique to Publish What You Fund's data; most other organisations publish much more aggregate data. The extent to which this approach could or should be replicated by other organisations is of course open for discussion.</p>
      <template v-if="activityData == null">
        <h2 class="loading-text">(Loading data...)</h2>
      </template>
      <template v-if="activityData != null">
        <h3>Summary</h3>
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
            id="transactionTypeControls"
            v-model="transactionType"
            :options="[
              {'value': '4', 'text': 'Expenditure'},
              {'value': '1', 'text': 'Revenue'}
            ]"
            name="transactionTypeControls"
            buttons
            button-variant="outline-dark"
          ></b-form-radio-group>
        </b-form-group>
        <SummaryTable
          v-if="activityData"
          :activityData="activityData"
          :displaySummary="displaySummary" />
        <hr />
        <h3>Activity detail</h3>
        <ActivityTable
          v-if="activityData"
          v-for="activity in activityData"
          :key="activity['iati-identifier']._text"
          :activity="activity"
          :transactionType="transactionType" />
      </template>
    </div>
    <footer>
      <div class="row">
        <div class="col-md-12 text-right">
          <p>By <a href="http://twitter.com/mark_brough">@mark_brough</a></p>
          <p><a href="http://github.com/markbrough/pwyf-visualisation">Source code on Github</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>
<style>
.loading-text {
  font-style: italic;
  color: #666;
}
#displaySummaryControls label, #transactionTypeControls label {
  cursor: pointer;
}
.nuxt-progress {
  background-color: #666;
}
</style>
<script>
import xmlJs from 'xml-js'
import SummaryTable from '~/components/SummaryTable.vue'
import ActivityTable from '~/components/ActivityTable.vue'
export default {
  loading: false,
  components: {
    ActivityTable,
    SummaryTable
  },
  data() {
    return {
      activityData: null,
      displaySummary: 'chart',
      transactionType: "4"
    }
  },
  methods: {
    makeTransactionsTable(transactions, _this) {
      transactions.sort((a,b) =>
          a["transaction-date"]["_attributes"]["iso-date"] < b["transaction-date"]["_attributes"]["iso-date"] ? -1 : 1
      ).reverse()
      transactions = transactions.filter(
        transaction => (
          transaction["transaction-type"]["_attributes"]["code"] === _this.transactionType
        ) && (
          parseInt(transaction["transaction-date"]["_attributes"]["iso-date"].slice(0,4)) >= 2009
        )
      )
      return transactions.map(transaction => ({
        'description': transaction.description.narrative._text,
        'sector': transaction.sector.narrative._text,
        'date': transaction["transaction-date"]["_attributes"]["iso-date"],
        'value': transaction.value._text
      }))
    },
    loadData() {
      const API_URL = 'https://cors-anywhere.herokuapp.com/http://sage2iati.publishwhatyoufund.org/publish-what-you-fund/activity.xml'
      const _this = this
      return this.$axios.$get(`${API_URL}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        progress: false
      }).then(data => {
        this.activityData = xmlJs.xml2js(data, {compact: true})['iati-activities']['iati-activity'].map(
          activity => {
            activity.transactionsTable = this.makeTransactionsTable(activity.transaction, _this)
            return activity
          }
        )
        this.$nuxt.$loading.finish()
      }).catch(error => {
        alert("Sorry, there was an error loading the data! Perhaps the IATI XML file moved or is currently unavailable?")
        console.log(error.response)
      })
    }
  },
  watch: {
    transactionType() {
      this.activityData = this.activityData.map(activity => {
        activity.transactionsTable = this.makeTransactionsTable(activity.transaction, this)
        return activity
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.loadData()
    })
  }
}
</script>

<style>
</style>
