<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
import { fetchBoxOfficeTop10 } from '@/api/order'

export default {
  //   mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300px',
    },
  },
  computed: {
    ...mapGetters(['name', 'roles']),
  },
  data() {
    return {
      chart: null,
      movieName: [
        '毒舌律师',
        '蚁人与黄蜂女：量子狂潮',
        '断网',
        '回廊亭',
        '惊奇队长',
        '无名',
        '深海',
        '保你平安',
        '满江红',
        '流浪地球2',
      ],
      total: [
        12677, 14497, 15497, 15823, 16567, 17497, 18497, 19497, 21034, 23489,
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      fetchBoxOfficeTop10({ role: this.roles[0] })
        .then((response) => {
          this.movieName = []
          this.total = []
          for (let i = 0; i < response.data.length; i++) {
            this.movieName.push(response.data[i].name)
            this.total.push(response.data[i].total)
          }
          this.initChart()
        })
        .catch(() => {
          this.initChart()
        })
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

      this.chart.setOption({
        title: {
          text: '电影票房排名',
          subtext: '票房前十',
          // 控制标题位置
          x: 'left',
          y: 'top',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: this.movieName,
        },
        series: [
          {
            name: '总体票房',
            type: 'bar',
            data: this.total,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
          },
        ],
      })
    },
  },
}
</script>
