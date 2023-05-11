<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'

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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
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

      this.chart.setOption({
        title: {
            text: '统计类型',
            // 控制标题位置
            x:'right',
            y:'top'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['剧情', '科幻', '动作', '爱情', '青春', '言情', '动漫', '恐怖', '冒险', '喜剧', '悬疑', '其它']
        },
        series: [
          {
            name: '类型统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '50%'],
            data: [
              { value: 320, name: '剧情' },
              { value: 240, name: '科幻' },
              { value: 149, name: '动作' },
              { value: 100, name: '爱情' },
              { value: 89, name: '青春' },
              { value: 67, name: '言情' },
              { value: 59, name: '动漫' },
              { value: 46, name: '恐怖' },
              { value: 38, name: '冒险' },
              { value: 27, name: '喜剧' },
              { value: 18, name: '悬疑' },
              { value: 7, name: '其它' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>