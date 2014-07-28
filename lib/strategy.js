/**
 * Module dependencies.
 */
var util = require('util')
  , oauth2 = require('passport-oauth2')
  , OAuth2Strategy = oauth2.Strategy
  , InternalOAuthError = oauth2.InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Disqus authentication strategy authenticates requests by delegating to
 * Disqus using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Disqus application's api key
 *   - `clientSecret`  your Disqus application's api secret
 *   - `callbackURL`   URL to which Disqus will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new DisqusStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/disqus/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://disqus.com/api/oauth/2.0/authorize/';
  options.tokenURL = options.tokenURL || 'https://disqus.com/api/oauth/2.0/access_token/';
  options.scopeSeparator = options.scopeSeparator || ','

  this._clientID = options.clientID;
  this._clientSecret = options.clientSecret;
  OAuth2Strategy.call(this, options, verify);
  this.name = 'disqus';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Disqus.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `disqus`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = 'https://disqus.com/api/3.0/users/details.json?' +
    'api_secret=' + encodeURIComponent(this._clientSecret) +
    '&api_key=' + encodeURIComponent(this._clientID);

  this._oauth2.get(url, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'disqus' };
      profile.id = json.response.id;
      profile.displayName = json.response.name;
      profile.username = json.response.username;
      profile.emails = [{ value: json.response.email }];

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
