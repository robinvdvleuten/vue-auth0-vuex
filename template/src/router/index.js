import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const requiresAnon = (route, redirect, next) => {
  if (store.getters.isAuthenticated) {
    return redirect({ name: 'index' })
  }

  next()
}

const requiresAuth = (route, redirect, next) => {
  if (!store.getters.isAuthenticated || store.getters.isTokenExpired) {
    return store.dispatch('AUTH0_LOGOUT').then(() => redirect({ name: 'login' }))
  }

  next()
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'index', component: Dashboard, beforeEnter: requiresAuth, children: [
      { path: 'logout', name: 'logout', beforeEnter: (route, redirect) => { store.dispatch('AUTH0_LOGOUT'); redirect('/login') }}
    ]},
    { path: '/login', name: 'login', component: Login, beforeEnter: requiresAnon },
  ]
})

export default router
