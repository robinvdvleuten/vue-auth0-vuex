import Vue from 'vue'
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  render: (createElement) => (
    // Render wrapped <router-view> component.
    createElement('div', { attrs: { id: 'app' }}, [createElement('router-view')])
  )
})
