const
  Order         = require('../models/Order'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_order = async (req, res) => {
  const query = {};

  if (req.query.start) {
    query.date = {
      $gte: req.query.start
    }
  }

  if (req.query.end) {
    if (!query.date) query.date = {};
    query.date['$lte'] = req.query.end;
  }
  if (req.query.order) {query.order = +req.query.order}

  try {
    const orders = await  Order.find(query).sort({order: -1}).skip(+req.query.offset).limit(+req.query.limit);
    res.status(200).json(orders);
  } catch (e) {
    error_handler(res, e);
  }

};

module.exports.create_order = async (req, res) => {
  try {
    const
      last_order = await Order.find().sort({order: -1}).limit(1);
      max_order  = last_order[0] ? last_order[0].order : 0;

      console.log(max_order.order);
    const order = await new Order({
      order: max_order + 1,
      sale: req.body.sale,
      mechanic: req.body.mechanic,
      percent: req.body.percent,
      list: req.body.list,
    }).save();

    res.status(201).json(order);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.update_order = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );

    res.status(202).json(order);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.remove_order = async (req, res) => {
  try {
    await Order.remove({_id: req.params.id});
    res.status(202);
  } catch (e) {
    error_handler(res, e);
  }
};