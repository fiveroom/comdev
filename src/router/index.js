import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dboard',
    name: 'dboard',
    component: () => import('@/components/DashBoard')
  },
  {
    path: '/dboardShow',
    name: 'dboardShow',
    component: () => import('@/components/DashBoardShow')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
