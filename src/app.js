import Vue from 'vue'
import App from './App.vue'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
OfflinePluginRuntime.install()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')