const
  Position      = require('../models/Position'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_positions = async (req, res) => {
  try {
    const positions = await Position.find({type: req.params.type.trim()}).sort({quantity: -1}).skip(+req.query.offset).limit(+req.query.limit);
    res.status(200).json(positions);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.create_position = async (req, res) => {
  try {
    const position = await new Position({
      name: req.body.name.trim(),
      article: req.body.article.trim(),
      cost: req.body.cost,
      orderCost: req.body.orderCost,
      quantity: req.body.quantity,
      type: req.body.type.trim(),
    }).save();

    res.status(201).json(position)
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.remove_position = async (req, res) => {
  try {
    await Position.remove({_id: req.params.id});
    res.status(202).json({status: true});
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.update_position = async (req, res) => {
  try {
    const position = await Position.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );

    res.status(202).json(position);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.update_quantity_position = async (req, res) => {
  try {
    for(const el of req.body.list) {
      await Position.updateOne(
        {_id: el._id},
        {$inc: {quantity: req.body.type === 'add' ? el.quantity : -el.quantity}},
        {new: true}
      );
    }
    
    res.status(202).json({status: true});
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.qr_code_position = async (req, res) => {
  try {
    const position = await Position.findOne({_id: req.params.id});
    res.status(200).json(position);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.search_positions = async (req, res) => {
  try {
    const positions = await Position.find(
      {$or: [
        {name: {$regex: req.query.text.trim(), $options: 'i'}},
        {article: {$regex: req.query.text.trim(),  $options: 'i'}},
      ]}
    ).limit(30);
    res.status(200).json(positions);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.calc_price_positions = async (req, res) => {
  try {
    const positions = await Position.find({type: 'product'})
    const total_price = positions.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0);

    res.status(200).json({status: true, total_price })
  } catch (e) {
    error_handler(res, e);
  }
};