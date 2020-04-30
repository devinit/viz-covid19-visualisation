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
      { hid: 'description', name: 'description', content: "A prototype visualisation to track the COVID-19 response." },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@devinit' },
      { name: 'twitter:title', content: 'COVID-19 Response Visualisation' },
      { name: 'twitter:description', content: "A prototype visualisation to track the COVID-19 response" },
      { name: 'twitter:image', content: 'https://covid19.humportal.org/visualisation.png' },
      { name: 'twitter:image:alt', content: 'Coontributions to the COVID-19 emergency.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff', height: '5px' },
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
  }
}
