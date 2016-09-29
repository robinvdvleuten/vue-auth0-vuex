<template>
  <div>
    <span v-if="!profile">Loading your Auth0 profile...</span><span v-else>{{ profile.email }}</span> (<router-link :to="{ name: 'logout' }">logout</router-link>)
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Dashboard',
    computed: mapState({
      profile: (state) => state.auth0.profile
    }),
    created () {
      this.$store.dispatch('AUTH0_GET_PROFILE')
    }
  }
</script>
