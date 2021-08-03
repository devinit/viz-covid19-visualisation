# Covid-19 visualisation

A simple visualisation using published FTS and IATI data on Covid-19.

Data is generated nightly by the [OCHA-DAP/covid19-data](https://github.com/OCHA-DAP/covid19-data) repository.

## Build Setup

``` bash
# install dependencies
$ npm i

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Generate a Github Pages static site and push to Github

```bash
$ npm run generate
$ npm run deploy
```

## Linting

Note that linting is enabled, and will automatically fix a number of issues in your code. However, sometimes this can feel a bit aggressive or annoying while you are working through something, so if you want to disable linting, you can comment out the 3 indicated lines in `nuxt.config.js`.

You can manage linting rules in `.eslintrc.js`. I disabled a few rules but you may have other preferences.

## Overview

There are four "tabs" in the visualisation: Contributions; Activities; Flows; About. Each of these tabs is accessible from the top navigation bar. The navigation bar is found in `default.vue`.

### Contributions (`pages/index.vue`)

The Contributions tab contains data from UNOCHA's FTS, and displays **components** in the following order:
* `SummaryPanes/HRP.vue`: a "thermometer" at the top (currently, showing the % of the COVID-19 HRP funded to date).
* `SummaryPanes/Controls/Contributions.vue`: a set of controls for determining what information gets displayed both in the Summary pane and in the list of contributions.
* `SummaryPanes/Contributions.vue`: a Summary pane containing a chart or table for the currently filtered information.
* `ActivityTable.vue`: a table containing the list of contributions.

### Activities (`pages/activities.vue`)

The Activities tab contains data from IATI, and displays **components** in the following order:
* `SummaryPanes/Controls/IATI.vue`: a set of controls for determining what information gets displayed both in the Summary pane and in the list of activities.
* `SummaryPanes/IATI.vue`: a Summary pane containing a chart or table for the currently filtered information.
* `ActivityTable.vue`: a table containing the list of IATI activities.

### Flows (`pages/flows.vue`)

The Flows tab contains data from IATI, and displays the following information (which could potentially be stored in separate components, but currently is just in the one file, because these elements are not re-used elsewhere).
* A summary table displaying commitments, disbursements and expenditure for all organisations in the selected **organisation type**.
* A Sankey chart (using the `Sankey.vue` component) for the selected **organisation**.
* A table containing the total disbursements and expenditures from the selected organisation to its implementing partners.
* A table containing incoming funds from the selected organisation's funders to this organisation.

### About (`pages/about.vue`)

The About tab contains a description and background of the visualisation. It describes data sources and provides some high-level technical details.

## Tooltips

Tooltips can be used throughout the site to provide more information where required.

* Currently, they are only enabled in `activities.vue`.
* Tooltips should be saved as a CSV file, with a unique `key` column and a `tooltip` column. You might want to namespace the `key` column (e.g. prefix all existing tooltips with `activities_table__`)
* Tooltips are loaded when `activities.vue` loads and stored in the Vuex store. This means they are available to all other parts of the visualisation through `this.$store.state.tooltips` - for the example below, the value of this is assigned to the computed property `tooltips`.
* You can add a tooltip wherever you want using something like the following code:
```
<b-badge
  v-b-tooltip.hover
  variant="secondary"
  pill
  :title="tooltips['theTooltipKey']">
  ?
</b-badge>
```

Tooltips are currently only loaded when `activities.vue` is loaded. You could easily make them load for other tabs too by adding relevant functionality within the `loadData()` method of each tab. Alternatively, you could consider moving this retrieval to the Vuex store and call it from within the [nuxtServerInit](https://nuxtjs.org/docs/2.x/directory-structure/store#the-nuxtserverinit-action) action, though this is a bit fiddly.


## Exporting content from Google Docs

To export content from Google Docs (e.g. for the About page), install the "Docs to Markdown" add on, then run the scripts/clean-markdown.py Python3 script on the output:

```
$ python3 clean-markdown.py < raw.md > pages/About.md
