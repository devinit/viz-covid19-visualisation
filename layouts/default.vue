<template>
  <div>
    <b-alert show dismissible variant="warning" class="mb-0 text-center">
      This visualisation is no longer updated or maintained. OCHA's Centre for Humanitarian Data
      has developed a new IATI COVID-19 Funding Dashboard.
      <b-btn href="https://data.humdata.org/viz-iati-c19-dashboard/" size="sm" variant="warning">
        Visit the IATI COVID-19 Funding Dashboard
      </b-btn>
    </b-alert>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand :to="'/'">
        Covid-19 Response
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'index'}" exact-active-class="active" no-prefetch>
            Contributions
          </b-nav-item>
          <b-nav-item :to="{name: 'activities'}" active-class="active" no-prefetch>
            Activities
          </b-nav-item>
          <b-nav-item :to="{name: 'flows'}" active-class="active" no-prefetch>
            Flows
          </b-nav-item>
          <b-nav-item :to="{name: 'about'}" active-class="active" no-prefetch>
            About
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container class="mt-4">
      <nuxt />
    </b-container>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.nuxt-progress {
  background-color: #666;
}
.settings {
  width:300px;
}
.displaySummaryControls label {
  cursor: pointer;
}
.number-value {
  text-align: right;
}
</style>

<script>
import config from '../nuxt.config'
export default {
  components: {
  },
  data () {
    return {
      title: config.head.title
    }
  }
}
</script>
