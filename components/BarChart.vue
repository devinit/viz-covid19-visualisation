<template>
  <div>
    <template v-if="barChartData.length > 0">
      <BarChart
        v-if="barChartData"
        :data="chartData"
        :options="barChartOptions"
        class="bar-chart"
      />
      <p v-if="barChartData.length > 20" class="text-muted mb-3 mt-3">
        Showing the top 20 entries. Change view to <b>Table</b> to view all
        entries.
      </p>
    </template>
    <template v-else>
      <div class="bar-chart">
        <b-alert show variant="secondary" class="text-center">
          No data to display. Try adjusting the filters.
        </b-alert>
      </div>
    </template>
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
  props: [
    'barChartData',
    'labelField',
    'valueField',
    'valueLabel',
    'valuePrecision',
    'step'
  ],
  data () {
    return {}
  },
  computed: {
    barChartOptions () {
      return {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem, data) => {
              return this.chartData.labels[tooltipItem[0].index]
            },
            label: (tooltipItem, data) => {
              let label = this.valueLabel || ''

              if (label) {
                label += ': '
              }
              if (this.valuePrecision) {
                label += tooltipItem.yLabel.toLocaleString(undefined, {
                  maximumFractionDigits: this.valuePrecision,
                  minimumFractionDigits: this.valuePrecision
                })
              } else {
                label += tooltipItem.yLabel
              }
              return label
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                precision: this.valuePrecision,
                stepSize: this.step ? this.step : undefined,
                callback (tick) {
                  return tick.toLocaleString(undefined, {
                    maximumFractionDigits: this.valuePrecision,
                    minimumFractionDigits: this.valuePrecision
                  })
                }
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
                callback (tick) {
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
    },
    chartData () {
      const colours = [
        '#6e40aa', '#6849b9', '#6153c7', '#585fd2',
        '#4e6cda', '#4479df', '#3988e1', '#2f96e0',
        '#26a5db', '#1fb3d3', '#1bc1c8', '#19cdbb',
        '#1bd9ac', '#20e29d', '#28ea8d', '#34f07e',
        '#44f470', '#56f665', '#6bf75c', '#81f558',
        '#98f357', '#aff05b'
      ]
      return {
        datasets: [{
          label: this.labelField,
          fill: true,
          data: this.barChartData.map((ds) => { return ds[this.valueField] }).slice(0, 20),
          backgroundColor: colours
        }],
        labels: this.barChartData.map((ds) => { return ds[this.labelField] }).slice(0, 20)
      }
    }
  }
}
</script>
