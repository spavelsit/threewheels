const
  jwt_strategy  = require('passport-jwt').Strategy,
  extract_jwt   = require('passport-jwt').ExtractJwt;

const
  mongoose  = require('mongoose'),
  User      = mongoose.model('users');

const
  config = require('../config'),
  options = {
    jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt
  };

module.exports = passport => {
  passport.use(new jwt_strategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.user_id).select('email id');

      if (user) done(null, user);
      else done(null, false);
    } catch (e) {
      console.log(e);
    }
  }))
};