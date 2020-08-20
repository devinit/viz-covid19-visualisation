<template>
  <div>
    <b-row>
      <b-col>
        <h3>Summary</h3>
        <b-row>
          <b-col md="8">
            <p class="lead selection-text">
              Showing a <b v-b-toggle.controls-sidebar>{{ displaySummary }}</b> of
              <b v-b-toggle.controls-sidebar>{{ summaryTypeText }}</b> by
              <b v-b-toggle.controls-sidebar>{{ summaryLabelText }}</b>.
            </p>
            <p v-if="filterText" class="filter-text">
              Filtered to activities
              <span v-for="filter in filterText">
                {{ filter.text }} <b v-b-toggle.controls-sidebar>{{ filter.filter }}</b>
              </span>.
            </p>
          </b-col>
          <b-col md="4" class="text-md-right">
            <b-btn v-b-toggle.controls-sidebar variant="success">Filter and customise display &raquo;</b-btn>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-sidebar id="controls-sidebar" title="Customise data" no-close-on-route-change right>
      <div class="px-3 py-2">
        <h4>Display as</h4>
        <b-form-radio-group
          class="displaySummaryControls mb-1"
          v-model="summary"
          :options="summaryDisplayOptions"
          buttons
          button-variant="outline-primary"
          size="sm"
          style="width:100%"
        ></b-form-radio-group>
        <hr />
        <h4>Summarise by</h4>
        <b-form-radio-group
          class="displaySummaryControls mb-1"
          v-model="_summaryType"
          :options="summaryTypeOptions"
          size="sm"
          stacked
        ></b-form-radio-group>
        <hr />
        <h4>Breakdown by</h4>
        <b-form-select
          class="displaySummaryControls mb-1"
          v-model="summaryLabel"
          :options="summaryLabelOptions"
          size="sm"
          ></b-form-select>
        <hr />
        <h4>Filters</h4>
        <b-form-group
          label="Reporting Organisation">
          <b-form-select
          v-model="organisation"
          :options="reportingOrgs"
          :state="organisation ? true : null"
          size="sm"></b-form-select>
        </b-form-group>
        <b-form-group
          label="Country">
          <b-form-select
          v-model="country"
          :options="countries"
          :state="country ? true : null"
          size="sm"></b-form-select>
        </b-form-group>
        <b-form-group
          label="Sector">
          <b-form-select
          v-model="sector"
          :options="sectors"
          :state="sector ? true : null"
          size="sm"></b-form-select>
        </b-form-group>
        <b-form-group
          label="Humanitarian / Development">
          <b-form-checkbox-group
            v-model="humanitarianDevelopment"
            :options="humanitarianDevelopmentOptions"
            size="sm"
            stacked
            switches
          ></b-form-checkbox-group>
        </b-form-group>
      </div>
    </b-sidebar>
  </div>
</template>
<style>
  .selection-text b, .filter-text b {
    border-bottom: 2px solid #eeeeee;
    cursor: pointer;
  }
</style>
<script>
export default {
  components: {
  },
  props: ["displaySummary", "summaryLabelField",
    "selectedCountry", "countries",
    "selectedReportingOrg", "reportingOrgs",
    "selectedSector", "sectors",
    "selectedHumanitarianDevelopment", "summaryType"],
  data() {
    return {
      summaryLabelOptions: [
        {'value': 'organisation', 'text': 'Reporting organisation'},
        {'value': 'country', 'text': 'Country'},
        {'value': 'sector', 'text': 'Sector'}
      ],
      summaryDisplayOptions: [
        {'value': 'chart', 'text': 'Chart'},
        {'value': 'table', 'text': 'Table'}
      ],
      summaryTypeOptions: [
        {'value': 'number_of_projects', 'text': 'Number of projects'},
        {'value': 'commitments', 'text': 'Commitments'},
        {'value': 'disbursements', 'text': 'Disbursements'}
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
    filterText() {
      var filters = []
      if (this.country != null) {
        filters.push({'text': 'in ', 'filter': this.countryText})
      }
      if (this.organisation != null) {
        filters.push({'text': 'reported by ', 'filter': this.organisationText})
      }
      if (this.sector != null) {
        filters.push({'text': 'in the sector ', 'filter': this.sectorText})
      }
      if (this.humanitarianDevelopment.length != 4) {
        filters.push({'text': 'classified as ', 'filter': this.humanitarianDevelopment.join(", ")})
      }
      if (filters.length == 0) { return null }
      return filters
    },
    countryText() {
      return this.countries.filter(option => {
        return option.value == this.country
      })[0].text
    },
    sectorText() {
      return this.sectors.filter(option => {
        return option.value == this.sector
      })[0].text
    },
    organisationText() {
      return this.reportingOrgs.filter(option => {
        return option.value == this.organisation
      })[0].text
    },
    summaryTypeText() {
      return this.summaryTypeOptions.filter(option => {
        return option.value == this.summaryType
      })[0].text.toLowerCase()
    },
    summaryLabelText() {
      return this.summaryLabelOptions.filter(option => {
        return option.value == this.summaryLabelField
      })[0].text.toLowerCase()
    },
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
    _summaryType: {
     // getter
      get: function () {
        return this.summaryType
      },
      // setter
      set: function (newValue) {
        this.$emit('update:summaryType', newValue)
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
    sector: {
     // getter
      get: function () {
        return this.selectedSector
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedSector', newValue)
      }
    },
  }
}
</script>