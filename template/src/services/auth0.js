import Auth0 from 'auth0-js'

if (Auth0.prototype.getTokenExpirationDate !== undefined || Auth0.prototype.isTokenExpired !== undefined) {
  throw new Error('Cannot add token expiration methods as it seems that they are already existing...');
}

Auth0.prototype.getTokenExpirationDate = function (token) {
  const decoded = this.decodeJwt(token)

  if (!decoded.exp) {
    return null
  }

  // The 0 here is the key, which sets the date to the epoch.
  const date = new Date(0)
  date.setUTCSeconds(decoded.exp)

  return date
}

Auth0.prototype.isTokenExpired = function (token) {
  const date = this.getTokenExpirationDate(token)
  const offsetSeconds = 0

  if (date === null) {
    return false
  }

  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
}

const auth0 = new Auth0({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  callbackOnLocationHash: true
})

export default auth0
