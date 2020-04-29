<template>
  <div class="container-fluid" style="margin-top: 20px;">
    <div>
      <h2>About</h2>
      <p>We are faced today with an unprecedented crisis that has devastating health, economic and social effects which are being felt around the world. The response from the international community to the COVID-19 pandemic has been extraordinary and vast: different appeals have been launched, substantial financing is being provided, and projects are being implemented. All of this calls for greater data-driven transparency of humanitarian and development financing and activities. We as an international community need to better track this information to enable a more coordinated and effective response towards affected populations.</p>
      <p>This new COVID-19 tracking prototype has been developed through the <nuxt-link to="https://interagencystandingcommittee.org/greater-transparency">Grand Bargain Transparency Workstream</nuxt-link> to visualize the response to COVID-19 as a pathway towards more comprehensive tracking, including what activities are being financed in affected countries. This visualisation is initially based on FTS and IATI data and will be updated daily as new data becomes available through each source.</p>
      <h2>Data</h2>
      <p>The visualisation contains data on <nuxt-link :to="{name: 'index'}">contributions</nuxt-link>, demonstrating international resource mobilisation efforts, and <nuxt-link :to="{name: 'activities'}">activities</nuxt-link> (generally speaking, projects), containing more detailed information that could be useful in analysing the country-level response. The contributions data comes from UNOCHA's <a href="http://fts.unocha.org/">Financial Tracking Service (FTS)</a>. The activity level data comes from the <a href="http://iatistandard.org">International Aid Transparency Initiative (IATI)</a>.</p>
      <p>The contributions page is most useful for understanding total aggregate funding, and the activities page most useful for understanding how funding is broken down by project.</p>
      <b-alert variant="secondary" show>The two datasets cannot easily be compared, particularly due to the different coverage of the two data sources. UNOCHA FTS data contains data on humanitarian contributions as reported to FTS. IATI has a broader coverage of activity (or project) level data, but the availability and quality of data will vary depending on what data each organisation has published.</b-alert>
      <h4>Contributions</h4>
      <p>The contributions page contains a summary of total funding to date against the <a href="https://fts.unocha.org/appeals/952/summary">COVID-19 Humanitarian Response Plan</a>. This page also contains an aggregation and detailed breakdown of funding against the <a href="https://fts.unocha.org/emergencies/911/summary/2020">COVID-19 Emergency</a>.</p>
      <b-alert variant="secondary" show>Note: funding to the emergency will generally contain a significantly broader selection of contributions compared with funding to the plan. For this reason, the total amount of funding under the plan should not be compared with the total amount of funding under the emergency.</b-alert>
      <p>The visualisation does not contain any double-counting; though it does currently contain funding at different stages of the process. The dataset contains pledges, commitments, and paid contributions (see the status column in the detailed data). The status of an individual contribution is updated as it progresses through these stages.</p>
      <p>The contributions data is extracted from the <a href="https://fts.unocha.org/content/fts-public-api">FTS Flow API</a>.</p>
      <h4>Activities</h4>
      <p>The activities page lists activities that various organisations are involved in. "Activity" can have multiple meanings, depending on the publication of the respective organisation. Often, it is synonymous with a "project", but it can also contain country-wide programs, budget support, or contributions to other organisations.</p>
      <p>The activities page will contain double-counting, as activities will be reported by multiple organisations throughout the delivery chain of the same overarching project. There are mechanisms in IATI to avoid double counting (by stating where the funds have come from), generally called "traceability". However, implementation of these mechanisms will vary between publishers. While there is greater traceability between the UK's Department for International Development and the Dutch Ministry of Foreign Affairs and their respective implementing partners, traceability is not yet widespread for flows between large organisations. For more information on how Grand Bargain signatories are publishing their data, see the <a href="https://humportal.org">IATI Humanitarian Data Portal</a>.</p>
      <p>The activity data is extracted from the <a href="https://iatidatastore.iatistandard.org">IATI Datastore API</a>.</p>

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
