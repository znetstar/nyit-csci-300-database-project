import Vue from 'vue'
import Router from 'vue-router'
import InputThingy from "../components/db-app/InputThingy";
import ThingyList from "../components/db-app/ThingyList";
import Invoice from '../components/db-app/Invoice';
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/contract' },
    {
      path: '/contract',
      name: 'Contracts',
      component: ThingyList
    },
    {
      path: '/order',
      name: 'Orders',
      component: ThingyList
    },
    {
      path: '/contract/:id',
      name: 'Contracts',
      component: ThingyList
    },
    {
      path: '/order/:id',
      name: 'Orders',
      component: ThingyList
    },
    {
      path: '/invoice/:id',
      name: 'Invoice',
      component: Invoice
    }
  ]
})
