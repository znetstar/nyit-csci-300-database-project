// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
// import {
//   MdButton,
//   MdContent,
//   MdTabs,
//   MdDrawer,
//   MdIcon,
//   MdList,
//   MdToolbar,
//   MdDialog,
//   MdTable,
//   MdField,
//   MdAutocomplete,
//   MdSnackbar,
//   MdMenu,
//   MdDatepicker,
//   // MdSelect,
//   MdApp,
//   MdCard
// } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import ThingyEditor from './components/db-app/ThingyEditor';
import NotifyBar from './components/db-app/NotifyBar';
import InputThingy from './components/db-app/InputThingy';
import Invoice from './components/db-app/Invoice';

Vue.config.productionTip = false

Vue.use(VueMaterial)
// Vue.use(MdButton)
// Vue.use(MdContent)
// Vue.use(MdTabs)
// Vue.use(MdDrawer)
// Vue.use(MdIcon)
// Vue.use(MdAutocomplete)
// Vue.use(MdList)
// Vue.use(MdToolbar)
// Vue.use(MdTable)
// Vue.use(MdMenu)
// Vue.use(MdDatepicker);
// Vue.use(MdDialog)
// Vue.use(MdField)
// Vue.use(MdSnackbar);
// Vue.use(MdApp);
// Vue.use(MdCard);
// Vue.use(MdSelect);
Vue.component('NotifyBar', NotifyBar)
Vue.component('ThingyEditor', ThingyEditor)
Vue.component('InputThingy', InputThingy);
Vue.component('Invoice', Invoice);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App, ThingyEditor, NotifyBar, InputThingy, Invoice }
})

