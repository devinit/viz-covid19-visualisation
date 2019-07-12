<template>
  <div class="container" style="margin-top: 20px;">
    <div>
      <h1>
        {{ activityData ? activityData[0]["reporting-org"].narrative._text : 'Loading...' }} IATI data
      </h1>
      <div class="alert alert-warning">
        <b>Disclaimer:</b> This site is unofficial, based on {{ activityData ? activityData[0]["reporting-org"].narrative._text : '' }} <a href="http://iatiregistry.org">IATI data</a>.
      </div>
      <h3>Summary</h3>
      <b-form-group>
        <b-form-radio v-model="displaySummary" name="displaySummaryControls" value="chart">Chart</b-form-radio>
        <b-form-radio v-model="displaySummary" name="displaySummaryControls" value="table">Table</b-form-radio>
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
        :activity="activity" />
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
      displaySummary: 'chart'
    }
  },
  mounted() {
    const API_URL = 'https://cors-anywhere.herokuapp.com/http://sage2iati.publishwhatyoufund.org/publish-what-you-fund/activity.xml'

    function makeTransactionsTable(transactions) {
      transactions.sort((a,b) =>
          a["transaction-date"]["_attributes"]["iso-date"] < b["transaction-date"]["_attributes"]["iso-date"] ? -1 : 1
      ).reverse()
      transactions = transactions.filter(
        transaction => transaction["transaction-type"]["_attributes"]["code"] === "4"
      )
      return transactions.map(transaction => ({
        'description': transaction.description.narrative._text,
        'sector': transaction.sector.narrative._text,
        'date': transaction["transaction-date"]["_attributes"]["iso-date"],
        'value': transaction.value._text
      }))
    }
    return this.$axios.$get(`${API_URL}`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      progress: true
    }).then(data => {
      this.activityData = xmlJs.xml2js(data, {compact: true})['iati-activities']['iati-activity'].map(
        activity => {
          activity.transactionsTable = makeTransactionsTable(activity.transaction)
          return activity
        }
      )
    }).catch(error => {
      alert("Sorry, there was an error loading the data! Perhaps the IATI XML file moved or is currently unavailable?")
      console.log(error.response)
    });

  }
}
</script>

<style>
</style>
