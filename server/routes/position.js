const
  router    = require('express').Router(),
  passport  = require('passport');

const controller = require('../controllers/position');

router.get('/total', passport.authenticate('jwt', {session: false}), controller.calc_price_positions);
router.get('/search', passport.authenticate('jwt', {session: false}), controller.search_positions);
router.get('/:type', passport.authenticate('jwt', {session: false}), controller.all_positions);

router.get('/qr_code/:id', passport.authenticate('jwt', {session: false}), controller.qr_code_position);

router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update_position);
router.post('/quantity', passport.authenticate('jwt', {session: false}), controller.update_quantity_position);

router.post('/', passport.authenticate('jwt', {session: false}), controller.create_position);

router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove_position);

module.exports = router;