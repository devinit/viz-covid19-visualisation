import axios from 'axios'
import config from '../nuxt.config'

export const state = () => ({
  useCache: true,
  CORSAnywhere: "https://cors-anywhere.herokuapp.com/"
})

export const mutations = {
  toggleUseCache(state) {
    state.useCache = !(state.useCache)
  }
}

export const actions = {
}
