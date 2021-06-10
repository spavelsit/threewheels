const
  mongoose  = require('mongoose'),
  {Strategy, ExtractJwt} = require('passport-jwt'),
  User      = mongoose.model('users');

const
  config = require('../config'),
  options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt
  };

module.exports = passport => {
  passport.use(new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.user_id).select('email id');

      if (user) done(null, user);
      else done(null, false);
    } catch (e) {
      console.log(e);
    }
  }))
};