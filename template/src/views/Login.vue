<template>
  <div>
    <div v-if="error">
      \{{ error.message }}
    </div>

    <form @submit.prevent="onLoginSubmit">
      <div>
        <label>
          Email
          <input type="email" required v-model="email" />
        </label>
        <label>
          Password
          <input type="password" required v-model="password" />
        </label>
      </div>

      <div>
        <button type="submit">
          Login
        </button>
        <button type="button" @click="onLoginProviderClick('google-oauth2')">
          Login with Google
        </button>
        <button type="button" @click="onLoginProviderClick('github')">
          Login with Github
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Login',
    data () {
      return {
        email: null,
        password: null
      }
    },
    computed: mapState({
      error: (state) => state.auth0.error,
      isAuthenticating: (state) => state.auth0.isAuthenticating
    }),
    methods: {
      onLoginProviderClick (connection) {
        if (this.isAuthenticating) {
          return
        }

        this.$store.dispatch('AUTH0_LOGIN', {
          connection,
          callbackURL: window.location.href
        })
        .catch(() => {})
      },
      onLoginSubmit() {
        if (this.isAuthenticating) {
          return
        }

        this.$store.dispatch('AUTH0_LOGIN', {
          connection: 'Username-Password-Authentication',
          email: this.email,
          password: this.password,
          sso: false
        })
        .then(() => {
          this.$router.push({ name: 'index' })
        })
      }
    },
    created () {
      if (window.location.hash) {
        this.$store.dispatch('AUTH0_PARSE_HASH', window.location.hash)
          .then(() => {
            this.$router.push({ name: 'index' })
          })
      }
    }
  }
</script>
