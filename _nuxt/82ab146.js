(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{314:function(t,n,e){var content=e(326);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(53).default)("24b51ecc",content,!0,{sourceMap:!1})},325:function(t,n,e){"use strict";e(314)},326:function(t,n,e){var r=e(52)(!1);r.push([t.i,".bar-chart[data-v-52760b70]{height:300px}",""]),t.exports=r},327:function(t,n,e){"use strict";e(10),e(8);var r={name:"SummaryBarChart",components:{BarChart:{extends:e(366).a,props:["data","options"],mounted:function(){this.renderChart(this.data,this.options)},watch:{data:function(){this.renderChart(this.data,this.options)}}}},props:["barChartData","labelField","valueField","valueLabel","valuePrecision","step"],data:function(){return{}},computed:{barChartOptions:function(){var t=this;return{maintainAspectRatio:!1,legend:{display:!1},tooltips:{callbacks:{title:function(n,data){return t.chartData.labels[n[0].index]},label:function(n,data){var label=t.valueLabel||"";return label&&(label+=": "),t.valuePrecision?label+=n.yLabel.toLocaleString(void 0,{maximumFractionDigits:t.valuePrecision,minimumFractionDigits:t.valuePrecision}):label+=n.yLabel,label}}},scales:{yAxes:[{ticks:{beginAtZero:!0,precision:this.valuePrecision,stepSize:this.step?this.step:void 0,callback:function(t){return t.toLocaleString(void 0,{maximumFractionDigits:this.valuePrecision,minimumFractionDigits:this.valuePrecision})}},scaleLabel:{display:!0,labelString:this.valueLabel}}],xAxes:[{ticks:{callback:function(t){return t.length>=20?t.slice(0,t.length).substring(0,19).trim()+"...":t}}}]}}},chartData:function(){var t=this;return{datasets:[{label:this.labelField,fill:!0,data:this.barChartData.map((function(n){return n[t.valueField]})).slice(0,20),backgroundColor:["#6e40aa","#6849b9","#6153c7","#585fd2","#4e6cda","#4479df","#3988e1","#2f96e0","#26a5db","#1fb3d3","#1bc1c8","#19cdbb","#1bd9ac","#20e29d","#28ea8d","#34f07e","#44f470","#56f665","#6bf75c","#81f558","#98f357","#aff05b"]}],labels:this.barChartData.map((function(n){return n[t.labelField]})).slice(0,20)}}}},o=(e(325),e(51)),component=Object(o.a)(r,(function(){var t=this,n=t._self._c;return n("div",[t.barChartData.length>0?[t.barChartData?n("BarChart",{staticClass:"bar-chart",attrs:{data:t.chartData,options:t.barChartOptions}}):t._e(),t._v(" "),t.barChartData.length>20?n("p",{staticClass:"text-muted mb-3 mt-3"},[t._v("\n      Showing the top 20 entries. Change view to "),n("b",[t._v("Table")]),t._v(" to view all\n      entries.\n    ")]):t._e()]:[n("div",{staticClass:"bar-chart"},[n("b-alert",{staticClass:"text-center",attrs:{show:"",variant:"secondary"}},[t._v("\n        No data to display. Try adjusting the filters.\n      ")])],1)]],2)}),[],!1,null,"52760b70",null);n.a=component.exports},408:function(t,n,e){"use strict";e.r(n);var r=e(21),o=(e(61),e(75),e(1),e(8),e(13),e(71)),l=e.n(o),m=e(121),c=(e(313),{components:{BarChart:e(327).a},props:["displaySummary","summaryLabelField","contributions"],data:function(){return{}},computed:{contributionsBusy:function(){return 0===this.$store.state.contributions.length},contributionsSummary:function(){var t=this;return Object.values(this.contributions.reduce((function(summary,n){if("fundingOrganisation"===t.summaryLabelField)var e=summary[n.source]?summary[n.source]:summary[n.source]={fundingOrganisation:n.source};else e=summary[n.destination]?summary[n.destination]:summary[n.destination]={implementingOrganisation:n.destination};return e.value?e.value+=n.amountUSD/1e6:e.value=n.amountUSD/1e6,summary}),{})).sort((function(a,b){return a.value>b.value?1:-1})).reverse()},summaryFields:function(){return[{key:this.summaryLabelField,sortable:!0},{key:"value",label:"Value (USDm)",sortable:!0,thClass:"text-right",tdClass:"text-right",formatter:"valueFormatter"}]}},methods:{valueFormatter:function(t){return t?t.toLocaleString(void 0,{maximumFractionDigits:2,minimumFractionDigits:2}):0}}}),d=e(51),f=Object(d.a)(c,(function(){var t=this,n=t._self._c;return n("div",[t._m(0),t._v(" "),"chart"===t.displaySummary?n("BarChart",{attrs:{"bar-chart-data":t.contributionsSummary,"label-field":t.summaryLabelField,"value-label":"Funding (USDm)","value-field":"value","value-precision":"2"}}):t._e(),t._v(" "),"table"===t.displaySummary?n("b-table",{attrs:{items:t.contributionsSummary,fields:t.summaryFields,"asort-by":"total_value","asort-desc":"true",small:"","head-variant":"dark",bordered:""}}):t._e()],1)}),[function(){var t=this,n=t._self._c;return n("p",{staticClass:"text-muted"},[t._v("\n    Funding against Emergency "),n("b",[t._v("Coronavirus disease Outbreak - Covid-19")])])}],!1,null,null,null).exports,h=(e(39),e(14),e(40),{components:{},props:["urls"],data:function(){return{}},computed:{HRPBusy:function(){return 0===this.$store.state.planRequirements},planRequirements:function(){return this.$store.state.planRequirements},planFunded:function(){return this.$store.state.planFunded},planUnfunded:function(){return this.planRequirements-this.planFunded},useCache:function(){return this.$store.state.useCache}},watch:{useCache:function(){this.loadData()}},mounted:function(){var t=this;this.$nextTick((function(){0===t.planRequirements&&t.loadData()}))},methods:{loadRequirements:function(){var t=this;return l.a.get("".concat(this.urls.PLAN_URL)).then((function(n){t.$store.commit("setPlanRequirements",n.data.data.revisedRequirements),t.$store.commit("setPlanFunded",n.data.data.fundedRequirements)}))},loadData:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([t.loadRequirements()]);case 2:case"end":return n.stop()}}),n)})))()},formatNumber:function(t){return t>1e9?(t/1e9).toLocaleString(void 0,{maximumFractionDigits:2})+"bn":Math.round(t/1e6)+"m"}}}),v=Object(d.a)(h,(function(){var t=this,n=t._self._c;return n("div",[t.HRPBusy?[n("div",{staticClass:"text-center text-secondary mb-4"},[n("b-spinner",{staticClass:"align-middle"}),t._v(" "),n("strong",[t._v("Loading...")])],1)]:[t._m(0),t._v(" "),n("b-progress",{staticClass:"mb-2",attrs:{max:t.planRequirements,"show-progress":"",height:"2rem"}},[n("b-progress-bar",{attrs:{value:t.planFunded,label:"".concat((t.planFunded/t.planRequirements*100).toFixed(1),"% funded"),variant:"primary",striped:""}})],1),t._v(" "),n("p",[t._v("USD "+t._s(t.formatNumber(t.planFunded))+" out of USD "+t._s(t.formatNumber(t.planRequirements))+" currently funded")]),t._v(" "),n("hr")]],2)}),[function(){var t=this,n=t._self._c;return n("p",{staticClass:"text-muted"},[t._v("\n      Funding against Humanitarian Response Plan "),n("b",[t._v("Coronavirus disease Outbreak - Covid-19")])])}],!1,null,null,null).exports,y={components:{},props:["displaySummary","summaryLabelField","implementingOrganisation","implementingOrganisations","fundingOrganisation","fundingOrganisations"],data:function(){return{summaryLabelOptions:[{value:"fundingOrganisation",text:"Funder"},{value:"implementingOrganisation",text:"Implementer"}],summaryDisplayOptions:[{value:"chart",text:"Chart"},{value:"table",text:"Table"}]}},computed:{summary:{get:function(){return this.displaySummary},set:function(t){this.$emit("update:displaySummary",t)}},summaryLabel:{get:function(){return this.summaryLabelField},set:function(t){this.$emit("update:summaryLabelField",t)}},theImplementingOrganisation:{get:function(){return this.implementingOrganisation},set:function(t){this.$emit("update:implementingOrganisation",t)}},theFundingOrganisation:{get:function(){return this.fundingOrganisation},set:function(t){this.$emit("update:fundingOrganisation",t)}}}},_={components:{ContributionsSummaryPane:f,ContributionsSummaryPaneControls:Object(d.a)(y,(function(){var t=this,n=t._self._c;return n("div",[n("b-row",[n("b-col",[n("h3",[t._v("Summary")])])],1),t._v(" "),n("b-row",[n("b-col",{attrs:{lg:"6"}},[n("b-form",{attrs:{inline:""}},[n("b-form-group",[n("b-form-radio-group",{staticClass:"displaySummaryControls mb-1",attrs:{options:t.summaryDisplayOptions,buttons:"","button-variant":"outline-primary"},model:{value:t.summary,callback:function(n){t.summary=n},expression:"summary"}}),t._v(" "),n("b-form-radio-group",{staticClass:"displaySummaryControls mb-1",attrs:{options:t.summaryLabelOptions,buttons:"","button-variant":"outline-secondary"},model:{value:t.summaryLabel,callback:function(n){t.summaryLabel=n},expression:"summaryLabel"}})],1)],1)],1),t._v(" "),n("b-col",{staticClass:"ml-lg-auto text-lg-right",attrs:{lg:"6"}},[n("b-form",{attrs:{inline:""}},[n("b-form-group",{staticClass:"ml-lg-auto"},[n("b-form-select",{staticClass:"mb-1",staticStyle:{"max-width":"200px"},attrs:{options:t.fundingOrganisations,state:!!t.theFundingOrganisation||null},model:{value:t.theFundingOrganisation,callback:function(n){t.theFundingOrganisation=n},expression:"theFundingOrganisation"}}),t._v(" "),n("b-form-select",{staticClass:"mb-1",staticStyle:{"max-width":"200px"},attrs:{options:t.implementingOrganisations,state:!!t.theImplementingOrganisation||null},model:{value:t.theImplementingOrganisation,callback:function(n){t.theImplementingOrganisation=n},expression:"theImplementingOrganisation"}})],1)],1)],1)],1)],1)}),[],!1,null,null,null).exports,HRPSummaryPane:v},data:function(){return{title:m.a.head.title,organisations:{"United Nations Development Programme":"XM-DAC-41114","United Nations High Commissioner for Refugees":"XM-DAC-41121","United Nations Children's Fund":"XM-DAC-41122","Danish Refugee Council":"DK-CVR-20699310","World Health Organization":"XM-DAC-928","World Food Programme":"XM-DAC-41140"},planID:952,emergencyID:911,displaySummary:"chart",summaryLabelField:"fundingOrganisation",fundingOrganisation:null,implementingOrganisation:null,downloadURLs:[{format:"Excel",url:"https://devinit.github.io/iati-covid19-first-prototype/xlsx/contributions.xlsx?raw=true"},{format:"JSON",url:"https://devinit.github.io/iati-covid19-first-prototype/fts-emergency-911.json"}],currentPage:1,perPage:50}},computed:{busy:function(){return 0===this.$store.state.contributions.length},fundingOrganisations:function(){var t=[];return[{value:null,text:"All funders"}].concat(this.originalContributions.reduce((function(summary,n){return t.includes(n.source)||(summary.push({value:n.source,text:n.source}),t.push(n.source)),summary}),[]).sort((function(a,b){return a.text<b.text?-1:1})))},implementingOrganisations:function(){var t=[];return[{value:null,text:"All implementers"}].concat(this.originalContributions.reduce((function(summary,n){return t.includes(n.destination)||(summary.push({value:n.destination,text:n.destination}),t.push(n.destination)),summary}),[]).sort((function(a,b){return a.text<b.text?-1:1})))},urls:function(){return{EMERGENCY_URL:"https://devinit.github.io/iati-covid19-first-prototype/fts-emergency-".concat(this.emergencyID,".json"),PLAN_URL:"https://devinit.github.io/iati-covid19-first-prototype/fts-plan-".concat(this.planID,".json"),FLOW_URL:"https://devinit.github.io/iati-covid19-first-prototype/fts-flow-plan-".concat(this.planID,".json")}},fields:function(){return[{key:"id",label:"ID",sortable:!0},{key:"source",label:"Funder",sortable:!0},{key:"destination",label:"Implementer",sortable:!0},{key:"status",label:"Status",sortable:!0},{key:"date",label:"Date",sortable:!0},{key:"amountUSD",label:"Amount (USD)",sortable:!0,formatter:"numberFormatter"},{key:"details",label:"Details"}]},originalContributions:function(){return this.$store.state.contributions},totalRows:function(){return this.contributions.length},contributions:function(){var t=this;return this.originalContributions===[]?[]:null===this.fundingOrganisation&&null===this.implementingOrganisation?this.originalContributions:this.originalContributions.filter((function(n){return null!==t.fundingOrganisation&&null!==t.implementingOrganisation?n.source===t.fundingOrganisation&&n.destination===t.implementingOrganisation:null!==t.fundingOrganisation?n.source===t.fundingOrganisation:null===t.implementingOrganisation||n.destination===t.implementingOrganisation}))},urlQuery:function(){var t={};return"chart"!==this.displaySummary&&(t.display=this.displaySummary),"fundingOrganisation"!==this.summaryLabelField&&(t.summary=this.summaryLabelField),this.fundingOrganisation&&(t.funder=this.fundingOrganisation),this.implementingOrganisation&&(t.implementer=this.implementingOrganisation),t}},watch:{fundingOrganisation:function(t){this.summaryLabelField=t?"implementingOrganisation":"fundingOrganisation",this.updateRouter()},implementingOrganisation:function(t){t&&(this.summaryLabelField="fundingOrganisation"),this.updateRouter()},displaySummary:function(t){this.updateRouter()},summaryLabelField:function(t){this.updateRouter()}},mounted:function(){var t=this;this.$nextTick((function(){t.contributions.length||(t.loadData(),"funder"in t.$route.query&&(t.fundingOrganisation=t.$route.query.funder),"implementer"in t.$route.query&&(t.implementingOrganisation=t.$route.query.implementer),"display"in t.$route.query&&(t.displaySummary=t.$route.query.display),"summary"in t.$route.query&&(t.summaryLabelField=t.$route.query.summary))}))},methods:{numberFormatter:function(t){return t?t.toLocaleString(void 0,{maximumFractionDigits:2,minimumFractionDigits:2}):""},getOrganisationName:function(t){var n=t.filter((function(t){return"Organization"===t.type})).map((function(t){return t.name}));return n?n.join():""},loadData:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t.$nuxt.$loading.start(),n.next=3,l.a.get("".concat(t.urls.EMERGENCY_URL)).then((function(n){t.$store.commit("setContributions",t.processContributions(n.data.data.flows))}));case 3:t.$nuxt.$loading.finish();case 4:case"end":return n.stop()}}),n)})))()},processContributions:function(t){var n=this;return t.filter((function(t){return"incoming"===t.boundary&&"single"===t.onBoundary})).map((function(t){return t.source=n.getOrganisationName(t.sourceObjects),t.destination=n.getOrganisationName(t.destinationObjects),t}))},updateRouter:function(){this.$router.push({name:"index",query:this.urlQuery})}}},O=Object(d.a)(_,(function(){var t=this,n=t._self._c;return n("div",[n("b-alert",{attrs:{show:"",variant:"warning"}},[t._v("\n    This is a prototype visualisation to track the Covid-19 response. The data on this page comes from UNOCHA's\n    "),n("a",{attrs:{href:"https://fts.unocha.org/"}},[t._v("FTS")]),t._v(". Read more on the\n    "),t._v(" "),n("nuxt-link",{attrs:{to:{name:"about"},"no-prefetch":""}},[t._v("about page")]),t._v(".\n  ")],1),t._v(" "),n("h2",[t._v("Contributions")]),t._v(" "),n("hr"),t._v(" "),n("HRPSummaryPane",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],attrs:{urls:t.urls}}),t._v(" "),t.busy?[n("div",{staticClass:"text-center text-secondary mb-4"},[n("b-spinner",{staticClass:"align-middle"}),t._v(" "),n("strong",[t._v("Loading...")])],1)]:[n("ContributionsSummaryPaneControls",{attrs:{"display-summary":t.displaySummary,"summary-label-field":t.summaryLabelField,"funding-organisation":t.fundingOrganisation,"funding-organisations":t.fundingOrganisations,"implementing-organisation":t.implementingOrganisation,"implementing-organisations":t.implementingOrganisations},on:{"update:displaySummary":function(n){t.displaySummary=n},"update:display-summary":function(n){t.displaySummary=n},"update:summaryLabelField":function(n){t.summaryLabelField=n},"update:summary-label-field":function(n){t.summaryLabelField=n},"update:fundingOrganisation":function(n){t.fundingOrganisation=n},"update:funding-organisation":function(n){t.fundingOrganisation=n},"update:implementingOrganisation":function(n){t.implementingOrganisation=n},"update:implementing-organisation":function(n){t.implementingOrganisation=n}}}),t._v(" "),n("hr"),t._v(" "),n("ContributionsSummaryPane",{attrs:{"display-summary":t.displaySummary,"summary-label-field":t.summaryLabelField,contributions:t.contributions}}),t._v(" "),n("hr"),t._v(" "),n("b-row",[n("b-col",{attrs:{sm:"7",md:"9"}},[n("h3",[t._v(t._s(t.contributions.length)+" Contributions")])]),t._v(" "),n("b-col",{staticClass:"text-sm-right",attrs:{sm:"5",md:"3"}},[n("b-dropdown",{staticClass:"mb-2",staticStyle:{width:"100%"},attrs:{text:"Download",right:"",variant:"primary"}},t._l(t.downloadURLs,(function(e){return n("b-dropdown-item",{key:e.format,attrs:{href:e.url,target:"_blank"}},[t._v("\n            "+t._s(e.format)+"\n          ")])})),1)],1)],1),t._v(" "),n("b-row",[n("b-col",{staticClass:"my-1",attrs:{sm:"5",md:"6"}},[n("b-form-group",{attrs:{label:"Contributions per page","label-cols-sm":"7","label-cols-md":"7","label-cols-lg":"5","label-cols-xl":"4","label-align-sm":"right","label-size":"sm","label-for":"perPageSelect"}},[n("b-form-select",{attrs:{id:"perPageSelect",options:[50,100,500,1e3],size:"sm"},model:{value:t.perPage,callback:function(n){t.perPage=n},expression:"perPage"}})],1)],1),t._v(" "),n("b-col",{staticClass:"my-1",attrs:{sm:"7",md:"6"}},[n("b-pagination",{staticClass:"my-0",attrs:{"total-rows":t.totalRows,"per-page":t.perPage,align:"fill",size:"sm"},model:{value:t.currentPage,callback:function(n){t.currentPage=n},expression:"currentPage"}})],1)],1),t._v(" "),n("b-table",{attrs:{items:t.contributions,fields:t.fields,"sort-desc":!0,"current-page":t.currentPage,"per-page":t.perPage,"sort-by":"date",responsive:""},scopedSlots:t._u([{key:"cell(source)",fn:function(data){return[t._v("\n        "+t._s(data.item.source)+"\n      ")]}},{key:"cell(destination)",fn:function(data){return[data.item.destination in t.organisations?[n("nuxt-link",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{to:{name:"activities",query:{organisation:t.organisations[data.item.destination]}},title:"View activities reported by ".concat(data.item.destination)}},[t._v("\n            "+t._s(data.item.destination)+"\n          ")])]:[t._v("\n          "+t._s(data.item.destination)+"\n        ")]]}},{key:"cell(date)",fn:function(data){return[t._v("\n        "+t._s(data.item.date.substr(0,10))+"\n      ")]}},{key:"cell(details)",fn:function(data){return[n("small",[n("a",{attrs:{href:"https://fts.unocha.org/flows/".concat(data.item.id,"?destination=emergencies/").concat(t.emergencyID,"/flows/2020"),target:"_blank"}},[t._v("\n            FTS\n          ")])])]}}])}),t._v(" "),n("b-row",[n("b-col",{staticClass:"my-1",attrs:{sm:"5",md:"6"}},[n("b-form-group",{attrs:{label:"Contributions per page","label-cols-sm":"7","label-cols-md":"7","label-cols-lg":"5","label-cols-xl":"4","label-align-sm":"right","label-size":"sm","label-for":"perPageSelect"}},[n("b-form-select",{attrs:{id:"perPageSelect",options:[50,100,500,1e3],size:"sm"},model:{value:t.perPage,callback:function(n){t.perPage=n},expression:"perPage"}})],1)],1),t._v(" "),n("b-col",{staticClass:"my-1",attrs:{sm:"7",md:"6"}},[n("b-pagination",{staticClass:"my-0",attrs:{"total-rows":t.totalRows,"per-page":t.perPage,align:"fill",size:"sm"},model:{value:t.currentPage,callback:function(n){t.currentPage=n},expression:"currentPage"}})],1)],1)]],2)}),[],!1,null,null,null);n.default=O.exports}}]);