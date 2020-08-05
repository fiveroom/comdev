import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueDragResize from 'vue-drag-resize'
import VCharts from 'v-charts'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(VCharts);
Vue.use(ElementUI);

Vue.component('VueDragResize', VueDragResize);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
