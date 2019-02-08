import Vue from 'vue'
import VuePersist from 'vue-persist'

import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VuePersist)

new Vue({
  render: h => h(App),
}).$mount('#app')
