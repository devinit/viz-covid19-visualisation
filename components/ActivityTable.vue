<template>
  <b-card bg-variant="light" style="margin-bottom: 20px;">
    <b-btn
      variant="secondary"
      class="float-right"
      size="sm"
      :href="`http://d-portal.org/q.html?aid=${activity['iati-identifier']._text}`">View on D-Portal</b-btn>
    <h3>
      {{ activity.title.narrative._text }} (Total {{ transactionTypeName }}: {{ activity._attributes["default-currency"] }} {{ getTotalExpenditure(activity).toLocaleString(undefined, {
          maximumFractionDigits: 2
        })
     }})
    </h3>
    <p class="lead">
      {{ activity.description.narrative._text }}
    </p>
   </p>
    <b-table
      :id="`table_${activity['iati-identifier']._text}`"
      :items="activity.transactionsTable"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
      small
      head-variant="dark"
      bordered  >
    </b-table>
    <no-ssr>
      <b-pagination
        v-model="currentPage"
        :total-rows="activity.transactionsTable.length"
        :per-page="perPage"
        :aria-controls="`table_${activity['iati-identifier']._text}`"
      ></b-pagination>
    </no-ssr>
  </b-card>
</template>
<script>
export default {
  components: {
  },
  props: ['activity', 'transactionType', 'transactionTypes'],
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      perPageOptions: [10,20,50,100,500,1000],
      tableFields: [
          {
            key: 'description',
            sortable: true,
            thStyle: "width: 40px;"
          },
          {
            key: 'sector',
            sortable: true,
            thStyle: "width: 20px;"
          },
          {
            key: 'date',
            sortable: true,
            thStyle: "width: 20px;"
          },
          {
            key: 'value',
            label: `Value (${this.activity._attributes["default-currency"]})`,
            sortable: true,
            thStyle: "width: 20px;",
            thClass: "text-right",
            tdClass: "text-right"
          }
        ]
    }
  },
  computed: {
    transactionTypeName() {
      return this.transactionTypes[this.transactionType]
    },
    transactionTypeOptions() {
      return Object.entries(this.transactionTypes).map(tt => {
        return {'value': tt[0], 'text': tt[1]}
      })
    }
  },
  methods: {
    getTotalExpenditure(activity) {
      if (!activity.transaction) {
        return 0.00
      }
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
    }
  }
}
</script>