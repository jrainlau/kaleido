import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Preload from './views/Preload.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/preload',
      name: 'Preload',
      component: Preload
    }
  ]
})
