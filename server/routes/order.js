const
  router    = require('express').Router(),
  passport  = require('passport');

const controller = require('../controllers/order');

router.get('/', passport.authenticate('jwt', {session: false}), controller.all_order);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create_order);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update_order);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove_order);

module.exports = router;