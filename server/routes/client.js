const
  router    = require('express').Router(),
  passport  = require('passport');

const controller = require('../controllers/client');

router.get('/', passport.authenticate('jwt', {session: false}), controller.all_client);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create_client);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update_client);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove_client);

module.exports = router;