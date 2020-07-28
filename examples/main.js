import Vue from 'vue'
import App from 'examples/App.vue'
import './plugins/element'
import PdfViewer from 'packages/index'

Vue.use(PdfViewer)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
