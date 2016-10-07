import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie';
import auth0 from './modules/auth0'

Vue.use(Vuex)

const store = new Store({
  modules: {
    auth0
  },
  plugins: [
    createPersistedState({
      paths: ['auth0.refreshToken'],
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
    })
  ]
})

export default store
