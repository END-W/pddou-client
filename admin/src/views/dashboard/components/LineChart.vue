<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
import { fetchBoxOffice } from '@/api/order'

export default {
  //   mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
      chart: null,
      newChartData: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      fetchBoxOffice({ role: this.roles[0] })
        .then(response => {
          console.log(response.data)
          for (let i = 1; i <= 7; i++) {
            for (let j = 0; j < response.data.length; j++) {
              if (i === response.data[j].month) {
                this.newChartData.push(response.data[j].total)
              }
            }
            if (this.newChartData[i - 1] == null) {
              this.newChartData.push(0)
            }
          }
          this.setOptions(this.newChartData)
        })
        .catch(() => {
          this.newChartData = this.chartData
          this.setOptions(this.newChartData)
        })
    },
    setOptions(actualData) {
      this.chart.setOption({
        title: {
          text: '票房统计',
          // 控制标题位置
          x: 'left'
          //   y:'top'
        },
        xAxis: {
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['营业额']
        },
        series: [
          {
            name: '营业额',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>
