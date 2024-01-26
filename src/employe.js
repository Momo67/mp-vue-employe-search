import Vue from 'vue'
import './plugins/axios'
import EmployeSearch from './components/EmployeSearch.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  vuetify,
  i18n,
  render: h => h(EmployeSearch)
}).$mount('#app')
