<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand :to="'/'">Covid-19 Response</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{name: 'index'}" exact-active-class="active">
            Contributions
          </b-nav-item>
          <b-nav-item :to="{name: 'activities'}" active-class="active">
            Activities
          </b-nav-item>
          <b-nav-item :to="{name: 'flows'}" active-class="active">
            Flows
          </b-nav-item>
          <b-nav-item :to="{name: 'about'}" active-class="active">
            About
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container>
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
  data() {
    return {
      title: config.head.title
    }
  }
}
</script>