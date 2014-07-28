# Passport-Disqus-OAuth

[Passport](http://passportjs.org/) strategies for authenticating with [Disqus](http://disqus.com/)
using OAuth 2.0.

This module lets you authenticate using Disqus in your Node.js applications.
By plugging into Passport, Disqus authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-disqus-oauth

## Configure Strategy

The Disqus OAuth 2.0 authentication strategy authenticates users using a Disqus
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new DisqusStrategy({
        clientID: DISQUS_API_KEY,
        clientSecret: DISQUS_API_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/disqus/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ disqusId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

## Authenticate Requests

Use `passport.authenticate()`, specifying the `'disqus'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/disqus',
      passport.authenticate('disqus'));

    app.get('/auth/disqus/callback', 
      passport.authenticate('disqus', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

This library has been adapted from [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth).
This documentation is also based on [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)'s
documentation.

## License

[The MIT License](http://opensource.org/licenses/MIT)
