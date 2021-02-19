<!-----
NEW: Check the "Suppress top comment" option to remove this info from the output.

Conversion time: 1.218 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β29
* Fri Feb 19 2021 06:54:30 GMT-0800 (PST)
* Source doc: About page content - USAID C19 viz
----->



## **About**

Today we are facing an unprecedented crisis with devastating health, economic and social effects which are being felt around the world. The response from the international community to the Covid-19 pandemic has been extraordinary and vast: different appeals have been launched, substantial financing is being provided, and projects are being implemented. All of this calls for greater data-driven transparency of humanitarian and development financing and activities. We as an international community need to better track this information to enable a more coordinated and effective response towards affected populations.

This new Covid-19 tracking prototype has been developed through the[ Grand Bargain transparency workstream](https://interagencystandingcommittee.org/greater-transparency) to visualise the response to Covid-19 as a pathway towards more comprehensive tracking, including what activities are being financed in affected countries. This visualisation is based on the United Nations Office for the Coordination of Humanitarian Affairs (OCHA)'s[ Financial Tracking Service](https://fts.unocha.org/) (FTS) and[ International Aid Transparency Initiative](https://iatistandard.org) (IATI) data and will be updated daily as new data becomes available through each source.

(Jump to[ Frequently-asked questions](https://covid19.humportal.org/about#faq).)


### **Data**

The visualisation contains data on[ contributions](https://covid19.humportal.org/), demonstrating international resource mobilisation efforts, and[ activities](https://covid19.humportal.org/activities) (generally speaking, projects), containing more detailed information that could be useful in analysing the country-level response. The contributions data comes from OCHA's FTS. The activity level data comes from IATI.

The contributions page is most useful for understanding total aggregate funding, and the activities page most useful for understanding how funding is broken down by project.

The two datasets cannot easily be compared, particularly due to the different coverage of the two data sources. OCHA FTS contains data on humanitarian contributions as reported to FTS. IATI contains activity (or project) level data on humanitarian and development activities, but the availability and quality of data will vary depending on what data each organisation has published.


#### **Contributions**

The contributions page contains a summary of total funding to date against the[ Covid-19 Global Humanitarian Response Plan](https://fts.unocha.org/appeals/952/summary). This page also contains an aggregation and detailed breakdown of funding against the[ Covid-19 emergency](https://fts.unocha.org/emergencies/911/summary/2020).

Note: Funding to the emergency will generally contain a significantly broader selection of contributions than funding to the plan. For this reason, the total amount of funding under the plan should not be compared with the total amount of funding under the emergency.

The visualisation does not contain any double-counting, though it does currently contain funding at different stages of the process. The dataset contains pledges, commitments, and paid contributions (see the status column in the detailed data). The status of an individual contribution is updated as it progresses through these stages.

The contributions data is extracted from the[ FTS Public API](https://fts.unocha.org/content/fts-public-api).


#### **Activities**

The activities page lists activities that various organisations are involved in. 'Activity' can have multiple meanings, depending on the business processes of the respective organisation. Often, it is synonymous with a 'project', but it can also contain country-wide programmes, budget support, or contributions to other organisations.

The activities page will contain double-counting, as activities will be reported by multiple organisations throughout the delivery chain of the same overarching project. There are mechanisms in IATI to avoid double counting (by stating where the funds have come from), generally called 'traceability'. However, implementation of these mechanisms will vary between publishers. While there is greater traceability between the UK's Department for International Development and the Dutch Ministry of Foreign Affairs and their respective implementing partners, traceability is not yet widespread for flows between large organisations. For more information on how Grand Bargain signatories are publishing their data, see the[ IATI Humanitarian Data Portal](https://humportal.org).


##### **Selection of COVID-19 activities from IATI data**

Only COVID-19 activities are captured and displayed in the visualisation and the underlying data. IATI ativities are marked as COVID-19 related (and therefore included) if they meet **any** of the following criteria (largely following the[ IATI COVID-19 publishing guidance](https://iatistandard.org/en/guidance/standard-guidance/covid-19/)):



*   title, description, or any transaction description contains the text "COVID-19" or "COVID 19"
*   humanitarian-scope matches the GLIDE code "EP-2020-000012-001" (this is the GLIDE code that IATI uses for the COVID-19 emergency)
*   humanitarian-scope matches the Humanitarian Response Plan code "HCOVD20"
*   tag/@code "COVID-19"

More detailed data notes, and a number of data files behind this visualisation, are available from[ the covid19-data github repository](https://github.com/OCHA-DAP/covid19-data/tree/gh-pages). The data files are automatically updated every 24 hours.

The activity data is extracted from the[ d-portal API](https://d-portal.org) using the above criteria.


#### **Flows**

The flows page contains the same selection of activities as the activities page. Data is filtered to a particular organisation type (e.g. government, multilateral, NGO), which is initially set to "Government" but can be changed by the user at the top of the page.

The topmost table shows a summary of data by disbursements and direct expenditure. This should help to identify any coding issues – for example: where an organisation has stated that 100% of their spending is direct expenditure, but this is known not to be the case.

Below the table is a visualisation of flows for each publishing organisation. The specific organisation can be selected from the drop-down list (this drop-down shows only publishers for the selected organisation type, which can be changed at the top of the page).

The visualisation can be customised by:



*   toggling the display of incoming funds (i.e. funds **received** by this publishing organisation): this generally only changes the display for NGOs and some multilaterals
*   including data from partner organisations: this will include data reported by implementing partners of the selected publishing organisation. Note that this may lead to double-counting if both the publisher and one of their implementing partners are providing data on the same funding at different points in the chain.

The tables below the visualisation show the same data as the visualisation, but in tabular format. They also contain more detail as the visualisation is limited to displaying the top 10 largest entries.


### **Frequently-asked questions**


##### **Why are contributions and activities figures different?**

The data for the Contributions tab is from the UN Financial Tracking Service (FTS), while the data for the Activities and Flows tabs is from organisations participating in the International Aid Transparency Initiative (IATI). These are two different information ecosystems, with different goals and procedures, so the results will usually differ as well: for example, the FTS data is curated and focuses specifically on humanitarian appeals and emergencies within the UN system and its partners, while the IATI data is self-reported includes a wider variety of aid-related organisations.


##### **How often is this updated?**

The data is updated daily, using the latest available from FTS and IATI.


##### **Are these tools inclusive of humanitarian and development data?**

The FTS Contributions tab contains exclusively humanitarian data. The IATI Activities and Flows tabs contain both humanitarian and development data (IATI participants self-declare which activities are humanitarian). The visualisation allows you to filter to see only humanitarian, only development, or both.


##### **Is there any missing data?**

Yes. FTS data includes the primary humanitarian actors who work in or with the UN system, but there are many aid organisations not included. The IATI ecosystem includes over 1,200 aid-related organisations (humanitarian and development) but there are still some organisations who choose not to publish their activities and financial data, and they will be missing from the visualisation.


##### **What IATI data is and is not included?**

This tool focuses on the activity and financial aspects of IATI data. IATI data can also include results, links to documents and sub-national location data, and budget and organisation data. You can find more of this information at[ https://d-portal.org](https://d-portal.org)


##### **Where can I learn more about this data?**

Information about FTS data and methodology is available at[ https://fts.unocha.org/content/about-fts-what-fts](https://fts.unocha.org/content/about-fts-what-fts)

You can learn more about IATI at[ https://iatistandard.org/](https://iatistandard.org/)


##### **How can I get in touch with feedback?**

We welcome feedback on this tool. Please send your comments to centrehumdata@un.org


##### **Who built this tool?**

Development Initiatives originally built this tool in May 2020 as part of the Grand Bargain Transparency work stream. Since January 2021, The OCHA Centre for Humanitarian Data has maintained and enhanced it.


##### **Can I access historical data?**

Each nightly download of the data is stored and available for access via the project GitHub repository at[ https://github.com/OCHA-DAP/covid19-data/tree/gh-pages](https://github.com/OCHA-DAP/covid19-data/tree/gh-pages) A script is also available for technical users.


##### **What's a Commitment?**

A Commitment is a specific type of transaction in the IATI data standard. A commitment represents a legal agreement from one party to another to make funds available.


##### **What's a Disbursement?**

A Disbursement is a specific type of transaction in the IATI data standard. A disbursement represents the actual transfer of funds from one party to another.


##### **Are Commitments and Disbursements related?**

Within a single IATI activity, a Commitment will usually preceed a Disbursement. In many instances, there could be several Commitments and Disbursements in an IATI activity, and they may not follow a strict chronological order.


##### **What's the difference between a Recipient Country and a Country?**

None! IATI data uses the terms interchangeably.


##### **Can I access a list of all Countries?**

IATI has a centralised list of countries and their codes, using the ISO 3166-1 standard:[ https://iatistandard.org/en/iati-standard/203/codelists/country/](https://iatistandard.org/en/iati-standard/203/codelists/country/)


##### **What is an IATI activity?**

An IATI activity represents a portfolio, programme, project, activity, or any other way that aid organisations publishing to IATI choose to divide up their work. Some IATI publishers may use activities to represent a mix of their business and operational units.


##### **What's a Sector?**

IATI has a master list of sectors for development work, which are based on the OECD DAC "Purpose Codes". These are thematic codes used in the development sector, to classify funding and projects:[ https://iatistandard.org/en/iati-standard/203/codelists/sector/](https://iatistandard.org/en/iati-standard/203/codelists/sector/)

For humanitarian classification, some IATI publishers also use the cluster and area-of-interest classification at[ https://data.humdata.org/dataset/global-coordination-groups-beta](https://data.humdata.org/dataset/global-coordination-groups-beta)


##### **What is the IATI COVID-19 Guidance?**

The IATI Secretariat published this guidance document to assist IATI publishers in describing their COVID-19 actions in a common way. The guidance details various ways in which COVID-19 can be added to IATI data:[ https://iatistandard.org/en/guidance/standard-guidance/covid-19/](https://iatistandard.org/en/guidance/standard-guidance/covid-19/)


##### **Are the IATI Flows the same as the "flows" that the FTS web site publishes?**

No. These flows are constructed from IATI data, and do no use any FTS sources.


##### **Why are there different Excel files to download the Activities data?**

The three Excel files present different views of the COVID-19-related IATI activity data. The "activities" file details the activity-level data, and aggregates the transactions; the "transactions" file provides all transations, each in a new speadsheet row; the "transactions - by country and sector" file provides further segmentation for the top activities, when activities have multiple sectors and/or countries.


##### **What are the JSON and XML download options?**

Alongside the spreadsheet formats for download, data is available in the original IATI format (XML) and an alternative format known as JSON. These formats are useful for technical specialists who want to perform more-advanced analysis of the data.


### **Technical details**

The front end of the prototype is built in Vue.JS and hosted as a static site on Github pages. The data is extracted from the FTS and D-Portal APIs, and reprocessed and condensed daily, using scripts written in Python and run on Travis.

All of the tools we have developed are shared as open source software:



*   [The front end (in Vue.JS)](https://github.com/OCHA-DAP/viz-covid19-visualisation)
*   [The data processing scripts (in Python)](https://github.com/OCHA-DAP/covid19-data)
*   [The reprocessed data (automatically generated every 24 hours)](https://github.com/OCHA-DAP/covid19-data/tree/gh-pages)


### **Privacy Policy and Cookies**

View[ our privacy policy and cookies policy](https://covid19.humportal.org/Privacy-Policy.pdf). If you have any further questions, please get in touch with us via humportal@devinit.org.
