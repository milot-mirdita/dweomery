import Vue from 'vue'
import Pf2e from './Pf2e.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Pf2e),
}).$mount('#app')