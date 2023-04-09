// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import App from './App'
import { router } from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import './assets/css/styles.css'
import './assets/css/admin.css'
import './assets/css/login.css'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
// Vue Swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.config.productionTip = false

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.use(VueAwesomeSwiper)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)
Vue.use(VeeValidate)

Vue.component('v-select', vSelect)

Vue.prototype.$api_url = 'http://127.0.0.1:8800/'
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',

  data () {
    return {
    }
  }

})
