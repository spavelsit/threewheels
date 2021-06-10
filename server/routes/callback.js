const
  router    = require('express').Router(),
  passport  = require('passport');

const controller = require('../controllers/callback');

router.get('/', passport.authenticate('jwt', {session: false}), controller.all_callback);

router.post('/', controller.create_callback);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update_callback);

module.exports = router;