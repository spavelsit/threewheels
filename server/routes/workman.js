const
  router    = require('express').Router(),
  passport  = require('passport');

const controller = require('../controllers/workman');

router.get('/', passport.authenticate('jwt', {session: false}), controller.all_workman);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create_workman);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update_workman);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove_workman);

module.exports = router;