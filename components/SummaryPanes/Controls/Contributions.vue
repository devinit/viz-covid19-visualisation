<template>
  <div>
    <b-row>
      <b-col>
        <h3>Summary</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="6">
        <b-form inline>
          <b-form-group>
            <b-form-radio-group
              v-model="summary"
              :options="summaryDisplayOptions"
              class="displaySummaryControls mb-1"
              buttons
              button-variant="outline-primary"
            />
            <b-form-radio-group
              v-model="summaryLabel"
              :options="summaryLabelOptions"
              class="displaySummaryControls mb-1"
              buttons
              button-variant="outline-secondary"
            />
          </b-form-group>
        </b-form>
      </b-col>
      <b-col lg="6" class="ml-lg-auto text-lg-right">
        <b-form inline>
          <b-form-group class="ml-lg-auto">
            <b-form-select
              v-model="theFundingOrganisation"
              :options="fundingOrganisations"
              :state="theFundingOrganisation ? true : null"
              class="mb-1"
              style="max-width: 200px" />
            <b-form-select
              v-model="theImplementingOrganisation"
              :options="implementingOrganisations"
              :state="theImplementingOrganisation ? true : null"
              class="mb-1"
              style="max-width: 200px" />
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
  props: ['displaySummary', 'summaryLabelField',
    'implementingOrganisation', 'implementingOrganisations',
    'fundingOrganisation', 'fundingOrganisations'],
  data () {
    return {
      summaryLabelOptions: [
        { 'value': 'fundingOrganisation', 'text': 'Funder' },
        { 'value': 'implementingOrganisation', 'text': 'Implementer' }
      ],
      summaryDisplayOptions: [
        { 'value': 'chart', 'text': 'Chart' },
        { 'value': 'table', 'text': 'Table' }
      ]
    }
  },
  computed: {
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
    theImplementingOrganisation: {
      // getter
      get () {
        return this.implementingOrganisation
      },
      // setter
      set (newValue) {
        this.$emit('update:implementingOrganisation', newValue)
      }
    },
    theFundingOrganisation: {
      // getter
      get () {
        return this.fundingOrganisation
      },
      // setter
      set (newValue) {
        this.$emit('update:fundingOrganisation', newValue)
      }
    }
  }
}
</script>
