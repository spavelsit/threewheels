const
  bcrypt  = require('bcryptjs'),
  jwt     = require('jsonwebtoken');

const
  config        = require('../common/config'),
  error_handler = require('../common/utils/error_handler'),
  User          = require('../models/User');

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    const pass_hash = bcrypt.compareSync(req.body.password, candidate.pass_hash);

    if (pass_hash) {
      const token = jwt.sign({
        email: candidate.email,
        user_id: candidate._id,
      }, config.jwt, {expiresIn: '1 days'});

      res.status(202).json({token: `Bearer ${token}`});
    } else {
      res.status(401).json({message: 'The data is not correct'});
    }
  } else {
    res.status(401).json({message: 'The data is not correct'});
  }
};

module.exports.register = async  (req, res) => {
  if (req.body.registry_key === config.registry_key) {
    const candidate = await User.findOne({email: req.body.email});

    if (!candidate) {
      const
        salt      = bcrypt.genSaltSync(10),
        pass_hash = bcrypt.hashSync(req.body.password, salt);

      const user = new User({
        email: req.body.email,
        pass_hash: pass_hash,
        full_name: req.body.fullname,
        status: req.body.status
      });
      try {
        await user.save();
        res.status(201).json(user);
      } catch (e) {
        error_handler(res, e);
      }
    } else {
      res.status(409).json({
        message: 'A user with this email already exists'
      })
    }
  } else {
    res.status(404).json({
      message: 'Not found'
    })
  }
};