<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <h1>
        {{ activityData ? activityData[0]["reporting-org"].narrative._text : 'Loading...' }} IATI data
      </h1>
      <div class="alert alert-warning">
        <b>Disclaimer:</b> This site is unofficial, based on {{ activityData ? activityData[0]["reporting-org"].narrative._text : '' }} <a href="http://iatiregistry.org">IATI data</a>.
      </div>
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
    </div>
  </div>
</template>

<script>
import xmlJs from 'xml-js'
import SummaryTable from '~/components/SummaryTable.vue'
import ActivityTable from '~/components/ActivityTable.vue'
export default {
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
        transaction => transaction["transaction-type"]["_attributes"]["code"] === _this.transactionType
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
        progress: true
      }).then(data => {
        this.activityData = xmlJs.xml2js(data, {compact: true})['iati-activities']['iati-activity'].map(
          activity => {
            activity.transactionsTable = this.makeTransactionsTable(activity.transaction, _this)
            return activity
          }
        )
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
    this.loadData()
  }
}
</script>

<style>
</style>
