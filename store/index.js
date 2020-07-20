import axios from 'axios'
import config from '../nuxt.config'
import Vue from 'vue'

export const state = () => ({
  useCache: false,
  IATISource: 'dportal',
  CORSAnywhere: "https://cors-anywhere.herokuapp.com/",
  contributions: [],
  planRequirements: 0,
  planFunded: 0,
  codelists: {
    countries: {},
    organisationTypes: {},
    sectors: {}
  },
  originalActivityData: [],
  originalActivityTransactionData: [],
  originalFlows: []
})

export const mutations = {
  toggleUseCache(state) {
    state.useCache = !(state.useCache)
  },
  setIATISource(state, source) {
    state.IATISource = source
  },
  setContributions(state, contributions) {
    state.contributions = contributions
  },
  setPlanRequirements(state, value) {
    state.planRequirements = value
  },
  setPlanFunded(state, value) {
    state.planFunded = value
  },
  setCodelistsCountry(state, codelists) {
    Vue.set(state.codelists, 'countries', codelists)
  },
  setCodelistsSector(state, codelists) {
    Vue.set(state.codelists, 'sectors', codelists)
  },
  setCodelistsOrganisationType(state, codelists) {
    Vue.set(state.codelists, 'organisationTypes', codelists)
  },
  setOriginalActivityData(state, activities) {
    state.originalActivityData = activities
  },
  setOriginalActivityTransactionData(state, activityTransactions) {
    state.originalActivityTransactionData = activityTransactions
  },
  setOriginalFlows(state, flows) {
    state.originalFlows = flows
  }
}

export const actions = {
}
