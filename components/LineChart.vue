<template>
  <LineChart :data="makeDatasets(lineChartData)" :options="lineChartOptions" class="line-chart" />
</template>
<style scoped>
.line-chart {
  height: 600px;
}
</style>
<script>
import LineChart from '~/components/Charts/line-chart'
export default {
  name: 'SummaryLineChart',
  components: {
    LineChart
  },
  props: ['lineChartData', 'years'],
  data() {
    return {
      lineChartOptions: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                  return value.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Value (GBP)'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                callback: function(tick) {
                  const characterLimit = 20
                  if (tick.length >= characterLimit) {
                    return (
                      tick
                        .slice(0, tick.length)
                        .substring(0, characterLimit - 1)
                        .trim() + '...'
                    )
                  }
                  return tick
                }
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    lineChartYears() {
      return [...this.years].reverse()
    }
  },
  methods: {
    makeDatasets(lineChartData) {
      const years = this.lineChartYears
      const colours = [
        '#CF3D1E', '#F15623', '#F68B1F', '#FFC60B',
        '#DFCE21', '#BCD631', '#95C93D', '#48B85C',
        '#00833D', '#00B48D', '#60C4B1', '#27C4F4',
        '#478DCB', '#3E67B1', '#4251A3', '#59449B',
        '#6E3F7C', '#6A246D', '#8A4873', '#EB0080',
        '#EF58A0', '#C05A89'
      ]
      const datasets = lineChartData.map((ds, i) => {
        return {
          label: ds.sector,
          borderColor: i < colours.length ? colours[i] : "#eeeeee",
          backgroundColor: i < colours.length ? colours[i] : "#eeeeee",
          fill: true,
          data: years.map(year =>
            ({
              x: year,
              y: ds[`value_${year}`] ? Math.round(ds[`value_${year}`], 2) : 0.00
            })
          )
        }
      })
      return { datasets: datasets, labels: years }
    }
  }
}
</script>
