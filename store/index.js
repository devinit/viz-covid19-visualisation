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
    countries: {}
  },
  originalActivityData: []
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
  setCodelists(state, codelists) {
    Vue.set(state.codelists, 'countries', codelists)
  },
  setOriginalActivityData(state, activities) {
    state.originalActivityData = activities
  }
}

export const actions = {
}
