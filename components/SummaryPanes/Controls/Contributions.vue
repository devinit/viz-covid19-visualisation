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
            v-model="theFundingOrganisation"
            :options="fundingOrganisations"
            :state="theFundingOrganisation ? true : null"
            style="max-width: 250px"></b-form-select>
            <b-form-select
            v-model="theImplementingOrganisation"
            :options="implementingOrganisations"
            :state="theImplementingOrganisation ? true : null"
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
    "implementingOrganisation", "implementingOrganisations",
    "fundingOrganisation", "fundingOrganisations"],
  data() {
    return {
      summaryLabelOptions: [
        {'value': 'fundingOrganisation', 'text': 'Funder'},
        {'value': 'implementingOrganisation', 'text': 'Implementer'}
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
    theImplementingOrganisation: {
     // getter
      get: function () {
        return this.implementingOrganisation
      },
      // setter
      set: function (newValue) {
        this.$emit('update:implementingOrganisation', newValue)
      }
    },
    theFundingOrganisation: {
     // getter
      get: function () {
        return this.fundingOrganisation
      },
      // setter
      set: function (newValue) {
        this.$emit('update:fundingOrganisation', newValue)
      }
    },
  }
}
</script>