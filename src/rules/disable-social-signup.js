/**
 * Disable signup when authenticating non-existing through social provider.
 */
function disableSocialSignup (user, context, done) {
  // If the only identity of the user is a social one, block it.
  if (user.identities.length === 1 && user.identities[0].isSocial) {
    return done('Signup through OAuth2 is disabled')
  }

  // else it is a non social login and user has already signed up.
  done(null, user, context)
}
