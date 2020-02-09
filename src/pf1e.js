import Vue from 'vue'
import Pf1e from './Pf1e.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Pf1e),
}).$mount('#app')