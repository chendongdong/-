import Vue from 'vue'
import App from './App.vue'
import '../src/style/common.css'
import store from './store'
// import eruda from 'eruda'
// eruda.init()
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
