/**
 * Check if the user has verified it's email address.
 */
function verifiedEmail (user, context, done) {
  if (!user.email_verified) {
    return done(new UnauthorizedError('You must verify your email before you can login.'))
  }

  done(null, user, context)
}
