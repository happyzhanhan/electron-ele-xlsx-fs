import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ExceltoText',
      component: require('@/components/ExceltoText').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
