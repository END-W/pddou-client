// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import cookies from 'vue-cookies'
import '@/common/icons' // icon
import '@/permission'
// 配置字体图标
import "@/common/css/style.css"
Vue.config.productionTip = false

Vue.prototype.$cookies = cookies

Vue.use(cookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
