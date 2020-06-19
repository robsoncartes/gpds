import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },

  {
    path: '/',
    name: 'home',
    component: () => import('../views/MainHome.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!window.uid && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})

export default router