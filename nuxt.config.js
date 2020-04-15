const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/visualisation/'
  }
} : {}
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'COVID-19 Response Visualisation',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "A simple (unofficial) visualisation of COVID-19 response data." },
      /*
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@mark_brough' },
      { name: 'twitter:title', content: 'COVID-19 Response Visualisation' },
      { name: 'twitter:description', content: "A simple (unofficial) visualisation of COVID-19 response data" },
      { name: 'twitter:image', content: 'http://brough.io/pwyf-visualisation/visualisation.jpeg' },
      { name: 'twitter:image:alt', content: 'Detailed expenditure data from 2009' }
      */
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  ...routerBase
}
