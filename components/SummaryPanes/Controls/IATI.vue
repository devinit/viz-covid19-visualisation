<template>
  <div>
    <b-row>
      <b-col>
        <h3>Summary</h3>
        <b-row class="mb-1">
          <b-col md="8">
            <p class="lead selection-text">
              Showing a <b v-b-toggle.controls-sidebar>{{ displaySummary }}</b> of
              <b v-b-toggle.controls-sidebar>{{ summaryTypeText }}</b> by
              <b v-b-toggle.controls-sidebar>{{ summaryLabelText }}</b>.
            </p>
          </b-col>
          <b-col md="4" class="text-md-right">
            <b-btn v-b-toggle.controls-sidebar variant="success">
              Filter and customise display &raquo;
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p v-if="filterText" class="filter-text">
              Filtered to activities
              <span v-for="filter in filterText">
                {{ filter.text }} <b v-b-toggle.controls-sidebar>{{ filter.filter }}</b>
              </span>.
            </p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-sidebar
      id="controls-sidebar"
      title="Customise data"
      no-close-on-route-change
      width="500px"
      right>
      <div class="px-3 py-2">
        <h4>Display as</h4>
        <b-form-radio-group
          v-model="summary"
          :options="summaryDisplayOptions"
          class="displaySummaryControls mb-1"
          buttons
          button-variant="outline-primary"
          size="sm"
          style="width:100%"
        />
        <hr>
        <h4>Summarise by</h4>
        <b-form-radio-group
          v-model="_summaryType"
          :options="summaryTypeOptions"
          class="displaySummaryControls mb-1"
          size="sm"
          stacked
        />
        <hr>
        <h4>Breakdown by</h4>
        <b-form-select
          v-model="summaryLabel"
          :options="summaryLabelOptions"
          class="displaySummaryControls mb-1"
          size="sm"
        />
        <hr>
        <b-row>
          <b-col>
            <h4>Filters</h4>
          </b-col>
          <b-col v-if="filterText" class="text-right">
            <b-btn @click="resetFilters" variant="danger" size="sm">
              Reset
            </b-btn>
          </b-col>
        </b-row>
        <b-form-group
          :state="organisation.length > 0 ? true : null"
          label="Reporting Organisation">
          <v-select
            v-model="organisation"
            :options="reportingOrgs"
            :getOptionKey="option => option.value"
            :getOptionLabel="option => option.text"
            :reduce="option => option.value"
            label="text"
            placeholder="All organisations"
            multiple
          />
        </b-form-group>
        <b-form-group
          :state="country.length > 0 ? true : null"
          label="Country">
          <v-select
            :options="countries"
            :getOptionKey="option => option.value"
            :getOptionLabel="option => option.text"
            :reduce="option => option.value"
            v-model="country"
            label="text"
            placeholder="All countries"
            multiple />
        </b-form-group>
        <b-form-group
          :state="sector.length > 0 ? true : null"
          label="Sector">
          <v-select
            v-model="sector"
            :options="sectors"
            :getOptionKey="option => option.value"
            :getOptionLabel="option => option.text"
            :reduce="option => option.value"
            label="text"
            placeholder="All sectors"
            multiple />
        </b-form-group>
        <b-form-group
          label="Humanitarian / Development">
          <b-form-checkbox-group
            v-model="humanitarianDevelopment"
            :options="humanitarianDevelopmentOptions"
            size="sm"
            stacked
            switches
          />
        </b-form-group>
        <b-form-group
          label="IATI COVID-19 Publishing Guidance"
          description="Select activities based on which part(s) of the IATI COVID-19 Publishing Guidance they use.">
          <b-form-checkbox-group
            v-model="COVIDMatches"
            :options="COVIDMatchesOptions"
            size="sm"
            stacked
            switches
          />
        </b-form-group>
        <hr>
        <h5>Select countries based on <a href="https://unstats.un.org/unsd/methodology/m49/">UN classifications</a></h5>
        <b-form-group
          label="Least developed countries"
          class="mb-1"
        >
          <b-btn @click="selectCountries('leastDeveloped', true)" size="sm" variant="outline-secondary">
            Include
          </b-btn>
          <b-btn @click="selectCountries('leastDeveloped', false)" size="sm" variant="outline-secondary">
            Exclude
          </b-btn>
        </b-form-group>
        <b-form-group
          label="Land locked developing countries"
          class="mb-1"
        >
          <b-btn @click="selectCountries('landLockedDeveloping', true)" size="sm" variant="outline-secondary">
            Include
          </b-btn>
          <b-btn @click="selectCountries('landLockedDeveloping', false)" size="sm" variant="outline-secondary">
            Exclude
          </b-btn>
        </b-form-group>
        <b-form-group
          label="Small island developing states"
          class="mb-1"
        >
          <b-btn @click="selectCountries('smallIslandDeveloping', true)" size="sm" variant="outline-secondary">
            Include
          </b-btn>
          <b-btn @click="selectCountries('smallIslandDeveloping', false)" size="sm" variant="outline-secondary">
            Exclude
          </b-btn>
        </b-form-group>
        <b-form-group
          label="Developed or developing"
        >
          <b-btn @click="selectCountries('developed', true)" size="sm" variant="outline-secondary">
            Developed
          </b-btn>
          <b-btn @click="selectCountries('developing', true)" size="sm" variant="outline-secondary">
            Developing
          </b-btn>
        </b-form-group>
        <h5>Select reporting organisations based on type</h5>
        <b-select
          :options="organisationType"
          v-model="selectedOrganisationType"
          class="mb-2" />
      </div>
    </b-sidebar>
  </div>
