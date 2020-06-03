<template>
  <div id="sankeyChart" ref="sankeyChart">
    <svg :width="width" :height="height">
      <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="10" style="stroke:black; stroke-width:1" />
      </pattern>
      <g>
        <rect
        class="node"
        v-bind="nodes"
        v-for="(node, index) in nodes"
        v-bind:key="node.index"
        :x="node.x0"
        :y="node.y0"
        :height="Math.max(node.y1-node.y0, 0)"
        :width="node.x1-node.x0"
        :fill="node.name=='» Direct Expenditure' ? 'url(#diagonalHatch)': color(node)">
        </rect>
      </g>
      <g>
        <g
          style="mix-blend-mode: multiply;"
          v-bind="links"
          v-for="(link, index) in links"
          v-bind:key="link.index"
          :id="`link-${link.index}`"
          :class="selectedLink == link.index ? 'link linkHover' : 'link'">
          <linearGradient :id="`${link.index}-gradient`" gradientUnits="userSpaceOnUse"
          :x1="link.source.x1"
          :x2="link.target.x0">
          <stop
          offset="0%"
          :stop-color="color(link.source)"></stop>
          <stop
          offset="100%"
          :stop-color="color(link.target)"></stop>
          </linearGradient>
          <path
          :d="sankeyLinkPaths(link)"
          :stroke="`url(#${link.index}-gradient)`"
          :stroke-width="Math.max(1, link.width)"
          @mouseover="mouseoverLink(link.index)"
          @mouseleave="mouseleaveLink(link.index)"
          >
          </path>
        </g>
      </g>
      <g font-family="sans-serif" font-size="12">
        <text
        v-bind="nodes"
        v-for="(node, index) in nodes"
        v-bind:key="node.index"
        :x="node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6"
        :y="(node.y1 + node.y0) / 2"
        dy="0.35em"
        :text-anchor="node.x0 < width / 2 ? 'start' : 'end'">
          {{ node.name }} <template v-if="node.name=='» Direct Expenditure'"> (no organisation)</template>
        </text>
      </g>
      <g font-family="sans-serif" font-size="12">
        <g
          class="linkText"
          v-bind="links"
          v-for="(link, index) in links"
          :style="selectedLink == link.index ? 'display: block;' : 'display: none;'"
          @mouseover="mouseoverLink(link.index)"
          @mouseleave="mouseleaveLink(link.index)"
          v-bind:key="`${link.index}-label`">
            <text
            :x="link.source.x1+(link.target.x0-link.source.x1)/2"
            :y="(link.y1 + link.y0) / 2"
            :width="link.width"
            dy="0.35em"
            text-anchor="middle">
              From {{ link.source.name }}<br />
            </text>
            <text
            :x="link.source.x1+(link.target.x0-link.source.x1)/2"
            :y="((link.y1 + link.y0) / 2)+15"
            :width="link.width"
            dy="0.35em"
            text-anchor="middle">
              To {{ link.target.name }}<br />
            </text>
            <text
            :x="link.source.x1+(link.target.x0-link.source.x1)/2"
            :y="((link.y1 + link.y0) / 2)+30"
            :width="link.width"
            dy="0.35em"
            text-anchor="middle">
              USD {{ numberFormatter(link.value) }}<br />
            </text>
        </g>
      </g>
    </svg>
  </div>
</template>
<style>
#sankeyChart {
  width: 100%;
  height: 400px;
}
.node rect {
  cursor: move;
  fill-opacity: .9;
  shape-rendering: crispEdges;
}
.node text {
  pointer-events: none;
  text-shadow: 0 1px 0 #fff;
}
.link {
  fill: none;
  stroke: #000;
  stroke-opacity: .3;
}
.linkHover {
  stroke-opacity: .5;
}
.linkText {
  fill: #000000;
  text-shadow: 1px 1px 3px #ffffff;
  cursor: default;
}
</style>
<script>
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal as d3SsankeyLinkHorizontal } from 'd3-sankey'
export default {
  name: 'sankey-chart',
  props: ['chartData'],
  data () {
    return {
      chart: null,
      width: 10,
      height: 10,
      selectedLink: null
    }
  },
  computed: {
    colors () {
      return d3.scaleOrdinal(d3.schemeCategory10)
    },
    nodes() {
      return this.sankey.nodes
    },
    links() {
      return this.sankey.links
    },
    sankey() {
      const nodes = this.chartData.nodes
      const links = this.chartData.links
      const sankey = d3Sankey()
          .nodeId(d => d.name)
          .nodeWidth(20)
          .nodePadding(8)
          .extent([[1, 5], [this.width - 1, this.height - 10]]);
      return sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
      });
    },
    sankeyLinkPaths() {
      return d3SsankeyLinkHorizontal()
    }
  },
  methods: {
    mouseoverLink(index) {
      this.selectedLink = index
    },
    mouseleaveLink(index) {
      this.selectedLink = null
    },
    sankeyLinkPath(d) {
      return sankeyLinkPaths(d)
    },
    numberFormatter(value) {
      if (value == 0) { return "0" }
      return value ? value.toLocaleString(undefined, {
        maximumFractionDigits: 0
      }) : ""
    },
    color(d) {
      if (d.name == "» Direct Expenditure") { return "#bbbbbb" }
      return this.colors(d.name);
    },
    makeChart() {
      const {nodes, links} = this.sankey

      const svg = d3
        .select("#sankeyChart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
    },
    onResize() {
      this.width = this.$el.offsetWidth
      this.height = 500
    }
  },
  mounted() {
    this.makeChart()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }
}
</script>