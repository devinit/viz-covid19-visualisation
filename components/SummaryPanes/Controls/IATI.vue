<template>
  <div>
    <b-row>
      <b-col>
        <h3>Summary</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form inline>
          <b-form-group>
            <b-form-radio-group
              class="displaySummaryControls"
              v-model="summary"
              :options="summaryDisplayOptions"
              buttons
              button-variant="outline-primary"
            ></b-form-radio-group>
            <b-form-radio-group
              class="displaySummaryControls"
              v-model="summaryLabel"
              :options="summaryLabelOptions"
              buttons
              button-variant="outline-secondary"
            ></b-form-radio-group>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col class="ml-auto text-right">
        <b-form inline>
          <b-form-group class="ml-auto">
            <b-form-select
            v-model="country"
            :options="countries"
            :state="country ? true : null"
            style="max-width: 250px"></b-form-select>
            <b-form-select
            v-model="organisation"
            :options="reportingOrgs"
            :state="organisation ? true : null"
            style="max-width: 250px"></b-form-select>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: ["displaySummary", "summaryLabelField",
    "selectedCountry", "countries",
    "selectedReportingOrg", "reportingOrgs"],
  data() {
    return {
      summaryLabelOptions: [
        {'value': 'organisation', 'text': 'Reporting organisation'},
        {'value': 'country', 'text': 'Country'}
      ],
      summaryDisplayOptions: [
        {'value': 'chart', 'text': 'Chart'},
        {'value': 'table', 'text': 'Table'}
      ]
    }
  },
  computed: {
    summary: {
     // getter
      get: function () {
        return this.displaySummary
      },
      // setter
      set: function (newValue) {
        this.$emit('update:displaySummary', newValue)
      }
    },
    summaryLabel: {
     // getter
      get: function () {
        return this.summaryLabelField
      },
      // setter
      set: function (newValue) {
        this.$emit('update:summaryLabelField', newValue)
      }
    },
    organisation: {
     // getter
      get: function () {
        return this.selectedReportingOrg
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedReportingOrg', newValue)
      }
    },
    country: {
     // getter
      get: function () {
        return this.selectedCountry
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedCountry', newValue)
      }
    },
  }
}
</script>