</template>
<style>
  .selection-text b, .filter-text b {
    border-bottom: 2px solid #eeeeee;
    cursor: pointer;
  }
  .is-valid .vs__dropdown-toggle {
    border-color: #28a745;
  }
</style>
<script>
export default {
  components: {
  },
  props: ['displaySummary', 'summaryLabelField',
    'selectedCountry', 'countries',
    'selectedReportingOrg', 'reportingOrgs',
    'selectedSector', 'sectors',
    'selectedHumanitarianDevelopment', 'summaryType',
    'm49Codelists', 'activityUsedCodelists',
    'selectedCOVIDMatches'],
  data () {
    return {
      summaryLabelOptions: [
        { 'value': 'organisation', 'text': 'Reporting organisation' },
        { 'value': 'country', 'text': 'Country' },
        { 'value': 'sector', 'text': 'Sector' }
      ],
      summaryDisplayOptions: [
        { 'value': 'chart', 'text': 'Chart' },
        { 'value': 'table', 'text': 'Table' }
      ],
      summaryTypeOptions: [
        { 'value': 'number_of_projects', 'text': 'Number of projects' },
        { 'value': 'commitments', 'text': 'Commitments' },
        { 'value': 'disbursements', 'text': 'Disbursements' }
      ],
      humanitarianDevelopmentOptions: [
        { 'value': 'humanitarian', 'text': 'Humanitarian' },
        { 'value': 'humanitarian / development', 'text': 'Humanitarian / Development' },
        { 'value': 'development', 'text': 'Development' },
        { 'value': 'unspecified', 'text': 'Unspecified' }
      ],
      selectedOrganisationType: null,
      organisationType: [
        { value: null, text: 'Select one...' },
        { value: '10', text: 'Government' },
        { value: '15', text: 'Other Public Sector' },
        { value: '21', text: 'International NGO' },
        { value: '22', text: 'National NGO' },
        { value: '30', text: 'Public Private Partnership' },
        { value: '40', text: 'Multilateral' },
        { value: '60', text: 'Foundation' },
        { value: '70', text: 'Private Sector' },
        { value: '80', text: 'Academic, Training and Research' },
        { value: '90', text: 'Other' }
      ],
      COVIDMatchesOptions: [
        { 'value': 'title', 'text': 'Activity Title' },
        { 'value': 'description', 'text': 'Activity Description' },
        { 'value': 'GLIDE', 'text': 'GLIDE Code' },
        { 'value': 'HRP', 'text': 'HRP Code' },
        { 'value': 'tag', 'text': 'Tag' },
        { 'value': 'transaction-description', 'text': 'Transaction Description' }
      ]
    }
  },
  computed: {
    filterText () {
      const filters = []
      if (this.country.length > 0) {
        filters.push({ 'text': 'in ', 'filter': this.countryText })
      }
      if (this.organisation.length > 0) {
        filters.push({ 'text': 'reported by ', 'filter': this.organisationText })
      }
      if (this.sector.length > 0) {
        filters.push({ 'text': 'in the sector ', 'filter': this.sectorText })
      }
      if (this.humanitarianDevelopment.length !== 4) {
        filters.push({ 'text': 'classified as ', 'filter': this.humanitarianDevelopment.join(', ') })
      }
      if (this.COVIDMatches.length !== 6) {
        filters.push({ 'text': 'matching IATI Publishing Guidance by ', 'filter': this.COVIDMatchesText.join(', ') })
      }
      if (filters.length === 0) { return null }
      return filters
    },
    countryText () {
      return this.countries.filter((option) => {
        return this.country.includes(option.value)
      }).map((country) => { return country.text }
      ).join(', ')
    },
    sectorText () {
      return this.sectors.filter((option) => {
        return this.sector.includes(option.value)
      }).map((sector) => { return sector.text }
      ).join(', ')
    },
    organisationText () {
      return this.reportingOrgs.filter((option) => {
        return this.organisation.includes(option.value)
      }).map((organisation) => { return organisation.text }
      ).join(', ')
    },
    summaryTypeText () {
      return this.summaryTypeOptions.filter((option) => {
        return option.value === this.summaryType
      })[0].text.toLowerCase()
    },
    summaryLabelText () {
      return this.summaryLabelOptions.filter((option) => {
        return option.value === this.summaryLabelField
      })[0].text.toLowerCase()
    },
    COVIDMatchesText () {
      return this.COVIDMatchesOptions.filter((option) => {
        return this.COVIDMatches.includes(option.value)
      }).map((option) => {
        return option.text
      })
    },
    COVIDMatches: {
      // getter
      get () {
        return this.selectedCOVIDMatches
      },
      // setter
      set (newValue) {
        this.$emit('update:selectedCOVIDMatches', newValue)
      }
    },
    humanitarianDevelopment: {
      // getter
      get () {
        return this.selectedHumanitarianDevelopment
      },
      // setter
      set (newValue) {
        this.$emit('update:selectedHumanitarianDevelopment', newValue)
      }
    },
    _summaryType: {
      // getter
      get () {
        return this.summaryType
      },
      // setter
      set (newValue) {
        this.$emit('update:summaryType', newValue)
      }
    },
    summary: {
      // getter
      get () {
        return this.displaySummary
      },
      // setter
      set (newValue) {
        this.$emit('update:displaySummary', newValue)
      }
    },
    summaryLabel: {
      // getter
      get () {
        return this.summaryLabelField
      },
      // setter
      set (newValue) {
        this.$emit('update:summaryLabelField', newValue)
      }
    },
    organisation: {
      // getter
      get () {
        return this.selectedReportingOrg
      },
      // setter
      set (newValue) {
        this.$emit('update:selectedReportingOrg', newValue)
      }
    },
    country: {
      // getter
      get () {
        return this.selectedCountry
      },
      // setter
      set (newValue) {
        this.$emit('update:selectedCountry', newValue)
      }
    },
    sector: {
      // getter
      get () {
        return this.selectedSector
      },
      // setter
      set (newValue) {
        this.$emit('update:selectedSector', newValue)
      }
    }
  },
  watch: {
    selectedOrganisationType (newOrgType) {
      if (newOrgType != null) {
        const organisationsTypes = this.activityUsedCodelists.reportingOrgTypes[newOrgType].filter((org) => {
          return org != null
        })
        this.organisation = organisationsTypes || []
      }
    }
  },
  methods: {
    selectCountries (m49List, requiredValue) {
      this.country = this.countries.filter((country) => {
        if (country.text.includes('regional')) { return false }
        if (country.value == null) { return false }
        return this.m49Codelists[m49List].includes(country.value) === requiredValue
      }).map((country) => { return country.value })
    },
    resetFilters () {
      this.country = []
      this.organisation = []
      this.sector = []
      this.selectedOrganisationType = null
    }
  }
}
</script>
