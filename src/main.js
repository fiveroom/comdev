import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueDragResize from 'vue-drag-resize'

Vue.config.productionTip = false

Vue.component('vue-drag-resize', VueDragResize)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
