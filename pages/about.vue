<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <h2>About</h2>
      <p>Today we are facing an unprecedented crisis with devastating health, economic and social effects which are being felt around the world. The response from the international community to the Covid-19 pandemic has been extraordinary and vast: different appeals have been launched, substantial financing is being provided, and projects are being implemented. All of this calls for greater data-driven transparency of humanitarian and development financing and activities. We as an international community need to better track this information to enable a more coordinated and effective response towards affected populations.</p>
      <p>This new Covid-19 tracking prototype has been developed through the <a href="https://interagencystandingcommittee.org/greater-transparency">Grand Bargain transparency workstream</a> to visualise the response to Covid-19 as a pathway towards more comprehensive tracking, including what activities are being financed in affected countries. This visualisation is initially based on the UN Office for the Coordination of Humanitarian Affairs (UNOCHA)'s <a href="https://fts.unocha.org/">Financial Tracking Service</a> (FTS) and <a href="https://iatistandard.org/en/">International Aid Transparency Initiative (IATI)</a> data and will be updated daily as new data becomes available through each source.</p>
      <h2>Data</h2>
      <p>The visualisation contains data on <nuxt-link :to="{name: 'index'}">contributions</nuxt-link>, demonstrating international resource mobilisation efforts, and <nuxt-link :to="{name: 'activities'}">activities</nuxt-link> (generally speaking, projects), containing more detailed information that could be useful in analysing the country-level response. The contributions data comes from UNOCHA's FTS. The activity level data comes from IATI.</p>
      <p>The contributions page is most useful for understanding total aggregate funding, and the activities page most useful for understanding how funding is broken down by project.</p>
      <b-alert variant="secondary" show>The two datasets cannot easily be compared, particularly due to the different coverage of the two data sources. UNOCHA FTS contains data on humanitarian contributions as reported to FTS. IATI contains activity (or project) level data on humanitarian and development activities, but the availability and quality of data will vary depending on what data each organisation has published.</b-alert>
      <h4>Contributions</h4>
      <p>The contributions page contains a summary of total funding to date against the <a href="https://fts.unocha.org/appeals/952/summary">Covid-19 Global Humanitarian Response Plan</a>. This page also contains an aggregation and detailed breakdown of funding against the <a href="https://fts.unocha.org/emergencies/911/summary/2020">Covid-19 emergency</a>.</p>
      <b-alert variant="secondary" show>Note: Funding to the emergency will generally contain a significantly broader selection of contributions than funding to the plan. For this reason, the total amount of funding under the plan should not be compared with the total amount of funding under the emergency.</b-alert>
      <p>The visualisation does not contain any double-counting, though it does currently contain funding at different stages of the process. The dataset contains pledges, commitments, and paid contributions (see the status column in the detailed data). The status of an individual contribution is updated as it progresses through these stages.</p>
      <p>The contributions data is extracted from the <a href="https://fts.unocha.org/content/fts-public-api">FTS Public API</a>.</p>
      <h4>Activities</h4>
      <p>The activities page lists activities that various organisations are involved in. 'Activity' can have multiple meanings, depending on the business processes of the respective organisation. Often, it is synonymous with a 'project', but it can also contain country-wide programmes, budget support, or contributions to other organisations.</p>
      <p>The activities page will contain double-counting, as activities will be reported by multiple organisations throughout the delivery chain of the same overarching project. There are mechanisms in IATI to avoid double counting (by stating where the funds have come from), generally called 'traceability'. However, implementation of these mechanisms will vary between publishers. While there is greater traceability between the UK's Department for International Development and the Dutch Ministry of Foreign Affairs and their respective implementing partners, traceability is not yet widespread for flows between large organisations. For more information on how Grand Bargain signatories are publishing their data, see the <a href="https://humportal.org">IATI Humanitarian Data Portal</a>.</p>
      <p>The activity data is extracted from the <a href="https://d-portal.org">d-portal API</a>.</p>
      <h2>Privacy Policy and Cookies</h2>
      <p>View <a href="/Privacy-Policy.pdf">our privacy policy and cookies policy</a>. If you have any further
        questions, please get in touch with us via <a href="mailto:humportal@devinit.org">humportal@devinit.org</a>.</p>
    </div>
  </div>
</template>
<style>
</style>
<script>
import config from '../nuxt.config'
export default {
  components: {
  },
  data() {
    return {
      title: config.head.title,
      description: config.description
    }
  }
}
</script>

<style>
</style>
