<template>
  <div>
    <b-row>
      <b-col>
        <h3>Summary</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <b-form inline>
          <b-form-group>
            <b-form-radio-group
              class="displaySummaryControls mb-1"
              v-model="summary"
              :options="summaryDisplayOptions"
              buttons
              button-variant="outline-primary"
            ></b-form-radio-group>
            <b-form-radio-group
              class="displaySummaryControls mb-1"
              v-model="summaryLabel"
              :options="summaryLabelOptions"
              buttons
              button-variant="outline-secondary"
            ></b-form-radio-group>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col md="6" class="ml-lg-auto text-md-right">
        <b-row>
          <b-form inline class="ml-lg-auto">
            <b-form-group class="ml-lg-auto">
              <b-form-select
              v-model="country"
              :options="countries"
              :state="country ? true : null"
              class="mb-1"
              style="max-width: 250px"></b-form-select>
              <b-form-select
              v-model="organisation"
              :options="reportingOrgs"
              :state="organisation ? true : null"
              class="mb-1"
              style="max-width: 250px"></b-form-select>
            </b-form-group>
          </b-form>
        </b-row>
        <b-row>
          <b-dropdown text="Humanitarian / development" variant="secondary" class="ml-lg-auto" size="sm">
            <b-dropdown-form>
              <b-form-group>
                <b-form-checkbox-group
                  v-model="humanitarianDevelopment"
                  :options="humanitarianDevelopmentOptions"
                  size="sm"
                  stacked
                  switches
                ></b-form-checkbox-group>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>
        </b-row>
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
    "selectedReportingOrg", "reportingOrgs", "selectedHumanitarianDevelopment"],
  data() {
    return {
      summaryLabelOptions: [
        {'value': 'organisation', 'text': 'Reporting organisation'},
        {'value': 'country', 'text': 'Country'}
      ],
      summaryDisplayOptions: [
        {'value': 'chart', 'text': 'Chart'},
        {'value': 'table', 'text': 'Table'}
      ],
      humanitarianDevelopmentOptions: [
        {'value': 'humanitarian', 'text': 'Humanitarian'},
        {'value': 'humanitarian / development', 'text': 'Humanitarian / Development'},
        {'value': 'development', 'text': 'Development'},
        {'value': 'unspecified', 'text': 'Unspecified'}
      ]
    }
  },
  computed: {
    humanitarianDevelopment: {
     // getter
      get: function () {
        return this.selectedHumanitarianDevelopment
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedHumanitarianDevelopment', newValue)
      }
    },
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