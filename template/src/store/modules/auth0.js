import auth0 from '../../services/auth0'

const state = {
  error: null,
  idToken: null,
  isAuthenticating: false,
  profile: null,
  refreshToken: null
}

const mutations = {
  AUTH0_LOGIN_REQUEST: (state) => {
    state.isAuthenticating = true
  },

  AUTH0_LOGIN_FAILURE: (state, { error }) => {
    state.error = error
    state.isAuthenticating = false
  },

  AUTH0_LOGIN_SUCCESS: (state, { idToken, refreshToken }) => {
    state.idToken = idToken
    state.refreshToken = refreshToken
    state.error = null
    state.isAuthenticating = false
  },

  AUTH0_LOGOUT: (state) => {
    state.idToken = null
  },

  AUTH0_REFRESH_TOKEN_SUCCESS: (state, { id_token }) => {
    state.idToken = id_token
  },

  AUTH0_GET_PROFILE_FAILURE: (state, { error }) => {
    state.error = error
  },

  AUTH0_GET_PROFILE_SUCCESS: (state, { profile }) => {
    state.profile = profile
    state.error = null
  }
}

const actions = {
  AUTH0_LOGIN: ({ commit, state }, options) => {
    return new Promise((resolve, reject) => {
      commit('AUTH0_LOGIN_REQUEST')

      auth0.login(options, (err, result) => {
        if (err) {
          commit('AUTH0_LOGIN_FAILURE', { error: { error: err.details.error, message: err.details.error_description }})
          return reject(err)
        }

        commit('AUTH0_LOGIN_SUCCESS', result)
        resolve()
      })
    })
  },
  AUTH0_LOGOUT: ({ commit }) => {
    commit('AUTH0_LOGOUT')
    return Promise.resolve()
  },
  AUTH0_PARSE_HASH: ({ commit }, hash) => {
    const result = auth0.parseHash(hash)
    // Remove the hash from the URL.
    window.location.hash = ' '

    if (!result) {
      return Promise.reject()
    }

    if (result.error) {
      commit('AUTH0_LOGIN_FAILURE', { error: { error: result.error, message: result.error_description }})
      return Promise.reject(result.error)
    }

    commit('AUTH0_LOGIN_SUCCESS', result)
    return Promise.resolve()
  },
  AUTH0_REFRESH_TOKEN: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      commit('AUTH0_REFRESH_TOKEN_REQUEST')

      auth0.refreshToken(state.refreshToken, (err, result) => {
        if (err) {
          commit('AUTH0_REFRESH_TOKEN_FAILURE', { error: { error: err.details.error, message: err.details.error_description }})
          return reject(err)
        }

        commit('AUTH0_REFRESH_TOKEN_SUCCESS', result)
        resolve()
      })
    })
  },
  AUTH0_GET_PROFILE: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      if (state.profile) {
        // Do not load profile if it already exists in state.
        return resolve()
      }

      commit('AUTH0_GET_PROFILE_REQUEST')

      auth0.getProfile(state.idToken, (err, profile) => {
        if (err) {
          if (err.error === 401) {
            return dispatch('AUTH0_LOGOUT')
          }

          commit('AUTH0_GET_PROFILE_FAILURE', { error: err })
          return reject(err)
        }

        commit('AUTH0_GET_PROFILE_SUCCESS', { profile })
        return resolve()
      })
    })
  }
}

const getters = {
  isAuthenticated: (state) => typeof state.idToken === 'string',
  isTokenExpired: (state) => auth0.isTokenExpired(state.idToken)
}

export default {
  state,
  mutations,
  actions,
  getters
}
