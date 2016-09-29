import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import auth0 from './modules/auth0'

Vue.use(Vuex)

const store = new Store({
  modules: {
    auth0
  },
  plugins: [
    createPersistedState({ paths: ['auth0.idToken'] })
  ]
})

export default store
