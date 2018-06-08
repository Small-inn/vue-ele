import Vue from 'vue'
import Router from 'vue-router'
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'
import Seller from 'components/seller/seller'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/goods'
  }, {
    path: '/goods',
    component: Goods
  }, {
    path: '/ratings',
    component: Ratings
  }, {
    path: '/seller',
    component: Seller
  }]
})

router.beforeEach((to, from, next) => {
  next()
  document.title = 'ele-mock'
  window.scroll(0, 0)
})

export default router
