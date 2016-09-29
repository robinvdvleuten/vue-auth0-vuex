/**
 * Link any user with the same email address.
 */
function linkUsers (user, context, done) {
  var Promise = require('bluebird@2.9.26'),
      request = require('request@2.56.0'),
      _ = require('lodash@3.10.1')

  // Check if email is verified, we shouldn't automatically
  // merge accounts if this is not the case.
  if (!user.email_verified) {
    return done(null, user, context)
  }

  request({
   url: auth0.baseUrl + '/users',
   headers: {
     Authorization: 'Bearer ' + auth0.accessToken
   },
   qs: {
     search_engine: 'v2',
     q: 'email:"' + user.email + '" AND email_verified:true -user_id:"' + user.user_id + '"'
   }
  }, function(err, response, body) {

    if (err) {
      return done(err)
    }

    if (response.statusCode !== 200) {
      return done(new Error(body))
    }

    var data = JSON.parse(body)

    if (data.length === 0) {
       // No users found, no need to process any further.
       return done(null, user, context)
    }

    async.each(data, function (targetUser, done) {

      var metadataCustomizer = function (objectValue, sourceValue) {
        if (_.isArray(objectValue)) {
          return _.uniq(sourceValue.concat(objectValue))
        }
      }

      var mergedAppMetadata = _.merge({}, targetUser.app_metadata, user.app_metadata, metadataCustomizer),
          mergedUserMetadata = _.merge({}, targetUser.user_metadata, user.user_metadata, metadataCustomizer)

      Promise.all([
          auth0.users.updateUserMetadata(user.user_id, mergedUserMetadata),
          auth0.users.updateAppMetadata(user.user_id, mergedAppMetadata)
        ])
        .then(function (result) {
          var provider = targetUser.user_id.split('|')[0],
              targetUserId = targetUser.user_id.split('|')[1]

          request.post({
            url: auth0.baseUrl + '/users/' + user.user_id + '/identities',
            headers: {
              Authorization: 'Bearer ' + auth0.accessToken
            },
            json: { provider: provider, user_id: targetUserId }
          }, function (err, response, body) {
            if (response.statusCode >= 400) {
              done(new Error('Error linking account: ' + response.statusMessage))
            }

            done(err)
          })
        })
        .catch(done)
    }, function () {
      done(null, user, context)
    })
  })
}
