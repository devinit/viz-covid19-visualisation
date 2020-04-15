<template>
  <div>
    <BarChart :data="makeDatasets(barChartData)" :options="barChartOptions" class="bar-chart" />
  </div>
</template>
<style scoped>
.bar-chart {
  height: 300px;
}
</style>
<script>
import BarChart from '~/components/Charts/bar-chart'
export default {
  name: 'SummaryBarChart',
  components: {
    BarChart
  },
  props: ['barChartData', 'labelField', 'valueField', 'valueLabel'],
  data() {
    return {
      barChartOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: this.valueLabel
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
  methods: {
    makeDatasets(lineChartData) {
      const colours = [
        '#CF3D1E', '#F15623', '#F68B1F', '#FFC60B',
        '#DFCE21', '#BCD631', '#95C93D', '#48B85C',
        '#00833D', '#00B48D', '#60C4B1', '#27C4F4',
        '#478DCB', '#3E67B1', '#4251A3', '#59449B',
        '#6E3F7C', '#6A246D', '#8A4873', '#EB0080',
        '#EF58A0', '#C05A89'
      ]

      return {
        datasets: [{
          label: this.labelField,
          fill: true,
          data: lineChartData.map((ds) => { return ds[this.valueField] }),
          backgroundColor: colours
        }],
        labels: lineChartData.map((ds) => { return ds[this.labelField] }),
      }
      return {
        label: this.labelField,
        borderColor: i < colours.length ? colours[i] : "#eeeeee",
        backgroundColor: i < colours.length ? colours[i] : "#eeeeee",
        fill: true,
        data: lineChartData.map((ds) => { return ds[this.valueField] })
      }
      return { datasets: datasets, labels: [`${this.labelField}`] }
    }
  }
}
</script>
