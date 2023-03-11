<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <tab-bar v-if="$route.meta.showTabBar" />
  </div>
</template>

<script>
import TabBar from './components/TabBar/TabBar'
import 'mint-ui/lib/style.css'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getLocation, setWalking } from '@/common/utils/map'

// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'e54c7a18b8ed50190762e33196885c57',
}

export default {
  name: 'App',
  components: { TabBar },
  data() {
    return {
      AMap: null,
      flag: true
    }
  },
  mounted() {
    this.initAMap()
    setInterval(() => {
      getLocation(this.AMap)
    }, 1000 * 60 * 60 * 5)
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: '890e60b02e97f9681d403bbb577284c7',
        version: '2.0',
        plugins: [
          'AMap.Geolocation',
          'AMap.Walking'
        ],
      })
        .then((AMap) => {
          this.AMap = AMap
          getLocation(AMap)
          setWalking(AMap)
        })
        .catch((e) => {
          console.log('高德地图加载错误', e)
        })
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>
