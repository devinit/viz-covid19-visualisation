<template>
  <div>
    <h2>About</h2>
    <p>Today we are facing an unprecedented crisis with devastating health, economic and social effects which are being felt around the world. The response from the international community to the Covid-19 pandemic has been extraordinary and vast: different appeals have been launched, substantial financing is being provided, and projects are being implemented. All of this calls for greater data-driven transparency of humanitarian and development financing and activities. We as an international community need to better track this information to enable a more coordinated and effective response towards affected populations.</p>
    <p>This new Covid-19 tracking prototype has been developed through the <a href="https://interagencystandingcommittee.org/greater-transparency">Grand Bargain transparency workstream</a> to visualise the response to Covid-19 as a pathway towards more comprehensive tracking, including what activities are being financed in affected countries. This visualisation is initially based on the UN Office for the Coordination of Humanitarian Affairs (UNOCHA)'s <a href="https://fts.unocha.org/">Financial Tracking Service</a> (FTS) and <a href="https://iatistandard.org/en/">International Aid Transparency Initiative (IATI)</a> data and will be updated daily as new data becomes available through each source.</p>
    <hr>
    <h2>Data</h2>
    <p>
      The visualisation contains data on <nuxt-link :to="{name: 'index'}" no-prefetch>contributions</nuxt-link>,
      demonstrating international resource mobilisation efforts, and <nuxt-link :to="{name: 'activities'}" no-prefetch>activities</nuxt-link>
      (generally speaking, projects), containing more detailed information that could be useful in analysing the country-level response. The contributions data comes from UNOCHA's FTS. The activity level data comes from IATI.
    </p>
    <p>The contributions page is most useful for understanding total aggregate funding, and the activities page most useful for understanding how funding is broken down by project.</p>
    <b-alert variant="secondary" show>
      The two datasets cannot easily be compared, particularly due to the different coverage of the two data sources. UNOCHA FTS contains data on humanitarian contributions as reported to FTS. IATI contains activity (or project) level data on humanitarian and development activities, but the availability and quality of data will vary depending on what data each organisation has published.
    </b-alert>
    <h4>Contributions</h4>
    <p>The contributions page contains a summary of total funding to date against the <a href="https://fts.unocha.org/appeals/952/summary">Covid-19 Global Humanitarian Response Plan</a>. This page also contains an aggregation and detailed breakdown of funding against the <a href="https://fts.unocha.org/emergencies/911/summary/2020">Covid-19 emergency</a>.</p>
    <b-alert variant="secondary" show>
      Note: Funding to the emergency will generally contain a significantly broader selection of contributions than funding to the plan. For this reason, the total amount of funding under the plan should not be compared with the total amount of funding under the emergency.
    </b-alert>
    <p>The visualisation does not contain any double-counting, though it does currently contain funding at different stages of the process. The dataset contains pledges, commitments, and paid contributions (see the status column in the detailed data). The status of an individual contribution is updated as it progresses through these stages.</p>
    <p>The contributions data is extracted from the <a href="https://fts.unocha.org/content/fts-public-api">FTS Public API</a>.</p>
    <h4>Activities</h4>
    <p>The activities page lists activities that various organisations are involved in. 'Activity' can have multiple meanings, depending on the business processes of the respective organisation. Often, it is synonymous with a 'project', but it can also contain country-wide programmes, budget support, or contributions to other organisations.</p>
    <p>The activities page will contain double-counting, as activities will be reported by multiple organisations throughout the delivery chain of the same overarching project. There are mechanisms in IATI to avoid double counting (by stating where the funds have come from), generally called 'traceability'. However, implementation of these mechanisms will vary between publishers. While there is greater traceability between the UK's Department for International Development and the Dutch Ministry of Foreign Affairs and their respective implementing partners, traceability is not yet widespread for flows between large organisations. For more information on how Grand Bargain signatories are publishing their data, see the <a href="https://humportal.org">IATI Humanitarian Data Portal</a>.</p>
    <h5>Selection of COVID-19 activities from IATI data</h5>
    Only COVID-19 activities are captured and displayed in the visualisation and the underlying data. IATI ativities are marked as COVID-19 related (and therefore included) if they meet <b>any</b> of the following criteria (largely following the <a href="https://iatistandard.org/en/guidance/standard-guidance/covid-19/">IATI COVID-19 publishing guidance</a>):
    <ul>
      <li>title, description, or any transaction description contains the text "COVID-19" or "COVID 19"</li>
      <li><code>humanitarian-scope</code> matches the GLIDE code "EP-2020-000012-001" (this is the GLIDE code that IATI uses for the COVID-19 emergency)</li>
      <li><code>humanitarian-scope</code> matches the Humanitarian Response Plan code "HCOVD20"</li>
      <li><code>tag/@code</code> "COVID-19"</li>
    </ul>
    <b-alert variant="info" show>
      More detailed data notes, and a number of data files behind this visualisation, are available from <a href="https://github.com/OCHA-DAP/covid19-data/tree/gh-pages">the <code>covid19-data</code> github repository</a>. The data files are automatically updated every 24 hours.
    </b-alert>
    <p>The activity data is extracted from the <a href="https://d-portal.org">d-portal API</a> using the above criteria.</p>
    <h4>Flows</h4>
    <p>The flows page contains the same selection of activities as the activities page. Data is filtered to a particular organisation type (e.g. government, multilateral, NGO), which is initially set to "Government" but can be changed by the user at the top of the page.</p>
    <p>The topmost table shows a summary of data by disbursements and direct expenditure. This should help to identify any coding issues &ndash; for example: where an organisation has stated that 100% of their spending is direct expenditure, but this is known not to be the case.</p>
    <p>Below the table is a visualisation of flows for each publishing organisation. The specific organisation can be selected from the drop-down list (this drop-down shows only publishers for the selected organisation type, which can be changed at the top of the page).</p>
    <p>The visualisation can be customised by:</p>
    <ul>
      <li>toggling the display of incoming funds (i.e. funds <b>received</b> by this publishing organisation): this generally only changes the display for NGOs and some multilaterals</li>
      <li>including data from partner organisations: this will include data reported by implementing partners of the selected publishing organisation. Note that this may lead to double-counting if both the publisher and one of their implementing partners are providing data on the same funding at different points in the chain.</li>
    </ul>
    <p>The tables below the visualisation show the same data as the visualisation, but in tabular format. They also contain more detail as the visualisation is limited to displaying the top 10 largest entries.</p>
    <hr>
    <h2>Technical details</h2>
    <p>The front end of the prototype is built in Vue.JS and hosted as a static site on Github pages. The data is extracted from the FTS and D-Portal APIs, and reprocessed and condensed daily, using scripts written in Python and run on Travis.</p>
    <p>All of the tools we have developed are shared as open source software:</p>
    <ul>
      <li><a href="https://github.com/OCHA-DAP/viz-covid19-visualisation">The front end (in Vue.JS)</a></li>
      <li><a href="https://github.com/OCHA-DAP/covid19-data">The data processing scripts (in Python)</a></li>
      <li><a href="https://github.com/OCHA-DAP/covid19-data/tree/gh-pages">The reprocessed data (automatically generated every 24 hours</a>)</li>
    </ul>
    <hr>
    <h2>Privacy Policy and Cookies</h2>
    <p>
      View <a href="/Privacy-Policy.pdf">our privacy policy and cookies policy</a>. If you have any further
      questions, please get in touch with us via <a href="mailto:humportal@devinit.org">humportal@devinit.org</a>.
    </p>
    <hr>
    <b-row class="logos-section">
      <b-col>
        <a href="http://devinit.org/" target="_blank"><img src="~/assets/logos/devinit.png" width="100%" height="auto" alt="Development Initiatives Logo"></a>
      </b-col>
      <b-col>
        <a href="https://www.government.nl/ministries/ministry-of-foreign-affairs" target="_blank"><img src="~/assets/logos/netherlands.png" width="100%" height="auto" alt="Dutch Ministry of Foreign Affairs Logo"></a>
      </b-col>
      <b-col>
        <a href="https://www.worldbank.org/" target="_blank"><img src="~/assets/logos/worldbank.png" width="100%" height="auto" alt="World Bank Group Logo"></a>
      </b-col>
      <b-col>
        <a href="https://iatistandard.org" target="_blank"><img src="~/assets/logos/iati.svg" width="100%" height="auto" alt="Powered by IATI data"></a>
      </b-col>
      <b-col>
        <a href="https://fts.unocha.org/" target="_blank"><img src="~/assets/logos/fts.png" width="100%" height="auto" alt="UNOCHA FTS Logo"></img></a>
      </b-col>
    </b-row>
  </div>
</template>
<style>
.logos-section {
  padding: 25px 15px;
  background-color: #007bff;
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

<style>
</style>
